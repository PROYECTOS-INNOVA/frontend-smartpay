const MOCK_ROLES = [
    { role_id: '1', name: 'Administrador', description: 'Acceso completo al sistema' },
    { role_id: '2', name: 'Gerente', description: 'Gestiona equipos y proyectos' },
    { role_id: '3', name: 'Empleado', description: 'Acceso a funcionalidades básicas de empleado' },
    { role_id: '4', name: 'Cliente', description: 'Acceso a su perfil y servicios' },
    // Puedes añadir más roles según tus necesidades
  ];
  
  export const getRoles = async () => {
    // Simula una llamada a la API con un pequeño retraso
    // para que puedas observar los estados de carga en tu interfaz.
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Serving mock roles:", MOCK_ROLES);
        resolve(MOCK_ROLES);
      }, 500); // Retraso de 500ms
    });
  };
  
  // En el futuro, cuando tengas el backend para roles, reemplazarías esta función
  // por una que haga una llamada real a tu API, por ejemplo:
  /*
  import axios from 'axios';
  const API_GATEWAY_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  const axiosInstance = axios.create({
    baseURL: `${API_GATEWAY_URL}/api/v1`,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  export const getRoles = async () => {
    try {
      const response = await axiosInstance.get('/roles'); // Ajusta el endpoint si es diferente
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  };
  */
  
  // Si en el futuro necesitas crear, actualizar o eliminar roles, añadirías
  // funciones adicionales aquí, como:
  /*
  export const createRole = async (roleData) => { ... };
  export const updateRole = async (roleId, roleData) => { ... };
  export const deleteRole = async (roleId) => { ... };
  */