import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { InformationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const Step3_DeviceProvisioning = ({ onNext, onBack, initialData, customerId }) => {
    const [qrCodeData, setQrCodeData] = useState('');
    const [deviceProvisioned, setDeviceProvisioned] = useState(false);
    const [loadingProvisioning, setLoadingProvisioning] = useState(false);
    const [deviceDataFromMDM, setDeviceDataFromMDM] = useState(null); 

    const simulationTimeoutRef = useRef(null);


    useEffect(() => {
        const generatedQrData = `smartpay://provision?storeId=YOUR_STORE_ID&configToken=YOUR_MDM_CONFIG_TOKEN&customerId=${customerId}`;
        setQrCodeData(generatedQrData);

        return () => {
            if (simulationTimeoutRef.current) {
                clearTimeout(simulationTimeoutRef.current);
            }
        };
    }, [customerId]);

    const handleStartProvisioning = () => {
        setLoadingProvisioning(true);
        setDeviceProvisioned(false);
        setDeviceDataFromMDM(null);

        simulationTimeoutRef.current = setTimeout(() => {
            const simulatedDeviceData = {
                deviceSerial: `SERIAL-${Math.floor(Math.random() * 100000)}`,
                deviceModel: `MODELO-SMART-${Math.floor(Math.random() * 100)}`,
                imei1: `IMEI1-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
                imei2: `IMEI2-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
                batteryPercentage: Math.floor(Math.random() * (100 - 40 + 1)) + 40,
                lastLocation: {
                    latitude: 3.824792 + (Math.random() * 0.01 - 0.005), 
                    longitude: -76.018335 + (Math.random() * 0.01 - 0.005)
                },
            };
            setDeviceDataFromMDM(simulatedDeviceData);
            setDeviceProvisioned(true);
            setLoadingProvisioning(false);
            alert('¡Dispositivo aprovisionado y datos recibidos!');
        }, 5000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!deviceProvisioned || !deviceDataFromMDM) {
            alert('Por favor, espera a que el dispositivo sea aprovisionado y sus datos sean recibidos.');
            return;
        }
        onNext({ deviceInfo: deviceDataFromMDM });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Aprovisionamiento del Dispositivo</h2>
            <p className="text-gray-600">
                Paso 1: Muestra este código QR al dispositivo a aprovisionar para que se registre en el MDM.
            </p>

            <div className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-md bg-white shadow-sm">
                {qrCodeData ? (
                    <>
                        <QRCodeSVG value={qrCodeData} size={256} level="H" className="mb-4" />
                        <p className="text-sm text-gray-600 break-all text-center">
                            Escanea este QR con el dispositivo.
                        </p>
                        <button
                            type="button"
                            onClick={handleStartProvisioning}
                            disabled={loadingProvisioning || deviceProvisioned}
                            className={`mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white
                                ${loadingProvisioning ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'}`}
                        >
                            {loadingProvisioning ? (
                                <>
                                    <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                                    Aprovisionando...
                                </>
                            ) : deviceProvisioned ? (
                                'Dispositivo Aprovisionado'
                            ) : (
                                'Simular Aprovisionamiento'
                            )}
                        </button>
                    </>
                ) : (
                    <p className="text-gray-500">Generando QR...</p>
                )}
            </div>

            {loadingProvisioning && (
                <div className="flex items-center justify-center p-4 text-blue-600">
                    <ArrowPathIcon className="h-6 w-6 mr-2 animate-spin" />
                    <span>Esperando datos del dispositivo del MDM...</span>
                </div>
            )}

            {deviceProvisioned && deviceDataFromMDM && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
                    <div className="flex items-center">
                        <InformationCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                        <p className="font-bold text-green-800">Dispositivo Aprovisionado y Datos Recibidos:</p>
                    </div>
                    <ul className="mt-2 text-green-700 text-sm">
                        <li><strong>Serial:</strong> {deviceDataFromMDM.deviceSerial}</li>
                        <li><strong>Modelo:</strong> {deviceDataFromMDM.deviceModel}</li>
                        <li><strong>IMEI 1:</strong> {deviceDataFromMDM.imei1}</li>
                        <li><strong>IMEI 2:</strong> {deviceDataFromMDM.imei2 || 'N/A'}</li>
                        <li><strong>Batería:</strong> {deviceDataFromMDM.batteryPercentage}%</li>
                        <li><strong>Última Ubicación:</strong> Lat: {deviceDataFromMDM.lastLocation.latitude.toFixed(4)}, Lon: {deviceDataFromMDM.lastLocation.longitude.toFixed(4)}</li>
                    </ul>
                </div>
            )}

            <div className="flex justify-between pt-4 border-t border-gray-200">
                <button type="button" onClick={onBack}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Anterior
                </button>
                <button type="submit"
                    disabled={!deviceProvisioned}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                        ${deviceProvisioned ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                    Siguiente
                </button>
            </div>
        </form>
    );
};

export default Step3_DeviceProvisioning;