import React, { useState, useEffect, Fragment, useRef, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';
import { XMarkIcon } from '@heroicons/react/24/outline';

const VendorFormModal = ({ isOpen, onClose, initialData, onSubmit, roles, getCitiesApi }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        second_last_name: '',
        email: '',
        username: '',
        dni: '',
        prefix: '',
        phone: '',
        address: '',
        city_id: '',
        city_name_input: '',
        role_id: '',
        state: 'Active',
        password: '',
    });
    const [isNewVendor, setIsNewVendor] = useState(false);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const cityInputRef = useRef(null);

    const vendorRoleId = React.useMemo(() =>
        roles?.find(role => role.name === 'Vendedor')?.role_id,
        [roles]
    );

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                console.log("Initial Data:", initialData);

                // Modo edición
                setIsNewVendor(false);
                setFormData({
                    first_name: initialData.first_name || '',
                    middle_name: initialData.middle_name || '',
                    last_name: initialData.last_name || '',
                    second_last_name: initialData.second_last_name || '',
                    email: initialData.email || '',
                    username: initialData.username || '',
                    dni: initialData.dni || '',
                    prefix: initialData.prefix || '',
                    phone: initialData.phone || '',
                    address: initialData.address || '',
                    city_id: initialData.city?.city_id || '',
                    city_name_input: initialData.city?.name || '',
                    role_id: initialData.role?.role_id || vendorRoleId || '',
                    state: initialData.state || 'Active',
                    password: '',
                });
            } else {
                // Modo creación de nuevo vendedor
                setIsNewVendor(true);
                setFormData({
                    first_name: '',
                    middle_name: '',
                    last_name: '',
                    second_last_name: '',
                    email: '',
                    username: '',
                    dni: '',
                    prefix: '',
                    phone: '',
                    address: '',
                    city_id: '',
                    city_name_input: '',
                    role_id: vendorRoleId || '',
                    state: 'Active',
                    password: '',
                });
            }
            setCitySuggestions([]);
            setShowSuggestions(false);
        }
    }, [initialData, isOpen, vendorRoleId]);

    const debouncedFetchCities = useCallback(
        debounce(async (searchTerm) => {
            if (searchTerm.length >= 2) {
                try {
                    const fetchedCities = await getCitiesApi({ search_term: searchTerm });
                    const uniqueCities = Array.from(new Map(fetchedCities.map(city => [city.name, city])).values());
                    setCitySuggestions(uniqueCities);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Error fetching cities:", error);
                    setCitySuggestions([]);
                    setShowSuggestions(false);
                }
            } else {
                setCitySuggestions([]);
                setShowSuggestions(false);
            }
        }, 300),
        [getCitiesApi]
    );

    const handleCityInputChange = (e) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            city_name_input: value,
            city_id: '',
        }));
        debouncedFetchCities(value);
    };

    const handleCitySelect = (city) => {
        setFormData((prev) => ({
            ...prev,
            city_id: city.city_id,
            city_name_input: city.name,
        }));
        setCitySuggestions([]);
        setShowSuggestions(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cityInputRef.current && !cityInputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!vendorRoleId) {
            Swal.fire({
                icon: 'error',
                title: 'Error de configuración',
                text: 'El rol "Vendedor" no se encontró en la lista de roles proporcionados. Asegúrate de que el rol exista y se cargue correctamente.',
            });
            return;
        }

        const requiredFields = ['first_name', 'last_name', 'email', 'username', 'dni'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                Swal.fire({
                    icon: 'error',
                    title: 'Campos requeridos',
                    text: 'Por favor, completa todos los campos obligatorios (*).',
                });
                return;
            }
        }

        if (!formData.city_id) {
            Swal.fire({
                icon: 'error',
                title: 'Ciudad no válida',
                text: 'Por favor, selecciona una ciudad de las sugerencias para el campo "Ciudad *".',
            });
            return;
        }

        if (isNewVendor && !formData.password) {
            Swal.fire({
                icon: 'error',
                title: 'Contraseña requerida',
                text: 'Para nuevos vendedores, la contraseña es obligatoria.',
            });
            return;
        }

        const dataToSubmit = { ...formData };

        dataToSubmit.role_id = vendorRoleId;

        if (!isNewVendor && !dataToSubmit.password) {
            delete dataToSubmit.password;
        }

        delete dataToSubmit.city_name_input;

        onSubmit(dataToSubmit);
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-20" onClose={onClose}>
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
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-visible rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                                >
                                    {isNewVendor ? 'Añadir Nuevo Vendedor' : 'Editar Vendedor'}
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-white text-sm font-medium text-gray-400 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={onClose}
                                    >
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </Dialog.Title>
                                <div className="mt-4">
                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Nombres *</label>
                                            <input type="text" name="first_name" id="first_name" value={formData.first_name} onChange={handleChange} autoComplete='off' required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueo-500 focus:ring-blueo-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700">Segundo Nombre</label>
                                            <input type="text" name="middle_name" id="middle_name" value={formData.middle_name} onChange={handleChange} autoComplete='off' className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueo-500 focus:ring-blueo-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Apellido Paterno *</label>
                                            <input type="text" name="last_name" id="last_name" value={formData.last_name} onChange={handleChange} autoComplete='off' required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueo-500 focus:ring-blueo-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="second_last_name" className="block text-sm font-medium text-gray-700">Apellido Materno</label>
                                            <input type="text" name="second_last_name" id="second_last_name" value={formData.second_last_name} onChange={handleChange} autoComplete='off' className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueo-500 focus:ring-blueo-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
                                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} autoComplete='off' required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueo-500 focus:ring-blueo-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username *</label>
                                            <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueo-500 focus:ring-blueo-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="dni" className="block text-sm font-medium text-gray-700">DNI *</label>
                                            <input type="text" name="dni" id="dni" value={formData.dni} onChange={handleChange} autoComplete='off' required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueo-500 focus:ring-blueo-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="prefix" className="block text-sm font-medium text-gray-700">Prefijo Teléfono</label>
                                            <input type="text" name="prefix" id="prefix" value={formData.prefix} onChange={handleChange} autoComplete='off' className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueo-500 focus:ring-blueo-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                                            <input type="text" name="phone" id="phone" value={formData.phone} onChange={handleChange} autoComplete='off' className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueo-500 focus:ring-blueo-500 sm:text-sm" />
                                        </div>

                                        <div className="col-span-3">
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
                                            <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} autoComplete='off' className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueo-500 focus:ring-blueo-500 sm:text-sm" />
                                        </div>

                                        <div className="relative" ref={cityInputRef}>
                                            <label htmlFor="city_name_input" className="block text-sm font-medium text-gray-700">Ciudad *</label>
                                            <input
                                                type="text"
                                                name="city_name_input"
                                                id="city_name_input"
                                                value={formData.city_name_input}
                                                onChange={handleCityInputChange}
                                                onFocus={() => {
                                                    if (formData.city_name_input.length >= 2 && citySuggestions.length > 0) {
                                                        setShowSuggestions(true);
                                                    }
                                                }}
                                                autoComplete='off'
                                                placeholder="Busca y selecciona una ciudad"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueo-500 focus:ring-blueo-500 sm:text-sm"
                                            />
                                            {showSuggestions && citySuggestions.length > 0 && (
                                                <ul className="absolute z-30 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                    {citySuggestions.map((city) => (
                                                        <li
                                                            key={city.city_id}
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => handleCitySelect(city)}
                                                        >
                                                            {city.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="role_name_display" className="block text-sm font-medium text-gray-700">Rol *</label>
                                            <input
                                                type="text"
                                                id="role_name_display"
                                                value="Vendedor"
                                                disabled
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm cursor-not-allowed"
                                                title="Este campo está predefinido como 'Vendedor' para este formulario."
                                            />
                                            <input type="hidden" name="role_id" value={formData.role_id} />
                                        </div>

                                        {isNewVendor && (
                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña *</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required={isNewVendor}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueo-500 focus:ring-blueo-500 sm:text-sm"
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado *</label>
                                            <select
                                                name="state"
                                                id="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueo-500 focus:ring-blueo-500 sm:text-sm"
                                            >
                                                <option value="Active">Activo</option>
                                                <option value="Inactive">Inactivo</option>
                                            </select>
                                        </div>

                                        <div className="mt-6 col-span-full flex justify-end gap-3">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                                onClick={onClose}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                            >
                                                {isNewVendor ? 'Crear Vendedor' : 'Guardar Cambios'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div >
            </Dialog >
        </Transition >
    );
};

export default VendorFormModal;