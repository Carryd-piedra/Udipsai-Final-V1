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

// Icons for the modal
const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

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
                    let color = '#3B82F6'; // Azul (Pendiente)
                    if (cita.estado === 'FINALIZADA') color = '#10B981'; // Verde
                    if (cita.estado === 'CANCELADA') color = '#EF4444'; // Rojo
                    else if (cita.estado === 'FALTA_JUSTIFICADA') color = '#F59E0B'; // Naranja
                    else if (cita.estado === 'FALTA_INJUSTIFICADA') color = '#6B7280'; // Gris

                    const fechaISO = parseDate(cita.fecha);

                    return {
                        id: cita.citaId || cita.id, // Ensure ID is present
                        title: `${cita.horaInicio ? cita.horaInicio.substring(0, 5) : ''} - ${cita.paciente?.nombresApellidos || 'Paciente'}`,
                        start: `${fechaISO}T${cita.horaInicio}`,
                        end: `${fechaISO}T${cita.horaFin}`,
                        backgroundColor: color,
                        borderColor: color,
                        extendedProps: {
                            originalId: cita.citaId || cita.id, // Explicitly keep original ID
                            estado: cita.estado,
                            paciente: cita.paciente,
                            especialidad: cita.especialidad,
                            especialista: cita.especialista,
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
    }, [userIdentity]);

    const handleEventClick = (info: any) => {
        const eventData = {
            id: info.event.id,
            ...info.event.extendedProps,
            title: info.event.title
        };
        console.log("Evento seleccionado:", eventData); // Debug log
        setSelectedEvent(eventData);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
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

            {/* Modal de Detalles */}
            {isModalOpen && selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl overflow-hidden transform transition-all scale-100">
                        <div className="flex justify-between items-center p-6">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                Detalles de la Cita
                            </h4>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Paciente</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {selectedEvent.paciente?.nombresApellidos || selectedEvent.paciente?.nombres || 'No disponible'}
                                </p>
                                <p className="text-sm text-gray-500">{selectedEvent.paciente?.cedula}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha</p>
                                    <p className="text-base text-gray-900 dark:text-white">{selectedEvent.fullDate}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Horario</p>
                                    <p className="text-base text-gray-900 dark:text-white">
                                        {selectedEvent.fullTimeCheck}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                    ${selectedEvent.estado === 'PENDIENTE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                        selectedEvent.estado === 'FINALIZADA' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                            selectedEvent.estado === 'CANCELADA' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                                    {selectedEvent.estado}
                                </span>
                            </div>

                            {selectedEvent.especialidad && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Especialidad</p>
                                    <p className="text-base text-gray-900 dark:text-white">{selectedEvent.especialidad.area}</p>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarBox;
