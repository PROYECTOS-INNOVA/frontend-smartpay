import React, { useState, useEffect, Fragment, useRef, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';
import { handleChangeHelper } from '../../../common/utils/helpers';
import { DniInput } from '../../../common/forms/inputs/dniInput';

const UserFormModal = ({ isOpen, onClose, initialData, onSubmit, roles, getCountriesApi, getRegionsApi, getCitiesApi }) => {
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
        country_id: '',
        region_id: '',
        city_name_input: '',
        role_id: '',
        state: 'Initial',
        password: '',
    });
    const [isNewUser, setIsNewUser] = useState(false);
    const [countrySuggestions, setCountrySuggestions] = useState([]);
    const [regionSuggestions, setRegionSuggestions] = useState([]);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [showSuggestionsCountry, setShowSuggestionsCountry] = useState(false);
    const [showSuggestionsRegion, setShowSuggestionsRegion] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const cityInputRef = useRef(null);
    const [countryId, setCountryId] = useState(null);
    const [regionId, setRegionId] = useState(null);


    useEffect(() => {
        if (initialData) {
            setIsNewUser(false);
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
                country_id_id: initialData?.city?.region?.country?.country_id || '',
                region_id: initialData.city?.region?.region_id || '',
                city_name_input: initialData.city?.name || '',
                country_name_input: initialData.city.region.country?.name || '',
                region_name_input: initialData.city.region?.name || '',
                city_name_input: initialData.city?.name || '',
                role_id: initialData.role?.role_id || '',
                state: initialData.state || 'Active',
                password: '', // No pre-llenar contraseñas
            });
        } else {
            setIsNewUser(true);
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
                role_id: '',
                state: 'Initial',
                password: '',
                country_name_input: '',
                region_name_input: '',
            });
        }
        setCountrySuggestions([]);
        setRegionSuggestions([]);
        setCitySuggestions([]);
        setShowSuggestionsCountry(false);
        setShowSuggestionsRegion(false);
        setShowSuggestions(false);
    }, [initialData, isOpen]);

    // Debounced function to fetch PAIS
    const debouncedFetchCountries = useCallback(
        debounce(async (searchTerm) => {
            if (searchTerm.length >= 0) {
                try {
                    const fetchedCities = await getCountriesApi({ name: searchTerm });
                    console.log("Fetched countries:", fetchedCities); // Añadido para depuración

                    // Filtrar ciudades por nombre único
                    const uniqueCities = Array.from(new Map(fetchedCities.map(city => [city.name, city])).values());
                    setCountrySuggestions(uniqueCities);
                    setShowSuggestionsCountry(true);
                } catch (error) {
                    console.error("Error fetching cities:", error); // Añadido para depuración
                    setCountrySuggestions([]);
                    setShowSuggestionsCountry(false);
                }
            } else {
                setCountrySuggestions([]);
                setShowSuggestionsCountry(false);
            }
        }, 300),
        [getCountriesApi]
    );

    // Debounced function to fetch Region
    const debouncedFetchRegions = useCallback(
        debounce(async (searchTerm, selectedCountryId) => {
            if (searchTerm.length >= 0) {
                try {
                    const fetchedCities = await getRegionsApi({ name: searchTerm, country_id: selectedCountryId });
                    // Filtrar ciudades por nombre único
                    const uniqueCities = Array.from(new Map(fetchedCities.map(city => [city.name, city])).values());
                    setRegionSuggestions(uniqueCities);
                    setShowSuggestionsRegion(true);
                } catch (error) {
                    console.error("Error fetching cities:", error); // Añadido para depuración
                    setRegionSuggestions([]);
                    setShowSuggestionsRegion(false);
                }
            } else {
                setRegionSuggestions([]);
                setShowSuggestionsRegion(false);
            }
        }, 300),
        [getRegionsApi]
    );
    // Debounced function to fetch cities
    const debouncedFetchCities = useCallback(
        debounce(async (searchTerm, selectedRegionId) => {
            if (searchTerm.length >= 0) {
                try {
                    const fetchedCities = await getCitiesApi({ name: searchTerm, region_id: selectedRegionId });
                    // Filtrar ciudades por nombre único
                    const uniqueCities = Array.from(new Map(fetchedCities.map(city => [city.name, city])).values());
                    setCitySuggestions(uniqueCities);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Error fetching cities:", error); // Añadido para depuración
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

    /**
     * handle para PAIS
     * @param {*} e 
     */
    const handleCountryInputChange = (e) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            country_name_input: value,
            country_id: '',
        }));
        debouncedFetchCountries(value);
    };

    /**
     * Handles para Region
     * @param {*} e 
     */
    const handleRegionInputChange = (e) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            region_name_input: value,
            region_id: '',
        }));
        debouncedFetchRegions(value, formData.country_id);
    };

    /**
     * Handle City
     * @param {*} e 
     */
    const handleCityInputChange = (e) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            city_name_input: value,
            city_id: '', // Reset city_id when user types
        }));
        debouncedFetchCities(value, formData.region_id);
    };
    /**
     * Selector para sleccionar pais
     * @param {*} city 
     */
    const handleCountrySelect = async (item) => {
        console.log(item);
        setFormData((prev) => ({
            ...prev,
            country_id: item.country_id,
            country_name_input: item.name,
        }));

        const data = await getRegionsApi({ country_id: item.country_id })
        setRegionSuggestions(data);
        setShowSuggestionsRegion(true);

        setCountrySuggestions([]);
        setShowSuggestionsCountry(false);
    };

    /**
     * Selector para selecciona region
     * @param {*} city 
     */
    const handleRegionSelect = async (item) => {
        setFormData((prev) => ({
            ...prev,
            region_id: item.region_id,
            region_name_input: item.name,
        }));

        const data = await getCitiesApi({ region_id: item.region_id })
        setCitySuggestions(data);
        setShowSuggestions(true);

        setRegionSuggestions([]);
        setShowSuggestionsRegion(false);
    };

    /**
     * Selector para seleccionar ciudad
     * @param {*} city 
     */
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

    /**
     * Cargar los cambis de formulario por medio del hepler
     * @param {*} e 
     */
    const handleChange = (e) => {
        handleChangeHelper(e, formData, setFormData, isNewUser);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.first_name || !formData.last_name || !formData.email || !formData.username || !formData.dni || !formData.city_id || !formData.role_id) {
            Swal.fire({
                icon: 'error',
                title: 'Campos requeridos',
                text: 'Por favor, completa todos los campos obligatorios (*).',
            });
            return;
        }

        if (isNewUser && !formData.password) {
            Swal.fire({
                icon: 'error',
                title: 'Contraseña requerida',
                text: 'Para nuevos usuarios, la contraseña es obligatoria.',
            });
            return;
        }

        const dataToSubmit = { ...formData };

        if (!isNewUser && !dataToSubmit.password) {
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
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    {isNewUser ? 'Añadir Nuevo Usuario' : 'Editar Usuario'}
                                </Dialog.Title>
                                <div className="mt-4">
                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Nombres *</label>
                                            <input type="text" name="first_name" id="first_name" value={formData.first_name} onChange={handleChange} autoComplete='off' required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700">Segundo Nombre</label>
                                            <input type="text" name="middle_name" id="middle_name" value={formData.middle_name} onChange={handleChange} autoComplete='off' className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Apellido Paterno *</label>
                                            <input type="text" name="last_name" id="last_name" value={formData.last_name} onChange={handleChange} autoComplete='off' required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="second_last_name" className="block text-sm font-medium text-gray-700">Apellido Materno</label>
                                            <input type="text" name="second_last_name" id="second_last_name" value={formData.second_last_name} onChange={handleChange} autoComplete='off' className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
                                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} autoComplete='off' required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                                        </div>
                                        {/* <div> */}
                                        {/* <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username *</label> */}
                                        <input type="hidden" name="username" id="username" value={formData.dni} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                                        {/* </div> */}
                                        <div>
                                            <label htmlFor="dni" className="block text-sm font-medium text-gray-700">DNI *</label>
                                            <DniInput handleChange={handleChangeHelper} formData={formData} setFormData={setFormData} isNewCustomer={true} />
                                        </div>
                                        <div>
                                            <label htmlFor="prefix" className="block text-sm font-medium text-gray-700">Prefijo Teléfono * </label>
                                            <input type="text" name="prefix" id="prefix" value={formData.prefix} onChange={handleChange} autoComplete='off' className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono *</label>
                                            <input type="number" name="phone" id="phone" value={formData.phone} onChange={handleChange} autoComplete='off' className="no-spin mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                                        </div>

                                        <div className="col-span-3">
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
                                            <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} autoComplete='off' className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                                        </div>

                                        <div className="relative" ref={cityInputRef}>
                                            <label htmlFor="country_name_input" className="block text-sm font-medium text-gray-700">País *</label>
                                            <input
                                                type="text"
                                                name="country_name_input"
                                                id="country_name_input"
                                                value={formData.country_name_input}
                                                onChange={handleCountryInputChange}
                                                onFocus={() => {
                                                    if (formData.country_name_input.length >= 2) {
                                                        setShowSuggestionsCountry(true);
                                                    }
                                                }}
                                                autoComplete='off'
                                                placeholder="Busca y selecciona una ciudad"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                            {showSuggestionsCountry && countrySuggestions.length > 0 && (
                                                < ul className="absolute z-30 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                    {countrySuggestions.map((item) => (
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
                                            {!formData.country_id && formData.country_input_name && !showSuggestionsCountry && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    Por favor, selecciona un país de las sugerencias.
                                                </p>
                                            )}
                                        </div>
                                        <div className="relative" ref={cityInputRef}>
                                            <label htmlFor="region_name_input" className="block text-sm font-medium text-gray-700">Región *</label>
                                            <input
                                                type="text"
                                                name="region_name_input"
                                                id="region_name_input"
                                                value={formData.region_name_input}
                                                onChange={handleRegionInputChange}
                                                onFocus={() => {
                                                    if (formData.region_name_input.length >= 2) {
                                                        setShowSuggestionsRegion(true);
                                                    }
                                                }}
                                                autoComplete='off'
                                                placeholder="Busca y selecciona una ciudad"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                            {showSuggestionsRegion && regionSuggestions.length > 0 && (
                                                < ul className="absolute z-30 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                    {regionSuggestions.map((item) => (
                                                        <li
                                                            key={item.region_id}
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => handleRegionSelect(item)}
                                                        >
                                                            {item.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            {!formData.region_id && formData.region_name_input && !showSuggestionsRegion && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    Por favor, selecciona una region de las sugerencias.
                                                </p>
                                            )}
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
                                                    if (formData.city_name_input.length >= 2) {
                                                        setShowSuggestions(true);
                                                    }
                                                }}
                                                autoComplete='off'
                                                placeholder="Busca y selecciona una ciudad"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                            {showSuggestions && citySuggestions.length > 0 && (
                                                < ul className="absolute z-30 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
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
                                            {!formData.city_id && formData.city_name_input && !showSuggestions && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    Por favor, selecciona una ciudad de las sugerencias.
                                                </p>
                                            )}
                                        </div>


                                        <div>
                                            <label htmlFor="role_id" className="block text-sm font-medium text-gray-700">Rol *</label>
                                            <select
                                                name="role_id"
                                                id="role_id"
                                                value={formData.role_id}
                                                onChange={handleChange}
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            >
                                                <option value="">Selecciona un rol</option>
                                                {roles && roles.length > 0 ? (
                                                    roles.map((role) => (
                                                        <option key={role.role_id} value={role.role_id}>
                                                            {role.name}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option disabled>Cargando roles...</option>
                                                )}
                                            </select>
                                        </div>

                                        {/* {isNewUser && (
                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña *</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required={isNewUser}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                />
                                            </div>
                                        )} */}
                                        {!isNewUser && (
                                            <div>
                                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado *</label>
                                                <select
                                                    name="state"
                                                    id="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    required
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                >
                                                    <option value="Active">Activo</option>
                                                    <option value="Inactive">Inactivo</option>
                                                    <option value="Initial">Nuevo</option>
                                                </select>
                                            </div>
                                        )}

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
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            >
                                                {isNewUser ? 'Crear Usuario' : 'Guardar Cambios'}
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

export default UserFormModal;