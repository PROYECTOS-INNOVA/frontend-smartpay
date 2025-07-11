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

export const getConfigurations = async () => {
    try {
        const response = await axiosInstance.get('/configurations/');
        return response.data;
    } catch (error) {
        console.error('Error fetching configurations:', error);
        throw error;
    }
};


export const updateConfiguration = async (configurationId, configurationData) => {
    try {
        const response = await axiosInstance.patch(`/configurations/${configurationId}`, configurationData);
        return response.data;
    } catch (error) {
        console.error('Error update configurations:', error);
        throw error;
    }
};