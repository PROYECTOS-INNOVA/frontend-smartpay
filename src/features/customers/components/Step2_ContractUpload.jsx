import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2'; 

const Step2_ContractUpload = ({ onNext, onBack, initialData }) => {
    const [contractFile, setContractFile] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const dropzoneRef = useRef(null);

    // Cargar datos iniciales si existen
    useEffect(() => {
        if (initialData && initialData.fileName) {
            const initialFile = new File([], initialData.fileName, { type: 'application/pdf' });
            setContractFile(initialFile);
        }
    }, [initialData]);

    const handleDownloadContract = () => {
        // Simula la descarga de un contrato PDF
        const dummyPdfContent = "Contrato de Venta SmartPay - Cliente (Dummy PDF)";
        const blob = new Blob([dummyPdfContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Contrato_SmartPay_Venta.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        Swal.fire({
            icon: 'info',
            title: 'Contrato Descargado',
            text: 'Por favor, fírmalo y luego súbelo en el campo de abajo.',
            confirmButtonText: 'Entendido'
        });
    };

    const validateFile = (file) => {
        if (!file) {
            setError('Por favor, selecciona un archivo.');
            return false;
        }
        if (file.type !== 'application/pdf') {
            setError('Solo se permiten archivos PDF.');
            return false;
        }
        setError('');
        return true;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (validateFile(file)) {
            setContractFile(file);
        } else {
            setContractFile(null); 
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzoneRef.current.classList.add('border-blue-500', 'bg-blue-50');
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzoneRef.current.classList.remove('border-blue-500', 'bg-blue-50');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzoneRef.current.classList.remove('border-blue-500', 'bg-blue-50'); 

        const file = e.dataTransfer.files[0];
        if (validateFile(file)) {
            setContractFile(file);
        } else {
            setContractFile(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!contractFile) {
            setError('Debes subir el contrato firmado para continuar.');
            return;
        }
        if (!validateFile(contractFile)) { 
            return;
        }

        console.log('Contrato listo para subir:', contractFile.name);
        onNext({ contractInfo: { fileName: contractFile.name, size: contractFile.size, type: contractFile.type } });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Paso 2: Subida de Contrato de Venta</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Para continuar, descarga el contrato de venta, fírmalo digitalmente (o imprímelo, fírmalo y escanéalo) y luego súbelo en formato PDF.
                </p>
            </div>

            {/* Sección de Descarga */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">1. Descargar Contrato</h3>
                <p className="text-gray-600 mb-4">
                    Haz clic en el botón para descargar la plantilla del contrato de venta.
                </p>
                <button
                    type="button"
                    onClick={handleDownloadContract}
                    className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
                >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Descargar Contrato PDF
                </button>
            </div>

            {/* Sección de Subida */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">2. Subir Contrato Firmado</h3>
                <div
                    ref={dropzoneRef}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer
                        ${error ? 'border-red-500' : 'border-gray-300'}
                        ${contractFile ? 'bg-green-50 border-green-500' : 'hover:border-gray-400 hover:bg-gray-100'}
                        transition duration-150 ease-in-out`}
                >
                    <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="contractFile" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                <span>{contractFile ? 'Cambiar archivo' : 'Sube un archivo'}</span>
                                <input
                                    id="contractFile"
                                    name="contractFile"
                                    type="file"
                                    className="sr-only" // Oculta el input real
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                />
                            </label>
                            <p className="pl-1">o arrástralo y suéltalo aquí</p>
                        </div>
                        <p className="text-xs text-gray-500">Solo archivos PDF</p>
                        {contractFile && (
                            <p className="mt-2 text-sm text-green-600 font-semibold">Archivo seleccionado: {contractFile.name}</p>
                        )}
                        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Anterior
                </button>
                <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Siguiente
                </button>
            </div>
        </form>
    );
};

export default Step2_ContractUpload;