import React, { useState, useEffect } from 'react';
import { useAuth } from '../../common/context/AuthProvider';
import { User, IdCard, Mail, Key, Bell, Monitor, Save, Smartphone } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { requestPasswordReset } from '../../api/auth';
import { getUserId, updateUser } from '../../api/users';

// URL base de tu API Gateway
const API_GATEWAY_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

const UserProfilePage = () => {
    const { user: userData, updateUserProfile, token } = useAuth();
    const [user, setUser] = useState(null);

    const fetchUserData = async () => {
        const user = await getUserId(userData.user_id);
        setUser(user);
    }

    // Estados para la información del perfil
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [dni, setDni] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [roleName, setRoleName] = useState('');


    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // Estados de carga para los formularios
    const [isProfileUpdating, setIsProfileUpdating] = useState(false);
    const [isPasswordChanging, setIsPasswordChanging] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    //Efect para user
    useEffect(() => {
        if (user) {
            setFirstName(user.first_name || '');
            setLastName(user.last_name || '');
            setUsername(user.username || '');
            setEmail(user.email || '');
            setDni(user.dni || '');
            setPhone(user.phone || '');
            setAddress(user.address || '');
            setRoleName(user.role?.name || '');
        }
    }, [user]);

    /**
     * Metodo para enviar correo de actualizacion
     * @param {*} e 
     */
    const sendEmailPass = async () => {
        setIsPasswordChanging(true);
        await requestPasswordReset({ dni: user.dni }).catch((err) => {
            setIsPasswordChanging(false);
        })
        setIsPasswordChanging(false);
        toast.success('Correo enviado exitosamente! ' + user.email, {})
    }

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsProfileUpdating(true);

        try {
            const dataToUpdate = {
                first_name: firstName,
                last_name: lastName,
                // username: username,
                email: email,
                phone: phone,
                address: address,
            };
            await updateUser(user.user_id, dataToUpdate)
                .then(async result => {
                    toast.success('Perfil actualizado exitosamente!')
                })
                .catch(err => {
                    toast.error('Error actualizando el perfil. Intente de nuevo')
                });

            // const response = await fetch(`${API_GATEWAY_URL}/users/${user.user_id}`, {
            //     method: 'PATCH',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${token}`
            //     },
            //     body: JSON.stringify(dataToUpdate)
            // });

            // if (!response.ok) {
            //     const errorData = await response.json();
            //     throw new Error(errorData.detail || 'Error al actualizar el perfil.');
            // }
            // const updatedUserResponse = await fetch(`${API_GATEWAY_URL}/users/me`, {
            //     headers: {
            //         'Authorization': `Bearer ${token}`
            //     }
            // });

            // if (!updatedUserResponse.ok) {
            //     throw new Error('Error al recargar el perfil después de la actualización.');
            // }
            // const updatedUserFromApi = await updatedUserResponse.json();
            // updateUserProfile(updatedUserFromApi);

            // toast.success('Perfil actualizado exitosamente!', {
            //     position: "top-right", autoClose: 3000, hideProgressBar: false,
            //     closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined,
            // });

        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            toast.error(`Error al actualizar el perfil: ${error.message || 'Inténtalo de nuevo.'}`, {
                position: "top-right", autoClose: 5000, hideProgressBar: false,
                closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined,
            });
        } finally {
            setIsProfileUpdating(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setIsPasswordChanging(true);

        if (newPassword !== confirmNewPassword) {
            toast.error('Las nuevas contraseñas no coinciden.', { position: "top-right" });
            setIsPasswordChanging(false);
            return;
        }

        if (newPassword.length < 6) {
            toast.error('La nueva contraseña debe tener al menos 6 caracteres.', { position: "top-right" });
            setIsPasswordChanging(false);
            return;
        }

        if (currentPassword === newPassword) {
            toast.error('La nueva contraseña no puede ser igual a la actual.', { position: "top-right" });
            setIsPasswordChanging(false);
            return;
        }

        try {
            const response = await fetch(`${API_GATEWAY_URL}/users/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: user.user_id,
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al cambiar la contraseña. Verifica la contraseña actual.');
            }

            toast.success('Contraseña cambiada exitosamente!', {
                position: "top-right", autoClose: 3000, hideProgressBar: false,
                closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined,
            });

            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');

        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            toast.error(`Error al cambiar la contraseña: ${error.message || 'Inténtalo de nuevo.'}`, {
                position: "top-right", autoClose: 5000, hideProgressBar: false,
                closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined,
            });
        } finally {
            setIsPasswordChanging(false);
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-600">
                Cargando perfil o no autenticado...
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center border-b pb-4">
                <User className="h-8 w-8 mr-2 text-indigo-600" />
                Configuración del Perfil
            </h1>

            <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <IdCard className="h-6 w-6 mr-2 text-indigo-600" />
                    Información Personal
                </h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Nombres</label>
                        <input
                            type="text"
                            id="firstName"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellidos</label>
                        <input
                            type="text"
                            id="lastName"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
                        <input
                            type="text"
                            id="username"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {/* Campos de DNI, teléfono y dirección - Asumiendo que pueden ser actualizados */}
                    <div>
                        <label htmlFor="dni" className="block text-sm font-medium text-gray-700">DNI</label>
                        <input
                            type="text"
                            id="dni"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 cursor-not-allowed sm:text-sm"
                            value={dni}
                            readOnly // DNI usualmente no es editable
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <input
                            type="text"
                            id="phone"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
                        <input
                            type="text"
                            id="address"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rol</label>
                        <input
                            type="text"
                            id="role"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 cursor-not-allowed sm:text-sm"
                            value={roleName}
                            readOnly
                        />
                    </div>
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={isProfileUpdating} // Deshabilitar durante la carga
                    >
                        {isProfileUpdating ? (
                            <svg className="animate-spin -ml-0.5 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <Save className="-ml-0.5 mr-2 h-5 w-5" />
                        )}
                        {isProfileUpdating ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </form>
            </div>
            {/* 
            <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Key className="h-6 w-6 mr-2 text-indigo-600" />
                    Cambiar Contraseña
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Contraseña Actual</label>
                        <input
                            type="password"
                            id="current-password"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                        <input
                            type="password"
                            id="new-password"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
                        <input
                            type="password"
                            id="confirm-new-password"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={isPasswordChanging} // Deshabilitar durante la carga
                    >
                        {isPasswordChanging ? (
                            <svg className="animate-spin -ml-0.5 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <Save className="-ml-0.5 mr-2 h-5 w-5" />
                        )}
                        {isPasswordChanging ? 'Cambiando...' : 'Cambiar Contraseña'}
                    </button>
                </form>
            </div> */}
            <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800  flex items-center">
                    <Key className="h-6 w-6 mr-2 text-indigo-600" />
                    Cambiar Contraseña
                </h2>
                <p className='text-sm mb-5'>Se hará a traves de correo electrónico</p>
                <button
                    onClick={sendEmailPass}
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"

                >
                    {isPasswordChanging ? (
                        <svg className="animate-spin -ml-0.5 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <Save className="-ml-0.5 mr-2 h-5 w-5" />
                    )}
                    {isPasswordChanging ? 'Enviando...' : 'Enviar correo'}
                </button>

                <ToastContainer />
            </div>
        </div>
    );
};

export default UserProfilePage;