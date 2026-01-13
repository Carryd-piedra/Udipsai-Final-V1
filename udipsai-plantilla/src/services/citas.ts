import api from "../api/api";

export interface RegistrarCitaDTO {
    fichaPaciente: number;
    profesionalId: number;
    especialidadId: number;
    fecha: string;
    hora: string;
}

export const citasService = {
    listar: async (page: number = 0, size: number = 100) => {
        try {
            const response = await api.get(`/citas?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            console.error("Error al listar citas:", error);
            throw error;
        }
    },

    registrarCita: async (cita: RegistrarCitaDTO) => {
        try {
            const response = await api.post("/citas", cita);
            return response.data;
        } catch (error) {
            console.error("Error al registrar la cita:", error);
            throw error;
        }
    },

    obtenerHorasLibres: async (profesionalId: number, fecha: string) => {
        try {
            const response = await api.get(
                `/citas/horas-libres/${profesionalId}/?fecha=${fecha}`
            );
            return response.data;
        } catch (error) {
            console.error("Error al obtener horas libres:", error);
            throw error;
        }
    },

    obtenerPorEspecialidad: async (especialidadId: number, page: number = 0, size: number = 100) => {
        try {
            const response = await api.get(`/citas/especialidad/${especialidadId}?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener citas por especialidad:", error);
            throw error;
        }
    },

    obtenerPorProfesional: async (profesionalId: number, page: number = 0, size: number = 100) => {
        try {
            const response = await api.get(`/citas/profesional/${profesionalId}?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener citas por profesional:", error);
            throw error;
        }
    },

    finalizar: async (id: number | string) => {
        try {
            const response = await api.patch(`/citas/finalizar/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al finalizar cita:", error);
            throw error;
        }
    },

    cancelar: async (id: number | string) => {
        try {
            const response = await api.patch(`/citas/cancelar/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al cancelar cita:", error);
            throw error;
        }
    },

    faltaJustificada: async (id: number | string) => {
        try {
            const response = await api.patch(`/citas/falta-justificada/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al marcar falta justificada:", error);
            throw error;
        }
    },

    faltaInjustificada: async (id: number | string) => {
        try {
            const response = await api.patch(`/citas/falta-injustificada/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al marcar falta injustificada:", error);
            throw error;
        }
    },
};
