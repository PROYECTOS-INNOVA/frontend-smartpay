import React, { useState, useEffect, useCallback } from 'react';
import UserTable from './components/UserTable';
import UserFormModal from './components/UserFormModal'; 
import { PlusIcon, UserGroupIcon, MagnifyingGlassIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../common/context/AuthProvider'; 
import { toast } from 'react-toastify';
import { getUsers, createUser, updateUser, deleteUser } from '../../api/users'; 
import { getRoles } from '../../api/roles'; 
import { getCities } from '../../api/cities'; 
import Swal from 'sweetalert2';

const UserManagementPage = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roles, setRoles] = useState([]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUsers({ search: searchTerm });
            setUsers(data);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.message || "Error desconocido al cargar usuarios.";
            setError(errorMessage);
            toast.error(`Error al cargar usuarios: ${errorMessage}`, { autoClose: 5000 });
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    const fetchRoles = useCallback(async () => {
        try {
            const fetchedRoles = await getRoles();
            const predefinedRoleNames = ['Superadmin', 'Admin', 'Vendedor', 'Cliente'];
            const filteredRoles = fetchedRoles.filter(role => predefinedRoleNames.includes(role.name));
            setRoles(filteredRoles);
        } catch (err) {
            toast.error('Error al cargar opciones de roles.');
        }
    }, []);

    useEffect(() => {
        if (token) {
            fetchUsers();
            fetchRoles();
        } else {
            setLoading(false);
            setError('No autenticado. Por favor, inicia sesión.');
            toast.warn('No estás autenticado. Por favor, inicia sesión.', { autoClose: 5000 });
        }
    }, [token, fetchUsers, fetchRoles]);

    const handleOpenModal = (user = null) => {
        setEditingUser(user); 
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSaveUser = useCallback(async (userData) => {
        try {
            if (editingUser) {
                await updateUser(editingUser.user_id, userData);
                Swal.fire({
                    icon: 'success',
                    title: 'Actualizado!',
                    text: 'Usuario actualizado exitosamente.',
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            } else {
                await createUser(userData);
                Swal.fire({
                    icon: 'success',
                    title: '¡Creado!',
                    text: 'Usuario creado exitosamente.',
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            }
            handleCloseModal();
            fetchUsers();
        } catch (error) {

            let errorMessage = 'Error desconocido al guardar el usuario.';
            let errorDetails = '';

            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;

                if (status === 422 && data && data.detail) {
                    errorMessage = 'Error de validación:';
                    errorDetails = data.detail.map((err) => {
                        const loc = Array.isArray(err.loc) && err.loc.length > 1 ? err.loc[1] : 'Desconocido';
                        return `Campo '${loc}': ${err.msg}`;
                    }).join('\n');
                } else if (data.detail && typeof data.detail === 'string') {
                    errorMessage = data.detail;
                } else if (data.message) {
                    errorMessage = data.message;
                } else if (typeof data === 'string') {
                    errorMessage = data;
                } else {
                    errorMessage = `Error ${status}: ${error.response.statusText || 'Error del servidor'}`;
                    if (data) {
                        errorDetails = JSON.stringify(data, null, 2); 
                    }
                }
            } else if (error.request) {
                errorMessage = 'No se recibió respuesta del servidor. Verifica tu conexión o la configuración de CORS.';
            } else {
                errorMessage = error.message;
            }

            Swal.fire({
                icon: 'error',
                title: 'Error al guardar',
                text: errorMessage + (errorDetails ? '\n\nDetalles:\n' + errorDetails : ''),
                customClass: {
                    popup: 'max-w-xl',
                    content: 'whitespace-pre-wrap' 
                },
            });
        }
    }, [editingUser, fetchUsers]);

    const handleDeleteUser = async (userId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¡No podrás revertir esta acción!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    await deleteUser(userId);
                    Swal.fire({
                        icon: 'success',
                        title: '¡Eliminado!',
                        text: 'El usuario ha sido eliminado.',
                        timer: 2500,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                    fetchUsers();
                } catch (err) {
                    const errorMessage = err.response?.data?.detail || err.message || "Error desconocido al eliminar el usuario.";
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al eliminar usuario',
                        text: `Detalles: ${errorMessage}`,
                    });
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const handleToggleUserStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        const actionText = newStatus === 'Active' ? 'activar' : 'desactivar';

        Swal.fire({
            title: `¿Estás seguro de ${actionText} este usuario?`,
            text: `El estado del usuario cambiará a "${newStatus}".`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Sí, ${actionText}!`,
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    await updateUser(userId, { state: newStatus });
                    Swal.fire({
                        icon: 'success',
                        title: '¡Estado Cambiado!',
                        text: `El estado del usuario ha cambiado a ${newStatus}.`,
                        timer: 2500,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                    fetchUsers();
                } catch (err) {
                    const errorMessage = err.response?.data?.detail || err.message || "Error desconocido al cambiar el estado.";
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al cambiar estado',
                        text: `Detalles: ${errorMessage}`,
                    });
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const filteredUsers = users.filter(user =>
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.dni?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.state?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container bg-white rounded-xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <UserGroupIcon className="h-8 w-8 mr-2 text-blue-600" />
                    Gestión de Usuarios
                </h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500"
                        placeholder="Buscar usuario por nombre, DNI, email, rol..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center p-8">
                    <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                initialData={editingUser}
                onSubmit={handleSaveUser}
                roles={roles}
                getCitiesApi={getCities}
            />
        </div>
    );
};

export default UserManagementPage;