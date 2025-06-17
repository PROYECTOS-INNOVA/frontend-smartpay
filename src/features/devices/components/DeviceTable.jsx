import React from 'react';
import { DataTable } from '../../../common/components/ui/DataTable';
import { EyeIcon } from '@heroicons/react/24/outline';

const DeviceTable = ({ devices, onViewDetails }) => {
    const columns = [
        { Header: 'Serial', accessor: 'serial' },
        { Header: 'Modelo', accessor: 'model' },
        { Header: 'Cliente', accessor: 'customerName' },
        { Header: 'Vendedor', accessor: 'vendorName' },
        {
            Header: 'Estado MDM',
            accessor: 'mdmStatus',
            Cell: ({ value }) => (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${value === 'Activo' ? 'bg-green-100 text-green-800' :
                        value === 'Bloqueado' ? 'bg-red-100 text-red-800' :
                            value === 'Liberado' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                    }`}>
                    {value}
                </span>
            )
        },
        {
            Header: 'Batería', accessor: 'batteryPercentage',
            Cell: ({ value }) => `${value}%`
        },
        {
            Header: 'Acciones',
            accessor: 'actions',
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => onViewDetails(row.original)}
                        className="p-1 text-indigo-600 hover:text-indigo-900"
                        title="Ver detalles del dispositivo"
                    >
                        <EyeIcon className="h-5 w-5" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Listado de Dispositivos</h2>
            <DataTable columns={columns} data={devices} />
        </div>
    );
};

export default DeviceTable;