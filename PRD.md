# ApexCare - Product Requirements Document (PRD)

This document is managed by the Get Shit Done (GSD) planning layer and executed by the Ralph Loop agent. It acts as the task specification and source of truth for the current implementation phase.

## System Architecture Overview
ApexCare is an enterprise healthcare operations and patient consultation platform built on a Spring Boot microservices architecture with a React (Vite) frontend.

### Microservices (inside `backend/`)
1. **frontend**: The React user interface built with Tailwind CSS. (Located at project root)
2. **api-gateway**: The unified entry point for all frontend requests.
3. **auth-service**: Manages JWT authentication and role-based access control (Patient, Doctor, Billing Staff, Admin).
4. **patient-service**: Manages patient records and demographics.
5. **appointment-service**: Handles scheduling and 409 Conflict logic.
6. **billing-service**: Generates and manages invoices and payment processing.
7. **eureka-server**: Service discovery registry.

## Current Implementation Phase
*(To be populated by GSD planning layer)*
