import React from 'react';
import { useApex } from '../../context/ApexContext';

const AdminDashboard = () => {
  const { user } = useApex();

  const services = [
    { name: 'EUREKA-SERVER', port: 8761, status: 'UP', role: 'Service Discovery Registry', protocol: 'HTTP REST' },
    { name: 'API-GATEWAY', port: 8080, status: 'UP', role: 'Unified Gateway & JWT Router', protocol: 'Spring Cloud Gateway' },
    { name: 'AUTH-SERVICE', port: 8081, status: 'UP', role: 'Security, BCrypt & JWT Issuer', protocol: 'REST / Spring Security' },
    { name: 'PATIENT-SERVICE', port: 8082, status: 'UP', role: 'Clinical Records & Demographics', protocol: 'REST + SOAP (WSDL)' },
    { name: 'APPOINTMENT-SERVICE', port: 8083, status: 'UP', role: 'Scheduling & 409 Conflict Engine', protocol: 'REST + Kafka Producer' },
    { name: 'BILLING-SERVICE', port: 8084, status: 'UP', role: 'Invoicing & Claims Processing', protocol: 'REST + Kafka Consumer' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="bg-surface-container-low border-b border-outline-variant px-6 py-4 shrink-0 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-label-sm font-semibold bg-primary text-on-primary tracking-wider uppercase">
              System Administration
            </span>
            <span className="text-label-sm font-label-sm text-secondary">Cluster Health & Governance Node</span>
          </div>
          <h1 className="text-headline-sm font-headline-sm text-primary font-semibold">ApexCare Infrastructure & SOA Operations Console</h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#EBF7EE] text-[#1E7B45] border border-[#C6EBD0] text-label-sm font-label-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#1E7B45] animate-pulse"></span>
            All Microservices Healthy (6/6)
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Architectural Pillars Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface border border-outline-variant rounded p-5 shadow-sm">
            <div className="flex items-center gap-2 text-primary font-semibold text-headline-sm mb-2">
              <span className="material-symbols-outlined text-[20px]">hub</span>
              <h3>SOA Governance</h3>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              Centralized API Gateway with Spring Cloud LoadBalancer routing. Eureka service registry maintains continuous heartbeat health checks.
            </p>
            <div className="mt-3 pt-3 border-t border-outline-variant text-label-sm font-label-sm text-secondary flex justify-between">
              <span>Discovery Endpoint:</span>
              <span className="font-tabular-data font-semibold text-primary">:8761/eureka</span>
            </div>
          </div>

          <div className="bg-surface border border-outline-variant rounded p-5 shadow-sm">
            <div className="flex items-center gap-2 text-primary font-semibold text-headline-sm mb-2">
              <span className="material-symbols-outlined text-[20px]">swap_calls</span>
              <h3>REST vs SOAP Contracts</h3>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              High-throughput JSON REST interfaces paired with a dedicated Spring-WS SOAP XML contract on Patient Service for legacy EHR verification.
            </p>
            <div className="mt-3 pt-3 border-t border-outline-variant text-label-sm font-label-sm text-secondary flex justify-between">
              <span>SOAP Contract:</span>
              <span className="font-tabular-data font-semibold text-primary">/ws/patients.wsdl</span>
            </div>
          </div>

          <div className="bg-surface border border-outline-variant rounded p-5 shadow-sm">
            <div className="flex items-center gap-2 text-primary font-semibold text-headline-sm mb-2">
              <span className="material-symbols-outlined text-[20px]">security</span>
              <h3>Identity Governance & RBAC</h3>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              Stateless HMAC-SHA256 JWT tokens. Granular resource-level authorization prevents Insecure Direct Object References (IDOR).
            </p>
            <div className="mt-3 pt-3 border-t border-outline-variant text-label-sm font-label-sm text-secondary flex justify-between">
              <span>Token Clearance:</span>
              <span className="font-semibold text-primary">PATIENT | DOCTOR | BILLING | ADMIN</span>
            </div>
          </div>
        </div>

        {/* Microservices Registry Table */}
        <div className="bg-surface border border-outline-variant rounded shadow-sm overflow-hidden">
          <div className="px-6 py-3.5 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
            <div>
              <h2 className="text-headline-sm font-headline-sm text-primary font-semibold">Service Discovery & Cluster Topology</h2>
              <p className="text-label-sm font-label-sm text-secondary">Active nodes registered with Netflix Eureka</p>
            </div>
            <span className="text-label-sm font-label-sm text-outline font-tabular-data">Cluster Renewal: 30s Heartbeat</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low text-on-surface-variant text-label-sm font-label-sm uppercase tracking-wider border-b border-outline-variant">
                <tr>
                  <th className="py-3 px-4 font-semibold">Application Service</th>
                  <th className="py-3 px-4 font-semibold">Dedicated Port</th>
                  <th className="py-3 px-4 font-semibold">Discovery Status</th>
                  <th className="py-3 px-4 font-semibold">Protocol & Standard</th>
                  <th className="py-3 px-4 font-semibold">Service Responsibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-body-sm font-body-sm">
                {services.map((svc) => (
                  <tr key={svc.name} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-4 font-semibold text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-secondary">dns</span>
                      {svc.name}
                    </td>
                    <td className="py-3 px-4 font-tabular-data font-medium text-on-surface">
                      :{svc.port}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-label-sm font-label-sm bg-[#EBF7EE] text-[#1E7B45] border border-[#C6EBD0] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1E7B45]"></span>
                        {svc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">
                      {svc.protocol}
                    </td>
                    <td className="py-3 px-4 text-on-surface">
                      {svc.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Integration Pipelines */}
        <div className="bg-surface border border-outline-variant rounded p-5 shadow-sm">
          <h3 className="text-headline-sm font-headline-sm text-primary font-semibold mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">dynamic_feed</span>
            Event-Driven Choreography & Synchronous Orchestration Pipelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded bg-surface-container-low border border-outline-variant">
              <div className="font-semibold text-primary mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                Kafka Choreography: Appointment Completed &rarr; Billing
              </div>
              <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                When a physician completes an assessment in Consultation Workspace, Appointment Service produces an event to topic <strong className="text-primary font-tabular-data">appointment-completed</strong>. Billing Service asynchronously consumes this event to generate an invoice.
              </p>
            </div>

            <div className="p-4 rounded bg-surface-container-low border border-outline-variant">
              <div className="font-semibold text-primary mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Synchronous Orchestration: Checkout Coordinator
              </div>
              <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                Coordinated workflow executing atomic multi-service transactions: confirms appointment state in Appointment Service, commits clinical notes to Patient Service, and initiates claim creation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
