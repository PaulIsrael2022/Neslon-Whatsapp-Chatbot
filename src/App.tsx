import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './components/Auth/LoginPage';
import Dashboard from './pages/Dashboard';
import OrdersPage from './pages/Orders';
import PatientsPage from './pages/Patients';
import InventoryPage from './pages/Inventory';
import DeliveriesPage from './pages/Deliveries';
import SupportPage from './pages/Support';
import ReportsPage from './pages/Reports';
import AccountingPage from './pages/Accounting';
import SettingsPage from './pages/Settings';
import ClinicsPage from './pages/Clinics';
import PharmaciesPage from './pages/Pharmacies';
import NotFound from './pages/ErrorPages/NotFound';
import ServerError from './pages/ErrorPages/ServerError';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="deliveries" element={<DeliveriesPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="accounting" element={<AccountingPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="clinics" element={<ClinicsPage />} />
            <Route path="pharmacies" element={<PharmaciesPage />} />
          </Route>
          <Route path="/500" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;