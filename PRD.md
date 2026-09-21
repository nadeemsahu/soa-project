# ApexCare - Product Requirements Document (PRD)

This document is managed by the Get Shit Done (GSD) planning layer and executed by the Ralph Loop agent. It acts as the task specification and source of truth for the current implementation phase.

## System Architecture Overview
ApexCare is an enterprise healthcare operations and patient consultation platform built on a Spring Boot microservices architecture with a React (Vite) frontend matching the Stitch Design System.

### Microservices (inside `backend/`)
1. **frontend**: The React user interface built with Tailwind CSS. (Located at `frontend/`)
2. **api-gateway**: The unified entry point for all frontend requests (Port `8080`), with Spring Cloud LoadBalancer (`lb://`) and global JWT authentication.
3. **auth-service**: Manages JWT authentication and role-based access control (`ROLE_PATIENT`, `ROLE_DOCTOR`, `ROLE_BILLING_STAFF`, `ROLE_ADMIN`) with BCrypt hashing (Port `8081`).
4. **patient-service**: Manages patient records, demographics, IDOR protection, and a legacy Spring-WS SOAP WSDL endpoint (`/ws/patients.wsdl`) (Port `8082`).
5. **appointment-service**: Handles doctor appointments with authoritative 409 Conflict schedule conflict engine, Kafka event publishing on topic `appointment-completed`, and synchronous orchestration (Port `8083`).
6. **billing-service**: Generates and manages invoices, 5% facility tax calculation, Kafka event choreography consumer, and payment status processing (Port `8084`).
7. **eureka-server**: Service discovery registry (Port `8761`).

## Completed Implementation Phase: Master Alignment & Verification
- **PS026**: All 6 microservices built, integrated, tested, and containerized.
- **CO-1**: SOA governance, REST vs SOAP contracts, synchronous consultation orchestration, and asynchronous Kafka choreography.
- **CO-2**: JWT tokens, RBAC clearance, IDOR protection, CORS configuration, and security testing.
- **Frontend / Stitch**: Full visual fidelity, bug-free routing, dedicated dashboards for all 4 roles.
- **Automated Testing**: 27 unit and integration tests passing with 0 failures across the entire multi-module reactor.
- **Live Browser QA**: Verified on real browser subagent session with recorded artifacts.
