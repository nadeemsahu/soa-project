import React from 'react';
import { useApex } from '../../context/ApexContext';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const { user, appointments } = useApex();
  const navigate = useNavigate();

  const todaysAppointments = appointments.filter(a => a.doctorId === user.id);
  const nextAppointment = todaysAppointments.find(a => a.status === 'Upcoming');
  const completedCount = todaysAppointments.filter(a => a.status === 'Completed').length;

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="bg-surface-container-low border-b border-outline-variant px-6 py-3 shrink-0">
        <h1 className="text-headline-sm font-headline-sm text-primary font-semibold">Doctor Dashboard</h1>
        <p className="text-label-sm font-label-sm text-secondary">Welcome back, {user.name}. Here's your schedule for today.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-surface-container-low/30">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface border border-outline-variant rounded p-4 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-primary-container text-on-primary rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">calendar_month</span>
              </div>
              <div>
                <div className="text-label-sm font-label-sm uppercase tracking-wider text-secondary">Total Appointments</div>
                <div className="text-headline-md font-headline-md font-bold text-primary">{todaysAppointments.length}</div>
              </div>
            </div>
            <div className="bg-surface border border-outline-variant rounded p-4 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-[#F4FBF7] text-[#1E7B45] border border-[#d1eeda] rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">check_circle</span>
              </div>
              <div>
                <div className="text-label-sm font-label-sm uppercase tracking-wider text-secondary">Completed Consultations</div>
                <div className="text-headline-md font-headline-md font-bold text-primary">{completedCount}</div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-headline-sm font-headline-sm text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">person_check</span>
              Next Patient
            </h2>
            {nextAppointment ? (
              <div className="bg-surface border border-outline-variant rounded p-6 shadow-sm">
                <div className="flex items-start justify-between border-b border-outline-variant/60 pb-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-surface-container-highest text-primary font-headline-md font-semibold border border-outline-variant rounded flex items-center justify-center">
                      MV
                    </div>
                    <div>
                      <h3 className="text-headline-sm font-headline-sm font-semibold text-primary">Marcus Vance</h3>
                      <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">{nextAppointment.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-label-md font-label-md bg-surface-container-lowest border border-outline-variant px-2.5 py-1 rounded shadow-sm">
                    <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                    {nextAppointment.time}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={() => navigate(`/doctor/consultation/${nextAppointment.id}`)}
                    className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md h-10 px-6 rounded flex items-center gap-2 transition-colors duration-150 font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px]">videocam</span>
                    Start Consultation
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-surface border border-outline-variant border-dashed rounded p-8 text-center">
                <span className="material-symbols-outlined text-[48px] text-[#1E7B45] mb-2">task_alt</span>
                <h3 className="text-headline-sm font-headline-sm text-primary mb-1">All caught up!</h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant">You have no more appointments scheduled for today.</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-headline-sm font-headline-sm text-primary mb-4 flex items-center gap-2 mt-8">
              <span className="material-symbols-outlined text-[20px]">view_list</span>
              Today's Schedule
            </h2>
            <div className="bg-surface border border-outline-variant rounded shadow-sm divide-y divide-outline-variant">
              {todaysAppointments.map(appointment => (
                <div key={appointment.id} className="p-4 flex items-center justify-between hover:bg-surface-container-lowest transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 text-label-md font-label-md text-on-surface w-24">
                      <span className="material-symbols-outlined text-[16px] text-outline">schedule</span>
                      {appointment.time}
                    </div>
                    <div>
                      <h4 className="text-body-md font-body-md font-semibold text-primary">Marcus Vance</h4>
                      <p className="text-body-sm font-body-sm text-on-surface-variant truncate max-w-sm">{appointment.reason}</p>
                    </div>
                  </div>
                  <div>
                    {appointment.status === 'Completed' ? (
                      <span className="inline-flex items-center gap-1 bg-[#F4FBF7] text-[#1E7B45] border border-[#d1eeda] text-label-sm font-label-sm px-2.5 py-0.5 rounded font-bold">
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-[#FFF4E5] text-[#9A5B13] border border-[#F5D5A5] text-label-sm font-label-sm px-2.5 py-0.5 rounded font-bold">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {todaysAppointments.length === 0 && (
                <div className="p-6 text-center text-body-sm text-on-surface-variant">No appointments scheduled.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
