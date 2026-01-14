import React, { useState } from "react";
import {
  reportesService,
  ReporteCitaRespuestaDTO,
} from "../../services/reportes";

interface BuscarReporteFormProps {
  onBuscar: (reporte: ReporteCitaRespuestaDTO) => void;
}

export const BuscarReporteForm: React.FC<BuscarReporteFormProps> = ({
  onBuscar,
}) => {
  const [cedula, setCedula] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cedula.trim()) {
      setError("Por favor ingrese una cédula");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reporte = await reportesService.obtenerReportePorCedula(cedula);
      
      if (reporte.citas.length === 0 && reporte.pacienteNombreCompleto === "Paciente no encontrado") {
        setError("No se encontró ningún paciente con esa cédula");
      } else {
        onBuscar(reporte);
        setCedula(""); // Limpiar el formulario después de buscar
      }
    } catch (err) {
      console.error("Error al buscar reporte:", err);
      setError("Error al buscar el reporte. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Buscar Reporte de Citas
      </h2>
      
      <form onSubmit={handleBuscar} className="space-y-4">
        <div>
          <label
            htmlFor="cedula"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Número de Cédula
          </label>
          <input
            type="text"
            id="cedula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            placeholder="Ingrese número de cédula"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {loading ? "Buscando..." : "Buscar Reporte"}
        </button>
      </form>
    </div>
  );
};
