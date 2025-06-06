import { useState } from 'react';
import { Cog6ToothIcon, CheckIcon } from '@heroicons/react/24/outline';

const AgentConfig = () => {
    const [settings, setSettings] = useState({
        autoBlock: true,
        paymentReminder: true,
        reminderDays: 3,
        commissionRate: 15,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    return (
        <div>
            <div className="flex items-center mb-6">
                <Cog6ToothIcon className="h-6 w-6 text-blue-500 mr-2" />
                <h1 className="text-2xl font-bold text-gray-800">Configuración de agente</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <form className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <label htmlFor="autoBlock" className="block text-sm font-medium text-gray-700">
                                Bloqueo automático
                            </label>
                            <p className="text-sm text-gray-500">
                                Bloquear dispositivos automáticamente cuando el pago está vencido
                            </p>
                        </div>
                        <div className="flex items-center h-5">
                            <input
                                id="autoBlock"
                                name="autoBlock"
                                type="checkbox"
                                checked={settings.autoBlock}
                                onChange={handleChange}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label htmlFor="paymentReminder" className="block text-sm font-medium text-gray-700">
                                Recordatorio de pago
                            </label>
                            <p className="text-sm text-gray-500">
                                Enviar recordatorios de pago a los clientes
                            </p>
                        </div>
                        <div className="flex items-center h-5">
                            <input
                                id="paymentReminder"
                                name="paymentReminder"
                                type="checkbox"
                                checked={settings.paymentReminder}
                                onChange={handleChange}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="reminderDays" className="block text-sm font-medium text-gray-700">
                            Días antes del recordatorio
                        </label>
                        <input
                            type="number"
                            id="reminderDays"
                            name="reminderDays"
                            value={settings.reminderDays}
                            onChange={handleChange}
                            className="mt-1 block w-20 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700">
                            Tasa de comisión (%)
                        </label>
                        <input
                            type="number"
                            id="commissionRate"
                            name="commissionRate"
                            value={settings.commissionRate}
                            onChange={handleChange}
                            className="mt-1 block w-20 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="button"
                            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <CheckIcon className="h-5 w-5 mr-2" />
                            Guardar configuración
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgentConfig;