import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const Stepper = ({ currentStep, totalSteps, stepNames }) => {

    console.log("Stepper props: currentStep", currentStep, "totalSteps", totalSteps, "stepNames", stepNames);

    return (
        <div className="flex items-center justify-center space-x-4 mb-8">
            {Array.from({ length: totalSteps }).map((_, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isActive = stepNumber === currentStep;

                // console.log para depurar cada paso:
                console.log(`Paso ${stepNumber}: isCompleted=${isCompleted}, isActive=${isActive}, Name=${stepNames[index]}`);

                return (
                    <div key={stepNumber} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300
                                ${isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                {isCompleted ? (
                                    <CheckCircleIcon className="h-5 w-5 text-white" />
                                ) : (
                                    <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-700'}`}>
                                        {stepNumber}
                                    </span>
                                )}
                            </div>
                            {stepNames && stepNames[index] && (
                                <span className={`mt-2 text-xs font-medium text-center transition-colors duration-300
                                    ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                                    {stepNames[index]}
                                </span>
                            )}
                        </div>
                        {index < totalSteps - 1 && (
                            <div className={`flex-auto border-t-2 ml-4 mr-4 transition-colors duration-300
                                ${isCompleted ? 'border-green-500' : isActive ? 'border-blue-600' : 'border-gray-300'}`}></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Stepper;