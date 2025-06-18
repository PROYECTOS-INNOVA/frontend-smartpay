import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { toast } from 'react-toastify';
// Importa de los nuevos servicios dedicados
import { getRoles } from '../../../api/roles';
import { getCities } from '../../../api/cities'; 

function UserFormModal({ isOpen, onClose, initialData, onSubmit }) {
    const [formData, setFormData] = useState({
        dni: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        second_last_name: '',
        email: '',
        prefix: '',
        phone: '',
        address: '',
        username: '',
        password: '',
        role_id: '',
        city_id: '',
        state: 'active', // Default value
    });
    const [roles, setRoles] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingDependencies, setLoadingDependencies] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cargar roles y ciudades cuando el modal se abre
    useEffect(() => {
        const fetchDependencies = async () => {
            setLoadingDependencies(true);
            try {
                const fetchedRoles = await getRoles();
                setRoles(fetchedRoles);
                const fetchedCities = await getCities();
                setCities(fetchedCities);
            } catch (error) {
                console.error("Error fetching roles or cities:", error);
                toast.error("Error al cargar roles o ciudades: " + (error.message || "Error desconocido"), { autoClose: 5000 });
            } finally {
                setLoadingDependencies(false);
            }
        };

        if (isOpen) {
            fetchDependencies();
        }
    }, [isOpen]);

    // Sincronizar initialData con formData
    useEffect(() => {
        if (initialData) {
            setFormData({
                dni: initialData.dni || '',
                first_name: initialData.first_name || '',
                middle_name: initialData.middle_name || '',
                last_name: initialData.last_name || '',
                second_last_name: initialData.second_last_name || '',
                email: initialData.email || '',
                prefix: initialData.prefix || '',
                phone: initialData.phone || '',
                address: initialData.address || '',
                username: initialData.username || '',
                password: '', // NUNCA precargar la contraseña
                role_id: initialData.role?.role_id || '', // Acceder al ID del rol anidado
                city_id: initialData.city?.city_id || '', // Acceder al ID de la ciudad anidada
                state: initialData.state || 'active',
            });
        } else {
            // Resetear el formulario para un nuevo usuario
            setFormData({
                dni: '',
                first_name: '',
                middle_name: '',
                last_name: '',
                second_last_name: '',
                email: '',
                prefix: '',
                phone: '',
                address: '',
                username: '',
                password: '',
                role_id: '',
                city_id: '',
                state: 'active',
            });
        }
    }, [initialData, isOpen]); // Agregar isOpen para resetear al cerrar/abrir para nuevo

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const dataToSubmit = { ...formData };

        // Eliminar campos opcionales si están vacíos para UserUpdate
        // Especialmente importante para middle_name, second_last_name, city_id si no se seleccionó
        // y para password si es edición y no se cambió.
        for (const key in dataToSubmit) {
            if (dataToSubmit[key] === '' || dataToSubmit[key] === null) {
                delete dataToSubmit[key];
            }
        }

        // Para la contraseña: si es edición y el campo está vacío, no se envía
        if (initialData && formData.password === '') {
            delete dataToSubmit.password;
        }
        // Si es una creación, la contraseña debe enviarse, y si está vacía, el backend debe validarla.
        // Aquí no la eliminamos si es nueva creación y está vacía, para que el backend maneje el error.

        try {
            await onSubmit(dataToSubmit); // Llama a la función onSave de UserManagementPage
            // onClose() ya se llama dentro de onSubmit en UserManagementPage
        } catch (error) {
            // Errores manejados en UserManagementPage, solo resetear estado de envío aquí
            console.error("Error during form submission in modal:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    {initialData ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                                </Dialog.Title>
                                <div className="mt-4">
                                    {loadingDependencies ? (
                                        <div className="text-center p-4 text-gray-600">Cargando roles y ciudades...</div>
                                    ) : (
                                        <form onSubmit={handleSubmit}>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* DNI */}
                                                <div className="col-span-1">
                                                    <label htmlFor="dni" className="block text-sm font-medium text-gray-700">DNI</label>
                                                    <input
                                                        type="text"
                                                        name="dni"
                                                        id="dni"
                                                        value={formData.dni}
                                                        onChange={handleChange}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    />
                                                </div>
                                                {/* First Name */}
                                                <div className="col-span-1">
                                                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Nombre</label>
                                                    <input
                                                        type="text"
                                                        name="first_name"
                                                        id="first_name"
                                                        value={formData.first_name}
                                                        onChange={handleChange}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    />
                                                </div>
                                                {/* Middle Name */}
                                                <div className="col-span-1">
                                                    <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700">Segundo Nombre (Opcional)</label>
                                                    <input
                                                        type="text"
                                                        name="middle_name"
                                                        id="middle_name"
                                                        value={formData.middle_name}
                                                        onChange={handleChange}
                                                        placeholder="Segundo Nombre (Opcional)"
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    />
                                                </div>
                                                {/* Last Name */}
                                                <div className="col-span-1">
                                                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Apellido</label>
                                                    <input
                                                        type="text"
                                                        name="last_name"
                                                        id="last_name"
                                                        value={formData.last_name}
                                                        onChange={handleChange}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    />
                                                </div>
                                                {/* Second Last Name */}
                                                <div className="col-span-1">
                                                    <label htmlFor="second_last_name" className="block text-sm font-medium text-gray-700">Segundo Apellido (Opcional)</label>
                                                    <input
                                                        type="text"
                                                        name="second_last_name"
                                                        id="second_last_name"
                                                        value={formData.second_last_name}
                                                        onChange={handleChange}
                                                        placeholder="Segundo Apellido (Opcional)"
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    />
                                                </div>
                                                {/* Email */}
                                                <div className="col-span-1">
                                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        id="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    />
                                                </div>
                                                {/* Prefix */}
                                                <div className="col-span-1">
                                                    <label htmlFor="prefix" className="block text-sm font-medium text-gray-700">Prefijo Teléfono</label>
                                                    <input
                                                        type="text"
                                                        name="prefix"
                                                        id="prefix"
                                                        value={formData.prefix}
                                                        onChange={handleChange}
                                                        placeholder="+57"
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    />
                                                </div>
                                                {/* Phone */}
                                                <div className="col-span-1">
                                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                                                    <input
                                                        type="text"
                                                        name="phone"
                                                        id="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    />
                                                </div>
                                                {/* Address */}
                                                <div className="col-span-1">
                                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        id="address"
                                                        value={formData.address}
                                                        onChange={handleChange}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    />
                                                </div>
                                                {/* Username */}
                                                <div className="col-span-1">
                                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                                    <input
                                                        type="text"
                                                        name="username"
                                                        id="username"
                                                        value={formData.username}
                                                        onChange={handleChange}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    />
                                                </div>
                                                {/* Password (condicional) */}
                                                {!initialData && ( // Requerido al crear
                                                    <div className="col-span-1">
                                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                                                        <input
                                                            type="password"
                                                            name="password"
                                                            id="password"
                                                            value={formData.password}
                                                            onChange={handleChange}
                                                            required
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        />
                                                    </div>
                                                )}
                                                {initialData && ( // Opcional al editar
                                                    <div className="col-span-1">
                                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Nueva Contraseña (Opcional)</label>
                                                        <input
                                                            type="password"
                                                            name="password"
                                                            id="password"
                                                            value={formData.password}
                                                            onChange={handleChange}
                                                            placeholder="Dejar en blanco para no cambiar"
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        />
                                                    </div>
                                                )}
                                                {/* Rol */}
                                                <div className="col-span-1">
                                                    <label htmlFor="role_id" className="block text-sm font-medium text-gray-700">Rol</label>
                                                    <select
                                                        id="role_id"
                                                        name="role_id"
                                                        value={formData.role_id}
                                                        onChange={handleChange}
                                                        required
                                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                    >
                                                        <option value="">Selecciona un rol</option>
                                                        {roles.map((role) => (
                                                            <option key={role.role_id} value={role.role_id}>{role.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {/* Ciudad */}
                                                <div className="col-span-1">
                                                    <label htmlFor="city_id" className="block text-sm font-medium text-gray-700">Ciudad (Opcional)</label>
                                                    <select
                                                        id="city_id"
                                                        name="city_id"
                                                        value={formData.city_id}
                                                        onChange={handleChange}
                                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                    >
                                                        <option value="">Selecciona una ciudad</option>
                                                        {cities.map((city) => (
                                                            <option key={city.city_id} value={city.city_id}>{city.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {/* Estado */}
                                                <div className="col-span-1">
                                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado</label>
                                                    <select
                                                        id="state"
                                                        name="state"
                                                        value={formData.state}
                                                        onChange={handleChange}
                                                        required
                                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                    >
                                                        <option value="active">Activo</option>
                                                        <option value="inactive">Inactivo</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex justify-end gap-3">
                                                <button
                                                    type="button"
                                                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                                    onClick={onClose}
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? 'Guardando...' : (initialData ? 'Guardar Cambios' : 'Crear Usuario')}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default UserFormModal;