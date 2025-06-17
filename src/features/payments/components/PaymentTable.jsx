import React from 'react';
import { DataTable } from '../../../common/components/ui/DataTable';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

const PaymentTable = ({ payments }) => {
    const getPaymentStatusClass = (status) => {
        switch (status) {
            case 'Pagado': return 'bg-green-100 text-green-800';
            case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
            case 'Atrasado': return 'bg-red-100 text-red-800';
            case 'Anulado': return 'bg-gray-100 text-gray-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    const columns = [
        { Header: 'ID Pago', accessor: 'id' },
        { Header: 'Fecha', accessor: 'date' },
        { Header: 'Monto', accessor: 'amount', Cell: ({ value }) => `$${value.toFixed(2)}` },
        { Header: 'Cliente', accessor: 'customerName' },
        { Header: 'Dispositivo Serial', accessor: 'deviceSerial' },
        { Header: 'Periodo', accessor: 'period' },
        {
            Header: 'Estado',
            accessor: 'status',
            Cell: ({ value }) => (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusClass(value)}`}>
                    {value}
                </span>
            )
        },
        { Header: 'Método', accessor: 'method' },
        { Header: 'Registrado por', accessor: 'registeredBy' },
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <CurrencyDollarIcon className="h-6 w-6 mr-2 text-green-600" />
                Historial de Pagos
            </h2>
            <DataTable columns={columns} data={payments} />
        </div>
    );
};

export default PaymentTable;