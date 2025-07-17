import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../common/context/AuthProvider';
import { DeviceTabletIcon, CreditCardIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const ClientDashboardPage = () => {
    const { user } = useAuth();
    const [customerDevices, setCustomerDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const allDummyDevices = [
        {
            id: 'dev1', serial: 'SP-DVC-001', model: 'SmartTab M1', customerId: 'cust1',
            mdmStatus: 'Activo', 
            totalInstallments: 12, currentInstallment: 7,
            nextPaymentDate: '2025-06-15', amountDue: 50.00,
            lastPaymentDate: '2025-05-15', lastPaymentAmount: 50.00
        },
        {
            id: 'dev2', serial: 'SP-DVC-002', model: 'SmartPhone X1', customerId: 'cust2',
            mdmStatus: 'Bloqueado',
            totalInstallments: 18, currentInstallment: 3,
            nextPaymentDate: '2025-06-01', amountDue: 50.00,
            lastPaymentDate: '2025-05-01', lastPaymentAmount: 50.00
        },
        {
            id: 'dev3', serial: 'SP-DVC-003', model: 'SmartTab M1', customerId: 'cust1',
            mdmStatus: 'Activo',
            totalInstallments: 12, currentInstallment: 10,
            nextPaymentDate: '2025-07-01', amountDue: 50.00,
            lastPaymentDate: '2025-06-01', lastPaymentAmount: 50.00
        },
        {
            id: 'dev4', serial: 'SP-DVC-004', model: 'SmartPhone X1', customerId: 'cust3',
            mdmStatus: 'Liberado',
            totalInstallments: 6, currentInstallment: 6,
            nextPaymentDate: null, amountDue: 0.00,
            lastPaymentDate: '2025-04-01', lastPaymentAmount: 100.00
        },
    ];

    useEffect(() => {
        setLoading(true);
        setError(null);
        console.log('DATA USER: ', user);
        
        setTimeout(() => {
            const currentCustomerId = user?.user_id;
            if (currentCustomerId) {
                const filtered = allDummyDevices.filter(device => device.customerId === currentCustomerId);
                setCustomerDevices(filtered);
            } else {
                setError("No se pudo obtener el ID del cliente. Asegúrate de estar logueado.");
                setCustomerDevices([]);
            }
            setLoading(false);
        }, 500);
    }, [user?.id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[calc(100vh-80px)]">
                <p className="text-gray-600">Cargando tus dispositivos...</p>
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

    if (customerDevices.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow text-center mx-auto my-8 max-w-md">
                <InformationCircleIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">No tienes dispositivos asociados.</h2>
                <p className="text-gray-600">Por favor, contacta al soporte de SmartPay si crees que esto es un error.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Dispositivos SmartPay</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customerDevices.map(device => (
                    <div key={device.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">{device.model}</h2>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${device.mdmStatus === 'Activo' ? 'bg-green-100 text-green-800' :
                                    device.mdmStatus === 'Bloqueado' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                }`}>
                                {device.mdmStatus}
                            </span>
                        </div>
                        <div className="space-y-2 text-gray-700 mb-4">
                            <p><strong>Serial:</strong> {device.serial}</p>
                            {device.totalInstallments && (
                                <p><strong>Cuotas:</strong> {device.currentInstallment}/{device.totalInstallments}</p>
                            )}
                            <p>
                                <strong>Próximo Pago:</strong> {device.nextPaymentDate ?
                                    <span className={new Date(device.nextPaymentDate) < new Date() ? 'text-red-600 font-bold' : 'text-gray-800'}>
                                        {device.nextPaymentDate}
                                    </span>
                                    : 'No aplica'}
                            </p>
                            <p>
                                <strong>Monto Adeudado:</strong> {device.amountDue > 0 ?
                                    <span className="text-red-600 font-bold">${device.amountDue.toFixed(2)}</span>
                                    : '$0.00'}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                to={`/client/devices/${device.id}`}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <DeviceTabletIcon className="h-5 w-5 mr-2" />
                                Ver Detalles
                            </Link>
                            {device.amountDue > 0 && (
                                <Link
                                    to={`/client/make-payment?deviceId=${device.id}&amount=${device.amountDue}`}
                                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <CreditCardIcon className="h-5 w-5 mr-2" />
                                    Realizar Pago
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClientDashboardPage;