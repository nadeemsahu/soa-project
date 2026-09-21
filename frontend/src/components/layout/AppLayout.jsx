import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApex } from '../../context/ApexContext';

const AppLayout = () => {
  const { user, logout } = useApex();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    const role = user?.role?.toUpperCase();
    if (role === 'PATIENT') {
      return [
        { name: 'Overview', path: '/', icon: 'dashboard' },
        { name: 'Appointments', path: '/appointments', icon: 'calendar_today', badge: '1' },
        { name: 'Doctors', path: '/doctors', icon: 'medical_services' },
        { name: 'Medical Records', path: '/records', icon: 'clinical_notes' },
        { name: 'Bills', path: '/bills', icon: 'payments', alert: true },
      ];
    } else if (role === 'DOCTOR') {
      return [
        { name: 'Dashboard', path: '/doctor', icon: 'dashboard' },
        { name: 'Consultation Workspace', path: '/doctor/consultation/a1', icon: 'stethoscope' },
      ];
    } else if (role === 'BILLING_STAFF') {
      return [
        { name: 'Billing Control', path: '/billing-admin', icon: 'receipt_long' },
      ];
    } else if (role === 'ADMIN') {
      return [
        { name: 'System Console', path: '/admin', icon: 'admin_panel_settings' },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  return (
    <div className="bg-background text-on-surface antialiased min-h-screen flex flex-col font-body-md text-body-md select-none">
      <header className="bg-surface border-b border-outline-variant flex justify-between items-center h-14 px-gutter-desktop w-full sticky top-0 z-30">
        <div className="flex items-center gap-space-lg">
          <div className="flex items-center gap-space-sm cursor-pointer" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1", fontSize: "22px" }}>vital_signs</span>
            <span className="text-headline-sm font-headline-sm font-semibold tracking-tight text-primary">ApexCare</span>
          </div>
          <div className="hidden lg:flex items-center gap-space-md pl-space-md border-l border-outline-variant">
            <div className="flex items-center gap-space-xs text-on-surface-variant text-label-md font-label-md">
              <span className="material-symbols-outlined text-[16px]">domain</span>
              <span>Facility: Metro General</span>
            </div>
            <span className="text-outline-variant text-[12px]">•</span>
            <div className="flex items-center gap-space-xs text-on-surface-variant text-label-md font-label-md">
              <span className="material-symbols-outlined text-[16px]">stethoscope</span>
              <span>Dept: {user?.role?.toUpperCase() === 'DOCTOR' ? 'Cardiology' : user?.role?.toUpperCase() === 'BILLING_STAFF' ? 'Revenue Operations' : user?.role?.toUpperCase() === 'ADMIN' ? 'Infrastructure' : 'Acute Surgery'}</span>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-space-xl">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px]">search</span>
            <input 
              type="text" 
              className="w-full h-8 pl-8 pr-3 text-body-sm font-body-sm bg-surface-container-low border border-outline-variant rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-outline" 
              placeholder="Search tests, visit notes, physicians..." 
            />
          </div>
        </div>
        
        <div className="flex items-center gap-space-md">
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container border border-outline-variant rounded text-label-md font-label-md text-primary transition-colors duration-150">
            <span className="material-symbols-outlined text-[16px] text-secondary">support_agent</span>
            <span>Care Navigator</span>
          </button>
          <div className="h-4 w-px bg-outline-variant hidden sm:block"></div>
          <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high rounded transition-colors duration-150 relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface"></span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high rounded transition-colors duration-150">
            <span className="material-symbols-outlined">help_center</span>
          </button>
          <div className="flex items-center gap-2 pl-1 cursor-pointer" onClick={handleLogout}>
            <div className="w-8 h-8 rounded-full bg-primary text-[#fbfbf9] flex items-center justify-center font-headline-sm text-[12px] font-semibold ring-1 ring-outline-variant" title="Logout">
              {user?.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 bg-surface-container-low border-r border-outline-variant flex flex-col justify-between shrink-0 h-[calc(100vh-3.5rem)] select-none">
          <div className="flex flex-col p-space-md gap-space-md">
            <div className="p-2.5 bg-surface-container rounded border border-outline-variant flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary text-[#fbfbf9] flex items-center justify-center font-headline-sm text-[13px] font-semibold">
                {user?.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-body-sm font-semibold text-on-surface truncate">{user?.name}</span>
                <span className="text-label-sm font-label-sm text-on-surface-variant">{user?.role?.toUpperCase() === 'DOCTOR' ? 'NPI: #109841' : `ID: #${user?.id}`}</span>
              </div>
            </div>
            
            <nav className="flex flex-col gap-1">
              <div className="px-space-sm pb-1 text-label-sm font-label-sm text-outline uppercase tracking-wider">
                {user?.role?.toUpperCase()} Portal
              </div>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link 
                    key={link.name} 
                    to={link.path}
                    className={`flex items-center gap-3 px-space-sm py-2 rounded transition-colors duration-150 ${
                      isActive 
                        ? 'text-primary bg-surface-container-highest font-medium border-l-2 border-primary' 
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-primary font-normal'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                      {link.icon}
                    </span>
                    <span className="text-body-sm">{link.name}</span>
                    {link.badge && <span className="ml-auto text-label-sm px-1.5 py-0.2 rounded bg-surface-container-high text-primary font-tabular-data">{link.badge}</span>}
                    {link.alert && <span className="ml-auto w-2 h-2 rounded-full bg-error"></span>}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="p-space-md border-t border-outline-variant flex flex-col gap-2">
            <div className="px-space-sm py-1.5 bg-surface-container rounded flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[16px]">support_agent</span>
                <span className="text-label-sm font-label-sm text-on-surface">Care Navigator</span>
              </div>
              <span className="text-label-sm font-label-sm text-secondary font-tabular-data">Ext 410</span>
            </div>
            <div className="flex items-center justify-between text-label-sm font-label-sm text-outline px-space-sm">
              <span>ApexCare v4.2 Client</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#1B433E]"></span> Secure SSL</span>
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-surface overflow-y-auto custom-scrollbar flex flex-col">
          <Outlet />
          
          <footer className="mt-auto border-t border-outline-variant bg-surface-container-low px-gutter-desktop py-space-md text-label-sm font-label-sm text-outline">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>
                <span>ApexCare Health Portal • Metro General Hospital Authority • HIPAA Certified</span>
              </div>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-primary transition-colors">Privacy Practices</a>
                <span>•</span>
                <a href="#" className="hover:text-primary transition-colors">Patient Rights</a>
                <span>•</span>
                <a href="#" className="hover:text-primary transition-colors">24/7 Nurse Advice Line: (800) 555-0199</a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
