// src/pages/payments/PaymentManagementPage.jsx
import React, { useState } from 'react';
import PaymentTable from './components/PaymentTable';
import RegisterPaymentModal from './components/RegisterPaymentModal';
import { PlusIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid'; 

const dummyCustomers = [
    { id: 'cust1', name: 'Juan Pérez' },
    { id: 'cust2', name: 'María García' },
    { id: 'cust3', name: 'Carlos López' },
];

const dummyDevices = [
    { id: 'dev1', serial: 'SP-DVC-001', model: 'SmartTab M1', customerId: 'cust1' },
    { id: 'dev2', serial: 'SP-DVC-002', model: 'SmartPhone X1', customerId: 'cust2' },
    { id: 'dev3', serial: 'SP-DVC-003', model: 'SmartTab M1', customerId: 'cust3' },
    { id: 'dev4', serial: 'SP-DVC-004', model: 'SmartPhone X1', customerId: 'cust1' },
];

// Datos dummy iniciales de pagos
const initialPayments = [
    {
        id: 'PAY-001',
        date: '2024-05-15',
        amount: 50.00,
        customerId: 'cust1',
        customerName: 'Juan Pérez',
        deviceId: 'dev1',
        deviceSerial: 'SP-DVC-001',
        period: 'Mayo 2024',
        status: 'Pagado',
        method: 'Efectivo',
        registeredBy: 'Vendedor A',
    },
    {
        id: 'PAY-002',
        date: '2024-04-15',
        amount: 50.00,
        customerId: 'cust2',
        customerName: 'María García',
        deviceId: 'dev2',
        deviceSerial: 'SP-DVC-002',
        period: 'Abril 2024',
        status: 'Atrasado',
        method: 'Transferencia',
        registeredBy: 'Admin Global',
    },
    {
        id: 'PAY-003',
        date: '2024-03-15',
        amount: 50.00,
        customerId: 'cust3',
        customerName: 'Carlos López',
        deviceId: 'dev3',
        deviceSerial: 'SP-DVC-003',
        period: 'Marzo 2024',
        status: 'Pagado',
        method: 'Tarjeta de Crédito',
        registeredBy: 'Vendedor B',
    },
];

const PaymentManagementPage = () => {
    const [payments, setPayments] = useState(initialPayments);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRegisterPayment = (newPayment) => {
        setPayments(prevPayments => [...prevPayments, newPayment]);
        alert('Pago registrado con éxito!');
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Pagos</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Registrar Nuevo Pago
                </button>
            </div>

            <PaymentTable payments={payments} />

            <RegisterPaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRegisterPayment={handleRegisterPayment}
                customers={dummyCustomers}
                devices={dummyDevices}
            />
        </div>
    );
};

export default PaymentManagementPage;