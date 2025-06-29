import axios from 'axios';

const API_GATEWAY_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: `${API_GATEWAY_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getFactoryReset = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/factoryResetProtection/', { params });
        return response.data;
    } catch (error) { 
        console.error('Error fetching users:', error);
        throw error;
    }
};