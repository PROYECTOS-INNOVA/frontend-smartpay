import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../common/context/AuthProvider';

const PrivateRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        console.warn("Acceso denegado: Usuario no autenticado. Redirigiendo a /landing.");
        return <Navigate to="/landing" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.warn(`Acceso denegado: Usuario ${user.username} con rol ${user.role} intentó acceder a una ruta para roles: ${allowedRoles.join(', ')}`);

        if (user.role === 'Cliente') {
            return <Navigate to="/client/dashboard" replace />; 
        }
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;