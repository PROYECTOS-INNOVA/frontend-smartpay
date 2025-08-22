import React, { useState, useEffect, useRef } from 'react';
import { getDevices, getLastLocation, getActionsHistory, updateDevice, blockDevice, unblockDevice, locateDevice, releaseDevice, sendNotification } from '../../api/devices';
import { getPayments, createPayment } from '../../api/payments';
import { getPlanByDeviceId, getPlans } from '../../api/plans';
import DeviceTable from './components/DeviceTable';
import DeviceDetailsView from './views/DeviceDetailsView';

// Importaciones de react-toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getValueByPath } from '../../common/utils/helpers';
import { useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const DeviceManagementPage = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectPlan, setSelectedPlan] = useState(null);
    const [payments, setPayments] = useState([]);
    const [lastLocation, setLastLocation] = useState(null);
    const [actionsHistory, setActionsHistory] = useState([]);
    const [isPolling, setIsPolling] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams()
    const didMount = useRef(false);

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
        //Desmontar componente para evitar doble aplicación
        if (didMount.current) return;
        didMount.current = true;

        const deviceId = searchParams.get('deviceId');
        if (deviceId) {
            handleViewDetails(deviceId)
        } else {
            fetchDevices();
        }
    }, []);

    /**
     * Metodo para mapear el esatdo en el que se encuentra el dispositivo
     */
    function mapPlansWithLatestAction(plans, actions) {
        return plans.map(plan => {
            // Filtrar solo acciones de tipo 'block' o 'unblock' con mismo device_id
            const relevantActions = actions.filter(action =>
                action.device_id === plan.device_id &&
                (action.action === 'block' || action.action === 'unblock' || action.action === 'unenroll')
            );

            // Buscar la más reciente por created_at
            const latestAction = relevantActions.reduce((latest, current) => {
                return !latest || new Date(current.created_at) > new Date(latest.created_at)
                    ? current
                    : latest;
            }, null);

            return {
                ...plan,
                status_actions: latestAction, // puede ser null si no hay 'block'/'unblock'
            };
        });
    }

    const fetchDevices = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPlans();
            const actions = await getActionsHistory();
            const enrichedPlans = mapPlansWithLatestAction(data, actions);
            // console.log('fetch data: ', enrichedPlans);

            setDevices(enrichedPlans);
        } catch (err) {
            // console.error('Error al cargar dispositivos:', err);
            setError('Error al cargar dispositivos. Por favor, inténtalo de nuevo.');
            toast.error('Error al cargar dispositivos.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (deviceId) => {

        setLoading(true);
        try {
            const planDevice = await getPlanByDeviceId(deviceId);
            const lastLocation = await getLastLocation(deviceId);

            const params = { device_id: deviceId, state: 'Approved' };
            const paymentsResponse = await getPayments(params)
            const actions = await getActionsHistory(deviceId);


            if (Array.isArray(actions) && actions.length > 0) {
                const sortedActions = [...actions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setActionsHistory(sortedActions);
            }
            //Setear el Id del device como URL param para menter persistencia
            searchParams.set('deviceId', deviceId)
            setSearchParams(searchParams)

            setPayments(paymentsResponse);
            setSelectedPlan(planDevice);
            setLastLocation(lastLocation);
        } catch (err) {
            // console.error('Error al cargar detalles del dispositivo:', err);
            setError('Error al cargar los detalles del dispositivo.');
            toast.error('Error al cargar los detalles del dispositivo.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToList = () => {
        //Limpiar param
        searchParams.delete('deviceId')
        setSearchParams(searchParams)

        setSelectedPlan(null);
        fetchDevices();
    };

    const handleUpdateDevice = async (deviceId, updatedData) => {
        try {
            await updateDevice(deviceId, updatedData);
            const planDevice = await getPlanByDeviceId(deviceId);
            setSelectedPlan(planDevice);

            toast.success('Dispositivo actualizado correctamente.');
        } catch (err) {
            // console.error('Error al actualizar dispositivo:', err);
            const errorMessage = err.response?.data?.detail || err.message || 'Error desconocido';
            toast.error(`Error al actualizar dispositivo: ${errorMessage}`);
            throw err;
        }
    };

    /**
     * Metodo para bloqeuar dispositvo von alerta de confirmación
     * @param {*} deviceId 
     * @returns 
     */
    const handleBlock = async (deviceId) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esto bloqueará el dispositivo y no podrá ser usado.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e3342f', // rojo
            cancelButtonColor: '#6c757d', // gris
            confirmButtonText: 'Sí, bloquear',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            await blockDevice(deviceId);
            toast.success('Dispositivo bloqueado con éxito.');

            if (selectPlan && selectPlan.device_id === deviceId) {
                handleViewDetails(deviceId);
            }
        } catch (err) {
            // console.error('Error al bloquear dispositivo:', err);
            const errorMessage = err.response?.data?.detail || err.message || 'Error desconocido';
            toast.error(`Error al bloquear dispositivo: ${errorMessage}`);
        }
    };

    const handleSubmitNotification = async (deviceId, notificationData) => {
        try {
            await sendNotification(deviceId, notificationData);
            toast.success('Notificación enviada.');

            if (selectPlan && selectPlan.device_id === deviceId) {
                handleViewDetails(deviceId);
            }
        } catch (err) {
            // console.error("Error send notificacion:", err);
            const errorMessage = err.response?.data?.detail || err.message || "Hubo un error al enviar la notificacion.";
            toast.error(`Error al enviar notificación: ${errorMessage}`);
        }
    };

    /**
     * Método para registrrar pago con alerta confirmación
     * @param {*} paymentData 
     * @returns 
     */
    const handleSubmitPayment = async (paymentData) => {
        const result = await Swal.fire({
            title: '¿Registrar pago?',
            text: '¿Estás seguro de que quieres registrar el pago?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#16a34a', // verde
            cancelButtonColor: '#6b7280', // gris neutro
            confirmButtonText: 'Sí, registrar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            await createPayment(paymentData);
            toast.success('Pago registrado.');

            if (selectPlan && selectPlan.device_id === paymentData.device_id) {
                const params = { device_id: paymentData.device_id, state: 'Approved' };
                const paymentsResponse = await getPayments(params);
                setPayments(paymentsResponse);

                // Convertir y sumar los values
                const totalValue = paymentsResponse.reduce((sum, payment) => {
                    return sum + parseFloat(payment.value);
                }, 0);

                if (totalValue < selectPlan.value) {
                    await unblockDevice(paymentData.device_id, { duration: 0 });
                }

                handleViewDetails(paymentData.device_id);
            }
        } catch (err) {
            // console.error('Error al registrar pago del dispositivo:', err);
            const errorMessage = err.response?.data?.detail || err.message || 'Error desconocido';
            toast.error(`Error al registrar pago del dispositivo: ${errorMessage}`);
        }
    };

    /**
     * Metodo para desbloquear dispositivo. La acción se ejecuta directamente.
     * @param {*} deviceId 
     * @returns 
     */
    const handleUnblock = async (deviceId) => {
        try {
           const { value: minutos } = await Swal.fire({
                title: 'Desbloquear dispositivo',
                input: 'number',
                inputLabel: '¿Por cuántos minutos deseas desbloquear el dispositivo?',
                inputPlaceholder: 'Ingresa el tiempo en minutos',
                inputAttributes: {
                    min: 0,
                    step: 1
                },
                showCancelButton: true,
                confirmButtonText: 'Desbloquear',
                cancelButtonText: 'Cancelar'
            });

            console.log("Minutes", minutos);
            // Si canceló, salimos
            if (minutos === undefined) return;

            // Normalizamos el valor: si está vacío, nulo o NaN → 0
            const minutosFinal = minutos === "" || minutos == null ? 0 : Number(minutos);

            const minutes = parseInt(minutosFinal, 10);
            await unblockDevice(deviceId, { duration: minutes * 60 });
            toast.success('Dispositivo desbloqueado con éxito.');

            if (selectPlan && selectPlan.device_id === deviceId) {
                handleViewDetails(deviceId);
            }
        } catch (err) {
            // console.error('Error al desbloquear dispositivo:', err);
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
                    // console.error(`Error en polling:`, error);
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

            if (selectPlan && selectPlan.device_id === deviceId) {
                setTimeout(() => checkDeviceConnection(deviceId), 1000);
            }
        } catch (err) {
            // console.error('Error al localizar dispositivo:', err);
            const errorMessage = err.response?.data?.detail || err.message || 'Error desconocido';
            toast.error(`Error al localizar dispositivo: ${errorMessage}`);
        }
    };
    const handleRelease = async (deviceId) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esto liberará el dispositivo y lo dejará sin asignación.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, liberar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            await releaseDevice(deviceId);
            toast.success('Dispositivo liberado con éxito.');

            if (selectPlan && selectPlan.device_id === deviceId) {
                handleViewDetails(deviceId);
            }
        } catch (err) {
            // console.error('Error al liberar dispositivo:', err);
            const errorMessage = err.response?.data?.detail || err.message || 'Error desconocido';
            toast.error(`Error al liberar dispositivo: ${errorMessage}`);
        }
    };

    /**
     * Filtrar por columnas y valor de la tabla 
     * uso de helper para clave anidadas 
     * @helper getValueByPath
     */
    const filteredDevices = devices.filter(device => {
        for (const key in columnFilters) {
            const filterValue = columnFilters[key];
            if (filterValue) {
                const deviceValue = String(getValueByPath(device, key)).toLowerCase();
                if (!deviceValue.includes(filterValue.toLowerCase())) {
                    return false;
                }
            }
        }
        return true;
    });


    const handleColumnFilterChange = (columnKey, value) => {
        // console.log("Colum keuy; ", columnKey, value);

        setColumnFilters(prevFilters => ({
            ...prevFilters,
            [columnKey]: value,
        }));
    };


    return (
        <div className="container bg-white rounded-xl mx-auto p-4 sm:p-6 lg:p-8">

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">¡Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            {selectPlan ? (
                <DeviceDetailsView
                    plan={selectPlan}
                    location={lastLocation}
                    actionsHistory={actionsHistory}
                    payments={payments}
                    onBackToList={handleBackToList}
                    onBlock={handleBlock}
                    onNotification={handleSubmitNotification}
                    onUnblock={handleUnblock}
                    onSubmitPayment={handleSubmitPayment}
                    onLocate={handleLocate}
                    onRelease={handleRelease}
                    onUpdateDevice={handleUpdateDevice}
                    userRole={userRole}
                    onDeviceUpdate={() => handleViewDetails(selectPlan.device_id)}
                    isPolling={isPolling}
                />
            ) : (
                <>
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Dispositivos</h1>
                    <div className="bg-white  rounded-lg shadow-md overflow-x-auto">
                        {loading ? (
                            <p className="text-center p-4 text-gray-500">Cargando dispositivos...</p>
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