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
    initialDuration?: number;
    onSave: () => void;
    fixedSpecialtyId?: number;
    initialPatient?: any;
    initialSpecialist?: any;
    appointmentId?: string | number;
}

const CitaModal: React.FC<CitaModalProps> = ({
    isOpen,
    onClose,
    initialDate,
    initialTime,
    initialDuration = 1,
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
    const [duration, setDuration] = useState(initialDuration); // Default from prop
    const [endTime, setEndTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Availability State
    const [availableHours, setAvailableHours] = useState<string[]>([]);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

    // Modal control states
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [showSpecialistModal, setShowSpecialistModal] = useState(false);
    const [showCalendarModal, setShowCalendarModal] = useState(false);

    const handleCalendarSelect = (date: string, time: string) => {
        setSelectedDate(date);
        setStartTime(time);
        // Force availability check refresh for this new date if needed, though handleTimeSelect logic usually runs on render or user click. 
        // Setting state should trigger effects.
    };

    useEffect(() => {
        setSelectedDate(initialDate);

        // Validate if initialTime is in the past for the selected date
        if (initialTime && initialDate) {
            const now = new Date();
            const [hours, minutes] = initialTime.split(':').map(Number);
            const [year, month, day] = initialDate.split('-').map(Number);
            const slotDate = new Date(year, month - 1, day, hours, minutes);

            if (slotDate < now) {
                // If past, don't set it (reset)
                setStartTime("");
                setEndTime("");
            } else {
                setStartTime(initialTime);
                setDuration(initialDuration);
                // handleTimeSelect(initialTime); // Don't call this, it resets duration to 1!
            }
        } else {
            setStartTime("");
        }
        if (initialPatient) setSelectedPatient(initialPatient);
        if (initialSpecialist) setSelectedSpecialist(initialSpecialist);
    }, [initialDate, initialTime, initialDuration, isOpen, initialPatient, initialSpecialist]);

    useEffect(() => {
        if (!isOpen) {
            setSelectedPatient(null);
            setSelectedSpecialist(null);
            setDuration(1);
        }
    }, [isOpen]);

    // Fetch availability when Specialist + Date changes
    useEffect(() => {
        if (selectedSpecialist && selectedDate) {
            setIsCheckingAvailability(true);
            // Format date if needed, input type='date' gives YYYY-MM-DD which is likely what backend needs
            citasService.obtenerHorasLibres(selectedSpecialist.id, selectedDate)
                .then((hours: string[]) => {
                    setAvailableHours(hours);
                    // Reset selected time if it's no longer available, UNLESS it's the original rescheduled time
                    const isRescheduling = !!appointmentId;
                    const isSameDayAsOriginal = selectedDate === initialDate;
                    const isOriginalSlot = isRescheduling && isSameDayAsOriginal && startTime === initialTime.substring(0, 5);

                    if (startTime && !hours.includes(startTime) && !isOriginalSlot) {
                        setStartTime("");
                        setEndTime("");
                    }
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
    }, [selectedSpecialist, selectedDate]);

    useEffect(() => {
        // Recalculate end time whenever startTime or duration changes
        if (startTime) {
            const [hours, minutes] = startTime.split(':').map(Number);
            const endH = hours + duration;
            // Basic end time formatting (assuming full hours)
            const formattedEnd = `${endH.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            setEndTime(formattedEnd);
        } else {
            setEndTime("");
        }
    }, [startTime, duration]);

    // Clear error message when inputs change
    useEffect(() => {
        if (errorMessage) setErrorMessage(null);
    }, [selectedDate, startTime, selectedPatient, selectedSpecialist, duration]);

    const handleTimeSelect = (time: string) => {
        setStartTime(time);
        setDuration(1); // Reset duration to 1 to ensure user re-selects valid duration for this new slot
    };

    const getMaxDurationForTime = (time: string) => {
        const [startHour] = time.split(':').map(Number);

        // Determine Shift Limit
        let limitHour = 17; // Default end of day
        if (startHour < 12) {
            limitHour = 12; // Morning shift ends at 12
        }

        let maxPossible = 1;

        // original slots logic
        const isRescheduling = !!appointmentId;
        const isSameDayAsOriginal = selectedDate === initialDate;
        // initialDuration is passed as prop. Assuming initialTime is start.
        // We need to know the original End Time or Duration.
        // The prop is `initialDuration`. 
        const originalStartH = initialTime ? parseInt(initialTime.split(':')[0]) : -1;
        const originalEndH = originalStartH + initialDuration;

        for (let h = startHour + 1; h < limitHour; h++) {
            const checkTime = `${h.toString().padStart(2, '0')}:00`;

            // Available if in availableHours OR if it is part of the original appointment (one of our own slots)
            const isMySlot = isRescheduling && isSameDayAsOriginal && h >= originalStartH && h < originalEndH;

            if (!availableHours.includes(checkTime) && !isMySlot) {
                break;
            }
            maxPossible++;
        }


        return Math.min(maxPossible, 4);
    };

    const renderTimeSlot = (time: string) => {
        // Check availability
        // If no specialist selected, disable
        if (!selectedSpecialist) return (
            <button disabled className="py-2 rounded text-sm bg-gray-100 text-gray-400 cursor-not-allowed border border-transparent dark:bg-gray-800 dark:text-gray-600">
                {time}
            </button>
        );

        // Calculate if time is in the past
        const now = new Date();
        const [slotHours, slotMinutes] = time.split(':').map(Number);

        // Parse selectedDate (YYYY-MM-DD)
        const [year, month, day] = selectedDate.split('-').map(Number);
        const slotDate = new Date(year, month - 1, day, slotHours, slotMinutes);

        // Validation 1: Real Past Time (relative to Now)
        const isPast = slotDate < now;

        // Validation 2: Before Initial Time (User Constraint)
        // Only apply if we have an initialTime set (from calendar click) AND we are rescheduling on the same day
        const isRescheduling = !!appointmentId;
        const isSameDayAsOriginal = selectedDate === initialDate;
        const isBeforeInitial = isRescheduling && isSameDayAsOriginal && initialTime ? time < initialTime : false;

        // Validation: Is this the original slot we are editing?
        const isOriginalSlot = isRescheduling && isSameDayAsOriginal && initialTime && time === initialTime.substring(0, 5);

        // Validation 3: Shift Isolation
        let isCrossShift = false;
        if (startTime) {
            const startH = parseInt(startTime.split(':')[0]);
            const slotH = parseInt(time.split(':')[0]);

            const isStartMorning = startH < 12;
            const isSlotMorning = slotH < 12;

            if (isStartMorning !== isSlotMorning) {
                isCrossShift = true;
            }
        }

        const isAvailable = (availableHours.includes(time) || isOriginalSlot) && !isPast && !isCrossShift && !isBeforeInitial;

        // Check if this slot is part of the currently selected duration
        let isInDurationBlock = false;
        if (startTime && duration > 1) {
            const startH = parseInt(startTime.split(':')[0]);
            const currentH = parseInt(time.split(':')[0]);
            // It is in block if:
            // 1. It is >= startTime
            // 2. It is < startTime + duration
            // 3. It is on the same shift (already checked by isCrossShift somewhat, but let's be explicit)

            if (currentH >= startH && currentH < startH + duration) {
                isInDurationBlock = true;
            }
        }

        const isStart = startTime === time;
        const isSelected = isStart || (isInDurationBlock && isAvailable);

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
                title={
                    isPast ? "Hora ya pasada" :
                        isBeforeInitial ? `Hora anterior a la cita original (${initialTime})` :
                            (!availableHours.includes(time) && !isOriginalSlot ? "Hora ya ocupada" : "")
                }
            >
                {time}
            </button>
        );
    };

    const handleSubmit = async () => {
        console.log("Submit initiated");
        console.log("State:", { selectedPatient, selectedSpecialist, startTime, endTime });

        if (!selectedPatient || !selectedSpecialist || !startTime || !endTime) {
            console.warn("Validation failed: missing fields");
            toast.error("Por favor seleccione un paciente, un especialista y una hora de cita.");
            return;
        }

        // Validate availability
        // Allow if it is the ORIGINAL slot (rescheduling same time)
        const isRescheduling = !!appointmentId;
        const isSameDayAsOriginal = selectedDate === initialDate;
        const isOriginalSlot = isRescheduling && isSameDayAsOriginal && initialTime && startTime === initialTime.substring(0, 5);

        if (!availableHours.includes(startTime) && !isOriginalSlot) {
            console.warn("Validation failed: slot not available");
            toast.error("La hora seleccionada ya no está disponible. Por favor seleccione otra.");
            // Optional: Clear it?
            setStartTime("");
            setEndTime("");
            return;
        }

        // Validate Duration Overlap
        const startH = parseInt(startTime.split(':')[0]);
        for (let i = 0; i < duration; i++) {
            const checkH = startH + i;
            const checkTime = `${checkH.toString().padStart(2, '0')}:00`;

            // Allow if it is part of the ORIGINAL appointment range
            const originalStartH = initialTime ? parseInt(initialTime.split(':')[0]) : -1;
            const isMySlot = isRescheduling && isSameDayAsOriginal && checkH >= originalStartH && checkH < (originalStartH + (initialDuration || 1));

            if (!availableHours.includes(checkTime) && !isMySlot) {
                toast.error(`La hora ${checkTime} dentro del rango seleccionado no está disponible.`);
                return;
            }
        }

        setLoading(true);
        try {
            const especialidadId = fixedSpecialtyId || selectedSpecialist.especialidad?.id;
            console.log("Derived especialidadId:", especialidadId);

            if (!especialidadId) {
                console.error("Validation failed: missing especialidadId");
                toast.error("No se pudo identificar la especialidad para la cita.");
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
            console.log("Sending payload:", payload);

            if (appointmentId) {
                await citasService.reagendar(appointmentId, payload);
                toast.success("Cita reagendada exitosamente");
            } else {
                await citasService.registrarCita(payload);
                toast.success("Cita agendada exitosamente");
            }

            // Reset fields
            setSelectedPatient(null);
            setSelectedSpecialist(null);
            setStartTime("");
            setEndTime("");

            setErrorMessage(null); // Clear previous errors
            onSave();
            onClose();
        } catch (error: any) {
            console.error("Error creating appointment:", error);
            let msg = "Error al agendar la cita";
            if (error?.response?.data) {
                if (typeof error.response.data === 'string') {
                    msg = error.response.data;
                } else if (error.response.data.message) {
                    msg = error.response.data.message;
                }
            }
            setErrorMessage(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-6">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
                    Agendar Nueva Cita
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
                                    min={new Date().toISOString().split('T')[0]}
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

                            {startTime && (
                                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-800/50 dark:border-gray-700">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duración de la Cita</h4>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4].map((h) => {
                                            const max = getMaxDurationForTime(startTime);
                                            if (h > max) return null; // Don't show options crossing shifts

                                            // Check availability for extended hours
                                            // e.g. Start 10:00, duration 2h means 10:00-11:00 AND 11:00-12:00 must be free
                                            // Actually, availability check is usually for START slots.
                                            // Ideally we check if "startTime + h - 1" is free.
                                            // Simplified: just check shift boundaries for now as requested.

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

                    {/* Explicit Error Message Display */}
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
                            disabled={loading || !selectedPatient || !selectedSpecialist || !startTime}
                            title={(!selectedPatient || !selectedSpecialist || !startTime) ? "Complete todos los campos requeridos" : "Agendar Cita"}
                        >
                            {loading ? "Guardando..." : "Guardar Cita"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Nested Modals */}
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
