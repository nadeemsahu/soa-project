import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApex } from '../../context/ApexContext';

const AppointmentBooking = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { doctors, bookAppointment } = useApex();
  
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(doctorId || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const doctor = doctors.find(d => d.id === selectedDoctor);
  
  const availableSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '02:00 PM', '02:30 PM', '04:00 PM'];
  
  const nextDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => {
    setErrorMsg(null);
    setStep(prev => prev - 1);
  };
  
  const handleConfirm = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await bookAppointment({
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        date: selectedDate,
        time: selectedTime,
        reason: reason
      });
      setStep(5);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setErrorMsg("This appointment time is no longer available. Please choose another time.");
        setStep(3); // Go back to time selection
      } else {
        setErrorMsg("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedDoctor) {
    navigate('/doctors');
    return null;
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="bg-surface-container-low border-b border-outline-variant px-6 py-3 shrink-0 flex items-center gap-4">
        {step < 5 && (
          <button 
            onClick={step === 1 ? () => navigate('/doctors') : handleBack}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-high text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
        )}
        <div>
          <h1 className="text-headline-sm font-headline-sm text-primary font-semibold">Book Appointment</h1>
          <p className="text-label-sm font-label-sm text-secondary">Schedule your consultation with {doctor?.name}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex justify-center">
        <div className="w-full max-w-2xl space-y-6">
          
          {errorMsg && (
            <div className="bg-[#FDF2F1] border border-[#f3c8c4] text-[#A63228] px-4 py-3 rounded flex items-start gap-3">
              <span className="material-symbols-outlined text-[20px] mt-0.5">error</span>
              <span className="text-body-sm font-body-sm font-medium">{errorMsg}</span>
            </div>
          )}

          {step === 1 && (
            <div className="bg-surface border border-outline-variant rounded p-6 shadow-sm">
              <h2 className="text-headline-sm font-headline-sm text-primary mb-4">Selected Doctor</h2>
              <div className="flex items-center gap-4 p-4 bg-surface-container-lowest border border-outline-variant rounded mb-6">
                <div className="w-12 h-12 rounded bg-surface-container-highest text-primary flex items-center justify-center font-headline-md font-semibold border border-outline-variant">
                  {doctor.image}
                </div>
                <div>
                  <h3 className="text-body-lg font-body-lg font-semibold text-primary">{doctor.name}</h3>
                  <p className="text-label-sm font-label-sm text-secondary">{doctor.specialty}</p>
                  <p className="text-label-sm font-label-sm text-on-surface-variant mt-1">${doctor.fee} per consultation</p>
                </div>
              </div>
              <button 
                onClick={handleNext}
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md h-10 rounded transition-colors duration-150 shadow-none font-medium"
              >
                Continue to Date Selection
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-surface border border-outline-variant rounded p-6 shadow-sm">
              <h2 className="text-headline-sm font-headline-sm text-primary mb-4">Select Date</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {nextDays.map(date => {
                  const dateStr = date.toISOString().split('T')[0];
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button 
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`flex flex-col items-center justify-center p-3 rounded border transition-colors ${isSelected ? 'bg-primary-container border-primary-container text-on-primary' : 'bg-surface-container-lowest border-outline-variant text-on-surface hover:bg-surface-container-high'}`}
                    >
                      <span className="text-label-sm font-label-sm uppercase tracking-wider opacity-80">
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-headline-md font-headline-md font-bold my-1">
                        {date.getDate()}
                      </span>
                      <span className="text-label-sm font-label-sm opacity-80">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                    </button>
                  );
                })}
              </div>
              <button 
                onClick={handleNext} 
                disabled={!selectedDate}
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md h-10 rounded transition-colors duration-150 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Time Selection
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="bg-surface border border-outline-variant rounded p-6 shadow-sm">
              <h2 className="text-headline-sm font-headline-sm text-primary mb-1">Select Time</h2>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-4">
                Showing slots for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {availableSlots.map(time => {
                  const isSelected = selectedTime === time;
                  return (
                    <button 
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 rounded font-tabular-data text-body-sm border transition-colors ${isSelected ? 'bg-primary-container border-primary-container text-on-primary font-bold' : 'bg-surface-container-lowest border-outline-variant text-on-surface hover:bg-surface-container-high'}`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
              
              <button 
                onClick={handleNext} 
                disabled={!selectedTime}
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md h-10 rounded transition-colors duration-150 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Details
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="bg-surface border border-outline-variant rounded p-6 shadow-sm">
              <h2 className="text-headline-sm font-headline-sm text-primary mb-4">Appointment Details</h2>
              
              <div className="bg-surface-container-lowest border border-outline-variant rounded p-4 mb-6 space-y-3">
                <div className="flex items-center gap-3 text-body-sm font-body-sm text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-secondary">person</span>
                  <span>{doctor.name} ({doctor.specialty})</span>
                </div>
                <div className="flex items-center gap-3 text-body-sm font-body-sm text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-secondary">calendar_today</span>
                  <span>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-3 text-body-sm font-body-sm text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-secondary">schedule</span>
                  <span>{selectedTime}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-label-sm font-label-sm uppercase tracking-wider text-secondary mb-2">Reason for Visit</label>
                <textarea 
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 text-body-sm font-body-sm focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none" 
                  rows={4} 
                  placeholder="Briefly describe your symptoms or reason for consultation..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              
              <button 
                onClick={handleConfirm} 
                disabled={!reason.trim() || isSubmitting}
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md h-10 rounded flex items-center justify-center gap-2 transition-colors duration-150 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    Confirming...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Confirm Appointment
                  </>
                )}
              </button>
            </div>
          )}

          {step === 5 && (
            <div className="bg-surface border border-outline-variant rounded p-8 shadow-sm text-center">
              <span className="material-symbols-outlined text-[64px] text-primary mb-4">check_circle</span>
              <h2 className="text-headline-md font-headline-md text-primary mb-2">Appointment Confirmed!</h2>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-8">
                Your consultation with {doctor.name} has been successfully scheduled.
              </p>
              
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <button 
                  onClick={() => navigate('/appointments')} 
                  className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md h-10 rounded transition-colors duration-150 font-medium"
                >
                  View My Appointments
                </button>
                <button 
                  onClick={() => navigate('/')} 
                  className="w-full bg-surface-container-lowest hover:bg-surface-container text-primary border border-outline-variant font-label-md text-label-md h-10 rounded transition-colors duration-150 font-medium"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
