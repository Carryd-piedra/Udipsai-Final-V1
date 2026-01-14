import React, { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

interface CitaInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    cita: any; // Event/Cita object
    onDelete: (id: string) => Promise<void>;
    onReschedule: (id: string) => void;
}

const CitaInfoModal: React.FC<CitaInfoModalProps> = ({
    isOpen,
    onClose,
    cita,
    onDelete,
    onReschedule,
}) => {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    if (!cita) return null;

    const handleDeleteClick = () => {
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        setLoading(true);
        try {
            await onDelete(cita.id);
            onClose();
        } catch (error) {
            console.error("Error deleting cita", error);
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    const extendedProps = cita?.extendedProps || {};

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
            {!showConfirm ? (
                <>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                        Detalles de Cita
                    </h3>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase">Paciente</label>
                            <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                                {cita?.title || "Sin Nombre"}
                            </p>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase">Especialidad</label>
                            <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
                                {extendedProps.specialty || "General"}
                            </p>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase">Especialista</label>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {extendedProps.specialist || "Sin Asignar"}
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase">Fecha</label>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {cita?.start ? new Date(cita.start).toLocaleDateString() : '-'}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase">Hora</label>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {cita?.start ? new Date(cita.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                    {' - '}
                                    {cita?.end ? new Date(cita.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase">Estado</label>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {extendedProps.status || 'PENDIENTE'}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => onReschedule(cita.id)}
                            disabled={loading}
                        >
                            Reagendar
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteClick}
                            disabled={loading}
                        >
                            Cancelar Cita
                        </Button>
                    </div>
                </>
            ) : (
                <div className="text-center py-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4 dark:bg-red-900/30">
                        <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">¿Cancelar esta cita?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Esta acción no se puede deshacer. La cita será eliminada permanentemente del calendario.
                    </p>
                    <div className="flex justify-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowConfirm(false)}
                        >
                            No, Volver
                        </Button>
                        <Button
                            variant="danger"
                            onClick={confirmDelete}
                            disabled={loading}
                        >
                            {loading ? "Cancelando..." : "Sí, Cancelar"}
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default CitaInfoModal;
