// src/pages/payments/components/Step1Customer.jsx
import React, { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';

// Simulación de datos de ciudades (reemplazar con tu API real si existe)
const cities = [
    { value: 'Pitalito', label: 'Pitalito' },
    { value: 'Neiva', label: 'Neiva' },
    { value: 'Bogota', label: 'Bogotá' },
    { value: 'Medellin', label: 'Medellín' },
    { value: 'Cali', label: 'Cali' },
];

const Step1Customer = ({ onNext, initialData = {}, customers }) => {
    // Desestructurar initialData para usar valores existentes o nulos de forma segura
    const initialCustomer = initialData.customer || null;

    const [customerData, setCustomerData] = useState({
        // Usar los valores de initialData.customer o los valores por defecto
        dni: initialCustomer?.dni || '',
        first_name: initialCustomer?.first_name || '',
        middle_name: initialCustomer?.middle_name || '',
        last_name: initialCustomer?.last_name || '',
        second_last_name: initialCustomer?.second_last_name || '',
        email: initialCustomer?.email || '',
        username: initialCustomer?.username || '',
        prefix: initialCustomer?.prefix || '+57',
        phone: initialCustomer?.phone || '',
        // Asumiendo que initialCustomer.city_id es el ID o valor de la ciudad
        city_id: initialCustomer?.city_id ? cities.find(c => c.value === initialCustomer.city_id) : null,
        address: initialCustomer?.address || ''
    });

    const [errors, setErrors] = useState({});
    const [isNewCustomer, setIsNewCustomer] = useState(!initialCustomer?.user_id); // Asume nuevo si no hay user_id

    const customerOptions = useMemo(() => customers.map(customer => ({
        value: customer.user_id,
        label: `${customer.first_name || ''} ${customer.last_name || ''} (DNI: ${customer.dni || 'N/A'})`,
        customerData: customer
    })), [customers]);

    useEffect(() => {
        // Mejorado para manejar la preselección solo si initialCustomer existe y es diferente
        // del valor actual en customerData.dni para evitar bucles.
        if (initialCustomer && customerOptions.length > 0 && customerData.dni !== initialCustomer.dni) {
            const preSelectedCustomer = customerOptions.find(option => option.value === initialCustomer.user_id);
            if (preSelectedCustomer) {
                setCustomerData(prev => ({ ...prev, ...preSelectedCustomer.customerData, city_id: cities.find(c => c.value === preSelectedCustomer.customerData.city_id) }));
                setIsNewCustomer(false); // Si precargamos un cliente existente, no es nuevo
            }
        }
    }, [initialCustomer, customerOptions]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSelectCustomerChange = (selectedOption) => {
        if (selectedOption) {
            setCustomerData(prev => ({
                ...prev,
                ...selectedOption.customerData, // Rellena con los datos del cliente seleccionado
                city_id: cities.find(c => c.value === selectedOption.customerData.city_id) // Precarga la ciudad
            }));
            setIsNewCustomer(false);
        } else {
            // Si deselecciona, reinicia a un nuevo cliente
            setCustomerData({
                dni: '', first_name: '', middle_name: '', last_name: '', second_last_name: '',
                email: '', username: '', prefix: '+57', phone: '', city_id: null, address: ''
            });
            setIsNewCustomer(true);
        }
        if (errors.customer) {
            setErrors(prev => ({ ...prev, customer: null }));
        }
    };

    const handleCityChange = (selectedOption) => {
        setCustomerData(prev => ({ ...prev, city_id: selectedOption }));
        if (errors.city_id) {
            setErrors(prev => ({ ...prev, city_id: null }));
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!customerData.dni) newErrors.dni = 'El DNI es obligatorio.';
        if (!customerData.first_name) newErrors.first_name = 'El Primer Nombre es obligatorio.';
        if (!customerData.last_name) newErrors.last_name = 'El Primer Apellido es obligatorio.';
        if (!customerData.email) newErrors.email = 'El Email es obligatorio.';
        if (!customerData.username) newErrors.username = 'El Nombre de Usuario es obligatorio.';
        if (!customerData.phone) newErrors.phone = 'El Número de Teléfono es obligatorio.';
        if (!customerData.city_id) newErrors.city_id = 'La Ciudad es obligatoria.';
        if (!customerData.address) newErrors.address = 'La Dirección es obligatoria.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Asegúrate de enviar solo el valor de la ciudad, no el objeto Select completo
            const customerDataToSend = {
                ...customerData,
                city_id: customerData.city_id?.value || null // Solo el valor de la ciudad
            };
            onNext({ customer: customerDataToSend }); // Envía SOLO los datos del cliente
        } else {
            toast.error('Por favor, corrige los errores en el formulario.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Paso 1: Información Personal del Cliente</h2>

            {/* Selector de cliente existente */}
            <div className="mb-6">
                <label htmlFor="select-customer" className="block text-sm font-medium text-gray-700">
                    Seleccionar Cliente Existente (Opcional)
                </label>
                <Select
                    id="select-customer"
                    name="select-customer"
                    options={customerOptions}
                    value={customerOptions.find(option => option.value === initialCustomer?.user_id) || null}
                    onChange={handleSelectCustomerChange}
                    placeholder="Buscar y seleccionar un cliente..."
                    isClearable
                    classNamePrefix="react-select"
                    className="mt-1 block w-full"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* DNI */}
                <div>
                    <label htmlFor="dni" className="block text-sm font-medium text-gray-700">DNI <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="dni"
                        name="dni"
                        value={customerData.dni}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full border ${errors.dni ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                    />
                    {errors.dni && <p className="mt-2 text-sm text-red-600">{errors.dni}</p>}
                </div>

                {/* Primer Nombre */}
                <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Primer Nombre <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={customerData.first_name}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                    />
                    {errors.first_name && <p className="mt-2 text-sm text-red-600">{errors.first_name}</p>}
                </div>

                {/* Segundo Nombre (Opcional) */}
                <div>
                    <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700">Segundo Nombre (Opcional)</label>
                    <input
                        type="text"
                        id="middle_name"
                        name="middle_name"
                        value={customerData.middle_name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                {/* Primer Apellido */}
                <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Primer Apellido <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={customerData.last_name}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                    />
                    {errors.last_name && <p className="mt-2 text-sm text-red-600">{errors.last_name}</p>}
                </div>

                {/* Segundo Apellido (Opcional) */}
                <div>
                    <label htmlFor="second_last_name" className="block text-sm font-medium text-gray-700">Segundo Apellido (Opcional)</label>
                    <input
                        type="text"
                        id="second_last_name"
                        name="second_last_name"
                        value={customerData.second_last_name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={customerData.email}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                    />
                    {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Nombre de Usuario */}
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nombre de Usuario <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={customerData.username}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                    />
                    {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username}</p>}
                </div>

                {/* Prefijo Teléfono y Número de Teléfono */}
                <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="prefix" className="block text-sm font-medium text-gray-700">Prefijo Teléfono <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="prefix"
                            name="prefix"
                            value={customerData.prefix}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="+57"
                        />
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Número de Teléfono <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={customerData.phone}
                            onChange={handleChange}
                            required
                            className={`mt-1 block w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                        />
                        {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                </div>

                {/* Ciudad */}
                <div>
                    <label htmlFor="city_id" className="block text-sm font-medium text-gray-700">Ciudad <span className="text-red-500">*</span></label>
                    <Select
                        id="city_id"
                        name="city_id"
                        options={cities}
                        value={customerData.city_id}
                        onChange={handleCityChange}
                        placeholder="Buscar y selecciona una ciudad"
                        isClearable
                        classNamePrefix="react-select"
                        className={`mt-1 block w-full ${errors.city_id ? 'border-red-500' : ''}`}
                    />
                    {errors.city_id && <p className="mt-2 text-sm text-red-600">{errors.city_id}</p>}
                </div>

                {/* Dirección */}
                <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={customerData.address}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                    />
                    {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address}</p>}
                </div>
            </div>

            <p className="mt-4 text-sm text-gray-500">* La contraseña por defecto del cliente será su DNI.</p>

            <div className="flex justify-end gap-3 mt-6">
                {/* No hay botón "Anterior" en el primer paso */}
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

export default Step1Customer;