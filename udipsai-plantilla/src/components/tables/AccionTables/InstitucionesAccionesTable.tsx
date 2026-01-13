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
import {
  institucionesService,
  InstitucionEducativaCriteria,
} from "../../../services/instituciones";
import Button from "../../ui/button/Button";
import { DeleteModal } from "../../ui/modal/DeleteModal";
import { useModal } from "../../../hooks/useModal";
import { TableActionHeader } from "../../common/TableActionHeader";
import { InstitucionModal } from "../../modals/InstitucionModal";
import Label from "../../form/Label";
import Select from "../../form/Select";
import { Pagination } from "../../ui/Pagination";
import { Pencil, Trash, Info } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

interface Institucion {
  id: number;
  nombre: string;
  direccion: string;
  tipo: string;
  activo: boolean;
}

export default function InstitucionesTable() {
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState<InstitucionEducativaCriteria>({});
  const [tempFilters, setTempFilters] = useState<InstitucionEducativaCriteria>(
    {}
  );

  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");

  const {
    isOpen: isModalOpen,
    openModal: openInstitucionModal,
    closeModal: closeInstitucionModal,
  } = useModal();

  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const [currentInstitucion, setCurrentInstitucion] =
    useState<Institucion | null>(null);
  const [institucionToDelete, setInstitucionToDelete] = useState<number | null>(
    null
  );

  const fetchInstituciones = async (
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
        const criteria: InstitucionEducativaCriteria = {
          ...currentFilters,
          search: search || undefined,
        };
        data = await institucionesService.filtrar(
          criteria,
          page,
          pageSize,
          sort
        );
      } else {
        data = await institucionesService.listarActivos(page, pageSize, sort);
      }

      if (data?.content && Array.isArray(data.content)) {
        setInstituciones(data.content);
        setTotalPages(data.totalPages);
      } else if (Array.isArray(data)) {
        setInstituciones(data);
        setTotalPages(1);
      } else {
        setInstituciones([]);
      }
    } catch (error) {
      console.error("Error fetching instituciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstituciones();
  }, [currentPage, sortField, sortDirection, filters, searchTerm]);

  const getEstadoBadge = (estado: boolean) => {
    return estado ? "success" : "error";
  };

  const handleCreate = () => {
    setCurrentInstitucion(null);
    openInstitucionModal();
  };

  const handleEdit = (institucion: Institucion) => {
    setCurrentInstitucion(institucion);
    openInstitucionModal();
  };

  const handleDelete = (id: number) => {
    setInstitucionToDelete(id);
    openDeleteModal();
  };

  const confirmDelete = async () => {
    if (institucionToDelete) {
      try {
        await institucionesService.eliminar(institucionToDelete);
        toast.success("Institución eliminada correctamente");
        await fetchInstituciones();
        closeDeleteModal();
        setInstitucionToDelete(null);
      } catch (error) {
        toast.error("Error al eliminar la institución");
        console.error("Error deleting institucion:", error);
      }
    }
  };

  const handleSave = async (institucion: any) => {
    try {
      if ("id" in institucion) {
        await institucionesService.actualizar(institucion.id, institucion);
        toast.success("Institución actualizada correctamente");
      } else {
        await institucionesService.crear(institucion);
        toast.success("Institución creada correctamente");
      }
      await fetchInstituciones();
      closeInstitucionModal();
    } catch (error) {
      toast.error("Error al guardar la institución");
      console.error("Error saving institucion:", error);
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
        title="Instituciones Educativas"
        onSearchClick={handleSearch}
        onNew={permissions.includes("PERM_INSTITUCIONES_EDUCATIVAS_CREAR") ? handleCreate : undefined}
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
                    { value: "nombre", label: "Nombre" },
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
                  Id de institución
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Nombre de la institución
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Dirección
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Tipo de institución
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
                        Cargando instituciones...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : instituciones.length > 0 ? (
                instituciones.map((institucion) => (
                  <TableRow key={institucion.id}>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      {institucion.id}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      {institucion.nombre}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      {institucion.direccion}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      {institucion.tipo}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      <Badge
                        size="sm"
                        color={getEstadoBadge(institucion.activo)}
                      >
                        {institucion.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      <div className="flex justify-center gap-2">
                        {permissions.includes("PERM_INSTITUCIONES_EDUCATIVAS_EDITAR") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(institucion)}
                            title="Editar"
                            className="hover:bg-white hover:text-yellow-600 p-2 text-blue-600 dark:text-blue-400"
                          >
                            <Pencil size={14} />
                          </Button>
                        )}
                        {permissions.includes("PERM_INSTITUCIONES_EDUCATIVAS_ELIMINAR") && (
                          <Button
                            variant="outline"
                            className="hover:bg-red-500 hover:text-white p-2 text-red-600 hover:text-red-700 dark:text-red-400"
                            size="sm"
                            onClick={() => handleDelete(institucion.id)}
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
                      <p>No se encontraron instituciones registradas</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <InstitucionModal
          isOpen={isModalOpen}
          onClose={closeInstitucionModal}
          onSave={handleSave}
          initialData={currentInstitucion}
          title={
            currentInstitucion ? "Editar Institución" : "Nueva Institución"
          }
        />

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          title="Eliminar Institución"
          description={`¿Estás seguro de que deseas eliminar la institución?`}
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
