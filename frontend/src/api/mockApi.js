// This file simulates the API Gateway backend logic.
// In production, this logic belongs entirely to the backend microservices.

let mockPatients = [
  { id: 'u1', name: 'Eleanor Vance', age: 42, gender: 'Female' },
  { id: 'u2', name: 'Marcus Vance', age: 18, gender: 'Male' }
];

let mockDoctors = [
  { id: 'd1', name: 'Dr. Sarah Jenkins', specialty: 'Cardiology', experience: '12 years', fee: 150, nextAvailable: 'Today, 2:00 PM', image: 'SJ' },
  { id: 'd2', name: 'Dr. Marcus Vance', specialty: 'General Practice', experience: '8 years', fee: 80, nextAvailable: 'Tomorrow, 9:30 AM', image: 'MV' },
  { id: 'd3', name: 'Dr. Emily Chen', specialty: 'Dermatology', experience: '15 years', fee: 120, nextAvailable: 'Oct 14, 11:00 AM', image: 'EC' },
  { id: 'd4', name: 'Dr. Robert Hale', specialty: 'Orthopedics', experience: '20 years', fee: 180, nextAvailable: 'Oct 15, 3:15 PM', image: 'RH' },
];

let mockAppointments = [
  { id: 'a1', patientId: 'u1', doctorId: 'd1', doctorName: 'Dr. Sarah Jenkins', specialty: 'Cardiology', date: '2023-10-15', time: '14:00', status: 'Upcoming', reason: 'Routine Heart Checkup' },
  { id: 'a2', patientId: 'u1', doctorId: 'd2', doctorName: 'Dr. Marcus Vance', specialty: 'General Practice', date: '2023-09-10', time: '09:30', status: 'Completed', reason: 'Annual Physical' },
  { id: 'a3', patientId: 'u2', doctorId: 'd1', doctorName: 'Dr. Sarah Jenkins', specialty: 'Cardiology', date: '2023-08-05', time: '11:00', status: 'Cancelled', reason: 'Skin rash consultation' }
];

let mockBills = [
  { id: 'b1', appointmentId: 'a2', date: '2023-09-10', amount: 80.00, status: 'Paid', description: 'Consultation Fee' },
  { id: 'b2', appointmentId: 'a1', date: '2023-10-15', amount: 150.00, status: 'Pending', description: 'Consultation Fee' },
];

let mockMedicalRecords = [
  { id: 'm1', date: '2023-09-10', doctorName: 'Dr. Marcus Vance', notes: 'Patient is healthy. Blood pressure normal. Recommended continued regular exercise.', diagnosis: 'Healthy adult' }
];

export const mockApi = {
  getPatients: async () => [...mockPatients],
  
  getDoctors: async () => [...mockDoctors],
  
  getAppointments: async () => [...mockAppointments],
  
  getBills: async () => [...mockBills],
  
  getRecords: async () => [...mockMedicalRecords],

  bookAppointment: async (appointmentData) => {
    // Simulate a 409 Conflict if the slot is taken
    const isConflict = mockAppointments.some(a => 
      a.doctorId === appointmentData.doctorId && 
      a.date === appointmentData.date && 
      a.time === appointmentData.time &&
      a.status === 'Upcoming'
    );

    if (isConflict) {
      const error = new Error('Conflict');
      error.response = { status: 409 };
      throw error;
    }

    const newAppointment = {
      id: `a${Date.now()}`,
      status: 'Upcoming',
      ...appointmentData
    };
    mockAppointments = [newAppointment, ...mockAppointments];
    return newAppointment;
  },

  cancelAppointment: async (id) => {
    mockAppointments = mockAppointments.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a);
    return true;
  },

  completeConsultation: async (appointmentId, notes, diagnosis, fee, doctorName) => {
    // BACKEND BUSINESS LOGIC SIMULATION
    // 1. Mark appointment complete
    mockAppointments = mockAppointments.map(a => a.id === appointmentId ? { ...a, status: 'Completed' } : a);
    
    const appointment = mockAppointments.find(a => a.id === appointmentId);
    
    // 2. Generate medical record
    const newRecord = {
      id: `m${Date.now()}`,
      date: appointment.date,
      doctorName,
      notes,
      diagnosis
    };
    mockMedicalRecords = [newRecord, ...mockMedicalRecords];
    
    // 3. Generate bill (Billing service event)
    const newBill = {
      id: `b${Date.now()}`,
      appointmentId,
      date: appointment.date,
      amount: fee,
      status: 'Pending',
      description: `Consultation - ${diagnosis}`
    };
    mockBills = [newBill, ...mockBills];

    return true;
  },

  payBill: async (billId) => {
    mockBills = mockBills.map(b => b.id === billId ? { ...b, status: 'Paid' } : b);
    return true;
  },
  
  login: async (roleInput) => {
    const normalized = (roleInput || '').toUpperCase().replace(/[\s-]+/g, '_');
    localStorage.setItem('apex_jwt', `mock_jwt_for_${normalized}_${Date.now()}`);
    if (normalized === 'DOCTOR') {
      return { id: 'd1', name: 'Dr. Sarah Jenkins', role: 'DOCTOR', email: 'sarah.jenkins@apexcare.com' };
    }
    if (normalized === 'BILLING_STAFF' || normalized === 'BILLING') {
      return { id: 'b1', name: 'Julian Vance (Billing)', role: 'BILLING_STAFF', email: 'revcycle.jvance@apexcare.org' };
    }
    if (normalized === 'ADMIN' || normalized === 'ADMINISTRATOR') {
      return { id: 'adm1', name: 'Security Admin', role: 'ADMIN', email: 'sec.admin@apexcare.net' };
    }
    return {
      id: 'u1',
      name: 'Eleanor Vance',
      role: 'PATIENT',
      email: 'eleanor.vance@example.com',
      age: 42,
      gender: 'Female',
      bloodGroup: 'O+',
      allergies: ['Penicillin', 'Peanuts']
    };
  }
};
