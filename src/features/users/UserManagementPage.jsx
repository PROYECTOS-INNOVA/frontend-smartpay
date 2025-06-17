import React, { useState } from 'react';
import UserTable from './components/UserTable'; 
import UserFormModal from './components/UserFormModal';
import { PlusIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid'; 

const initialUsers = [
    { id: uuidv4(), username: 'superadmin', name: 'Administrador Principal', role: 'Superadmin', email: 'super@smartpay.com', status: 'Activo' },
    { id: uuidv4(), username: 'admin_tienda_a', name: 'Admin Tienda A', role: 'Admin', email: 'admin.a@tienda.com', status: 'Activo' },
    { id: uuidv4(), username: 'vendedor_tienda_a', name: 'Vendedor Tienda A', role: 'Vendedor', email: 'vendedor.a@tienda.com', status: 'Activo' },
    { id: uuidv4(), username: 'cliente_vip', name: 'Cliente VIP', role: 'Cliente', email: 'cliente.vip@gmail.com', status: 'Activo' },
    { id: uuidv4(), username: 'admin_tienda_b', name: 'Admin Tienda B', role: 'Admin', email: 'admin.b@tienda.com', status: 'Activo' },
    { id: uuidv4(), username: 'usuario_inactivo', name: 'Usuario Inactivo', role: 'Vendedor', email: 'inactivo@smartpay.com', status: 'Inactivo' },
];

const UserManagementPage = () => {
    const [users, setUsers] = useState(initialUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null); 

    const handleOpenModal = (user = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSaveUser = (userData) => {
        if (editingUser) {
            setUsers(users.map(user =>
                user.id === editingUser.id ? { ...userData, id: editingUser.id } : user
            ));
        } else {
            setUsers([...users, userData]);
        }
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            setUsers(users.filter(user => user.id !== userId));
        }
    };

    const handleToggleUserStatus = (userId) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, status: user.status === 'Activo' ? 'Inactivo' : 'Activo' } : user
        ));
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Usuarios</h1>

            <div className="flex justify-end mb-6">
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Añadir Nuevo Usuario
                </button>
            </div>

            <UserTable
                users={users}
                onEdit={handleOpenModal}
                onDelete={handleDeleteUser}
                onToggleStatus={handleToggleUserStatus}
            />

            <UserFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                user={editingUser}
                onSave={handleSaveUser}
            />
        </div>
    );
};

export default UserManagementPage;