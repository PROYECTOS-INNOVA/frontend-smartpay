import React, { useState, useEffect } from 'react';
import { formatDisplayDate } from '../../../common/utils/helpers';
import SimManagementModal from '../components/SimManagementModal';
import ContractViewModal from '../components/ContractViewModal';
import DeviceMapComponent from '../components/DeviceMapComponent';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import { approveDeviceSim, removeDeviceSim } from '../../../api/devices';

const DeviceDetailsView = ({
    device,
    location,
    actionsHistory,
    sims,
    onBackToList,
    onBlock,
    onUnblock,
    onLocate,
    onRelease,
    onMakePayment,
    onUpdateDevice,
    userRole,
    onDeviceUpdate,
    isPolling
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [localSims, setLocalSims] = useState(sims);

    const [isSimModalOpen, setIsSimModalOpen] = useState(false);
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);


    const dummyContractUrl = 'https://www.africau.edu/images/default/sample.pdf'; 

    const dummyPaymentHistory = [
        { id: 1, amount: 50.00, date: '2024-01-20', description: 'Cuota 1 de 12' },
        { id: 2, amount: 50.00, date: '2024-02-20', description: 'Cuota 2 de 12' },
        { id: 3, amount: 50.00, date: '2024-03-20', description: 'Cuota 3 de 12' },
    ];
    // --- Fin Datos quemados ---

    const allPaymentsMade = dummyPaymentHistory.length >= 12;

    useEffect(() => {
        if (device) {
            setFormData({
                name: device.name || '',
                description: device.description || '',
                imei: device.imei || '',
                imei2: device.imei2 || '',
                serial_number: device.serial_number || '',
                model: device.model || '',
                brand: device.brand || '',
                price: device.price || 0,
                purchase_date: device.purchase_date ? device.purchase_date.split('T')[0] : '',
                warranty_end_date: device.warranty_end_date ? device.warranty_end_date.split('T')[0] : '',
                assigned_to_user_id: device.assigned_to_user_id || '',
                state: device.state || 'Active',
                location: device.location || '',
                notes: device.notes || '',
                created_at: device.created_at || '',
                updated_at: device.updated_at || '',
                last_location_latitude: device.last_location_latitude || '',
                last_location_longitude: device.last_location_longitude || '',
            });
        }
    }, [device]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const data = {
                ...formData,
                purchase_date: formData.purchase_date ? new Date(formData.purchase_date).toISOString() : null,
                warranty_end_date: formData.warranty_end_date ? new Date(formData.warranty_end_date).toISOString() : null,
            };

            const dataToSend = {
                name: data.name,
                state: data.state,

            }
            console.log("Data", dataToSend)
            await onUpdateDevice(device.device_id, dataToSend);
            setIsEditing(false);
            if (onDeviceUpdate) {
                onDeviceUpdate();
            }
        } catch (error) {
            console.error("Failed to save device:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleOpenSimModal = () => {
        setIsSimModalOpen(true);
    };

    const handleCloseSimModal = () => {
        setIsSimModalOpen(false);
        if (onDeviceUpdate) {
            onDeviceUpdate();
        }
    };

    const handleOpenContractModal = () => {
        setIsContractModalOpen(true);
    };

    const handleCloseContractModal = () => {
        setIsContractModalOpen(false);
    };


    const handleApproveSim = async (simId, iccId) => {
        try {
            const updatedSim = await approveDeviceSim(device.device_id, simId);

            setLocalSims(prev =>
                prev.map(sim => sim.icc_id === iccId ? updatedSim : sim)
            );
            toast.success(`SIM ${iccId} aprobada con éxito.`);
            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.detail || error.message || 'Error desconocido al aprobar SIM';
            Swal.fire('Error', `Error al aprobar SIM ${iccId}: ${errorMessage}`, 'error');
            console.error('Error al aprobar SIM:', error);
            return false;
        }
    };

    const handleRemoveSim = async (simId, iccId) => {
        try {
            const updatedSim = await removeDeviceSim(device.device_id, simId);
            setLocalSims(prev =>
                prev.map(sim => sim.icc_id === iccId ? updatedSim : sim)
            );
            toast.success(`SIM ${iccId} desvinculada con éxito.`);
            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.detail || error.message || 'Error desconocido al desvincular SIM';
            Swal.fire('Error', `Error al desvincular SIM ${iccId}: ${errorMessage}`, 'error');
            console.error('Error al desvincular SIM:', error);
            return false;
        }
    };

    if (!device) {
        return <div className="text-center py-8">Cargando detalles del dispositivo...</div>;
    }

    const getStatusClass = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Inactive': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const isSuperAdmin = userRole === 'superadmin';

    const generalInfoFields = [
        { key: 'name', label: 'Nombre' }, { key: 'serial_number', label: 'Serial' },
        { key: 'model', label: 'Modelo' }, { key: 'brand', label: 'Marca' },
        { key: 'imei', label: 'IMEI 1' }, { key: 'imei2', label: 'IMEI 2' },
        { key: 'state', label: 'Estado' }, { key: 'price', label: 'Precio', type: 'number' },
        { key: 'purchase_date', label: 'Fecha de Compra', type: 'date' },
        { key: 'warranty_end_date', label: 'Fin de Garantía', type: 'date' },
        { key: 'assigned_to_user_id', label: 'Asignado a Usuario ID' },
        { key: 'location', label: 'Ubicación' },
        { key: 'description', label: 'Descripción', type: 'textarea' },
        { key: 'notes', label: 'Notas', type: 'textarea' },
        { key: 'created_at', label: 'Creado el' }, { key: 'updated_at', label: 'Última Actualización' },
    ];

    const fieldsToExcludeFromDirectEdit = ['device_id', 'serial_number', 'model', 'brand', 'imei', 'product_name' , 'imei_two', 'created_at', 'updated_at', 'last_location_latitude', 'last_location_longitude'];

    const actionLabels = {
        block: "Bloqueo",
        unblock: "Desbloqueo",
        locate: "Ubicación"
    };

    const stateLabels = {
        pending: "Pendiente por ejecutar",
        failed: "Fallida",
        applied: "Aplicada"
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // o cualquier cantidad que quieras mostrar
    const totalPages = Math.ceil(actionsHistory?.length / itemsPerPage) || 1;

    const paginatedActions = actionsHistory.slice(
        (currentPage - 1) * itemsPerPage,
     currentPage * itemsPerPage
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={onBackToList}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg inline-flex items-center transition duration-200 ease-in-out"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Volver
                </button>
                <h2 className="text-3xl font-extrabold text-gray-900">
                    Detalles del Dispositivo: {device.name}
                </h2>
                <div className="w-24"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Columna Izquierda: Información General */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Información General</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {generalInfoFields.map(({ key, label, type }) => {
                            const isEditableField = !fieldsToExcludeFromDirectEdit.includes(key);

                            return (
                                <div key={key} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                                    <label className="block text-xs font-medium text-gray-700">
                                        {label}
                                    </label>
                                    {isEditing && isEditableField ? (
                                        key === 'state' ? (
                                            <select
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            >
                                                <option value="Active">Activo</option>
                                                <option value="Inactive">Inactivo</option>
                                            </select>
                                        ) : type === 'textarea' ? (
                                            <textarea
                                                name={key}
                                                value={formData[key]}
                                                onChange={handleChange}
                                                rows="3"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            ></textarea>
                                        ) : (
                                            <input
                                                type={type || 'text'}
                                                name={key}
                                                value={formData[key]}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            />
                                        )
                                    ) : (
                                        <p className="mt-1 text-sm text-gray-900 font-semibold">
                                            {key === 'state' ? (
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(device.state)}`}>
                                                    {device.state || 'N/A'}
                                                </span>
                                            ) : (
                                                (key === 'purchase_date' || key === 'warranty_end_date' || key === 'created_at' || key === 'updated_at')
                                                    ? formatDisplayDate(device[key])
                                                    : (device[key] || 'N/A')
                                            )}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                        {/* New: Ver Contrato button */}
                        {!isEditing && isSuperAdmin && (
                            <div className="col-span-full sm:col-span-1 lg:col-span-1 flex justify-center items-center">
                                <button
                                    onClick={handleOpenContractModal}
                                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-200 ease-in-out w-full"
                                >
                                    Ver Contrato
                                </button>
                            </div>
                        )}
                        {/* SIM button moved next to Ver Contrato */}
                        {!isEditing && isSuperAdmin && (
                            <div className="col-span-full sm:col-span-1 lg:col-span-1 flex justify-center items-center">
                                <button
                                    onClick={handleOpenSimModal}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-200 ease-in-out w-full"
                                >
                                    SIM
                                </button>
                            </div>
                        )}
                        {/* Edit/Save/Cancel buttons */}
                        {!isEditing && isSuperAdmin && (
                            <div className="col-span-full sm:col-span-1 lg:col-span-1 flex justify-center items-center">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-200 ease-in-out w-full"
                                >
                                    Editar
                                </button>
                            </div>
                        )}


                        {isEditing && (
                            <>
                                <div className="col-span-full sm:col-span-1 lg:col-span-1 flex justify-end items-end">
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-200 ease-in-out w-full ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isSaving ? 'Guardando...' : 'Guardar'}
                                    </button>
                                </div>
                                <div className="col-span-full sm:col-span-1 lg:col-span-1 flex justify-end items-end">
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                name: device.name || '', description: device.description || '',
                                                imei: device.imei || '', imei2: device.imei2 || '',
                                                serial_number: device.serial_number || '', model: device.model || '',
                                                brand: device.brand || '', price: device.price || 0,
                                                purchase_date: device.purchase_date ? device.purchase_date.split('T')[0] : '',
                                                warranty_end_date: device.warranty_end_date ? device.warranty_end_date.split('T')[0] : '',
                                                assigned_to_user_id: device.assigned_to_user_id || '',
                                                state: device.state || 'Active', location: device.location || '',
                                                notes: device.notes || '', created_at: device.created_at || '',
                                                updated_at: device.updated_at || '',
                                                last_location_latitude: device.last_location_latitude || '',
                                                last_location_longitude: device.last_location_longitude || '',
                                            });
                                        }}
                                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-200 ease-in-out w-full"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Columna Derecha: Ubicación y Acciones */}
                <div className="flex flex-col gap-6">
                    {/* Ubicación del Dispositivo */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner flex-grow">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ubicación del Dispositivo</h3>
                        {/* Aquí integramos el DeviceMapComponent */}
                        <DeviceMapComponent
                            latitude={location?.latitude ?? 0}
                            longitude={location?.longitude ?? 0}
                            deviceSerial={device.serial_number || device.name} // Usar serial o nombre para el popup
                        />
                        {/* Botón Localizar: siempre habilitado */}
                        {isSuperAdmin && (
                            <button
                                onClick={() => onLocate(device.device_id)}
                                className={`mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out w-full ${isPolling ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Notificar Ubicación
                            </button>
                        )}
                    </div>

                    {/* Acciones del Dispositivo */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner flex-grow">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Acciones del Dispositivo</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {isSuperAdmin && (
                                <button
                                    onClick={() => onBlock(device.device_id)}
                                    disabled={false}
                                    className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out w-full`}
                                >
                                    Bloquear
                                </button>
                            )}
                            {isSuperAdmin && (
                                <button
                                    onClick={() => onUnblock(device.device_id)}
                                    disabled={false}
                                    className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out w-full`}
                                >
                                    Desbloquear
                                </button>
                            )}
                            {isSuperAdmin && (
                                <button
                                    onClick={() => onMakePayment(device.device_id)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out w-full"
                                >
                                    Registrar Pago
                                </button>
                            )}
                            {isSuperAdmin && (
                                <button
                                    onClick={() => onRelease(device.device_id)}
                                    disabled={!allPaymentsMade || device.state === 'Released'}
                                    className={`bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out w-full ${(!allPaymentsMade || device.state === 'Released') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Liberar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Historial de Acciones (debajo de las columnas principales) */}
            <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-inner">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Historial de Acciones</h3>
                {Array.isArray(actionsHistory) && actionsHistory.length > 0 ? (
                <>
                    <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha/Hora</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aplicado por</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedActions.map((action) => (
                            <tr key={action.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{actionLabels[action.action] || action.action}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stateLabels[action.state] || action.state}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(action.created_at).toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {action.applied_by
                                    ? [action.applied_by.first_name, action.applied_by.middle_name, action.applied_by.last_name, action.applied_by.second_last_name]
                                        .filter(Boolean)
                                        .join(' ')
                                    : '—'}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>

                    {/* Paginación */}
                    {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-4 space-x-2">
                        <button
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            >
                            Anterior
                        </button>
                        <span className="text-sm text-gray-700">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente
                        </button>
                    </div>
                    )}
                </>
                ) : (
                <p className="text-gray-600">No hay historial de acciones disponible.</p>
                )}
            </div>

            {/* Historial de Pagos (debajo del historial de acciones) */}
            <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-inner">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Historial de Pagos</h3>
                {dummyPaymentHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dummyPaymentHistory.map((payment) => (
                                    <tr key={payment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${payment.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">No hay historial de pagos disponible.</p>
                )}
            </div>

            {/* Modal de Gestión de SIMs */}
            {isSimModalOpen && (
                <SimManagementModal
                    sims={localSims}
                    isOpen={isSimModalOpen}
                    onClose={handleCloseSimModal}
                    device={device}
                    onApproveSim={handleApproveSim}
                    onRemoveSim={handleRemoveSim}
                />
            )}

            {/* Modal para Ver Contrato */}
            {isContractModalOpen && (
                <ContractViewModal
                    isOpen={isContractModalOpen}
                    onClose={handleCloseContractModal}
                    contractUrl={dummyContractUrl} // Pass the contract URL here
                />
            )}
        </div>
    );
};

export default DeviceDetailsView;