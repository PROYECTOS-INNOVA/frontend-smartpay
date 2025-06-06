import { useState } from 'react';
import { DataTable } from '../components/ui/DataTable';
import {
    LockClosedIcon,
    LockOpenIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const AutoBlock = () => {
    const [devices] = useState([
        { id: 1, imei: '123456789012345', client: 'Juan Pérez', daysOverdue: 5, status: 'pending' },
        { id: 2, imei: '234567890123456', client: 'María García', daysOverdue: 10, status: 'blocked' },
        { id: 3, imei: '345678901234567', client: 'Carlos López', daysOverdue: 15, status: 'unblocked' },
    ]);

    const [autoBlockEnabled, setAutoBlockEnabled] = useState(true);
    const [gracePeriod, setGracePeriod] = useState(7);

    const columns = [
        { Header: 'IMEI', accessor: 'imei' },
        { Header: 'Cliente', accessor: 'client' },
        { Header: 'Días de retraso', accessor: 'daysOverdue' },
        {
            Header: 'Estado',
            accessor: 'status',
            Cell: ({ value }) => {
                const statusMap = {
                    pending: { icon: ExclamationTriangleIcon, color: 'text-yellow-500', text: 'Pendiente' },
                    blocked: { icon: LockClosedIcon, color: 'text-red-500', text: 'Bloqueado' },
                    unblocked: { icon: LockOpenIcon, color: 'text-green-500', text: 'Desbloqueado' },
                };
                const Icon = statusMap[value].icon;
                return (
                    <div className={`flex items-center ${statusMap[value].color}`}>
                        <Icon className="h-5 w-5 mr-1" />
                        {statusMap[value].text}
                    </div>
                );
            }
        },
        {
            Header: 'Acción',
            accessor: 'action',
            Cell: ({ row }) => (
                <button className={`px-3 py-1 rounded-md text-sm font-medium ${row.original.status === 'blocked' ?
                        'bg-green-100 text-green-800 hover:bg-green-200' :
                        'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}>
                    {row.original.status === 'blocked' ? 'Desbloquear' : 'Bloquear'}
                </button>
            ),
        },
    ];

    return (
        <div>
            <div className="flex items-center mb-6">
                <LockClosedIcon className="h-6 w-6 text-blue-500 mr-2" />
                <h1 className="text-2xl font-bold text-gray-800">Programación de bloqueo automático</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold">Dispositivos con pagos atrasados</h2>
                        <div className="flex items-center">
                            <span className="mr-2 text-sm">Bloqueo automático:</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={autoBlockEnabled}
                                    onChange={() => setAutoBlockEnabled(!autoBlockEnabled)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                    <DataTable columns={columns} data={devices} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Configuración</h2>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="gracePeriod" className="block text-sm font-medium text-gray-700">
                                Período de gracia (días)
                            </label>
                            <input
                                type="number"
                                id="gracePeriod"
                                value={gracePeriod}
                                onChange={(e) => setGracePeriod(parseInt(e.target.value))}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="pt-2">
                            <button className="flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <CheckCircleIcon className="h-5 w-5 mr-2" />
                                Guardar configuración
                            </button>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg mt-6">
                            <h3 className="text-sm font-medium text-blue-800 mb-2">Resumen</h3>
                            <p className="text-sm text-blue-700">
                                {autoBlockEnabled ? (
                                    <>Los dispositivos se bloquearán automáticamente después de <span className="font-semibold">{gracePeriod} días</span> de retraso en el pago.</>
                                ) : (
                                    <>El bloqueo automático está <span className="font-semibold">desactivado</span>. Los dispositivos no se bloquearán automáticamente.</>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutoBlock;