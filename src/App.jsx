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
import ReportsPage from "./pages/reports/ReportsPage"
import UserProfilePage from "./pages/users/UserProfilePage"


import Login from './pages/auth/LoginPage';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Landing from './pages/LandingPage';


const ProtectedRoute = ({ allowedRoles }) => { 
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(`Acceso denegado: Usuario ${user.username} con rol ${user.role} intentó acceder a una ruta para roles: ${allowedRoles.join(', ')}`);

    return <Navigate to="/dashboard" replace />;
  }


  return <Outlet />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />


          <Route element={<ProtectedRoute allowedRoles={['Superadmin', 'Admin', 'Vendedor']} />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />

              <Route path="dashboard" element={<Dashboard />} />
              <Route path="user-management" element={<UserManagementPage />} />
              <Route path="customers-management" element={<CustomerManagementPage />} />
              <Route path="customer-registration" element={<CustomerRegisterFlowPage />} />
              <Route path="vendors-management" element={<VendorManagementPage />} />
              <Route path="devices-management" element={<DeviceManagementPage />} />
              <Route path="payments-management" element={<PaymentManagementPage />} />
              <Route path="reports" element={<ReportsPage />} />

              <Route path="profile" element={<UserProfilePage />} />

              <Route path="*" element={<div>404 - Página no encontrada (Dentro del Layout de Admin)</div>} />
            </Route>
          </Route>


          <Route element={<ProtectedRoute allowedRoles={['Cliente']} />}>
            <Route path="/client/dashboard" element={<ClientDashboardPage />} />
            <Route path="/client/devices/:deviceId" element={<ClientDeviceDetailsView />} />
            <Route path="/client/make-payment" element={<ClientMakePaymentPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />


          <Route path="*" element={<div>404 - Página no encontrada</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;