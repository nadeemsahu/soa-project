import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockApi } from '../api/mockApi';
import apiClient from '../api/client';

export const ApexContext = createContext(null);

export const ApexProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [records, setRecords] = useState([]);

  const isLiveGatewayEnabled = () => import.meta.env.VITE_USE_MOCK !== 'true';

  const loadData = async () => {
    if (!user) return;
    try {
      if (isLiveGatewayEnabled()) {
        try {
          const [patsRes, aptsRes, billsRes, docs] = await Promise.all([
            apiClient.get('/patients').catch(() => null),
            apiClient.get('/appointments').catch(() => null),
            apiClient.get('/billing').catch(() => null),
            mockApi.getDoctors()
          ]);

          if (patsRes && aptsRes && billsRes) {
            setPatients(patsRes.data || []);
            setAppointments(aptsRes.data || []);
            setBills(billsRes.data || []);
            setDoctors(docs);

            if (user.id) {
              const recRes = await apiClient.get(`/patients/${user.id}/records`).catch(() => null);
              setRecords(recRes?.data || await mockApi.getRecords());
            }
            return;
          }
        } catch (gatewayErr) {
          console.warn("Live gateway check resulted in fallback:", gatewayErr.message);
        }
      }

      // Standalone Mock Fallback
      const [pats, docs, apts, b, recs] = await Promise.all([
        mockApi.getPatients(),
        mockApi.getDoctors(),
        mockApi.getAppointments(),
        mockApi.getBills(),
        mockApi.getRecords()
      ]);
      setPatients(pats);
      setDoctors(docs);
      setAppointments(apts);
      setBills(b);
      setRecords(recs);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const login = async (roleInput, rawPassword = 'password123') => {
    const roleKey = (roleInput || '').toUpperCase().replace(/[\s-]+/g, '_');
    try {
      if (isLiveGatewayEnabled()) {
        try {
          const res = await apiClient.post('/auth/login', {
            identity: roleInput,
            password: rawPassword
          });

          if (res.data && res.data.token) {
            localStorage.setItem('apex_jwt', res.data.token);
            const rawRole = (res.data.role || roleKey).replace('ROLE_', '');
            const liveUser = {
              id: res.data.userId,
              name: res.data.name,
              role: rawRole,
              email: res.data.email,
              bloodGroup: 'O+',
              allergies: ['Penicillin', 'Peanuts']
            };
            setUser(liveUser);
            return liveUser;
          }
        } catch (apiErr) {
          console.warn("API Gateway offline, logging in via mock engine:", apiErr.message);
        }
      }

      const userData = await mockApi.login(roleInput);
      setUser(userData);
      return userData;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('apex_jwt');
    setUser(null);
  };

  const bookAppointment = async (appointmentData) => {
    try {
      if (isLiveGatewayEnabled()) {
        try {
          await apiClient.post('/appointments', appointmentData);
          await loadData();
          return;
        } catch (err) {
          if (err.response && err.response.status === 409) {
            throw err; // Surface 409 Conflict to form for user messaging
          }
          console.warn("Gateway booking failed, falling back to mock:", err.message);
        }
      }

      await mockApi.bookAppointment(appointmentData);
      await loadData();
    } catch (err) {
      throw err;
    }
  };

  const cancelAppointment = async (id) => {
    try {
      if (isLiveGatewayEnabled()) {
        try {
          await apiClient.delete(`/appointments/${id}`);
          await loadData();
          return;
        } catch (e) {
          console.warn("Gateway offline, cancelling in mock:", e.message);
        }
      }
      await mockApi.cancelAppointment(id);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };
  
  const completeConsultation = async (appointmentId, notes, diagnosis, fee) => {
     try {
       if (isLiveGatewayEnabled()) {
         try {
           await apiClient.post(`/appointments/${appointmentId}/complete`, { notes, diagnosis, fee });
           await loadData();
           return;
         } catch (e) {
           console.warn("Gateway offline, completing in mock:", e.message);
         }
       }
       await mockApi.completeConsultation(appointmentId, notes, diagnosis, fee, user?.name || 'Dr. Julian Vance');
       await loadData();
     } catch (err) {
       console.error(err);
     }
  };

  const payBill = async (billId) => {
    try {
      if (isLiveGatewayEnabled()) {
        try {
          await apiClient.post(`/billing/${billId}/pay`);
          await loadData();
          return;
        } catch (e) {
          console.warn("Gateway offline, paying in mock:", e.message);
        }
      }
      await mockApi.payBill(billId);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ApexContext.Provider value={{
      user,
      patients,
      doctors,
      appointments,
      bills,
      records,
      login,
      logout,
      bookAppointment,
      cancelAppointment,
      completeConsultation,
      payBill
    }}>
      {children}
    </ApexContext.Provider>
  );
};

export const useApex = () => useContext(ApexContext);
