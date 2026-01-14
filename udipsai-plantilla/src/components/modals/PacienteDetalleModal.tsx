import React from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { SeguimientoContainer } from "../seguimiento/SeguimientoContainer";

interface Paciente {
  id: number;
  nombresApellidos: string;
  cedula: string;
  fechaNacimiento: string;
  fechaApertura: string;
  activo: boolean;
  ciudad: string;
  domicilio: string;
  numeroTelefono: string;
  numeroCelular: string;
  institucionEducativa: { id: number; nombre: string };
  sede: { id: number; nombre: string };
  motivoConsulta: string;
  observaciones: string;
}

interface PatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  paciente: Paciente | null;
}

const calcularEdad = (fechaNacimiento: string) => {
  const fechaNacimientoDate = new Date(fechaNacimiento);
  const fechaActual = new Date();
  let edad = fechaActual.getFullYear() - fechaNacimientoDate.getFullYear();
  const mesNacimiento = fechaNacimientoDate.getMonth();
  const diaNacimiento = fechaNacimientoDate.getDate();
  const mesActual = fechaActual.getMonth();
  const diaActual = fechaActual.getDate();
  if (mesNacimiento > mesActual || (mesNacimiento === mesActual && diaNacimiento > diaActual)) {
    edad--;
  }
  return edad;
};

export const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  isOpen,
  onClose,
  paciente,
}) => {
  const [activeTab, setActiveTab] = React.useState<'details' | 'seguimiento'>('details');

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab('details');
    }
  }, [isOpen]);

  if (!paciente) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[800px] p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {paciente.nombresApellidos}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {paciente.cedula}
        </p>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'details'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Información General
        </button>
        <button
          onClick={() => setActiveTab('seguimiento')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'seguimiento'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Seguimiento
        </button>
      </div>

      {activeTab === 'details' ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombres y Apellidos
                </label>
                <p className="text-gray-900 dark:text-white">
                {paciente.nombresApellidos}
                </p>
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cédula
                </label>
                <p className="text-gray-900 dark:text-white">{paciente.cedula}</p>
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Fecha de Nacimiento
                </label>
                <p className="text-gray-900 dark:text-white">
                {paciente.fechaNacimiento || "N/A"}
                </p>
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Edad
                </label>
                <p className="text-gray-900 dark:text-white">
                {calcularEdad(paciente.fechaNacimiento)}
                </p>
            </div>
            </div>

            <div className="space-y-4">
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Teléfono / Celular
                </label>
                <p className="text-gray-900 dark:text-white">
                {paciente.numeroTelefono} / {paciente.numeroCelular}
                </p>
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ciudad / Domicilio
                </label>
                <p className="text-gray-900 dark:text-white">
                {paciente.ciudad} - {paciente.domicilio}
                </p>
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sede
                </label>
                <p className="text-gray-900 dark:text-white">
                {paciente.sede.nombre}
                </p>
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Institución Educativa
                </label>
                <p className="text-gray-900 dark:text-white">
                {paciente.institucionEducativa.nombre || "N/A"}
                </p>
            </div>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-4">
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Motivo de Consulta
                </label>
                <p className="text-gray-900 dark:text-white">
                {paciente.motivoConsulta || "N/A"}
                </p>
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Observaciones
                </label>
                <p className="text-gray-900 dark:text-white">
                {paciente.observaciones || "N/A"}
                </p>
            </div>
            </div>
        </div>
      ) : (
        <SeguimientoContainer pacienteId={paciente.id} />
      )}

      <div className="mt-8 flex justify-end">
        <Button variant="primary" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </Modal>
  );
};
