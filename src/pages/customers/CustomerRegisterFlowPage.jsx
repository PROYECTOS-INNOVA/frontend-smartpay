// src/pages/customers/CustomerRegisterFlowPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Step1_CustomerInfo from './components/Step1_CustomerInfo';
import Step2_ContractUpload from './components/Step2_ContractUpload';
import Step3_DeviceProvisioning from './components/Step3_DeviceProvisioning';
import Step4_Summary from './components/Step4_Summary';
import { v4 as uuidv4 } from 'uuid';

const CustomerRegisterFlowPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [registrationData, setRegistrationData] = useState({
        customerId: uuidv4(),
        customerInfo: null,
        contractInfo: null, 
        deviceInfo: null, 
    });

    const handleNext = (stepData) => {
        setRegistrationData(prevData => ({
            ...prevData,
            ...stepData // Fusiona los datos del paso actual
        }));
        setCurrentStep(prevStep => prevStep + 1);
    };

    const handleBack = () => {
        setCurrentStep(prevStep => prevStep - 1);
    };

    const handleFinalizeRegistration = () => {
        // Aquí es donde enviarías todos los 'registrationData' al backend.
        // Por ahora, solo lo mostraremos en consola y redirigiremos.
        console.log('Finalizando registro con los siguientes datos:', registrationData);
        alert('Cliente y dispositivo registrados exitosamente (Simulado).');
        navigate('/customer-management'); // Redirigir a la tabla de clientes
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1_CustomerInfo onNext={handleNext} initialData={registrationData.customerInfo} />;
            case 2:
                return <Step2_ContractUpload onNext={handleNext} onBack={handleBack} initialData={registrationData.contractInfo} />;
            case 3:
                return <Step3_DeviceProvisioning onNext={handleNext} onBack={handleBack} initialData={registrationData.deviceInfo} customerId={registrationData.customerId} />;
            case 4:
                return <Step4_Summary onFinalize={handleFinalizeRegistration} onBack={handleBack} registrationData={registrationData} />;
            default:
                return <div>Paso no encontrado</div>;
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Registro de Nuevo Cliente y Dispositivo - Paso {currentStep} de 4
            </h1>
            <div className="bg-white p-6 rounded-lg shadow">
                {renderStep()}
            </div>
        </div>
    );
};

export default CustomerRegisterFlowPage;