# ApexCare — Clinical Operations & Healthcare Platform

ApexCare is an enterprise-grade clinical operations and patient consultation platform engineered to streamline hospital workflows across healthcare networks. The system unifies electronic health record (EHR) administration, intelligent physician scheduling, synchronized clinical consultation checkouts, and automated revenue cycle billing into a resilient microservices architecture.

---

## Architectural Overview

ApexCare follows a decentralized Service-Oriented Architecture (SOA) with independent microservices communicating through synchronous REST and SOAP contracts as well as asynchronous Apache Kafka event streams.

```
                               ┌───────────────────────────────────────────────────────────┐
                               │                React Clinical Portal (Port 5173)          │
                               │                (Tailwind Clinical Tokens & Web Components) │
                               └─────────────────────────────┬─────────────────────────────┘
                                                             │ HTTP / REST / JWT Bearer
                                                             ▼
                               ┌───────────────────────────────────────────────────────────┐
                               │             Spring Cloud API Gateway (Port 8080)          │
                               │        - Dynamic Routing (lb://) - CORS - JWT Filter      │
                               └───────┬──────────────┬──────────────┬──────────────┬──────┘
                                       │              │              │              │
                                       ▼              ▼              ▼              ▼
 ┌──────────────────────┐ ┌────────────┴──┐ ┌─────────┴──┐ ┌────────┴───┐ ┌────────┴───┐
 │ Eureka Server (8761) │ │  Auth Service │ │Patient Svc │ │Appointment │ │Billing Svc  │
 │ Service Discovery    │ │  (Port 8081)  │ │(Port 8082) │ │(Port 8083) │ │(Port 8084)  │
 │ Continuous Heartbeat │ │- JWT & BCrypt │ │- REST APIs │ │- 409 Engine│ │- 5% Tax Calc│
 │ Health & Registry    │ │- RBAC Engine  │ │- SOAP WSDL │ │- Kafka Pub │ │- Kafka Sub  │
 └──────────────────────┘ └───────────────┘ └────────────┘ └──────┬─────┘ └──────┬──────┘
                                                                  │              │
                                                       Topic: appointment-completed
                                                                  │              │
                                                                  └──────►───────┘
```

---

## Platform Capabilities

### 1. Electronic Health Records & Clinical Timeline
- **Patient Onboarding**: Self-service and staff-assisted patient onboarding (`POST /api/patients`) with blood type, demographic, and allergy tracking.
- **Dual Contract Interoperability**:
  - High-performance JSON REST endpoints for real-time frontend and inter-service consumption.
  - Enterprise Spring-WS SOAP XML contract with published WSDL (`/ws/patients.wsdl`) supporting `getPatientStatusRequest` / `getPatientStatusResponse` for legacy hospital systems.

### 2. Intelligent Scheduling & Collision Prevention
- **Deterministic Conflict Guard**: Authoritative 409 Conflict Engine prevents double-booking and slot overlaps across physicians and clinical suites.
- **Real-Time Availability**: Dynamic query of specialist rosters, consultation fees, and available time slots.

### 3. Physician Consultation Station & Care Orchestration
- **Clinical Telemetry & Note Ingestion**: Real-time vitals monitoring, diagnostic logging, and prescription recording.
- **Synchronous Care Pipeline**: Single-click consultation checkout (`POST /api/appointments/orchestrated-checkout`) atomically updates the appointment status, persists diagnosis notes to the patient's EHR, and generates billing records in a unified transaction.

### 4. Automated Revenue Cycle Management
- **Event-Driven Choreography**: Appointment completion triggers asynchronous Kafka messages to `appointment-completed`, enabling autonomous claim processing.
- **Automated Tax Assessment**: Real-time computation of itemized charges and 5% facility taxes with instant payment settlement.

### 5. Zero-Trust Security & Identity Governance
- **Stateless Bearer Tokens**: HMAC-SHA256 JWT tokens with BCrypt encrypted credential storage.
- **Object-Level Authorization (IDOR Protection)**: Strict identity-bound queries ensuring patients can only inspect their own records and invoices (`403 Forbidden` on unauthorized cross-tenant requests).
- **Role-Based Access Control (RBAC)**: Fine-grained clearances across `PATIENT`, `DOCTOR`, `BILLING_STAFF`, and `ADMIN`.

---

## Services Topology

| Service | Port | Technology Stack | Core Domain Responsibility |
|---|---|---|---|
| **eureka-server** | 8761 | Spring Cloud Netflix Eureka | Dynamic service registry, health heartbeats, and cluster discovery |
| **api-gateway** | 8080 | Spring Cloud Gateway, Reactive WebFlux | Reverse proxy, dynamic load balancing (`lb://`), CORS protection, and JWT verification |
| **auth-service** | 8081 | Spring Security 6, JJWT, BCrypt | User authentication, credential hashing, and signed token issuance |
| **patient-service** | 8082 | Spring Boot Web, Spring-WS, JPA, H2 | Patient records, clinical timelines, IDOR checks, and SOAP WSDL contract |
| **appointment-service** | 8083 | Spring Boot Web, Spring Kafka, JPA | Appointment scheduling, 409 conflict engine, Kafka producer, and checkout orchestrator |
| **billing-service** | 8084 | Spring Boot Web, Spring Kafka, JPA | Invoicing engine, 5% facility tax calculation, Kafka consumer, and payment processing |

---

## Quickstart & Operational Guide

### 1. Launch Backend Services Locally
```bash
# Start all 6 microservices in the background
./scripts/start-backend.sh

# Run end-to-end integration and verification flow
./scripts/demo-full-flow.sh

# Stop all backend services when finished
./scripts/stop-backend.sh
```

### 2. Launch Frontend Application
```bash
cd frontend
npm install
npm run dev
# Application will be accessible at http://localhost:5173
```

### 3. Containerized Deployment (Docker Stack)
```bash
# Builds and deploys Eureka, Gateway, Microservices, Kafka, Zookeeper, and Frontend
docker compose up --build -d
```

### 4. Automated Test Suite
```bash
# Execute full backend automated test suite across all 6 services
mvn -f backend/pom.xml clean test

# Execute frontend verification build
cd frontend && npm run build
```

---

## Default Access Clearances

| Role | Identity Key | Default Password | Workspace Route | Access Scope |
|---|---|---|---|---|
| **Patient** | `PT-894120` | `password123` | `/patient` | Personal vitals, doctor booking, medical history, itemized billing |
| **Doctor** | `dr.julian.vance@metrogeneral.org` | `password123` | `/doctor` | Physician queue, clinical assessment workspace, EHR notes |
| **Billing Staff** | `revcycle.jvance@apexcare.org` | `password123` | `/billing-admin` | Hospital claims ledger, facility tax audit, payment settlement |
| **Administrator** | `sec.admin@apexcare.net` | `password123` | `/admin` | Cluster topology, Eureka service registry, identity governance |
