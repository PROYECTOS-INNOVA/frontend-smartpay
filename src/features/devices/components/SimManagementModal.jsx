import React, { useState } from 'react';
import Swal from 'sweetalert2'; // ¡Importa SweetAlert2!

const SimManagementModal = ({ isOpen, onClose, device, onApproveSim, onRemoveSim }) => {
    const [loadingAction, setLoadingAction] = useState(false);

    // --- DATOS QUEMADOS PARA SIMS (PARA PRUEBAS) ---
    // En un escenario real, usarías device.sim_cards
    const dummySims = [
        { imsi: '716152566200284', iccid: '89511500025662002841', phone_no: '+51920035322', status: 'approved' },
        { imsi: '716060900620465', iccid: '8951065012344121051', phone_no: '+51920035322', status: 'approved' },
        { imsi: '716101694175400', iccid: '89511016941754008', phone_no: 'N/A', status: 'approved' },
        { imsi: '89511016941754009', iccid: '89511016941754009', phone_no: 'N/A', status: 'unapproved' },
        { imsi: '123456789012345', iccid: '98765432109876543210', phone_no: 'N/A', status: 'unapproved' },
    ];
    // Usa los datos del dispositivo real si están disponibles, de lo contrario, los datos quemados.
    const allSims = device?.sim_cards && device.sim_cards.length > 0 ? device.sim_cards : dummySims;

    const approvedSims = allSims.filter(sim => sim.status === 'approved');
    const unapprovedSims = allSims.filter(sim => sim.status === 'unapproved');

    // Mover la condición de renderizado aquí, después de que todos los hooks han sido llamados.
    if (!isOpen) return null;

    const handleApprove = async (sim) => {
        if (loadingAction) return;

        // Reemplaza window.confirm con SweetAlert2
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Quieres APROBAR la SIM con IMSI: ${sim.imsi}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#dc3545',
            confirmButtonText: 'Sí, Aprobar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) {
            return;
        }

        setLoadingAction(true);
        try {
            // Llama a la función prop real. Los toasts de éxito/error se manejan en el padre (DeviceDetailsView).
            await onApproveSim(sim.imsi); // onApproveSim en DeviceDetailsView ya recibe solo el imsi
        } catch (error) {
            console.error('Error al aprobar SIM:', error);
            // El error ya se maneja con Swal.fire en DeviceDetailsView, no lo duplicamos aquí.
        } finally {
            setLoadingAction(false);
        }
    };

    const handleRemove = async (sim) => {
        if (loadingAction) return;

        // Reemplaza window.confirm con SweetAlert2
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Quieres ELIMINAR la SIM con IMSI: ${sim.imsi}? Esto la desasignará del dispositivo.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545', // Un color rojo para eliminar
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, Eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) {
            return;
        }

        setLoadingAction(true);
        try {
            // Llama a la función prop real. Los toasts de éxito/error se manejan en el padre (DeviceDetailsView).
            await onRemoveSim(sim.imsi); // onRemoveSim en DeviceDetailsView ya recibe solo el imsi
        } catch (error) {
            console.error('Error al eliminar SIM:', error);
            // El error ya se maneja con Swal.fire en DeviceDetailsView, no lo duplicamos aquí.
        } finally {
            setLoadingAction(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Gestión de Tarjetas SIM para {device?.name || 'Dispositivo'}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                    Nota: Los operadores de SIM en la lista blanca se mostrarán como números IMSI. La combinación de número MCC y MNC formará el número IMSI.
                </p>

                <div className="flex flex-col md:flex-row gap-6 mb-6">
                    {/* Sección de SIMs No Aprobadas */}
                    <div className="flex-1 border border-red-300 rounded-lg p-4 bg-red-50 shadow-sm">
                        <h3 className="text-lg font-semibold mb-3 text-red-700 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                            SIMs No Aprobadas
                        </h3>
                        {unapprovedSims.length === 0 ? (
                            <p className="text-gray-500 text-sm">No hay SIMs no aprobadas.</p>
                        ) : (
                            <ul className="space-y-3">
                                {unapprovedSims.map((sim, index) => (
                                    <li key={sim.imsi || index} className="p-3 bg-white border border-red-200 rounded-md shadow-sm text-sm">
                                        <p className="font-medium text-gray-700">IMSI: <span className="font-normal">{sim.imsi || 'N/A'}</span></p>
                                        <p className="text-gray-600">ICCID: <span className="font-normal">{sim.iccid || 'N/A'}</span></p>
                                        <p className="text-gray-600">Phone No: <span className="font-normal">{sim.phone_no || 'N/A'}</span></p>
                                        <button
                                            onClick={() => handleApprove(sim)}
                                            className="mt-2 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                                            disabled={loadingAction}
                                        >
                                            {loadingAction ? 'Aprobando...' : 'Aprobar'}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Sección de SIMs Aprobadas */}
                    <div className="flex-1 border border-green-300 rounded-lg p-4 bg-green-50 shadow-sm">
                        <h3 className="text-lg font-semibold mb-3 text-green-700 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                            SIMs Aprobadas
                        </h3>
                        {approvedSims.length === 0 ? (
                            <p className="text-gray-500 text-sm">No hay SIMs aprobadas.</p>
                        ) : (
                            <ul className="space-y-3">
                                {approvedSims.map((sim, index) => (
                                    <li key={sim.imsi || index} className="p-3 bg-white border border-green-200 rounded-md shadow-sm text-sm">
                                        <p className="font-medium text-gray-700">IMSI: <span className="font-normal">{sim.imsi || 'N/A'}</span></p>
                                        <p className="text-gray-600">ICCID: <span className="font-normal">{sim.iccid || 'N/A'}</span></p>
                                        <p className="text-gray-600">Phone No: <span className="font-normal">{sim.phone_no || 'N/A'}</span></p>
                                        <button
                                            onClick={() => handleRemove(sim)}
                                            className="mt-2 px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                                            disabled={loadingAction}
                                        >
                                            {loadingAction ? 'Eliminando...' : 'Eliminar'}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SimManagementModal;