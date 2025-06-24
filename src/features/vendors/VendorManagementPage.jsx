import React, { useState, useEffect, useCallback } from 'react';
import VendorTable from './components/VendorTable';
import VendorFormModal from './components/VendorFormModal';
import { PlusIcon, UserGroupIcon, MagnifyingGlassIcon, InformationCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import { getUsers, createUser, deleteUser, updateUser } from '../../api/users';
import { getRoles } from '../../api/roles';
import { getCities } from '../../api/cities';

const VendorManagementPage = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [availableRoles, setAvailableRoles] = useState([]);

    const fetchVendors = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUsers({ role_name: 'Vendedor' });
            setVendors(data);
        } catch (err) {
            console.error('Error al cargar vendedores:', err);
            setError('No se pudieron cargar los vendedores. Inténtalo de nuevo más tarde.');
            toast.error('Error al cargar vendedores.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRoles = useCallback(async () => {
        try {
            const rolesData = await getRoles();
            setAvailableRoles(rolesData);
        } catch (err) {
            console.error('Error al cargar roles:', err);
            toast.error('Error al cargar los roles necesarios.');
        }
    }, []);

    useEffect(() => {
        fetchVendors();
        fetchRoles();
    }, [fetchVendors, fetchRoles]);

    const handleOpenModal = (vendor = null) => {
        setEditingVendor(vendor);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingVendor(null);
    };

    const handleSubmitVendor = async (vendorData) => { 
        Swal.fire({
            title: editingVendor ? 'Actualizando vendedor...' : 'Creando vendedor...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            if (editingVendor) {
                const dataToUpdate = { ...vendorData };
                if (dataToUpdate.role_id === '') {
                    delete dataToUpdate.role_id;
                }

                await updateUser(editingVendor.user_id, dataToUpdate);
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: '¡Actualizado!',
                    text: `El vendedor ${vendorData.first_name || ''} ${vendorData.last_name || ''} ha sido actualizado.`,
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            } else {
                await createUser(vendorData);
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: '¡Creado!',
                    text: `El vendedor ${vendorData.first_name || ''} ${vendorData.last_name || ''} ha sido añadido exitosamente.`,
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
            fetchVendors();
        } catch (err) {
            Swal.close();
            console.error("Error saving vendor:", err);
            const errorMessage = err.response?.data?.detail || err.message || "Hubo un error al guardar el vendedor.";
            Swal.fire({
                icon: 'error',
                title: 'Error al Guardar',
                text: errorMessage,
                confirmButtonText: 'Ok'
            });
            toast.error(`Error al guardar vendedor: ${errorMessage}`);
        } finally {
            handleCloseModal();
        }
    };

    const handleDeleteVendor = async (vendorId) => {
        const vendorToDelete = vendors.find(vendor => vendor.user_id === vendorId);
        if (!vendorToDelete) return;

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `Vas a eliminar al vendedor ${vendorToDelete.first_name || ''} ${vendorToDelete.last_name || ''}. ¡Esta acción no se puede deshacer!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            Swal.fire({
                title: 'Eliminando vendedor...',
                text: 'Por favor espera',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                await deleteUser(vendorId);
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: `El vendedor ${vendorToDelete.first_name || ''} ${vendorToDelete.last_name || ''} ha sido eliminado.`,
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                fetchVendors();
            } catch (err) {
                Swal.close();
                console.error("Error deleting vendor:", err);
                const errorMessage = err.response?.data?.detail || err.message || "Hubo un error al eliminar el vendedor.";
                Swal.fire({
                    icon: 'error',
                    title: 'Error al Eliminar',
                    text: errorMessage,
                    confirmButtonText: 'Ok'
                });
                toast.error(`Error al eliminar vendedor: ${errorMessage}`);
            }
        }
    };

    const handleToggleVendorStatus = async (vendorId, currentStatus) => {
        const vendorToToggle = vendors.find(vendor => vendor.user_id === vendorId);
        if (!vendorToToggle) return;

        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        const actionText = newStatus === 'Active' ? 'activar' : 'desactivar';

        const result = await Swal.fire({
            title: `¿Estás seguro de ${actionText} este vendedor?`,
            text: `El estado del vendedor ${vendorToToggle.first_name || ''} ${vendorToToggle.last_name || ''} cambiará a "${newStatus}".`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Sí, ${actionText}`,
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            Swal.fire({
                title: `Cambiando estado a ${newStatus}...`,
                text: 'Por favor espera',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                await updateUser(vendorId, { state: newStatus });
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: '¡Estado Actualizado!',
                    text: `El estado de ${vendorToToggle.first_name || ''} ${vendorToToggle.last_name || ''} es ahora ${newStatus}.`,
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                fetchVendors();
            } catch (err) {
                Swal.close();
                console.error("Error toggling vendor status:", err);
                const errorMessage = err.response?.data?.detail || err.message || "Hubo un error al cambiar el estado del vendedor.";
                Swal.fire({
                    icon: 'error',
                    title: 'Error al Cambiar Estado',
                    text: errorMessage,
                    confirmButtonText: 'Ok'
                });
                toast.error(`Error al cambiar estado: ${errorMessage}`);
            }
        }
    };

    // FILTRADO
    const filteredVendors = vendors.filter(vendor => {
        const fullName = `${vendor.first_name || ''} ${vendor.middle_name || ''} ${vendor.last_name || ''} ${vendor.second_last_name || ''}`.toLowerCase();
        const searchLower = searchTerm.toLowerCase();

        return (
            fullName.includes(searchLower) ||
            (vendor.username && vendor.username.toLowerCase().includes(searchLower)) ||
            (vendor.email && vendor.email.toLowerCase().includes(searchLower)) ||
            (vendor.state && vendor.state.toLowerCase().includes(searchLower)) ||
            (vendor.dni && vendor.dni.toLowerCase().includes(searchLower))
        );
    });

    if (loading) {
        return (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex justify-center items-center h-screen">
                <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="ml-3 text-lg text-gray-700">Cargando vendedores...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center text-red-600 bg-red-50 border border-red-200 rounded-lg shadow-md">
                <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-500 mb-3" />
                <h3 className="text-xl font-semibold mb-2">Error al cargar datos</h3>
                <p className="text-base">{error}</p>
                <button
                    onClick={fetchVendors}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Reintentar
                </button>
            </div>
        );
    }

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
                        placeholder="Buscar vendedor por nombre, usuario, email, DNI o estado..."
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
                        Añade un nuevo vendedor para empezar a gestionarlos.
                    </p>
                    <div className="mt-6">
                        <button
                            onClick={() => handleOpenModal()}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" />
                            Añadir Primer Vendedor
                        </button>
                    </div>
                </div>
            ) : filteredVendors.length === 0 && searchTerm ? (
                <div className="p-6 text-center text-gray-500 bg-white shadow sm:rounded-lg">
                    <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron vendedores</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Tu búsqueda de "<span className="font-semibold text-indigo-600">{searchTerm}</span>" no arrojó resultados. Intenta con otro término.
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
                initialData={editingVendor} 
                onSubmit={handleSubmitVendor}
                roles={availableRoles}
                getCitiesApi={getCities}
            />
        </div>
    );
};

export default VendorManagementPage;