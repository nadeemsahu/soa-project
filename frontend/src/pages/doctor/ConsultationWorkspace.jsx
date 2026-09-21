import React, { useState } from 'react';
import { useApex } from '../../context/ApexContext';

const ConsultationWorkspace = () => {
  const { patients, appointments, completeConsultation } = useApex();
  
  // Doctor sees all upcoming appointments
  const todaysAppointments = appointments.filter(a => a.status === 'Upcoming' || a.status === 'Completed');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(todaysAppointments.find(a => a.status === 'Upcoming')?.id);
  
  const selectedAppointment = appointments.find(a => a.id === selectedAppointmentId);
  const selectedPatient = selectedAppointment ? patients.find(p => p.id === selectedAppointment.patientId) : null;

  const handleComplete = () => {
    if (selectedAppointmentId) {
      completeConsultation(selectedAppointmentId, 'Consultation completed via UI', 'Routine Assessment', 150);
      // auto-select next
      const next = appointments.find(a => a.status === 'Upcoming' && a.id !== selectedAppointmentId);
      if (next) setSelectedAppointmentId(next.id);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface">
      {/* PHYSICIAN ROSTER & SCHEDULE SUMMARY BAR */}
      <div className="h-12 bg-surface-container-low border-b border-outline-variant px-gutter-desktop flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
            <span className="text-label-md font-label-md font-semibold text-primary">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="h-3.5 w-[1px] bg-outline-variant"></div>
          <div className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-2">
            <span className="font-semibold text-on-surface">{todaysAppointments.length} Appointments Today</span>
            <span>•</span>
            <span className="text-secondary font-medium">{appointments.filter(a => a.status === 'Completed').length} Completed</span>
            <span>•</span>
            <span className="text-primary font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-surface-tint inline-block animate-pulse"></span>
              {appointments.filter(a => a.status === 'Upcoming').length} In Progress
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-label-sm font-label-sm uppercase tracking-wider text-outline hidden sm:block">Physician Assignment:</span>
          <span className="text-label-md font-label-md font-semibold text-primary bg-surface-container px-2.5 py-0.5 rounded border border-outline-variant">
            Dr. Julian Vance, MD (Cardiology)
          </span>
        </div>
      </div>

      {/* MAIN SPLIT WORKSPACE: Left Queue & Right Canvas */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* LEFT COLUMN: Patient Queue */}
        <section className="w-80 md:w-96 border-r border-outline-variant flex flex-col bg-surface-bright shrink-0 z-10">
          <div className="p-space-md border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
            <div>
              <h2 className="text-headline-sm font-headline-sm text-primary">Today's Patient Queue</h2>
              <p className="text-label-sm font-label-sm text-on-surface-variant">Acute Surgery Clinic • Station 4B</p>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded hover:bg-surface-container text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
              </button>
              <button className="p-1 rounded hover:bg-surface-container text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-outline-variant custom-scrollbar">
            {todaysAppointments.map((apt) => {
              const pat = patients.find(p => p.id === apt.patientId);
              const isActive = apt.id === selectedAppointmentId;
              const isCompleted = apt.status === 'Completed';

              return (
                <div 
                  key={apt.id}
                  onClick={() => setSelectedAppointmentId(apt.id)}
                  className={`p-space-md cursor-pointer transition-colors border-l-4 ${
                    isActive 
                      ? 'bg-surface-container-lowest border-primary' 
                      : isCompleted 
                        ? 'bg-surface-container-low opacity-75 hover:opacity-100 border-transparent' 
                        : 'hover:bg-surface-container-lowest border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-tabular-data text-tabular-data ${isCompleted ? 'text-outline line-through' : 'font-semibold text-primary'}`}>
                        {apt.time}
                      </span>
                      <span className="text-label-sm font-label-sm text-outline">• Room 302</span>
                    </div>
                    {isCompleted ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-label-sm font-label-sm font-medium bg-surface-container-highest text-on-surface-variant">
                        Completed
                      </span>
                    ) : isActive ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-label-sm font-label-sm font-semibold bg-secondary-container text-on-secondary-container">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                        In Progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-label-sm font-label-sm font-medium bg-surface-container-high text-on-surface-variant">
                        Confirmed
                      </span>
                    )}
                  </div>
                  <div className={`text-body-md font-body-md ${isCompleted ? 'font-medium' : 'font-semibold'} text-on-surface`}>
                    {pat?.name}
                  </div>
                  <div className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">
                    {pat?.age}y, {pat?.gender} • MRN #{pat?.id}
                  </div>
                  <div className="mt-2 text-label-sm font-label-sm text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">flag</span>
                    {apt.reason}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RIGHT COLUMN: Clinical Consultation Workspace */}
        {selectedAppointment && selectedPatient ? (
          <section className="flex-1 flex flex-col min-w-0 bg-surface overflow-y-auto custom-scrollbar relative">
            <div className="bg-surface-container-lowest border-b border-outline-variant px-gutter-desktop py-space-md flex flex-wrap items-center justify-between gap-4 shrink-0 z-10 sticky top-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-surface-container-highest text-primary flex items-center justify-center font-headline-md font-semibold border border-outline-variant">
                  {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-headline-md font-headline-md text-primary">{selectedPatient.name}</h1>
                    <span className="text-label-sm font-label-sm bg-surface-container px-2 py-0.5 rounded text-on-surface-variant border border-outline-variant font-medium">
                      MRN #{selectedPatient.id}
                    </span>
                    <span className="text-label-sm font-label-sm text-on-surface-variant">({selectedPatient.age}y)</span>
                    <span className="text-label-sm font-label-sm text-on-surface-variant">• {selectedPatient.gender}</span>
                  </div>
                  <div className="flex items-center gap-4 text-body-sm font-body-sm mt-1 text-on-surface-variant">
                    <span className="flex items-center gap-1 text-error font-medium">
                      <span className="material-symbols-outlined text-[16px]">warning</span>
                      Allergies: Penicillin, Contrast Dye
                    </span>
                    <span>•</span>
                    <span>Encounter ID: #ENC-2023-9941</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded border border-outline-variant">
                  <span className="material-symbols-outlined text-[16px] text-primary">timer</span>
                  <span className="text-label-md font-label-md font-tabular-data text-primary font-semibold">18m 42s in room</span>
                </div>
                <button className="bg-surface hover:bg-surface-container-high text-primary border border-outline-variant px-3 py-1.5 rounded text-label-md font-label-md font-medium flex items-center gap-1 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">history_edu</span>
                  Past Records
                </button>
              </div>
            </div>

            {/* VITALS SUMMARY */}
            <div className="bg-surface-container-low border-b border-outline-variant px-gutter-desktop py-2.5 flex flex-wrap items-center justify-between shrink-0">
              <div className="flex flex-wrap items-center gap-6 md:gap-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-label-sm font-label-sm uppercase tracking-wider text-outline">BP</span>
                  <span className="font-tabular-data text-[15px] font-semibold text-on-surface">128/82</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant hidden md:inline">mmHg</span>
                </div>
                <div className="h-3 w-[1px] bg-outline-variant hidden sm:block"></div>
                <div className="flex items-baseline gap-2">
                  <span className="text-label-sm font-label-sm uppercase tracking-wider text-outline">HR</span>
                  <span className="font-tabular-data text-[15px] font-semibold text-on-surface">72</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant hidden md:inline">bpm</span>
                </div>
                <div className="h-3 w-[1px] bg-outline-variant hidden sm:block"></div>
                <div className="flex items-baseline gap-2">
                  <span className="text-label-sm font-label-sm uppercase tracking-wider text-outline">SpO₂</span>
                  <span className="font-tabular-data text-[15px] font-semibold text-on-surface">98%</span>
                </div>
              </div>
              <span className="text-label-sm font-label-sm text-secondary flex items-center gap-1 font-medium mt-2 lg:mt-0">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Triage Recorded 10:14 AM
              </span>
            </div>

            <div className="p-gutter-desktop space-y-6 flex-1">
              {/* SOAP Note Canvas */}
              <div className="border border-outline-variant rounded bg-surface-container-lowest overflow-hidden">
                <div className="bg-surface-container-low border-b border-outline-variant px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">clinical_notes</span>
                    <span className="text-label-md font-label-md font-semibold text-primary uppercase tracking-wide">Structured SOAP Note</span>
                  </div>
                </div>
                <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-surface-container-lowest">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between pb-1 border-b border-outline-variant">
                      <span className="text-label-md font-label-md font-semibold text-primary flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-surface-container flex items-center justify-center text-label-sm font-semibold text-primary">S</span>
                        Subjective
                      </span>
                    </div>
                    <textarea className="w-full bg-surface border border-outline-variant rounded p-3 text-body-sm font-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary leading-relaxed" placeholder="Patient narrative..." rows="5" defaultValue="Alert, oriented x4. Patient states adherence to therapy. Mild exertional fatigue noted since weekend."></textarea>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between pb-1 border-b border-outline-variant">
                      <span className="text-label-md font-label-md font-semibold text-primary flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-surface-container flex items-center justify-center text-label-sm font-semibold text-primary">O</span>
                        Objective
                      </span>
                    </div>
                    <textarea className="w-full bg-surface border border-outline-variant rounded p-3 text-body-sm font-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary leading-relaxed" placeholder="Physical findings..." rows="5" defaultValue="Heart: Regular rate and rhythm. Lungs: Clear to auscultation bilaterally. Extremities: No peripheral edema."></textarea>
                  </div>
                  <div className="flex flex-col space-y-2 lg:col-span-2">
                    <div className="flex items-center justify-between pb-1 border-b border-outline-variant">
                      <span className="text-label-md font-label-md font-semibold text-primary flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-surface-container flex items-center justify-center text-label-sm font-semibold text-primary">A</span>
                        Assessment & Plan
                      </span>
                    </div>
                    <textarea className="w-full bg-surface border border-outline-variant rounded p-3 text-body-sm font-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary leading-relaxed" placeholder="Diagnosis and next steps..." rows="3" defaultValue={`1. ${selectedAppointment.reason}\n2. Continue current medications\n3. Schedule follow-up in 4 weeks`}></textarea>
                  </div>
                </div>
              </div>

              {/* e-Prescription */}
              <div className="border border-outline-variant rounded bg-surface-container-lowest overflow-hidden">
                <div className="bg-surface-container-low border-b border-outline-variant px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">prescriptions</span>
                    <span className="text-label-md font-label-md font-semibold text-primary uppercase tracking-wide">Active e-Prescriptions</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#FDF2F1] text-error border border-error/20 text-label-sm font-label-sm font-semibold hidden sm:flex">
                    <span className="material-symbols-outlined text-[14px]">verified_user</span>
                    Allergy Screen Passed
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container text-outline text-label-sm font-label-sm uppercase border-b border-outline-variant">
                        <th className="py-2 px-4 font-semibold">Medication</th>
                        <th className="py-2 px-4 font-semibold">Dosage</th>
                        <th className="py-2 px-4 font-semibold">Safety Check</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant text-body-sm font-body-sm">
                      <tr className="hover:bg-surface transition-colors">
                        <td className="py-2.5 px-4 font-medium text-on-surface">Metoprolol Succinate ER</td>
                        <td className="py-2.5 px-4 font-tabular-data">50 mg</td>
                        <td className="py-2.5 px-4"><span className="text-secondary">Cleared</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="sticky bottom-0 bg-surface-container-lowest border-t border-outline-variant px-gutter-desktop py-3 flex items-center justify-between shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20 mt-auto">
              <div className="flex items-center gap-3">
                <span className="hidden lg:inline-flex items-center gap-1.5 text-label-md font-label-md text-secondary font-medium px-2.5 py-1 bg-surface-container rounded border border-outline-variant">
                  <span className="material-symbols-outlined text-[16px] text-primary">lock</span>
                  Signed under DEA #BV9921402
                </span>
                <button className="flex items-center gap-1.5 text-label-md font-label-md text-on-surface-variant hover:text-primary px-2.5 py-1.5 rounded hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  Save Draft
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleComplete}
                  disabled={selectedAppointment.status === 'Completed'}
                  className="bg-primary hover:bg-[#23534D] text-on-primary px-5 h-9 rounded text-label-md font-label-md font-semibold flex items-center gap-2 transition-colors duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  {selectedAppointment.status === 'Completed' ? 'Completed' : 'Complete Encounter'}
                </button>
              </div>
            </div>
          </section>
        ) : (
          <div className="flex-1 flex items-center justify-center text-on-surface-variant">
            Select a patient to begin consultation
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationWorkspace;
