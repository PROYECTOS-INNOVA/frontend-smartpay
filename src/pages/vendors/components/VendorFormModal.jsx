// src/pages/vendors/components/VendorFormModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal'; // Ajusta la ruta si es necesario
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos (asegúrate de tenerlo instalado: npm install uuid)

const VendorFormModal = ({ isOpen, onClose, vendor, onSave }) => {
    const [formData, setFormData] = useState({
        id: '',
        username: '',
        name: '',
        email: '',
        password: '',
        role: 'Vendedor', // Por defecto, al crear un vendedor, su rol es 'Vendedor'
        status: 'Activo'
    });

    // Carga los datos del vendedor si estamos editando, o resetea para un nuevo vendedor
    useEffect(() => {
        if (vendor) {
            setFormData({ ...vendor, password: '' }); // No precargar la contraseña
        } else {
            setFormData({
                id: uuidv4(), // Genera un ID para el nuevo vendedor
                username: '',
                name: '',
                email: '',
                password: '',
                role: 'Vendedor',
                status: 'Activo'
            });
        }
    }, [vendor, isOpen]); // Dependencia de vendor y isOpen para resetear al abrir modal

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación básica
        if (!formData.username || !formData.name || !formData.email) {
            alert('Por favor, completa todos los campos requeridos.');
            return;
        }

        if (!vendor && !formData.password) { // Si es un nuevo vendedor y no hay contraseña
            alert('Por favor, introduce una contraseña para el nuevo vendedor.');
            return;
        }

        onSave(formData); // Llama a la función onSave pasada desde VendorManagementPage
        onClose(); // Cierra el modal
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={vendor ? 'Editar Vendedor' : 'Añadir Nuevo Vendedor'}
            hideFooter={true} // Opcional, si quieres que el modal no tenga footer predefinido
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campos del formulario */}
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
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        disabled={!!vendor} // No permitir cambiar el username al editar
                        required
                    />
                    {vendor && <p className="mt-1 text-xs text-gray-500">El nombre de usuario no se puede cambiar.</p>}
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
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>

                {!vendor && ( // La contraseña solo es requerida al añadir un nuevo vendedor
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
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required={!vendor}
                        />
                    </div>
                )}
                {vendor && (
                    <p className="mt-1 text-xs text-gray-500">
                        Para cambiar la contraseña, deberías implementar un formulario de "Cambiar Contraseña" separado (fuera de este modal de edición general).
                    </p>
                )}

                {/* El rol siempre será 'Vendedor' para este módulo de gestión */}
                <input type="hidden" name="role" value="Vendedor" />

                {vendor && ( // Solo mostrar status al editar
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Estado
                        </label>
                        <select
                            name="status"
                            id="status"
                            value={formData.status}
                            onChange={handleFormChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>
                )}

                {/* Botones de acción del formulario */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {vendor ? 'Guardar Cambios' : 'Añadir Vendedor'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default VendorFormModal;