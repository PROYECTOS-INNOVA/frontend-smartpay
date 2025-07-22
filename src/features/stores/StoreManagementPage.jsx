import React, { useState, useEffect, useCallback } from 'react';

import { PlusIcon, UserGroupIcon, MagnifyingGlassIcon, InformationCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import { getUsers, createUser, deleteUser, updateUser } from '../../api/users';
import { getRoles } from '../../api/roles';
import { getCountries } from '../../api/cities';
import StoreTable from './components/StoreTable';
import StoreFormModal from './components/StoreFormModal';
import { createStore, deleteStore, getStores, updateStore } from '../../api/stores';

const StoreManagementPage = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStore, setEditingStore] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [availableRoles, setAvailableRoles] = useState([]);

    const fetchStores = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getStores();
            setStores(data);
        } catch (err) {
            console.error('Error al cargar data:', err);
            setError('No se pudieron cargar los registros. Inténtalo de nuevo más tarde.');
            toast.error('Error al cargar registros.');
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
        fetchStores();
        fetchRoles();
    }, [fetchStores, fetchRoles]);

    const handleOpenModal = (store = null) => {
        setEditingStore(store);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStore(null);
    };

    const handleSubmitstore = async (storeData) => {
        Swal.fire({
            title: editingStore ? 'Actualizando...' : 'Creando...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            if (editingStore) {
                const dataToUpdate = { ...storeData };
                if (dataToUpdate.role_id === '') {
                    delete dataToUpdate.role_id;
                }

                await updateStore(editingStore.id, dataToUpdate);
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: '¡Actualizado!',
                    text: `La tienda ${storeData.nombre || ''} ha sido actualizada.`,
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            } else {
                await createStore(storeData);
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: '¡Creado!',
                    text: `La tienda ${storeData.nombre || ''} se ha sido añadido exitosamente.`,
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
            fetchStores();
        } catch (err) {
            Swal.close();
            console.error("Error saving store:", err);
            const errorMessage = err.response?.data?.detail || err.message || "Hubo un error al guardar el registro.";
            Swal.fire({
                icon: 'error',
                title: 'Error al Guardar',
                text: errorMessage,
                confirmButtonText: 'Ok'
            });
            toast.error(`Error al crear el registro: ${errorMessage}`);
        } finally {
            handleCloseModal();
        }
    };

    const handleDeletestore = async (storeId) => {
        const storeToDelete = stores.find(store => store.id === storeId);
        if (!storeToDelete) return;

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            html: `Vas a eliminar al registro <b>${storeToDelete.nombre || ''}</b>. ¡Esta acción no se puede deshacer!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            Swal.fire({
                title: 'Eliminando...',
                text: 'Por favor espera',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                await deleteStore(storeId);
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: `La tienda ${storeToDelete.nombre} ha sido eliminado.`,
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                fetchStores();
            } catch (err) {
                Swal.close();
                console.error("Error deleting store:", err);
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

    const handleToggleStoreStatus = async (storeId, currentStatus) => {
        const storeToToggle = stores.find(store => store.user_id === storeId);
        if (!storeToToggle) return;

        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        const actionText = newStatus === 'Active' ? 'activar' : 'desactivar';

        const result = await Swal.fire({
            title: `¿Estás seguro de ${actionText} este vendedor?`,
            text: `El estado del vendedor ${storeToToggle.first_name || ''} ${storeToToggle.last_name || ''} cambiará a "${newStatus}".`,
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
                await updateUser(storeId, { state: newStatus });
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: '¡Estado Actualizado!',
                    text: `El estado de ${storeToToggle.first_name || ''} ${storeToToggle.last_name || ''} es ahora ${newStatus}.`,
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                fetchStores();
            } catch (err) {
                Swal.close();
                console.error("Error toggling store status:", err);
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
    const filteredStores = stores.filter(store => {
        const searchLower = searchTerm.toLowerCase();
        return (
            store.nombre.includes(searchLower) ||
            (store.nombre && store.nombre.toLowerCase().includes(searchLower))
        );
    });

    if (loading) {
        return (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex justify-center items-center h-screen">
                <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                    onClick={fetchStores}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="container bg-white rounded-xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <UserGroupIcon className="h-8 w-8 mr-2 text-blue-600" />
                    Gestión de Tiendas
                </h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" />
                    Añadir Tienda
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
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500"
                        placeholder="Buscar vendedor por nombre, usuario, email, DNI o estado..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredStores.length === 0 && !searchTerm ? (
                <div className="p-6 text-center text-gray-500 bg-white shadow sm:rounded-lg">
                    <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay tiendas para mostrar</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Añade una nueva para empezar.
                    </p>
                    <div className="mt-6">
                        <button
                            onClick={() => handleOpenModal()}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" />
                            Registrar Primera Tienda
                        </button>
                    </div>
                </div>
            ) : filteredStores.length === 0 && searchTerm ? (
                <div className="p-6 text-center text-gray-500 bg-white shadow sm:rounded-lg">
                    <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron tiendas</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Tu búsqueda de "<span className="font-semibold text-blue-600">{searchTerm}</span>" no arrojó resultados. Intenta con otro término.
                    </p>
                </div>
            ) : (
                <StoreTable
                    data={filteredStores}
                    onEdit={handleOpenModal}
                    onDelete={handleDeletestore}
                    onToggleStatus={handleToggleStoreStatus}
                />
            )}

            <StoreFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialData={editingStore}
                onSubmit={handleSubmitstore}
                roles={availableRoles}
                getCountriesApi={getCountries}
            />
        </div>
    );
};

export default StoreManagementPage;