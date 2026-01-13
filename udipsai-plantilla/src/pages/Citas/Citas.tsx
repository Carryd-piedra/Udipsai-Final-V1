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
  const [modalInitialDate, setModalInitialDate] = useState("");
  const [modalInitialTime, setModalInitialTime] = useState("");

  const [specialties, setSpecialties] = useState<any[]>([]);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<number | string>("");
  const [loading, setLoading] = useState(false);

  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    loadSpecialties();
    loadEvents();
  }, []);

  useEffect(() => {
    loadEvents();
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
    setLoading(true);
    try {
      let data;

      if (selectedSpecialtyId) {
        // Fetch by specialty (large page size)
        const response = await citasService.obtenerPorEspecialidad(Number(selectedSpecialtyId), 0, 500);
        console.log("Raw response (Specialty):", response);
        data = response.content || [];
      } else {
        // Fetch all (large page size)
        const response = await citasService.listar(0, 500);
        console.log("Raw response (All):", response);
        data = response.content || [];
      }
      console.log("Data to map:", data);

      const mappedEvents: CalendarEvent[] = data.map((cita: any) => {
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
            calendar: getStatusColor(cita.estado)
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
      case 'PENDIENTE': return 'Warning'; // Orange/Yellow
      case 'FINALIZADA': return 'Success'; // Green
      case 'CANCELADA': return 'Danger'; // Red
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

    setModalInitialDate(selectInfo.startStr.split("T")[0]);
    // Extract time if available, otherwise default to empty or "08:00"
    const timePart = selectInfo.startStr.includes("T") ? selectInfo.startStr.split("T")[1].substring(0, 5) : "08:00";
    setModalInitialTime(timePart);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    // For now, minimal support for editing existing events using the same modal logic
    // Ideally we would populate the modal with the event's data
    const event = clickInfo.event;
    setModalInitialDate(event.start?.toISOString().split("T")[0] || "");
    const timePart = event.start?.toISOString().includes("T") ? event.start?.toISOString().split("T")[1].substring(0, 5) : "08:00";
    setModalInitialTime(timePart);
    openModal();
  };

  const handleSaveCita = () => {
    // Refresh events or add the new one to the list
    // Ideally fetch from backend
    closeModal();
    loadEvents();
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
                <option value="">Todas las Especialidades</option>
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
          </div>

          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={esLocale}
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek",
            }}
            events={events}
            selectable
            select={handleDateSelect}
            selectAllow={(selectInfo) => {
              // Allow month view selection (which is allDay) to trigger view change
              if (selectInfo.allDay) return true;

              // Calculate duration in milliseconds
              const duration = selectInfo.end.getTime() - selectInfo.start.getTime();
              // Allow only if duration is exactly 1 hour (3600000 ms)
              return duration <= 3600000;
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
                  setModalInitialDate(new Date().toISOString().split("T")[0]);
                  setModalInitialTime("08:00");
                  openModal();
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
        onSave={handleSaveCita}
        fixedSpecialtyId={selectedSpecialtyId ? Number(selectedSpecialtyId) : undefined}
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
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
