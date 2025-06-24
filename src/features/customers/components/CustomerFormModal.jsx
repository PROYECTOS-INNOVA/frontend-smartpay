import React, { useState, useEffect } from 'react';
import Modal from '../../../common/components/ui/Modal';
import { v4 as uuidv4 } from 'uuid';

const CustomerFormModal = ({ isOpen, onClose, customer, onSave }) => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        devices: 0, 
        status: 'active'
    });

    useEffect(() => {
        if (customer) {
            setFormData({ ...customer });
        } else {
            setFormData({
                id: uuidv4(),
                name: '',
                email: '',
                phone: '',
                devices: 0,
                status: 'active'
            });
        }
    }, [customer, isOpen]);


    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'devices' ? parseInt(value, 10) || 0 : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación básica
        if (!formData.name || !formData.email || !formData.phone) {
            alert('Por favor, completa todos los campos requeridos (Nombre, Email, Teléfono).');
            return;
        }

        onSave(formData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={customer ? 'Editar Cliente' : 'Añadir Nuevo Cliente'}
            hideFooter={true}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
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

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Teléfono
                    </label>
                    <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="devices" className="block text-sm font-medium text-gray-700">
                        Número de Dispositivos
                    </label>
                    <input
                        type="number"
                        name="devices"
                        id="devices"
                        value={formData.devices}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 cursor-not-allowed"
                        readOnly
                        title="Este valor se actualiza automáticamente al gestionar dispositivos."
                    />
                    <p className="mt-1 text-xs text-gray-500">Este valor se actualiza automáticamente al gestionar dispositivos.</p>
                </div>

                {customer && (
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
                            <option value="active">Activo</option>
                            <option value="inactive">Inactivo</option>
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
                        {customer ? 'Guardar Cambios' : 'Añadir Cliente'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CustomerFormModal;