import React, { useState, useEffect, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { getCities as getCitiesApi } from '../../../api/cities'; 

const Step1_CustomerInfo = ({ onNext, initialData }) => {
    const [formData, setFormData] = useState({
        dni: '',
        first_name: '',
        second_name: '',
        last_name: '',
        second_last_name: '',
        email: '',
        username: '',
        password: '',
        phone_prefix: '',
        phone: '',
        address: '',
        city_id: '',
        city_name_input: '',
        state: 'Active',
    });
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [errors, setErrors] = useState({});

    const cityInputRef = useRef(null);


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
        []
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cityInputRef.current && !cityInputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData(prevData => ({
                ...prevData,
                dni: initialData.dni || '',
                first_name: initialData.first_name || '',
                second_name: initialData.second_name || '',
                last_name: initialData.last_name || '',
                second_last_name: initialData.second_last_name || '',
                email: initialData.email || '',
                username: initialData.username || '',
                password: initialData.password || '', 
                phone_prefix: initialData.phone_prefix || '',
                phone: initialData.phone || '',
                address: initialData.address || '',
                city_id: initialData.city_id || '',
                city_name_input: initialData.city_name_input || '',
                state: initialData.state || 'Active',
            }));
        }
    }, [initialData]);


    // Manejador para el input de texto de la ciudad
    const handleCityInputChange = (e) => {
        const { value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            city_name_input: value,
            city_id: '', 
        }));
        setErrors(prevErrors => ({ ...prevErrors, city_id: '' })); 

        debouncedFetchCities(value);
    };

    const handleCitySelect = (city) => {
        setFormData(prevData => ({
            ...prevData,
            city_id: city.city_id,
            city_name_input: city.name,
        }));
        setCitySuggestions([]);
        setShowSuggestions(false);
        setErrors(prevErrors => ({ ...prevErrors, city_id: '' })); 
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => {
            const newState = {
                ...prevData,
                [name]: value
            };
            if (name === 'dni') {
                newState.password = value;
            }
            return newState;
        });
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.dni.trim()) newErrors.dni = 'El DNI es obligatorio.';
        if (!formData.first_name.trim()) newErrors.first_name = 'El primer nombre es obligatorio.';
        if (!formData.last_name.trim()) newErrors.last_name = 'El primer apellido es obligatorio.';

        // Validación de email
        if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El email no es válido.';
        }

        if (!formData.username.trim()) newErrors.username = 'El nombre de usuario es obligatorio.';

        if (!formData.phone_prefix.trim()) {
            newErrors.phone_prefix = 'El prefijo de teléfono es obligatorio.';
        } else if (!/^\+?[0-9]+$/.test(formData.phone_prefix)) {
            newErrors.phone_prefix = 'Formato de prefijo no válido (solo números y opcionalmente +).';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'El número de teléfono es obligatorio.';
        } else if (!/^[0-9]+$/.test(formData.phone)) {
            newErrors.phone = 'El teléfono solo debe contener números.';
        }

        if (!formData.city_id) {
            newErrors.city_id = 'Por favor, selecciona una ciudad de las sugerencias.';
        }

        if (!formData.address.trim()) newErrors.address = 'La dirección es obligatoria.';

        if (!formData.password.trim()) newErrors.password = 'La contraseña es obligatoria (se genera automáticamente con el DNI).';


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const { city_name_input, ...customerDataToSend } = formData;
            onNext({ customerInfo: customerDataToSend });
        } else {
            const firstErrorField = Object.keys(errors)[0];
            if (firstErrorField) {

                document.getElementById(firstErrorField)?.focus();
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Paso 1: Información Personal del Cliente</h2>
                <p className="text-sm text-gray-600 mb-6">Por favor, ingresa los datos personales del nuevo cliente.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* DNI */}
                <div>
                    <label htmlFor="dni" className="block text-sm font-medium text-gray-700">DNI <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="dni"
                        id="dni"
                        value={formData.dni}
                        onChange={handleChange}
                        autoComplete='off'
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.dni && <p className="mt-1 text-sm text-red-600">{errors.dni}</p>}
                </div>

                {/* Primer Nombre */}
                <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Primer Nombre <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        autoComplete='off'
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
                </div>

                {/* Segundo Nombre */}
                <div>
                    <label htmlFor="second_name" className="block text-sm font-medium text-gray-700">Segundo Nombre (Opcional)</label>
                    <input
                        type="text"
                        name="second_name"
                        id="second_name"
                        value={formData.second_name}
                        onChange={handleChange}
                        autoComplete='off'
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                {/* Primer Apellido */}
                <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Primer Apellido <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        autoComplete='off'
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
                </div>

                {/* Segundo Apellido */}
                <div>
                    <label htmlFor="second_last_name" className="block text-sm font-medium text-gray-700">Segundo Apellido (Opcional)</label>
                    <input
                        type="text"
                        name="second_last_name"
                        id="second_last_name"
                        value={formData.second_last_name}
                        onChange={handleChange}
                        autoComplete='off'
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete='off'
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Username */}
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nombre de Usuario <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        autoComplete='off'
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2 lg:col-span-1">
                    <div> {/* Prefijo */}
                        <label htmlFor="phone_prefix" className="block text-sm font-medium text-gray-700">Prefijo Teléfono <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="phone_prefix"
                            id="phone_prefix"
                            value={formData.phone_prefix}
                            onChange={handleChange}
                            autoComplete='off'
                            placeholder="+57"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.phone_prefix && <p className="mt-1 text-sm text-red-600">{errors.phone_prefix}</p>}
                    </div>
                    <div> {/* Número de Teléfono */}
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Número de Teléfono <span className="text-red-500">*</span></label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            autoComplete='off'
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                </div>

                <div>
                    <label htmlFor="city_name_input" className="block text-sm font-medium text-gray-700">Ciudad <span className="text-red-500">*</span></label>
                    <div className="relative" ref={cityInputRef}>
                        <input
                            type="text"
                            name="city_name_input"
                            id="city_name_input"
                            value={formData.city_name_input}
                            onChange={handleCityInputChange}
                            onFocus={() => {
                                if (formData.city_name_input.length >= 2) {
                                    setShowSuggestions(true);
                                    debouncedFetchCities(formData.city_name_input);
                                } else if (formData.city_id && formData.city_name_input) {
                                    setShowSuggestions(true);
                                }
                            }}
                            autoComplete='off'
                            placeholder="Busca y selecciona una ciudad"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                        {errors.city_id && <p className="mt-1 text-sm text-red-600">{errors.city_id}</p>}
                        {!formData.city_id && formData.city_name_input && !showSuggestions && errors.city_id === '' && (
                            <p className="mt-1 text-xs text-blue-500">
                                Escribe al menos 2 letras para buscar ciudades. Selecciona una de las sugerencias.
                            </p>
                        )}
                    </div>
                </div>

                {/* Dirección */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="address"
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        autoComplete='off'
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600 col-span-full">{errors.password}</p>}
                <p className="mt-1 text-sm text-gray-500 col-span-full">
                    * La contraseña por defecto del cliente será su DNI.
                </p>
            </div>

            <div className="flex justify-end mt-8">
                <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Siguiente
                </button>
            </div>
        </form>
    );
};

export default Step1_CustomerInfo;