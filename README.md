# ApexCare — Healthcare Operations & Patient Consultation Platform

ApexCare is an enterprise-grade Service-Oriented Architecture (SOA) and microservices healthcare platform engineered to streamline physician consultations, patient records, appointment scheduling, and automated revenue cycle billing.

Built strictly in accordance with:
- **PS026**: Healthcare Operations & Microservices Architecture
- **CO-1**: SOA Principles, Service Contracts, Endpoints, Governance, Orchestration vs Choreography, Kafka, REST vs SOAP, Scalability, Clustering, User Stories & Jira Sprint Planning
- **CO-2**: Microservices Security Threats, Spring Security, JWT, RBAC, IDOR Protection, CORS, Security Testing & Task Tracking
- **Stitch Design System**: High-fidelity clinical UI with curated design tokens, responsive layouts, and role-based clearance

---

## Architecture Topology

```
                               ┌───────────────────────────────────────────────────────────┐
                               │                 React Frontend (Vite @ 5173)              │
                               │                (Stitch Design System Tokens)              │
                               └─────────────────────────────┬─────────────────────────────┘
                                                             │ HTTP / REST / JWT
                                                             ▼
                               ┌───────────────────────────────────────────────────────────┐
                               │              Spring Cloud API Gateway (Port 8080)         │
                               │        - Route Mapping (lb://)  - CORS  - JWT Filter      │
                               └───────┬──────────────┬──────────────┬──────────────┬──────┘
                                       │              │              │              │
                                       ▼              ▼              ▼              ▼
 ┌──────────────────────┐ ┌────────────┴──┐ ┌─────────┴──┐ ┌────────┴───┐ ┌────────┴───┐
 │ Eureka Server (8761) │ │  Auth Service │ │Patient Svc │ │Appointment │ │Billing Svc  │
 │ Service Discovery    │ │  (Port 8081)  │ │(Port 8082) │ │(Port 8083) │ │(Port 8084)  │
 │ Continuous Heartbeat │ │- JWT & BCrypt │ │- REST APIs │ │- 409 Engine│ │- 5% Tax Calc│
 │ Discovery & Registry │ │- RBAC Clearance│ │- SOAP WSDL│ │- Kafka Pub │ │- Kafka Sub  │
 └──────────────────────┘ └───────────────┘ └────────────┘ └──────┬─────┘ └──────┬──────┘
                                                                  │              │
                                                       Topic: appointment-completed
                                                                  │              │
                                                                  └──────►───────┘
```

---

## Microservices Breakdown

| Service | Port | Technology | Primary Responsibilities |
|---|---|---|---|
| **eureka-server** | 8761 | Spring Cloud Netflix Eureka | Centralized service registry, peer discovery, and node heartbeats |
| **api-gateway** | 8080 | Spring Cloud Gateway, Reactive WebFlux | Unified entry point, CORS configuration, JWT authentication filter, and load balancing |
| **auth-service** | 8081 | Spring Security 6, JJWT, BCrypt | User authentication, password hashing, HMAC-SHA256 token issuance, and validation |
| **patient-service** | 8082 | Spring Boot Web, Spring-WS, JPA, H2 | Patient records, clinical timelines, IDOR resource protection, and SOAP WSDL contract (`/ws/patients.wsdl`) |
| **appointment-service** | 8083 | Spring Boot Web, Spring Kafka, JPA | Doctor appointments, authoritative 409 conflict detection, Kafka event producer, and synchronous consultation orchestrator |
| **billing-service** | 8084 | Spring Boot Web, Spring Kafka, JPA | Automated claim generation, facility tax calculations, Kafka consumer choreography, and payment status transitions |

---

## Course Syllabus Mapping

### 1. CO-1: Service-Oriented Architecture (SOA)
- **SOA Principles & Contracts**: Clearly separated domain boundaries with defined REST contracts across all microservices.
- **REST vs SOAP Demonstration**: 
  - REST endpoints serve high-throughput JSON across all services.
  - Dedicated Spring-WS SOAP XML contract with WSDL exposed at `http://localhost:8082/ws/patients.wsdl` (`getPatientStatusRequest` / `getPatientStatusResponse`).
- **Synchronous Orchestration**:
  - Implemented in [ConsultationOrchestrator.java](file:///home/nadeem/Desktop/soa-project/backend/appointment-service/src/main/java/com/apexcare/appointment/orchestration/ConsultationOrchestrator.java) (`POST /api/appointments/orchestrated-checkout`), coordinating appointment status, clinical record entry, and invoice creation in a single transaction-like flow.
- **Asynchronous Choreography**:
  - Implemented via Apache Kafka: Appointment Service publishes `AppointmentCompletedEvent` to topic `appointment-completed`, consumed asynchronously by Billing Service to automatically generate invoices.
- **Scalability & Load Balancing**:
  - Eureka server dynamically registers all instances. API Gateway uses Spring Cloud LoadBalancer (`lb://<SERVICE-NAME>`) to distribute incoming traffic.
- **User Stories & Jira Sprint Planning**:
  - User stories defined across Patient (US-01 to US-04), Doctor (US-05 to US-07), Billing Staff (US-08 to US-09), and System Administrator (US-10 to US-11).

### 2. CO-2: Microservices Security
- **Security Threats & Mitigations**:
  - **Insecure Direct Object Reference (IDOR)**: Mitigated in Patient Service and Billing Service. Patients attempting to access records or invoices of another patient ID receive HTTP `403 Forbidden`.
  - **Authentication Bypass**: Protected endpoints require signed Bearer tokens. Invalid or expired tokens receive HTTP `401 Unauthorized`.
  - **Hardcoded Plaintext Passwords**: Mitigated using Spring Security `BCryptPasswordEncoder`.
  - **CORS Misconfiguration**: Gateway restricts access strictly to frontend origins (`http://localhost:5173`).
- **Role-Based Access Control (RBAC)**:
  - `ROLE_PATIENT`: Access to personal dashboard, doctor discovery, booking, personal records, and bills.
  - `ROLE_DOCTOR`: Access to physician queue, consultation workspace, and patient clinical records.
  - `ROLE_BILLING_STAFF`: Access to hospital claims table, revenue analytics, and payment settlement.
  - `ROLE_ADMIN`: Access to cluster topology, Eureka registry status, and security audit log.

---

## Quickstart & Demonstration

### Option 1: One-Click Local Runner
```bash
# 1. Start all 6 backend services in background
./scripts/start-backend.sh

# 2. Run the automated live architecture demo (JWT, IDOR, 409 Conflict, SOAP WSDL)
./scripts/demo-full-flow.sh

# 3. Stop backend services when finished
./scripts/stop-backend.sh
```

### Option 2: Docker Compose (Production Stack)
```bash
# Start Eureka, Gateway, Microservices, Kafka, Zookeeper, and Frontend
docker compose up --build -d
```

### Option 3: Running Automated Tests
```bash
# Execute the full backend test suite (27 automated tests)
cd backend && mvn clean test
```

---

## Credentials for Demonstration

| Role | Username / Identity | Password | Clearance Route |
|---|---|---|---|
| **Patient** | `PT-894120` | `password123` | `/` (Patient Dashboard) |
| **Doctor** | `dr.julian.vance@metrogeneral.org` | `password123` | `/doctor` (Doctor Workspace) |
| **Billing Staff** | `revcycle.jvance@apexcare.org` | `password123` | `/billing-admin` (Billing Control) |
| **Administrator** | `sec.admin@apexcare.net` | `password123` | `/admin` (System Console) |
