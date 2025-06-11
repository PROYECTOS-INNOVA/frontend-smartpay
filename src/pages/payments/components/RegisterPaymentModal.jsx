import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';

const RegisterPaymentModal = ({ isOpen, onClose, onRegisterPayment, customers, devices }) => {
    const [formData, setFormData] = useState({
        amount: '',
        customerId: '',
        deviceId: '',
        period: '',
        method: '',
        status: 'Pagado',
        registeredBy: 'Usuario Actual (Simulado)',
    });
    const [filteredDevices, setFilteredDevices] = useState([]);

    useEffect(() => {
        if (formData.customerId) {
            setFilteredDevices(devices.filter(d => d.customerId === formData.customerId));
        } else {
            setFilteredDevices(devices);
        }
    }, [formData.customerId, devices]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.customerId || !formData.deviceId || !formData.period || !formData.method) {
            alert('Por favor, completa todos los campos requeridos.');
            return;
        }

        const newPayment = {
            id: `PAY-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            ...formData,
            amount: parseFloat(formData.amount),
            customerName: customers.find(c => c.id === formData.customerId)?.name || 'Desconocido',
            deviceSerial: devices.find(d => d.id === formData.deviceId)?.serial || 'Desconocido',
        };
        onRegisterPayment(newPayment);
        onClose();
        setFormData({
            amount: '',
            customerId: '',
            deviceId: '',
            period: '',
            method: '',
            status: 'Pagado',
            registeredBy: 'Usuario Actual (Simulado)',
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Registrar Nuevo Pago">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">Cliente</label>
                    <select
                        id="customerId"
                        name="customerId"
                        value={formData.customerId}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">Selecciona un cliente</option>
                        {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700">Dispositivo (del cliente seleccionado)</label>
                    <select
                        id="deviceId"
                        name="deviceId"
                        value={formData.deviceId}
                        onChange={handleChange}
                        required
                        disabled={!formData.customerId || filteredDevices.length === 0}
                        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md
                            ${!formData.customerId || filteredDevices.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                        <option value="">Selecciona un dispositivo</option>
                        {filteredDevices.map(device => (
                            <option key={device.id} value={device.id}>{device.serial} ({device.model})</option>
                        ))}
                    </select>
                    {formData.customerId && filteredDevices.length === 0 && (
                        <p className="mt-1 text-sm text-red-600">No hay dispositivos asociados a este cliente.</p>
                    )}
                </div>

                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Monto del Pago</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        min="0.01"
                        step="0.01"
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="period" className="block text-sm font-medium text-gray-700">Periodo de Pago (Ej: Mayo 2024)</label>
                    <input
                        type="text"
                        id="period"
                        name="period"
                        value={formData.period}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        placeholder="Ej: Mayo 2024"
                    />
                </div>

                <div>
                    <label htmlFor="method" className="block text-sm font-medium text-gray-700">Método de Pago</label>
                    <select
                        id="method"
                        name="method"
                        value={formData.method}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">Selecciona un método</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Transferencia">Transferencia Bancaria</option>
                        <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                        <option value="Consignación">Consignación Bancaria</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Registrar Pago
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default RegisterPaymentModal;