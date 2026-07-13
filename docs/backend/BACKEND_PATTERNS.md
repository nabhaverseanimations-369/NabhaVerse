# Backend Patterns

This document defines behavior-preserving backend patterns used across NabhaVerse services. It is intended as a reference before introducing new bounded contexts.

## Repository Pattern

- Keep repositories in `apps/api/src/nabhaverse_api/infrastructure/database/repositories.py`.
- Build reusable persistence helpers in `base_repository.py` and keep domain-specific queries in concrete repositories.
- Repositories may compose:
  - CRUD helpers (`add_and_flush`, `count_by`, `paginate`)
  - soft-delete helpers (`soft_delete`, `touch`)
- Repositories do not enforce business rules. They only fetch, persist, and shape DB interactions.
- Repository methods return ORM models used by application/domain layers.

## Domain Service Pattern

- Put pure domain behavior in `apps/api/src/nabhaverse_api/domain/<context>/services.py`.
- Domain services:
  - normalize inputs
  - validate allowed values
  - produce deterministic outputs (for example slug candidates)
- Domain services should avoid direct DB access and HTTP concerns.
- Shared cross-context domain helpers live under `apps/api/src/nabhaverse_api/domain/shared/`.

## Application Service Pattern

- Put orchestration in `apps/api/src/nabhaverse_api/application/services/`.
- Application services:
  - enforce access checks and ownership checks
  - coordinate repositories and domain services
  - map persistence models into DTOs
  - define transaction boundaries (`commit`/`rollback`)
- Shared application-level utilities (pagination, common HTTP errors, access context) live in `application/services/foundation.py`.
- Keep external behavior stable: same HTTP codes, same error details, same DTO contracts.

## API Pattern

- Keep FastAPI routers in `apps/api/src/nabhaverse_api/presentation/api/v1/`.
- Routers should stay thin:
  - parse request parameters
  - resolve dependencies
  - delegate to application services
- Reuse dependency aliases from `presentation/api/dependencies.py`.
- Reuse common OpenAPI error response metadata from `presentation/api/foundation.py`.
- Do not leak ORM models from API handlers. Return DTO response models only.

## Migration Pattern

- Keep Alembic migrations under `apps/api/migrations/versions/`.
- Apply migrations through `apps/api/alembic.ini`.
- Treat migrations as infrastructure-only units:
  - one directional schema change per migration
  - clear upgrade/downgrade logic
  - no embedded business logic
- For refactor-only work, do not create or modify migrations unless schema changes are intentional and approved.

## Testing Pattern

- Keep API and service tests under `apps/api/tests/`.
- Extract repeated test setup into helper modules such as `apps/api/tests/helpers.py`.
- Test layers:
  - API behavior (status codes, payload contracts)
  - service orchestration and RBAC
  - repository query behavior
  - migration upgrade safety
- Preserve behavioral assertions when refactoring internals: tests should continue validating externally visible contracts.
