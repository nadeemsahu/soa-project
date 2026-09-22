# ApexCare — Clinical Operations & Healthcare Platform

ApexCare is an enterprise-grade, distributed clinical operations and patient consultation platform engineered to modernize healthcare delivery across hospital networks. The platform unifies electronic health record (EHR) administration, intelligent physician scheduling, synchronized clinical consultation checkouts, and automated revenue cycle billing into a resilient, decentralized microservices architecture.

---

## 1. Problem Analysis & Requirement Specification

### 1.1 Clinical Problem Analysis
Modern healthcare systems face critical operational bottlenecks arising from fragmented legacy software architectures:
1. **Clinical Data Silos & Fragmented Patient Records**: Patient demographics, diagnostic notes, and vital history are frequently isolated across heterogeneous vendor applications, leading to redundant intake procedures and delayed emergency triage.
2. **Scheduling Collisions & Physician Burnout**: Outpatient scheduling systems lacking transactional conflict locking permit concurrent double-booking of specialist physicians, producing clinic overruns, patient frustration, and clinician fatigue.
3. **Delayed Revenue Cycle & Manual Billing Errors**: Post-consultation billing is typically detached from clinical workflows. Manual entry of ICD/CPT codes and delayed tax/facility surcharge calculations result in lost revenue, compliance audit penalties, and billing disputes.
4. **Data Privacy & Identity Insecurity**: Healthcare records are prime targets for Insecure Direct Object Reference (IDOR) exploits and credential theft. Storing medical data behind weak perimeter firewalls without fine-grained object-level authorization violates HIPAA Title II and GDPR standards.

### 1.2 Comprehensive Requirement Specifications

#### Functional Requirements (FR)
- **FR-1: Patient Intake & Electronic Health Record Management**
  - Self-service and receptionist patient onboarding (`POST /api/patients`).
  - Immutable historical record tracking: demographics, ABO/Rh blood groups, critical drug allergies, and timestamped diagnostic encounter notes.
  - Dual-protocol contract support: High-throughput JSON REST interfaces alongside a standard Spring-WS SOAP XML contract (`/ws/patients.wsdl`) to maintain interoperability with legacy hospital EHR mainframes.
- **FR-2: Collision-Free Specialist Scheduling**
  - Real-time catalog of available physician specialties, fees, and consultation time slots (`GET /api/appointments`).
  - Authoritative 409 Conflict Engine: Immediate rejection of double-booking attempts for the same doctor, date, and time with HTTP `409 Conflict`.
- **FR-3: Clinical Consultation Station & Care Orchestration**
  - Real-time physiological telemetry readout (Heart rate, blood pressure, SpO2, core temperature).
  - Synchronous care checkout pipeline (`POST /api/appointments/orchestrated-checkout`): Concurrently completes the appointment, persists diagnostic assessment notes to the patient's EHR record, and triggers billing claim creation within an atomic coordination flow.
- **FR-4: Automated Revenue Cycle & Invoicing**
  - Event-driven claim generation triggered asynchronously upon consultation completion via Apache Kafka (`appointment-completed` topic).
  - Automated 5% facility and clinical tax computation based on service tier fees.
  - Itemized claim ledger supporting instant digital payment settlement and receipt generation (`POST /api/billing/{id}/pay`).
- **FR-5: Centralized Service Registry & Node Discovery**
  - Dynamic discovery of all microservice nodes with continuous 30-second heartbeat renewal, zero hardcoded downstream network IP addresses, and automated eviction of degraded nodes.
- **FR-6: Unified Edge Routing & Cross-Origin Security**
  - Reverse proxy edge gateway handling all inbound browser traffic, terminating SSL, enforcing strict CORS origin policies, and dispatching client-side load-balanced calls (`lb://`).

#### Non-Functional Requirements (NFR)
- **NFR-1: Zero-Trust Security & Identity Governance**: Stateless HMAC-SHA256 JWT tokens with 10-round salted BCrypt password hashing. Enforce strict object-level authorization (IDOR protection) ensuring patients cannot access medical records or invoices belonging to other patient IDs (HTTP `403 Forbidden`).
- **NFR-2: High Availability & Resiliency**: Dynamic service discovery via Netflix Eureka ensuring continuous uptime during node maintenance or scaling.
- **NFR-3: Reactive High-Throughput Gateway**: Non-blocking asynchronous I/O utilizing Spring Cloud Gateway and Netty, delivering low-latency routing under high clinical concurrency.
- **NFR-4: Interoperability Standards**: Compliance with REST architectural style for web clients and SOAP 1.1/1.2 XML with published WSDL for enterprise healthcare integrations.
- **NFR-5: Data Isolation & Modular Autonomy**: Domain-Driven Design (DDD) with bounded contexts. Each microservice manages its dedicated database schema, preventing shared database coupling.

---

## 2. Microservice Identification & Service Discovery

### 2.1 Domain-Driven Decomposition
ApexCare strictly avoids monolithic coupling by partitioning business domains into six autonomous microservices:

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

### 2.2 Microservices Inventory & Responsibilities

| Service Name | Port | Architecture & Tech Stack | Bounded Context Responsibility |
|---|---|---|---|
| **eureka-server** | 8761 | Spring Cloud Netflix Eureka Server | Centralized service registry, node heartbeat health monitoring, instance discovery |
| **api-gateway** | 8080 | Spring Cloud Gateway, Reactive WebFlux | Unified entry point, client load balancing (`lb://`), CORS security, global JWT validation |
| **auth-service** | 8081 | Spring Security 6, JJWT, BCrypt | Identity provider, credential hashing, HMAC-SHA256 token issuance and validation |
| **patient-service** | 8082 | Spring Boot Web, Spring-WS, JPA, H2 | Patient EHR, demographics, IDOR enforcement, SOAP WSDL contract (`/ws/patients.wsdl`) |
| **appointment-service** | 8083 | Spring Boot Web, Spring Kafka, JPA | Scheduling engine, 409 collision prevention, Kafka event producer, checkout orchestrator |
| **billing-service** | 8084 | Spring Boot Web, Spring Kafka, JPA | Revenue cycle engine, automated 5% facility tax calculation, Kafka consumer, payment ledger |

### 2.3 Dynamic Service Discovery Mechanics
- **Registry Heartbeat**: Every microservice registers upon startup with Eureka using `eureka.client.service-url.defaultZone=http://localhost:8761/eureka/` and `prefer-ip-address: true`.
- **Dynamic Load Balancing**: API Gateway resolves target microservices using logical names (e.g., `lb://PATIENT-SERVICE`, `lb://APPOINTMENT-SERVICE`), allowing transparent horizontal scaling without changing route configurations.
- **Health Verification**: Microservices report active health probes periodically. Degraded nodes are automatically culled from active routing tables.

---

## 3. JWT Authentication & Security Architecture

### 3.1 Cryptographic Token Specifications
ApexCare implements a stateless, cryptographically secure authentication model:
- **Algorithm**: HMAC-SHA256 (256-bit symmetric secret key: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`).
- **Credential Storage**: Passwords hashed using Spring Security `BCryptPasswordEncoder` (10 rounds of salt generation); plaintext credentials are never stored or logged.
- **Token Claims Schema**:
  ```json
  {
    "sub": "PT-894120",
    "userId": "u1",
    "username": "PT-894120",
    "role": "ROLE_PATIENT",
    "name": "Eleanor Vance",
    "iat": 1758500000,
    "exp": 1758586400
  }
  ```

### 3.2 Edge Validation & Context Propagation
1. **Pre-flight Edge Filter**: Every incoming request through API Gateway is evaluated by `JwtAuthenticationFilter` (executing at `order = -100`).
2. **Signature & Expiration Verification**: The gateway cryptographically verifies the token's HMAC signature and expiration date before any request is forwarded downstream. Missing or tampered tokens receive HTTP `401 Unauthorized`.
3. **Downstream Header Injection**: Upon successful validation, the gateway extracts user metadata and mutates the internal request headers:
   - `X-User-Id`: Patient or Staff unique identifier
   - `X-User-Role`: Assigned authorization role
   - `X-User-Name`: Authenticated user display name
4. **Insecure Direct Object Reference (IDOR) Mitigation**: Downstream services (Patient Service, Billing Service) inspect the authenticated user context. If a user with `ROLE_PATIENT` attempts to access another patient's medical records or invoices (e.g., user `u1` requesting `/api/patients/u2/records`), the service immediately terminates the request with HTTP `403 Forbidden`.

### 3.3 Role-Based Access Control (RBAC) Matrix

| Role Scope | Clearance Level | Accessible Routes & Workspaces | Operations Permitted |
|---|---|---|---|
| **`ROLE_PATIENT`** | Tier 1 (Self-Service) | `/patient`, `/appointments`, `/doctors`, `/records`, `/bills` | View own EHR records, book consultations, view own invoices, execute bill payment |
| **`ROLE_DOCTOR`** | Tier 2 (Clinical Care) | `/doctor`, `/doctor/consultation/:id` | View outpatient queue, document diagnostic notes, conduct coordinated checkout |
| **`ROLE_BILLING_STAFF`** | Tier 2 (Financial Ops) | `/billing-admin` | View hospital-wide claim ledger, audit 5% facility tax assessments, inspect revenues |
| **`ROLE_ADMIN`** | Tier 3 (Infrastructure) | `/admin` | Inspect Eureka cluster health, monitor routing topology, review identity governance |

---

## 4. API Gateway Configuration & Optimization

### 4.1 Reactive Non-Blocking Architecture
The API Gateway is built on **Spring Cloud Gateway** and **Project Reactor (Netty)**, providing non-blocking asynchronous request processing that eliminates thread-per-request overhead.

### 4.2 Route Definitions & Service Dispatching
The gateway routes requests dynamically using the Eureka service discovery registry:

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: auth-service-route
          uri: lb://AUTH-SERVICE
          predicates:
            - Path=/api/auth/**

        - id: patient-service-route
          uri: lb://PATIENT-SERVICE
          predicates:
            - Path=/api/patients/**, /ws/**

        - id: appointment-service-route
          uri: lb://APPOINTMENT-SERVICE
          predicates:
            - Path=/api/appointments/**

        - id: billing-service-route
          uri: lb://BILLING-SERVICE
          predicates:
            - Path=/api/billing/**
```

### 4.3 Global CORS & Security Policy
Browser client access is governed by strict Cross-Origin Resource Sharing (CORS) rules:
- **Whitelisted Origins**: `http://localhost:5173`, `http://127.0.0.1:5173`
- **Permitted Methods**: `GET, POST, PUT, DELETE, OPTIONS, PATCH`
- **Allowed Headers**: `*` (including `Authorization`, `Content-Type`)
- **Credentials Allowed**: `true`

### 4.4 Endpoint Whitelisting & Filter Order
- **Public Whitelist**: `/api/auth/**`, `/ws/**`, `/actuator/**` are exempted from token enforcement to allow registration, authentication, and SOAP contract inspection.
- **Filter Precedence**: Configured with `Ordered.HIGHEST_PRECEDENCE (-100)` ensuring authentication and header injection occur prior to routing and downstream dispatch.

---

## 5. Quickstart & Operational Verification

### 5.1 Local Startup via Scripts
```bash
# 1. Start all 6 backend microservices in background
./scripts/start-backend.sh

# 2. Execute end-to-end integration and verification suite
./scripts/demo-full-flow.sh

# 3. Stop backend microservices
./scripts/stop-backend.sh
```

### 5.2 Launch Frontend Portal
```bash
cd frontend
npm install
npm run dev
# Portal accessible at http://localhost:5173
```

### 5.3 Containerized Stack (Docker Compose)
```bash
# Deploys Eureka, Gateway, Auth, Patient, Appointment, Billing, Kafka, Zookeeper, and Frontend
docker compose up --build -d
```

### 5.4 Automated Test Suite
```bash
# Run full Maven reactor test suite across all 6 backend modules (28 tests)
mvn -f backend/pom.xml clean test

# Run frontend production build validation
cd frontend && npm run build
```

---

## 6. Provisioned Access Credentials

| Persona | Identity Key | Default Password | Clearance Route | Access Scope |
|---|---|---|---|---|
| **Patient** | `PT-894120` | `password123` | `/patient` | EHR Records, Appointments, Invoices |
| **Attending Physician** | `dr.julian.vance@metrogeneral.org` | `password123` | `/doctor` | Consultation Queue, Clinical Notes |
| **Revenue Officer** | `revcycle.jvance@apexcare.org` | `password123` | `/billing-admin` | Claims Ledger, Tax Computation |
| **System Administrator** | `sec.admin@apexcare.net` | `password123` | `/admin` | Cluster Registry, Gateway Routing |
