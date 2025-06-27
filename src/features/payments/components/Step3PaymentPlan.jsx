// src/pages/payments/components/Step3PaymentPlan.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const Step3PaymentPlan = ({ onNext, onBack, initialData }) => {
    // Estado local para los campos del formulario
    const [paymentPlan, setPaymentPlan] = useState(initialData.paymentPlan || {
        quotas: '',
        frecuencia_dias: '', // Ej: 30, 60, etc.
        initial_date: '' // Fecha de inicio del plan
    });
    const [initialPayment, setInitialPayment] = useState(initialData.initialPayment || {
        value: '',
        method: '', // Ej: 'Efectivo', 'Tarjeta', 'Transferencia'
        date: new Date().toISOString().split('T')[0] // Fecha actual por defecto
    });
    // NUEVO ESTADO para el valor del dispositivo en Step3
    const [devicePrice, setDevicePrice] = useState(initialData.device?.price_usd || '');
    const [errors, setErrors] = useState({});

    // Cargar el precio del dispositivo si viene de initialData (por ejemplo, al regresar de un paso posterior)
    useEffect(() => {
        if (initialData.device?.price_usd) {
            setDevicePrice(initialData.device.price_usd);
        }
    }, [initialData.device?.price_usd]);


    // Calcular el saldo a financiar
    const balanceToFinance = Number(devicePrice) - (Number(initialPayment.value) || 0);

    // Calcular el monto por cuota
    const montoPorCuota = useMemo(() => {
        if (Number(paymentPlan.quotas) > 0 && balanceToFinance >= 0) {
            return balanceToFinance / Number(paymentPlan.quotas);
        }
        return 0;
    }, [balanceToFinance, paymentPlan.quotas]);

    // Generar la tabla de quotas
    const generatedInstallments = useMemo(() => {
        const installments = [];
        const numCuotas = Number(paymentPlan.quotas);
        const freqDays = Number(paymentPlan.frecuencia_dias);
        const startDate = paymentPlan.initial_date;

        if (numCuotas > 0 && freqDays > 0 && startDate && montoPorCuota > 0) {
            let currentDate = new Date(startDate);
            for (let i = 0; i < numCuotas; i++) {
                const dueDate = new Date(currentDate);
                // Si es la primera cuota, la fecha de vencimiento es la fecha de inicio.
                // Para las siguientes, sumar la frecuencia.
                if (i > 0) {
                    dueDate.setDate(dueDate.getDate() + freqDays);
                }

                installments.push({
                    number: i + 1,
                    dueDate: dueDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
                    amount: montoPorCuota
                });
                currentDate = dueDate; // Actualizar la fecha para el cálculo de la siguiente cuota
            }
        }
        return installments;
    }, [paymentPlan.quotas, paymentPlan.frecuencia_dias, paymentPlan.initial_date, montoPorCuota]);

    // Función de validación
    const validate = () => {
        let tempErrors = {};

        // Validar el precio del dispositivo
        if (!devicePrice || Number(devicePrice) <= 0) tempErrors.devicePrice = "El valor del dispositivo es requerido y debe ser mayor a 0.";

        // Validar pago inicial
        if (!initialPayment.value || Number(initialPayment.value) < 0) tempErrors.initialValue = "El valor del pago inicial es requerido y no puede ser negativo.";
        if (Number(initialPayment.value) > Number(devicePrice)) tempErrors.initialValue = "El pago inicial no puede ser mayor que el valor del dispositivo.";
        if (!initialPayment.method) tempErrors.initialMethod = "El método de pago inicial es requerido.";
        if (!initialPayment.date) tempErrors.initialDate = "La fecha del pago inicial es requerida.";


        // Validar plan de pagos (después de validar precio y pago inicial)
        if (balanceToFinance < 0) {
            tempErrors.balance = "El saldo a financiar no puede ser negativo. Ajusta el pago inicial.";
        } else if (balanceToFinance > 0) {
            if (!paymentPlan.quotas || Number(paymentPlan.quotas) <= 0) tempErrors.quotas = "Si hay saldo a financiar, el número de quotas es requerido y debe ser mayor a 0.";
            if (!paymentPlan.frecuencia_dias || Number(paymentPlan.frecuencia_dias) <= 0) tempErrors.frecuencia_dias = "La frecuencia es requerida y debe ser mayor a 0.";
            if (!paymentPlan.initial_date) tempErrors.initial_date = "La fecha de inicio del plan es requerida.";
        } else { // balanceToFinance === 0
            if (Number(paymentPlan.quotas) > 0) tempErrors.quotas = "Si no hay saldo a financiar, el número de quotas debería ser 0.";
            if (Number(paymentPlan.frecuencia_dias) > 0) tempErrors.frecuencia_dias = "Si no hay saldo a financiar, la frecuencia debería ser 0.";
            // La fecha de inicio del plan puede ser opcional si no hay quotas
            // if (paymentPlan.initial_date) tempErrors.initial_date = "Si no hay quotas, la fecha de inicio del plan no es necesaria."; // Esto podría ser una advertencia en lugar de error.
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onNext({
                // Asegúrate de que `device` se mantenga y `price_usd` se actualice en el objeto `device`
                device: {
                    ...(initialData.device || {}), // Mantenemos los detalles del dispositivo del paso anterior
                    price_usd: Number(devicePrice) // Añadimos o actualizamos el precio aquí
                },
                paymentPlan: {
                    ...paymentPlan,
                    monto_cuota: montoPorCuota, // Añadir el monto_cuota calculado aquí
                    balance_to_finance: balanceToFinance
                },
                initialPayment,
                generatedInstallments // Guardar las quotas generadas para el resumen o PDF
            });
        } else {
            toast.error("Por favor, corrige los errores en el formulario.");
        }
    };

    const handlePaymentPlanChange = (e) => {
        const { name, value } = e.target;
        setPaymentPlan(prev => ({ ...prev, [name]: ['quotas', 'frecuencia_dias'].includes(name) ? Number(value) : value }));
    };

    const handleInitialPaymentChange = (e) => {
        const { name, value } = e.target;
        setInitialPayment(prev => ({ ...prev, [name]: name === 'value' ? Number(value) : value }));
    };

    // Manejador para el cambio del valor del dispositivo en Step3
    const handleDevicePriceChange = (e) => {
        setDevicePrice(e.target.value);
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Paso 3: Pago y Plan</h2>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Detalles de Valor y Saldo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="devicePrice" className="block text-sm font-medium text-gray-700">Valor del Dispositivo (COP)</label>
                        <input
                            type="number"
                            name="devicePrice"
                            id="devicePrice"
                            value={devicePrice}
                            onChange={handleDevicePriceChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            min="0"
                            step="0.01"
                        />
                        {errors.devicePrice && <p className="mt-1 text-sm text-red-600">{errors.devicePrice}</p>}
                    </div>
                    <div>
                        <label htmlFor="initialValue" className="block text-sm font-medium text-gray-700">Valor Pago Inicial (COP)</label>
                        <input
                            type="number"
                            name="value"
                            id="initialValue"
                            value={initialPayment.value}
                            onChange={handleInitialPaymentChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            min="0"
                            step="0.01"
                        />
                        {errors.initialValue && <p className="mt-1 text-sm text-red-600">{errors.initialValue}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Saldo a Financiar</label>
                        <p className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 sm:text-sm">
                            ${balanceToFinance.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP
                        </p>
                        {errors.balance && <p className="mt-1 text-sm text-red-600">{errors.balance}</p>}
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Detalles del Plan de Pagos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="quotas" className="block text-sm font-medium text-gray-700">Número de Cuotas</label>
                        <input
                            type="number"
                            name="quotas"
                            id="quotas"
                            value={paymentPlan.quotas}
                            onChange={handlePaymentPlanChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            min="0"
                        />
                        {errors.quotas && <p className="mt-1 text-sm text-red-600">{errors.quotas}</p>}
                    </div>
                    <div>
                        <label htmlFor="frecuencia_dias" className="block text-sm font-medium text-gray-700">Frecuencia (días)</label>
                        <input
                            type="number"
                            name="frecuencia_dias"
                            id="frecuencia_dias"
                            value={paymentPlan.frecuencia_dias}
                            onChange={handlePaymentPlanChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            min="1"
                        />
                        {errors.frecuencia_dias && <p className="mt-1 text-sm text-red-600">{errors.frecuencia_dias}</p>}
                    </div>
                    <div>
                        <label htmlFor="initial_date" className="block text-sm font-medium text-gray-700">Fecha de Inicio del Plan</label>
                        <input
                            type="date"
                            name="initial_date"
                            id="initial_date"
                            value={paymentPlan.initial_date}
                            onChange={handlePaymentPlanChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.initial_date && <p className="mt-1 text-sm text-red-600">{errors.initial_date}</p>}
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Detalles del Pago Inicial</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="initialMethod" className="block text-sm font-medium text-gray-700">Método de Pago Inicial</label>
                        <select
                            name="method"
                            id="initialMethod"
                            value={initialPayment.method}
                            onChange={handleInitialPaymentChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="">Selecciona un método</option>
                            <option value="Efectivo">Efectivo</option>
                            <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                            <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                            <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                            <option value="PSE">PSE</option>
                        </select>
                        {errors.initialMethod && <p className="mt-1 text-sm text-red-600">{errors.initialMethod}</p>}
                    </div>
                    <div>
                        <label htmlFor="initialDate" className="block text-sm font-medium text-gray-700">Fecha de Pago Inicial</label>
                        <input
                            type="date"
                            name="date"
                            id="initialDate"
                            value={initialPayment.date}
                            onChange={handleInitialPaymentChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.initialDate && <p className="mt-1 text-sm text-red-600">{errors.initialDate}</p>}
                    </div>
                </div>
            </div>

            {/* Tabla para visualizar el plan de pagos - MODIFICADA */}
            {generatedInstallments.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Detalle del Plan de Pagos Programado</h3>
                    {/* Se añade un div con max-h y overflow-y para el scroll interno */}
                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10"> {/* sticky top-0 para mantener el encabezado visible al hacer scroll */}
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cuota
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha Vencimiento
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Monto
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {generatedInstallments.map((installment) => (
                                    <tr key={installment.number}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {installment.number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(installment.dueDate).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${installment.amount.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                        Total a Financiar
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        ${balanceToFinance.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}


            <div className="flex justify-between mt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <ChevronLeftIcon className="-ml-0.5 mr-2 h-5 w-5" />
                    Atrás
                </button>
                <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Continuar
                    <svg className="ml-2 -mr-0.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </form>
    );
};

export default Step3PaymentPlan;