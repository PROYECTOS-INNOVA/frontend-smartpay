import React, { useState } from 'react';
import Swal from 'sweetalert2';

const SimManagementModal = ({ sims, isOpen, onClose, device, onApproveSim, onRemoveSim }) => {
    const [loadingAction, setLoadingAction] = useState(false);

    const approvedSims = Array.isArray(sims) ? sims.filter(sim => sim.state === 'Active') : [];
    const unapprovedSims = Array.isArray(sims) ? sims.filter(sim => sim.state === 'Inactive') : [];

    if (!isOpen) return null;

    const handleApprove = async (sim) => { 
        if (loadingAction) return;

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Quieres APROBAR la SIM con IMSI: ${sim.icc_id}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, Aprobar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-zindex-fix'
            }
        });

        if (!result.isConfirmed) {
            return;
        }

        setLoadingAction(true);
        try {
            await onApproveSim(sim.sim_id, sim.icc_id);
        } catch (error) {
            console.error('Error al aprobar SIM:', error);
        } finally {
            setLoadingAction(false);
        }
    };

    const handleRemove = async (sim) => {
        if (loadingAction) return;

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Quieres ELIMINAR la SIM con IMSI: ${sim.imsi}? Esto la desasignará del dispositivo.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545', 
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, Inactivar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) {
            return;
        }

        setLoadingAction(true);
        try {
            await onRemoveSim(sim.sim_id, sim.icc_id);
        } catch (error) {
            console.error('Error al eliminar SIM:', error);
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
                                        <p className="font-medium text-gray-700">ICCID: <span className="font-normal">{sim.icc_id || 'N/A'}</span></p>
                                        <p className="text-gray-600">Operador: <span className="font-normal">{sim.operator || 'N/A'}</span></p>
                                        <p className="text-gray-600">Número de Teléfono: <span className="font-normal">{sim.number || 'N/A'}</span></p>
                                        <button
                                            onClick={() => handleApprove(sim)}
                                            className={`mt-2 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50`}
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
                                        <p className="font-medium text-gray-700">ICCID: <span className="font-normal">{sim.icc_id || 'N/A'}</span></p>
                                        <p className="text-gray-600">Operador: <span className="font-normal">{sim.operator || 'N/A'}</span></p>
                                        <p className="text-gray-600">Número de Teléfono: <span className="font-normal">{sim.number || 'N/A'}</span></p>
                                        <button
                                            onClick={() => handleRemove(sim)}
                                            disabled={loadingAction}
                                            className={`mt-2 px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50`}
                                        >
                                            {loadingAction ? 'Inactivando...' : 'Inactivar'}
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