import React from 'react';
import { TrashIcon, LockOpenIcon, LockClosedIcon } from '@heroicons/react/24/outline'; // Asegúrate de importar los iconos

const CustomerTable = ({ customers, onDelete, onToggleStatus, columnFilters, onColumnFilterChange }) => {

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            DNI
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm p-1"
                                placeholder="Filtrar DNI"
                                value={columnFilters.dni}
                                onChange={(e) => onColumnFilterChange('dni', e.target.value)}
                            />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre Completo
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm p-1"
                                placeholder="Filtrar nombre"
                                value={columnFilters.first_name} // O podrías tener un solo campo que busque en ambos
                                onChange={(e) => onColumnFilterChange('first_name', e.target.value)}
                            />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm p-1"
                                placeholder="Filtrar email"
                                value={columnFilters.email}
                                onChange={(e) => onColumnFilterChange('email', e.target.value)}
                            />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Teléfono
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm p-1"
                                placeholder="Filtrar teléfono"
                                value={columnFilters.phone}
                                onChange={(e) => onColumnFilterChange('phone', e.target.value)}
                            />
                        </th>
                        {/* Se quitó la columna de Rol según tu solicitud */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ciudad
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm p-1"
                                placeholder="Filtrar ciudad"
                                value={columnFilters.city__name} 
                                onChange={(e) => onColumnFilterChange('city__name', e.target.value)}
                            />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm p-1"
                                value={columnFilters.state}
                                onChange={(e) => onColumnFilterChange('state', e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="Active">Activo</option>
                                <option value="Inactive">Inactivo</option>
                            </select>
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {customers.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                No se encontraron clientes con los filtros aplicados.
                            </td>
                        </tr>
                    ) : (
                        customers.map((customer) => {
                            const isActive = customer.state === 'Active';
                            const statusClasses = isActive
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200';
                            const statusText = isActive ? 'Activo' : 'Inactivo';

                            return (
                                <tr key={customer.user_id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.dni}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {customer.first_name} {customer.middle_name} {customer.last_name} {customer.second_last_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.prefix}{customer.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.city?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => onToggleStatus(customer.user_id, customer.state)}
                                            className={`inline-flex items-center px-2 py-1 text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors duration-200 ${statusClasses}`}
                                            title={`Cambiar a ${isActive ? 'Inactivo' : 'Activo'}`}
                                        >
                                            {statusText}
                                            {isActive ? (
                                                <LockOpenIcon className="h-4 w-4 ml-1" />
                                            ) : (
                                                <LockClosedIcon className="h-4 w-4 ml-1" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {/* Botón de eliminar sin restricción de rol */}
                                        <button
                                            onClick={() => onDelete(customer.user_id)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Eliminar cliente"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerTable;