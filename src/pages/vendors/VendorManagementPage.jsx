import React, { useState } from 'react';
import VendorTable from './components/VendorTable';
import VendorFormModal from './components/VendorFormModal';
import { PlusIcon, UserGroupIcon, MagnifyingGlassIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos

// Datos dummy iniciales de vendedores
const initialVendors = [
    { id: uuidv4(), username: 'vendedor1', name: 'Juan Pérez', email: 'juan.perez@example.com', role: 'Vendedor', status: 'Activo' },
    { id: uuidv4(), username: 'vendedor2', name: 'Ana García', email: 'ana.garcia@example.com', role: 'Vendedor', status: 'Activo' },
    { id: uuidv4(), username: 'vendedor3', name: 'Pedro Sánchez', email: 'pedro.sanchez@example.com', role: 'Vendedor', status: 'Inactivo' },
];

const VendorManagementPage = () => {
    const [vendors, setVendors] = useState(initialVendors);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenModal = (vendor = null) => {
        setEditingVendor(vendor);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingVendor(null);
    };

    const handleSaveVendor = (vendorData) => {
        if (editingVendor) {
            // Actualizar vendedor existente
            setVendors(vendors.map(vendor =>
                vendor.id === editingVendor.id ? { ...vendorData, id: editingVendor.id } : vendor
            ));
        } else {
            // Añadir nuevo vendedor
            setVendors([...vendors, { ...vendorData, id: uuidv4() }]); // Asegura un nuevo ID si no vino del form
        }
    };

    const handleDeleteVendor = (vendorId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este vendedor?')) {
            setVendors(vendors.filter(vendor => vendor.id !== vendorId));
        }
    };

    const handleToggleVendorStatus = (vendorId) => {
        setVendors(vendors.map(vendor =>
            vendor.id === vendorId ? { ...vendor, status: vendor.status === 'Activo' ? 'Inactivo' : 'Activo' } : vendor
        ));
    };

    const filteredVendors = vendors.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log("VendorManagementPage: Renderizando el mínimo.")

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <UserGroupIcon className="h-8 w-8 mr-2 text-indigo-600" />
                    Gestión de Vendedores
                </h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" />
                    Añadir Vendedor
                </button>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        name="search"
                        id="search"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500"
                        placeholder="Buscar vendedor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredVendors.length === 0 && !searchTerm ? (
                <div className="p-6 text-center text-gray-500 bg-white shadow sm:rounded-lg">
                    <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay vendedores para mostrar</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Añade un nuevo vendedor para empezar.
                    </p>
                </div>
            ) : filteredVendors.length === 0 && searchTerm ? (
                <div className="p-6 text-center text-gray-500 bg-white shadow sm:rounded-lg">
                    <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron vendedores</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Tu búsqueda de "{searchTerm}" no arrojó resultados. Intenta con otro término.
                    </p>
                </div>
            ) : (
                <VendorTable
                    vendors={filteredVendors}
                    onEdit={handleOpenModal}
                    onDelete={handleDeleteVendor}
                    onToggleStatus={handleToggleVendorStatus}
                />
            )}

            <VendorFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                vendor={editingVendor}
                onSave={handleSaveVendor}
            />

            {/* Puedes mantener o eliminar el ConfirmDialog si la alerta de window.confirm es suficiente por ahora */}
            {/* <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que quieres eliminar al vendedor ${currentVendor?.name}? Esta acción no se puede deshacer.`}
            /> */}
        </div>
    );
};

export default VendorManagementPage;