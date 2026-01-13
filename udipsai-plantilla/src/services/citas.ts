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
};
