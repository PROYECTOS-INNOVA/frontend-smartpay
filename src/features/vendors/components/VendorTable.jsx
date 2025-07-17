import React, { useState, useMemo } from 'react';
import { PencilIcon, TrashIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';
import { PAGE_SIZE } from '../../../common/utils/const';

const VendorTable = ({ vendors, onEdit, onDelete, onToggleStatus }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const paginatedVendors = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return vendors.slice(start, start + PAGE_SIZE);
    }, [vendors, currentPage]);

    const totalPages = Math.ceil(vendors.length / PAGE_SIZE);

    return (
        <div className="overflow-x-auto shadow-lg sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedVendors.length > 0 ? (
                        paginatedVendors.map((vendor) => {
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

            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 p-4">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="text-sm text-gray-700">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
};

export default VendorTable;