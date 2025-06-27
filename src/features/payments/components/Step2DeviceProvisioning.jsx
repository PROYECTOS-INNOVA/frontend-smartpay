// src/pages/payments/components/Step2DeviceProvisioning.jsx
import React, { useState, useEffect } from 'react';
import { QrCodeIcon, WifiIcon, DevicePhoneMobileIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const Step2DeviceProvisioning = ({ onNext, onBack, initialData = {} }) => {
    const [qrGenerated, setQrGenerated] = useState(false);
    const [deviceConnected, setDeviceConnected] = useState(false);
    const [deviceDetails, setDeviceDetails] = useState(initialData.deviceDetails || null);
    const [loading, setLoading] = useState(false);

    // useEffect para pre-rellenar el formulario si hay datos iniciales
    useEffect(() => {
        if (initialData.deviceDetails) {
            setDeviceDetails(initialData.deviceDetails);
            setDeviceConnected(true); // Asume que si hay detalles, ya está conectado
            setQrGenerated(true); // Y el QR fue generado
        }
    }, [initialData]);

    const handleSimulateQrAndConnection = () => {
        setLoading(true);
        setQrGenerated(true);
        setDeviceConnected(false);
        setDeviceDetails(null);

        toast.info('Simulando generación de QR...');

        setTimeout(() => {
            toast.info('QR generado. Esperando conexión del dispositivo...');

            setTimeout(() => {
                const simulatedEnrolmentId = uuidv4();

                const dummyMobileDeviceData = {
                    enrolment_id: simulatedEnrolmentId,
                    name: "Samsung Galaxy S24 Ultra",
                    imei: "351234567890123",
                    imei_two: "359876543210987",
                    serial_number: "R58T9ABCDEF" + Math.floor(Math.random() * 1000),
                    model: "SM-S928B",
                    brand: "Samsung",
                    product_name: "Galaxy S24 Ultra (512GB Phantom Black)",
                    state: "Active",
                    // price_usd: '' // <--- Eliminado de aquí
                };
                setDeviceDetails(dummyMobileDeviceData);
                setDeviceConnected(true);
                setLoading(false);
                toast.success('Dispositivo conectado y datos obtenidos.');
            }, 3000);
        }, 1500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (deviceDetails) {
            onNext({ device: deviceDetails }); // Solo pasamos deviceDetails, ahora como 'device'
        } else {
            toast.error('Por favor, conecta y obtén los datos del dispositivo para continuar.');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Paso 2: Aprovisionamiento de Dispositivo</h2>

            <div className="bg-gray-50 p-6 rounded-lg shadow-inner text-center">
                {!qrGenerated && (
                    <button
                        onClick={handleSimulateQrAndConnection}
                        disabled={loading}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {loading ? (
                            <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
                        ) : (
                            <QrCodeIcon className="-ml-1 mr-3 h-5 w-5" />
                        )}
                        {loading ? 'Generando QR y esperando...' : 'Generar QR para Aprovisionamiento'}
                    </button>
                )}

                {qrGenerated && !deviceConnected && !loading && (
                    <div className="text-center p-4">
                        <QrCodeIcon className="mx-auto h-24 w-24 text-gray-400 animate-pulse" />
                        <p className="mt-4 text-lg font-medium text-gray-700">QR Simulado Generado.</p>
                        <p className="text-sm text-gray-500">Esperando que el dispositivo establezca conexión...</p>
                        <p className="mt-2 text-blue-500">
                            <WifiIcon className="inline-block h-5 w-5 mr-1" />
                            Simulando conexión...
                        </p>
                    </div>
                )}

                {loading && (
                    <div className="text-center p-4">
                        <ArrowPathIcon className="mx-auto h-24 w-24 text-blue-600 animate-spin" />
                        <p className="mt-4 text-lg font-medium text-blue-700">Procesando...</p>
                        <p className="text-sm text-gray-500">
                            Esto puede tomar unos segundos.
                        </p>
                    </div>
                )}

                {deviceConnected && deviceDetails && (
                    <div className="mt-8 bg-green-50 border-l-4 border-green-400 p-4 shadow-md">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-medium text-green-800">Dispositivo Conectado y Datos Recibidos</h3>
                            </div>
                        </div>
                        <div className="mt-4 text-left text-sm text-green-700 space-y-1">
                            <p><strong>ID de Enrolamiento:</strong> {deviceDetails.enrolment_id}</p>
                            <p><strong>Nombre Comercial:</strong> {deviceDetails.product_name}</p>
                            <p><strong>Marca:</strong> {deviceDetails.brand}</p>
                            <p><strong>Modelo Técnico:</strong> {deviceDetails.model}</p>
                            <p><strong>Número de Serie:</strong> {deviceDetails.serial_number}</p>
                            <p><strong>IMEI (Principal):</strong> {deviceDetails.imei}</p>
                            {deviceDetails.imei_two && <p><strong>IMEI (Secundario):</strong> {deviceDetails.imei_two}</p>}
                            <p><strong>Estado:</strong> {deviceDetails.state}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* <--- Sección de valor del dispositivo ELIMINADA de aquí */}

            <div className="flex justify-between gap-3 mt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <ChevronLeftIcon className="-ml-0.5 mr-2 h-5 w-5" />
                    Anterior
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!deviceDetails || loading} // Eliminado valueError de la condición de disabled
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${(!deviceDetails || loading) ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                    Siguiente Paso
                    <ChevronRightIcon className="-mr-0.5 ml-2 h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default Step2DeviceProvisioning;