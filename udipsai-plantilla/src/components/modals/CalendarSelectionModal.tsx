
import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg } from "@fullcalendar/core";
import esLocale from '@fullcalendar/core/locales/es';
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { citasService } from "../../services/citas"; // Adjust path if necessary
import { toast } from "react-hot-toast";

interface CalendarSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    specialistId: number | string | null;
    specialistName?: string;
    onSelectSlot: (date: string, time: string) => void;
}

const CalendarSelectionModal: React.FC<CalendarSelectionModalProps> = ({
    isOpen,
    onClose,
    specialistId,
    specialistName,
    onSelectSlot,
}) => {
    const [events, setEvents] = useState<EventInput[]>([]);
    const [loading, setLoading] = useState(false);
    const calendarRef = useRef<FullCalendar>(null);

    useEffect(() => {
        if (isOpen && specialistId) {
            loadEvents();
            // Resize calendar after modal animation
            setTimeout(() => {
                calendarRef.current?.getApi().updateSize();
            }, 200);
        } else {
            setEvents([]);
        }
    }, [isOpen, specialistId]);

    const loadEvents = async () => {
        if (!specialistId) return;
        setLoading(true);
        try {
            const response = await citasService.obtenerPorEspecialidad(Number(specialistId), 0, 500);
            const data = response.content || [];

            const mappedEvents = data
                .filter((cita: any) => cita.estado !== 'CANCELADA')
                .map((cita: any) => {
                    const [day, month, year] = cita.fecha.split('-').map(Number);
                    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    return {
                        id: cita.citaId?.toString(),
                        title: "Ocupado", // Simplify for privacy/clarity in picker? Or show name? Let's show "Ocupado" or name if permissible. Citas.tsx shows name. Let's show "Reservado" to indicate unavailable.
                        start: `${dateStr}T${cita.horaInicio}:00`,
                        end: `${dateStr}T${cita.horaFin}:00`,
                        color: '#9CA3AF', // Gray for occupied
                        display: 'background' // Optional: make it background event to just block visually? No, let's make it explicit event.
                    };
                });
            setEvents(mappedEvents);
        } catch (error) {
            console.error("Error loading events", error);
            toast.error("Error al cargar disponibilidad");
        } finally {
            setLoading(false);
        }
    };

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        // Prevent past dates
        const now = new Date();
        if (selectInfo.start < now) {
            toast.error("No se puede seleccionar una fecha pasada");
            return;
        }

        // If in month view, just switch to week view for that date
        if (selectInfo.view.type === 'dayGridMonth') {
            const calendarApi = selectInfo.view.calendar;
            calendarApi.changeView('timeGridWeek', selectInfo.startStr);
            return;
        }

        const dateStr = selectInfo.startStr.split("T")[0];
        const timeStr = selectInfo.startStr.split("T")[1].substring(0, 5);

        onSelectSlot(dateStr, timeStr);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl p-6 h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Seleccionar Horario
                    </h2>
                    {specialistName && (
                        <p className="text-sm text-gray-500">
                            Agenda de: <span className="font-medium text-brand-600">{specialistName}</span>
                        </p>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 z-20 flex items-center justify-center">
                        <span className="text-brand-600 font-medium">Cargando disponibilidad...</span>
                    </div>
                )}
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    locale={esLocale}
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek"
                    }}
                    events={events}
                    selectable={true}
                    select={handleDateSelect}
                    slotDuration="01:00:00"
                    snapDuration="01:00:00" // Snap to hours
                    slotMinTime="08:00:00"
                    slotMaxTime="17:00:00"
                    allDaySlot={false}
                    height="100%"
                    hiddenDays={[0, 6]}
                    businessHours={[
                        { daysOfWeek: [1, 2, 3, 4, 5], startTime: "08:00", endTime: "12:00" },
                        { daysOfWeek: [1, 2, 3, 4, 5], startTime: "13:00", endTime: "17:00" },
                    ]}
                    selectMirror={true}
                    selectOverlap={false} // Do not allow selection over existing events
                />
            </div>
        </Modal>
    );
};

export default CalendarSelectionModal;
