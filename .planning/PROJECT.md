# ApexCare

## Objective
Enterprise healthcare operations and patient consultation platform built on a Spring Boot microservices architecture with a React (Vite) frontend.

## Architecture
- **frontend/**: React UI with Tailwind CSS Stitch design.
- **backend/**: Contains all Spring Boot microservices.
  - **auth-service/**: JWT authentication, RBAC.
  - **patient-service/**: Patient records and demographics.
  - **appointment-service/**: Scheduling and conflict handling.
  - **billing-service/**: Invoices and payment processing.
  - **api-gateway/**: Unified entry point.
  - **eureka-server/**: Service discovery.

## Workflow Integration
- **Planning Layer**: Get Shit Done (GSD) via `.planning/` artifacts. Uses Laya MCP for structural and architectural decision making.
- **Execution Layer**: Ralph Loop via `PRD.md`, `progress.txt`, and `prompt.md`.
- **Review & QA**: Alibaba OpenCodeReview (`ocr` CLI) acting as a quality gate, supplemented by Ponytail rules to prevent over-engineering.
