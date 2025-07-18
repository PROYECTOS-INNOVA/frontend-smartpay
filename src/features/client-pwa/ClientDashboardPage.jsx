import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../common/context/AuthProvider';
import { DeviceTabletIcon, CreditCardIcon, InformationCircleIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { getPlans } from '../../api/plans';
import { getMdmStatusClass } from './utils/shared-functions';

const ClientDashboardPage = () => {
    const { user, logout } = useAuth();
    const [customerDevices, setCustomerDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        setTimeout(() => {
            const currentCustomerId = user?.user_id;
            if (currentCustomerId) {
                // const filtered = allDummyDevices.filter(device => device.customerId === currentCustomerId);
                /** Cargar dispositivos del cliente */
                getPlantsInit();
            } else {
                setError("No se pudo obtener el ID del cliente. Asegúrate de estar logueado.");
                setCustomerDevices([]);
            }
        }, 500);
    }, []);

    /**
     * Función para obtener planes y sus dispositivos asociados.
     */
    const getPlantsInit = async () => {
        const data = await getPlans({ user_id: user.user_id })
        setCustomerDevices(data);
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[calc(100vh-80px)]">
                <p className="text-gray-600">Cargando tus dispositivos...</p>
            </div>
        );
    } else if (customerDevices.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow text-center mx-auto my-8 max-w-md">
                <InformationCircleIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">No tienes dispositivos asociados.</h2>
                <p className="text-gray-600">Por favor, contacta al soporte de SmartPay si crees que esto es un error.</p>
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

    return (
        <div className="bg-gradient-to-br from-white to-gray-100 min-h-screen">
            {/* Navbar */}
            {/* Encabezado normal para desktop */}
            <div className="flex justify-between items-center p-4 sm:p-6 lg:px-8 border-b border-gray-300 bg-white shadow-sm sticky top-0 z-10">
                <div className="flex gap-3 items-center">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-800">
                        <span className="text-indigo-600">SmartPay</span> &nbsp;| Mis Dispositivos
                    </h1>
                </div>

                {/* Visible solo en pantallas sm o más grandes */}
                <button
                    className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow transition duration-150 ease-in-out"
                    onClick={() => logout()}
                >
                    Cerrar sesión
                </button>
            </div>

            {/* Botón flotante solo visible en móviles */}
            <button
                className="sm:hidden fixed bottom-4 right-4 z-50 w-14 h-14 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition duration-200 ease-in-out"
                onClick={() => logout()}
                title="Cerrar sesión"
            >
                <ArrowLeftStartOnRectangleIcon className="h-7 w-7" />
            </button>


            {/* Dispositivos */}
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customerDevices.map((device) => (
                        <div
                            key={device.device.device_id}
                            className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">{device.device.model}</h2>
                                <span
                                    className={`px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wide ${getMdmStatusClass(
                                        device.device.state
                                    )}`}
                                >
                                    {device.device.state}
                                </span>
                            </div>

                            <div className="text-sm text-gray-700 space-y-1 border-t border-b py-4">
                                <div className="flex justify-between">
                                    <span className="font-medium">Serial:</span>
                                    <span>{device.device.serial_number}</span>
                                </div>
                                {device.period && (
                                    <div className="flex justify-between">
                                        <span className="font-medium">Cuotas:</span>
                                        <span>
                                            {device.quotas}/{device.period}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="font-medium">Próximo Pago:</span>
                                    {device.initial_date ? (
                                        <span
                                            className={`font-semibold ${new Date(device.initial_date) < new Date()
                                                ? 'text-red-600'
                                                : 'text-green-600'
                                                }`}
                                        >
                                            {device.initial_date}
                                        </span>
                                    ) : (
                                        <span>No aplica</span>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Monto Adeudado:</span>
                                    {Number(device.value) > 0 ? (
                                        <span className="text-red-600 font-bold">
                                            {Number(device.value).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </span>
                                    ) : (
                                        <span>0.00</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                <Link
                                    to={`/client/devices/${device.plan_id}`}
                                    state={{ plan: device }}
                                    className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow"
                                >
                                    <DeviceTabletIcon className="h-5 w-5 mr-2" />
                                    Ver Detalles
                                </Link>
                                {device.value > 0 && (
                                    <Link
                                        to={`/client/make-payment/${device.plan_id}`}
                                        state={{ plan: device }}
                                        className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-blue-300 shadow"
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
        </div>

    );
};

export default ClientDashboardPage;