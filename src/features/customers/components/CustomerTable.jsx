// src/features/customers/components/CustomerTable.jsx
import React from 'react';
import { DataTable } from '../../../common/components/ui/DataTable'; // Asegura que esta ruta sea correcta
import { PencilIcon, TrashIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';

const CustomerTable = ({ customers, onEdit, onDelete, onToggleStatus }) => {
    const columns = [
        {
            Header: 'Nombre',
            // Combinamos first_name y last_name para mostrar el nombre completo
            accessor: 'name', // Se usa un accessor 'name' ficticio para la columna
            Cell: ({ row }) => (
                <span>
                    {row.original.first_name} {row.original.last_name}
                </span>
            ),
        },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Teléfono', accessor: 'phone' },
        // Quitamos 'Dispositivos' si no hay datos de la API para ello.
        // Si tienes una forma de obtener los dispositivos, puedes re-agregar esta columna
        // y ajustar el Cell para mostrar el conteo.
        // { Header: 'Dispositivos', accessor: 'devices' }, // Eliminado o comentado si no hay datos de la API

        {
            Header: 'Estado',
            accessor: 'state', // Cambiado de 'status' a 'state' para coincidir con la API
            Cell: ({ value }) => (
                <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                >
                    {/* El valor de la API es 'Active' o 'Inactive' con mayúscula inicial */}
                    {value === 'Active' ? 'Activo' : 'Inactivo'}
                </span>
            ),
        },
        {
            Header: 'Acciones',
            accessor: 'actions',
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(row.original)} // Pasamos el objeto original del usuario
                        className="p-1 text-blue-600 hover:text-blue-900"
                        title="Editar cliente"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                        // Usamos row.original.user_id y row.original.state
                        onClick={() => onToggleStatus(row.original.user_id, row.original.state)}
                        className={`p-1 ${row.original.state === 'Active' ? 'text-orange-600' : 'text-green-600'
                            } hover:text-orange-900`}
                        title={row.original.state === 'Active' ? 'Desactivar cliente' : 'Activar cliente'}
                    >
                        {row.original.state === 'Active' ? (
                            <LockClosedIcon className="h-5 w-5" />
                        ) : (
                            <UserIcon className="h-5 w-5" />
                        )}
                    </button>
                    <button
                        onClick={() => onDelete(row.original.user_id)} // Usamos row.original.user_id
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
            {/* Asegúrate de que DataTable puede manejar las nuevas definiciones de columnas y los datos */}
            <DataTable columns={columns} data={customers} />
        </div>
    );
};

export default CustomerTable;