// src/api/enrolments.js
import axios from 'axios';

// La URL base de tu API, tomada de las variables de entorno de Vite
const API_GATEWAY_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

// Crear una instancia de Axios con la URL base de tu API Gateway
// y el Content-Type para JSON
const axiosInstance = axios.create({
    baseURL: `${API_GATEWAY_URL}/api/v1`, // Asume que los endpoints de enrolamientos están bajo /api/v1
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token de autorización a cada solicitud
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

// --- FUNCIONES PARA ENROLAMIENTOS ---

/**
 * Crea un nuevo enrolamiento.
 * @param {object} enrolmentData - Datos del enrolamiento (e.g., { user_id: '...', vendor_id: '...' }).
 * @returns {Promise<object>} La respuesta de la API que incluye el enrolamiento creado.
 */
export const createEnrolment = async (enrolmentData) => {
    try {
        const response = await axiosInstance.post('/enrolments/', enrolmentData); // Endpoint POST /enrolments/
        return response.data;
    } catch (error) {
        console.error('Error al crear enrolamiento:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Obtiene una lista de enrolamientos.
 * @param {object} [params={}] - Parámetros de consulta opcionales.
 * @returns {Promise<Array<object>>} Una lista de enrolamientos.
 */
export const getEnrolments = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/enrolments/', { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener enrolamientos:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Obtiene un enrolamiento por su ID.
 * @param {string} enrolmentId - El ID del enrolamiento.
 * @returns {Promise<object>} El enrolamiento.
 */
export const getEnrolmentById = async (enrolmentId) => {
    try {
        const response = await axiosInstance.get(`/enrolments/${enrolmentId}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener enrolamiento con ID ${enrolmentId}:`, error.response?.data || error.message);
        throw error;
    }
};

/**
 * Actualiza parcialmente un enrolamiento.
 * @param {string} enrolmentId - El ID del enrolamiento a actualizar.
 * @param {object} enrolmentData - Los datos a actualizar.
 * @returns {Promise<object>} El enrolamiento actualizado.
 */
export const updateEnrolment = async (enrolmentId, enrolmentData) => {
    try {
        const response = await axiosInstance.patch(`/enrolments/${enrolmentId}`, enrolmentData);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar enrolamiento con ID ${enrolmentId}:`, error.response?.data || error.message);
        throw error;
    }
};

/**
 * Elimina un enrolamiento por su ID.
 * @param {string} enrolmentId - El ID del enrolamiento a eliminar.
 * @returns {Promise<object>} La respuesta de la API (generalmente un mensaje de éxito).
 */
export const deleteEnrolment = async (enrolmentId) => {
    try {
        const response = await axiosInstance.delete(`/enrolments/${enrolmentId}`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar enrolamiento con ID ${enrolmentId}:`, error.response?.data || error.message);
        throw error;
    }
};