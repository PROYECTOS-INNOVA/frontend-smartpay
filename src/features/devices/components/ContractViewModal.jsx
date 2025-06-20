// src/features/devices/components/ContractViewModal.jsx
import React from 'react';

const ContractViewModal = ({ isOpen, onClose, contractUrl }) => {
    if (!isOpen) return null;

    return (
        // Add a higher z-index here
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 h-5/6 max-w-4xl flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">Ver Contrato</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
                    >
                        &times;
                    </button>
                </div>
                {contractUrl ? (
                    <div className="flex-grow">
                        <iframe
                            src={contractUrl}
                            className="w-full h-full border-0 rounded-md"
                            title="Contrato del Dispositivo"
                        >
                            Lo sentimos, su navegador no soporta la visualización de PDFs. Puede descargarlo <a href={contractUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">aquí</a>.
                        </iframe>
                    </div>
                ) : (
                    <div className="flex-grow flex items-center justify-center text-gray-600">
                        <p>No se ha proporcionado un contrato para este dispositivo.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContractViewModal;