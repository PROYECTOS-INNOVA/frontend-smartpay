import React from 'react';

const DeviceTable = ({ devices, onViewDetails, columnFilters, onColumnFilterChange }) => {
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
                    className="mt-1 p-1 w-full border border-gray-300 rounded-md text-gray-700 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </th>
    );

    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    {renderTh('name', 'Nombre')}
                    {renderTh('serial_number', 'Serial')}
                    {renderTh('model', 'Modelo')}
                    {renderTh('brand', 'Marca')}
                    {renderTh('imei', 'IMEI 1')}
                    {renderTh('state', 'Estado')}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {devices.length === 0 ? (
                    <tr>
                        <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            No hay dispositivos para mostrar.
                        </td>
                    </tr>
                ) : (
                    devices.map((device) => (
                        <tr key={device.device_id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{device.name || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.serial_number || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.model || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.brand || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.imei || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(device.state)}`}>
                                    {device.state || 'N/A'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onViewDetails(device.device_id)}
                                    className="text-indigo-600 hover:text-indigo-900 ml-4"
                                >
                                    Ver Detalles
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};

export default DeviceTable;