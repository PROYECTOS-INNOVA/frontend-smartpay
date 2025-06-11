// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'; // Asegúrate de importar Outlet
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthProvider';

import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import UserManagementPage from './pages/users/UserManagementPage';
import CustomerManagementPage from './pages/customers/CustomerManagementPage';
import CustomerRegisterFlowPage from './pages/customers/CustomerRegisterFlowPage';
import DeviceManagementPage from './pages/devices/DeviceManagementPage';
import VendorManagementPage from './pages/vendors/VendorManagementPage';
import PaymentManagementPage from './pages/payments/PaymentManagementPage';
import ClientDashboardPage from './pages/client-pwa/ClientDashboardPage';
import ClientDeviceDetailsView from './pages/client-pwa/ClientDeviceDetailsView';
import ClientMakePaymentPage from './pages/client-pwa/ClientMakePaymentPage';


const AgentConfigPage = () => <div>Página de Configuración de Agentes (Pendiente)</div>;
const ReportsPage = () => <div>Página de Reportes (Pendiente)</div>;
const PaymentRemindersPage = () => <div>Página de Recordatorios de Pago (Pendiente)</div>;
const AutoBlockPage = () => <div>Página de Auto Bloqueo (Pendiente)</div>;


import Login from './pages/auth/LoginPage';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Landing from './pages/LandingPage';


const ProtectedRoute = ({ allowedRoles }) => { 
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay roles permitidos y el rol del usuario no está en esa lista, redirige al dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(`Acceso denegado: Usuario ${user.username} con rol ${user.role} intentó acceder a una ruta para roles: ${allowedRoles.join(', ')}`);
    // Redirige al dashboard o a una página de "Acceso Denegado"
    // CONSIDERAR: A dónde redirigir a un cliente que intente acceder a rutas de admin?
    // Podría ser a su dashboard de cliente, o a una página de "acceso denegado".
    // Por ahora, redirige al dashboard general, lo cual el AuthProvider debería manejar.
    return <Navigate to="/dashboard" replace />;
  }

  // Si todo está bien, renderiza las rutas hijas a través de Outlet
  return <Outlet />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Grupo de Rutas Protegidas para Superadmin, Admin, Vendedor (con Layout) */}
          {/* Aquí el Layout se renderiza como el componente principal, y contendrá su propio <Outlet /> */}
          <Route element={<ProtectedRoute allowedRoles={['Superadmin', 'Admin', 'Vendedor']} />}>
            {/* El componente Layout DEBE contener un <Outlet /> donde se renderizarán las rutas hijas */}
            <Route path="/" element={<Layout />}> {/* <-- Path "/" para que el Layout se muestre en el root */}
              {/* Ruta por defecto dentro del Layout (redirecciona '/' a '/dashboard') */}
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* Rutas de Administración - Paths son RELATIVOS al path del padre (que es '/') */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="agent-config" element={<AgentConfigPage />} />
              <Route path="user-management" element={<UserManagementPage />} />
              <Route path="customers-management" element={<CustomerManagementPage />} />
              <Route path="customer-registration" element={<CustomerRegisterFlowPage />} />
              <Route path="vendors-management" element={<VendorManagementPage />} />
              <Route path="devices-management" element={<DeviceManagementPage />} />
              <Route path="payment-management" element={<PaymentManagementPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="payment-reminders" element={<PaymentRemindersPage />} />
              <Route path="auto-block" element={<AutoBlockPage />} />

              {/* Ruta 404 para cualquier URL no definida dentro del Layout de Admin */}
              <Route path="*" element={<div>404 - Página no encontrada (Dentro del Layout de Admin)</div>} />
            </Route>
          </Route>

          {/* Grupo de Rutas Protegidas para el Cliente (PWA) - SIN el Layout de Admin/Vendedor */}
          {/* Estas rutas son hermanas del bloque anterior y sus paths son absolutos. */}
          <Route element={<ProtectedRoute allowedRoles={['Cliente']} />}>
            <Route path="/client/dashboard" element={<ClientDashboardPage />} />
            <Route path="/client/devices/:deviceId" element={<ClientDeviceDetailsView />} />
            <Route path="/client/make-payment" element={<ClientMakePaymentPage />} />
          </Route>

          {/* Ruta de redirección general para '/' si el usuario no encaja en las rutas de cliente.
              Idealmente, la lógica de redirección post-login debería manejar esto.
          */}
          <Route path="/" element={<Navigate to="/login" replace />} />


          {/* Ruta 404 global para cualquier URL que no coincida */}
          <Route path="*" element={<div>404 - Página no encontrada</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;