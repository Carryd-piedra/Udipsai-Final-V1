import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import { especialistasService } from "../../services/especialistas";
import { pasantesService } from "../../services/pasantes";
import { toast } from "react-hot-toast";

interface SpecialistSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (specialist: any) => void;
    fixedSpecialtyId?: number;
}

const SpecialistSearchModal: React.FC<SpecialistSearchModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    fixedSpecialtyId,
}) => {
    const [criteria, setCriteria] = useState(fixedSpecialtyId ? "nombre" : "nombre");
    const [professionalType, setProfessionalType] = useState<"especialista" | "pasante">("especialista");
    const [search, setSearch] = useState("");
    const [specialists, setSpecialists] = useState<any[]>([]);


    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (fixedSpecialtyId) {
            setCriteria("nombre");
            // Auto-search when opening if fixed specialty is set?
            if (isOpen) {
                handleSearch();
            }
        }
    }, [fixedSpecialtyId, isOpen]);

    // Removed useEffect for loading specialties as manual search is disabled


    const handleSearch = async () => {
        if (!search && criteria !== 'especialidad' && !fixedSpecialtyId) {
            toast.error("Ingrese un término de búsqueda");
            return;
        }

        setLoading(true);
        setSearched(true);
        try {
            const filterParams: any = {
                size: 100 // Get enough results
            };

            if (fixedSpecialtyId) {
                filterParams.especialidadId = fixedSpecialtyId;
            }

            if (criteria === 'especialidad' && !fixedSpecialtyId) {
                // Search is the specialty ID
                filterParams.especialidadId = search;
            } else if (search) {
                filterParams.search = search;
            }

            // Use filtrar instead of buscar which seems missing/incorrect
            let response;
            if (professionalType === "especialista") {
                response = await especialistasService.filtrar(filterParams);
            } else {
                response = await pasantesService.filtrar(filterParams);
            }

            setSpecialists(response?.content || []);
        } catch (error) {
            console.error("Error searching specialists:", error);
            toast.error("Error al buscar especialistas");
            setSpecialists([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (specialist: any) => {
        onSelect(specialist);
        onClose();
        setSearch("");
        setSpecialists([]);
        setSearched(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Buscar Profesional
            </h3>

            {/* Type Toggle */}
            <div className="flex gap-4 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                <button
                    onClick={() => {
                        setProfessionalType("especialista");
                        setSpecialists([]);
                        setSearched(false);
                    }}
                    className={`pb-2 px-1 text-sm font-medium transition relative ${professionalType === "especialista"
                        ? "text-brand-600 dark:text-brand-400"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        }`}
                >
                    Especialistas
                    {professionalType === "especialista" && (
                        <div className="absolute bottom-[-9px] left-0 w-full h-0.5 bg-brand-600 dark:bg-brand-400 rounded-t-full"></div>
                    )}
                </button>
                <button
                    onClick={() => {
                        setProfessionalType("pasante");
                        setSpecialists([]);
                        setSearched(false);
                    }}
                    className={`pb-2 px-1 text-sm font-medium transition relative ${professionalType === "pasante"
                        ? "text-brand-600 dark:text-brand-400"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        }`}
                >
                    Pasantes
                    {professionalType === "pasante" && (
                        <div className="absolute bottom-[-9px] left-0 w-full h-0.5 bg-brand-600 dark:bg-brand-400 rounded-t-full"></div>
                    )}
                </button>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
                <select
                    value={criteria}
                    disabled={!!fixedSpecialtyId}
                    onChange={(e) => {
                        setCriteria(e.target.value);
                        setSearch("");
                        setSpecialists([]);
                        setSearched(false);
                    }}
                    className={`sm:w-1/3 rounded-lg border border-gray-300 px-3 py-2.5 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${fixedSpecialtyId ? 'opacity-50 cursor-not-allowed hidden' : ''}`}
                >
                    <option value="nombre">Por Nombre</option>
                    <option value="cedula">Por Cédula</option>
                </select>

                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        placeholder={criteria === 'cedula' ? "Ingrese Cédula..." : "Ingrese Nombre..."}
                    />

                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="px-6 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition disabled:opacity-50"
                    >
                        {loading ? "..." : "Buscar"}
                    </button>
                </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">
                            <th className="p-3 font-medium">Nombre</th>
                            <th className="p-3 font-medium">Especialidad</th>
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
                        ) : specialists.length > 0 ? (
                            specialists.map((specialist) => (
                                <tr
                                    key={specialist.id}
                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    <td className="p-3 text-gray-800 dark:text-gray-200">
                                        {/* Display Name logic consistent for both */}
                                        {specialist.nombresApellidos || `${specialist.nombres} ${specialist.apellidos}`}

                                        {/* Badge for Type */}
                                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${professionalType === 'especialista'
                                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                            }`}>
                                            {professionalType === 'especialista' ? 'Esp.' : 'Pas.'}
                                        </span>
                                    </td>
                                    <td className="p-3 text-gray-600 dark:text-gray-400">
                                        {specialist.especialidad?.area || specialist.especialidad?.nombre || "Sin especialidad"}
                                    </td>
                                    <td className="p-3 text-right">
                                        <button
                                            onClick={() => handleSelect(specialist)}
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
                                    No se encontraron profesionales
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

export default SpecialistSearchModal;
