// src/context/AuthContext.js
import { createContext } from 'react';

// Datos dummy de usuarios
export const dummyUsers = {
    superadmin: {
        username: 'superadmin',
        role: 'Superadmin',
        name: 'Administrador Principal',
        id: 'superadmin_id', // Añadido ID
    },
    admin: {
        username: 'admin',
        role: 'Admin',
        name: 'Administrador de Tienda',
        id: 'admin_id', // Añadido ID
    },
    vendedor: {
        username: 'vendedor',
        role: 'Vendedor',
        name: 'Juan Pérez',
        id: 'vendedor_id', // Añadido ID
    },
    cliente: {
        username: 'cliente',
        role: 'Cliente',
        name: 'María García',
        id: 'cust1', // ¡IMPORTANTE! Este ID debe coincidir con los customerId en tus datos dummy de dispositivos
    },
};

// Exporta SOLO el contexto (sin Provider ni hook)
export const AuthContext = createContext(null);