// src/pages/devices/DeviceManagementPage.jsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import DeviceTable from './components/DeviceTable';
import DeviceDetailsView from './views/DeviceDetailsView';

// Datos dummy de clientes y vendedores para vincularlos a los dispositivos
const dummyCustomers = [
    { id: 'cust1', name: 'Juan Pérez' },
    { id: 'cust2', name: 'María García' },
    { id: 'cust3', name: 'Carlos López' },
];

const dummyVendors = [
    { id: 'vend1', name: 'Vendedor A' },
    { id: 'vend2', name: 'Vendedor B' },
];

// Datos dummy iniciales de dispositivos
const initialDevices = [
    {
        id: uuidv4(),
        serial: 'SP-DVC-001',
        model: 'SmartTab M1',
        imei1: '123456789012345',
        imei2: '543210987654321',
        customerId: 'cust1',
        customerName: 'Juan Pérez',
        vendorId: 'vend1',
        vendorName: 'Vendedor A',
        mdmStatus: 'Activo', // Activo, Bloqueado, Liberado
        batteryPercentage: 75,
        lastLocation: { latitude: 3.824792, longitude: -76.018335 }, // Pitalito, Huila
        // ... otros datos del dispositivo según tu BD
    },
    {
        id: uuidv4(),
        serial: 'SP-DVC-002',
        model: 'SmartPhone X1',
        imei1: '987654321098765',
        imei2: '102938475610293',
        customerId: 'cust2',
        customerName: 'María García',
        vendorId: 'vend1',
        vendorName: 'Vendedor A',
        mdmStatus: 'Bloqueado',
        batteryPercentage: 30,
        lastLocation: { latitude: 3.829000, longitude: -76.025000 }, // Cerca de Pitalito
        // ...
    },
    {
        id: uuidv4(),
        serial: 'SP-DVC-003',
        model: 'SmartTab M1',
        imei1: '112233445566778',
        imei2: null,
        customerId: 'cust3',
        customerName: 'Carlos López',
        vendorId: 'vend2',
        vendorName: 'Vendedor B',
        mdmStatus: 'Liberado',
        batteryPercentage: 90,
        lastLocation: { latitude: 3.815000, longitude: -76.010000 }, // Cerca de Pitalito
        // ...
    },
    {
        id: uuidv4(),
        serial: 'SP-DVC-004',
        model: 'SmartPhone X1',
        imei1: '223344556677889',
        imei2: null,
        customerId: 'cust1',
        customerName: 'Juan Pérez',
        vendorId: 'vend2',
        vendorName: 'Vendedor B',
        mdmStatus: 'Activo',
        batteryPercentage: 60,
        lastLocation: null, // Sin ubicación reportada
        // ...
    },
];

const DeviceManagementPage = () => {
    const [devices, setDevices] = useState(initialDevices);
    const [selectedDevice, setSelectedDevice] = useState(null); // Dispositivo seleccionado para detalles

    const handleViewDetails = (device) => {
        setSelectedDevice(device);
    };

    const handleBackToList = () => {
        setSelectedDevice(null);
    };

    // Funciones de acciones MDM (simuladas)
    const handleBlockDevice = (deviceId) => {
        setDevices(prevDevices =>
            prevDevices.map(device =>
                device.id === deviceId ? { ...device, mdmStatus: 'Bloqueado' } : device
            )
        );
        alert(`Dispositivo ${deviceId} BLOQUEADO (simulado).`);
    };

    const handleUnblockDevice = (deviceId) => {
        setDevices(prevDevices =>
            prevDevices.map(device =>
                device.id === deviceId ? { ...device, mdmStatus: 'Activo' } : device
            )
        );
        alert(`Dispositivo ${deviceId} DESBLOQUEADO (simulado).`);
    };

    const handleLocateDevice = (deviceId) => {
        // En una aplicación real, esto activaría una petición al MDM
        // para obtener la ubicación más reciente del dispositivo y actualizarla en el estado.
        // Aquí simulamos una ubicación nueva
        setDevices(prevDevices =>
            prevDevices.map(device =>
                device.id === deviceId ? {
                    ...device,
                    lastLocation: {
                        latitude: 3.824792 + (Math.random() * 0.02 - 0.01), // Pequeña variación
                        longitude: -76.018335 + (Math.random() * 0.02 - 0.01)
                    }
                } : device
            )
        );
        alert(`Solicitud de localización para ${deviceId} enviada (simulada). La ubicación se actualizará.`);
    };

    const handleReleaseDevice = (deviceId) => {
        setDevices(prevDevices =>
            prevDevices.map(device =>
                device.id === deviceId ? { ...device, mdmStatus: 'Liberado' } : device
            )
        );
        alert(`Dispositivo ${deviceId} LIBERADO del MDM (simulado).`);
    };

    const handleMakePayment = (deviceId) => {
        alert(`Proceso de pago iniciado para el dispositivo ${deviceId} (simulado).`);
        // Aquí podrías redirigir a una página de pagos o abrir un modal de pago
    };


    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Dispositivos</h1>

            {selectedDevice ? (
                <DeviceDetailsView
                    device={selectedDevice}
                    onBackToList={handleBackToList}
                    onBlock={handleBlockDevice}
                    onUnblock={handleUnblockDevice}
                    onLocate={handleLocateDevice}
                    onRelease={handleReleaseDevice}
                    onMakePayment={handleMakePayment}
                />
            ) : (
                <DeviceTable
                    devices={devices}
                    onViewDetails={handleViewDetails}
                />
            )}
        </div>
    );
};

export default DeviceManagementPage;