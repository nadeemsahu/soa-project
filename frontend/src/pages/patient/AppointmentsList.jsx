import React, { useState } from 'react';
import { useApex } from '../../context/ApexContext';
import { useNavigate } from 'react-router-dom';

const AppointmentsList = () => {
  const { appointments, cancelAppointment } = useApex();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Upcoming');

  const filteredAppointments = appointments.filter(a => {
    if (activeTab === 'Upcoming') return a.status === 'Upcoming';
    if (activeTab === 'Past') return a.status === 'Completed' || a.status === 'Cancelled';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Upcoming': 
        return <span className="inline-block bg-[#FFF4E5] text-[#9A5B13] border border-[#F5D5A5] text-label-sm font-label-sm px-2.5 py-0.5 rounded font-medium">Upcoming</span>;
      case 'Completed': 
        return <span className="inline-block bg-secondary-container text-on-secondary-fixed text-label-sm font-label-sm px-2.5 py-0.5 rounded border border-secondary-fixed-dim font-medium">Completed</span>;
      case 'Cancelled': 
        return <span className="inline-block bg-[#FDF2F1] text-[#A63228] border border-[#f3c8c4] text-label-sm font-label-sm px-2.5 py-0.5 rounded font-medium">Cancelled</span>;
      default: 
        return <span className="inline-block bg-surface-container-highest text-on-surface-variant text-label-sm font-label-sm px-2.5 py-0.5 rounded border border-outline-variant font-medium">{status}</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="bg-surface-container-low border-b border-outline-variant px-6 py-3 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-headline-sm font-headline-sm text-primary font-semibold">My Appointments</h1>
          <p className="text-label-sm font-label-sm text-secondary">Manage your upcoming and past consultations.</p>
        </div>
        <button 
          onClick={() => navigate('/doctors')}
          className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md h-8 px-3 rounded flex items-center justify-center gap-1.5 transition-colors duration-150 shadow-none font-medium"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          New Appointment
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-surface border-b border-outline-variant px-6 flex gap-6 shrink-0">
        <button 
          className={`py-2.5 text-label-md font-label-md font-medium border-b-2 transition-colors ${activeTab === 'Upcoming' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'}`}
          onClick={() => setActiveTab('Upcoming')}
        >
          Upcoming ({appointments.filter(a => a.status === 'Upcoming').length})
        </button>
        <button 
          className={`py-2.5 text-label-md font-label-md font-medium border-b-2 transition-colors ${activeTab === 'Past' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'}`}
          onClick={() => setActiveTab('Past')}
        >
          Past ({appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled').length})
        </button>
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto p-6 bg-surface-container-low/30">
        {filteredAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-on-surface-variant bg-surface-container-lowest border border-outline-variant border-dashed rounded">
            <span className="material-symbols-outlined text-[48px] text-outline-variant mb-2">event_busy</span>
            <p className="text-body-md font-body-md">No {activeTab.toLowerCase()} appointments.</p>
            {activeTab === 'Upcoming' && (
              <button 
                onClick={() => navigate('/doctors')}
                className="mt-4 text-label-md font-label-md text-primary hover:underline font-medium"
              >
                Book one now
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAppointments.map(appointment => (
              <div key={appointment.id} className="bg-surface-container-lowest border border-outline-variant rounded flex flex-col">
                <div className="p-4 border-b border-outline-variant flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-primary-container text-on-primary flex items-center justify-center font-headline-md font-semibold">
                      {appointment.doctorName.split(' ')[1]?.[0] || appointment.doctorName[0]}
                    </div>
                    <div>
                      <h3 className="text-body-lg font-body-lg font-semibold text-primary leading-tight">{appointment.doctorName}</h3>
                      <span className="text-label-sm font-label-sm text-secondary">{appointment.specialty}</span>
                    </div>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>
                
                <div className="p-4 bg-surface space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-outline">calendar_today</span>
                    <span>{new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-outline">schedule</span>
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-outline">clinical_notes</span>
                    <span className="truncate">{appointment.reason}</span>
                  </div>
                </div>

                {appointment.status === 'Upcoming' && (
                  <div className="p-3 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-end gap-2 rounded-b">
                    <button 
                      onClick={() => cancelAppointment(appointment.id)}
                      className="px-3 py-1.5 text-label-md font-label-md text-error hover:bg-[#FDF2F1] rounded transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface text-label-md font-label-md rounded transition-colors font-medium">
                      Reschedule
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;
