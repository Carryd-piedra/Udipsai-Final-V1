import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { citasService } from "../../services/citas";
import { toast } from "react-hot-toast";
import PatientSearchModal from "./PatientSearchModal";
import SpecialistSearchModal from "./SpecialistSearchModal";
import CalendarSelectionModal from "./CalendarSelectionModal";

interface CitaModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialDate: string;
    initialTime: string;
    initialDuration?: number; // Add prop to receive duration (hours)
    onSave: () => void;
    fixedSpecialtyId?: number;
    initialPatient?: any;
    initialSpecialist?: any;
    appointmentId?: string | number; // If present, we are rescheduling
}

const CitaModal: React.FC<CitaModalProps> = ({
    isOpen,
    onClose,
    initialDate,
    initialTime,
    initialDuration = 1, // Default 1 hour
    onSave,
    fixedSpecialtyId,
    initialPatient,
    initialSpecialist,
    appointmentId,
}) => {
    const navigate = useNavigate();
    const { hasPermission } = useAuth();
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [startTime, setStartTime] = useState(initialTime);
    const [duration, setDuration] = useState(initialDuration);
    const [endTime, setEndTime] = useState("");
    const [loading, setLoading] = useState(false);

    // Availability State
    const [availableHours, setAvailableHours] = useState<string[]>([]);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

    // Modal control states
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [showSpecialistModal, setShowSpecialistModal] = useState(false);
    const [showCalendarModal, setShowCalendarModal] = useState(false);

    // Explicit error message to display in UI (e.g. backend conflict)
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleCalendarSelect = (date: string, time: string) => {
        setSelectedDate(date);
        setStartTime(time);
        setErrorMessage(null); // Clear error on new selection
    };

    useEffect(() => {
        setSelectedDate(initialDate);
        setStartTime(initialTime);
        setDuration(initialDuration);
        if (initialPatient) setSelectedPatient(initialPatient);
        if (initialSpecialist) setSelectedSpecialist(initialSpecialist);
        setErrorMessage(null);
    }, [initialDate, initialTime, initialDuration, isOpen, initialPatient, initialSpecialist]);

    useEffect(() => {
        if (!isOpen) {
            setSelectedPatient(null);
            setSelectedSpecialist(null);
            setDuration(1); // Reset duration
            setErrorMessage(null);
        }
    }, [isOpen]);

    // Fetch availability when Specialist + Date changes
    useEffect(() => {
        if (selectedSpecialist && selectedDate) {
            setIsCheckingAvailability(true);
            setErrorMessage(null);
            // Format date if needed, input type='date' gives YYYY-MM-DD which is likely what backend needs
            citasService.obtenerHorasLibres(selectedSpecialist.id, selectedDate)
                .then((hours: string[]) => {
                    setAvailableHours(hours);

                    // Check if *currently selected* time is valid, if we have one.
                    // Special Case: Rescheduling. The 'initialTime' IS valid for THIS appointment, 
                    // but 'obtenerHorasLibres' will likely mark it as occupied (by us!).
                    // So we must trust the user/initial setup OR logic needs to know "occupied by me".
                    // The backend typically returns occupied stats.

                    // If we are strictly creating valid interactions, we rely on user clicking available slots.
                    // But if prepopulated time is now occupied (by someone else), we should clear it or warn?

                    const isRescheduling = !!appointmentId;
                    // Only logic clearing if not rescheduling or if it's a date change?
                    // Let's keep it simple: Just load hours. 
                    // Logic for validating "Is this time still free?" happens on Render of the button 
                    // OR on Submit.
                })
                .catch((err) => {
                    console.error("Error fetching availability", err);
                    toast.error("Error consultando disponibilidad");
                    setAvailableHours([]);
                })
                .finally(() => setIsCheckingAvailability(false));
        } else {
            setAvailableHours([]);
        }
    }, [selectedSpecialist, selectedDate, appointmentId]);

    // Update End Time display when Start Time or Duration changes
    useEffect(() => {
        if (startTime) {
            const [hours, minutes] = startTime.split(':').map(Number);
            const endH = hours + duration;
            const formattedEnd = `${endH.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            setEndTime(formattedEnd);
        } else {
            setEndTime("");
        }
    }, [startTime, duration]);

    const handleTimeSelect = (time: string) => {
        setStartTime(time);
        setDuration(1); // Reset duration if they pick a new slot, or keep it? Logic says usually 1hr default.
        setErrorMessage(null);
    };

    // Calculate Max Duration for a specific start time based on availability
    const getMaxDurationForTime = (time: string) => {
        const [startHour] = time.split(':').map(Number);

        // Determine Shift Limit
        let limitHour = 17; // Default end of day
        if (startHour < 12) {
            limitHour = 12; // Morning shift ends at 12
        }

        let maxPossible = 1;

        // Check subsequent slots
        // We know availableHours contains "08:00", "09:00", etc.
        // We need 1-hour blocks. 
        // If we start at 08:00, duration 2 means we occupy 08:xx and 09:xx.
        // So 09:00 MUST also be in availableHours.

        // Special Case: RESCHEDULING. 
        // If I am rescheduling from 09:00-11:00 (2h), then 09:00 and 10:00 are "Occupied" by me.
        // availableHours will NOT have them.
        // So we need to know "My Original Slots".
        // This is complex on frontend without backend sending "My Slots".
        // Simplified Logic: 
        // 1. Available check strictly against list.
        // 2. UNLESS it matches `initialTime` AND we are on `initialDate` (Rescheduling same day).

        const isRescheduling = !!appointmentId;
        const isSameDayAsOriginal = selectedDate === initialDate;
        // const isMyOriginalStart = isRescheduling && isSameDayAsOriginal && time === initialTime; // Only start matches

        // We ideally need the full original range.
        // Assuming initialDuration passed is the original duration.
        const originalStartH = initialTime ? parseInt(initialTime.split(':')[0]) : -1;
        const originalEndH = originalStartH + (appointmentId ? initialDuration : 0);

        for (let h = startHour + 1; h < limitHour; h++) {
            const checkTime = `${h.toString().padStart(2, '0')}:00`;

            // Is this slot available?
            const isFree = availableHours.includes(checkTime);

            // Is this slot MINE? (part of original appointment range)
            const isMine = isRescheduling && isSameDayAsOriginal && h >= originalStartH && h < originalEndH;

            if (!isFree && !isMine) {
                break; // Stop at first obstruction
            }
            maxPossible++;
        }

        return Math.min(maxPossible, 4); // Hard cap 4 hours? or shift limit.
    };

    // Render a single time slot button
    const renderTimeSlot = (time: string) => {
        // Logic for disabled/available
        // 1. Must be in availableHours OR be the current appointment's original slot (if rescheduling same day)

        const isRescheduling = !!appointmentId;
        const isSameDayAsOriginal = selectedDate === initialDate;
        const isOriginalSlot = isRescheduling && isSameDayAsOriginal && initialTime && time === initialTime.substring(0, 5);

        // Check if strictly "Available" in list
        const isFree = availableHours.includes(time);

        // Calculate validity
        // Past time check?
        const now = new Date();
        const [slotH, slotM] = time.split(':').map(Number);
        const [y, m, d] = selectedDate.split('-').map(Number);
        const slotDate = new Date(y, m - 1, d, slotH, slotM); // Month is 0-indexed
        const isPast = slotDate < now;

        // Valid if: (Free OR MySlot) AND NotPast
        const isAvailable = (isFree || isOriginalSlot) && !isPast;

        // Shift check (Start Morning vs Slot Morning - purely visual grouping usually, but ensured here)
        // ... (Already grouped in UI render)

        // Selected state?
        // If this exact time is start time
        const isStart = startTime === time;
        // OR if this time is covered by duration of start time
        let isInDurationBlock = false;
        if (startTime && duration > 1) {
            const startH = parseInt(startTime.split(':')[0]);
            const currentH = parseInt(time.split(':')[0]);
            if (currentH >= startH && currentH < startH + duration) {
                isInDurationBlock = true;
            }
        }

        const isSelected = isStart || (isInDurationBlock && isFree) || (isInDurationBlock && isOriginalSlot); // highlight if valid block


        return (
            <button
                key={time}
                onClick={() => isAvailable && handleTimeSelect(time)}
                disabled={!isAvailable}
                className={`py-2 rounded text-sm transition border ${isSelected
                        ? "bg-brand-600 text-white border-brand-700 shadow-md font-bold"
                        : isAvailable
                            ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                            : "bg-red-50 text-red-300 border-red-100 cursor-not-allowed decoration-slice dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-800"
                    }`}
                title={!isAvailable ? (isPast ? "Hora pasada" : "Hora ocupada") : ""}
            >
                {time}
            </button>
        );
    };

    const handleSubmit = async () => {
        if (!selectedPatient || !selectedSpecialist || !startTime || !endTime) {
            toast.error("Por favor seleccione todos los campos requeridos.");
            return;
        }

        // Client-side Availability Check for SAFETY (including Duration overlap)
        const startH = parseInt(startTime.split(':')[0]);
        // Check every hour in duration

        // Context:
        const isRescheduling = !!appointmentId;
        const isSameDayAsOriginal = selectedDate === initialDate;
        const originalStartH = initialTime ? parseInt(initialTime.split(':')[0]) : -1;
        const originalEndH = originalStartH + (appointmentId ? initialDuration : 0);

        for (let i = 0; i < duration; i++) {
            const checkH = startH + i;
            const checkTime = `${checkH.toString().padStart(2, '0')}:00`;

            const isFree = availableHours.includes(checkTime);
            const isMine = isRescheduling && isSameDayAsOriginal && checkH >= originalStartH && checkH < originalEndH;

            if (!isFree && !isMine) {
                toast.error(`El horario ${checkTime} no está disponible. Ajuste la duración o inicio.`);
                return;
            }
        }

        setLoading(true);
        setErrorMessage(null);

        try {
            const especialidadId = fixedSpecialtyId || selectedSpecialist.especialidad?.id;

            if (!especialidadId) {
                toast.error("Error: Especialidad no identificada.");
                setLoading(false);
                return;
            }

            const payload = {
                fichaPaciente: selectedPatient.id,
                profesionalId: selectedSpecialist.id,
                especialidadId: Number(especialidadId),
                fecha: selectedDate,
                hora: startTime,
                duracionMinutes: duration * 60
            };

            if (appointmentId) {
                await citasService.reagendar(appointmentId, payload);
                toast.success("Cita reagendada exitosamente");
            } else {
                await citasService.registrarCita(payload);
                toast.success("Cita agendada exitosamente");
            }

            // Reset and Close
            setSelectedPatient(null);
            setSelectedSpecialist(null);
            setStartTime("");
            setEndTime("");
            setErrorMessage(null);
            onSave();
            onClose();
        } catch (error: any) {
            console.error("Error creating/updating appointment:", error);
            // Extract error message from backend
            let msg = "Error al guardar la cita";
            if (error?.response?.data) {
                if (typeof error.response.data === 'string') {
                    msg = error.response.data;
                } else if (error.response.data.message) {
                    msg = error.response.data.message;
                }
            }
            setErrorMessage(msg); // Set generic error message state to display in modal
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-6">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
                    {appointmentId ? 'Reagendar Cita' : 'Agendar Nueva Cita'}
                </h2>

                <div className="space-y-6">
                    {/* Patient Selection */}
                    <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-white/[0.03]">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Paciente
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1 flex gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    disabled
                                    value={
                                        selectedPatient
                                            ? `${selectedPatient.nombresApellidos || selectedPatient.nombres + ' ' + selectedPatient.apellidos} - ${selectedPatient.cedula} `
                                            : "Ningún paciente seleccionado"
                                    }
                                    className={`flex-1 px-3 py-2.5 rounded-lg border text-sm ${selectedPatient
                                        ? "bg-green-50 border-green-200 text-green-800"
                                        : "bg-gray-100 border-gray-200 text-gray-500"
                                        } `}
                                />
                                {selectedPatient && (
                                    <button
                                        onClick={() => setSelectedPatient(null)}
                                        className="p-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
                                        title="Quitar paciente"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setShowPatientModal(true)}
                                className="whitespace-nowrap"
                            >
                                Buscar
                            </Button>

                            {hasPermission("PERM_PACIENTES") && (
                                <button
                                    onClick={() => navigate("/pacientes/nuevo")}
                                    className="px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition whitespace-nowrap font-medium shadow-sm"
                                    title="Crear Nuevo Paciente"
                                >
                                    Crear Paciente
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Specialist Selection */}
                    <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-white/[0.03]">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Especialista
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1 flex gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    disabled
                                    value={
                                        selectedSpecialist
                                            ? `${selectedSpecialist.nombresApellidos || selectedSpecialist.nombres + ' ' + selectedSpecialist.apellidos} - ${selectedSpecialist.especialidad?.area || 'Sin esp.'} `
                                            : "Ningún especialista seleccionado"
                                    }
                                    className={`flex-1 px-3 py-2.5 rounded-lg border text-sm ${selectedSpecialist
                                        ? "bg-green-50 border-green-200 text-green-800"
                                        : "bg-gray-100 border-gray-200 text-gray-500"
                                        } `}
                                />
                                {selectedSpecialist && (
                                    <button
                                        onClick={() => setSelectedSpecialist(null)}
                                        className="p-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
                                        title="Quitar especialista"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setShowSpecialistModal(true)}
                                className="whitespace-nowrap"
                            >
                                Buscar
                            </Button>
                        </div>
                    </div>

                    {/* Date and Time Selection */}
                    <div className="border border-gray-200 rounded-lg dark:border-gray-700 p-4 relative">
                        {isCheckingAvailability && (
                            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-lg">
                                <span className="text-sm text-blue-600 font-medium">Consultando disponibilidad...</span>
                            </div>
                        )}

                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                            Fecha y Hora
                        </h3>

                        <div className="mb-4">
                            <label className="block text-xs text-gray-500 mb-1">Fecha de la Cita</label>
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    min={new Date().toISOString().split('T')[0]} // Block past dates
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                />
                                {appointmentId && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            if (!selectedSpecialist) {
                                                toast.error("Seleccione un especialista primero");
                                                return;
                                            }
                                            setShowCalendarModal(true);
                                        }}
                                        title="Ver disponibilidad en calendario"
                                    >
                                        📅 Ver Calendario
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Warning Info */}
                            {!selectedSpecialist && (
                                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200 mb-2">
                                    ← Seleccione un especialista para ver los horarios disponibles.
                                </div>
                            )}
                            {selectedSpecialist && availableHours.length === 0 && !isCheckingAvailability && (
                                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200 mb-2">
                                    No hay horarios libres esa fecha para el especialista.
                                </div>
                            )}

                            {/* Morning Slots */}
                            <div>
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Mañana</span>
                                <div className="grid grid-cols-4 gap-2">
                                    {["08:00", "09:00", "10:00", "11:00"].map((time) => renderTimeSlot(time))}
                                </div>
                            </div>

                            {/* Lunch Break */}
                            <div className="flex items-center gap-2 py-1 opacity-60">
                                <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                                <span className="text-xs text-gray-400">12:00 - 13:00 Receso</span>
                                <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                            </div>

                            {/* Afternoon Slots */}
                            <div>
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Tarde</span>
                                <div className="grid grid-cols-4 gap-2">
                                    {["13:00", "14:00", "15:00", "16:00"].map((time) => renderTimeSlot(time))}
                                </div>
                            </div>

                            {/* Duration Selector */}
                            {startTime && (
                                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-800/50 dark:border-gray-700">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duración de la Cita</h4>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4].map((h) => {
                                            const max = getMaxDurationForTime(startTime);
                                            // Optional: Disable if duration exceeds available hours
                                            if (h > max) return null;

                                            return (
                                                <button
                                                    key={h}
                                                    onClick={() => setDuration(h)}
                                                    className={`px-4 py-2 rounded text-sm border font-medium transition ${duration === h
                                                            ? "bg-brand-600 text-white border-brand-600"
                                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                                        } `}
                                                >
                                                    {h} {h === 1 ? 'Hora' : 'Horas'}
                                                    <span className="block text-xs font-normal opacity-80">
                                                        Hasta {parseInt(startTime.split(':')[0]) + h}:00
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-2 text-right">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Horario: <strong>{startTime} - {endTime}</strong>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Error Message Display Area */}
                    {errorMessage && (
                        <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg animate-pulse" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{errorMessage}</span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || !selectedPatient || !selectedSpecialist || !startTime || !!errorMessage} // Also disable if error is present? No, let them try again.
                            title={(!selectedPatient || !selectedSpecialist || !startTime) ? "Complete todos los campos requeridos" : "Agendar Cita"}
                        >
                            {loading ? "Guardando..." : "Guardar Cita"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Nested Modals at root level of Fragment */}
            <PatientSearchModal
                isOpen={showPatientModal}
                onClose={() => setShowPatientModal(false)}
                onSelect={setSelectedPatient}
            />

            <SpecialistSearchModal
                isOpen={showSpecialistModal}
                onClose={() => setShowSpecialistModal(false)}
                onSelect={setSelectedSpecialist}
                fixedSpecialtyId={fixedSpecialtyId}
            />

            <CalendarSelectionModal
                isOpen={showCalendarModal}
                onClose={() => setShowCalendarModal(false)}
                specialistId={selectedSpecialist?.id}
                specialistName={selectedSpecialist ? (selectedSpecialist.nombresApellidos || `${selectedSpecialist.nombres || ''} ${selectedSpecialist.apellidos || ''}`) : undefined}
                onSelectSlot={handleCalendarSelect}
            />
        </>
    );
};

export default CitaModal;
