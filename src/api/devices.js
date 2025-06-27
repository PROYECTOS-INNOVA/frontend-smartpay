// src/api/devices.js
import axios from 'axios';

const API_GATEWAY_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: `${API_GATEWAY_URL}/api/v1`,
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

// --- NUEVA FUNCIÓN PARA CREAR DISPOSITIVO ---
/**
 * Crea un nuevo dispositivo.
 * @param {object} deviceData - Datos del dispositivo (e.g., { name: '...', imei: '...', enrolment_id: '...' }).
 * @returns {Promise<object>} La respuesta de la API que incluye el dispositivo creado.
 */
export const createDevice = async (deviceData) => {
    try {
        const response = await axiosInstance.post('/devices/', deviceData); // Endpoint POST /devices/
        return response.data;
    } catch (error) {
        console.error('Error al crear dispositivo:', error.response?.data || error.message);
        throw error;
    }
};

export const getDevices = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/devices/', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching devices:', error);
        throw error;
    }
};

export const getDeviceById = async (deviceId) => {
    try {
        const response = await axiosInstance.get(`/devices/${deviceId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching device with ID ${deviceId}:`, error);
        throw error;
    }
};

// --- FUNCIÓN PARA ACTUALIZAR DISPOSITIVO ---
export const updateDevice = async (deviceId, deviceData) => {
    try {
        const response = await axiosInstance.patch(`/devices/${deviceId}`, deviceData);
        return response.data;
    } catch (error) {
        console.error(`Error updating device with ID ${deviceId}:`, error);
        throw error;
    }
};

// Funciones para acciones específicas
export const blockDevice = async (deviceId) => {
    try {
        const response = await axiosInstance.patch(`/devices/${deviceId}/block`);
        return response.data;
    } catch (error) {
        console.error(`Error blocking device with ID ${deviceId}:`, error);
        throw error;
    }
};

export const unblockDevice = async (deviceId) => {
    try {
        const response = await axiosInstance.patch(`/devices/${deviceId}/unblock`);
        return response.data;
    } catch (error) {
        console.error(`Error unblocking device with ID ${deviceId}:`, error);
        throw error;
    }
};

export const locateDevice = async (deviceId) => {
    try {
        const response = await axiosInstance.post(`/devices/${deviceId}/locate`);
        return response.data;
    } catch (error) {
        console.error(`Error locating device with ID ${deviceId}:`, error);
        throw error;
    }
};

export const releaseDevice = async (deviceId) => {
    try {
        const response = await axiosInstance.patch(`/devices/${deviceId}/release`);
        return response.data;
    } catch (error) {
        console.error(`Error releasing device with ID ${deviceId}:`, error);
        throw error;
    }
};

// --- NUEVAS FUNCIONES PARA LA GESTIÓN DE SIMS ---
export const approveDeviceSim = async (deviceId, imsi) => {
    try {
        const response = await axiosInstance.post(`/devices/${deviceId}/sims/${imsi}/approve`);
        return response.data;
    } catch (error) {
        console.error(`Error approving SIM ${imsi} for device ${deviceId}:`, error);
        throw error;
    }
};

export const removeDeviceSim = async (deviceId, imsi) => {
    try {
        const response = await axiosInstance.delete(`/devices/${deviceId}/sims/${imsi}`);
        return response.data;
    } catch (error) {
        console.error(`Error removing SIM ${imsi} from device ${deviceId}:`, error);
        throw error;
    }
};