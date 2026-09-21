import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useApex } from './context/ApexContext';

import Login from './pages/Login';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard';
import DoctorDiscovery from './pages/patient/DoctorDiscovery';
import AppointmentBooking from './pages/patient/AppointmentBooking';
import AppointmentsList from './pages/patient/AppointmentsList';
import MedicalRecord from './pages/patient/MedicalRecord';
import Billing from './pages/patient/Billing';
import BillDetail from './pages/patient/BillDetail';

// Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard';
import ConsultationWorkspace from './pages/doctor/ConsultationWorkspace';

// Billing Staff Pages
import BillingDashboard from './pages/billing/BillingDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const navigate = useNavigate();
  const { logout } = useApex();

  // Listen for global 401 unauth events from Axios
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      navigate('/login');
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route element={<AppLayout />}>
        {/* Patient Routes */}
        <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
          <Route path="/" element={<PatientDashboard />} />
          <Route path="/doctors" element={<DoctorDiscovery />} />
          <Route path="/book/:doctorId?" element={<AppointmentBooking />} />
          <Route path="/appointments" element={<AppointmentsList />} />
          <Route path="/records" element={<MedicalRecord />} />
          <Route path="/medical-record" element={<MedicalRecord />} />
          <Route path="/bills" element={<Billing />} />
          <Route path="/bills/:billId" element={<BillDetail />} />
        </Route>

        {/* Doctor Routes */}
        <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/doctor/consultation/:appointmentId" element={<ConsultationWorkspace />} />
        </Route>

        {/* Billing Staff Routes */}
        <Route element={<ProtectedRoute allowedRoles={['BILLING_STAFF']} />}>
          <Route path="/billing-admin" element={<BillingDashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>
      
      {/* Root redirect for non-matched routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
