import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApex } from '../context/ApexContext';

const Home = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useApex();
  const [loadingRole, setLoadingRole] = useState(null);

  const handleQuickLogin = async (roleKey, targetRoute) => {
    setLoadingRole(roleKey);
    try {
      await login(roleKey);
      navigate(targetRoute);
    } catch (err) {
      console.error('Login failed:', err);
      navigate('/login');
    } finally {
      setLoadingRole(null);
    }
  };

  const rolePortals = [
    {
      id: 'patient',
      name: 'Patient Portal',
      roleKey: 'Patient',
      roleCode: 'ROLE_PATIENT',
      badge: 'Self-Service & Telehealth',
      badgeColor: 'bg-primary text-on-primary',
      icon: 'patient_list',
      description: 'Book specialist appointments with real-time schedule conflict prevention, inspect clinical health records, and pay itemized invoices.',
      credentials: 'ID: PT-894120 • Eleanor Vance',
      route: '/patient',
      primaryAction: 'Enter Patient Portal',
      features: ['Real-time 409 conflict detection', 'Clinical EHR history & allergies', 'Itemized billing & 5% tax settlement']
    },
    {
      id: 'doctor',
      name: 'Physician Workspace',
      roleKey: 'Doctor',
      roleCode: 'ROLE_DOCTOR',
      badge: 'Clinical Operations',
      badgeColor: 'bg-primary-container text-surface-bright',
      icon: 'stethoscope',
      description: 'Review patient rosters, access active vital signs, document diagnostic clinical notes, and execute synchronous checkout orchestration.',
      credentials: 'dr.julian.vance@metrogeneral.org',
      route: '/doctor',
      primaryAction: 'Launch Doctor Station',
      features: ['Daily patient schedule queue', 'SOAP diagnosis & vitals review', 'Synchronous checkout orchestration']
    },
    {
      id: 'billing',
      name: 'Revenue Operations',
      roleKey: 'Billing',
      roleCode: 'ROLE_BILLING_STAFF',
      badge: 'Financial Cycle Node',
      badgeColor: 'bg-secondary text-surface-bright',
      icon: 'receipt_long',
      description: 'Oversee hospital claim submissions, monitor automated 5% facility tax assessments, and inspect asynchronous Kafka choreographies.',
      credentials: 'revcycle.jvance@apexcare.org',
      route: '/billing-admin',
      primaryAction: 'Open Billing Control',
      features: ['Automated Kafka event consumer', '5% facility tax computation', 'Claim settlement & revenue KPIs']
    },
    {
      id: 'admin',
      name: 'Infrastructure & Governance',
      roleKey: 'Admin',
      roleCode: 'ROLE_ADMIN',
      badge: 'Cluster Governance',
      badgeColor: 'bg-tertiary-container text-on-primary',
      icon: 'admin_panel_settings',
      description: 'Monitor Netflix Eureka peer heartbeat status, inspect Spring Cloud Gateway load-balancer routes, and review zero-trust access logs.',
      credentials: 'sec.admin@apexcare.net',
      route: '/admin',
      primaryAction: 'System Operations Console',
      features: ['Eureka service registry (Port 8761)', 'Gateway route topology (Port 8080)', 'Zero-trust JWT security auditor']
    }
  ];

  const microservices = [
    { name: 'Eureka Server', port: '8761', tech: 'Netflix Eureka', desc: 'Centralized registry, peer heartbeat & instance discovery' },
    { name: 'API Gateway', port: '8080', tech: 'Spring Cloud Gateway', desc: 'Reverse proxy, CORS configuration & JWT claim forwarding' },
    { name: 'Auth Service', port: '8081', tech: 'Spring Security 6', desc: 'BCrypt password hashing, HMAC-SHA256 tokens & RBAC' },
    { name: 'Patient Service', port: '8082', tech: 'REST + Spring-WS', desc: 'Demographics, medical history, IDOR filter & SOAP WSDL' },
    { name: 'Appointment Service', port: '8083', tech: 'Spring Boot + Kafka', desc: 'Authoritative 409 conflict engine & checkout orchestrator' },
    { name: 'Billing Service', port: '8084', tech: 'Kafka Consumer + JPA', desc: 'Automated 5% facility tax invoicing & payment transitions' },
  ];

  const specialties = [
    { name: 'Cardiology', doctor: 'Dr. Sarah Jenkins', exp: '12 years exp', fee: '$150', tag: 'High Demand', icon: 'cardiology' },
    { name: 'General Practice', doctor: 'Dr. Marcus Vance', exp: '8 years exp', fee: '$80', tag: 'Walk-ins Welcome', icon: 'clinical_notes' },
    { name: 'Dermatology', doctor: 'Dr. Emily Chen', exp: '15 years exp', fee: '$120', tag: 'Specialist', icon: 'medical_services' },
    { name: 'Orthopedics', doctor: 'Dr. Robert Hale', exp: '20 years exp', fee: '$180', tag: 'Surgical Consult', icon: 'accessibility' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* 1. TOP GLOBAL NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-outline-variant h-16 px-gutter lg:px-margin-desktop flex items-center justify-between">
        <div className="flex items-center gap-space-lg">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-surface shadow-sm">
              <span className="material-symbols-outlined text-[22px] text-surface-bright" style={{ fontVariationSettings: "'FILL' 1" }}>vital_signs</span>
            </div>
            <div>
              <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-primary">ApexCare</span>
              <span className="hidden sm:block font-label-sm text-[10px] uppercase tracking-wider text-secondary">Healthcare Operations Platform</span>
            </div>
          </div>
          <div className="hidden xl:flex items-center gap-2 pl-space-md border-l border-outline-variant text-label-md text-on-surface-variant font-label-md">
            <span className="w-2 h-2 rounded-full bg-[#1E7B45] animate-pulse"></span>
            <span>Metro General Hospital Network • Node 04</span>
          </div>
        </div>

        {/* Center Nav Anchors */}
        <nav className="hidden md:flex items-center gap-6 text-body-sm font-body-sm font-medium text-on-surface-variant">
          <a href="#overview" className="hover:text-primary transition-colors">Overview</a>
          <a href="#portals" className="hover:text-primary transition-colors">Portals</a>
          <a href="#specialties" className="hover:text-primary transition-colors">Specialties</a>
          <a href="#architecture" className="hover:text-primary transition-colors">Architecture (SOA)</a>
          <a href="#credentials" className="hover:text-primary transition-colors">Demo Credentials</a>
        </nav>

        {/* User Status / CTA */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div 
                onClick={() => navigate(user.role?.toUpperCase() === 'DOCTOR' ? '/doctor' : user.role?.toUpperCase() === 'BILLING_STAFF' ? '/billing-admin' : user.role?.toUpperCase() === 'ADMIN' ? '/admin' : '/patient')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface cursor-pointer transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-primary text-surface-bright flex items-center justify-center text-[11px] font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-body-sm font-semibold">{user.name}</span>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-bold">
                  {user.role}
                </span>
              </div>
              <button 
                onClick={logout}
                className="p-1.5 rounded text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors"
                title="Sign Out"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                to="/login" 
                className="px-4 py-2 rounded text-body-sm font-semibold text-primary hover:bg-surface-container transition-colors"
              >
                Sign In
              </Link>
              <button
                onClick={() => handleQuickLogin('Patient', '/patient')}
                className="flex items-center gap-1.5 px-4 py-2 rounded bg-primary hover:bg-primary-container text-surface-bright text-body-sm font-semibold shadow-sm transition-colors"
              >
                <span>Launch Portal</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="overview" className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 px-gutter lg:px-margin-desktop overflow-hidden border-b border-outline-variant bg-gradient-to-b from-surface via-surface-container-low to-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C6EBD0] bg-[#EBF7EE] text-[#1E7B45] text-label-sm font-label-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#1E7B45] animate-ping"></span>
              <span>PS026 • Enterprise SOA & Microservices Healthcare Stack</span>
            </div>

            <h1 className="text-headline-xl lg:text-[44px] lg:leading-[52px] font-headline-xl text-primary font-bold tracking-tight">
              Enterprise Healthcare Operations & Patient Consultation Platform
            </h1>

            <p className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Engineered with Spring Boot 3.3 microservices, Apache Kafka event choreography, authoritative 409 conflict detection, zero-trust JWT access control, and legacy Spring-WS SOAP interoperability.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleQuickLogin('Patient', '/patient')}
                disabled={loadingRole !== null}
                className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-container text-surface-bright font-headline-sm text-body-md font-semibold flex items-center gap-2 shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined text-[20px]">person</span>
                <span>{loadingRole === 'Patient' ? 'Accessing...' : 'Enter Patient Portal'}</span>
              </button>

              <button
                onClick={() => handleQuickLogin('Doctor', '/doctor')}
                disabled={loadingRole !== null}
                className="px-6 py-3 rounded-lg bg-surface border border-outline-variant hover:border-primary text-primary font-headline-sm text-body-md font-semibold flex items-center gap-2 shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined text-[20px] text-secondary">stethoscope</span>
                <span>{loadingRole === 'Doctor' ? 'Accessing...' : 'Physician Station'}</span>
              </button>

              <a
                href="#architecture"
                className="px-4 py-3 text-body-md font-semibold text-secondary hover:text-primary flex items-center gap-1 transition-colors"
              >
                <span>Architecture Specs</span>
                <span className="material-symbols-outlined text-[16px]">south</span>
              </a>
            </div>

            {/* Value Props Checklist */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-body-sm text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1E7B45] text-[18px]">verified</span>
                <span>Schedule Conflict Prevention (409 Engine)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1E7B45] text-[18px]">verified</span>
                <span>Inter-Service: Appointment &rarr; Patient &rarr; Billing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1E7B45] text-[18px]">verified</span>
                <span>Automated 5% Facility Tax & Kafka Choreography</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1E7B45] text-[18px]">verified</span>
                <span>Dual REST JSON + SOAP WSDL Contract</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-outline-variant shadow-xl bg-surface-container-lowest">
              <img 
                src="/hero-banner.jpg" 
                alt="ApexCare Clinical Consultation & Healthcare Platform Visual" 
                className="w-full h-auto object-cover transform hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent pointer-events-none"></div>

              {/* Floating Live Badge Over Image */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-surface/90 backdrop-blur-md border border-outline-variant/60 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EBF7EE] text-[#1E7B45] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">sync</span>
                  </div>
                  <div>
                    <div className="text-label-sm font-semibold text-primary">Microservices Mesh Active</div>
                    <div className="text-[11px] text-on-surface-variant font-tabular-data">6/6 Healthy • 28 Tests Passed</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1E7B45] text-white uppercase tracking-wider">
                  Operational
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. METRICS & ARCHITECTURE SLA STRIP */}
      <section className="bg-surface-container border-b border-outline-variant py-8 px-gutter lg:px-margin-desktop">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="border-r last:border-r-0 border-outline-variant/70 pr-4">
            <div className="font-headline-xl text-headline-xl font-bold text-primary font-tabular-data">6</div>
            <div className="text-label-md font-label-md font-semibold text-secondary uppercase tracking-wider mt-1">Autonomous Services</div>
            <div className="text-body-sm text-on-surface-variant mt-0.5">Eureka, Gateway, Auth, Patient, Appointment, Billing</div>
          </div>
          <div className="border-r last:border-r-0 border-outline-variant/70 pr-4">
            <div className="font-headline-xl text-headline-xl font-bold text-[#1E7B45] font-tabular-data">28 / 28</div>
            <div className="text-label-md font-label-md font-semibold text-secondary uppercase tracking-wider mt-1">Passing Tests</div>
            <div className="text-body-sm text-on-surface-variant mt-0.5">100% Reactor unit & integration pass rate</div>
          </div>
          <div className="border-r last:border-r-0 border-outline-variant/70 pr-4">
            <div className="font-headline-xl text-headline-xl font-bold text-primary font-tabular-data">REST + SOAP</div>
            <div className="text-label-md font-label-md font-semibold text-secondary uppercase tracking-wider mt-1">Dual Service Contracts</div>
            <div className="text-body-sm text-on-surface-variant mt-0.5">JSON APIs + Legacy Spring-WS WSDL</div>
          </div>
          <div>
            <div className="font-headline-xl text-headline-xl font-bold text-primary font-tabular-data">0.0%</div>
            <div className="text-label-md font-label-md font-semibold text-secondary uppercase tracking-wider mt-1">Slot Overlap Rate</div>
            <div className="text-body-sm text-on-surface-variant mt-0.5">Guaranteed by Authoritative 409 Engine</div>
          </div>
        </div>
      </section>

      {/* 4. CLEARANCE-BASED ROLE PORTALS (Interactive Cards) */}
      <section id="portals" className="py-16 px-gutter lg:px-margin-desktop max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-semibold uppercase tracking-wider mb-3">
            Role-Based Clearance Nodes
          </div>
          <h2 className="text-headline-lg font-headline-lg font-bold text-primary tracking-tight">
            Select Your Operational Clearance
          </h2>
          <p className="text-body-md text-on-surface-variant mt-2">
            ApexCare enforces strict Zero-Trust JWT authentication and IDOR protection. Select a role below for instant one-click demonstration clearance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rolePortals.map((p) => (
            <div 
              key={p.id}
              className="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm hover:shadow-md hover:border-primary transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-surface-bright transition-colors">
                    <span className="material-symbols-outlined text-[26px]">{p.icon}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase ${p.badgeColor}`}>
                    {p.roleCode.replace('ROLE_', '')}
                  </span>
                </div>

                <h3 className="text-headline-sm font-headline-sm font-bold text-primary mb-2">
                  {p.name}
                </h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed mb-4">
                  {p.description}
                </p>

                <div className="border-t border-outline-variant/60 pt-3 mb-4">
                  <div className="text-[11px] uppercase tracking-wider text-outline font-semibold mb-2">Capabilities:</div>
                  <ul className="space-y-1.5 text-body-sm text-on-surface">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[12px]">
                        <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">check_circle</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/60">
                <div className="text-[11px] text-secondary font-medium truncate mb-3" title={p.credentials}>
                  🔑 {p.credentials}
                </div>
                <button
                  onClick={() => handleQuickLogin(p.roleKey, p.route)}
                  disabled={loadingRole !== null}
                  className="w-full py-2.5 px-4 rounded-lg bg-primary hover:bg-primary-container text-surface-bright font-semibold text-body-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>{loadingRole === p.roleKey ? 'Authenticating...' : p.primaryAction}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CLINICAL SPECIALTIES PREVIEW */}
      <section id="specialties" className="py-16 bg-surface-container-low border-y border-outline-variant px-gutter lg:px-margin-desktop">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-label-sm font-semibold uppercase tracking-wider text-secondary mb-1">Physician Directory</div>
              <h2 className="text-headline-lg font-headline-lg font-bold text-primary">Explore Medical Specialties</h2>
              <p className="text-body-md text-on-surface-variant mt-1">Experienced board-certified clinicians available across Metro General clinics.</p>
            </div>
            <button
              onClick={() => handleQuickLogin('Patient', '/doctors')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface border border-outline-variant hover:border-primary text-primary text-body-sm font-semibold shadow-sm transition-colors self-start md:self-auto"
            >
              <span>View All Specialists</span>
              <span className="material-symbols-outlined text-[16px]">search</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialties.map((s, idx) => (
              <div key={idx} className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="material-symbols-outlined text-primary text-[28px]">{s.icon}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-container text-secondary border border-outline-variant">
                    {s.tag}
                  </span>
                </div>
                <h3 className="text-headline-sm font-bold text-primary">{s.name}</h3>
                <div className="text-body-sm font-semibold text-on-surface mt-1">{s.doctor}</div>
                <div className="text-label-sm text-secondary">{s.exp}</div>
                <div className="mt-4 pt-3 border-t border-outline-variant flex items-center justify-between">
                  <span className="text-label-sm uppercase text-outline">Consultation Fee</span>
                  <span className="font-headline-sm font-bold text-primary font-tabular-data">{s.fee}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SOA ARCHITECTURE & INTER-SERVICE PIPELINE (CO-1 / CO-2) */}
      <section id="architecture" className="py-16 px-gutter lg:px-margin-desktop max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-semibold uppercase tracking-wider mb-3">
            CO-1 & CO-2 Architecture
          </div>
          <h2 className="text-headline-lg font-headline-lg font-bold text-primary tracking-tight">
            Inter-Service Pipeline & SOA Governance
          </h2>
          <p className="text-body-md text-on-surface-variant mt-2">
            The Consultation Orchestration Flow coordinates state transitions across domain microservices, bridging synchronous REST with asynchronous Kafka event choreography.
          </p>
        </div>

        {/* Pipeline Diagram Visual Box */}
        <div className="bg-primary text-surface-bright rounded-2xl p-8 shadow-xl mb-12 border border-primary-container">
          <div className="text-center text-label-sm uppercase tracking-widest text-[#A5CFC8] font-semibold mb-6">
            Synchronous Orchestration Flow: Appointment &rarr; Patient &rarr; Billing
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-primary-container/80 rounded-xl p-5 border border-[#3E6560]/40">
              <div className="flex items-center gap-2 text-[#A5CFC8] text-label-sm uppercase font-bold mb-2">
                <span className="w-6 h-6 rounded-full bg-surface-bright text-primary flex items-center justify-center font-bold text-xs">1</span>
                <span>Appointment Service</span>
              </div>
              <h4 className="font-headline-sm font-bold text-white mb-2">Authoritative Checkout</h4>
              <p className="text-body-sm text-surface-container leading-relaxed">
                Physician finishes consultation. Appointment status shifts to <code>Completed</code>, diagnosis and notes are captured, and conflict locks are verified.
              </p>
              <div className="mt-3 pt-2 border-t border-[#3E6560]/50 text-[11px] text-[#A5CFC8]">
                Endpoint: <code>POST /api/appointments/orchestrated-checkout</code>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-primary-container/80 rounded-xl p-5 border border-[#3E6560]/40">
              <div className="flex items-center gap-2 text-[#A5CFC8] text-label-sm uppercase font-bold mb-2">
                <span className="w-6 h-6 rounded-full bg-surface-bright text-primary flex items-center justify-center font-bold text-xs">2</span>
                <span>Patient Service</span>
              </div>
              <h4 className="font-headline-sm font-bold text-white mb-2">Clinical EHR Ingestion</h4>
              <p className="text-body-sm text-surface-container leading-relaxed">
                Appointment service triggers synchronous inter-service REST call to Patient Service, writing medical history records protected by IDOR filters.
              </p>
              <div className="mt-3 pt-2 border-t border-[#3E6560]/50 text-[11px] text-[#A5CFC8]">
                Endpoint: <code>POST /api/patients/{'{id}'}/records</code>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-primary-container/80 rounded-xl p-5 border border-[#3E6560]/40">
              <div className="flex items-center gap-2 text-[#A5CFC8] text-label-sm uppercase font-bold mb-2">
                <span className="w-6 h-6 rounded-full bg-surface-bright text-primary flex items-center justify-center font-bold text-xs">3</span>
                <span>Billing Service</span>
              </div>
              <h4 className="font-headline-sm font-bold text-white mb-2">Automated Revenue Cycle</h4>
              <p className="text-body-sm text-surface-container leading-relaxed">
                Generates invoice with 5% facility tax computation and dispatches <code>AppointmentCompletedEvent</code> onto Kafka topic <code>appointment-completed</code>.
              </p>
              <div className="mt-3 pt-2 border-t border-[#3E6560]/50 text-[11px] text-[#A5CFC8]">
                Endpoint: <code>POST /api/billing/generate</code> + Kafka
              </div>
            </div>
          </div>
        </div>

        {/* Microservices Topology Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {microservices.map((m, idx) => (
            <div key={idx} className="bg-surface border border-outline-variant rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-headline-sm font-bold text-primary">{m.name}</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-tabular-data font-semibold bg-surface-container text-secondary">
                  Port {m.port}
                </span>
              </div>
              <div className="text-label-sm text-secondary font-medium mb-2">{m.tech}</div>
              <div className="text-body-sm text-on-surface-variant">{m.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. DEMO CREDENTIALS REFERENCE SECTION */}
      <section id="credentials" className="py-12 bg-surface-container-low border-t border-outline-variant px-gutter lg:px-margin-desktop">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary text-[24px]">key</span>
            <div>
              <h3 className="text-headline-sm font-bold text-primary">Pre-Configured Demonstration Credentials</h3>
              <p className="text-body-sm text-on-surface-variant">Default password for all demo accounts is <code>password123</code>.</p>
            </div>
          </div>

          <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-body-sm">
                <thead className="bg-surface-container border-b border-outline-variant text-label-sm font-semibold uppercase tracking-wider text-secondary">
                  <tr>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Username / Identity</th>
                    <th className="px-5 py-3">Password</th>
                    <th className="px-5 py-3">Target Dashboard</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60 font-tabular-data">
                  <tr className="hover:bg-surface-container-low">
                    <td className="px-5 py-3 font-semibold text-primary">Patient</td>
                    <td className="px-5 py-3"><code>PT-894120</code></td>
                    <td className="px-5 py-3 font-mono text-outline">password123</td>
                    <td className="px-5 py-3 text-secondary">/patient</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => handleQuickLogin('Patient', '/patient')} className="text-[12px] font-semibold text-primary hover:underline">
                        Quick Launch &rarr;
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low">
                    <td className="px-5 py-3 font-semibold text-primary">Doctor</td>
                    <td className="px-5 py-3"><code>dr.julian.vance@metrogeneral.org</code></td>
                    <td className="px-5 py-3 font-mono text-outline">password123</td>
                    <td className="px-5 py-3 text-secondary">/doctor</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => handleQuickLogin('Doctor', '/doctor')} className="text-[12px] font-semibold text-primary hover:underline">
                        Quick Launch &rarr;
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low">
                    <td className="px-5 py-3 font-semibold text-primary">Billing Staff</td>
                    <td className="px-5 py-3"><code>revcycle.jvance@apexcare.org</code></td>
                    <td className="px-5 py-3 font-mono text-outline">password123</td>
                    <td className="px-5 py-3 text-secondary">/billing-admin</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => handleQuickLogin('Billing', '/billing-admin')} className="text-[12px] font-semibold text-primary hover:underline">
                        Quick Launch &rarr;
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low">
                    <td className="px-5 py-3 font-semibold text-primary">Administrator</td>
                    <td className="px-5 py-3"><code>sec.admin@apexcare.net</code></td>
                    <td className="px-5 py-3 font-mono text-outline">password123</td>
                    <td className="px-5 py-3 text-secondary">/admin</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => handleQuickLogin('Admin', '/admin')} className="text-[12px] font-semibold text-primary hover:underline">
                        Quick Launch &rarr;
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-surface border-t border-outline-variant py-8 px-gutter lg:px-margin-desktop text-body-sm text-on-surface-variant">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-headline-sm font-bold text-primary">ApexCare</span>
            <span>• Enterprise Healthcare Operations & Patient Consultation Platform</span>
          </div>

          <div className="flex items-center gap-4 text-label-sm uppercase tracking-wider font-semibold text-secondary">
            <span>PS026 Compliant</span>
            <span>•</span>
            <span>CO-1: SOA Principles</span>
            <span>•</span>
            <span>CO-2: Microservices Security</span>
          </div>

          <div className="text-outline text-xs">
            © 2026 Metro General Hospital Systems. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
