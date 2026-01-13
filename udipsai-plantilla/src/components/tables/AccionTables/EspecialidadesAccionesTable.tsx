import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import { toast } from "react-toastify";
import { especialidadesService, EspecialidadCriteria } from "../../../services/especialidades";
import Button from "../../ui/button/Button";
import { DeleteModal } from "../../ui/modal/DeleteModal";
import { useModal } from "../../../hooks/useModal";
import { TableActionHeader } from "../../common/TableActionHeader";
import Label from "../../form/Label";
import Select from "../../form/Select";
import { Pagination } from "../../ui/Pagination";
import { Pencil, Trash, Info } from "lucide-react";
import { EspecialidadModal } from "../../modals/EspecialidadModal";
import { useAuth } from "../../../context/AuthContext";

interface Especialidades {
  id: number;
  area: string;
  activo: boolean;
}

export default function EspecialidadesAccionesTable() {
  const [especialidades, setEspecialidades] = useState<Especialidades[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState<EspecialidadCriteria>({});
  const [tempFilters, setTempFilters] = useState<EspecialidadCriteria>({});
  
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");

  const {
    isOpen: isModalOpen,
    openModal: openEspecialidadModal,
    closeModal: closeEspecialidadModal,
  } = useModal();

  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const [currentEspecialidad, setCurrentEspecialidad] = useState<Especialidades | null>(null);
  const [especialidadesToDelete, setEspecialidadesToDelete] = useState<number | null>(null);

  const fetchEspecialidades = async (
    page = currentPage,
    search = searchTerm,
    currentFilters = filters,
    currentSortField = sortField,
    currentSortDirection = sortDirection
  ) => {
    try {
      setLoading(true);
      const sort = `${currentSortField},${currentSortDirection}`;
      const hasFilters = Object.values(currentFilters).some(val => val !== undefined && val !== "") || !!search;

      let data;
      if (hasFilters) {
         const criteria: EspecialidadCriteria = {
            ...currentFilters,
            search: search || undefined
         };
         data = await especialidadesService.filtrar(criteria, page, pageSize, sort);
      } else {
         data = await especialidadesService.listarActivos(page, pageSize, sort);
      }

      if (data?.content && Array.isArray(data.content)) {
        setEspecialidades(data.content);
        setTotalPages(data.totalPages);
      } else if (Array.isArray(data)) {
        setEspecialidades(data);
        setTotalPages(1);
      } else {
        setEspecialidades([]);
      }
    } catch (error) {
      console.error("Error fetching especialidades:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  }, [currentPage, sortField, sortDirection, filters, searchTerm]);

  const getEstadoBadge = (activo: boolean) => {
    return activo ? "success" : "error";
  };

  // Handlers
  const handleCreate = () => {
    setCurrentEspecialidad(null);
    openEspecialidadModal();
  };

  const handleEdit = (especialidad: Especialidades) => {
    setCurrentEspecialidad(especialidad);
    openEspecialidadModal();
  };

  const handleDelete = (id: number) => {
    setEspecialidadesToDelete(id);
    openDeleteModal();
  };

  const confirmDelete = async () => {
    if (especialidadesToDelete) {
      try {
        await especialidadesService.eliminar(especialidadesToDelete);
        toast.success("Especialidad eliminada correctamente");
        await fetchEspecialidades();
        closeDeleteModal();
        setEspecialidadesToDelete(null);
      } catch (error) {
        toast.error("Error al eliminar especialidad");
        console.error("Error deleting especialidad:", error);
      }
    }
  };

  const handleSave = async (especialidad: any) => {
    try {
      if ("id" in especialidad) {
        await especialidadesService.actualizar(especialidad.id, especialidad);
        toast.success("Especialidad actualizada correctamente");
      } else {
        await especialidadesService.crear(especialidad);
        toast.success("Especialidad creada correctamente");
      }
      await fetchEspecialidades();
      closeEspecialidadModal();
    } catch (error) {
      toast.error("Error al guardar especialidad");
      console.error("Error saving especialidad:", error);
    }
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
    // Implement export logic here
  };

  const { permissions } = useAuth();

  return (
    <div>
      <TableActionHeader
        title="Especialidades"
        onSearchClick={handleSearch}
        onNew={permissions.includes("PERM_ESPECIALIDADES_CREAR") ? handleCreate : undefined}
        newButtonText="Agregar"
        onExport={handleExport}
        onFilterApply={handleApplyFilters}
        onFilterClear={handleClearFilters}
        filterContent={
          <div className="space-y-4">
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
                    { value: "area", label: "Área" },
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
                Id
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
              >
                Área / Especialidad
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
                <TableCell
                  colSpan={4}
                  className="px-5 py-20 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">
                      Cargando especialidades...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : especialidades.length > 0 ? (
              especialidades.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                    {item.id}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                    {item.area}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                    <Badge size="sm" color={getEstadoBadge(item.activo)}>
                      {item.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                    <div className="flex justify-center gap-2">
                      {permissions.includes("PERM_ESPECIALIDADES_EDITAR") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                          className="hover:bg-white hover:text-yellow-600 p-2 text-blue-600 dark:text-blue-400"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </Button>
                      )}
                      {permissions.includes("PERM_ESPECIALIDADES_ELIMINAR") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(item.id)}
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
                  colSpan={4}
                  className="px-5 py-10 text-center text-theme-md text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-gray-400 dark:text-gray-600">
                      <Info size={30} strokeWidth={1} />
                    </span>
                    <p>No se encontraron especialidades registradas</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <EspecialidadModal
        isOpen={isModalOpen}
        onClose={closeEspecialidadModal}
        onSave={handleSave}
        initialData={currentEspecialidad}
        title={currentEspecialidad ? "Editar Especialidad" : "Nueva Especialidad"}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Eliminar Especialidad"
        description={`¿Estás seguro de que deseas eliminar la especialidad?`}
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
