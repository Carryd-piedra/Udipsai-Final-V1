import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import esLocale from '@fullcalendar/core/locales/es';
import { useModal } from "../../hooks/useModal";
import PageMeta from "../../components/common/PageMeta";
import CitaModal from "../../components/modals/CitaModal";
import CitaInfoModal from "../../components/modals/CitaInfoModal";
import { especialidadesService } from "../../services/especialidades";
import { citasService } from "../../services/citas";
import { toast } from "react-hot-toast";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentView, setCurrentView] = useState("dayGridMonth"); // Track current view
  const [modalInitialDate, setModalInitialDate] = useState("");
  const [modalInitialTime, setModalInitialTime] = useState("");
  const [modalInitialDuration, setModalInitialDuration] = useState(1);

  const [specialties, setSpecialties] = useState<any[]>([]);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<number | string>("");
  const [loading, setLoading] = useState(false);

  // Info Modal State
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Rescheduling State
  const [reschedulingId, setReschedulingId] = useState<string | number | undefined>(undefined);
  const [initialPatient, setInitialPatient] = useState<any>(null);
  const [initialSpecialist, setInitialSpecialist] = useState<any>(null);

  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    loadSpecialties();
    loadEvents();
  }, []);

  useEffect(() => {
    loadEvents();
  }, [selectedSpecialtyId]);

  // Auto-refresh events every 4 hours (or configurable)
  useEffect(() => {
    if (!selectedSpecialtyId) return;

    const intervalId = setInterval(() => {
      console.log("Auto-refreshing events...");
      loadEvents();
    }, 4 * 60 * 60 * 1000); // 4 hours in milliseconds

    return () => clearInterval(intervalId);
  }, [selectedSpecialtyId]);

  const loadSpecialties = async () => {
    try {
      const data = await especialidadesService.listarActivos();
      setSpecialties(Array.isArray(data) ? data : data.content || []);
    } catch (error) {
      console.error("Error loading specialties", error);
    }
  };

  const loadEvents = async () => {
    if (!selectedSpecialtyId) {
      setEvents([]); // Clear events if no specialty selected
      return;
    }

    setLoading(true);
    try {
      let data;

      if (selectedSpecialtyId) {
        // Fetch by specialty (large page size)
        const response = await citasService.obtenerPorEspecialidad(Number(selectedSpecialtyId), 0, 500);
        console.log("Raw response (Specialty):", response);
        data = response.content || [];
      } else {
        // Should not happen due to guard clause but keep as fallback logic logic
        data = [];
      }
      console.log("Data to map:", data);

      // DEBUG: Inspect status of first few items
      if (data && data.length > 0) {
        console.log("SAMPLE ITEM STATUS:", data[0].estado);
        data.forEach((d: any) => console.log(`Cita ${d.citaId} status: ${d.estado}`));
      }

      const mappedEvents: CalendarEvent[] = data
        .filter((cita: any) => cita.estado !== 'CANCELADA')
        .map((cita: any) => {
          // Parse date dd-MM-yyyy
          const [day, month, year] = cita.fecha.split('-').map(Number);
          // Create date string yyyy-MM-dd
          const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

          return {
            id: cita.citaId?.toString(),
            title: cita.paciente?.nombresApellidos || "Sin Nombre",
            start: `${dateStr}T${cita.horaInicio}:00`,
            end: `${dateStr}T${cita.horaFin}:00`,
            extendedProps: {
              calendar: getStatusColor(cita.estado),
              specialty: cita.especialidad?.area || cita.especialidad?.nombre || "General",
              specialist: cita.especialista?.nombresApellidos || "Sin Asignar",
              status: cita.estado,
              profesionalId: cita.especialista?.id,
              fichaPaciente: cita.paciente?.id,
              especialidadId: cita.especialidad?.id
            }
          };
        });
      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error loading events", error);
      toast.error("Error al cargar citas");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDIENTE': return 'Warning'; // Orange
      case 'FINALIZADA': return 'Success'; // Green
      case 'NO_JUSTIFICADA': return 'Danger'; // Red
      case 'CANCELADA': return 'Danger'; // Red (Filtered out usually)
      default: return 'Primary';
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    // Check current view type
    if (selectInfo.view.type === 'dayGridMonth') {
      const calendarApi = selectInfo.view.calendar;
      calendarApi.changeView('timeGridWeek', selectInfo.startStr);
      return; // Don't open modal
    }

    if (!selectedSpecialtyId) {
      toast.error("Seleccione una especialidad primero");
      return;
    }

    setModalInitialDate(selectInfo.startStr.split("T")[0]);
    // Extract time if available, otherwise default to empty or "08:00"
    const timePart = selectInfo.startStr.includes("T") ? selectInfo.startStr.split("T")[1].substring(0, 5) : "08:00";
    setModalInitialTime(timePart);

    // Calculate duration in hours
    const durationMs = selectInfo.end.getTime() - selectInfo.start.getTime();
    const durationHours = Math.round(durationMs / 3600000);
    setModalInitialDuration(durationHours > 0 ? durationHours : 1);

    // Reset rescheduling state
    setReschedulingId(undefined);
    setInitialPatient(null);
    setInitialSpecialist(null);

    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    // Create a plain object to avoid FullCalendar internal object issues in State/Render
    const plainEvent = {
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      extendedProps: { ...clickInfo.event.extendedProps }
    };
    setSelectedEvent(plainEvent);
    setShowInfoModal(true);
  };

  const handleSaveCita = () => {
    closeModal();
    loadEvents();
  };

  const handleDeleteCita = async (id: string) => {
    try {
      await citasService.eliminar(id);
      toast.success("Cita cancelada exitosamente");
      // Refresh
      loadEvents();
    } catch (error) {
      console.error("Error deleting cita", error);
      toast.error("No se pudo cancelar la cita");
      throw error; // Let modal handle loading state closure
    }
  };

  const handleRescheduleCita = async (id: string) => {
    try {
      setLoading(true);
      const cita = await citasService.obtenerPorId(id);

      setShowInfoModal(false);
      setReschedulingId(id);

      // Populate modal data
      // Date and Time
      const [day, month, year] = cita.fecha.split('-').map(Number);
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      setModalInitialDate(dateStr);
      setModalInitialTime(cita.horaInicio.substring(0, 5));

      // Calculate Duration
      // Backend provides horaInicio and horaFin.
      const startH = parseInt(cita.horaInicio.split(':')[0]);
      const endH = parseInt(cita.horaFin.split(':')[0]);
      const duration = endH - startH;
      setModalInitialDuration(duration > 0 ? duration : 1);

      setInitialPatient(cita.paciente); // Assuming DTO structure from backend
      setInitialSpecialist(cita.especialista); // Assuming DTO structure

      openModal();
    } catch (error) {
      console.error("Error fetching cita for reschedule", error);
      toast.error("Error al cargar datos para reagendar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Gestión de Citas | UDIPSAI"
        description="Calendario de citas para especialistas y pacientes"
      />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] min-w-0">
        <div className="w-fit min-w-full rounded-xl border border-gray-200 bg-white p-4">

          <div className="mb-4 flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtrar por Especialidad:
            </label>
            <div className="relative">
              <select
                value={selectedSpecialtyId}
                onChange={(e) => setSelectedSpecialtyId(e.target.value)}
                className="appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-base font-medium text-gray-700 shadow-sm transition hover:border-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              >
                <option value="">-- Seleccione una Especialidad --</option>
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.area || spec.nombre}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {loading && <span className="text-sm text-gray-500">Cargando...</span>}
            {!selectedSpecialtyId && <span className="text-sm text-amber-600 font-medium ml-2">← Requerido</span>}
          </div>

        </div>

        <div className={`transition-all duration-300 ${!selectedSpecialtyId ? 'opacity-40 pointer-events-none grayscale filter' : ''}`}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={esLocale}
            headerToolbar={{
              left: currentView === 'timeGridWeek' ? "prev,next" : "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek",
            }}
            datesSet={(arg) => setCurrentView(arg.view.type)}
            events={events}
            selectable
            select={handleDateSelect}
            selectAllow={(selectInfo) => {
              if (!selectedSpecialtyId) return false;
              // Allow month view selection (which is allDay) to trigger view change
              if (selectInfo.allDay) return true;

              // Prevent past dates STRICTLY
              const now = new Date();
              if (selectInfo.start < now) return false;

              // Only limit: Cannot span multiple days
              const startDay = selectInfo.start.getDate();
              const endDay = selectInfo.end.getDate();
              if (startDay !== endDay && !selectInfo.allDay) return false;

              // Relax duration check to allow > 1 hour
              return true;
            }}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            slotDuration="01:00:00"
            snapDuration="01:00:00"
            slotMinTime="08:00:00"
            slotMaxTime="17:00:00"
            allDaySlot={false}
            contentHeight="auto"
            height="auto"
            hiddenDays={[0, 6]}
            businessHours={[
              { daysOfWeek: [1, 2, 3, 4, 5], startTime: "08:00", endTime: "12:00" },
              { daysOfWeek: [1, 2, 3, 4, 5], startTime: "13:00", endTime: "17:00" },
            ]}
            customButtons={{
              addEventButton: {
                text: "Agendar Cita +",
                click: () => {
                  if (!selectedSpecialtyId) {
                    toast.error("Seleccione una especialidad primero");
                    return;
                  }

                  const calendarApi = calendarRef.current?.getApi();
                  calendarApi?.changeView("timeGridWeek");
                },
              },
            }}
          />
        </div>
      </div>
      <CitaModal
        isOpen={isOpen}
        onClose={closeModal}
        initialDate={modalInitialDate}
        initialTime={modalInitialTime}
        initialDuration={modalInitialDuration}
        onSave={handleSaveCita}
        fixedSpecialtyId={selectedSpecialtyId ? Number(selectedSpecialtyId) : undefined}
        appointmentId={reschedulingId}
        initialPatient={initialPatient}
        initialSpecialist={initialSpecialist}
      />

      <CitaInfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        cita={selectedEvent}
        onDelete={handleDeleteCita}
        onReschedule={handleRescheduleCita}
      />
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const colorClass = eventInfo.event.extendedProps.calendar
    ? `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`
    : 'fc-bg-primary';

  return (
    <div
      className={`event-fc-color flex flex-col fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="flex items-center">
        <div className="fc-daygrid-event-dot"></div>
        <div className="fc-event-time !font-extrabold !text-gray-900">{eventInfo.timeText}</div>
      </div>
      <div className="fc-event-title font-medium !text-gray-900">{eventInfo.event.title}</div>
      <div className="text-[10px] uppercase tracking-wide opacity-90 mt-0.5 !text-gray-700">
        {eventInfo.event.extendedProps.status}
      </div>
    </div>
  );
};

export default Calendar;
