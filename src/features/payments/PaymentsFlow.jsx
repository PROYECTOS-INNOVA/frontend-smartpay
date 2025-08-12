// src/pages/payments/PaymentsFlow.jsx
import React, { useState, useEffect } from 'react';
import Step1Customer from './components/Step1Customer';
import Step2DeviceProvisioning from './components/Step2DeviceProvisioning';
import Step3PaymentPlan from './components/Step3PaymentPlan';
import Step4Contract from './components/Step4Contract';
import Step5SummaryInvoice from './components/Step5SummaryInvoice';

import Stepper from './components/Stepper';

// import { toast } from 'react-toastify';
import { useAuth } from '../../common/context/AuthProvider';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

const PaymentsFlow = ({ initialData: initialFlowData, onFinalize, onBackToParent, customers: propCustomers }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(initialFlowData || {});
    const [customers, setCustomers] = useState(propCustomers || []);
    const { user } = useAuth();

    const stepNames = [
        'Info Cliente',
        'Aprov. Dispositivo',
        'Pago y Plan',
        'Contrato',
        'Resumen y Factura'
    ];
    const totalSteps = stepNames.length;

    useEffect(() => {
        if (user && !formData.authenticatedUser) {
            setFormData(prevData => ({ ...prevData, authenticatedUser: user }));
        }
    }, [user, formData.authenticatedUser]);

    const handleNext = (data) => {
        setFormData(prevData => {
            const updatedData = { ...prevData, ...data };
            console.log(`Datos acumulados después de Paso ${currentStep}:`, updatedData);
            return updatedData;
        });
        setCurrentStep(prevStep => prevStep + 1);
    };

    const handleBack = () => {
        if (currentStep === 1) {
            onBackToParent();
        } else {
            setCurrentStep(prevStep => prevStep - 1);
        }
    };

    const handleFinalize = (finalData) => {
        if (onFinalize) {
            onFinalize({ ...formData, ...finalData });
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1Customer onNext={handleNext} onBack={handleBack} initialData={formData} customers={customers} />;
            case 2:
                // Asegúrate de que Step2DeviceProvisioning pase el objeto 'device' correctamente
                return <Step2DeviceProvisioning onNext={handleNext} onBack={handleBack} initialData={formData} />;
            case 3:
                // Aquí, formData.device ya debería estar disponible
                return <Step3PaymentPlan onNext={handleNext} onBack={handleBack} initialData={formData} />;
            case 4:
                return <Step4Contract onNext={handleNext} onBack={handleBack} initialData={formData} />;
            case 5:
                return <Step5SummaryInvoice onBack={handleBack} onFinalize={handleFinalize} initialData={formData} />;
            default:
                return <div>Flujo de pagos completo.</div>;
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <button
                    onClick={handleBack}
                    className="mr-3 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                    title="Volver al paso anterior"
                >
                    <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
                </button>
                Registrar Nueva Factura de Venta
            </h1>
            <Stepper
                currentStep={currentStep}
                totalSteps={totalSteps}
                stepNames={stepNames}
            />

            {renderStep()}
        </div>
    );
};

export default PaymentsFlow;