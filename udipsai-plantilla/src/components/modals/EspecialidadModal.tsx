import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

interface Especialidad {
    id: number;
    area: string;
}

interface EspecialidadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (especialidad: Omit<Especialidad, "id"> | Especialidad) => void;
  initialData?: Especialidad | null;
  title?: string;
}

export const EspecialidadModal: React.FC<EspecialidadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  title = "Especialidad",
}) => {
  const [formData, setFormData] = useState({
    area: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        area: initialData.area
      });
    } else {
      setFormData({
        area: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      ...(initialData ? { id: initialData.id } : {}),
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="area">Nombre del Área/Especialidad</Label>
          <Input
            id="area"
            type="text"
            placeholder="Ingrese el área"
            value={formData.area}
            onChange={handleChange}
          />
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>Guardar</Button>
      </div>
    </Modal>
  );
};
