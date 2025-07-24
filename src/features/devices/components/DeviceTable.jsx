import React, { useState, useMemo } from 'react';
import { PAGE_SIZE } from '../../../common/utils/const';

const DeviceTable = ({ devices = [], onViewDetails, columnFilters, onColumnFilterChange }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const paginatedDevices = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return devices.slice(start, start + PAGE_SIZE);
    }, [devices, currentPage]);

    const totalPages = Math.ceil(devices.length / PAGE_SIZE);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Blocked':
                return 'bg-red-100 text-red-800';
            case 'Released':
                return 'bg-blue-100 text-blue-800';
            case 'Inactive':
                return 'bg-gray-100 text-gray-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const renderTh = (columnKey, columnName) => (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex flex-col">
                <span>{columnName}</span>
                <input
                    type="text"
                    placeholder={` ${columnName}...`}
                    value={columnFilters[columnKey] || ''}
                    onChange={(e) => onColumnFilterChange(columnKey, e.target.value)}
                    className="mt-1 p-1 w-full border border-gray-300 rounded-md text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </th>
    );

    return (
        <div className="overflow-x-auto shadow-lg sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {renderTh('user.first_name', 'Cliente')}
                        {renderTh('device.product_name', 'Nombre')}
                        {renderTh('device.serial_number', 'Serial')}
                        {renderTh('device.model', 'Modelo')}
                        {renderTh('device.brand', 'Marca')}
                        {renderTh('device.imei', 'IMEI 1')}
                        {renderTh('device.state', 'Estado')}
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedDevices.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                No hay dispositivos para mostrar.
                            </td>
                        </tr>
                    ) : (
                        paginatedDevices.map((device) => (
                            <tr key={device.device_id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${device.user.first_name} ${device.user.middle_name} ${device.user.last_name} ${device.user.second_last_name}` || ''}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{device.device.product_name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.device.serial_number || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.device.model || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.device.brand || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.device.imei || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(device.device.state)}`}>
                                        {device.device.state || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => onViewDetails(device.device_id)}
                                        className="text-blue-600 hover:text-blue-900 ml-4"
                                    >
                                        Ver Detalles
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="flex justify-end items-center mt-4 space-x-4 m-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="text-sm text-gray-700">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

export default DeviceTable;
