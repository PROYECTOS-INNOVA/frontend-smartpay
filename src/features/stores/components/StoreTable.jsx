import React, { useState, useMemo } from 'react';
import { PencilIcon, TrashIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';
import { PAGE_SIZE } from '../../../common/utils/const';

const StoreTable = ({ data = [], onEdit, onDelete, onToggleStatus }) => {
    const [currentPage, setCurrentPage] = useState(1);
    console.log("StoreTable data:", data);
    

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return data.slice(start, start + PAGE_SIZE);
    }, [data, currentPage]);

    const totalPages = Math.ceil(data.length / PAGE_SIZE);

    return (
        <div className="overflow-x-auto shadow-lg sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limt. Dispositivos</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.length > 0 ? (
                        paginatedData.map((item) => {
                            const isActive = item.state?.toLowerCase() === 'active';
                            const statusClasses = isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
                            const statusText = isActive ? 'Activo' : 'Inactivo';

                            return (
                                <tr key={item.user_id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nombre || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.plan || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tokens_disponibles || 'N/A'}</td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => onToggleStatus(item.id)}
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
                                    </td> */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                            title="Editar Vendedor"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(item.id)}
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
                                No hay tiendas para mostrar.
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

export default StoreTable;