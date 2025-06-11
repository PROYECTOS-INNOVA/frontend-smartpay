import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { User, IdCard, Mail, Key, Bell, Monitor, Save, Smartphone } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfilePage = () => {
    const { user, updateUserProfile } = useAuth();

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

/*     const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [theme, setTheme] = useState('light'); */

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setUsername(user.username || '');
            setEmail(user.email || '');
            setRole(user.role || user.Rol || '');
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        console.log("Intentando actualizar perfil:", { name, username, email });

        try {
            // BLOQUE: Lógica para enviar la actualización del perfil al backend (DESCOMENTAR Y ADAPTAR)
            /*
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ name, username, email })
            });
      
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el perfil');
            }
      
            const updatedUserData = await response.json();
            */

            const updatedUserData = { ...user, name, username, email };
            if (updateUserProfile) {
                updateUserProfile(updatedUserData);
            }

            toast.success('Perfil actualizado exitosamente!', {
                position: "top-right", autoClose: 3000, hideProgressBar: false,
                closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined,
            });

        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            toast.error(`Error al actualizar el perfil: ${error.message || 'Inténtalo de nuevo.'}`, {
                position: "top-right", autoClose: 5000, hideProgressBar: false,
                closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined,
            });
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            toast.error('Las nuevas contraseñas no coinciden.', { position: "top-right" });
            return;
        }

        if (newPassword.length < 6) {
            toast.error('La nueva contraseña debe tener al menos 6 caracteres.', { position: "top-right" });
            return;
        }

        console.log("Intentando cambiar contraseña:", { currentPassword, newPassword });

        try {
            // BLOQUE: Lógica para enviar la solicitud de cambio de contraseña al backend (DESCOMENTAR Y ADAPTAR)
            /*
            const response = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });
      
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al cambiar la contraseña. Verifica la contraseña actual.');
            }
            */

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
        }
    };

    // const handlePreferencesUpdate = async (e) => {
        // e.preventDefault();
        // console.log("Actualizando preferencias:", { notificationsEnabled, theme });

        // try {
            // BLOQUE: Lógica para actualizar preferencias en el backend (DESCOMENTAR Y ADAPTAR)
            /*
            const response = await fetch('/api/user/preferences', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ notificationsEnabled, theme })
            });
      
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar preferencias');
            }
            */

            // toast.success('Preferencias actualizadas!', { position: "top-right" });
        // } catch (error) {
            // toast.error(`Error al actualizar preferencias: ${error.message || 'Inténtalo de nuevo.'}`, { position: "top-right" });
        // }
    // };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-full text-gray-600">
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
                    <IdCard className="h-6 w-6 mr-2 text-indigo-600" /> {/* ¡Corrección aquí! */}
                    Información Personal
                </h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                        <input
                            type="text"
                            id="name"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rol</label>
                        <input
                            type="text"
                            id="role"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 cursor-not-allowed sm:text-sm"
                            value={role}
                            readOnly
                        />
                    </div>
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Save className="-ml-0.5 mr-2 h-5 w-5" />
                        Guardar Cambios
                    </button>
                </form>
            </div>

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
                    >
                        <Save className="-ml-0.5 mr-2 h-5 w-5" />
                        Cambiar Contraseña
                    </button>
                </form>
            </div>

            {/* <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Monitor className="h-6 w-6 mr-2 text-indigo-600" />
                    Preferencias de la Aplicación
                </h2>
                <form onSubmit={handlePreferencesUpdate} className="space-y-4">
                    <div className="flex items-center">
                        <input
                            id="notifications-enabled"
                            name="notifications-enabled"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={notificationsEnabled}
                            onChange={(e) => setNotificationsEnabled(e.target.checked)}
                        />
                        <label htmlFor="notifications-enabled" className="ml-2 block text-sm text-gray-900">
                            Habilitar Notificaciones por Correo
                        </label>
                    </div>
                    <div>
                        <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Tema de la Interfaz</label>
                        <select
                            id="theme"
                            name="theme"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                        >
                            <option value="light">Claro</option>
                            <option value="dark">Oscuro</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Save className="-ml-0.5 mr-2 h-5 w-5" />
                        Guardar Preferencias
                    </button>
                </form>
            </div> */}

            <ToastContainer />
        </div>
    );
};

export default UserProfilePage;