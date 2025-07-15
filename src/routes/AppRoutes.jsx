import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from '../common/context/AuthProvider';
import PrivateRoute from './PrivateRoute';

import Layout from '../common/components/layout/Layout';

// Rutas de Autenticación
const LoginPage = lazy(() => import('../features/auth/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/Register'));
const ForgotPasswordPage = lazy(() => import('../features/auth/ForgotPassword'));

// Rutas Generales / Dashboard
const LandingPage = lazy(() => import('../common/pages/LandingPage'));
const DashboardPage = lazy(() => import('../features/dashboard/Dashboard'));

// Rutas de Gestión de Usuarios y Clientes
const UserManagementPage = lazy(() => import('../features/users/UserManagementPage'));
const UserProfilePage = lazy(() => import('../features/users/UserProfilePage'));
const CustomerManagementPage = lazy(() => import('../features/customers/CustomerManagementPage'));
const CustomerRegisterFlowPage = lazy(() => import('../features/customers/CustomerRegisterFlowPage'));

// Rutas de Gestión de Dispositivos y Vendedores
const DeviceManagementPage = lazy(() => import('../features/devices/DeviceManagementPage'));
const VendorManagementPage = lazy(() => import('../features/vendors/VendorManagementPage'));

// Rutas de Gestión de Pagos y Reportes
const PaymentManagementPage = lazy(() => import('../features/payments/PaymentManagementPage'));
const ReportsPage = lazy(() => import('../features/reports/ReportsPage'));

// Rutas de la PWA del Cliente
const ClientDashboardPage = lazy(() => import('../features/client-pwa/ClientDashboardPage'));
const ClientDeviceDetailsView = lazy(() => import('../features/client-pwa/ClientDeviceDetailsView'));
const ClientMakePaymentPage = lazy(() => import('../features/client-pwa/ClientMakePaymentPage'));

const ConfigurationPage = lazy(() => import('../features/config/ConfigurationPage'));

const AppRoutes = () => {
    return (
        <Router>
            <AuthProvider>
                <Suspense fallback={
                    <div className="flex justify-center items-center h-screen text-xl text-white">
                        Cargando contenido...
                    </div>
                }>
                    <Routes>
                        {/* Rutas Públicas */}
                        <Route path="/landing" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                        {/* **CAMBIO IMPORTANTE AQUÍ:**
                            La ruta raíz ahora redirige a /landing. 
                            Las rutas protegidas con un path="/" dentro del PrivateRoute
                            deben ser ajustadas o ser rutas sin 'path' (index) 
                            si se quiere que Dashboard sea la página de inicio para usuarios autenticados.

                            Si un usuario no autenticado intenta acceder a una ruta protegida,
                            PrivateRoute debería redirigirlos al login (que puede ser configurado
                            para redirigir a /landing si falla la autenticación).
                        */}
                        <Route path="/" element={<Navigate to="/landing" replace />} />

                        {/* =========================================================
                        Rutas Protegidas para Superadmin, Admin, Vendedor
                        Usan el Layout principal
                        ========================================================= */}
                        {/* Este PrivateRoute debe contener las rutas que solo son accesibles
                            después del login. La ruta base para estas debería ser algo como
                            "/dashboard" o simplemente dejar el "index" para el primer elemento
                            dentro del Layout si ya está autenticado.
                        */}
                        <Route element={<PrivateRoute allowedRoles={['Superadmin', 'Admin', 'Vendedor']} />}>
                            {/* Si queremos que el Dashboard sea el "home" para usuarios autenticados,
                                necesitamos asegurarnos de que la ruta raíz dentro de PrivateRoute
                                los lleve directamente allí, sin colisionar con la redirección pública.
                                Aquí asumimos que al autenticarse, el usuario será redirigido a /dashboard.
                                Por lo tanto, no necesitamos un <Route path="/" element={<Layout />} />
                                que colisione con la redirección pública, a menos que el layout
                                sea el "envoltorio" de todas las rutas protegidas.
                            */}

                            {/* La ruta del Layout ahora solo se activa en /dashboard o subrutas */}
                            <Route element={<Layout />}>
                                <Route path="/dashboard" element={<DashboardPage />} /> {/* Aseguramos que DashboardPage sea en /dashboard */}
                                <Route path="user-management" element={<UserManagementPage />} />
                                <Route path="customers-management" element={<CustomerManagementPage />} />
                                <Route path="customer-registration" element={<CustomerRegisterFlowPage />} />
                                <Route path="vendors-management" element={<VendorManagementPage />} />
                                <Route path="devices-management" element={<DeviceManagementPage />} />
                                <Route path="payments-management" element={<PaymentManagementPage />} />
                                <Route path="reports" element={<ReportsPage />} />
                                <Route path="profile" element={<UserProfilePage />} />
                                <Route path="configuration" element={<ConfigurationPage />} />
                            </Route>
                            {/* Si la intención es que después de iniciar sesión SIEMPRE vaya a /dashboard
                                y si se intenta acceder a "/" estando logeado, vaya a /dashboard,
                                podemos agregar una redirección específica para usuarios logeados.
                            */}
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        </Route>

                        {/* =========================================================
                        Rutas Protegidas para Clientes (PWA)
                        No usan el Layout principal del admin
                        ========================================================= */}
                        <Route element={<PrivateRoute allowedRoles={['Cliente']} />}>
                            <Route path="/client/dashboard" element={<ClientDashboardPage />} />
                            <Route path="/client/devices/:deviceId" element={<ClientDeviceDetailsView />} />
                            <Route path="/client/make-payment" element={<ClientMakePaymentPage />} />
                            {/* Opcional: Redirigir la raíz para clientes a su dashboard */}
                            <Route path="/" element={<Navigate to="/client/dashboard" replace />} />
                        </Route>

                        {/* Catch-all para cualquier otra ruta no manejada */}
                        <Route path="*" element={<div className="flex justify-center items-center h-screen text-xl text-white">404 - Página no encontrada</div>} />
                    </Routes>
                </Suspense>
            </AuthProvider>
        </Router>
    );
};

export default AppRoutes;