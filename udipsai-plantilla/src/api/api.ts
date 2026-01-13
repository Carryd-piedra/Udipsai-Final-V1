import axios from "axios";

// Configuración base de Axios
const api = axios.create({
    baseURL: "http://localhost:8080/api", // Ajusta según tu backend

});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta (opcional)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Manejar token expirado o no autorizado (ej: logout)
            localStorage.removeItem("accessToken");
            // window.location.href = "/signin"; // Opcional: redirigir al login
        }
        return Promise.reject(error);
    }
);

export default api;
