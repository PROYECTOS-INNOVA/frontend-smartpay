import { useState } from 'react';
import { DataTable } from '../components/ui/DataTable';
import {
    CreditCardIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    PlusIcon
} from '@heroicons/react/24/outline';

const PaymentBilling = () => {
    const [payments] = useState([
        { id: 1, invoice: 'INV-2023-001', client: 'Juan Pérez', amount: '$150.00', date: '2023-05-15', status: 'paid' },
        { id: 2, invoice: 'INV-2023-002', client: 'María García', amount: '$200.00', date: '2023-05-18', status: 'pending' },
        { id: 3, invoice: 'INV-2023-003', client: 'Carlos López', amount: '$175.00', date: '2023-05-20', status: 'failed' },
    ]);

    const columns = [
        { Header: 'Factura', accessor: 'invoice' },
        { Header: 'Cliente', accessor: 'client' },
        { Header: 'Monto', accessor: 'amount' },
        { Header: 'Fecha', accessor: 'date' },
        {
            Header: 'Estado',
            accessor: 'status',
            Cell: ({ value }) => {
                const statusMap = {
                    paid: { icon: CheckCircleIcon, color: 'text-green-500' },
                    pending: { icon: ClockIcon, color: 'text-yellow-500' },
                    failed: { icon: XCircleIcon, color: 'text-red-500' },
                };
                const Icon = statusMap[value].icon;
                return (
                    <div className={`flex items-center ${statusMap[value].color}`}>
                        <Icon className="h-5 w-5 mr-1" />
                        {value === 'paid' ? 'Pagado' : value === 'pending' ? 'Pendiente' : 'Fallido'}
                    </div>
                );
            }
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Pagos y facturación</h1>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Nueva factura
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center mb-6">
                    <CreditCardIcon className="h-6 w-6 text-blue-500 mr-2" />
                    <h2 className="text-lg font-semibold">Historial de pagos</h2>
                </div>
                <DataTable columns={columns} data={payments} />
            </div>
        </div>
    );
};

export default PaymentBilling;