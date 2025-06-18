// src/features/devices/components/DeviceDetailsView.jsx
import React, { useState, useEffect } from 'react';
import { capitalizeFirstLetter, formatDisplayDate } from '../../../common/utils/helpers'; // Importa el nuevo helper para formatear fechas
import SimManagementModal from '../components/SimManagementModal'; // Importa el modal de SIM
import { toast } from 'react-toastify'; // Para las notificaciones

// Importa las funciones de la API para SIMs
import { approveDeviceSim, removeDeviceSim } from '../../../api/devices';

const DeviceDetailsView = ({
    device,
    onBackToList,
    onBlock,
    onUnblock,
    onLocate,
    onRelease,
    onMakePayment,
    onUpdateDevice,
    userRole,
    onDeviceUpdate // Esta prop es clave para recargar los detalles del dispositivo
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // Estados para la gestión del modal de SIM
    const [isSimModalOpen, setIsSimModalOpen] = useState(false);
    // Ya no necesitamos deviceForSim aquí, porque el 'device' prop es el que gestionamos.

    // --- Datos quemados para Historial de Acciones y Pagos ---
    const dummyActionHistory = [
        { id: 1, type: 'Asignación', description: 'Dispositivo asignado a Juan Pérez', timestamp: '2024-01-15T10:00:00Z' },
        { id: 2, type: 'Bloqueo', description: 'Dispositivo bloqueado por falta de pago', timestamp: '2024-02-01T11:30:00Z' },
        { id: 3, type: 'Desbloqueo', description: 'Dispositivo desbloqueado después de pago', timestamp: '2024-02-05T14:00:00Z' },
        { id: 4, type: 'Localización', description: 'Ubicación solicitada y obtenida', timestamp: '2024-03-10T09:15:00Z' },
    ];

    const dummyPaymentHistory = [
        { id: 1, amount: 50.00, date: '2024-01-20', description: 'Cuota 1 de 12' },
        { id: 2, amount: 50.00, date: '2024-02-20', description: 'Cuota 2 de 12' },
        { id: 3, amount: 50.00, date: '2024-03-20', description: 'Cuota 3 de 12' },
    ];
    // --- Fin Datos quemados ---

    const allPaymentsMade = dummyPaymentHistory.length >= 12; // Cambia 12 por el número total de cuotas esperadas

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
            const dataToSend = {
                ...formData,
                purchase_date: formData.purchase_date ? new Date(formData.purchase_date).toISOString() : null,
                warranty_end_date: formData.warranty_end_date ? new Date(formData.warranty_end_date).toISOString() : null,
            };
            await onUpdateDevice(device.device_id, dataToSend);
            setIsEditing(false);
            // La prop onDeviceUpdate es crucial aquí para que DeviceManagementPage
            // recargue los detalles del dispositivo después de una actualización.
            if (onDeviceUpdate) {
                onDeviceUpdate();
            }
        } catch (error) {
            console.error("Failed to save device:", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Funciones para el modal de SIM
    const handleOpenSimModal = () => {
        setIsSimModalOpen(true);
    };

    const handleCloseSimModal = () => {
        setIsSimModalOpen(false);
        // Cuando se cierra el modal, recargar los detalles del dispositivo
        // para reflejar cualquier cambio en las SIMs.
        if (onDeviceUpdate) {
            onDeviceUpdate();
        }
    };

    const handleApproveSim = async (imsi) => {
        try {
            await approveDeviceSim(device.device_id, imsi);
            toast.success(`SIM ${imsi} aprobada con éxito.`);
            if (onDeviceUpdate) {
                onDeviceUpdate(); // Recargar los detalles del dispositivo para actualizar la lista de SIMs
            }
            return true; // Indicar éxito
        } catch (error) {
            const errorMessage = error.response?.data?.detail || error.message || 'Error desconocido al aprobar SIM';
            toast.error(`Error al aprobar SIM ${imsi}: ${errorMessage}`);
            console.error('Error al aprobar SIM:', error);
            return false; // Indicar fallo
        }
    };

    const handleRemoveSim = async (imsi) => {
        const confirmRemoval = window.confirm(`¿Estás seguro de que quieres desvincular la SIM ${imsi} de este dispositivo?`);
        if (!confirmRemoval) return false;
        try {
            await removeDeviceSim(device.device_id, imsi);
            toast.success(`SIM ${imsi} desvinculada con éxito.`);
            if (onDeviceUpdate) {
                onDeviceUpdate(); // Recargar los detalles del dispositivo para actualizar la lista de SIMs
            }
            return true; // Indicar éxito
        } catch (error) {
            const errorMessage = error.response?.data?.detail || error.message || 'Error desconocido al desvincular SIM';
            toast.error(`Error al desvincular SIM ${imsi}: ${errorMessage}`);
            console.error('Error al desvincular SIM:', error);
            return false; // Indicar fallo
        }
    };


    if (!device) {
        return <div className="text-center py-8">Cargando detalles del dispositivo...</div>;
    }

    const getStatusClass = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Blocked':
                return 'bg-red-100 text-red-800';
            case 'Released':
                return 'bg-blue-100 text-blue-800';
            case 'Inactive':
                return 'bg-gray-100 text-gray-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const isSuperAdmin = userRole === 'superadmin';

    // Definir los campos que van en "Información General" y su orden
    const generalInfoFields = [
        { key: 'name', label: 'Nombre' },
        { key: 'serial_number', label: 'Serial' },
        { key: 'model', label: 'Modelo' },
        { key: 'brand', label: 'Marca' },
        { key: 'imei', label: 'IMEI 1' },
        { key: 'imei2', label: 'IMEI 2' },
        { key: 'state', label: 'Estado' },
        { key: 'price', label: 'Precio', type: 'number' },
        { key: 'purchase_date', label: 'Fecha de Compra', type: 'date' },
        { key: 'warranty_end_date', label: 'Fin de Garantía', type: 'date' },
        { key: 'assigned_to_user_id', label: 'Asignado a Usuario ID' },
        { key: 'location', label: 'Ubicación' },
        { key: 'description', label: 'Descripción', type: 'textarea' },
        { key: 'notes', label: 'Notas', type: 'textarea' },
        { key: 'created_at', label: 'Creado el' },
        { key: 'updated_at', label: 'Última Actualización' },
    ];

    // Campos que queremos excluir del formulario de edición directa (ej. IDs, timestamps)
    const fieldsToExcludeFromDirectEdit = ['device_id', 'created_at', 'updated_at', 'last_location_latitude', 'last_location_longitude'];

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
                <div className="w-24"></div> {/* Espaciador para alinear el título */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Columna Izquierda: Información General */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Información General</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                        {generalInfoFields.map(({ key, label, type }) => {
                            const isEditableField = !fieldsToExcludeFromDirectEdit.includes(key);

                            return (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {label}
                                    </label>
                                    {isEditing && isEditableField ? (
                                        key === 'state' ? (
                                            <select
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            >
                                                <option value="Active">Activo</option>
                                                <option value="Blocked">Bloqueado</option>
                                                <option value="Released">Liberado</option>
                                                <option value="Inactive">Inactivo</option>
                                                <option value="Pending">Pendiente</option>
                                            </select>
                                        ) : type === 'textarea' ? (
                                            <textarea
                                                name={key}
                                                value={formData[key]}
                                                onChange={handleChange}
                                                rows="3"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            ></textarea>
                                        ) : (
                                            <input
                                                type={type || 'text'}
                                                name={key}
                                                value={formData[key]}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        )
                                    ) : (
                                        <p className="mt-1 text-gray-900 font-semibold">
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
                    </div>

                    {/* Botones de edición y SIM */}
                    <div className="flex flex-wrap gap-4 mt-6 justify-end">
                        {!isEditing && isSuperAdmin && (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={handleOpenSimModal} // Llama a la función local para abrir el modal
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out"
                                >
                                    SIM
                                </button>
                            </>
                        )}

                        {isEditing && (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isSaving ? 'Guardando...' : 'Guardar'}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        // Resetear formData a los valores originales del dispositivo
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
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out"
                                >
                                    Cancelar
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Columna Derecha: Ubicación y Acciones */}
                <div className="flex flex-col gap-6">
                    {/* Ubicación del Dispositivo */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner flex-grow">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ubicación del Dispositivo</h3>
                        <div className="bg-gray-200 h-48 flex items-center justify-center rounded-md text-gray-500">
                            {device.last_location_latitude && device.last_location_longitude ? (
                                `Lat: ${device.last_location_latitude}, Lon: ${device.last_location_longitude}`
                            ) : (
                                'Mapa o Coordenadas de Ubicación (Pendiente)'
                            )}
                        </div>
                        {/* Botón Localizar: siempre habilitado */}
                        {isSuperAdmin && (
                            <button
                                onClick={() => onLocate(device.device_id)}
                                className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out w-full"
                            >
                                Notificar Ubicación
                            </button>
                        )}
                    </div>

                    {/* Acciones del Dispositivo */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner flex-grow">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Acciones del Dispositivo</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Botón Bloquear: siempre habilitado (su estado es gestionado por la condición de device.state) */}
                            {isSuperAdmin && (
                                <button
                                    onClick={() => onBlock(device.device_id)}
                                    disabled={device.state === 'Blocked'}
                                    className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out w-full ${device.state === 'Blocked' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Bloquear
                                </button>
                            )}
                            {/* Botón Desbloquear: siempre habilitado (su estado es gestionado por la condición de device.state) */}
                            {isSuperAdmin && (
                                <button
                                    onClick={() => onUnblock(device.device_id)}
                                    disabled={device.state !== 'Blocked'}
                                    className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out w-full ${device.state !== 'Blocked' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Desbloquear
                                </button>
                            )}
                            {/* Botón Registrar Pago: siempre habilitado */}
                            {isSuperAdmin && (
                                <button
                                    onClick={() => onMakePayment(device.device_id)}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out w-full"
                                >
                                    Registrar Pago
                                </button>
                            )}
                            {/* Botón Liberar: deshabilitado hasta que allPaymentsMade sea true */}
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
                {dummyActionHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha/Hora</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dummyActionHistory.map((action) => (
                                    <tr key={action.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{action.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{action.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(action.timestamp).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
                    isOpen={isSimModalOpen}
                    onClose={handleCloseSimModal}
                    device={device} // Pasamos el objeto device completo
                    onApproveSim={handleApproveSim}
                    onRemoveSim={handleRemoveSim}
                />
            )}
        </div>
    );
};

export default DeviceDetailsView;