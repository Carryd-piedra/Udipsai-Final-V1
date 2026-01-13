import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Pen, Trash, Info } from "lucide-react";
import Badge from "../../ui/badge/Badge";
import { toast } from "react-toastify";
import {
  EspecialistaCriteria,
  especialistasService,
} from "../../../services/especialistas";
import { sedesService } from "../../../services/sedes";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Select from "../../form/Select";
import { Pagination } from "../../ui/Pagination";
import { useModal } from "../../../hooks/useModal";
import { DeleteModal } from "../../ui/modal/DeleteModal";
import { TableActionHeader } from "../../common/TableActionHeader";
import { useAuth } from "../../../context/AuthContext";
import { especialidadesService } from "../../../services/especialidades";

interface Especialista {
  id: number;
  cedula: string;
  nombresApellidos: string;
  fotoUrl: string | null;
  especialidad: {
    id: number;
    area: string;
  };
  sede: {
    id: number;
    nombre: string;
  };
  activo: boolean;
}

export default function EspecialistasAccionesTable() {
  const [especialistas, setEspecialistas] = useState<Especialista[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEspecialista, setSelectedEspecialista] =
    useState<Especialista | null>(null);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState<EspecialistaCriteria>({});
  const [tempFilters, setTempFilters] = useState<EspecialistaCriteria>({});

  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");

  const [sedes, setSedes] = useState<any[]>([]);
  const [especialidades, setEspecialidades] = useState<any[]>([]);

  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const fetchEspecialistas = async (
    page = currentPage,
    search = searchTerm,
    currentFilters = filters,
    currentSortField = sortField,
    currentSortDirection = sortDirection
  ) => {
    try {
      setLoading(true);
      const sort = `${currentSortField},${currentSortDirection}`;
      const hasFilters =
        Object.values(currentFilters).some(
          (val) => val !== undefined && val !== ""
        ) || !!search;

      let data;
      if (hasFilters) {
        const criteria: EspecialistaCriteria = {
          ...currentFilters,
          search: search || undefined,
        };
        data = await especialistasService.filtrar(
          criteria,
          page,
          pageSize,
          sort
        );
      } else {
        data = await especialistasService.listarActivos(page, pageSize, sort);
      }

      if (data?.content && Array.isArray(data.content)) {
        setEspecialistas(data.content);
        setTotalPages(data.totalPages);
      } else if (Array.isArray(data)) {
        setEspecialistas(data);
        setTotalPages(1);
      } else {
        setEspecialistas([]);
      }
    } catch (error) {
      console.error("Error fetching especialistas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [sedesRes, especialidadesRes] = await Promise.all([
          sedesService.listarActivos(0, 100),
          especialidadesService.listarActivos(0, 100),
        ]);
        setSedes(sedesRes?.content || []);
        setEspecialidades(especialidadesRes?.content || []);
      } catch (error) {
        console.error("Error al cargar sedes:", error);
      }
    };
    loadFilterData();
  }, []);

  useEffect(() => {
    fetchEspecialistas();
  }, [currentPage, sortField, sortDirection, filters, searchTerm]);

  const handleEdit = (id: number) => {
    navigate(`/especialistas/editar/${id}`);
  };

  const handleDeleteClick = (especialista: Especialista) => {
    setSelectedEspecialista(especialista);
    openDeleteModal();
  };

  const handleConfirmDelete = async () => {
    if (selectedEspecialista) {
      try {
        await especialistasService.eliminar(selectedEspecialista.id);
        toast.success("Especialista eliminado correctamente");
        await fetchEspecialistas();
        closeDeleteModal();
        setSelectedEspecialista(null);
      } catch (error) {
        toast.error("Error al eliminar especialista");
        console.error("Error al eliminar especialista:", error);
      }
    }
  };

  const getEstadoBadge = (estado: boolean) => {
    return estado === true ? "success" : "error";
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(0);
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setTempFilters({});
    setFilters({});
    setCurrentPage(0);
  };

  const handleExport = () => {
    console.log("Exporting data...");
  };

  const { permissions } = useAuth();

  return (
    <div>
      <TableActionHeader
        title="Especialistas"
        onSearchClick={handleSearch}
        onNew={
          permissions.includes("PERM_ESPECIALISTAS")
            ? () => navigate("/especialistas/nuevo")
            : undefined
        }
        newButtonText="Agregar"
        onExport={handleExport}
        onFilterApply={handleApplyFilters}
        onFilterClear={handleClearFilters}
        filterContent={
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 text-xs">Sede</Label>
              <Select
                options={sedes.map((s) => ({
                  value: s.id.toString(),
                  label: s.nombre,
                }))}
                placeholder="Todas las sedes"
                value={tempFilters.sedeId?.toString() || ""}
                onChange={(val) =>
                  setTempFilters({
                    ...tempFilters,
                    sedeId: val ? parseInt(val) : undefined,
                  })
                }
                className="h-9 text-xs"
              />
            </div>
            <div>
              <Label className="mb-1.5 text-xs">Especialidad</Label>
              <Select
                options={especialidades.map((e) => ({
                  value: e.id.toString(),
                  label: e.area,
                }))}
                placeholder="Todas"
                value={tempFilters.especialidadId?.toString() || ""}
                onChange={(val) =>
                  setTempFilters({
                    ...tempFilters,
                    especialidadId: val ? parseInt(val) : undefined,
                  })
                }
                className="h-9 text-xs"
              />
            </div>
            <div>
              <Label className="mb-1.5 text-xs">Estado</Label>
              <Select
                options={[
                  { value: "true", label: "Activo" },
                  { value: "false", label: "Inactivo" },
                ]}
                placeholder="Todos"
                value={
                  tempFilters.activo === undefined
                    ? ""
                    : tempFilters.activo.toString()
                }
                onChange={(val) =>
                  setTempFilters({
                    ...tempFilters,
                    activo: val === "" ? undefined : val === "true",
                  })
                }
                className="h-9 text-xs"
              />
            </div>
            <div>
              <Label className="mb-1.5 text-xs">Orden</Label>
              <div className="flex gap-2">
                <Select
                  options={[
                    { value: "id", label: "Registro (ID)" },
                    { value: "nombresApellidos", label: "Nombre" },
                    { value: "cedula", label: "Cédula" },
                  ]}
                  value={sortField}
                  onChange={(val) => setSortField(val)}
                  className="h-9 text-xs flex-1"
                />
                <Select
                  options={[
                    { value: "asc", label: "Asc" },
                    { value: "desc", label: "Desc" },
                  ]}
                  value={sortDirection}
                  onChange={(val) => setSortDirection(val)}
                  className="h-9 text-xs w-24"
                />
              </div>
            </div>
          </div>
        }
      />
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Cédula
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Nombres
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Especialidad
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Sede
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
            {/* Table Body */}
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="px-5 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                      <p className="text-slate-500 font-medium animate-pulse">
                        Cargando especialistas...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : especialistas.length > 0 ? (
                especialistas.map((especialista) => (
                  <TableRow key={especialista.id}>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      {especialista.cedula}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      {especialista.nombresApellidos}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      {especialista.especialidad?.area || "N/A"}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      {especialista.sede?.nombre || "N/A"}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      <Badge
                        size="sm"
                        color={getEstadoBadge(especialista.activo)}
                      >
                        {especialista.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      <div className="flex justify-center gap-2">
                        {permissions.includes("PERM_ESPECIALISTAS") && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(especialista.id)}
                            className="hover:bg-white hover:text-yellow-600 p-2 text-blue-600 dark:text-blue-400"
                            title="Editar"
                          >
                            <Pen size={14} />
                          </Button>
                        )}
                        {permissions.includes(
                          "PERM_ESPECIALISTAS"
                        ) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteClick(especialista)}
                              className="hover:bg-red-500 hover:text-white p-2 text-red-600 dark:text-red-400"
                              title="Eliminar"
                            >
                              <Trash size={14} />
                            </Button>
                          )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-5 py-10 text-center text-theme-md text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-gray-400 dark:text-gray-600">
                        <Info size={30} strokeWidth={1} />
                      </span>
                      <p>No se encontraron especialistas registrados</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Eliminar Especialista"
          description={`¿Estás seguro de que deseas eliminar al especialista ${selectedEspecialista?.nombresApellidos}? Esta acción no se puede deshacer.`}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
