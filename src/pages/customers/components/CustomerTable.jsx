import React from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { PencilIcon, TrashIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline'; // Asegura iconos

const CustomerTable = ({ customers, onEdit, onDelete, onToggleStatus }) => {
    const columns = [
        { Header: 'Nombre', accessor: 'name' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Teléfono', accessor: 'phone' },
        { Header: 'Dispositivos', accessor: 'devices' },
        {
            Header: 'Estado',
            accessor: 'status',
            Cell: ({ value }) => (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {value === 'active' ? 'Activo' : 'Inactivo'}
                </span>
            )
        },
        {
            Header: 'Acciones',
            accessor: 'actions',
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(row.original)}
                        className="p-1 text-blue-600 hover:text-blue-900"
                        title="Editar cliente"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => onToggleStatus(row.original.id)}
                        className={`p-1 ${row.original.status === 'active' ? 'text-orange-600' : 'text-green-600'} hover:text-orange-900`}
                        title={row.original.status === 'active' ? 'Desactivar cliente' : 'Activar cliente'}
                    >
                        {row.original.status === 'active' ? <LockClosedIcon className="h-5 w-5" /> : <UserIcon className="h-5 w-5" />}
                    </button>
                    <button
                        onClick={() => onDelete(row.original.id)}
                        className="p-1 text-red-600 hover:text-red-900"
                        title="Eliminar cliente"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <DataTable columns={columns} data={customers} />
        </div>
    );
};

export default CustomerTable;