// src/pages/payments/components/Step1Customer.jsx
import React, { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';

const Step1Customer = ({ onNext, initialData = {}, customers }) => {
    const initialCustomer = initialData.customer || null;

    const [customerData, setCustomerData] = useState({
        dni: initialCustomer?.dni || '',
        first_name: initialCustomer?.first_name || '',
        middle_name: initialCustomer?.middle_name || '',
        last_name: initialCustomer?.last_name || '',
        second_last_name: initialCustomer?.second_last_name || '',
        email: initialCustomer?.email || '',
        username: initialCustomer?.username || '',
        prefix: initialCustomer?.prefix || '+57',
        phone: initialCustomer?.phone || '',
        city: initialCustomer?.city || null,
        address: initialCustomer?.address || '',
        user_id: initialCustomer?.user_id || null // Aseguramos que user_id esté en el estado
    });

    // No necesitamos `errors` ni `setErrors` si los campos no son editables.
    // const [errors, setErrors] = useState({}); 

    const customerOptions = useMemo(() => customers.map(customer => ({
        value: customer.user_id,
        label: `${customer.first_name || ''} ${customer.last_name || ''} (DNI: ${customer.dni || 'N/A'})`,
        customerData: customer
    })), [customers]);

    useEffect(() => {
        if (initialCustomer && initialCustomer.user_id) {
            const preSelectedCustomerOption = customerOptions.find(
                option => option.value === initialCustomer.user_id
            );

            if (preSelectedCustomerOption) {
                setCustomerData(prev => ({
                    ...prev,
                    ...preSelectedCustomerOption.customerData,
                    city: preSelectedCustomerOption.customerData.city || null
                }));
            } else {
                setCustomerData(prev => ({
                    ...prev,
                    ...initialCustomer,
                    city: initialCustomer.city || null
                }));
            }
        }
    }, [initialCustomer, customerOptions]);

    const handleSelectCustomerChange = (selectedOption) => {
        if (selectedOption) {
            setCustomerData(prev => ({
                ...prev,
                ...selectedOption.customerData,
                city: selectedOption.customerData.city || null,
                user_id: selectedOption.customerData.user_id // Aseguramos que user_id se guarde
            }));
        } else {
            setCustomerData({
                dni: '', first_name: '', middle_name: '', last_name: '', second_last_name: '',
                email: '', username: '', prefix: '+57', phone: '', city: null, address: '', user_id: null
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Solo permite avanzar si se ha seleccionado un cliente (es decir, customerData.user_id existe)
        if (customerData.user_id) {
            const customerDataToSend = {
                ...customerData,
                city_id: customerData.city?.city_id || null
            };
            delete customerDataToSend.city; // Elimina el objeto city si tu backend no lo espera directamente

            onNext({ customer: customerDataToSend });
        } else {
            toast.error('Por favor, selecciona un cliente para continuar.');
        }
    };

    const InfoField = ({ label, value }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <p className="mt-1 block w-full text-gray-900 bg-gray-50 border border-gray-200 rounded-md shadow-sm p-2">
                {value || 'N/A'}
            </p>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Paso 1: Información Personal del Cliente</h2>

            {/* Selector de cliente existente */}
            <div className="mb-6">
                <label htmlFor="select-customer" className="block text-sm font-medium text-gray-700">
                    Seleccionar Cliente Existente <span className="text-red-500">*</span>
                </label>
                <Select
                    id="select-customer"
                    name="select-customer"
                    options={customerOptions}
                    value={customerOptions.find(option => option.value === customerData.user_id) || null}
                    onChange={handleSelectCustomerChange}
                    placeholder="Buscar y seleccionar un cliente..."
                    isClearable
                    classNamePrefix="react-select"
                    className="mt-1 block w-full"
                />
            </div>

            {customerData.user_id && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Detalles del Cliente Seleccionado</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* DNI */}
                        <InfoField label="DNI" value={customerData.dni} />

                        {/* Nombre Completo */}
                        <InfoField
                            label="Nombre Completo"
                            value={`${customerData.first_name || ''} ${customerData.middle_name || ''} ${customerData.last_name || ''} ${customerData.second_last_name || ''}`.trim()}
                        />

                        {/* Email */}
                        <InfoField label="Email" value={customerData.email} />

                        {/* Nombre de Usuario */}
                        <InfoField label="Nombre de Usuario" value={customerData.username} />

                        {/* Teléfono */}
                        <InfoField label="Teléfono" value={`${customerData.prefix || ''} ${customerData.phone || ''}`.trim()} />

                        {/* Ciudad */}
                        <InfoField label="Ciudad" value={customerData.city?.name} />

                        {/* Dirección */}
                        <InfoField label="Dirección" value={customerData.address} />
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
                <button
                    type="submit"
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${customerData.user_id ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={!customerData.user_id}
                >
                    Siguiente
                </button>
            </div>
        </form>
    );
};

export default Step1Customer;