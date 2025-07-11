import React, { useState, useEffect, useCallback } from 'react';
import CustomerTable from './components/CustomerTable'; // Asegúrate de que esta ruta sea correcta
import CustomerFormModal from './components/CustomerFormModal'; // Asegúrate de que esta ruta sea correcta
import { PlusIcon, UserGroupIcon, MagnifyingGlassIcon, InformationCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

// Importa tus funciones de API existentes
import { getUsers, createUser, deleteUser, updateUser } from '../../api/users';
import { getRoles } from '../../api/roles';

const CustomerManagementPage = () => {
    const [customers, setCustomers] = useState([]); // Lista completa de clientes obtenida del API
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const [availableRoles, setAvailableRoles] = useState([]);

    // Esta función ahora solo trae los clientes del API sin filtro de búsqueda
    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUsers({ role_name: 'Cliente' });
            setCustomers(data);
        } catch (err) {
            console.error('Error al cargar clientes:', err);
            setError('No se pudieron cargar los clientes. Inténtalo de nuevo más tarde.');
            toast.error('Error al cargar clientes.');
        } finally {
            setLoading(false);
        }
    }, []); // Dependencias vacías, solo se crea una vez

    const fetchRoles = useCallback(async () => {
        try {
            const rolesData = await getRoles();
            setAvailableRoles(rolesData);
        } catch (err) {
            console.error('Error al cargar roles:', err);
            toast.error('Error al cargar los roles necesarios.');
        }
    }, []);

    // Este useEffect se encargará de cargar los clientes y roles solo una vez al montar el componente.
    useEffect(() => {
        fetchCustomers();
        fetchRoles();
    }, [fetchCustomers, fetchRoles]); // Asegúrate de que fetchCustomers y fetchRoles estén en las dependencias si se redefinen, pero con useCallback ya están estables.

    const handleOpenModal = (customer = null) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCustomer(null);
    };

    const handleSubmitCustomer = async (customerData) => {
        Swal.fire({
            title: editingCustomer ? 'Actualizando cliente...' : 'Creando cliente...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            if (editingCustomer) {
                const dataToUpdate = { ...customerData };
                await updateUser(editingCustomer.user_id, dataToUpdate);
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: '¡Actualizado!',
                    text: `El cliente ${customerData.first_name || ''} ${customerData.last_name || ''} ha sido actualizado.`,
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            } else {
                await createUser(customerData);
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: '¡Creado!',
                    text: `El cliente ${customerData.first_name || ''} ${customerData.last_name || ''} ha sido añadido exitosamente.`,
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
            fetchCustomers(); // Vuelve a cargar los clientes después de una operación CRUD
        } catch (err) {
            Swal.close();
            console.error("Error saving customer:", err);
            const errorMessage = err.response?.data?.detail || err.message || "Hubo un error al guardar el cliente.";
            Swal.fire({
                icon: 'error',
                title: 'Error al Guardar',
                text: errorMessage,
                confirmButtonText: 'Ok'
            });
            toast.error(`Error al guardar cliente: ${errorMessage}`);
        } finally {
            handleCloseModal();
        }
    };

    const handleDeleteCustomer = async (customerId) => {
        const customerToDelete = customers.find(customer => customer.user_id === customerId);
        if (!customerToDelete) return;

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `Vas a eliminar al cliente ${customerToDelete.first_name || ''} ${customerToDelete.last_name || ''}. ¡Esta acción no se puede deshacer!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            Swal.fire({
                title: 'Eliminando cliente...',
                text: 'Por favor espera',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                await deleteUser(customerId);
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: `El cliente ${customerToDelete.first_name || ''} ${customerToDelete.last_name || ''} ha sido eliminado.`,
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                fetchCustomers(); // Vuelve a cargar los clientes después de una operación CRUD
            } catch (err) {
                Swal.close();
                console.error("Error deleting customer:", err);
                const errorMessage = err.response?.data?.detail || err.message || "Hubo un error al eliminar el cliente.";
                Swal.fire({
                    icon: 'error',
                    title: 'Error al Eliminar',
                    text: errorMessage,
                    confirmButtonText: 'Ok'
                });
                toast.error(`Error al eliminar cliente: ${errorMessage}`);
            }
        }
    };

    const handleToggleCustomerStatus = async (customerId, currentStatus) => {
        const customerToToggle = customers.find(customer => customer.user_id === customerId);
        if (!customerToToggle) return;

        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        const actionText = newStatus === 'Active' ? 'activar' : 'desactivar';

        const result = await Swal.fire({
            title: `¿Estás seguro de ${actionText} este cliente?`,
            text: `El estado del cliente ${customerToToggle.first_name || ''} ${customerToToggle.last_name || ''} cambiará a "${newStatus}".`,
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
                await updateUser(customerId, { state: newStatus });
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: '¡Estado Actualizado!',
                    text: `El estado de ${customerToToggle.first_name || ''} ${customerToToggle.last_name || ''} es ahora ${newStatus}.`,
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                fetchCustomers(); // Vuelve a cargar los clientes después de una operación CRUD
            } catch (err) {
                Swal.close();
                console.error("Error toggling customer status:", err);
                const errorMessage = err.response?.data?.detail || err.message || "Hubo un error al cambiar el estado del cliente.";
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

    // FILTRADO: Ahora el filtrado se realiza sobre el array `customers` que ya está en el estado
    const filteredCustomers = customers.filter(customer => {
        const fullName = `${customer.first_name || ''} ${customer.middle_name || ''} ${customer.last_name || ''} ${customer.second_last_name || ''}`.toLowerCase();
        const searchLower = searchTerm.toLowerCase();

        return (
            fullName.includes(searchLower) ||
            (customer.username && customer.username.toLowerCase().includes(searchLower)) ||
            (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
            (customer.state && customer.state.toLowerCase().includes(searchLower)) ||
            (customer.dni && customer.dni.toLowerCase().includes(searchLower))
        );
    });

    // Eliminamos el useEffect que tenía [searchTerm, fetchCustomers]
    // Ya no es necesario recargar la lista de la API cada vez que se escribe.


    if (loading) {
        return (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex justify-center items-center h-screen">
                <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="ml-3 text-lg text-gray-700">Cargando clientes...</p>
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
                    onClick={fetchCustomers}
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
                    Gestión de Clientes
                </h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" />
                    Añadir Nuevo Cliente
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
                        placeholder="Buscar cliente por nombre, usuario, email, DNI o estado..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredCustomers.length === 0 && !searchTerm ? (
                <div className="p-6 text-center text-gray-500 bg-white shadow sm:rounded-lg">
                    <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay clientes para mostrar</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Añade un nuevo cliente para empezar a gestionarlos.
                    </p>
                    <div className="mt-6">
                        <button
                            onClick={() => handleOpenModal()}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" />
                            Añadir Primer Cliente
                        </button>
                    </div>
                </div>
            ) : filteredCustomers.length === 0 && searchTerm ? (
                <div className="p-6 text-center text-gray-500 bg-white shadow sm:rounded-lg">
                    <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron clientes</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Tu búsqueda de "<span className="font-semibold text-blue-600">{searchTerm}</span>" no arrojó resultados. Intenta con otro término.
                    </p>
                </div>
            ) : (
                <CustomerTable
                    customers={filteredCustomers} // Aquí pasamos los clientes ya filtrados
                    onEdit={handleOpenModal}
                    onDelete={handleDeleteCustomer}
                    onToggleStatus={handleToggleCustomerStatus}
                />
            )}

            <CustomerFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialData={editingCustomer}
                onSubmit={handleSubmitCustomer}
                roles={availableRoles}
            />
        </div>
    );
};

export default CustomerManagementPage;