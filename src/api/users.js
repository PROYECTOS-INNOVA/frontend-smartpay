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

export const getUsers = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/users/users', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const createUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/users/users', userData);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await axiosInstance.patch(`/users/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await axiosInstance.delete(`/users/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};