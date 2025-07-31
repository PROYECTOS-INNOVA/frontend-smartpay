import { use, useEffect, useMemo, useState } from 'react';
import Cards from '../../common/components/ui/Cards';
import { PieChart, BarChart } from '../../common/components/ui/Charts';
import { useAuth } from '../../common/context/AuthProvider';
import { showNewUserAlert } from '../../common/utils/auth';
import { useNavigate } from 'react-router-dom';
import ReportsPage from '../reports/ReportsPage.jsx';
import { getCurrentStore } from '../../common/utils/helpers.js';
import { set } from 'lodash';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [isNew, setIsNew] = useState(false);
    const navigate = useNavigate();
    const [nameStore, setNameStore] = useState(null);

    const fetchUserData = async () => {
        await showNewUserAlert(user, setIsNew, logout, navigate);
    }

    useEffect(() => {
        const data = getCurrentStore()
        setNameStore(data?.nombre)
        fetchUserData();
    }, [])

    const stats = useMemo(() => ({
        activeDevices: 1245,
        blockedDevices: 87,
        soldDevices: 532,
        pendingPayments: 23,
    }), []);

    const nivoPieData = useMemo(() => {
        const dataForPie = [
            { id: 'Activos', label: 'Activos', value: stats.activeDevices, color: '#40ace8' },
            { id: 'Bloqueados', label: 'Bloqueados', value: stats.blockedDevices, color: '#EF4444' },
            { id: 'Vendidos', label: 'Vendidos', value: stats.soldDevices, color: '#3B82F6' },
        ];
        return dataForPie;
    }, [stats]);

    const nivoBarData = useMemo(() => {
        const chartJsLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const chartJsDatasets = [
            {
                label: 'Dispositivos activos',
                data: [120, 190, 300, 500, 200, 300, 400, 500, 600, 700, 800, 900],
            },
            {
                label: 'Dispositivos bloqueados',
                data: [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130],
            },
        ];

        return chartJsLabels.map((label, i) => {
            const nivoObject = { month: label };
            chartJsDatasets.forEach(dataset => {
                nivoObject[dataset.label] = dataset.data[i];
            });
            return nivoObject;
        });
    }, []);

    const nivoBarKeys = ['Dispositivos activos', 'Dispositivos bloqueados'];

    const barColors = {
        'Dispositivos activos': '#10B981',
        'Dispositivos bloqueados': '#EF4444',
    };

    return (
        // Contenedor principal con fondo gris claro y padding
        <div className="min-h-screen bg-gray-100 ">
            {/* Contenedor blanco para todo el contenido del dashboard */}
            <main className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
                {/* Card tipo Hero para el mensaje de bienvenida */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 sm:p-8 rounded-lg shadow-lg mb-6 sm:mb-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                        ¡Bienvenido {nameStore ? `a ${nameStore}` : 'de nuevo'}!
                    </h2>
                    <p className="text-lg sm:text-xl opacity-90">Gestión eficiente de tus dispositivos con SmartPay.</p>
                </div>

                <ReportsPage />

                {/* <header className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard SmartPay</h1>
                </header>

                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <Cards
                        title="Dispositivos activos"
                        value={stats.activeDevices.toLocaleString()}
                        icon="device"
                        color="green"
                        change="+12% este mes"
                    />
                    <Cards
                        title="Dispositivos bloqueados"
                        value={stats.blockedDevices.toLocaleString()}
                        icon="block"
                        color="red"
                        change="+5% este mes"
                    />
                    <Cards
                        title="Dispositivos vendidos (total)"
                        value={stats.soldDevices.toLocaleString()}
                        icon="sold"
                        color="blue"
                        change="+23% este mes"
                    />
                    <Cards
                        title="Pagos pendientes"
                        value={stats.pendingPayments.toLocaleString()}
                        icon="payment"
                        color="yellow"
                        change="-3% este mes"
                    />
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <PieChart
                        data={nivoPieData}
                        title="Distribución de Dispositivos"
                        subTitle="Estado general del inventario"
                    />
                    <BarChart
                        data={nivoBarData}
                        keys={nivoBarKeys}
                        indexBy="month"
                        title="Actividad Mensual de Dispositivos"
                        subTitle="Comparativa mensual"
                        barColorsMap={barColors}
                        groupMode="grouped"
                    />
                </section> */}
            </main>
        </div>
    );
};

export default Dashboard;