// src/components/CustomerTable.jsx
import React, { useState, useMemo } from 'react';
import { PencilIcon, TrashIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';
import { PAGE_SIZE } from '../../../common/utils/const';

const CustomerTable = ({ customers, onEdit, onDelete, onToggleStatus }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil((customers?.length || 0) / PAGE_SIZE);

    const paginatedCustomers = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return customers.slice(start, start + PAGE_SIZE);
    }, [customers, currentPage]);

    const changePage = (direction) => {
        setCurrentPage((prev) => {
            if (direction === 'next' && prev < totalPages) return prev + 1;
            if (direction === 'prev' && prev > 1) return prev - 1;
            return prev;
        });
    };

    return (
        <div className="overflow-x-auto shadow-lg sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DNI</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre Completo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ciudad</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedCustomers.length > 0 ? (
                        paginatedCustomers.map((customer) => {
                            const isActive = customer.state?.toLowerCase();
                            const statusClasses = isActive == 'active' ? 'bg-green-100 text-green-800' : isActive == 'inactive' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
                            const statusText = isActive == 'active' ? 'Activo' : isActive == 'inactive' ? 'Inactivo' : 'Nuevo';

                            return (
                                <tr key={customer.user_id}>
                                    <td className="px-6 py-4 text-sm text-gray-900">{customer.dni || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {`${customer.first_name || ''} ${customer.middle_name || ''} ${customer.last_name || ''} ${customer.second_last_name || ''}`.trim()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{customer.email || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{customer.username || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{customer.role?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{customer.city?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => onToggleStatus(customer.user_id, customer.state)}
                                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusClasses}`}
                                            title={`Cambiar a ${isActive ? 'Inactivo' : 'Activo'}`}
                                        >
                                            {statusText}
                                            {isActive == 'active' || isActive == 'initial' ? (
                                                <LockOpenIcon className="h-4 w-4 ml-1" />
                                            ) : (
                                                <LockClosedIcon className="h-4 w-4 ml-1" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button onClick={() => onEdit(customer)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => onDelete(customer.user_id)} className="text-red-600 hover:text-red-900">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                No hay clientes para mostrar.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="flex justify-end items-center mt-4 space-x-4 m-2">
                    <button
                        onClick={() => changePage('prev')}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="text-sm text-gray-700">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={() => changePage('next')}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomerTable;
