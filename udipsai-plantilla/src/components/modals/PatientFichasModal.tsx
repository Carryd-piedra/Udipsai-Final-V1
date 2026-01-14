import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { useNavigate } from "react-router";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../ui/table";
import Button from "../ui/button/Button";
import { pacientesService } from "../../services/pacientes";
import { FileText, Plus, Eye, Pen, Trash, Download } from "lucide-react";
import { toast } from "react-toastify";
import Badge from "../ui/badge/Badge";

interface Paciente {
  id: number;
  nombresApellidos: string;
}

interface FichaResumen {
  totalFichas: number;
  fichas: Record<string, number>;
}

interface PatientFichasModalProps {
  isOpen: boolean;
  onClose: () => void;
  paciente: Paciente | null;
}

const FILE_TYPES = [
  {
    id: "historia-clinica",
    label: "Historia Clínica",
    internalName: "Historia Clínica",
  },
  {
    id: "psicologia-educativa",
    label: "Psicología Educativa",
    internalName: "Psicología Educativa",
  },
  {
    id: "psicologia-clinica",
    label: "Psicología Clínica",
    internalName: "Psicología Clínica",
  },
  {
    id: "fonoaudiologia",
    label: "Fonoaudiología",
    internalName: "Fonoaudiología",
  },
];

export const PatientFichasModal: React.FC<PatientFichasModalProps> = ({
  isOpen,
  onClose,
  paciente,
}) => {
  const navigate = useNavigate();
  const [resumen, setResumen] = useState<FichaResumen | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchResumen = async () => {
    if (!paciente) return;
    try {
      setLoading(true);
      const data = await pacientesService.obtenerResumenFichas(paciente.id);
      setResumen(data);
    } catch (error) {
      console.error("Error al obtener resumen de fichas:", error);
      toast.error("Error al cargar el resumen de fichas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && paciente) {
      fetchResumen();
    }
  }, [isOpen, paciente]);

  if (!paciente) return null;

  const getFileStatus = (internalName: string) => {
    return (
      resumen?.fichas &&
      resumen.fichas[internalName] !== undefined
    );
  };

  const handleAction = (action: string, fileType: string, internalName: string) => {
    if (action === "Crear") {
      navigate(`/${fileType}/nuevo?pacienteId=${paciente.id}`);
      onClose();
      return;
    }
    if (action === "Editar") {
      const fichaId = resumen?.fichas?.[internalName];
      if (fichaId) {
        navigate(`/${fileType}/editar/${fichaId}`);
        onClose();
      } else {
        toast.error("No se pudo obtener el ID de la ficha");
      }
      return;
    }
    console.log(`${action} - ${fileType} for patient ${paciente.id}`);
    toast.info(`${action}: Funcionalidad en desarrollo para ${fileType}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[800px] p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Fichas de {paciente.nombresApellidos}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Resumen de documentos clínicos vinculados al paciente
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse text-lg">
            Cargando resumen de fichas...
          </p>
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
                >
                  Tipo de Ficha
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
                >
                  Estado
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {FILE_TYPES.map((file) => {
                const exists = getFileStatus(file.internalName);
                return (
                  <TableRow key={file.id}>
                    <TableCell className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-gray-400" />
                        {file.label}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <Badge color={exists ? "success" : "warning"}>
                        {exists ? "Completada" : "Pendiente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {exists ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction("Ver", file.id, file.internalName)}
                              className="hover:bg-white hover:text-blue-600 p-2 text-dark dark:text-white-400 dark:hover:text-blue-600"
                              title="Ver"
                            >
                              <Eye size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction("Editar", file.id, file.internalName)}
                              className="hover:bg-white hover:text-yellow-600 p-2 text-dark dark:text-white-400 dark:hover:text-yellow-600"
                              title="Editar"
                            >
                              <Pen size={14} />
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction("Exportar", file.id, file.internalName)}
                              className="hover:bg-white hover:text-green-600 p-2 text-dark dark:text-white-400 dark:hover:text-green-600"
                              title="Exportar"
                            >
                              <Download size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction("Eliminar", file.id, file.internalName)}
                              className="hover:bg-red-500 hover:text-white p-2 text-red-600 dark:text-red-400 dark:hover:text-red-400"
                              title="Eliminar"
                            >
                              <Trash size={14} />
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction("Crear", file.id, file.internalName)}
                            className="hover:bg-white hover:text-green-600 p-2 text-dark dark:text-white-400 dark:hover:text-green-600"
                          >
                            <Plus size={14} />
                            Crear ficha
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Button variant="primary" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </Modal>
  );
};
