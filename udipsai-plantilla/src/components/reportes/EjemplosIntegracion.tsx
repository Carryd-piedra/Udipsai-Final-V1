import React, { useState } from "react";
import { reportesService, ReporteCitaRespuestaDTO } from "../../services/reportes";
import { citasService, RegistrarCitaDTO } from "../../services/citas";

/**
 * EJEMPLO DE INTEGRACIÓN DEL SISTEMA DE REPORTES
 * 
 * Este componente muestra cómo integrar la generación automática de reportes
 * cuando se crea una nueva cita.
 */

interface CrearCitaConReporteProps {
  pacienteId: number;
  onCitaCreada?: (citaId: number) => void;
}

export const CrearCitaConReporte: React.FC<CrearCitaConReporteProps> = ({
  pacienteId,
  onCitaCreada
}) => {
  const [mostrarReporte, setMostrarReporte] = useState(false);
  const [reporte, setReporte] = useState<ReporteCitaRespuestaDTO | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Función para crear una cita y automáticamente generar el reporte
   */
  const handleCrearCitaYGenerarReporte = async (citaData: RegistrarCitaDTO) => {
    setLoading(true);

    try {
      // 1. Crear la cita
      const citaCreada = await citasService.registrarCita(citaData);
      console.log("Cita creada exitosamente:", citaCreada);

      // 2. Generar el reporte automáticamente
      const reporteGenerado = await reportesService.obtenerReportePorPaciente(pacienteId);
      setReporte(reporteGenerado);
      setMostrarReporte(true);

      // 3. Notificar al componente padre
      if (onCitaCreada && citaCreada.id) {
        onCitaCreada(citaCreada.id);
      }

      // 4. Opcional: Imprimir automáticamente
      // setTimeout(() => window.print(), 500);

    } catch (error) {
      console.error("Error al crear cita o generar reporte:", error);
      alert("Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función para generar reporte de un paciente sin crear cita
   */
  const handleGenerarReporteSolamente = async () => {
    setLoading(true);

    try {
      const reporteGenerado = await reportesService.obtenerReportePorPaciente(pacienteId);
      setReporte(reporteGenerado);
      setMostrarReporte(true);
    } catch (error) {
      console.error("Error al generar reporte:", error);
      alert("Error al generar el reporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Botón para generar reporte sin crear cita */}
      <button
        onClick={handleGenerarReporteSolamente}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Generando..." : "Ver Reporte de Citas"}
      </button>

      {/* Modal o vista del reporte */}
      {mostrarReporte && reporte && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold">Reporte Generado</h2>
              <button
                onClick={() => setMostrarReporte(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Información del paciente */}
            <div className="mb-4">
              <h3 className="font-semibold">Paciente: {reporte.pacienteNombreCompleto}</h3>
              <p className="text-gray-600">Cédula: {reporte.cedula}</p>
            </div>

            {/* Lista de citas */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Historial de Citas ({reporte.citas.length})</h4>
              
              {reporte.citas.length > 0 ? (
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Fecha</th>
                      <th className="border p-2">Hora</th>
                      <th className="border p-2">Profesional</th>
                      <th className="border p-2">Especialidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporte.citas.map((cita, index) => (
                      <tr key={index}>
                        <td className="border p-2">{cita.fecha}</td>
                        <td className="border p-2">{cita.hora}</td>
                        <td className="border p-2">{cita.profesional}</td>
                        <td className="border p-2">{cita.especialidad}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No hay citas registradas
                </p>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => window.print()}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Imprimir
              </button>
              <button
                onClick={() => setMostrarReporte(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * EJEMPLO DE USO EN COMPONENTE DE CITAS EXISTENTE
 * 
 * Agregar esta funcionalidad a un componente existente:
 */

/*
// En tu componente de crear/editar cita existente:

import { reportesService } from "../../services/reportes";

// Después de crear una cita exitosamente:
const handleSubmit = async (data: RegistrarCitaDTO) => {
  try {
    const result = await citasService.registrarCita(data);
    
    // Mostrar mensaje de éxito
    alert("Cita creada exitosamente");
    
    // Opcional: Preguntar si desea generar reporte
    const generarReporte = window.confirm(
      "¿Desea generar e imprimir el reporte de citas del paciente?"
    );
    
    if (generarReporte) {
      const reporte = await reportesService.obtenerReportePorPaciente(
        data.fichaPaciente
      );
      
      // Aquí puedes:
      // 1. Mostrar el reporte en un modal
      // 2. Redirigir a la página de reportes
      // 3. Imprimir automáticamente
      
      // Opción 1: Redirigir a reportes
      // navigate('/reportes');
      
      // Opción 2: Imprimir automáticamente
      // window.print();
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
};
*/

/**
 * INTEGRACIÓN CON BÚSQUEDA POR CÉDULA
 * 
 * Para buscar por cédula en lugar de ID:
 */

/*
const handleBuscarPorCedula = async (cedula: string) => {
  try {
    const reporte = await reportesService.obtenerReportePorCedula(cedula);
    
    if (reporte.pacienteNombreCompleto === "Paciente no encontrado") {
      alert("No se encontró ningún paciente con esa cédula");
      return;
    }
    
    // Mostrar el reporte
    console.log("Reporte:", reporte);
    
  } catch (error) {
    console.error("Error al buscar:", error);
  }
};
*/

/**
 * HOOK PERSONALIZADO PARA REPORTES
 */

/*
import { useState } from 'react';
import { reportesService, ReporteCitaRespuestaDTO } from '../../services/reportes';

export const useReportes = () => {
  const [reporte, setReporte] = useState<ReporteCitaRespuestaDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generarReportePorCedula = async (cedula: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const resultado = await reportesService.obtenerReportePorCedula(cedula);
      setReporte(resultado);
      return resultado;
    } catch (err) {
      setError("Error al generar el reporte");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generarReportePorId = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const resultado = await reportesService.obtenerReportePorPaciente(id);
      setReporte(resultado);
      return resultado;
    } catch (err) {
      setError("Error al generar el reporte");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const imprimirReporte = () => {
    window.print();
  };

  const limpiarReporte = () => {
    setReporte(null);
    setError(null);
  };

  return {
    reporte,
    loading,
    error,
    generarReportePorCedula,
    generarReportePorId,
    imprimirReporte,
    limpiarReporte
  };
};

// Uso del hook:
// const { reporte, loading, generarReportePorCedula, imprimirReporte } = useReportes();
*/
