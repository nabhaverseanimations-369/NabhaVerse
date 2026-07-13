# NabhaVerse Architecture Constitution

Version: 1.0
Status: Authoritative reference
Last Updated: 2026-07-13
Architecture Owner: Chief Architect
Scope: Entire monorepo
Intent: Document existing architecture and governance only

## 1. Purpose

This constitution defines the non-negotiable architectural constraints already established in NabhaVerse. It does not introduce new design decisions. It consolidates and cross-references the approved architecture corpus.

Primary architecture sources:

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/architecture/SYSTEM_ARCHITECTURE.md](docs/architecture/SYSTEM_ARCHITECTURE.md)
- [docs/architecture/BACKEND_ARCHITECTURE.md](docs/architecture/BACKEND_ARCHITECTURE.md)
- [docs/architecture/FRONTEND_ARCHITECTURE.md](docs/architecture/FRONTEND_ARCHITECTURE.md)
- [docs/architecture/SECURITY_ARCHITECTURE.md](docs/architecture/SECURITY_ARCHITECTURE.md)
- [docs/architecture/AI_ARCHITECTURE.md](docs/architecture/AI_ARCHITECTURE.md)
- [docs/architecture/STUDIO_SDK.md](docs/architecture/STUDIO_SDK.md)
- [docs/architecture/database.md](docs/architecture/database.md)
- [docs/backend/BACKEND_PATTERNS.md](docs/backend/BACKEND_PATTERNS.md)
- [.github/copilot-instructions.md](.github/copilot-instructions.md)

## 2. Source of Truth Hierarchy

When documents conflict, resolve in this order:

1. Code-level enforced boundaries and CI rules in the repository.
2. [.github/copilot-instructions.md](.github/copilot-instructions.md) for project operating constraints.
3. Architecture documents under [docs/architecture](docs/architecture).
4. Repository-wide architecture and standards in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md), and [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).
5. Domain and implementation review documents under [docs/backend](docs/backend).

## 3. System Boundaries and Monorepo Structure

Established boundaries:

- Frontend application: [apps/web](apps/web)
- Backend API application: [apps/api](apps/api)
- Background workers: [apps/workers](apps/workers)
- Shared packages: [packages](packages)
- Architecture and process documentation: [docs](docs)

Reference structure:

- [docs/FOLDER_STRUCTURE.md](docs/FOLDER_STRUCTURE.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## 4. Layering and Dependency Direction (Mandatory)

All backend bounded contexts follow clean layering:

- domain
- application
- infrastructure
- presentation

Allowed dependency direction is inward only.

Current backend implementation follows this under:

- [apps/api/src/nabhaverse_api](apps/api/src/nabhaverse_api)

Normative references:

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/architecture/BACKEND_ARCHITECTURE.md](docs/architecture/BACKEND_ARCHITECTURE.md)
- [docs/backend/BACKEND_PATTERNS.md](docs/backend/BACKEND_PATTERNS.md)

## 5. Domain-Driven Organization

Bounded contexts are the organizing principle for both backend and frontend feature areas.

Backend contexts currently present include auth, studios, characters, and world.
Frontend feature slices include character, world, episode, asset, studio, production, and related collaborative areas under [apps/web/src/features](apps/web/src/features).

Normative references:

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [.github/copilot-instructions.md](.github/copilot-instructions.md)

## 6. Backend Architectural Invariants

### 6.1 Repository Layer

Repositories are persistence-only and reside in:

- [apps/api/src/nabhaverse_api/infrastructure/database/repositories.py](apps/api/src/nabhaverse_api/infrastructure/database/repositories.py)

Shared repository base:

- [apps/api/src/nabhaverse_api/infrastructure/database/base_repository.py](apps/api/src/nabhaverse_api/infrastructure/database/base_repository.py)

Rules:

- No business rules in repositories.
- Query composition, persistence, pagination, and soft-delete utilities are allowed.

### 6.2 Domain Service Layer

Domain rules live in context services under:

- [apps/api/src/nabhaverse_api/domain](apps/api/src/nabhaverse_api/domain)

Shared domain helpers:

- [apps/api/src/nabhaverse_api/domain/shared](apps/api/src/nabhaverse_api/domain/shared)

### 6.3 Application Service Layer

Application services orchestrate:

- RBAC and access checks
- transactional boundaries
- repository/domain composition
- DTO mapping

Current shared app service foundations:

- [apps/api/src/nabhaverse_api/application/services/foundation.py](apps/api/src/nabhaverse_api/application/services/foundation.py)

### 6.4 API Layer

Thin transport layer in:

- [apps/api/src/nabhaverse_api/presentation/api/v1](apps/api/src/nabhaverse_api/presentation/api/v1)

API router composition:

- [apps/api/src/nabhaverse_api/presentation/api/v1/router.py](apps/api/src/nabhaverse_api/presentation/api/v1/router.py)

### 6.5 Migrations

Migrations are infrastructure artifacts in:

- [apps/api/migrations/versions](apps/api/migrations/versions)

Migration discipline reference:

- [docs/backend/BACKEND_PATTERNS.md](docs/backend/BACKEND_PATTERNS.md)

## 7. Data Architecture and Persistence Principles

Existing database principles:

- PostgreSQL is primary relational database.
- UUID primary keys.
- Soft delete semantics.
- Audit timestamps.
- Multi-tenancy isolation via studio ownership and access control strategy.
- Explicit indexing for foreign keys and filter paths.

References:

- [docs/architecture/database.md](docs/architecture/database.md)
- [docs/sprint-2-database-architecture.md](docs/sprint-2-database-architecture.md)

Current ORM model composition:

- [apps/api/src/nabhaverse_api/infrastructure/database/models.py](apps/api/src/nabhaverse_api/infrastructure/database/models.py)
- [apps/api/src/nabhaverse_api/infrastructure/database/model_mixins.py](apps/api/src/nabhaverse_api/infrastructure/database/model_mixins.py)

## 8. Frontend Architectural Invariants

Frontend uses Next.js App Router + feature-sliced architecture with shared component and provider layers.

Current feature root:

- [apps/web/src/features](apps/web/src/features)

Normative references:

- [docs/architecture/FRONTEND_ARCHITECTURE.md](docs/architecture/FRONTEND_ARCHITECTURE.md)
- [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md)

## 9. Studio SDK Constitutional Rules

Studio SDK is the shared contract layer for studio modules.

SDK root:

- [packages/studio-sdk/src](packages/studio-sdk/src)

Constitutional constraints:

- Contract-first integration.
- Registry-driven plugin lifecycle.
- Cross-studio communication through SDK contracts, not ad hoc coupling.

Reference:

- [docs/architecture/STUDIO_SDK.md](docs/architecture/STUDIO_SDK.md)

## 10. Security Constitutional Rules

Security baseline already defined includes:

- authenticated access boundary
- role-based authorization
- strict input validation
- secrets in environment only
- least privilege principle

References:

- [docs/architecture/SECURITY_ARCHITECTURE.md](docs/architecture/SECURITY_ARCHITECTURE.md)
- [.github/copilot-instructions.md](.github/copilot-instructions.md)

## 11. Testing and Quality Gates (Mandatory)

Repository-level acceptance gates are:

- ruff check
- black --check
- mypy
- pytest
- alembic upgrade validation
- pnpm validate

Normative references:

- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
- [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md)

Primary test roots:

- [apps/api/tests](apps/api/tests)
- [apps/workers/tests](apps/workers/tests)
- [apps/web/src](apps/web/src) (Vitest/Storybook-related tests)

## 12. AI Architecture Constitutional Rules

AI integrations are adapter-based and provider-agnostic by architecture.

Rules already established:

- Provider abstraction boundary
- Prompt/version management model
- Background job execution
- Cost and observability tracking

References:

- [docs/architecture/AI_ARCHITECTURE.md](docs/architecture/AI_ARCHITECTURE.md)
- [.github/copilot-instructions.md](.github/copilot-instructions.md)

## 13. Workflow and Governance Rules

Git and PR governance is defined by project standards.

References:

- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
- [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md)
- [.github/CODEOWNERS](.github/CODEOWNERS)

## 14. AI Agent and Contributor Behavior Rules

AI and human contributors must follow established project constraints:

- architecture-first and documentation-first
- no shortcuts that violate layering or boundaries
- no secret leakage
- maintainability over speed

Reference:

- [.github/copilot-instructions.md](.github/copilot-instructions.md)

## 15. Amendment Policy

This constitution may be updated only to reflect architecture already accepted in repository code and approved docs. Any normative change to architecture must first appear in the relevant architecture documentation and accepted implementation before being added here.
