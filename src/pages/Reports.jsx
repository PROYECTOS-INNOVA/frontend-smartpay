import { useState } from 'react';
import { BarChart, PieChart } from '../components/ui/Charts';
import {
    ChartBarIcon,
    CalendarIcon,
    ArrowDownIcon,
    ArrowUpIcon
} from '@heroicons/react/24/outline';

const Reports = () => {
    const [timeRange, setTimeRange] = useState('monthly');

    // --- Datos de Ventas para Nivo ---
    const salesDataNivo = [
        { month: 'Ene', 'Ventas 2023': 1200 },
        { month: 'Feb', 'Ventas 2023': 1900 },
        { month: 'Mar', 'Ventas 2003': 3000 }, // Corregido el año para ejemplo consistente
        { month: 'Abr', 'Ventas 2023': 5000 },
        { month: 'May', 'Ventas 2023': 2000 },
        { month: 'Jun', 'Ventas 2023': 3000 },
        { month: 'Jul', 'Ventas 2023': 4000 },
        { month: 'Ago', 'Ventas 2023': 5000 },
        { month: 'Sep', 'Ventas 2023': 6000 },
        { month: 'Oct', 'Ventas 2023': 7000 },
        { month: 'Nov', 'Ventas 2023': 8000 },
        { month: 'Dic', 'Ventas 2023': 9000 },
    ];

    // --- Datos de Pagos para Nivo ---
    const paymentDataNivo = [
        { month: 'Ene', 'Pagos recibidos': 1000, 'Pagos pendientes': 200 },
        { month: 'Feb', 'Pagos recibidos': 1500, 'Pagos pendientes': 400 },
        { month: 'Mar', 'Pagos recibidos': 2500, 'Pagos pendientes': 500 },
        { month: 'Abr', 'Pagos recibidos': 4000, 'Pagos pendientes': 1000 },
        { month: 'May', 'Pagos recibidos': 1800, 'Pagos pendientes': 200 },
        { month: 'Jun', 'Pagos recibidos': 2800, 'Pagos pendientes': 200 },
        { month: 'Jul', 'Pagos recibidos': 3800, 'Pagos pendientes': 200 },
        { month: 'Ago', 'Pagos recibidos': 4800, 'Pagos pendientes': 200 },
        { month: 'Sep', 'Pagos recibidos': 5800, 'Pagos pendientes': 200 },
        { month: 'Oct', 'Pagos recibidos': 6800, 'Pagos pendientes': 200 },
        { month: 'Nov', 'Pagos recibidos': 7800, 'Pagos pendientes': 200 },
        { month: 'Dic', 'Pagos recibidos': 8800, 'Pagos pendientes': 200 },
    ];

    const paymentColorsMap = {
        'Pagos recibidos': '#10B981', // green
        'Pagos pendientes': '#EF4444', // red
    };

    // --- Datos de Dispositivos por estado para el PieChart ---
    const deviceStatusData = [
        { id: 'Activos', label: 'Activos', value: 1245, color: '#10B981' }, // Verde
        { id: 'Bloqueados', label: 'Bloqueados', value: 87, color: '#EF4444' }, // Rojo
        { id: 'Vendidos', label: 'Vendidos', value: 532, color: '#3B82F6' }, // Azul
        { id: 'Pendientes', label: 'Pendientes', value: 21, color: '#F59E0B' }, // Amarillo
    ];


    return (
        <div>
            {/* Encabezado de la página */}
            <div className="flex items-center mb-6">
                <ChartBarIcon className="h-6 w-6 text-blue-500 mr-2" />
                <h1 className="text-2xl font-bold text-gray-800">Reportes y análisis</h1>
            </div>

            {/* Controles y métricas rápidas */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <select
                        className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option value="daily">Diario</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensual</option>
                        <option value="yearly">Anual</option>
                    </select>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <ArrowUpIcon className="h-5 w-5 text-green-500 mr-1" />
                        <span className="text-sm font-medium">12% más que el mes pasado</span>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        Exportar
                    </button>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="h-80 w-full"> {/* Asegúrate de que el div tenga ancho completo */}
                    <BarChart
                        data={salesDataNivo}
                        keys={['Ventas 2023']}
                        indexBy="month"
                        title="Ventas Totales por Mes"
                        subTitle="Rendimiento de ventas durante el año 2023"
                        barColorsMap={{ 'Ventas 2023': '#3B82F6' }}
                    />
                </div>



                <div className="h-80 w-full"> {/* Asegúrate de que el div tenga ancho completo */}
                    <BarChart
                        data={paymentDataNivo}
                        keys={['Pagos recibidos', 'Pagos pendientes']}
                        indexBy="month"
                        groupMode="grouped"
                        barColorsMap={paymentColorsMap}
                        title="Desglose de Pagos"
                        subTitle="Comparación de pagos recibidos y pendientes"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Resumen</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Total de dispositivos</p>
                            <p className="text-2xl font-semibold">1,845</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Clientes activos</p>
                            <p className="text-2xl font-semibold">1,230</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Ingresos mensuales</p>
                            <p className="text-2xl font-semibold">$45,670.00</p>
                        </div>
                    </div>
                </div>


                <div className="h-80 w-full"> {/* Asegúrate de que el div tenga ancho completo */}
                    <PieChart
                        data={deviceStatusData}
                        title="Distribución de Dispositivos"
                        subTitle="Estado actual de los dispositivos en el sistema"
                    />
                </div>

            </div>
        </div>
    );
};

export default Reports;