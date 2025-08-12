import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

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
            ...stepData
        }));
        setCurrentStep(prevStep => prevStep + 1);
    };

    const handleBack = () => {
        setCurrentStep(prevStep => prevStep - 1);
    };

    const handleFinalizeRegistration = async () => {
        Swal.fire({
            title: 'Registrando cliente y dispositivo...',
            text: 'Esto puede tardar un momento, por favor espera.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            console.log('Finalizando registro con los siguientes datos:', registrationData);
            await new Promise(resolve => setTimeout(resolve, 2000));

            Swal.close();
            Swal.fire({
                icon: 'success',
                title: '¡Registro Exitoso!',
                text: 'El cliente y el dispositivo han sido registrados correctamente.',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
            });
            navigate('/customer-management');
        } catch (error) {
            Swal.close();
            console.error('Error al finalizar el registro:', error);
            let errorMessage = 'Ocurrió un error al registrar el cliente y dispositivo.';
            if (error.response && error.response.data && error.response.data.detail) {
                errorMessage = error.response.data.detail;
            } else if (error.message) {
                errorMessage = error.message;
            }

            Swal.fire({
                icon: 'error',
                title: 'Error en el Registro',
                text: errorMessage,
                confirmButtonText: 'Entendido'
            });
        }
    };

    const renderStep = () => {
        /*switch (currentStep) {
            case 1:
                return <Step1_CustomerInfo onNext={handleNext} initialData={registrationData.customerInfo} />;
            case 2:
                return <Step2_ContractUpload onNext={handleNext} onBack={handleBack} initialData={registrationData.contractInfo} />;
            case 3:
                return <Step3_DeviceProvisioning onNext={handleNext} onBack={handleBack} initialData={registrationData.deviceInfo} customerId={registrationData.customerId} />;
            case 4:
                return <Step4_Summary onFinalize={handleFinalizeRegistration} onBack={handleBack} registrationData={registrationData} />;
            default:*/
                return <div>Paso no encontrado</div>;
        //}
    };

    const stepNames = [
        { name: 'Información del Cliente', short: 'Card Details' },
        { name: 'Subida de Contrato', short: 'Form Review' },
        { name: 'Provisionamiento Dispositivo', short: 'Authentication' },
        { name: 'Resumen y Confirmación', short: 'Create Code' },
    ];

    const getStepStatus = (index) => {
        if (currentStep > index + 1) {
            return 'completed';
        } else if (currentStep === index + 1) {
            return 'in-progress';
        } else {
            return 'pending';
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Registro de Nuevo Cliente y Dispositivo
            </h1>

            <nav className="flex justify-center mb-12">
                <ol className="flex items-center w-full max-w-2xl text-center">
                    {stepNames.map((step, index) => {
                        const status = getStepStatus(index);
                        const isLastStep = index === stepNames.length - 1;

                        return (
                            <React.Fragment key={index}>
                                <li className="flex flex-col items-center flex-1">
                                    <div className={`relative flex items-center justify-center w-8 h-8 rounded-full ${status === 'completed' ? 'bg-green-500' :
                                            status === 'in-progress' ? 'border-2 border-blue-500 bg-white' :
                                                'bg-gray-300'
                                        }`}>
                                        {status === 'completed' ? (
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        ) : (
                                            <div className={`w-3 h-3 rounded-full ${status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                                        )}
                                    </div>
                                    <div className={`mt-2 text-sm font-medium ${status === 'completed' ? 'text-green-600' :
                                            status === 'in-progress' ? 'text-blue-600' :
                                                'text-gray-500'
                                        }`}>
                                        {step.name}
                                    </div>
                                    <div className={`text-xs ${status === 'completed' ? 'text-green-500' :
                                            status === 'in-progress' ? 'text-blue-500' :
                                                'text-gray-400'
                                        }`}>
                                        {status === 'completed' ? 'Completed' :
                                            status === 'in-progress' ? 'In Progress' :
                                                'Pending'}
                                    </div>
                                </li>
                                {!isLastStep && (
                                    <div className={`flex-1 h-1 mx-2 ${status === 'completed' ? 'bg-green-500' :
                                            status === 'in-progress' ? 'bg-blue-500' :
                                                'bg-gray-300'
                                        }`}></div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </ol>
            </nav>


            <div className="bg-white p-6 rounded-lg shadow">
                {renderStep()}
            </div>
        </div>
    );
};

export default CustomerRegisterFlowPage;