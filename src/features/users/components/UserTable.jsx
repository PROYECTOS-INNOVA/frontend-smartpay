import React from 'react';
import { DataTable } from '../../../common/components/ui/DataTable';
import { PencilIcon, TrashIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';

const UserTable = ({ users, onEdit, onDelete, onToggleStatus }) => {
    const columns = [
        { Header: 'Usuario', accessor: 'username' },
        { Header: 'Nombre', accessor: 'name' },
        { Header: 'Rol', accessor: 'role' },
        { Header: 'Email', accessor: 'email' },
        {
            Header: 'Estado',
            accessor: 'status',
            Cell: ({ value }) => (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${value === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {value === 'Activo' ? 'Activo' : 'Inactivo'}
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
                        title="Editar usuario"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => onToggleStatus(row.original.id)}
                        className={`p-1 ${row.original.status === 'Activo' ? 'text-orange-600' : 'text-green-600'} hover:text-orange-900`}
                        title={row.original.status === 'Activo' ? 'Desactivar usuario' : 'Activar usuario'}
                    >
                        {row.original.status === 'Activo' ? <LockClosedIcon className="h-5 w-5" /> : <UserIcon className="h-5 w-5" />}
                    </button>
                    <button
                        onClick={() => onDelete(row.original.id)}
                        className="p-1 text-red-600 hover:text-red-900"
                        title="Eliminar usuario"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="overflow-x-auto">
                    <DataTable columns={columns} data={users} />
                </div>
            </div>
        </div>
    );
};

export default UserTable;