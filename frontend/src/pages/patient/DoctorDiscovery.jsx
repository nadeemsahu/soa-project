import React, { useState } from 'react';
import { useApex } from '../../context/ApexContext';
import { useNavigate } from 'react-router-dom';

const DoctorDiscovery = () => {
  const { doctors } = useApex();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('All');

  const specialties = ['All', ...new Set(doctors.map(d => d.specialty))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'All' || doctor.specialty === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="bg-surface-container-low border-b border-outline-variant px-6 py-3 shrink-0">
        <h1 className="text-headline-sm font-headline-sm text-primary font-semibold">Find a Doctor</h1>
        <p className="text-label-sm font-label-sm text-secondary">Book an appointment with our expert specialists.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface px-6 py-3 border-b border-outline-variant flex flex-wrap items-center gap-4 shrink-0">
        <div className="relative max-w-sm w-full">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-outline">
            <span className="material-symbols-outlined text-[18px]">search</span>
          </div>
          <input 
            type="text" 
            placeholder="Search by doctor name..." 
            className="w-full pl-9 pr-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded text-body-sm font-body-sm focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-outline text-on-surface transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-label-sm font-label-sm uppercase tracking-wider text-outline flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">filter_alt</span> Specialty:
          </span>
          <select 
            className="bg-surface-container-lowest border border-outline-variant rounded px-2 py-1 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-primary"
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
          >
            {specialties.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-surface-container-low/30">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredDoctors.map(doctor => (
            <div key={doctor.id} className="bg-surface-container-lowest border border-outline-variant rounded flex flex-col hover:border-primary/50 transition-colors">
              <div className="p-4 border-b border-outline-variant/60 flex items-start gap-4">
                <div className="w-12 h-12 rounded bg-surface-container-highest text-primary flex items-center justify-center font-headline-md font-semibold border border-outline-variant shrink-0">
                  {doctor.image}
                </div>
                <div>
                  <h3 className="text-body-lg font-body-lg font-semibold text-primary">{doctor.name}</h3>
                  <p className="text-label-sm font-label-sm text-secondary">{doctor.specialty}</p>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-label-sm font-label-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-[14px]">star</span>
                      <span>{doctor.experience}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-outline-variant"></div>
                    <div className="flex items-center gap-1 text-label-sm font-label-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-[14px]">payments</span>
                      <span>${doctor.fee}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-surface flex items-center justify-between mt-auto rounded-b">
                <div>
                  <div className="text-[10px] font-label-sm uppercase tracking-wider text-outline mb-0.5">Next Available</div>
                  <div className="flex items-center gap-1 text-body-sm font-body-sm font-medium text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                    {doctor.nextAvailable}
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate(`/book/${doctor.id}`)}
                  className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-4 py-1.5 rounded transition-colors duration-150 font-medium shadow-sm"
                >
                  Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] text-outline-variant mb-2">search_off</span>
            <p className="text-body-md font-body-md">No doctors found matching your criteria.</p>
            <button 
              className="mt-4 text-label-md font-label-md text-primary hover:underline font-medium"
              onClick={() => {setSearchTerm(''); setSpecialtyFilter('All');}}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDiscovery;
