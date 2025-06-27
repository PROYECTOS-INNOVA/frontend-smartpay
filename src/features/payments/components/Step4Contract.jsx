import React, { useState, useEffect } from 'react';
import { DocumentArrowDownIcon, DocumentArrowUpIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { generateContractPdf } from '../utils/contractGenerator';

const Step4Contract = ({ onNext, onBack, initialData }) => {
    const [contractFile, setContractFile] = useState(initialData.signedContractFile || null);
    const [isLoadingContract, setIsLoadingContract] = useState(false);
    const [contractUrl, setContractUrl] = useState('');

    const {
        customer,
        device,
        authenticatedUser,
        paymentPlan,
        initialPayment
    } = initialData;

    useEffect(() => {
        if (customer && device && authenticatedUser && paymentPlan && initialPayment && !contractUrl) {
            handleGenerateContract();
        }
    }, [customer, device, authenticatedUser, paymentPlan, initialPayment, contractUrl]);

    const handleGenerateContract = async () => {
        setIsLoadingContract(true);
        setContractUrl('');
        try {
            const contractBlob = await generateContractPdf({
                customer,
                device,
                authenticatedUser,
                paymentPlan,
                initialPayment
            });

            const url = URL.createObjectURL(contractBlob);
            setContractUrl(url);

            toast.success("Contrato pre-llenado generado con éxito.");
        } catch (error) {
            console.error("Error al generar el contrato:", error);
            toast.error("Error al generar el contrato. Por favor, revisa los datos.");
        } finally {
            setIsLoadingContract(false);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            if (file.size > 10 * 1024 * 1024) { 
                toast.error("El archivo excede el tamaño máximo de 10MB.");
                setContractFile(null);
            } else {
                setContractFile(file);
                toast.success(`Archivo "${file.name}" cargado correctamente.`);
            }
        } else {
            setContractFile(null);
            toast.error("Por favor, selecciona un archivo PDF válido.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (contractFile) {
            onNext({ signedContractFile: contractFile });
        } else {
            toast.error("Debes cargar el contrato firmado para continuar.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Paso 4: Contrato</h2>

            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Generar y Descargar Contrato</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Haz clic en "Generar Contrato" para crear un PDF pre-llenado con todos los detalles de la venta. Una vez generado, descárgalo, fírmalo, y luego súbelo en la sección de abajo.
                </p>

                <div className="flex items-center space-x-4 mb-6">
                    <button
                        type="button"
                        onClick={handleGenerateContract}
                        disabled={isLoadingContract || !(customer && device && authenticatedUser && paymentPlan && initialPayment)}
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                            ${isLoadingContract || !(customer && device && authenticatedUser && paymentPlan && initialPayment) ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
                    >
                        {isLoadingContract ? (
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <DocumentArrowDownIcon className="-ml-0.5 mr-2 h-5 w-5" />
                        )}
                        {isLoadingContract ? 'Generando...' : 'Generar Contrato'}
                    </button>
                    {contractUrl && (
                        <a
                            href={contractUrl}
                            download="contrato_venta.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                        >
                            <DocumentArrowDownIcon className="h-5 w-5 mr-1" />
                            Descargar/Ver PDF
                        </a>
                    )}
                </div>

                <div className="mt-6">
                    <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                        Subir Contrato Firmado (PDF)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <span>Cargar un archivo</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" />
                                </label>
                                <p className="pl-1">o arrastra y suelta</p>
                            </div>
                            <p className="text-xs text-gray-500">
                                Solo archivos PDF (máx. 10MB)
                            </p>
                            {contractFile && (
                                <p className="mt-2 text-sm text-gray-700">Archivo seleccionado: <span className="font-semibold">{contractFile.name}</span></p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <ChevronLeftIcon className="-ml-0.5 mr-2 h-5 w-5" />
                    Atrás
                </button>
                <button
                    type="submit"
                    disabled={!contractFile}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                        ${!contractFile ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
                >
                    Continuar
                    <svg className="ml-2 -mr-0.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </form>
    );
};

export default Step4Contract;