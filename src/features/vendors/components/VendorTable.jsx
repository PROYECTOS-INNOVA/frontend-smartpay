import React from 'react';
import { PencilIcon, TrashIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

const VendorTable = ({ vendors, onEdit, onDelete, onToggleStatus }) => {
    return (
        <div className="overflow-x-auto shadow-lg sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            DNI
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre Completo
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Username
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rol
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ciudad
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {vendors && vendors.length > 0 ? (
                        vendors.map((vendor) => {
                            const isActive = vendor.state?.toLowerCase() === 'active';
                            const statusClasses = isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
                            const statusText = isActive ? 'Activo' : 'Inactivo';

                            return (
                                <tr key={vendor.user_id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vendor.dni || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {`${vendor.first_name || ''} ${vendor.middle_name || ''} ${vendor.last_name || ''} ${vendor.second_last_name || ''}`.trim()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vendor.email || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vendor.username || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vendor.role?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vendor.city?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => onToggleStatus(vendor.user_id, vendor.state)}
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
                                        <button
                                            onClick={() => onEdit(vendor)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                            title="Editar Vendedor"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(vendor.user_id)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Eliminar Vendedor"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                No hay vendedores para mostrar.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VendorTable;