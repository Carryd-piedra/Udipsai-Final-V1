import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import { citasService } from "../../services/citas";
import { toast } from "react-hot-toast";
import PatientSearchModal from "./PatientSearchModal";
import SpecialistSearchModal from "./SpecialistSearchModal";

interface CitaModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialDate: string;
    initialTime: string;
    onSave: () => void;
    fixedSpecialtyId?: number;
}

const CitaModal: React.FC<CitaModalProps> = ({
    isOpen,
    onClose,
    initialDate,
    initialTime,
    onSave,
    fixedSpecialtyId,
}) => {
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [startTime, setStartTime] = useState(initialTime);
    const [endTime, setEndTime] = useState("");
    const [loading, setLoading] = useState(false);

    // Availability State
    const [availableHours, setAvailableHours] = useState<string[]>([]);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

    // Modal control states
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [showSpecialistModal, setShowSpecialistModal] = useState(false);

    useEffect(() => {
        setSelectedDate(initialDate);
        setStartTime(initialTime);
        // The new logic for endTime is handled by handleTimeSelect
        // If initialTime is set, call handleTimeSelect to set endTime
        if (initialTime) {
            handleTimeSelect(initialTime);
        }
    }, [initialDate, initialTime, isOpen]);

    // Fetch availability when Specialist + Date changes
    useEffect(() => {
        if (selectedSpecialist && selectedDate) {
            setIsCheckingAvailability(true);
            // Format date if needed, input type='date' gives YYYY-MM-DD which is likely what backend needs
            citasService.obtenerHorasLibres(selectedSpecialist.id, selectedDate)
                .then((hours: string[]) => {
                    setAvailableHours(hours);
                    // Reset selected time if it's no longer available
                    if (startTime && !hours.includes(startTime)) {
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

    const handleTimeSelect = (time: string) => {
        setStartTime(time);
        // Auto-calculate end time: start + 1 hour
        const [hours, minutes] = time.split(':').map(Number);
        const endH = hours + 1;
        const formattedEnd = `${endH.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        setEndTime(formattedEnd);
    };

    const renderTimeSlot = (time: string) => {
        // Check availability
        // If no specialist selected, disable
        if (!selectedSpecialist) return (
            <button disabled className="py-2 rounded text-sm bg-gray-100 text-gray-400 cursor-not-allowed border border-transparent dark:bg-gray-800 dark:text-gray-600">
                {time}
            </button>
        );

        const isAvailable = availableHours.includes(time);
        const isSelected = startTime === time;

        return (
            <button
                key={time}
                onClick={() => isAvailable && handleTimeSelect(time)}
                disabled={!isAvailable}
                className={`py-2 rounded text-sm transition border ${isSelected
                    ? "bg-brand-500 text-white border-brand-600 shadow-md"
                    : isAvailable
                        ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                        : "bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed text-opacity-60 decoration-slice dark:bg-gray-800/50 dark:border-gray-800 dark:text-gray-600"
                    }`}
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
            };
            console.log("Sending payload:", payload);

            await citasService.registrarCita(payload);
            toast.success("Cita agendada exitosamente");
            onSave();
            onClose();
        } catch (error: any) {
            console.error("Error creating appointment:", error);
            const msg = error?.response?.data?.message || "Error al agendar la cita";
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
                            <input
                                type="text"
                                readOnly
                                disabled
                                value={
                                    selectedPatient
                                        ? `${selectedPatient.nombresApellidos || selectedPatient.nombres + ' ' + selectedPatient.apellidos} - ${selectedPatient.cedula}`
                                        : "Ningún paciente seleccionado"
                                }
                                className={`flex-1 px-3 py-2.5 rounded-lg border text-sm ${selectedPatient
                                    ? "bg-green-50 border-green-200 text-green-800"
                                    : "bg-gray-100 border-gray-200 text-gray-500"
                                    }`}
                            />
                            <button
                                onClick={() => setShowPatientModal(true)}
                                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
                            >
                                Buscar Paciente
                            </button>
                        </div>
                    </div>

                    {/* Specialist Selection */}
                    <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-white/[0.03]">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Especialista
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                readOnly
                                disabled
                                value={
                                    selectedSpecialist
                                        ? `${selectedSpecialist.nombresApellidos || selectedSpecialist.nombres + ' ' + selectedSpecialist.apellidos} - ${selectedSpecialist.especialidad?.area || 'Sin esp.'}`
                                        : "Ningún especialista seleccionado"
                                }
                                className={`flex-1 px-3 py-2.5 rounded-lg border text-sm ${selectedSpecialist
                                    ? "bg-green-50 border-green-200 text-green-800"
                                    : "bg-gray-100 border-gray-200 text-gray-500"
                                    }`}
                            />
                            <button
                                onClick={() => setShowSpecialistModal(true)}
                                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
                            >
                                Buscar Especialista
                            </button>
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
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
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
                                <div className="mt-2 text-right">
                                    <span className="text-xs text-gray-500">
                                        Cita de 1 hora: <strong>{startTime} - {endTime}</strong>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-4 py-2.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50"
                        >
                            {loading ? "Guardando..." : "Guardar Cita"}
                        </button>
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
        </>
    );
};

export default CitaModal;
