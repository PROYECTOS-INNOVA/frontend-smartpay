import { useState } from 'react';
import { DataTable } from '../components/ui/DataTable';
import { UserIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const CustomerManagement = () => {
    const [customers] = useState([
        { id: 1, name: 'Juan Pérez', email: 'juan@example.com', phone: '555-1234', devices: 3, status: 'active' },
        { id: 2, name: 'María García', email: 'maria@example.com', phone: '555-5678', devices: 1, status: 'active' },
        { id: 3, name: 'Carlos López', email: 'carlos@example.com', phone: '555-9012', devices: 2, status: 'inactive' },
    ]);

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
            Cell: () => (
                <div className="flex space-x-2">
                    <button className="p-1 text-blue-500 hover:text-blue-700">
                        <PencilIcon className="h-5 w-5" />
                    </button>
                    <button className="p-1 text-red-500 hover:text-red-700">
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de clientes</h1>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Nuevo cliente
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <DataTable columns={columns} data={customers} />
            </div>
        </div>
    );
};

export default CustomerManagement;