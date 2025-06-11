// src/pages/devices/views/DeviceDetailsView.jsx
import React from 'react';
// Importamos los iconos necesarios para los botones de acción y la navegación
import { ArrowLeftIcon, LockClosedIcon, LockOpenIcon, MapPinIcon, DeviceTabletIcon, CreditCardIcon } from '@heroicons/react/24/outline'; // Asegúrate de tener estos iconos

// Comentamos la importación del mapa, ya no lo usaremos directamente aquí
// import DeviceMapComponent from '../components/DeviceMapComponent';

const DeviceDetailsView = ({ device, onBackToList, onBlock, onUnblock, onLocate, onRelease, onMakePayment }) => {
    if (!device) {
        return <div className="text-center text-gray-500">Selecciona un dispositivo para ver los detalles.</div>;
    }

    // Datos dummy para el historial de pagos (los mismos que antes)
    const paymentHistory = [
        { id: 1, date: '2024-05-15', amount: 50.00, status: 'Pagado', period: 'Mayo 2024' },
        { id: 2, date: '2024-04-15', amount: 50.00, status: 'Pagado', period: 'Abril 2024' },
        { id: 3, date: '2024-03-15', amount: 50.00, status: 'Atrasado', period: 'Marzo 2024' },
        { id: 4, date: '2024-02-15', amount: 50.00, status: 'Pagado', period: 'Febrero 2024' },
        { id: 5, date: '2024-01-15', amount: 50.00, status: 'Pagado', period: 'Enero 2024' },
    ];

    // Datos dummy para el historial de acciones (NUEVO)
    const actionHistory = [
        { id: 1, date: '2024-06-08 10:30', user: 'Vendedor A', action: 'Dispositivo Vendido y Aprovisionado', details: `Cliente: ${device.customerName}` },
        { id: 2, date: '2024-06-09 14:00', user: 'Admin XYZ', action: 'Dispositivo Bloqueado', details: 'Falta de pago' },
        { id: 3, date: '2024-06-09 15:30', user: 'Superadmin', action: 'Ubicación Solicitada', details: `Lat: ${device.lastLocation?.latitude || 'N/A'}, Lon: ${device.lastLocation?.longitude || 'N/A'}` },
        { id: 4, date: '2024-06-10 09:00', user: 'Admin XYZ', action: 'Dispositivo Desbloqueado', details: 'Pago recibido' },
        { id: 5, date: '2024-06-10 11:45', user: 'Vendedor B', action: 'Pago Realizado', details: '$50.00' },
    ];

    const getStatusClass = (status) => { // Renombrado para ser más genérico
        switch (status) {
            case 'Activo': return 'bg-green-100 text-green-800';
            case 'Bloqueado': return 'bg-red-100 text-red-800';
            case 'Liberado': return 'bg-blue-100 text-blue-800';
            case 'Pagado': return 'bg-green-100 text-green-800';
            case 'Atrasado': return 'bg-red-100 text-red-800';
            case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <button
                    onClick={onBackToList}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <ArrowLeftIcon className="-ml-0.5 mr-2 h-4 w-4" />
                    Volver a la lista
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Detalles del Dispositivo: {device.serial}</h1>
                <div></div> {/* Espaciador para centrar el título */}
            </div>

            {/* Contenedor principal con grid para las secciones superiores */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Ubicación del Dispositivo (Ahora solo texto) */}
                <div className="lg:col-span-1 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Ubicación del Dispositivo</h2>
                    <div className="bg-gray-50 p-4 rounded-md text-center">
                        {device.lastLocation?.latitude && device.lastLocation?.longitude ? (
                            <>
                                <p className="text-lg font-medium text-gray-700">Latitud: <span className="font-normal">{device.lastLocation.latitude.toFixed(6)}</span></p>
                                <p className="text-lg font-medium text-gray-700">Longitud: <span className="font-normal">{device.lastLocation.longitude.toFixed(6)}</span></p>
                                {/* Opcionalmente, aquí puedes añadir el mapa si lo descomentas en el futuro */}
                                {/* <DeviceMapComponent
                                    latitude={device.lastLocation.latitude}
                                    longitude={device.lastLocation.longitude}
                                    deviceSerial={device.serial}
                                /> */}
                            </>
                        ) : (
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                                <p className="font-bold">Ubicación No Disponible</p>
                                <p className="text-sm">El dispositivo no ha reportado una ubicación reciente.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Información General */}
                <div className="lg:col-span-1 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Información General</h2>
                    <div className="space-y-3 text-gray-700">
                        <p><strong>ID:</strong> <span className="font-normal">{device.id}</span></p>
                        <p><strong>Serial:</strong> <span className="font-normal">{device.serial}</span></p>
                        <p><strong>Modelo:</strong> <span className="font-normal">{device.model}</span></p>
                        <p><strong>IMEI 1:</strong> <span className="font-normal">{device.imei1}</span></p>
                        <p><strong>IMEI 2:</strong> <span className="font-normal">{device.imei2 || 'N/A'}</span></p>
                        <p><strong>Cliente:</strong> <span className="font-normal">{device.customerName}</span></p>
                        <p><strong>Vendedor:</strong> <span className="font-normal">{device.vendorName}</span></p>
                        <p><strong>Batería:</strong> <span className="font-normal">{device.batteryPercentage}%</span></p>
                        <p><strong>Estado MDM:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(device.mdmStatus)}`}>{device.mdmStatus}</span></p>
                        <p><strong>Última Actualización:</strong> <span className="font-normal">{new Date().toLocaleString()}</span></p>
                    </div>
                </div>

                {/* Acciones del Dispositivo */}
                <div className="lg:col-span-1 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Acciones del Dispositivo</h2>
                    <div className="grid grid-cols-1 gap-4"> {/* Cambiado a una columna para más espacio vertical */}
                        <button
                            onClick={() => onBlock(device.id)}
                            disabled={device.mdmStatus === 'Bloqueado'}
                            className={`flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200
                                ${device.mdmStatus === 'Bloqueado' ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'}`}
                        >
                            <LockClosedIcon className="h-5 w-5 mr-2" />
                            Bloquear Dispositivo
                        </button>
                        <button
                            onClick={() => onUnblock(device.id)}
                            disabled={device.mdmStatus !== 'Bloqueado'}
                            className={`flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200
                                ${device.mdmStatus !== 'Bloqueado' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}`}
                        >
                            <LockOpenIcon className="h-5 w-5 mr-2" />
                            Desbloquear Dispositivo
                        </button>
                        <button
                            onClick={() => onLocate(device.id)}
                            className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            <MapPinIcon className="h-5 w-5 mr-2" />
                            Localizar Dispositivo
                        </button>
                        <button
                            onClick={() => onRelease(device.id)}
                            disabled={device.mdmStatus === 'Liberado'}
                            className={`flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200
                                ${device.mdmStatus === 'Liberado' ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'}`}
                        >
                            <DeviceTabletIcon className="h-5 w-5 mr-2" />
                            Liberar Dispositivo
                        </button>
                        <button
                            onClick={() => onMakePayment(device.id)}
                            className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                        >
                            <CreditCardIcon className="h-5 w-5 mr-2" />
                            Registrar Pago
                        </button>
                    </div>
                </div>
            </div>

            {/* Historial de Acciones y Historial de Pagos (Filas separadas) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Historial de Acciones */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Historial de Acciones</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Usuario
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acción
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Detalles
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {actionHistory.map(action => (
                                    <tr key={action.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {action.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {action.user}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {action.action}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {action.details}
                                        </td>
                                    </tr>
                                ))}
                                {actionHistory.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                            No hay historial de acciones disponible.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Historial de Pagos */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Historial de Pagos</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Periodo
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Monto
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paymentHistory.map(payment => (
                                    <tr key={payment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {payment.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {payment.period}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ${payment.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(payment.status)}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {paymentHistory.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                            No hay historial de pagos disponible.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceDetailsView;