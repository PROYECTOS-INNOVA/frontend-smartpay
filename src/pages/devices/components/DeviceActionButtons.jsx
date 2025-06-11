// src/pages/devices/components/DeviceActionsButtons.jsx
import React from 'react';
import { LockClosedIcon, LockOpenIcon, MapPinIcon, DeviceTabletIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const DeviceActionsButtons = ({ deviceId, mdmStatus, onBlock, onUnblock, onLocate, onRelease, onMakePayment }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <button
                onClick={() => onBlock(deviceId)}
                disabled={mdmStatus === 'Bloqueado'}
                className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white
                    ${mdmStatus === 'Bloqueado' ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'}`}
            >
                <LockClosedIcon className="h-5 w-5 mr-2" />
                Bloquear
            </button>
            <button
                onClick={() => onUnblock(deviceId)}
                disabled={mdmStatus !== 'Bloqueado'}
                className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white
                    ${mdmStatus !== 'Bloqueado' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}`}
            >
                <LockOpenIcon className="h-5 w-5 mr-2" />
                Desbloquear
            </button>
            <button
                onClick={() => onLocate(deviceId)}
                className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <MapPinIcon className="h-5 w-5 mr-2" />
                Localizar
            </button>
            <button
                onClick={() => onRelease(deviceId)}
                disabled={mdmStatus === 'Liberado'}
                className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white
                    ${mdmStatus === 'Liberado' ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'}`}
            >
                <DeviceTabletIcon className="h-5 w-5 mr-2" />
                Liberar Dispositivo
            </button>
            <button
                onClick={() => onMakePayment(deviceId)}
                className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
                <CreditCardIcon className="h-5 w-5 mr-2" />
                Realizar Pago
            </button>
        </div>
    );
};

export default DeviceActionsButtons;