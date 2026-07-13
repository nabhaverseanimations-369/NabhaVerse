# NabhaVerse Engineering Guide

Version: 1.0
Status: Authoritative implementation guide
Last Updated: 2026-07-13
Architecture Owner: Chief Architect
Scope: Daily engineering work across apps and packages
Intent: Operationalize existing architecture and standards without adding new decisions

## 1. How to Use This Guide

Use this guide as a practical map to implement changes that remain compliant with:

- [docs/ARCHITECTURE_CONSTITUTION.md](docs/ARCHITECTURE_CONSTITUTION.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md)
- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
- [.github/copilot-instructions.md](.github/copilot-instructions.md)

When guidance conflicts, follow the hierarchy in [docs/ARCHITECTURE_CONSTITUTION.md](docs/ARCHITECTURE_CONSTITUTION.md).

## 2. Monorepo Working Model

Repository layout and ownership:

- Product applications: [apps](apps)
- Shared packages: [packages](packages)
- Architecture and process docs: [docs](docs)

Primary references:

- [docs/FOLDER_STRUCTURE.md](docs/FOLDER_STRUCTURE.md)
- [README.md](README.md)

## 3. Backend Implementation Playbook

### 3.1 Layer Responsibilities

Backend code lives under [apps/api/src/nabhaverse_api](apps/api/src/nabhaverse_api).

Expected layering:

- domain: business rules and invariants
- application: orchestration, transactions, access checks, DTO mapping
- infrastructure: persistence adapters, auth integrations, external boundaries
- presentation: FastAPI routing, request/response transport

Pattern reference:

- [docs/backend/BACKEND_PATTERNS.md](docs/backend/BACKEND_PATTERNS.md)

### 3.2 Repository Pattern

Implement persistence logic in:

- [apps/api/src/nabhaverse_api/infrastructure/database/repositories.py](apps/api/src/nabhaverse_api/infrastructure/database/repositories.py)
- [apps/api/src/nabhaverse_api/infrastructure/database/base_repository.py](apps/api/src/nabhaverse_api/infrastructure/database/base_repository.py)

Repository expectations:

- no domain/business validation logic
- explicit query predicates and pagination
- soft delete and timestamp utilities through shared base helpers

### 3.3 Domain Services

Implement pure business rules in:

- [apps/api/src/nabhaverse_api/domain](apps/api/src/nabhaverse_api/domain)

Examples of existing domain service style:

- [apps/api/src/nabhaverse_api/domain/characters/services.py](apps/api/src/nabhaverse_api/domain/characters/services.py)
- [apps/api/src/nabhaverse_api/domain/worlds/services.py](apps/api/src/nabhaverse_api/domain/worlds/services.py)

### 3.4 Application Services

Use application services for:

- access/membership/permission checks
- repository coordination
- commit/rollback orchestration
- DTO shaping for API return contracts

Core shared helper:

- [apps/api/src/nabhaverse_api/application/services/foundation.py](apps/api/src/nabhaverse_api/application/services/foundation.py)

### 3.5 API Routers

Keep routers thin in:

- [apps/api/src/nabhaverse_api/presentation/api/v1](apps/api/src/nabhaverse_api/presentation/api/v1)

API composition root:

- [apps/api/src/nabhaverse_api/presentation/api/v1/router.py](apps/api/src/nabhaverse_api/presentation/api/v1/router.py)

### 3.6 Auth and Access Context

Current auth dependency flow and context construction:

- [apps/api/src/nabhaverse_api/presentation/api/dependencies.py](apps/api/src/nabhaverse_api/presentation/api/dependencies.py)
- [apps/api/src/nabhaverse_api/infrastructure/auth/clerk.py](apps/api/src/nabhaverse_api/infrastructure/auth/clerk.py)

## 4. Frontend Implementation Playbook

### 4.1 Architectural Shape

Frontend app root:

- [apps/web](apps/web)

Feature modules root:

- [apps/web/src/features](apps/web/src/features)

Reference:

- [docs/architecture/FRONTEND_ARCHITECTURE.md](docs/architecture/FRONTEND_ARCHITECTURE.md)

### 4.2 Feature Slice Expectations

Within each feature, keep behavior grouped by:

- components
- hooks
- schemas
- types
- API client layer

Use shared UI and utilities from packages instead of duplicating logic.

### 4.3 UI Standards

Use the established design system and accessibility constraints:

- [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md)
- [.github/copilot-instructions.md](.github/copilot-instructions.md)

Key enforced behaviors already documented:

- accessibility first (keyboard, semantic labels, focus)
- responsive-first implementation
- tokenized styling over ad hoc hardcoding

## 5. Studio SDK Usage Guide

SDK root:

- [packages/studio-sdk/src](packages/studio-sdk/src)

SDK architecture reference:

- [docs/architecture/STUDIO_SDK.md](docs/architecture/STUDIO_SDK.md)

Engineering rules:

- define plugin contracts and registries explicitly
- resolve studio routes via shared SDK navigation contracts
- use shared draft/save and sidebar state hooks
- keep cross-studio interactions contract-driven

## 6. Database and Migration Guide

### 6.1 Database Principles

Primary principles (existing):

- PostgreSQL as source of truth
- UUID identifiers
- soft delete semantics
- audit columns
- multi-tenant ownership boundaries

References:

- [docs/architecture/database.md](docs/architecture/database.md)
- [docs/sprint-2-database-architecture.md](docs/sprint-2-database-architecture.md)

### 6.2 ORM and Model Discipline

Current model graph:

- [apps/api/src/nabhaverse_api/infrastructure/database/models.py](apps/api/src/nabhaverse_api/infrastructure/database/models.py)

Shared mixins:

- [apps/api/src/nabhaverse_api/infrastructure/database/model_mixins.py](apps/api/src/nabhaverse_api/infrastructure/database/model_mixins.py)

### 6.3 Alembic Workflow

Migration roots:

- [apps/api/migrations](apps/api/migrations)
- [apps/api/alembic.ini](apps/api/alembic.ini)

Guidance source:

- [docs/backend/BACKEND_PATTERNS.md](docs/backend/BACKEND_PATTERNS.md)

## 7. AI Integration Engineering Guide

AI architecture references:

- [docs/architecture/AI_ARCHITECTURE.md](docs/architecture/AI_ARCHITECTURE.md)
- [.github/copilot-instructions.md](.github/copilot-instructions.md)

Implementation constraints already established:

- adapter/provider boundary for external AI services
- prompt artifacts are versioned, not hardcoded in business logic
- AI operations run asynchronously through workers/queues
- observability and retry paths are required in pipeline design

Related workspace areas:

- [packages/ai](packages/ai)
- [packages/prompts](packages/prompts)
- [apps/workers](apps/workers)

## 8. Security Engineering Guide

Security architecture references:

- [docs/architecture/SECURITY_ARCHITECTURE.md](docs/architecture/SECURITY_ARCHITECTURE.md)
- [.github/copilot-instructions.md](.github/copilot-instructions.md)

Day-to-day engineering expectations:

- validate all incoming input at boundaries
- enforce membership/role checks in service layer
- keep secrets in environment variables only
- avoid leaking sensitive metadata in logs/responses

## 9. Testing Strategy and Quality Gates

### 9.1 Test Locations

Backend tests:

- [apps/api/tests](apps/api/tests)

Worker tests:

- [apps/workers/tests](apps/workers/tests)

Frontend/unit and integration tests live under app-level frontend structure in [apps/web](apps/web).

### 9.2 Required Validation Workflow

Before opening or updating a PR, execute the project quality workflow as defined by repository conventions:

- lint
- type checks
- tests
- build
- migration validation for backend schema changes

Reference sources:

- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
- [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md)

## 10. Pull Request and Review Expectations

PR expectations are defined in:

- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
- [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md)

Review criteria focus on:

- architectural boundary compliance
- behavior and API contract preservation
- migration safety and rollback path
- documentation updates when architecture-relevant behavior changes

## 11. AI-Assisted Contribution Rules

AI-assisted work must follow project handbook constraints:

- no shortcuts that violate clean layering
- no undocumented architecture changes
- no frontend contract redesign unless explicitly approved
- no secrets in code or generated artifacts

Reference:

- [.github/copilot-instructions.md](.github/copilot-instructions.md)

## 12. Documentation Update Protocol

Update docs in the same change whenever architectural boundaries, contracts, or workflows materially change.

Primary locations:

- [docs/architecture](docs/architecture)
- [docs/backend](docs/backend)
- [docs/sprints](docs/sprints)

Treat stale documentation as a defect per project standards.
