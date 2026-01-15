import React, { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

interface CitaInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    cita: any; // Event/Cita object
    onDelete?: (id: string) => Promise<void>;
    onReschedule?: (id: string) => void;
    onMarkAsAttended?: (id: string) => Promise<void>;
    onMarkAsNotAttended?: (id: string) => Promise<void>;
}

const CitaInfoModal: React.FC<CitaInfoModalProps> = ({
    isOpen,
    onClose,
    cita,
    onDelete,
    onReschedule,
    onMarkAsAttended,
    onMarkAsNotAttended,
}) => {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    if (!cita) return null;

    // Props de la cita
    const extendedProps = cita?.extendedProps || {};
    const isPending = extendedProps.status === 'PENDIENTE';
    const isFaltaInjustificada = extendedProps.status === 'FALTA_INJUSTIFICADA';

    const handleDeleteClick = () => {
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        if (!onDelete) return;
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

    const handleStatusChange = async (action: () => Promise<void>) => {
        setLoading(true);
        try {
            await action();
            onClose();
        } catch (error) {
            console.error("Error updating status", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
            {!showConfirm ? (
                // --- VISTA DETALLES ---
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
                            <div className="mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase
                                    ${extendedProps.status === 'PENDIENTE' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                                        extendedProps.status === 'FINALIZADA' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                            extendedProps.status === 'NO_JUSTIFICADA' || extendedProps.status === 'CANCELADA' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                                'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                    }`}>
                                    {extendedProps.status === 'NO_JUSTIFICADA' ? 'NO JUSTIFICADA' : (extendedProps.status || 'PENDIENTE')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
<<<<<<< HEAD
                    <div className="flex flex-col gap-3 mt-6">
                        <div className="flex justify-end gap-3 transition-opacity">
                            {/* Reagendar: Solo si es Pendiente o Falta Injustificada */}
                            {(isPending || isFaltaInjustificada) && onReschedule && (
=======
                    <div className="flex justify-end gap-3 mt-6">
                        {/* Mostrar Finalizar (Asistido) si es PENDIENTE o NO_JUSTIFICADA */}
                        {(extendedProps.status === 'PENDIENTE' ||
                            extendedProps.status === 'NO_JUSTIFICADA') && onMarkAsAttended && (
>>>>>>> Diego
                                <Button
                                    variant="outline"
                                    className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20"
                                    onClick={() => onReschedule(cita.id)}
                                >
<<<<<<< HEAD
                                    Reagendar
                                </Button>
                            )}

                            <Button
                                variant="outline"
                                onClick={onClose}
                            >
                                Cerrar
                            </Button>
                        </div>

                        {(isPending || isFaltaInjustificada || extendedProps.status === 'NO_ASISTIDO') && (
                            <div className="border-t pt-4 flex justify-between items-center">
                                <span className="text-xs text-gray-400">Acciones rápidas</span>
                                <div className="flex gap-2">
                                    {onMarkAsAttended && (
                                        <Button
                                            variant="outline"
                                            className="text-green-600 border-transparent hover:text-green-700 hover:bg-green-50 px-3 py-1.5 h-auto text-sm"
                                            onClick={() => handleStatusChange(() => onMarkAsAttended(cita.id))}
                                            disabled={loading}
                                        >
                                            ✓ Asistió
                                        </Button>
                                    )}
                                    {(isPending || extendedProps.status === 'FINALIZADA' || extendedProps.status === 'ASISTIDO') && onMarkAsNotAttended && (
                                        <Button
                                            variant="outline"
                                            className="text-red-600 border-transparent hover:text-red-700 hover:bg-red-50 px-3 py-1.5 h-auto text-sm"
                                            onClick={() => handleStatusChange(() => onMarkAsNotAttended(cita.id))}
                                            disabled={loading}
                                        >
                                            ✕ No Asistió
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}

                        {isPending && onDelete && (
                            <div className="flex justify-start mt-2">
                                <button
                                    onClick={handleDeleteClick}
                                    className="text-xs text-red-500 hover:text-red-700 underline"
                                >
                                    Cancelar Cita
                                </button>
                            </div>
                        )}

=======
                                    Finalizar Cita
                                </Button>
                            )}

                        {/* Mostrar No Justificada si es PENDIENTE o FINALIZADA */}
                        {(extendedProps.status === 'PENDIENTE' ||
                            extendedProps.status === 'FINALIZADA') && onMarkAsNotAttended && (
                                <Button
                                    variant="danger"
                                    onClick={() => handleStatusChange(() => onMarkAsNotAttended(cita.id))}
                                    disabled={loading}
                                >
                                    No Justificada
                                </Button>
                            )}

                        {/* Boton Reagendar */}
                        {(extendedProps.status === 'PENDIENTE' || extendedProps.status === 'NO_JUSTIFICADA') && onReschedule && (
                            <Button
                                variant="outline"
                                className="!border-blue-600 !text-blue-600 hover:!bg-blue-50 dark:!border-blue-400 dark:!text-blue-400 dark:hover:!bg-blue-900/20"
                                onClick={() => onReschedule(cita.id)}
                            >
                                Reagendar
                            </Button>
                        )}

                        {/* Boton Cerrar siempre visible si no hay acciones de gestion primaria */}
                        <Button
                            variant="outline"
                            onClick={onClose}
                        >
                            Cerrar
                        </Button>
>>>>>>> Diego
                    </div>
                </>
            ) : (
                // --- VISTA CONFIRMAR ELIMINACIÓN ---
                <div className="text-center py-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4 dark:bg-red-900/30">
                        <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2"> ¿Cancelar esta cita?</h3>
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
