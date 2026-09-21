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

  const loadData = async () => {
    if (!user) return;
    try {
      // In production, use apiClient.get('/...')
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

  const login = async (role) => {
    try {
      // In production, this would be apiClient.post('/auth/login', credentials)
      const userData = await mockApi.login(role);
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
      // In production: await apiClient.post('/appointments', appointmentData)
      await mockApi.bookAppointment(appointmentData);
      await loadData(); // refresh data
    } catch (err) {
      throw err; // UI will catch and handle 409
    }
  };

  const cancelAppointment = async (id) => {
    try {
      // In production: await apiClient.delete(`/appointments/${id}`)
      await mockApi.cancelAppointment(id);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };
  
  const completeConsultation = async (appointmentId, notes, diagnosis, fee) => {
     try {
       // In production: await apiClient.post(`/consultations/${appointmentId}/complete`, { notes, diagnosis, fee })
       await mockApi.completeConsultation(appointmentId, notes, diagnosis, fee, user.name);
       await loadData();
     } catch (err) {
       console.error(err);
     }
  };

  const payBill = async (billId) => {
    try {
      // In production: await apiClient.post(`/billing/${billId}/pay`)
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
