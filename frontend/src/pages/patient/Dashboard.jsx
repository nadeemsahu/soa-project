import React from 'react';
import { useApex } from '../../context/ApexContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, appointments, bills } = useApex();
  const navigate = useNavigate();

  const nextAppointment = appointments.find(a => a.status === 'Upcoming');
  const pendingBill = bills.find(b => b.status === 'Pending');

  return (
    <>
      {/* HERO PATIENT BANNER / GREETING BAR */}
      <section className="border-b border-outline-variant bg-surface-container-low px-gutter-desktop py-space-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-2 text-label-md font-label-md text-secondary mb-1">
              <span className="material-symbols-outlined text-[15px]">event</span>
              <span className="font-tabular-data">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="text-outline-variant">•</span>
              <span className="text-on-surface-variant">Metro General Medical Center</span>
            </div>
            <h1 className="text-headline-lg font-headline-lg text-primary tracking-tight">Good morning, {user.name}</h1>
            <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">Your care record is fully up to date. You have one cardiology review scheduled tomorrow morning.</p>
          </div>
          
          <div className="flex items-center flex-wrap gap-2">
            <button onClick={() => navigate('/doctors')} className="h-9 px-3.5 bg-primary hover:bg-primary-container text-on-primary rounded text-label-md font-label-md flex items-center gap-1.5 transition-colors duration-150 shadow-none">
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>Book Appointment</span>
            </button>
            <button onClick={() => navigate('/medical-record')} className="h-9 px-3 bg-surface-container-lowest hover:bg-surface-container border border-outline-variant text-primary rounded text-label-md font-label-md flex items-center gap-1.5 transition-colors duration-150">
              <span className="material-symbols-outlined text-[16px]">folder_shared</span>
              <span>View Records</span>
            </button>
            {pendingBill && (
              <button onClick={() => navigate('/bills')} className="h-9 px-3 bg-surface-container-lowest hover:bg-[#fdf2f1] border border-[#a63228]/30 text-error rounded text-label-md font-label-md flex items-center gap-1.5 transition-colors duration-150">
                <span className="material-symbols-outlined text-[16px]">credit_card</span>
                <span>Pay Outstanding Bill (${pendingBill.amount.toFixed(2)})</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* CONTENT CANVAS: ASYMMETRIC GRID */}
      <div className="max-w-7xl mx-auto w-full p-gutter-desktop flex-1 flex flex-col gap-space-lg">
        
        {/* SECTION 1: LARGE PROMINENT NEXT SCHEDULED APPOINTMENT */}
        {nextAppointment && (
          <section className="border border-outline-variant bg-surface-container-lowest rounded p-6 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-label-sm font-semibold bg-secondary-container text-on-secondary-container tracking-wider uppercase">
                    Next Scheduled Appointment
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-label-sm font-medium bg-[#f0f9f5] border border-[#b2cdbe] text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    Confirmed & Pre-Registered
                  </span>
                </div>
                <div className="flex items-start gap-4 mt-3">
                  <div className="w-16 h-16 rounded object-cover border border-outline-variant shrink-0 bg-surface-container flex items-center justify-center font-headline-lg text-primary">
                    {nextAppointment.doctorName.split(' ')[1]?.[0] || 'D'}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-headline-md font-headline-md text-primary">{nextAppointment.doctorName}</h2>
                      <span className="text-body-sm font-body-sm text-secondary font-medium">{nextAppointment.specialty}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-body-sm font-body-sm text-on-surface">
                      <div className="flex items-center gap-1.5 font-medium text-primary">
                        <span className="material-symbols-outlined text-[17px] text-secondary">schedule</span>
                        <span>{new Date(nextAppointment.date).toLocaleDateString()} at {nextAppointment.time}</span>
                      </div>
                      <span className="text-outline-variant hidden sm:inline">•</span>
                      <div className="flex items-center gap-1.5 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[17px] text-outline">distance</span>
                        <span>Metro General Heart Center</span>
                      </div>
                    </div>
                    
                    <div className="mt-3.5 p-2.5 rounded bg-surface-container-low border border-outline-variant flex items-start gap-2.5 max-w-2xl">
                      <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">info</span>
                      <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                        <strong className="font-medium text-on-surface">Arrival Protocol:</strong> Please park in East Garage Level 2. Check-in directly via kiosk or show your confirmed pass at Reception 3B. Fasting is not required for this {nextAppointment.reason}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 justify-center">
                <button className="h-10 px-5 bg-primary hover:bg-[#23534d] text-[#fbfbf9] rounded text-label-md font-label-md flex items-center justify-center gap-2 transition-colors duration-150 font-medium">
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  <span>Manage Appointment / Check-in</span>
                </button>
                <button className="h-9 px-4 bg-surface-container-lowest hover:bg-surface-container border border-outline-variant text-primary rounded text-label-md font-label-md flex items-center justify-center gap-1.5 transition-colors duration-150 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-secondary">directions</span>
                  <span>Get Driving & Parking Directions</span>
                </button>
                <button className="h-8 px-3 text-secondary hover:text-primary hover:bg-surface-container-low rounded text-label-sm font-label-sm flex items-center justify-center gap-1.5 transition-colors duration-150">
                  <span className="material-symbols-outlined text-[15px]">calendar_month</span>
                  <span>Reschedule Visit</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* DUAL COLUMN SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* LEFT COLUMN: TIMELINE */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            <div className="border border-outline-variant bg-surface-container-lowest rounded overflow-hidden">
              <div className="bg-surface-container-low px-4 py-3 border-b border-outline-variant flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">history_edu</span>
                  <h3 className="text-headline-sm font-headline-sm text-primary">Upcoming & Recent Care Timeline</h3>
                </div>
                <a href="#" className="text-label-sm font-label-sm text-secondary hover:text-primary transition-colors flex items-center gap-0.5">
                  <span>View full medical record</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </a>
              </div>
              
              <div className="divide-y divide-outline-variant">
                <div className="p-4 hover:bg-surface transition-colors duration-150 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded bg-surface-container-low border border-outline-variant flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">biotech</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-body-sm font-semibold text-primary">Comprehensive Metabolic Panel (CMP-14)</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-label-sm font-semibold bg-[#e8f5e9] text-[#1b433e] border border-[#c8e6c9]">
                          Ready for Review
                        </span>
                      </div>
                      <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">Collected Oct 22, 2024 • LabCorp Metro Center • Authorized by Dr. Sarah Chen</p>
                      <div className="flex items-center gap-4 mt-2 text-label-sm font-label-sm text-secondary">
                        <span className="flex items-center gap-1 font-tabular-data"><span className="w-1.5 h-1.5 rounded-full bg-[#1b433e]"></span> Potassium: 4.2 mEq/L (Normal)</span>
                        <span className="flex items-center gap-1 font-tabular-data"><span className="w-1.5 h-1.5 rounded-full bg-[#1b433e]"></span> eGFR: &gt;60 mL/min (Stable)</span>
                      </div>
                    </div>
                  </div>
                  <button className="h-8 px-3 bg-surface-container hover:bg-surface-container-high text-primary rounded text-label-sm font-label-sm font-medium shrink-0 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">description</span>
                    <span>View PDF</span>
                  </button>
                </div>

                <div className="p-4 hover:bg-surface transition-colors duration-150 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded bg-surface-container-low border border-outline-variant flex items-center justify-center text-secondary shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-body-sm font-semibold text-primary">Cardiology Follow-Up & ECG Review</span>
                        <span className="text-label-sm font-label-sm text-outline font-tabular-data">Oct 10, 2024</span>
                      </div>
                      <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">Dr. Julian Vance, MD • Metro Heart Clinic Suite 304B</p>
                      <p className="text-body-sm font-body-sm text-on-surface mt-1.5 line-clamp-2 leading-relaxed">
                        "Patient demonstrates normal sinus rhythm with mild non-specific ST changes, improved compared to baseline. Advised to maintain low-sodium diet and continue Lisinopril 10mg."
                      </p>
                    </div>
                  </div>
                  <button className="h-8 px-3 border border-outline-variant hover:bg-surface text-secondary rounded text-label-sm font-label-sm font-medium shrink-0 flex items-center gap-1">
                    <span>Clinical Note</span>
                  </button>
                </div>
              </div>
              
              <div className="p-3 bg-surface-container-low/50 border-t border-outline-variant text-center">
                <span className="text-label-sm font-label-sm text-outline">Records retained pursuant to HIPAA & Medical Retention Compliance Protocol 2024</span>
              </div>
            </div>

            {/* Vitals Quick Strip */}
            <div className="border border-outline-variant bg-surface-container-lowest rounded p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Latest Recorded Vitals</span>
                <span className="text-label-sm font-label-sm text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">sensors</span> Telemetry Sync Active
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 bg-surface-container-low rounded border border-outline-variant">
                  <span className="text-label-sm font-label-sm text-on-surface-variant block">Blood Pressure</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-tabular-data text-headline-sm font-semibold text-primary">122/78</span>
                    <span className="text-label-sm text-outline">mmHg</span>
                  </div>
                  <span className="text-[10px] text-secondary font-medium">Optimal range</span>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded border border-outline-variant">
                  <span className="text-label-sm font-label-sm text-on-surface-variant block">Heart Rate</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-tabular-data text-headline-sm font-semibold text-primary">68</span>
                    <span className="text-label-sm text-outline">BPM</span>
                  </div>
                  <span className="text-[10px] text-secondary font-medium">Resting regular</span>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded border border-outline-variant">
                  <span className="text-label-sm font-label-sm text-on-surface-variant block">Oxygen Sat (SpO2)</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-tabular-data text-headline-sm font-semibold text-primary">98%</span>
                    <span className="text-label-sm text-outline">Room Air</span>
                  </div>
                  <span className="text-[10px] text-secondary font-medium">Normal</span>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded border border-outline-variant">
                  <span className="text-label-sm font-label-sm text-on-surface-variant block">Weight</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-tabular-data text-headline-sm font-semibold text-primary">144.2</span>
                    <span className="text-label-sm text-outline">lbs</span>
                  </div>
                  <span className="text-[10px] text-outline font-medium">-0.8 lbs this wk</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            {pendingBill && (
              <div className="border border-outline-variant bg-surface-container-lowest rounded overflow-hidden">
                <div className="bg-surface-container-low px-4 py-3 border-b border-outline-variant flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">receipt_long</span>
                    <h3 className="text-headline-sm font-headline-sm text-primary">Outstanding Medical Bill</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-label-sm font-label-sm font-semibold bg-[#fdf2f1] text-error border border-[#ffdad6]">
                    Action Needed
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-baseline justify-between border-b border-outline-variant pb-4">
                    <div>
                      <span className="text-label-sm font-label-sm text-on-surface-variant block">Patient Responsibility</span>
                      <span className="font-tabular-data text-headline-xl font-bold text-primary">${pendingBill.amount.toFixed(2)}</span>
                      <span className="text-label-sm font-label-sm text-error font-medium block mt-0.5">Due in 14 days</span>
                    </div>
                    <div className="text-right">
                      <span className="text-label-sm font-label-sm text-outline block">Account Number</span>
                      <span className="font-tabular-data text-body-sm font-medium text-on-surface">{pendingBill.id.toUpperCase()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 flex flex-col gap-2">
                    <button onClick={() => navigate(`/bills/${pendingBill.id}`)} className="w-full h-10 bg-primary hover:bg-primary-container text-on-primary rounded text-label-md font-label-md font-medium flex items-center justify-center gap-2 transition-colors duration-150">
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                      <span>Review & Settle Bill (${pendingBill.amount.toFixed(2)})</span>
                    </button>
                    <div className="flex items-center justify-between text-label-sm font-label-sm text-outline px-1">
                      <a href="#" className="hover:underline text-secondary">Download Itemized Statement</a>
                      <span>FSA / HSA Eligible</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="border border-outline-variant bg-surface-container-lowest rounded overflow-hidden">
              <div className="bg-surface-container-low px-4 py-3 border-b border-outline-variant flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">medication</span>
                  <h3 className="text-headline-sm font-headline-sm text-primary">Prescription Adherence</h3>
                </div>
                <span className="text-label-sm font-label-sm text-secondary font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">local_pharmacy</span> Metro Pharmacy 04
                </span>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div className="p-3 bg-surface-container-low rounded border border-outline-variant">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-body-sm font-semibold text-primary">Metoprolol Succinate ER</h4>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-label-sm font-medium bg-secondary-container text-on-secondary-container">
                          Active Daily
                        </span>
                      </div>
                      <p className="text-label-sm font-label-sm text-on-surface-variant mt-0.5">50 mg • Take 1 tablet by mouth each morning</p>
                    </div>
                    <span className="text-label-sm font-label-sm font-tabular-data text-secondary font-semibold">96% on-time</span>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-label-sm font-label-sm text-outline mb-1 font-tabular-data">
                      <span>28 of 30 days taken this cycle</span>
                      <span>14 days supply remaining</span>
                    </div>
                    <div className="w-full bg-outline-variant/40 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '93%' }}></div>
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-outline-variant flex items-center justify-between text-label-sm font-label-sm">
                    <span className="text-outline">Last taken: Today at 8:15 AM</span>
                    <button className="text-primary font-medium hover:underline">Request Refill</button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
