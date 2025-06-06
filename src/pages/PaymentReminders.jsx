import { useState } from 'react';
import { DataTable } from '../components/ui/DataTable';
import {
    BellIcon,
    EnvelopeIcon,
    PhoneIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const PaymentReminders = () => {
    const [reminders] = useState([
        { id: 1, client: 'Juan Pérez', device: 'Galaxy S21', amount: '$150.00', dueDate: '2023-06-15', status: 'pending', method: 'email' },
        { id: 2, client: 'María García', device: 'iPhone 13', amount: '$200.00', dueDate: '2023-06-18', status: 'sent', method: 'sms' },
        { id: 3, client: 'Carlos López', device: 'Redmi Note 10', amount: '$175.00', dueDate: '2023-06-20', status: 'failed', method: 'sms' },
    ]);

    const columns = [
        { Header: 'Cliente', accessor: 'client' },
        { Header: 'Dispositivo', accessor: 'device' },
        { Header: 'Monto', accessor: 'amount' },
        { Header: 'Fecha de vencimiento', accessor: 'dueDate' },
        {
            Header: 'Método',
            accessor: 'method',
            Cell: ({ value }) => (
                <div className="flex items-center">
                    {value === 'email' ? (
                        <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-1" />
                    ) : (
                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-1" />
                    )}
                    {value === 'email' ? 'Email' : 'SMS'}
                </div>
            )
        },
        {
            Header: 'Estado',
            accessor: 'status',
            Cell: ({ value }) => {
                const statusMap = {
                    pending: { icon: BellIcon, color: 'text-yellow-500' },
                    sent: { icon: CheckIcon, color: 'text-green-500' },
                    failed: { icon: XMarkIcon, color: 'text-red-500' },
                };
                const Icon = statusMap[value].icon;
                return (
                    <div className={`flex items-center ${statusMap[value].color}`}>
                        <Icon className="h-5 w-5 mr-1" />
                        {value === 'pending' ? 'Pendiente' : value === 'sent' ? 'Enviado' : 'Fallido'}
                    </div>
                );
            }
        },
    ];

    return (
        <div>
            <div className="flex items-center mb-6">
                <BellIcon className="h-6 w-6 text-blue-500 mr-2" />
                <h1 className="text-2xl font-bold text-gray-800">Recordatorios de pago</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Próximos recordatorios</h2>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Enviar todos
                    </button>
                </div>

                <DataTable columns={columns} data={reminders} />
            </div>
        </div>
    );
};

export default PaymentReminders;