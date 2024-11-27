import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import DoctorLayout from './layouts/DoctorLayout';
import PharmacyLayout from './layouts/PharmacyLayout';
import CoordinatorLayout from './layouts/CoordinatorLayout';
import LoginPage from './components/Auth/LoginPage';
import Dashboard from './pages/Dashboard';
import DoctorDashboard from './pages/Doctor/Dashboard';
import DoctorAppointments from './pages/Doctor/Appointments';
import DoctorOrders from './pages/Doctor/Orders';
import PharmacyDashboard from './pages/Pharmacy/Dashboard';
import PharmacyOrders from './pages/Pharmacy/Orders';
import OrdersPage from './pages/Orders';
import PatientsPage from './pages/Patients';
import InventoryPage from './pages/Inventory';
import DeliveriesPage from './pages/Deliveries';
import SupportPage from './pages/Support';
import ReportsPage from './pages/Reports';
import AccountingPage from './pages/Accounting';
import SettingsPage from './pages/Settings';
import UserSettings from './pages/UserSettings';
import ClinicsPage from './pages/Clinics';
import PharmaciesPage from './pages/Pharmacies';
import CoordinatorDashboard from './pages/Coordinator/Dashboard';
import StaffManagement from './pages/Coordinator/Staff';
import ZonesManagement from './pages/Coordinator/Zones';
import ActiveDeliveries from './pages/Coordinator/ActiveDeliveries';
import DeliverySchedule from './pages/Coordinator/DeliverySchedule';
import IssuesManagement from './pages/Coordinator/Issues';
import Communications from './pages/Coordinator/Communications';
import OrdersAssignment from './pages/Coordinator/OrdersAssignment';
import NotFound from './pages/ErrorPages/NotFound';
import ServerError from './pages/ErrorPages/ServerError';
import Unauthorized from './pages/ErrorPages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Doctor Routes */}
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={['doctor', 'clinic']}>
                <DoctorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="orders" element={<DoctorOrders />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="settings" element={<UserSettings />} />
          </Route>

          {/* Admin Routes */}
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
            <Route path="user-settings" element={<UserSettings />} />
            <Route path="clinics" element={<ClinicsPage />} />
            <Route path="pharmacies" element={<PharmaciesPage />} />
          </Route>

          {/* Delivery Coordinator Routes */}
          <Route
            path="/coordinator"
            element={
              <ProtectedRoute allowedRoles={['deliveryCoordinator']}>
                <CoordinatorLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<CoordinatorDashboard />} />
            <Route path="orders" element={<OrdersAssignment />} />
            <Route path="deliveries/active" element={<ActiveDeliveries />} />
            <Route path="zones" element={<ZonesManagement />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="schedule" element={<DeliverySchedule />} />
            <Route path="issues" element={<IssuesManagement />} />
            <Route path="communications" element={<Communications />} />
            <Route path="settings" element={<UserSettings />} />
          </Route>

          {/* Pharmacy Routes */}
          <Route
            path="/pharmacy"
            element={
              <ProtectedRoute allowedRoles={['pharmacyStaff', 'pharmacyAdmin']}>
                <PharmacyLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PharmacyDashboard />} />
            <Route path="orders" element={<PharmacyOrders />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="delivery-status" element={<DeliveriesPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="settings" element={<UserSettings />} />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;