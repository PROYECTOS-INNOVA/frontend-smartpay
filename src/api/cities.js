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

// getCities ahora puede recibir un parámetro 'search_term'
export const getCities = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/cities/', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
    }
};