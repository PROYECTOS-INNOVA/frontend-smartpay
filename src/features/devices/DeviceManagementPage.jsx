import React, { useState, useEffect } from 'react';
import { getDevices, getDeviceById, getLastLocation, getActionsHistory, getSims, updateDevice, blockDevice, unblockDevice, locateDevice, releaseDevice } from '../../api/devices'; // Remove approveDeviceSim, removeDeviceSim
import DeviceTable from './components/DeviceTable';
import DeviceDetailsView from './views/DeviceDetailsView';

// Importaciones de react-toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { last } from 'lodash';

const DeviceManagementPage = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [lastLocation, setLastLocation] = useState(null);
    const [sims, setSims] = useState(null);
    const [actionsHistory, setActionsHistory] = useState([]);
    const [isPolling, setIsPolling] = useState(false);

    const [columnFilters, setColumnFilters] = useState({
        name: '',
        serial_number: '',
        model: '',
        brand: '',
        imei: '',
        state: '',
    });

    const userRole = 'superadmin';

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDevices();
            setDevices(data);
        } catch (err) {
            console.error('Error al cargar dispositivos:', err);
            setError('Error al cargar dispositivos. Por favor, inténtalo de nuevo.');
            toast.error('Error al cargar dispositivos.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (deviceId) => {
        setLoading(true);
        try {
            const deviceDetails = await getDeviceById(deviceId);
            const lastLocation = await getLastLocation(deviceId);
            const actions = await getActionsHistory(deviceId);
            const simsResponse = await getSims(deviceId);

            if (Array.isArray(actions) && actions.length > 0) {
                const sortedActions = [...actions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setActionsHistory(sortedActions);
            }

            setSelectedDevice(deviceDetails);
            setLastLocation(lastLocation);
            setSims(simsResponse);
        } catch (err) {
            console.error('Error al cargar detalles del dispositivo:', err);
            setError('Error al cargar los detalles del dispositivo.');
            toast.error('Error al cargar los detalles del dispositivo.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToList = () => {
        setSelectedDevice(null);
        fetchDevices(); 
    };

    const handleUpdateDevice = async (deviceId, updatedData) => {
        try {
            const updatedDeviceResponse = await updateDevice(deviceId, updatedData);
            setSelectedDevice(updatedDeviceResponse);
            fetchDevices(); 
            toast.success('Dispositivo actualizado correctamente.');
        } catch (err) {
            console.error('Error al actualizar dispositivo:', err);
            const errorMessage = err.response?.data?.detail || err.message || 'Error desconocido';
            toast.error(`Error al actualizar dispositivo: ${errorMessage}`);
            throw err;
        }
    };

    const handleBlock = async (deviceId) => {
        const confirmBlock = window.confirm('¿Estás seguro de que quieres bloquear este dispositivo?');
        if (!confirmBlock) return;
        try {
            await blockDevice(deviceId);
            toast.success('Dispositivo bloqueado con éxito.');
            fetchDevices();
            if (selectedDevice && selectedDevice.device_id === deviceId) {
                handleViewDetails(deviceId);
            }
        } catch (err) {
            console.error('Error al bloquear dispositivo:', err);
            const errorMessage = err.response?.data?.detail || err.message || 'Error desconocido';
            toast.error(`Error al bloquear dispositivo: ${errorMessage}`);
        }
    };

    const handleUnblock = async (deviceId) => {
        const confirmUnblock = window.confirm('¿Estás seguro de que quieres desbloquear este dispositivo?');
        if (!confirmUnblock) return;
        try {
            await unblockDevice(deviceId);
            toast.success('Dispositivo desbloqueado con éxito.');
            fetchDevices();
            if (selectedDevice && selectedDevice.device_id === deviceId) {
                handleViewDetails(deviceId);
            }
        } catch (err) {
            console.error('Error al desbloquear dispositivo:', err);
            const errorMessage = err.response?.data?.detail || err.message || 'Error desconocido';
            toast.error(`Error al desbloquear dispositivo: ${errorMessage}`);
        }
    };

     // 5. Iniciar polling
    const checkDeviceConnection = async (deviceId) => {
        let connected = false;
        let attempts = 0;
        const maxAttempts = 100;
        const delayMs = 3000;
    
        setIsPolling(true);
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        while (!connected && attempts < maxAttempts) {
            attempts++;
            try {

                //Espera de 5 segundos a que el movil envie coordenadas
                await delay(5000)
                const lastLocation = await getLastLocation(deviceId);
                if (lastLocation) {
                  setLastLocation(lastLocation)
                  connected = true
                  setIsPolling(false);
                  break;
                }
            } catch (error) {
                if (error.response?.status !== 404) {
                  console.error(`Error en polling:`, error);
                  }
            }
            
            if (!connected) {
                await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
        }
    
        if (!connected) {
            toast.error('Tiempo de espera agotado. El dispositivo no se conectó.');
        }
    };
    

    const handleLocate = async (deviceId) => {
        try {
            const response = await locateDevice(deviceId);
            toast.success(`Solicitud de ubicación enviada. ${response.message || ''}`);
            fetchDevices();
            if (selectedDevice && selectedDevice.device_id === deviceId) {
                setTimeout(() => checkDeviceConnection(selectedDevice.device_id), 1000);
            }
        } catch (err) {
            console.error('Error al localizar dispositivo:', err);
            const errorMessage = err.response?.data?.detail || err.message || 'Error desconocido';
            toast.error(`Error al localizar dispositivo: ${errorMessage}`);
        }
    };

    const handleRelease = async (deviceId) => {
        const confirmRelease = window.confirm('¿Estás seguro de que quieres liberar este dispositivo? Esto lo dejará sin asignación.');
        if (!confirmRelease) return;
        try {
            await releaseDevice(deviceId);
            toast.success('Dispositivo liberado con éxito.');
            fetchDevices();
            if (selectedDevice && selectedDevice.device_id === deviceId) {
                handleViewDetails(deviceId);
            }
        } catch (err) {
            console.error('Error al liberar dispositivo:', err);
            const errorMessage = err.response?.data?.detail || err.message || 'Error desconocido';
            toast.error(`Error al liberar dispositivo: ${errorMessage}`);
        }
    };

    const handleMakePayment = (deviceId) => {
        toast.info('Funcionalidad de "Registrar Pago" pendiente.', { icon: 'ℹ️' });
        console.log(`Registrar pago para dispositivo ID: ${deviceId}`);
    };

    const filteredDevices = devices.filter(device => {
        for (const key in columnFilters) {
            const filterValue = columnFilters[key];
            if (filterValue) {
                const deviceValue = String(device[key] || '').toLowerCase();
                if (!deviceValue.includes(filterValue.toLowerCase())) {
                    return false;
                }
            }
        }
        return true;
    });

    const handleColumnFilterChange = (columnKey, value) => {
        setColumnFilters(prevFilters => ({
            ...prevFilters,
            [columnKey]: value,
        }));
    };


    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">¡Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            {selectedDevice ? (
                <DeviceDetailsView
                    device={selectedDevice}
                    location={lastLocation}
                    actionsHistory={actionsHistory}
                    sims={sims}
                    onBackToList={handleBackToList}
                    onBlock={handleBlock}
                    onUnblock={handleUnblock}
                    onLocate={handleLocate}
                    onRelease={handleRelease}
                    onMakePayment={handleMakePayment}
                    onUpdateDevice={handleUpdateDevice}
                    userRole={userRole}
                    onDeviceUpdate={() => handleViewDetails(selectedDevice.device_id)}
                    isPolling={isPolling}
                />
            ) : (
                <>
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Dispositivos</h1>
                    <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                        {loading ? (
                            <p className="text-center text-gray-500">Cargando dispositivos...</p>
                        ) : (
                            <DeviceTable
                                devices={filteredDevices}
                                onViewDetails={handleViewDetails}
                                columnFilters={columnFilters}
                                onColumnFilterChange={handleColumnFilterChange}
                            />
                        )}
                    </div>
                </>
            )}

        </div>
    );
};

export default DeviceManagementPage;