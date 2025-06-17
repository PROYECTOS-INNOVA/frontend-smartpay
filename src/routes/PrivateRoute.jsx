import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../common/context/AuthProvider'; // Importa useAuth desde la nueva ubicación

const PrivateRoute = ({ allowedRoles }) => {
    const { user } = useAuth(); // Obtiene el objeto de usuario del contexto de autenticación

    // 1. Si no hay usuario (no autenticado), redirige al login
    if (!user) {
        console.warn("Acceso denegado: Usuario no autenticado. Redirigiendo a /login.");
        return <Navigate to="/login" replace />;
    }

    // 2. Si se especificaron roles permitidos y el rol del usuario no está entre ellos
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.warn(`Acceso denegado: Usuario ${user.username} con rol ${user.role} intentó acceder a una ruta para roles: ${allowedRoles.join(', ')}`);

        // Redirige al dashboard si el usuario está autenticado pero no tiene el rol correcto
        // Esto es útil para evitar que usuarios autenticados vean páginas no autorizadas
        if (user.role === 'Cliente') {
            return <Navigate to="/client/dashboard" replace />; // O a la ruta de inicio del cliente
        }
        // Si no es cliente o su rol no es válido para esta ruta, lo mandamos al dashboard general
        return <Navigate to="/dashboard" replace />;
    }

    // Si el usuario está autenticado y tiene el rol permitido, renderiza el contenido de la ruta anidada
    return <Outlet />;
};

export default PrivateRoute;