// src/context/AuthProvider.jsx
import React, { useState, useContext, useEffect } from 'react'; // Eliminado useState duplicado
import { AuthContext, dummyUsers } from './AuthContext'; // Asegúrate de que AuthContext y dummyUsers se exportan desde aquí o desde AuthContext.js

export const AuthProvider = ({ children }) => {
    // Inicializa el usuario desde localStorage
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('currentUser');
            // Asegúrate de que el objeto user tenga una propiedad 'role' (o 'Rol')
            const parsedUser = storedUser ? JSON.parse(storedUser) : null;
            return parsedUser;
        } catch (error) {
            console.error("Error parsing user from localStorage:", error);
            // Limpia el item si está corrupto
            localStorage.removeItem('currentUser');
            return null;
        }
    });

    // Sincroniza el estado 'user' con localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [user]);

    // Función de login: busca el usuario dummy por username y lo establece
    const login = (username) => {
        const foundUser = dummyUsers[username]; // Asume que dummyUsers es un objeto { username: user_object }
        if (foundUser) {
            setUser(foundUser);
            return true;
        }
        return false;
    };

    // Función de logout: limpia el usuario
    const logout = () => {
        setUser(null);
    };

    // Función para actualizar el perfil del usuario en el estado del contexto y localStorage
    const updateUserProfile = (newUserData) => {
        // Asegúrate de que newUserData contenga al menos { name, username, email } y el rol existente
        // Es importante no sobrescribir el rol a menos que sea intencional.
        setUser(prevUser => {
            const updatedUser = { ...prevUser, ...newUserData };
            return updatedUser;
        });
        // La actualización de localStorage se maneja automáticamente por el useEffect
    };


    // Función de prueba para cambiar el rol (para desarrollo)
    const testChangeRole = (roleKey) => {
        // Asume que dummyUsers también puede tener claves por rol, o que tus usuarios dummy tienen un campo 'role'
        const foundUserByRole = Object.values(dummyUsers).find(u => u.role === roleKey); // Busca un usuario con ese rol
        if (foundUserByRole) {
            setUser(foundUserByRole);
        } else {
            console.warn(`Rol '${roleKey}' no encontrado en los usuarios dummy.`);
        }
    };

    // Valores proporcionados por el contexto
    const value = {
        user,
        login,
        logout,
        updateUserProfile, // <--- ¡AÑADIDO! Esta es la función que necesitaba UserProfilePage
        testChangeRole, // Mantener para desarrollo
        isAuthenticated: !!user // Conveniencia para saber si hay un usuario loggeado
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para consumir el contexto de autenticación
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};