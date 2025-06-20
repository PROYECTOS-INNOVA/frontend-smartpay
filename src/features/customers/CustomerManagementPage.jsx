import React, { useState, useEffect, useCallback } from 'react'; // Agregamos useEffect, useCallback
import { useNavigate } from 'react-router-dom';
import CustomerTable from './components/CustomerTable'; // Asumiendo que CustomerTable está en un subdirectorio components
import CustomerFormModal from './components/CustomerFormModal'; // Asumiendo que CustomerFormModal está en un subdirectorio components
import { PlusIcon } from '@heroicons/react/24/outline';
// NO necesitamos uuidv4 si estamos obteniendo IDs de la API

// Importar las funciones del servicio de usuarios
import { getUsers, createUser, updateUser, deleteUser } from '../../api/users'; // <--- Importamos el servicio
import { toast } from 'react-toastify'; // Para notificaciones al usuario, asegúrate de tener react-toastify instalado

const CustomerManagementPage = () => {
    const [customers, setCustomers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [loading, setLoading] = useState(true); // Nuevo estado de carga
    const [error, setError] = useState(null);     // Nuevo estado de error
    const navigate = useNavigate();

    // Función para cargar los clientes desde la API
    // Usamos useCallback para memoizar la función y evitar re-creaciones innecesarias
    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const allUsers = await getUsers(); // Obtener todos los usuarios
            // Filtrar solo los usuarios con rol "Client"
            const clientUsers = allUsers.filter(user => user.role && user.role.name === 'Client');
            setCustomers(clientUsers);
        } catch (err) {
            console.error('Error al cargar clientes:', err);
            setError('No se pudieron cargar los clientes. Inténtalo de nuevo más tarde.');
            toast.error('Error al cargar clientes.');
        } finally {
            setLoading(false);
        }
    }, []); // Dependencias vacías, solo se crea una vez

    // Cargar los clientes cuando el componente se monta
    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]); // Ejecutar cuando fetchCustomers cambie (solo al inicio)


    const handleOpenEditModal = (customer) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsModalOpen(false);
        setEditingCustomer(null);
    };

    const handleSaveCustomer = async (customerData) => {
        try {
            if (editingCustomer) {
                // Actualizar cliente existente
                await updateUser(editingCustomer.user_id, customerData); // Usar user_id
                toast.success('Cliente actualizado correctamente.');
            } else {
                // Crear nuevo cliente
                // NOTA: Para crear un cliente, necesitarás incluir el role_id del rol 'Client'
                // y posiblemente otros campos requeridos por tu API.
                // Esto podría requerir obtener los roles primero para encontrar el ID del rol 'Client'.
                // Por ahora, asumimos que 'role_id' se incluye en customerData o se maneja en el backend.
                // O, si hay un endpoint específico para crear clientes, usarlo.
                // Si necesitas obtener los roles, podrías hacer algo como:
                // const roles = await getRoles();
                // const clientRole = roles.find(role => role.name === 'Client');
                // if (clientRole) {
                //     customerData.role_id = clientRole.role_id;
                // } else {
                //     throw new Error('Rol "Client" no encontrado.');
                // }

                await createUser(customerData); // Si la API requiere un rol específico, deberás agregarlo aquí
                toast.success('Cliente creado correctamente.');
            }
            fetchCustomers(); // Volver a cargar la lista para ver los cambios
        } catch (err) {
            console.error('Error al guardar cliente:', err);
            toast.error(`Error al guardar cliente: ${err.response?.data?.detail || err.message}`);
        } finally {
            handleCloseEditModal();
        }
    };

    const handleDeleteCustomer = async (customerId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este cliente? Esta acción es irreversible.')) {
            try {
                await deleteUser(customerId); // Usar customerId (que será user_id)
                toast.success('Cliente eliminado correctamente.');
                fetchCustomers(); // Volver a cargar la lista para ver los cambios
            } catch (err) {
                console.error('Error al eliminar cliente:', err);
                toast.error(`Error al eliminar cliente: ${err.response?.data?.detail || err.message}`);
            }
        }
    };

    const handleToggleCustomerStatus = async (customerId, currentStatus) => {
        try {
            // Asumiendo que la API permite cambiar el estado con un PATCH
            const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
            await updateUser(customerId, { state: newStatus }); // El campo es 'state' no 'status'
            toast.success(`Estado del cliente cambiado a ${newStatus}.`);
            fetchCustomers(); // Volver a cargar la lista
        } catch (err) {
            console.error('Error al cambiar estado del cliente:', err);
            toast.error(`Error al cambiar estado: ${err.response?.data?.detail || err.message}`);
        }
    };

    const handleNewCustomerClick = () => {
        // Redirige a una página de registro de usuario/cliente separada
        // o abre el modal en modo creación (si CustomerFormModal lo soporta)
        // Por ahora, tu código ya redirige:
        navigate('/customer-registration');
        // Si quisieras abrir el modal para un nuevo cliente:
        // setEditingCustomer(null);
        // setIsModalOpen(true);
    };


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
                customers={customers}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteCustomer}
                onToggleStatus={handleToggleCustomerStatus}
            />

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