import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import QRCode from 'react-qr-code';
import { generateProvisioningJson } from '../../../common/utils/provisioning';

const ReEnrollmentModal = ({ enrollmentId, deviceId, isOpen, onClose }) => {

    const [qrProvisioningData, setQrProvisioningData] = useState(null);
    
    useEffect(() => {
      // Obtener el objeto del localStorage
      const storedUser = localStorage.getItem("user"); // Usa la clave con la que guardaste el objeto
      if (!storedUser) {
        console.log("No se encontró el datos del usuario en el localStorage");
        return;  
      }

      var storeId = null;
      try {
        const user = JSON.parse(storedUser); // Convertir de JSON a objeto
        storeId = user.store?.id; // Acceder al ID del store (usa optional chaining por seguridad)
        console.log("Store ID:", storeId);
      } catch (error) {
        console.error("Error al parsear el objeto del localStorage", error);
      }

        const provisioningJson = generateProvisioningJson(enrollmentId, storeId, true);
        console.log("Store ID:", provisioningJson);
        setQrProvisioningData(provisioningJson);
      }, [enrollmentId, deviceId]);
    
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-[9999] bg-gray-600 bg-opacity-50 flex items-center justify-center"
                onClose={onClose}
            >
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                    >
                    <Dialog.Panel className="w-auto max-w-full transform overflow-visible rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                        >
                        Enrolar dispositivo
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-white text-sm font-medium text-gray-400 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={onClose}
                        >
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                        </Dialog.Title>
                        <div className="text-center p-4">
                            <p className="text-lg font-medium text-gray-700">Escanea el siguiente QR:</p>
                            <div className="mt-4 flex justify-center">
                            <QRCode value={JSON.stringify(qrProvisioningData)} size={256} />
                            </div>
                            <p className="text-sm text-gray-500 mt-4">
                            ID de Enrolamiento: <strong className="text-blue-600">{enrollmentId}</strong>
                            </p>
                        </div>
                    </Dialog.Panel>
                    </Transition.Child>
                </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ReEnrollmentModal;