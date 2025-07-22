// src/api/plans.js
import axios from 'axios';

// La URL base de tu API, tomada de las variables de entorno de Vite
const API_GATEWAY_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

// Crear una instancia de Axios con la URL base de tu API Gateway
const axiosInstance = axios.create({
    baseURL: `${API_GATEWAY_URL}/api/v1`, // Asume que los endpoints de planes están bajo /api/v1
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token de autorización
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
 * Metodo para consultar reportes contables para graficas 
 * @param {*} params 
 * @returns 
 */
export const getAnalytics = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/analytics/date-range', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

/**
 * Metodo para descargar excel con los reportes
 * @param {*} params 
 * @returns 
 */
export const downloadReport = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/analytics/excel', { params, responseType: 'blob' });
        return response;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};
