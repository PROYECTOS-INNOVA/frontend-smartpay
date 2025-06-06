import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import CustomerManagement from './pages/CustomerManagement';
import DeviceManagement from './pages/DeviceManagement';
import PaymentBilling from './pages/PaymentBilling';
import AgentConfig from './pages/AgentConfig';
import Reports from './pages/Reports';
import PaymentReminders from './pages/PaymentReminders';
import AutoBlock from './pages/AutoBlock';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Landing from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/*" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="devices" element={<DeviceManagement />} />
          <Route path="payments" element={<PaymentBilling />} />
          <Route path="agent-config" element={<AgentConfig />} />
          <Route path="reports" element={<Reports />} />
          <Route path="payment-reminders" element={<PaymentReminders />} />
          <Route path="auto-block" element={<AutoBlock />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;