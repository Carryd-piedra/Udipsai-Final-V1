import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import DatePicker from "../form/date-picker";
import FileInput from "../form/input/FileInput";
import { SeguimientoDTO } from "../../services/seguimientos";
import { toast } from "react-toastify";
import TextArea from "../form/input/TextArea";
import Select from "../form/Select";
import { especialistasService } from "../../services";

interface SeguimientoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any, file?: File) => Promise<void>;
  initialData: SeguimientoDTO | null;
  pacienteId: number;
  especialistaId?: number;
}

export const SeguimientoForm: React.FC<SeguimientoFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  pacienteId,
  especialistaId,
}) => {
  const [fecha, setFecha] = useState<Date>(new Date());
  const [observacion, setObservacion] = useState("");
  const [selectedEspecialistaId, setSelectedEspecialistaId] = useState<number | string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [especialistas, setEspecialistas] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      getEspecialistas();
      if (initialData) {
        setFecha(new Date(initialData.fecha));
        setObservacion(initialData.observacion);
        setSelectedEspecialistaId(initialData.especialista.id);
      } else {
        setFecha(new Date());
        setObservacion("");
        setSelectedEspecialistaId(especialistaId || "");
        setFile(null);
      }
    }
  }, [isOpen, initialData, especialistaId]);

  const getEspecialistas = async () => {
      try {
        const data = await especialistasService.listarActivos(0, 100);
        setEspecialistas(data?.content || []);
      } catch (error) {
        console.error("Error fetching especialistas:", error);
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEspecialistaId) {
      toast.error("El especialista es requerido");
      return;
    }

    if (!observacion.trim()) {
      toast.error("La observación es requerida");
      return;
    }

    try {
      setLoading(true);
      const data = {
        pacienteId,
        especialistaId: Number(selectedEspecialistaId),
        fecha: fecha.toISOString(),
        observacion,
        activo: true,
      };

      await onSave(data, file || undefined);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const optionsEspecialistas = especialistas.map((esp) => ({
    value: String(esp.id),
    label: esp.nombresApellidos,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {initialData ? "Editar Seguimiento" : "Nuevo Seguimiento"}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {initialData
            ? "Modifica los datos del seguimiento"
            : "Registra un nuevo evento de seguimiento"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="especialista">Especialista</Label>
          <div className="mt-1">
            <Select
              options={optionsEspecialistas}
              placeholder="Seleccione un especialista"
              onChange={(value) => setSelectedEspecialistaId(value)}
              value={String(selectedEspecialistaId)}
            />
          </div>
        </div>
        <div>
          <Label>Fecha</Label>
          <div className="mt-1">
            <DatePicker
              id="fecha-seguimiento"
              defaultDate={fecha}
              onChange={(dates: Date[]) => {
                if (dates && dates.length > 0) {
                  setFecha(dates[0]);
                }
              }}
            />
          </div>
        </div>

        <div>
          <Label>Observación</Label>
          <TextArea
            value={observacion}
            onChange={(val) => setObservacion(val)}
            placeholder="Escribe los detalles del seguimiento..."
            rows={5}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Documento Adjunto (Opcional)</Label>
          <div className="mt-1">
            <FileInput
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
            />
            {initialData?.documento && !file && (
              <p className="text-xs text-gray-500 mt-1">
                Documento actual: {initialData.documento.nombre}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
