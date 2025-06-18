import React, { useState, useEffect, useCallback } from 'react';
import UserTable from './components/UserTable'; // Este componente necesitará adaptarse
import UserFormModal from './components/UserFormModal';
import { PlusIcon, UserGroupIcon, MagnifyingGlassIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../common/context/AuthProvider';
import { toast } from 'react-toastify';
// Importa las funciones del servicio que acabas de crear
import { getUsers, createUser, updateUser, deleteUser } from '../../api/users'; // Ajusta la ruta si es diferente

// No necesitamos API_GATEWAY_URL aquí si lo manejamos en el archivo de servicio

const UserManagementPage = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // Contiene el objeto UserOut
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Envía el término de búsqueda al backend si tu API lo soporta
            const data = await getUsers({ search: searchTerm });
            setUsers(data);
        } catch (err) {
            console.error("Error fetching users:", err);
            // Asumiendo que el error del servicio ya es un objeto de error adecuado o tiene un message
            const errorMessage = err.response?.data?.detail || err.message || "Error desconocido al cargar usuarios.";
            setError(errorMessage);
            toast.error(`Error al cargar usuarios: ${errorMessage}`, { autoClose: 5000 });
        } finally {
            setLoading(false);
        }
    }, [searchTerm]); // Agrega searchTerm como dependencia para re-fetch al buscar

    useEffect(() => {
        if (token) {
            fetchUsers();
        } else {
            setLoading(false);
            setError('No autenticado. Por favor, inicia sesión.');
            toast.warn('No estás autenticado. Por favor, inicia sesión.', { autoClose: 5000 });
        }
    }, [token, fetchUsers]);

    const handleOpenModal = (user = null) => {
        setEditingUser(user); // Será null para "añadir nuevo", o el objeto UserOut para editar
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSaveUser = async (userData) => { // userData será un objeto UserUpdate
        setLoading(true);
        try {
            if (editingUser) {
                // Llama a la función de actualización del servicio
                await updateUser(editingUser.user_id, userData);
                toast.success(`Usuario actualizado exitosamente!`, { autoClose: 3000 });
            } else {
                // Llama a la función de creación del servicio
                await createUser(userData);
                toast.success(`Usuario creado exitosamente!`, { autoClose: 3000 });
            }
            handleCloseModal();
            fetchUsers(); // Recargar la lista de usuarios
        } catch (err) {
            console.error("Error saving user:", err);
            const errorMessage = err.response?.data?.detail || err.message || "Error desconocido al guardar el usuario.";
            toast.error(`Error al guardar usuario: ${errorMessage}`, { autoClose: 5000 });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
            return;
        }
        setLoading(true);
        try {
            await deleteUser(userId); // Llama a la función de eliminación del servicio
            toast.success('Usuario eliminado exitosamente!', { autoClose: 3000 });
            fetchUsers();
        } catch (err) {
            console.error("Error deleting user:", err);
            const errorMessage = err.response?.data?.detail || err.message || "Error desconocido al eliminar el usuario.";
            toast.error(`Error al eliminar usuario: ${errorMessage}`, { autoClose: 5000 });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleUserStatus = async (userId, currentStatus) => {
        setLoading(true);
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active'; // Usar 'active'/'inactive' del backend
        try {
            // Asumiendo que PATCH para estado solo necesita el campo 'state'
            await updateUser(userId, { state: newStatus }); // El backend espera 'state', no 'status'
            toast.success(`Estado del usuario cambiado a ${newStatus}!`, { autoClose: 3000 });
            fetchUsers();
        } catch (err) {
            console.error("Error toggling user status:", err);
            const errorMessage = err.response?.data?.detail || err.message || "Error desconocido al cambiar el estado.";
            toast.error(`Error al cambiar estado: ${errorMessage}`, { autoClose: 5000 });
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || // name no existe, es first_name
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) || // También buscar por apellido
        user.dni?.toLowerCase().includes(searchTerm.toLowerCase()) || // Buscar por DNI
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || // role.name
        user.state?.toLowerCase().includes(searchTerm.toLowerCase()) // state, no status
    );

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <UserGroupIcon className="h-8 w-8 mr-2 text-indigo-600" />
                    Gestión de Usuarios
                </h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" />
                    Añadir Nuevo Usuario
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
                        placeholder="Buscar usuario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center p-8">
                    <svg className="animate-spin h-10 w-10 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-gray-600">Cargando usuarios...</p>
                </div>
            ) : error ? (
                <div className="p-6 text-center bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <InformationCircleIcon className="mx-auto h-12 w-12 text-red-500" />
                    <h3 className="mt-2 text-sm font-medium">Error al cargar datos</h3>
                    <p className="mt-1 text-sm">{error}</p>
                    <button
                        onClick={fetchUsers}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Reintentar
                    </button>
                </div>
            ) : filteredUsers.length === 0 && !searchTerm ? (
                <div className="p-6 text-center text-gray-500 bg-white shadow sm:rounded-lg">
                    <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios para mostrar</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Añade un nuevo usuario para empezar.
                    </p>
                </div>
            ) : filteredUsers.length === 0 && searchTerm ? (
                <div className="p-6 text-center text-gray-500 bg-white shadow sm:rounded-lg">
                    <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron usuarios</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Tu búsqueda de "{searchTerm}" no arrojó resultados. Intenta con otro término.
                    </p>
                </div>
            ) : (
                <UserTable
                    users={filteredUsers}
                    onEdit={handleOpenModal}
                    onDelete={handleDeleteUser}
                    onToggleStatus={handleToggleUserStatus}
                />
            )}

            <UserFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialData={editingUser} // Cambiado a initialData para mayor claridad
                onSubmit={handleSaveUser}
            />
        </div>
    );
};

export default UserManagementPage;