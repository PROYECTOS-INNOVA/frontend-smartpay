import React, { useState, useEffect, useCallback } from 'react';
import { QrCodeIcon, WifiIcon, DevicePhoneMobileIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'react-qr-code';

// Importar tus APIs de enrolamientos
import { createEnrolment, getEnrolmentById } from '../../../api/enrolments'; // Asegúrate de que esta ruta sea correcta

const Step2DeviceProvisioning = ({ onNext, onBack, initialData = {} }) => {
    const [qrGenerated, setQrGenerated] = useState(false);
    const [deviceConnected, setDeviceConnected] = useState(false);
    const [deviceDetails, setDeviceDetails] = useState(initialData.deviceDetails || null);
    const [loading, setLoading] = useState(true);
    const [isPolling, setIsPolling] = useState(false);
    const [qrProvisioningData, setQrProvisioningData] = useState(null);
    const [currentEnrolmentId, setCurrentEnrolmentId] = useState(null);

    // Función para generar el JSON de aprovisionamiento del QR
    const generateAndSetQrProvisioningData = useCallback(() => {
        const generatedId = uuidv4();
        setCurrentEnrolmentId(generatedId);

        const provisioningJson = {
            "package_name": "com.olimpo.smartpay",
            "device_admin_receiver": "com.olimpo.smartpay.receivers.SmartPayDeviceAdminReceiver",
            "apk_url": "https://appincdevs.com/enterprise/smartpay-google.apk",
            "apk_checksum": "KXiBdBNfpJH59esXIqNcpQIW-xxdA5gu1SnKGgQpMrM=",
            "signature_checksum": "KXiBdBNfpJH59esXIqNcpQIW-xxdA5gu1SnKGgQpMrM=",
            "logging_enabled": true,
            "skip_encryption": true,
            "leave_system_apps_enabled": false,
            "locale": "es_ES",
            "enrollment_id": generatedId
        };
        setQrProvisioningData(provisioningJson);
        return generatedId;
    }, []);

    // Función para iniciar el proceso de aprovisionamiento (generar QR y esperar conexión)
    const startProvisioningProcess = useCallback(async () => {
        if (initialData.deviceDetails) {
            setDeviceDetails(initialData.deviceDetails);
            setDeviceConnected(true);
            setQrGenerated(true);
            setCurrentEnrolmentId(initialData.deviceDetails.enrolment_id);
            setLoading(false);
            setIsPolling(false);
            return;
        }

        setLoading(true);
        setQrGenerated(false);
        setDeviceConnected(false);
        setDeviceDetails(null);
        setQrProvisioningData(null);
        setCurrentEnrolmentId(null);
        setIsPolling(false);

        try {
            toast.info('Generando QR y preparando enrolamiento...');
            const newEnrolmentId = generateAndSetQrProvisioningData();

            const enrolmentPayload = {
                enrolment_id: newEnrolmentId,
                user_id: initialData.customer?.user_id,
                vendor_id: initialData.authenticatedUser?.user_id
            };
            console.log('Payload enviado a createEnrolment:', JSON.stringify(enrolmentPayload, null, 2));

            const enrolmentCreationResponse = await createEnrolment(enrolmentPayload);
            console.log("Enrolamiento creado en el backend:", enrolmentCreationResponse);

            setQrGenerated(true);
            setLoading(false); // La carga inicial ha terminado, el QR puede mostrarse
            setIsPolling(true); // Ahora estamos esperando la conexión del dispositivo (polling)

            toast.success('QR generado. Escanee el código con el dispositivo.');
            toast.info('Esperando que el dispositivo establezca conexión...');

            // --- Lógica para esperar la conexión del dispositivo (Polling) ---
            const checkDeviceConnection = async (id) => {
                let connected = false;
                let attempts = 0;
                const maxAttempts = 100; // Aumentado a 100 intentos (300 segundos = 5 minutos)
                const delay = 3000; // Cada 3 segundos

                while (!connected && attempts < maxAttempts) {
                    attempts++;
                    try {
                        const response = await getEnrolmentById(id);
                        if (response && response.device_details) {
                            setDeviceDetails(response.device_details);
                            setDeviceConnected(true);
                            connected = true;
                            toast.success('Dispositivo conectado y datos obtenidos.');
                            break;
                        }
                    } catch (error) {
                        // NO console.error aquí para 404, porque se espera durante el polling.
                        // La lógica para suprimir el log principal debe ir en enrolments.js (ver abajo).
                        if (error.response?.status !== 404) {
                            console.error(`Error no 404 en el intento ${attempts} de polling para ID ${id}:`, error);
                            toast.warn(`Problema en la conexión con el servidor (código ${error.response?.status}). Intento ${attempts}.`);
                        }
                    }
                    if (!connected) {
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }

                if (!connected) {
                    toast.error('Tiempo de espera agotado. El dispositivo no se conectó o no envió sus datos.');
                }
                setIsPolling(false); // El polling ha terminado (éxito o fallo)
            };

            setTimeout(() => checkDeviceConnection(newEnrolmentId), 1000);

        } catch (error) {
            setLoading(false);
            setIsPolling(false);
            console.error('Error durante el aprovisionamiento:', error);
            const errorMessage = error.response?.data?.detail || error.message || "Hubo un error inesperado al iniciar el aprovisionamiento.";
            toast.error(`Error al iniciar aprovisionamiento: ${errorMessage}`);
        }
    }, [generateAndSetQrProvisioningData, initialData]);

    useEffect(() => {
        startProvisioningProcess();
    }, [startProvisioningProcess]);


    const handleSubmit = (e) => {
        e.preventDefault();

        if (deviceDetails) {
            onNext({ device: deviceDetails });
        } else {
            toast.error('Por favor, conecta y obtén los datos del dispositivo para continuar.');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Paso 2: Aprovisionamiento de Dispositivo</h2>

            <div className="bg-gray-50 p-6 rounded-lg shadow-inner text-center">
                {loading && (
                    <div className="text-center p-4">
                        <ArrowPathIcon className="mx-auto h-24 w-24 text-blue-600 animate-spin" />
                        <p className="mt-4 text-lg font-medium text-blue-700">Iniciando aprovisionamiento y generando QR...</p>
                        <p className="text-sm text-gray-500">
                            Esto puede tomar unos segundos.
                        </p>
                    </div>
                )}

                {/* Sección para mostrar el QR mientras se espera la conexión */}
                {!loading && qrGenerated && !deviceConnected && qrProvisioningData && isPolling && (
                    <div className="text-center p-4">
                        <p className="mt-4 text-lg font-medium text-gray-700">Escanea el siguiente QR para aprovisionar el dispositivo:</p>
                        <div className="mt-4 flex justify-center">
                            <QRCode
                                value={JSON.stringify(qrProvisioningData)}
                                size={256}
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-4">
                            ID de Enrolamiento para este QR: <strong className="text-blue-600">{currentEnrolmentId}</strong>
                        </p>
                        <p className="mt-2 text-blue-500">
                            <WifiIcon className="inline-block h-5 w-5 mr-1 animate-pulse" />
                            Esperando conexión del dispositivo...
                        </p>
                    </div>
                )}

                {/* Mensaje si el polling terminó sin conexión */}
                {!loading && qrGenerated && !deviceConnected && !isPolling && (
                    <div className="text-center p-4 text-red-600">
                        <QrCodeIcon className="mx-auto h-24 w-24 text-red-400" />
                        <p className="mt-4 text-lg font-medium">No se detectó el dispositivo.</p>
                        <p className="text-sm">El tiempo de espera para el aprovisionamiento ha terminado. Por favor, intenta de nuevo o verifica la conexión del dispositivo.</p>
                        <button
                            onClick={startProvisioningProcess}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <ArrowPathIcon className="-ml-0.5 mr-2 h-5 w-5" />
                            Reintentar Aprovisionamiento
                        </button>
                    </div>
                )}


                {/* Detalles del dispositivo conectado */}
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
                    disabled={!deviceDetails || loading || isPolling}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${(!deviceDetails || loading || isPolling) ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                    Siguiente Paso
                    <ChevronRightIcon className="-mr-0.5 ml-2 h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default Step2DeviceProvisioning;