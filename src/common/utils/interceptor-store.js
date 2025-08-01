// axiosInstance.js
import axios from 'axios';
import { getCurrentUser } from './helpers';

const API_GATEWAY_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
const user = getCurrentUser();

const axiosInstance = axios.create({
    baseURL: `${API_GATEWAY_URL}/api/v1`,
    // headers: {
    //     'Content-Type': 'application/json',
    // },
});

// Token opcional en headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// // Endpoints generales a validar
// const endpointsToValidate = [
//     '/users',
//     '/plans/',
//     '/payments/',
//     '/factoryResetProtection/',
//     '/configurations/',
// ];

// const dynamicExceptions = [
//     { endpoint: '/plans/', requiredParams: ['device_id'] },
//     { endpoint: '/payments/', requiredParams: ['device_id'] },
// ];

// axiosInstance.interceptors.response.use(
//     (response) => {
//         const { config } = response;
//         const url = config?.url || '';
//         const params = config?.params || {};
//         const role = user?.role?.toLowerCase();

//         const matchedEndpoint = endpointsToValidate.find(endpoint =>
//             url.includes(endpoint)
//         );

//         const hasStoreParam =
//             params?.store_id ||
//             params?.store ||
//             url.includes('store_id=') ||
//             url.includes('store=');

//         const isException = dynamicExceptions.some(({ endpoint, requiredParams }) => {
//             if (!url.includes(endpoint)) return false;
//             return requiredParams.every(param => params?.[param]);
//         });

//         if (matchedEndpoint && !hasStoreParam && role !== 'superadmin' && !isException) {
//             console.warn(`🚫 Interceptado: falta store/store_id en ${url} (rol: ${role || 'N/A'})`);
//             return { ...response, data: [] };
//         }

//         return response;
//     },
//     (error) => Promise.reject(error)
// );

export default axiosInstance