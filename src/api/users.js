import axios from 'axios';
import { use } from 'react';
import { getCurrentStoreId } from '../common/utils/helpers';
import axiosInstance from '../common/utils/interceptor-store';

// const API_GATEWAY_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

// const axiosInstance = axios.create({
//     baseURL: `${API_GATEWAY_URL}/api/v1`,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

export const getUsers = async (params = {}) => {
    try {
        const storeId = getCurrentStoreId();
        if (storeId) params.store = storeId;
        const response = await axiosInstance.get('/users', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

/**
 * Obtener user por user ID
 * @param {*} id 
 * @returns 
 */
export const getUserId = async (id) => {
    try {
        const response = await axiosInstance.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const createUser = async (userData) => {
    try {
        const storeId = getCurrentStoreId();
        if (storeId) userData.store_id = storeId;
        const response = await axiosInstance.post('/users', userData);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await axiosInstance.patch(`/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await axiosInstance.delete(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};