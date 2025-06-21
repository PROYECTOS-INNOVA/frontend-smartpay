// CustomerManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerTable from './components/CustomerTable';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

// Importar las funciones del servicio de usuarios.
import { getUsers, deleteUser, updateUser } from '../../api/users';

const CustomerManagementPage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carga para la tabla principal
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [columnFilters, setColumnFilters] = useState({
        dni: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        city__name: '',
        state: '',
    });

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUsers({ role_name: 'Cliente' });
            setCustomers(data);
            console.log("Clientes cargados (filtrados por backend):", data);
        } catch (err) {
            console.error('Error al cargar clientes:', err);
            setError('No se pudieron cargar los clientes. Inténtalo de nuevo más tarde.');
            toast.error('Error al cargar clientes.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleNewCustomerClick = () => {
        navigate('/customer-registration');
    };

    const handleDeleteCustomer = async (customerId) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            // Muestra el loading de SweetAlert2
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
                Swal.close(); // Cierra el loading
                Swal.fire({
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: 'El cliente ha sido eliminado correctamente.',
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                fetchCustomers(); // Volver a cargar la lista después de eliminar
            } catch (err) {
                Swal.close(); // Cierra el loading en caso de error
                console.error('Error al eliminar cliente:', err);
                const errorMessage = err.response?.data?.detail || err.message || 'Error desconocido al eliminar el cliente.';
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                });
                toast.error(`Error al eliminar cliente: ${errorMessage}`);
            }
        }
    };

    const handleToggleCustomerStatus = async (customerId, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        const actionText = newStatus === 'Active' ? 'activar' : 'desactivar';

        const result = await Swal.fire({
            title: `¿Estás seguro de ${actionText} este cliente?`,
            text: `El estado del cliente cambiará a "${newStatus}".`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Sí, ${actionText}`,
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            // Muestra el loading de SweetAlert2
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
                Swal.close(); // Cierra el loading
                Swal.fire({
                    icon: 'success',
                    title: '¡Actualizado!',
                    text: `Estado del cliente cambiado a ${newStatus}.`,
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                fetchCustomers(); // Volver a cargar la lista después de actualizar el estado
            } catch (err) {
                Swal.close(); // Cierra el loading en caso de error
                console.error('Error al cambiar estado del cliente:', err);
                const errorMessage = err.response?.data?.detail || err.message || 'Error desconocido al cambiar el estado.';
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                });
                toast.error(`Error al cambiar estado: ${errorMessage}`);
            }
        }
    };

    const filteredCustomers = customers.filter(customer => {
        for (const key in columnFilters) {
            const filterValue = columnFilters[key];
            if (filterValue) {
                let customerValue = '';
                if (key.includes('__')) {
                    const [mainKey, subKey] = key.split('__');
                    customerValue = String(customer[mainKey]?.[subKey] || '').toLowerCase();
                } else {
                    customerValue = String(customer[key] || '').toLowerCase();
                }

                if (!customerValue.includes(filterValue.toLowerCase())) {
                    return false;
                }
            }
        }
        return true;
    });

    const handleColumnFilterChange = (columnKey, value) => {
        setColumnFilters(prevFilters => ({
            ...prevFilters,
            [columnKey]: value,
        }));
    };

    // Este es el loading para la carga inicial de la tabla, no para las acciones
    if (loading) {
        return (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center text-gray-600">
                Cargando clientes...
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center text-red-600">
                {error}
            </div>
        );
    }

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
                customers={filteredCustomers}
                onDelete={handleDeleteCustomer}
                onToggleStatus={handleToggleCustomerStatus}
                columnFilters={columnFilters}
                onColumnFilterChange={handleColumnFilterChange}
            />
        </div>
    );
};

export default CustomerManagementPage;