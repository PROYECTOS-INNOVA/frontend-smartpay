import axios from 'axios';

const API_GATEWAY_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: `${API_GATEWAY_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Función para actualizar contraseña
 * @param {string} token - Token de restablecimiento de contraseña
 * @param {string} password - Nueva contraseña
 */
export const resetPassword = async (data) => {
    try {
        const response = await axiosInstance.post(`/auth/password-reset/confirm`, data);
        return response.data;
    } catch (error) {
        console.error('Error en resetPassword:', error);
        throw error;
    }
}

/**
 * Enviar correo de restablecimiento de contraseña
 * @param {string} dni
 */
export const requestPasswordReset = async (dni) => {
    try {
        const response = await axiosInstance.post(`/auth/password-reset/reset`, data);
        return response.data;
    } catch (error) {
        console.error('Error en resetPassword:', error);
        throw error;
    }
}