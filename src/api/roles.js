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

export const getRoles = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/roles/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

// Si necesitas crear o actualizar roles desde el frontend, añade funciones aquí:
// export const createRole = async (roleData) => {...};
// export const updateRole = async (roleId, roleData) => {...};
// export const deleteRole = async (roleId) => {...};