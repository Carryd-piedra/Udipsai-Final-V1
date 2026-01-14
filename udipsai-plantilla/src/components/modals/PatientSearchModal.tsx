import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { pacientesService } from "../../services/pacientes";
import { toast } from "react-hot-toast";

interface PatientSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (patient: any) => void;
}

const PatientSearchModal: React.FC<PatientSearchModalProps> = ({
    isOpen,
    onClose,
    onSelect,
}) => {
    const [search, setSearch] = useState("");
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (search.length < 3) {
            toast.error("Ingrese al menos 3 caracteres");
            return;
        }

        setLoading(true);
        setSearched(true);
        try {
            const response = await pacientesService.filtrar({ search });
            setPatients(response.content || []); // Handle paginated or list
        } catch (error) {
            console.error("Error searching patients:", error);
            toast.error("Error al buscar pacientes");
            setPatients([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (patient: any) => {
        onSelect(patient);
        onClose();
        setSearch("");
        setPatients([]);
        setSearched(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Buscar Paciente
            </h3>

            {/* Search Bar */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    placeholder="Nombre o Cédula..."
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-6 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition disabled:opacity-50"
                >
                    {loading ? "Buscando..." : "Buscar"}
                </button>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">
                            <th className="p-3 font-medium">Nombre</th>
                            <th className="p-3 font-medium">Cédula</th>
                            <th className="p-3 font-medium text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="p-4 text-center text-gray-500">
                                    Cargando resultados...
                                </td>
                            </tr>
                        ) : patients.length > 0 ? (
                            patients.map((patient) => (
                                <tr
                                    key={patient.id}
                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    <td className="p-3 text-gray-800 dark:text-gray-200">
                                        {patient.nombresApellidos}
                                    </td>
                                    <td className="p-3 text-gray-600 dark:text-gray-400">
                                        {patient.cedula}
                                    </td>
                                    <td className="p-3 text-right">
                                        <button
                                            onClick={() => handleSelect(patient)}
                                            className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                                        >
                                            Seleccionar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : searched ? (
                            <tr>
                                <td colSpan={3} className="p-4 text-center text-gray-500">
                                    No se encontraron pacientes
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                    Cerrar
                </button>
            </div>
        </Modal>
    );
};

export default PatientSearchModal;
