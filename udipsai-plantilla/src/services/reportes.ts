import api from "../api/api";

export interface ReporteCitaDTO {
  fecha: string;
  hora: string;
  profesional: string;
  especialidad: string;
  estado?: string; // Nuevo campo para el estado de la cita
}

export interface ReporteCitaRespuestaDTO {
  pacienteNombreCompleto: string;
  cedula: string;
  citas: ReporteCitaDTO[];
}

export const reportesService = {
  obtenerReportePorCedula: async (cedula: string): Promise<ReporteCitaRespuestaDTO> => {
    try {
      const response = await api.get(`/citas/reporte/cedula?cedula=${cedula}`);
      console.log("Respuesta del backend:", response.data);
      console.log("Citas recibidas:", response.data.citas);
      return response.data;
    } catch (error) {
      console.error("Error al obtener reporte por cédula:", error);
      throw error;
    }
  },

  obtenerReportePorPaciente: async (id: number): Promise<ReporteCitaRespuestaDTO> => {
    try {
      const response = await api.get(`/citas/reporte/paciente/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener reporte por paciente:", error);
      throw error;
    }
  },
};
