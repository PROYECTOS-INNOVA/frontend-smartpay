import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ClientMakePaymentPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const deviceId = queryParams.get('deviceId');
    const initialAmount = queryParams.get('amount');

    const [amount, setAmount] = useState(initialAmount || '');
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [deviceSerial, setDeviceSerial] = useState('');

    const allDummyDevices = [
        { id: 'dev1', serial: 'SP-DVC-001' },
        { id: 'dev2', serial: 'SP-DVC-002' },
        { id: 'dev3', serial: 'SP-DVC-003' },
        { id: 'dev4', serial: 'SP-DVC-004' },
    ];

    useEffect(() => {
        if (deviceId) {
            const foundDevice = allDummyDevices.find(d => d.id === deviceId);
            if (foundDevice) {
                setDeviceSerial(foundDevice.serial);
            }
        }
    }, [deviceId]);

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setPaymentProcessing(true);
        setPaymentSuccess(false);


        setTimeout(() => {
            if (parseFloat(amount) > 0) {
                setPaymentSuccess(true);
            } else {
                setError("El monto del pago debe ser mayor a cero.");
            }
            setPaymentProcessing(false);
        }, 2000);
    };

    if (paymentSuccess) {
        return (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full">
                    <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Pago Exitoso!</h2>
                    <p className="text-gray-700 mb-6">Tu pago de **${parseFloat(amount).toFixed(2)}** para el dispositivo **{deviceSerial || deviceId}** ha sido procesado correctamente.</p>
                    <Link
                        to="/client/dashboard"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Volver a Mis Dispositivos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <Link
                    to={deviceId ? `/client/devices/${deviceId}` : "/client/dashboard"}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <ArrowLeftIcon className="-ml-0.5 mr-2 h-4 w-4" />
                    Volver
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Realizar Pago</h1>
                <div></div> {/* Spacer */}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                <p className="text-lg text-gray-700 mb-4">
                    Estás a punto de realizar un pago para el dispositivo: <strong className="text-indigo-600">{deviceSerial || deviceId}</strong>
                </p>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Monto a Pagar</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            min="0.01"
                            step="0.01"
                            disabled={paymentProcessing}
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={paymentProcessing}
                        className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {paymentProcessing ? 'Procesando Pago...' : 'Confirmar Pago'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ClientMakePaymentPage;