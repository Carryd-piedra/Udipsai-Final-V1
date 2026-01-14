import api from "../api/api";

export interface RegistrarCitaDTO {
    fichaPaciente: number;
    profesionalId: number;
    especialidadId: number;
    fecha: string;
    hora: string;
    duracionMinutes?: number;
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

    eliminar: async (id: number | string) => {
        try {
            // Updated to use the correct PATCH endpoint for cancellation
            const response = await api.patch(`/citas/cancelar/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al cancelar la cita:", error);
            throw error;
        }
    },

    reagendar: async (id: number | string, cita: RegistrarCitaDTO) => {
        try {
            const response = await api.put(`/citas/reagendar/${id}`, cita);
            return response.data;
        } catch (error) {
            console.error("Error al reagendar la cita:", error);
            throw error;
        }
    },

    obtenerPorId: async (id: number | string) => {
        try {
            const response = await api.get(`/citas/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener la cita:", error);
            throw error;
        }
    },

    finalizar: async (id: number | string) => {
        try {
            const response = await api.patch(`/citas/finalizar/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al finalizar la cita:", error);
            throw error;
        }
    },

    marcarFalta: async (id: number | string) => {
        try {
            const response = await api.patch(`/citas/falta-injustificada/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al marcar falta injustificada:", error);
            throw error;
        }
    },
};
