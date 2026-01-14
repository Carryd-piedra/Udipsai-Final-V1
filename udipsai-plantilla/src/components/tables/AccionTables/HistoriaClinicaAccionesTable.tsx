
import { useEffect, useState } from "react";
import { fichasService } from "../../../services/fichas";
import { TableActionHeader } from "../../common/TableActionHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Badge from "../../ui/badge/Badge";
import { useAuth } from "../../../context/AuthContext";
import { DeleteModal } from "../../ui/modal/DeleteModal";

interface FichaListDTO {
  id: number;
  paciente: {
    id: number;
    nombres: string;
    apellidos: string;
    cedula: string;
    email: string;
  };
  activo: boolean;
}

export default function HistoriaClinicaAccionesTable() {
  const [fichas, setFichas] = useState<FichaListDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fichaToDelete, setFichaToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadFichas();
  }, []);

  const loadFichas = async () => {
    try {
      setLoading(true);
      const data = await fichasService.listarHistoriaClinica();
      setFichas(data);
    } catch (error) {
      console.error("Error loading fichas:", error);
      toast.error("Error al cargar las fichas");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setFichaToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (fichaToDelete) {
      try {
        await fichasService.eliminarHistoriaClinica(fichaToDelete);
        toast.success("Ficha eliminada correctamente");
        loadFichas();
      } catch (error) {
        console.error("Error deleting ficha:", error);
        toast.error("Error al eliminar la ficha");
      } finally {
        setShowDeleteModal(false);
        setFichaToDelete(null);
      }
    }
  };

  const filteredFichas = fichas.filter((ficha) => {
    const searchLower = searchTerm.toLowerCase();
    const nombreCompleto =
      `${ficha.paciente.nombres} ${ficha.paciente.apellidos}`.toLowerCase();
    const cedula = ficha.paciente.cedula.toLowerCase();
    return nombreCompleto.includes(searchLower) || cedula.includes(searchLower);
  });

  return (
    <div className="space-y-6">
      <TableActionHeader
        title="Fichas de Historia Clínica"
        onSearchClick={setSearchTerm}
      />

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Paciente
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Estado
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="relative min-h-[400px]">
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="px-5 py-20 text-center"
                  >
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                      <p className="text-slate-500 font-medium animate-pulse">
                        Cargando fichas...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredFichas.length > 0 ? (
                filteredFichas.map((ficha) => (
                  <TableRow
                    key={ficha.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                  >
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-slate-900">
                          {ficha.paciente.nombres} {ficha.paciente.apellidos}
                        </span>
                        <span className="text-sm text-slate-500">
                          {ficha.paciente.cedula}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      <Badge
                        variant="light"
                        color={ficha.activo ? "success" : "error"}
                      >
                        {ficha.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      <div className="flex justify-center gap-2">
                        {hasPermission("PERM_HISTORIA_CLINICA_EDITAR") && (
                          <button
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            onClick={() =>
                              navigate(
                                `/historia-clinica/editar/${ficha.paciente.id}`
                              )
                            }
                          >
                            Editar
                          </button>
                        )}
                        {hasPermission("PERM_HISTORIA_CLINICA_ELIMINAR") && (
                          <button
                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                            onClick={() => handleDeleteClick(ficha.id)}
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="px-5 py-10 text-center text-theme-md text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-gray-400 dark:text-gray-600">
                        No se encontraron registros
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description="¿Está seguro que desea eliminar esta ficha? Esta acción no se puede deshacer."
      />
    </div>
  );
}
