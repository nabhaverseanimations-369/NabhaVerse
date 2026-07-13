# AI Agent Guide

Version: 1.0
Status: Authoritative onboarding guide
Last Updated: 2026-07-13
Architecture Owner: Chief Architect
Scope: AI coding agents operating in this repository
Intent: Enforce existing NabhaVerse architecture and delivery rules for AI-assisted implementation

## 1. Required Reading Order

Read in this sequence before writing or changing code:

1. [.github/copilot-instructions.md](../.github/copilot-instructions.md)
2. [ARCHITECTURE_CONSTITUTION.md](ARCHITECTURE_CONSTITUTION.md)
3. [ARCHITECTURE.md](ARCHITECTURE.md)
4. [CODING_STANDARDS.md](CODING_STANDARDS.md)
5. [CONTRIBUTING.md](CONTRIBUTING.md)
6. [architecture/BACKEND_ARCHITECTURE.md](architecture/BACKEND_ARCHITECTURE.md)
7. [architecture/FRONTEND_ARCHITECTURE.md](architecture/FRONTEND_ARCHITECTURE.md)
8. [architecture/SECURITY_ARCHITECTURE.md](architecture/SECURITY_ARCHITECTURE.md)
9. [architecture/STUDIO_SDK.md](architecture/STUDIO_SDK.md)
10. [backend/BACKEND_PATTERNS.md](backend/BACKEND_PATTERNS.md)

## 2. Architecture Rules

Mandatory architecture behavior:

- Respect clean layering: domain, application, infrastructure, presentation.
- Keep dependencies directed inward only.
- Preserve bounded context ownership and avoid ad hoc cross-context coupling.
- Keep architecture and implementation aligned; update documentation in the same change when architecture-relevant behavior changes.

Reference documents:

- [ARCHITECTURE_CONSTITUTION.md](ARCHITECTURE_CONSTITUTION.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [architecture/SYSTEM_ARCHITECTURE.md](architecture/SYSTEM_ARCHITECTURE.md)

## 3. Backend Implementation Rules

Backend root:

- [../apps/api/src/nabhaverse_api](../apps/api/src/nabhaverse_api)

Rules:

- Place persistence logic in repositories only.
- Place pure business logic in domain services.
- Place orchestration, access checks, transaction boundaries, and DTO mapping in application services.
- Keep API routers thin and transport-focused.
- Keep migrations infrastructure-only and behavior-preserving unless an intentional schema change is approved.

References:

- [backend/BACKEND_PATTERNS.md](backend/BACKEND_PATTERNS.md)
- [architecture/BACKEND_ARCHITECTURE.md](architecture/BACKEND_ARCHITECTURE.md)

## 4. Frontend Rules

Frontend root:

- [../apps/web](../apps/web)

Rules:

- Preserve existing frontend contracts unless explicitly approved to change.
- Organize by feature slices under [../apps/web/src/features](../apps/web/src/features).
- Reuse shared UI and package-level contracts instead of duplicating implementation.
- Follow accessibility and responsive standards in project documentation.

References:

- [architecture/FRONTEND_ARCHITECTURE.md](architecture/FRONTEND_ARCHITECTURE.md)
- [CODING_STANDARDS.md](CODING_STANDARDS.md)

## 5. Studio SDK Rules

SDK root:

- [../packages/studio-sdk/src](../packages/studio-sdk/src)

Rules:

- Use contract-first, registry-driven integration for studio plugins.
- Keep cross-studio behavior on SDK contracts and shared shell behavior.
- Avoid direct coupling between studio domains when SDK contracts exist.

Reference:

- [architecture/STUDIO_SDK.md](architecture/STUDIO_SDK.md)

## 6. Testing Requirements

Do not treat implementation as complete without tests and validation.

Required quality workflow follows repository standards and includes:

- linting
- type checks
- tests
- build checks
- migration validation for backend schema changes

References:

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [../.github/PULL_REQUEST_TEMPLATE.md](../.github/PULL_REQUEST_TEMPLATE.md)

## 7. PR Workflow

Use repository PR process and checklist requirements:

- branch naming and conventional commits
- architecture summary in PR
- explicit validation evidence
- architecture checklist completion

References:

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [../.github/PULL_REQUEST_TEMPLATE.md](../.github/PULL_REQUEST_TEMPLATE.md)

## 8. Security Expectations

Always:

- validate boundary inputs
- enforce role and membership checks in service/application boundaries
- keep secrets only in environment variables
- avoid exposing sensitive values in logs, errors, and committed files

References:

- [architecture/SECURITY_ARCHITECTURE.md](architecture/SECURITY_ARCHITECTURE.md)
- [../.github/copilot-instructions.md](../.github/copilot-instructions.md)

## 9. Things AI Agents Must Never Do

AI agents must never:

- introduce new architecture decisions without approved documentation and implementation alignment
- bypass clean architecture boundaries
- redesign frontend contracts when the task requires compatibility
- commit secrets, keys, tokens, or credentials
- bypass required validation and testing workflow
- add quick hacks, placeholder logic, or TODO-based incomplete behavior for merged changes

References:

- [ARCHITECTURE_CONSTITUTION.md](ARCHITECTURE_CONSTITUTION.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [../.github/copilot-instructions.md](../.github/copilot-instructions.md)

## 10. Definition of Done

A change is Done only when all conditions are true:

1. Architecture and boundaries are respected according to [ARCHITECTURE_CONSTITUTION.md](ARCHITECTURE_CONSTITUTION.md).
2. Layer responsibilities are preserved (backend and frontend).
3. Frontend and API contracts remain compatible unless explicitly approved otherwise.
4. Security expectations are met and no sensitive data is exposed.
5. Tests are updated where behavior changes and required validations pass.
6. Relevant documentation is updated in the same change.
7. PR content includes architectural intent, validation evidence, and checklist completion.
