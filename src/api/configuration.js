import axios from 'axios';
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

/**
 * Metodo para crear configuraciones por defecto
 * @returns 
 */
export const createDefaultConfigurations = async (store_id) => {
    try {
        const response = await axiosInstance.post('/configurations/create-default-configs/', {}, 
            {params: {store_id}}
        );
        return response.data;
    } catch (error) {
        console.error('Error creating default configurations:', error);
        throw error;
    }
}

export const getConfigurations = async () => {
    try {
        let params = {};
        const storeId = getCurrentStoreId();
        if (storeId) params.store_id = storeId;
        const response = await axiosInstance.get('/configurations/', {params});
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