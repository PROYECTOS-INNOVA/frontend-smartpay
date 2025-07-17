import React, { useState, useEffect, Fragment, useRef, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { buildField, validateFields } from '../../../common/utils/validations/validation.schema';

const StoreFormModal = ({ isOpen, onClose, initialData, onSubmit, roles, getCountriesApi }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        plan: '',
        country_id: '',
        tokens_disponibles: '',
        back_link: '',
        db_link: '',
        country_input_name: '',

    });
    const [isNewRegister, setIsNewRegister] = useState(false);
    const [countrySuggestion, setCountrySuggestion] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const cityInputRef = useRef(null);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        setFormErrors({});
        if (isOpen) {
            if (initialData) {
                // Modo edición
                setIsNewRegister(false);
                setFormData({
                    nombre: initialData.nombre || '',
                    plan: initialData.plan || '',
                    country_id: initialData.country_id || '',
                    tokens_disponibles: initialData.tokens_disponibles || 0,
                    back_link: initialData.back_link || '',
                    db_link: initialData.db_link || '',
                    country_input_name: initialData.country.name || '',
                });
            } else {
                // Modo creación de nuevo vendedor
                setIsNewRegister(true);
                setFormData({
                    nombre: '',
                    plan: '',
                    country_id: '',
                    tokens_disponibles: 0,
                    back_link: '',
                    db_link: '',
                    country_input_name: '',
                });
            }
            setCountrySuggestion([]);
            setShowSuggestions(false);
        }
    }, [initialData, isOpen]);

    const debouncedFetchCountries = useCallback(
        debounce(async (searchTerm) => {
            if (searchTerm.length >= 2) {
                try {
                    const fetchedCities = await getCountriesApi({ name: searchTerm });
                    const uniqueCities = Array.from(new Map(fetchedCities.map(city => [city.name, city])).values());
                    setCountrySuggestion(uniqueCities);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Error fetching countries:", error);
                    setCountrySuggestion([]);
                    setShowSuggestions(false);
                }
            } else {
                setCountrySuggestion([]);
                setShowSuggestions(false);
            }
        }, 300),
        [getCountriesApi]
    );

    const handleCityInputChange = (e) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            country_input_name: value,
            country_id: '',
        }));
        debouncedFetchCountries(value);
    };

    const handleCountrySelect = (item) => {
        setFormData((prev) => ({
            ...prev,
            country_id: item.country_id,
            country_input_name: item.name,
        }));
        setCountrySuggestion([]);
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

        // Limpia el error del campo actual
        if (formErrors[name]) {
            setFormErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationRules = {
            nombre: buildField(['required']),
            tokens_disponibles: buildField(['required', 'number', { min: 13 }]),
            country_id: buildField(['required']),
            back_link: buildField(['required']),
            db_link: buildField(['required'])
        };
        const { valid, errors } = await validateFields(formData, validationRules);
        
        if (!valid) {
            setFormErrors(errors);
            return;
        }

        const dataToSubmit = { ...formData };

        delete dataToSubmit.country_input_name;

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
                                    {isNewRegister ? 'Añadir Nueva Tienda' : 'Editar Tienda'}
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
                                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre *</label>
                                            <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} autoComplete='off' className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueo-500 focus:ring-blueo-500 sm:text-sm" />
                                            {formErrors.nombre && (
                                                <p className="text-red-500 text-xs mt-1">{formErrors.nombre}</p>
                                            )}
                                        </div>
                                        <div className="relative" ref={cityInputRef}>
                                            <label htmlFor="country_input_name" className="block text-sm font-medium text-gray-700">País *</label>
                                            <input
                                                type="text"
                                                name="country_input_name"
                                                id="country_input_name"
                                                value={formData.country_input_name}
                                                onChange={handleCityInputChange}
                                                onFocus={() => {
                                                    if (formData.country_input_name.length >= 2 && countrySuggestion.length > 0) {
                                                        setShowSuggestions(true);
                                                    }
                                                }}
                                                autoComplete='off'
                                                placeholder="Busca y selecciona un país"

                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueo-500 focus:ring-blueo-500 sm:text-sm"
                                            />
                                            {showSuggestions && countrySuggestion.length > 0 && (
                                                <ul className="absolute z-30 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                    {countrySuggestion.map((item) => (
                                                        <li
                                                            key={item.country_id}
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => handleCountrySelect(item)}
                                                        >
                                                            {item.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            {formErrors.country_id && (
                                                <p className="text-red-500 text-xs mt-1">{formErrors.country_id}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="tokens_disponibles" className="block text-sm font-medium text-gray-700">Limite Dispositivos *</label>
                                            <input type="number" name="tokens_disponibles" id="tokens_disponibles" value={formData.tokens_disponibles} onChange={handleChange} autoComplete='off' className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueo-500 focus:ring-blueo-500 sm:text-sm" />
                                            {formErrors.tokens_disponibles && (
                                                <p className="text-red-500 text-xs mt-1">{formErrors.tokens_disponibles}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="back_link" className="block text-sm font-medium text-gray-700">Enlace Back *</label>
                                            <input type="text" name="back_link" id="back_link" value={formData.back_link} onChange={handleChange} autoComplete='off' className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueo-500 focus:ring-blueo-500 sm:text-sm" />
                                            {formErrors.back_link && (
                                                <p className="text-red-500 text-xs mt-1">{formErrors.back_link}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="db_link" className="block text-sm font-medium text-gray-700">Enlace Base de Datos *</label>
                                            <input type="text" name="db_link" id="db_link" value={formData.db_link} onChange={handleChange} autoComplete='off' className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueo-500 focus:ring-blueo-500 sm:text-sm" />
                                            {formErrors.db_link && (
                                                <p className="text-red-500 text-xs mt-1">{formErrors.db_link}</p>
                                            )}
                                        </div>

                                        {/* <div>
                                            <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado *</label>
                                            <select
                                                name="state"
                                                id="state"
                                                value={formData.state}
                                                onChange={handleChange}

                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueo-500 focus:ring-blueo-500 sm:text-sm"
                                            >
                                                <option value="Active">Activo</option>
                                                <option value="Inactive">Inactivo</option>
                                            </select>
                                        </div> */}

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
                                                {isNewRegister ? 'Crear Tienda' : 'Guardar Cambios'}
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

export default StoreFormModal;