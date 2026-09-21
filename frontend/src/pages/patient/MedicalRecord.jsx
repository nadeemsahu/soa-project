import React from 'react';
import { useApex } from '../../context/ApexContext';

const MedicalRecord = () => {
  const { user, records } = useApex();

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="bg-surface-container-low border-b border-outline-variant px-6 py-3 shrink-0">
        <h1 className="text-headline-sm font-headline-sm text-primary font-semibold">Medical Record</h1>
        <p className="text-label-sm font-label-sm text-secondary">Your comprehensive health profile and consultation history.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6 bg-surface-container-low/30">
        
        {/* Left Sidebar - Profile */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-surface border border-outline-variant rounded shadow-sm overflow-hidden">
            <div className="bg-primary-container p-6 flex flex-col items-center justify-center text-center border-b border-outline-variant">
              <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center text-primary font-headline-xl font-bold mb-3 shadow-sm border border-outline-variant">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-headline-sm font-headline-sm text-primary font-semibold">{user.name}</h2>
              <p className="text-label-sm font-label-sm text-secondary">Patient ID: {user.id}</p>
            </div>
            
            <div className="p-0 divide-y divide-outline-variant">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">cake</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider">Age</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface font-medium">{user.age} yrs</span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">wc</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider">Gender</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface font-medium">{user.gender}</span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-error">
                  <span className="material-symbols-outlined text-[18px]">bloodtype</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider">Blood Type</span>
                </div>
                <span className="inline-block bg-[#FDF2F1] text-[#A63228] border border-[#f3c8c4] font-label-sm text-label-sm px-2 py-0.5 rounded font-bold">{user?.bloodGroup || 'O+'}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-outline-variant rounded shadow-sm p-5">
            <h3 className="text-label-md font-label-md text-primary uppercase tracking-wider font-semibold flex items-center gap-2 mb-4 border-b border-outline-variant pb-2">
              <span className="material-symbols-outlined text-[18px] text-error">warning</span>
              Active Allergies
            </h3>
            <div className="flex flex-wrap gap-2">
              {(user?.allergies || []).map(allergy => (
                <span key={allergy} className="bg-surface-container-high border border-outline-variant text-on-surface text-label-sm font-label-sm px-2.5 py-1 rounded font-medium">
                  {allergy}
                </span>
              ))}
              {(!user?.allergies || user.allergies.length === 0) && (
                <span className="text-body-sm text-on-surface-variant">No known allergies.</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Main Content - Timeline */}
        <div className="flex-1 space-y-4">
          <h2 className="text-headline-sm font-headline-sm text-primary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">history</span>
            Clinical Timeline
          </h2>
          
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant before:to-transparent">
            {records.map((record, idx) => (
              <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-primary-container text-on-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ml-1 md:ml-0">
                  <span className="material-symbols-outlined text-[18px]">medical_services</span>
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surface-container-lowest border border-outline-variant p-4 rounded shadow-sm hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-label-sm font-label-sm uppercase tracking-wider text-secondary">{new Date(record.date).toLocaleDateString()}</span>
                    <span className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Clinical Note</span>
                  </div>
                  <h3 className="text-body-lg font-body-lg font-semibold text-primary mb-1">{record.diagnosis}</h3>
                  <div className="flex items-center gap-1 text-label-sm font-label-sm text-on-surface-variant mb-3">
                    <span className="material-symbols-outlined text-[14px]">stethoscope</span>
                    <span>{record.doctorName}</span>
                  </div>
                  <div className="p-3 bg-surface border border-outline-variant/60 rounded text-body-sm font-body-sm text-on-surface leading-relaxed">
                    {record.notes}
                  </div>
                </div>
              </div>
            ))}

            {records.length === 0 && (
              <div className="bg-surface border border-outline-variant border-dashed rounded p-8 text-center ml-12 md:ml-0 relative z-10">
                <span className="material-symbols-outlined text-[48px] text-outline-variant mb-2">folder_off</span>
                <p className="text-body-md font-body-md text-on-surface-variant">No clinical records found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecord;
