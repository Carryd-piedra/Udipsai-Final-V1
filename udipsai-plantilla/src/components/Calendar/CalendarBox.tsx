import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { citasService } from '../../services/citas';
import { especialistasService } from '../../services/especialistas';
import CitaInfoModal from '../modals/CitaInfoModal';

const CalendarBox = () => {
    const { userIdentity } = useAuth();
    const [events, setEvents] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchCitas = async () => {
            try {
                let citasData: any[] = [];
                let especialistaId = null;

                if (userIdentity) {
                    const especialistaResponse = await especialistasService.filtrar({ search: userIdentity });
                    if (especialistaResponse && especialistaResponse.content && especialistaResponse.content.length > 0) {
                        especialistaId = especialistaResponse.content[0].id;
                    }
                }

                if (especialistaId) {
                    console.log("Cargando citas para especialista ID:", especialistaId);
                    const response = await citasService.obtenerPorProfesional(especialistaId);
                    citasData = response.content || [];
                } else {
                    console.log("No se identificó especialista, cargando todas las citas (Admin/Secretaria)");
                    const response = await citasService.listar();
                    citasData = response.content || [];
                }

                console.log("Datos crudos de citas cargadas:", citasData); // Debug log

                const parseDate = (dateStr: string) => {
                    if (!dateStr) return '';
                    const parts = dateStr.split('-');
                    if (parts.length === 3) {
                        return `${parts[2]}-${parts[1]}-${parts[0]}`;
                    }
                    return dateStr;
                };

                const formattedEvents = citasData.map((cita: any) => {
                    // Use classNames for better control with Tailwind
                    let classNames = ['text-white', 'border-0'];

                    if (cita.estado === 'FINALIZADA' || cita.estado === 'ASISTIDO') {
                        classNames.push('!bg-green-500', '!border-green-500');
                    } else if (cita.estado === 'CANCELADA') {
                        classNames.push('!bg-red-500', '!border-red-500');
                    } else if (cita.estado === 'FALTA_JUSTIFICADA') {
                        classNames.push('!bg-orange-500', '!border-orange-500');
                    } else if (cita.estado === 'FALTA_INJUSTIFICADA' || cita.estado === 'NO_ASISTIDO') {
                        classNames.push('!bg-red-500', '!border-red-500');
                    } else {
                        classNames.push('!bg-blue-500', '!border-blue-500'); // Default Pendiente
                    }

                    const fechaISO = parseDate(cita.fecha);

                    return {
                        id: cita.citaId || cita.id,
                        title: `${cita.horaInicio ? cita.horaInicio.substring(0, 5) : ''} - ${cita.paciente?.nombresApellidos || 'Paciente'}`,
                        start: `${fechaISO}T${cita.horaInicio}`,
                        end: `${fechaISO}T${cita.horaFin}`,
                        classNames: classNames, // Pass classNames instead of inline styles
                        textColor: '#ffffff',
                        extendedProps: {
                            originalId: cita.citaId || cita.id,
                            status: cita.estado,
                            specialty: cita.especialidad?.area || cita.especialidad?.nombre || "General",
                            specialist: cita.especialista?.nombresApellidos || "Sin Asignar",
                            paciente: cita.paciente,
                            fullDate: cita.fecha,
                            fullTimeCheck: `${cita.horaInicio} - ${cita.horaFin}`
                        }
                    };
                });

                setEvents(formattedEvents);
            } catch (error) {
                console.error("Error loading calendar events:", error);
            }
        };

        fetchCitas();
    }, [userIdentity, isModalOpen]); // Reload when modal closes to refresh status

    const handleEventClick = (info: any) => {
        const eventData = {
            id: info.event.id,
            title: info.event.title,
            start: info.event.start,
            end: info.event.end,
            extendedProps: { ...info.event.extendedProps }
        };
        console.log("Evento seleccionado:", eventData);
        setSelectedEvent(eventData);
        setIsModalOpen(true);
    };

    const handleMarkAsAttended = async (id: string) => {
        try {
            await citasService.finalizar(id);
            // Refresh logic handled by useEffect dependency
        } catch (error) {
            console.error("Error marking as attended", error);
        }
    };

    const handleMarkAsNotAttended = async (id: string) => {
        try {
            await citasService.marcarFalta(id);
            // Refresh logic handled by useEffect dependency
        } catch (error) {
            console.error("Error marking as not attended", error);
        }
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white/90">
                Calendario de Citas
            </h3>

            <div className="calendar-container [&_.fc-button]:bg-blue-600 [&_.fc-button]:border-blue-600 [&_.fc-button:hover]:bg-blue-700 [&_.fc-button-active]:bg-blue-800 [&_.fc-toolbar-title]:text-lg [&_.fc-toolbar-title]:font-bold [&_.fc-col-header-cell]:bg-gray-100 [&_.fc-col-header-cell]:py-3 [&_.fc-col-header-cell]:dark:bg-gray-800 [&_.fc-daygrid-day]:dark:bg-transparent [&_.fc-scrollgrid]:dark:border-gray-700 [&_.fc-theme-standard_td]:dark:border-gray-700 [&_.fc-theme-standard_th]:dark:border-gray-700 [&_.fc-event]:cursor-pointer [&_.fc-event]:shadow-sm [&_.fc-event]:border-0 [&_.fc-event-title]:font-semibold">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                    }}
                    height="auto"
                    events={events}
                    editable={false}
                    selectable={true}
                    dayMaxEvents={true}
                    eventClick={handleEventClick}
                    buttonText={{
                        today: 'Hoy',
                        month: 'Mes',
                        week: 'Semana',
                        day: 'Día',
                        list: 'Lista'
                    }}
                    locale="es"
                    locales={[esLocale]}
                    displayEventTime={false}
                />
            </div>

            <CitaInfoModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedEvent(null);
                }}
                cita={selectedEvent}
                onMarkAsAttended={handleMarkAsAttended}
                onMarkAsNotAttended={handleMarkAsNotAttended}
            />
        </div>
    );
};

export default CalendarBox;
