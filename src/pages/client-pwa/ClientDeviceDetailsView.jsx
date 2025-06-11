// src/pages/client-pwa/ClientDeviceDetailsView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, DeviceTabletIcon, InformationCircleIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const ClientDeviceDetailsView = () => {
    const { deviceId } = useParams();
    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Datos Dummy (Simulando datos relevantes para el cliente) ---
    const allDummyDevices = [
        {
            id: 'dev1', serial: 'SP-DVC-001', model: 'SmartTab M1', customerId: 'cust1',
            mdmStatus: 'Activo', // Activo, Bloqueado, Liberado
            totalInstallments: 12, currentInstallment: 7,
            nextPaymentDate: '2025-06-15', amountDue: 50.00,
            paymentHistory: [
                { id: 1, date: '2025-05-15', amount: 50.00, status: 'Pagado' },
                { id: 2, date: '2025-04-15', amount: 50.00, status: 'Pagado' },
                { id: 3, date: '2025-03-15', amount: 50.00, status: 'Pagado' },
            ]
        },
        {
            id: 'dev2', serial: 'SP-DVC-002', model: 'SmartPhone X1', customerId: 'cust2',
            mdmStatus: 'Bloqueado',
            totalInstallments: 18, currentInstallment: 3,
            nextPaymentDate: '2025-06-01', amountDue: 50.00,
            paymentHistory: [
                { id: 1, date: '2025-05-01', amount: 50.00, status: 'Pagado' },
                { id: 2, date: '2025-04-01', amount: 50.00, status: 'Atrasado' },
            ]
        },
        {
            id: 'dev3', serial: 'SP-DVC-003', model: 'SmartTab M1', customerId: 'cust1',
            mdmStatus: 'Activo',
            totalInstallments: 12, currentInstallment: 10,
            nextPaymentDate: '2025-07-01', amountDue: 50.00,
            paymentHistory: [
                { id: 1, date: '2025-06-01', amount: 50.00, status: 'Pagado' },
                { id: 2, date: '2025-05-01', amount: 50.00, status: 'Pagado' },
                { id: 3, date: '2025-04-01', amount: 50.00, status: 'Pagado' },
                { id: 4, date: '2025-03-01', amount: 50.00, status: 'Pagado' },
            ]
        },
        {
            id: 'dev4', serial: 'SP-DVC-004', model: 'SmartPhone X1', customerId: 'cust3',
            mdmStatus: 'Liberado',
            totalInstallments: 6, currentInstallment: 6,
            nextPaymentDate: null, amountDue: 0.00,
            paymentHistory: [
                { id: 1, date: '2025-04-01', amount: 100.00, status: 'Pagado' },
                { id: 2, date: '2025-03-01', amount: 100.00, status: 'Pagado' },
                { id: 3, date: '2025-02-01', amount: 100.00, status: 'Pagado' },
                { id: 4, date: '2025-01-01', amount: 100.00, status: 'Pagado' },
                { id: 5, date: '2024-12-01', amount: 100.00, status: 'Pagado' },
                { id: 6, date: '2024-11-01', amount: 100.00, status: 'Pagado' },
            ]
        },
    ];

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            const foundDevice = allDummyDevices.find(d => d.id === deviceId);
            if (foundDevice) {
                setDevice(foundDevice);
            } else {
                setError("Dispositivo no encontrado o no asociado a tu cuenta.");
            }
            setLoading(false);
        }, 300);
    }, [deviceId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[calc(100vh-80px)]">
                <p className="text-gray-600">Cargando detalles del dispositivo...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto my-4 max-w-lg" role="alert">
                <strong className="font-bold">¡Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    if (!device) {
        return (
            <div className="bg-white p-6 rounded-lg shadow text-center mx-auto my-8 max-w-md">
                <InformationCircleIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-600">No se pudo cargar el dispositivo. Vuelve a intentar.</p>
                <Link to="/client/dashboard" className="text-indigo-600 hover:underline mt-4 inline-block">Volver al Dashboard</Link>
            </div>
        );
    }

    const getMdmStatusClass = (status) => {
        switch (status) {
            case 'Activo': return 'bg-green-100 text-green-800';
            case 'Bloqueado': return 'bg-red-100 text-red-800';
            case 'Liberado': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <Link
                    to="/client/dashboard"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <ArrowLeftIcon className="-ml-0.5 mr-2 h-4 w-4" />
                    Volver a Mis Dispositivos
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Detalles de {device.model} ({device.serial})</h1>
                <div></div> {/* Spacer */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Información del Dispositivo */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <DeviceTabletIcon className="h-6 w-6 mr-2 text-indigo-600" />
                        Información del Dispositivo
                    </h2>
                    <div className="space-y-3 text-gray-700">
                        <p><strong>Serial:</strong> {device.serial}</p>
                        <p><strong>Modelo:</strong> {device.model}</p>
                        <p><strong>Estado MDM:</strong> <span className={`px-2 py-1 text-sm font-semibold rounded-full ${getMdmStatusClass(device.mdmStatus)}`}>{device.mdmStatus}</span></p>
                        {device.totalInstallments && (
                            <p><strong>Cuotas:</strong> {device.currentInstallment} de {device.totalInstallments}</p>
                        )}
                        <p>
                            <strong>Próximo Pago:</strong> {device.nextPaymentDate ?
                                <span className={new Date(device.nextPaymentDate) < new Date() ? 'text-red-600 font-bold' : 'text-gray-800'}>
                                    {device.nextPaymentDate}
                                </span>
                                : 'No aplica'}
                        </p>
                        <p><strong>Monto Pendiente:</strong> ${device.amountDue ? device.amountDue.toFixed(2) : '0.00'}</p>
                    </div>
                </div>

                {/* Historial de Pagos */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <CreditCardIcon className="h-6 w-6 mr-2 text-green-600" />
                        Historial de Pagos
                    </h2>
                    <div className="overflow-x-auto">
                        {device.paymentHistory && device.paymentHistory.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
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
                                    {device.paymentHistory.map(payment => (
                                        <tr key={payment.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payment.amount.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'Pagado' ? 'bg-green-100 text-green-800' :
                                                        payment.status === 'Atrasado' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center text-gray-500 py-4">No hay historial de pagos disponible para este dispositivo.</p>
                        )}
                    </div>
                    {device.amountDue > 0 && (
                        <div className="mt-6 text-center">
                            <Link
                                to={`/client/make-payment?deviceId=${device.id}&amount=${device.amountDue}`}
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <CreditCardIcon className="h-6 w-6 mr-3" />
                                Realizar Pago Ahora
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientDeviceDetailsView;