import React, { useState, useRef, useEffect } from 'react';

const Step2_ContractUpload = ({ onNext, onBack, initialData }) => {
    const [contractFile, setContractFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
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
        alert('Contrato descargado. Por favor, fírmalo y súbelo.');
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setContractFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!contractFile) {
            alert('Por favor, descarga, firma y sube el contrato PDF.');
            return;
        }
        console.log('Contrato listo para subir:', contractFile.name);
        onNext({ contractInfo: { fileName: contractFile.name, size: contractFile.size, url: 'dummy_contract_url.pdf' } });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Contrato de Venta</h2>
            <p className="text-gray-600">
                Por favor, descarga el contrato de venta, fírmalo (digital o físico) y luego súbelo en formato PDF.
            </p>

            <div>
                <button
                    type="button"
                    onClick={handleDownloadContract}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Descargar Contrato PDF
                </button>
            </div>

            <div>
                <label htmlFor="contractFile" className="block text-sm font-medium text-gray-700">
                    Subir Contrato Firmado (PDF)
                </label>
                <input
                    type="file"
                    name="contractFile"
                    id="contractFile"
                    accept=".pdf"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                />
                {contractFile && (
                    <p className="mt-2 text-sm text-gray-500">Archivo seleccionado: {contractFile.name}</p>
                )}
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200">
                <button type="button" onClick={onBack}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Anterior
                </button>
                <button type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Siguiente
                </button>
            </div>
        </form>
    );
};

export default Step2_ContractUpload;