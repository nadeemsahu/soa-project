import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApex } from '../context/ApexContext';

const Login = () => {
  const [role, setRole] = useState('Doctor');
  const [identity, setIdentity] = useState('dr.julian.vance@metrogeneral.org');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useApex();

  const handleRoleSelect = (selectedRole, placeholder, defaultVal) => {
    setRole(selectedRole);
    setIdentity(defaultVal);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(role);
      const userRole = (userData?.role || role).toUpperCase().replace(/[\s-]+/g, '_');
      if (userRole === 'DOCTOR') navigate('/doctor');
      else if (userRole === 'BILLING_STAFF' || userRole === 'BILLING') navigate('/billing-admin');
      else if (userRole === 'ADMIN' || userRole === 'ADMINISTRATOR') navigate('/admin');
      else navigate('/');
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <main className="min-h-screen flex flex-col lg:flex-row w-full bg-background text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Left Architectural & Institutional Presence Frame */}
      <section className="relative w-full lg:w-5/12 xl:w-1/2 bg-surface-container-low border-b lg:border-b-0 lg:border-r border-outline-variant flex flex-col justify-between p-margin-tablet lg:p-margin-desktop overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-10">
          <svg className="w-full h-full text-primary" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="login-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                <circle cx="40" cy="40" r="1.5" fill="currentColor" fillOpacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#login-grid)" />
          </svg>
        </div>
        
        {/* Top Section */}
        <div className="relative z-10">
          <div className="flex items-center gap-space-sm mb-space-lg">
            <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-surface shadow-none border border-outline-variant/30">
              <span className="material-symbols-outlined text-[20px] text-surface-bright">health_and_safety</span>
            </div>
            <div>
              <span className="font-headline-sm text-headline-sm font-semibold tracking-tight text-primary">ApexCare</span>
              <span className="block font-label-sm text-label-sm text-secondary">Clinical & Enterprise Health</span>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-space-sm py-0.5 rounded border border-outline-variant/60 bg-surface-container/60 mb-space-md">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">Metro General Hospital Network • Node 04</span>
          </div>
        </div>
        
        {/* Middle Section */}
        <div className="relative z-10 my-10 lg:my-0 max-w-lg">
          <div className="border-l-2 border-primary pl-space-md py-1 mb-space-lg">
            <p className="font-headline-sm text-headline-sm text-primary mb-space-sm leading-snug font-semibold">"High-fidelity clinical synchronization engineered to mitigate diagnostic fatigue and safeguard patient records."</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Encrypted zero-knowledge ledger complying with HIPAA Title II, SOC 2 Type II, and Federal EHR Interoperability protocols.</p>
          </div>
          <div className="grid grid-cols-2 gap-space-md pt-space-lg border-t border-outline-variant/70">
            <div className="p-space-sm rounded bg-surface-container-lowest/80 border border-outline-variant/60">
              <div className="font-tabular-data text-[20px] text-primary font-semibold tracking-tight">99.994%</div>
              <div className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mt-1">Critical Pathway Uptime</div>
            </div>
            <div className="p-space-sm rounded bg-surface-container-lowest/80 border border-outline-variant/60">
              <div className="font-tabular-data text-[20px] text-primary font-semibold tracking-tight">256-bit AES</div>
              <div className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mt-1">At-Rest Biometric Partition</div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="relative z-10 pt-space-lg flex items-center justify-between border-t border-outline-variant/70">
          <div className="flex items-center gap-space-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-secondary">verified_user</span>
            <span className="font-label-sm text-label-sm">FIPS 140-3 Cryptographic Validation</span>
          </div>
          <div className="font-label-sm text-label-sm text-outline">v4.2.8 Enterprise</div>
        </div>
      </section>

      {/* Right Form Frame */}
      <section className="w-full lg:w-7/12 xl:w-1/2 bg-surface flex flex-col justify-center items-center p-gutter md:p-margin-tablet lg:p-margin-desktop">
        <div className="w-full max-w-md">
          <div className="mb-space-lg">
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Sign In to Workspace</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Select credential clearance and provide authenticated access key.</p>
          </div>

          <div className="mb-space-lg">
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-space-xs">Clearance Scope</label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-surface-container-low rounded border border-outline-variant" role="tablist">
              {[
                { name: 'Patient', label: 'Patient MRN or Email', default: 'PT-894120' },
                { name: 'Doctor', label: 'Provider NPI / Work Email', default: 'dr.julian.vance@metrogeneral.org' },
                { name: 'Billing Staff', label: 'Billing ID / Enterprise ID', default: 'revcycle.jvance@apexcare.org' },
                { name: 'Administrator', label: 'System Admin Credential', default: 'sec.admin@apexcare.net' }
              ].map((r) => (
                <button
                  key={r.name}
                  onClick={() => handleRoleSelect(r.name, r.label, r.default)}
                  type="button"
                  className={`font-label-md text-label-md py-2 px-2 rounded text-center transition-colors duration-150 cursor-pointer ${
                    role === r.name 
                      ? 'bg-surface-container-lowest text-primary shadow-sm border border-outline-variant font-semibold' 
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {r.name === 'Administrator' ? 'Admin' : r.name}
                </button>
              ))}
            </div>
          </div>

          <form className="space-y-space-md" onSubmit={handleLogin}>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-label-md text-label-md text-on-surface">
                  {
                    role === 'Patient' ? 'Patient MRN or Email' :
                    role === 'Doctor' ? 'Provider NPI / Work Email' :
                    role === 'Billing Staff' ? 'Billing ID / Enterprise ID' : 'System Admin Credential'
                  }
                </label>
                <span className="font-label-sm text-label-sm text-outline">Standard Auth</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                </div>
                <input 
                  type="text" 
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded py-2 pl-10 pr-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-label-md text-label-md text-on-surface">Security Key or Password</label>
                <a href="#" className="font-label-md text-label-md text-secondary hover:text-primary transition-colors duration-150">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  defaultValue="••••••••••••••••"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded py-2 pl-10 pr-10 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-space-sm cursor-pointer select-none">
                <input defaultChecked type="checkbox" className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-0 focus:ring-offset-0 bg-surface-container-lowest" />
                <span className="font-body-sm text-body-sm text-on-surface-variant">Remember this workstation session</span>
              </label>
              <span className="font-label-sm text-label-sm text-outline flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">timer</span>
                12h Timeout
              </span>
            </div>

            <div className="pt-space-xs">
              <button type="submit" className="w-full h-10 bg-primary-container text-on-primary hover:bg-primary rounded font-label-md text-label-md font-medium tracking-wide flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer">
                <span>Sign In to Workspace</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </form>

          <div className="mt-space-lg pt-space-md border-t border-outline-variant text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-xs">Unregistered medical staff or looking for patient records?</p>
            <a href="#" className="inline-flex items-center gap-1 font-label-md text-label-md text-secondary hover:text-primary transition-colors duration-150 font-medium">
              <span>Request Patient Portal Access or Hospital Staff Onboarding</span>
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
            </a>
          </div>

          <div className="mt-space-md p-space-sm rounded bg-surface-container-low border border-outline-variant flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-error text-[20px]">e911_emergency</span>
              <div>
                <div className="font-label-md text-label-md text-on-surface font-medium">Triage Emergency Override</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">Bypass standard identity for rapid intake code red</div>
              </div>
            </div>
            <button type="button" className="px-space-sm py-1 border border-outline text-error hover:bg-error-container/20 rounded font-label-sm text-label-sm font-semibold transition-colors duration-150">Override</button>
          </div>

          <div className="mt-space-xl flex justify-between items-center text-outline">
            <span className="font-label-sm text-label-sm">Protected Health Information (PHI) Notice</span>
            <div className="flex gap-space-sm font-label-sm text-label-sm">
              <a href="#" className="hover:text-on-surface-variant transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-on-surface-variant transition-colors">Help Desk</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
