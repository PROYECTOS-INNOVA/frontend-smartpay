// src/pages/payments/components/Step2DeviceProvisioning.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QrCodeIcon, WifiIcon, DevicePhoneMobileIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'react-qr-code';

import { createEnrolment, getDeviceByEnrolmentId } from '../../../api/enrolments';

const Step2DeviceProvisioning = ({ onNext, onBack, initialData = {} }) => {
  const [qrGenerated, setQrGenerated] = useState(false);
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [deviceDetails, setDeviceDetails] = useState(initialData.device || null);
  const [loading, setLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [qrProvisioningData, setQrProvisioningData] = useState(null);
  const [currentEnrolmentId, setCurrentEnrolmentId] = useState(null);
  const hasStartedProvisioning = useRef(false);
  const API_GATEWAY_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

  const [simulateDummyDevice, setSimulateDummyDevice] = useState(false);

const generateProvisioningJson = (enrolmentId) => ({
    "android.app.extra.PROVISIONING_DEVICE_ADMIN_COMPONENT_NAME": "com.olimpo.smartpay/com.olimpo.smartpay.receivers.SmartPayDeviceAdminReceiver",
    "android.app.extra.PROVISIONING_DEVICE_ADMIN_SIGNATURE_CHECKSUM": "JfkRLA-Lae1o0gGrvVUGi0M34pYu3eLFlgY-UHdsXbs=",
    "android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_DOWNLOAD_LOCATION": "https://appincdevs.com/enterprise/smartpay-google.apk",
    "android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_CHECKSUM": "JfkRLA-Lae1o0gGrvVUGi0M34pYu3eLFlgY-UHdsXbs=",
    "android.app.extra.PROVISIONING_LEAVE_ALL_SYSTEM_APPS_ENABLED": true,
    "android.app.extra.PROVISIONING_LOCALE": "es_ES",
    "android.app.extra.PROVISIONING_ADMIN_EXTRAS_BUNDLE": {
      "ENROLLMENT_ID": enrolmentId,
      "BASE_URL": API_GATEWAY_URL
    }
  });

  const startProvisioningProcess = useCallback(async () => {
    if (initialData.device) {
      setDeviceDetails(initialData.device);
      setDeviceConnected(true);
      setQrGenerated(true);
      setCurrentEnrolmentId(initialData.device.enrolment_id);
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

    if (simulateDummyDevice) {
      toast.info('Simulando aprovisionamiento de dispositivo dummy...');
      const timer = setTimeout(() => {
        const dummyDeviceId = 'c49b53bc-d948-462b-bfa4-c76220228e2f';
        const dummyEnrolmentId = initialData.customer?.user_id ? `ENR-${initialData.customer.user_id.substring(0, 8)}-${Date.now()}` : `ENR-${uuidv4().substring(0, 8)}-${Date.now()}`;

        const dummyDevice = {
          device_id: dummyDeviceId,
          enrolment_id: dummyEnrolmentId,
          product_name: "SmartPOS T-800 Simulada",
          brand: "OlimpoTech Sim.",
          model: "T800-SP-PRO-Sim",
          serial_number: `SN-${Date.now().toString().slice(-8)}`,
          imei: `IMEI-${Math.floor(Math.random() * 1000000000000000)}`,
          imei_two: `IMEI2-${Math.floor(Math.random() * 1000000000000000)}`,
          state: "Activo",
        };

        setDeviceDetails(dummyDevice);
        setDeviceConnected(true);
        setLoading(false);
        // Aseguramos que isPolling se establezca a false cuando la simulación termina
        setIsPolling(false);
        toast.success('Dispositivo dummy aprovisionado y listo para continuar.');
      }, 1500);

      return () => clearTimeout(timer);
    }

    try {
      toast.info('Generando QR y preparando enrolamiento...');

      const enrolmentPayload = {
        user_id: initialData.customer?.user_id,
        vendor_id: initialData.authenticatedUser?.user_id
      };

      console.log('Payload enviado a createEnrolment:', enrolmentPayload);
      const enrolmentCreationResponse = await createEnrolment(enrolmentPayload);

      const enrollmentId = enrolmentCreationResponse?.enrolment_id;
      console.log('Aqui EnrollmentId:', enrollmentId);
      setCurrentEnrolmentId(enrollmentId);

      const provisioningJson = generateProvisioningJson(enrollmentId);
      setQrProvisioningData(provisioningJson);

      setQrGenerated(true);
      setLoading(false);
      setIsPolling(true);
      toast.success('QR generado. Escanea el código con el dispositivo.');
      toast.info('Esperando que el dispositivo establezca conexión...');

      const checkDeviceConnection = async (enrollmentId) => {
        let connected = false;
        let attempts = 0;
        const maxAttempts = 100;
        const delay = 3000;

        while (!connected && attempts < maxAttempts) {
          attempts++;
          try {
            console.log('x2 EnrollmentId:', enrollmentId);
            const response = await getDeviceByEnrolmentId(enrollmentId);
            console.log("Response step2", response);
            if (response) {
              setDeviceDetails(response);
              setDeviceConnected(true);
              toast.success('Dispositivo conectado y datos obtenidos.');
              connected = true;
              break;
            }
          } catch (error) {
            if (error.response?.status !== 404) {
              console.error(`Error en polling:`, error);
              toast.warn(`Error del servidor (código ${error.response?.status}). Intento ${attempts}.`);
            }
          }
          if (!connected) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }

        if (!connected) {
          toast.error('Tiempo de espera agotado. El dispositivo no se conectó.');
        }
        setIsPolling(false);
      };

      setTimeout(() => checkDeviceConnection(enrollmentId), 1000);

    } catch (error) {
      console.error('Error durante el aprovisionamiento:', error);
      setLoading(false);
      setIsPolling(false);
      const msg = error.response?.data?.detail || error.message || "Hubo un error inesperado.";
      toast.error(`Error al iniciar aprovisionamiento: ${msg}`);
    }
  }, [initialData, simulateDummyDevice]);

  useEffect(() => {
    if (!initialData.device && !hasStartedProvisioning.current) {
      hasStartedProvisioning.current = true;
      startProvisioningProcess();
    } else if (initialData.device) {
      setDeviceDetails(initialData.device);
      setDeviceConnected(true);
      setLoading(false);
    }
  }, [startProvisioningProcess, initialData.device]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (deviceDetails) {
      onNext({ device: deviceDetails });
    } else {
      toast.error(simulateDummyDevice ? 'Esperando que la simulación finalice.' : 'Conecta el dispositivo para continuar.');
    }
  };

  const handleRetryProvisioning = () => {
    hasStartedProvisioning.current = false;
    setDeviceDetails(null);
    setDeviceConnected(false);
    setQrGenerated(false);
    setQrProvisioningData(null);
    setCurrentEnrolmentId(null);
    setLoading(true);
    setIsPolling(false);
    startProvisioningProcess();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Paso 2: Aprovisionamiento de Dispositivo</h2>

      <div className="flex items-center justify-end mb-4">
        <span className="mr-3 text-sm font-medium text-gray-900">Modo de Simulación Dummy</span>
        <label htmlFor="toggle-dummy" className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="toggle-dummy"
            className="sr-only peer"
            checked={simulateDummyDevice}
            onChange={(e) => {
              setSimulateDummyDevice(e.target.checked);
              handleRetryProvisioning();
            }}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-inner text-center">
        {loading && (
          <div className="text-center p-4">
            <ArrowPathIcon className="mx-auto h-24 w-24 text-blue-600 animate-spin" />
            <p className="mt-4 text-lg font-medium text-blue-700">
              {simulateDummyDevice ? 'Simulando aprovisionamiento...' : 'Iniciando aprovisionamiento...'}
            </p>
            <p className="text-sm text-gray-500">Esto puede tomar unos segundos.</p>
          </div>
        )}

        {!loading && qrGenerated && !deviceConnected && qrProvisioningData && isPolling && !simulateDummyDevice && (
          <div className="text-center p-4">
            <p className="text-lg font-medium text-gray-700">Escanea el siguiente QR:</p>
            <div className="mt-4 flex justify-center">
              <QRCode value={JSON.stringify(qrProvisioningData)} size={256} />
            </div>
            <p className="text-sm text-gray-500 mt-4">
              ID de Enrolamiento: <strong className="text-blue-600">{currentEnrolmentId}</strong>
            </p>
            <p className="mt-2 text-blue-500">
              <WifiIcon className="inline-block h-5 w-5 mr-1 animate-pulse" />
              Esperando conexión...
            </p>
          </div>
        )}

        {!loading && qrGenerated && !deviceConnected && !isPolling && !simulateDummyDevice && (
          <div className="text-center p-4 text-red-600">
            <QrCodeIcon className="mx-auto h-24 w-24 text-red-400" />
            <p className="mt-4 text-lg font-medium">Dispositivo no detectado.</p>
            <p className="text-sm">El tiempo de espera ha expirado. Intenta nuevamente.</p>
            <button
              onClick={handleRetryProvisioning}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowPathIcon className="-ml-0.5 mr-2 h-5 w-5" />
              Reintentar
            </button>
          </div>
        )}

        {deviceConnected && deviceDetails && (
          <div className="mt-8 bg-green-50 border-l-4 border-green-400 p-4 shadow-md text-left">
            <div className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
              <h3 className="ml-3 text-lg font-medium text-green-800">Dispositivo Conectado</h3>
            </div>
            <div className="mt-4 text-sm text-green-700 space-y-1">
              <p><strong>ID de Dispositivo:</strong> {deviceDetails.device_id}</p>
              <p><strong>ID de Enrolamiento:</strong> {deviceDetails.enrolment_id}</p>
              <p><strong>Nombre Comercial:</strong> {deviceDetails.product_name}</p>
              <p><strong>Marca:</strong> {deviceDetails.brand}</p>
              <p><strong>Modelo Técnico:</strong> {deviceDetails.model}</p>
              <p><strong>Número de Serie:</strong> {deviceDetails.serial_number}</p>
              <p><strong>IMEI (Principal):</strong> {deviceDetails.imei}</p>
              {deviceDetails.imei_two && <p><strong>IMEI (Secundario):</strong> {deviceDetails.imei_two}</p>}
              <p><strong>Estado:</strong> {deviceDetails.state}</p>
              <p><strong>Precio del Dispositivo:</strong> {deviceDetails.currency} {deviceDetails.price_usd?.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between gap-3 mt-6">
        <button onClick={onBack} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <ChevronLeftIcon className="-ml-0.5 mr-2 h-5 w-5" />
          Anterior
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          // MODIFICACIÓN CLAVE AQUÍ:
          // Ahora el botón estará deshabilitado si aún está cargando O si está en modo polling Y NO es un dummy device.
          // En modo dummy, queremos que se habilite una vez `loading` es `false` y `deviceDetails` está presente.
          disabled={!deviceDetails || loading || (isPolling && !simulateDummyDevice)}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${(!deviceDetails || loading || (isPolling && !simulateDummyDevice)) ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          Siguiente Paso
          <ChevronRightIcon className="-mr-0.5 ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Step2DeviceProvisioning;