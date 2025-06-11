import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import { v4 as uuidv4 } from 'uuid';

const UserFormModal = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({
        id: '',
        username: '',
        name: '',
        role: 'Vendedor',
        email: '',
        password: '',
        status: 'Activo'
    });

    useEffect(() => {
        if (user) {
            setFormData({ ...user, password: '' }); 
        } else {
            setFormData({
                id: uuidv4(),
                username: '',
                name: '',
                role: 'Vendedor',
                email: '',
                password: '',
                status: 'Activo'
            });
        }
    }, [user, isOpen]);


    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.username || !formData.name || !formData.role || !formData.email) {
            alert('Por favor, completa todos los campos requeridos.');
            return;
        }

        if (!user && !formData.password) { 
            alert('Por favor, introduce una contraseña para el nuevo usuario.');
            return;
        }

        onSave(formData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={user ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}
            hideFooter={true}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Usuario
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        disabled={!!user}
                        required
                    />
                    {user && <p className="mt-1 text-xs text-gray-500">El nombre de usuario no se puede cambiar.</p>}
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nombre Completo
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    />
                </div>

                {!user && (
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleFormChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required={!user}
                        />
                    </div>
                )}
                {user && (
                    <p className="mt-1 text-xs text-gray-500">
                        Para cambiar la contraseña, deberás implementar un formulario de "Cambiar Contraseña" separado.
                    </p>
                )}

                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Rol
                    </label>
                    <select
                        name="role"
                        id="role"
                        value={formData.role}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    >
                        <option value="Superadmin">Superadmin</option>
                        <option value="Admin">Admin</option>
                        <option value="Vendedor">Vendedor</option>
                        <option value="Cliente">Cliente</option>
                    </select>
                </div>

                {user && (
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Estado
                        </label>
                        <select
                            name="status"
                            id="status"
                            value={formData.status}
                            onChange={handleFormChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {user ? 'Guardar Cambios' : 'Añadir Usuario'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default UserFormModal;