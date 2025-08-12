import { createContext } from 'react';

export const dummyUsers = {
    superadmin: {
        username: 'superadmin',
        role: 'Superadmin',
        name: 'Administrador Principal',
        id: 'superadmin_id',
    },
    admin: {
        username: 'admin',
        role: 'Admin',
        name: 'Administrador de Tienda',
        id: 'admin_id',
    },
    vendedor: {
        username: 'vendedor',
        role: 'Vendedor',
        name: 'Juan Pérez',
        id: 'vendedor_id',
    },
    cliente: {
        username: 'cliente',
        role: 'Cliente',
        name: 'María García',
        id: 'cust1',
    },
};

// La definición del contexto es correcta
export const AuthContext = createContext(null);