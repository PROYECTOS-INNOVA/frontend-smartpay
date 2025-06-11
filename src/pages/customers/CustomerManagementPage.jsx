// src/pages/customers/CustomerManagementPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import CustomerTable from './components/CustomerTable';
import CustomerFormModal from './components/CustomerFormModal';
import { PlusIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid';

const initialCustomers = [
    { id: uuidv4(), name: 'Juan Pérez', email: 'juan@example.com', phone: '555-1234', devices: 3, status: 'active' },
    { id: uuidv4(), name: 'María García', email: 'maria@example.com', phone: '555-5678', devices: 1, status: 'active' },
    { id: uuidv4(), name: 'Carlos López', email: 'carlos@example.com', phone: '555-9012', devices: 2, status: 'inactive' },
];

const CustomerManagementPage = () => {
    const [customers, setCustomers] = useState(initialCustomers);
    const [isModalOpen, setIsModalOpen] = useState(false); // Mantener para el modal de edición
    const [editingCustomer, setEditingCustomer] = useState(null);
    const navigate = useNavigate(); // Inicializa useNavigate

    const handleOpenEditModal = (customer) => { // Renombrado para claridad
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const handleCloseEditModal = () => { // Renombrado para claridad
        setIsModalOpen(false);
        setEditingCustomer(null);
    };

    const handleSaveCustomer = (customerData) => {
        // Lógica para guardar/actualizar cliente (solo aplica para edición aquí)
        if (editingCustomer) {
            setCustomers(customers.map(customer =>
                customer.id === editingCustomer.id ? { ...customerData, id: editingCustomer.id } : customer
            ));
        }
        handleCloseEditModal();
    };

    const handleDeleteCustomer = (customerId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
            setCustomers(customers.filter(customer => customer.id !== customerId));
        }
    };

    const handleToggleCustomerStatus = (customerId) => {
        setCustomers(customers.map(customer =>
            customer.id === customerId ? { ...customer, status: customer.status === 'active' ? 'inactive' : 'active' } : customer
        ));
    };

    const handleNewCustomerClick = () => {
        navigate('/customer-registration'); // Redirige a la nueva página de registro por fases
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Clientes</h1>

            <div className="flex justify-end mb-6">
                <button
                    onClick={handleNewCustomerClick}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Registrar Nuevo Cliente
                </button>
            </div>

            <CustomerTable
                customers={customers}
                onEdit={handleOpenEditModal} // Ahora se llama handleOpenEditModal
                onDelete={handleDeleteCustomer}
                onToggleStatus={handleToggleCustomerStatus}
            />

            {/* Este modal solo será para la edición de clientes existentes */}
            <CustomerFormModal
                isOpen={isModalOpen}
                onClose={handleCloseEditModal}
                customer={editingCustomer}
                onSave={handleSaveCustomer}
            />
        </div>
    );
};

export default CustomerManagementPage;