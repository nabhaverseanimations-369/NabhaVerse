# Backend Platform Audit - Program A

**Version:** 1.0  
**Status:** Architecture Review Only  
**Last Updated:** 2026-07-13  
**Program:** Program A - Backend Platform

---

## 1. Backend Architecture Audit

### Current Implementation Summary

The current backend is a foundation-only implementation centered on identity bootstrapping, user preferences, studio creation, and role-based membership loading.

Implemented runtime surfaces:

- FastAPI app entrypoint in [apps/api/src/nabhaverse_api/main.py](apps/api/src/nabhaverse_api/main.py)
- API routes in [apps/api/src/nabhaverse_api/presentation/api/v1/router.py](apps/api/src/nabhaverse_api/presentation/api/v1/router.py)
- Service layer in [apps/api/src/nabhaverse_api/application/services](apps/api/src/nabhaverse_api/application/services)
- SQLAlchemy models and repositories in [apps/api/src/nabhaverse_api/infrastructure/database](apps/api/src/nabhaverse_api/infrastructure/database)
- Clerk token verification in [apps/api/src/nabhaverse_api/infrastructure/auth/clerk.py](apps/api/src/nabhaverse_api/infrastructure/auth/clerk.py)
- Celery bootstrap only in [apps/workers/src/nabhaverse_workers/celery_app.py](apps/workers/src/nabhaverse_workers/celery_app.py)

Implemented API endpoints:

- `GET /health`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me/preferences`
- `GET /api/v1/studios`
- `POST /api/v1/studios`

Implemented persistent entities:

- Users
- Studios
- Roles
- Permissions
- Role permissions
- Memberships

Implemented worker behavior:

- Celery application configuration only
- No registered tasks
- No domain event consumers
- No retry policies
- No job orchestration

### Architectural Strengths

- Clean top-level layering is present: `domain`, `application`, `infrastructure`, `presentation`
- Async SQLAlchemy session handling is in place
- Clerk verification abstraction exists behind a dedicated infrastructure service
- Role and permission seed logic is centralized in database initialization
- Pydantic DTOs exist for the implemented identity and studio flows

### Architectural Gaps

- Backend scope is limited to identity and studio bootstrap; no Phase 1 studio domain is implemented
- Runtime `create_all()` is still executed on application startup in [apps/api/src/nabhaverse_api/infrastructure/database/session.py](apps/api/src/nabhaverse_api/infrastructure/database/session.py), which conflicts with migration-first production operation
- The app description in [apps/api/src/nabhaverse_api/main.py](apps/api/src/nabhaverse_api/main.py) still describes only authentication and identity services, not the platform backend
- Worker package contains no application, domain, infrastructure, or presentation logic beyond empty `__init__.py` placeholders
- Event architecture is absent in implementation despite being central to documented target architecture
- Repository layer is concrete and narrow, with no domain-by-domain repository interfaces or bounded context separation
- No pagination, filtering, search, cursoring, or query contracts exist for any future collection endpoints

---

## 2. Gap Analysis

### Domain-by-Domain Review

| Domain        | Existing Implementation                                             | Missing Entities                                                                       | Missing Repositories                                         | Missing Services                                                     | Missing APIs                                                            | Missing Migrations                                       | Missing Tests                                                         |
| ------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------- |
| Identity      | Clerk token verification, user bootstrap, current session hydration | Sessions, audit events, auth providers, API keys, service accounts                     | Session repo, auth audit repo, identity provider repo        | Login/session orchestration, token/session revocation, audit logging | Session management, membership switching, API key APIs, admin auth APIs | Auth/session tables, audit tables, API key tables        | Token validation, failure modes, JWKS cache behavior, auth edge cases |
| Studio        | Studios + memberships + roles + permissions                         | Studio settings, invitations, teams, billing metadata, organization hierarchy          | Invitation repo, team repo, settings repo                    | Invitations, member lifecycle, billing coordination                  | Invitations, membership management, team APIs, settings APIs            | Invitations, teams, billing linkage, settings versioning | Membership lifecycle, role mutation, invite acceptance                |
| Character     | None                                                                | Characters, versions, comments, relationships, tags, approvals                         | Character repo, version repo, relationship repo              | Character CRUD, versioning, publishing, review                       | Character list/detail/search/filter/update/version APIs                 | Character tables and indexes                             | CRUD, search, versioning, permissions                                 |
| World         | None                                                                | Worlds, regions, lore documents, maps, timelines                                       | World repo, region repo, world graph repo                    | World CRUD, hierarchy, relationship management                       | World list/detail/search/filter/update APIs                             | World tables and indexes                                 | CRUD, search, hierarchy                                               |
| Episode       | None                                                                | Episodes, scenes, scripts, storyboards, shots, status history                          | Episode repo, scene repo, script repo                        | Episode planning, scene ordering, script persistence                 | Episode list/detail/search/filter/update APIs                           | Episode, scene, script tables                            | CRUD, ordering, review flows                                          |
| Asset         | None                                                                | Assets, collections, derivatives, tags, versions, storage metadata                     | Asset repo, collection repo, version repo                    | Asset CRUD, metadata updates, attachment lifecycle                   | Asset list/detail/search/filter/update APIs                             | Asset tables, derivative tables, tag junctions           | CRUD, metadata, file lifecycle                                        |
| AI            | None                                                                | Prompt templates, prompt versions, jobs, outputs, provider logs                        | Prompt repo, AI job repo, provider log repo                  | Prompt lifecycle, AI job orchestration, output persistence           | Prompt library, AI jobs, outputs, provider log APIs                     | Prompt, AI job, output tables                            | Prompt CRUD, job lifecycle, retries                                   |
| Production    | None                                                                | Productions, milestones, tasks, dependencies, calendars, reviews                       | Production repo, milestone repo, task repo                   | Planning, task updates, dependency resolution                        | Production list/detail/filter/update APIs                               | Production, task, milestone tables                       | CRUD, dependency logic, scheduling                                    |
| Publishing    | None                                                                | Publications, releases, targets, release notes, export packages                        | Publication repo, release repo, target repo                  | Release orchestration, approvals, scheduling                         | Publishing list/detail/filter/update APIs                               | Publication, release, target tables                      | CRUD, schedule, approval flows                                        |
| Collaboration | None                                                                | Comments, mentions, assignments, discussions, notifications, reviews                   | Comment repo, mention repo, assignment repo, discussion repo | Notification orchestration, assignment lifecycle, review state       | Collaboration list/detail/filter/update APIs                            | Collaboration tables and notification tables             | CRUD, review, filtering                                               |
| Intelligence  | None                                                                | Search indexes, saved searches, insights, recommendations, command usage, recent opens | Saved search repo, insight repo, recommendation repo         | Search aggregation, command analytics, dashboard materialization     | Intelligence dashboard, saved search, recent activity APIs              | Intelligence support tables, usage tables                | Search ranking, aggregation, dashboard APIs                           |

### Overall Gap Statement

The implemented backend covers only the platform bootstrap layer for authentication and studio membership. Every Phase 1 studio domain remains unimplemented at the entity, repository, service, API, migration, and test levels.

---

## 3. Database Review

### Current State

Current SQLAlchemy models are defined in [apps/api/src/nabhaverse_api/infrastructure/database/models.py](apps/api/src/nabhaverse_api/infrastructure/database/models.py). A single Alembic migration exists in [apps/api/migrations/versions/20260708_0001_auth_identity.py](apps/api/migrations/versions/20260708_0001_auth_identity.py).

### Findings Against Platform Standards

#### 3.1 Foreign Keys

Implemented:

- `memberships.user_id -> users.id`
- `memberships.studio_id -> studios.id`
- `memberships.role_id -> roles.id`
- `role_permissions.role_id -> roles.id`
- `role_permissions.permission_id -> permissions.id`

Assessment:

- Existing foreign keys are valid for the current foundation tables
- Domain-specific foreign key coverage does not exist because domain tables do not exist

#### 3.2 Indexes

Implemented:

- `users.clerk_user_id`
- `users.email`
- `studios.slug`
- `memberships.user_id`
- `memberships.studio_id`
- `memberships.role_id`

Assessment:

- Foundation indexing is acceptable for the current narrow scope
- No composite tenant indexes exist beyond membership uniqueness
- No partial indexes for soft-delete filtering exist
- No search-oriented indexes exist

#### 3.3 Constraints

Implemented:

- Unique `users.clerk_user_id`
- Unique `studios.slug`
- Unique `roles.name`
- Unique `permissions.name`
- Unique `(memberships.user_id, memberships.studio_id)`

Assessment:

- Basic uniqueness constraints are present
- Domain-specific check constraints, versioning constraints, and lifecycle constraints are absent

#### 3.4 UUID Usage

Assessment:

- `users`, `studios`, and `memberships` use string UUIDs generated in application code
- `roles` and `permissions` use integer primary keys, which violates the documented platform rule that all tables should use UUID primary keys
- No PostgreSQL-native `gen_random_uuid()` defaults are present

#### 3.5 Soft Delete

Assessment:

- No implemented table currently has `deleted_at`
- This diverges from the documented architecture standard
- Hard deletes are currently enforced via `CASCADE` on relationships

#### 3.6 Versioning

Assessment:

- No entity version tables exist
- No optimistic locking/version columns exist
- No audit snapshots or historical tables exist

#### 3.7 Audit Logging

Assessment:

- `created_at` and `updated_at` are present on some tables
- `created_by` and `updated_by` are absent
- No audit event table exists
- No immutable audit trail exists

#### 3.8 Row-Level Security

Assessment:

- No PostgreSQL RLS is implemented
- No policy management exists
- Current default database uses SQLite in settings and Alembic config, so the documented RLS model is not yet technically possible in the default local configuration

#### 3.9 Multi-Tenancy

Assessment:

- Multi-tenancy is modeled only indirectly through `memberships`
- Tenant ownership columns such as `studio_id` are absent from future domain tables because those tables do not yet exist
- Tenant isolation is enforced in application logic only for the minimal implemented surfaces

### Database Risk Summary

Primary database risks:

1. Runtime still defaults to SQLite via [apps/api/src/nabhaverse_api/infrastructure/config.py](apps/api/src/nabhaverse_api/infrastructure/config.py) and [apps/api/alembic.ini](apps/api/alembic.ini), while architecture requires PostgreSQL-first behavior
2. Current schema violates the documented UUID-only standard because role and permission tables use integers
3. No soft-delete or audit columns means future migration cost will increase as more domains are added
4. No RLS or tenant ownership enforcement exists for future scale and security requirements

### Recommended Improvements

Do not apply in this step; these are roadmap recommendations only.

1. Move all environments to PostgreSQL-first settings and remove SQLite as the default runtime database
2. Eliminate runtime `create_all()` and require Alembic-managed schema bootstrapping
3. Standardize all new and existing tables on UUID primary keys
4. Introduce `deleted_at`, `created_by`, and `updated_by` for tenant-owned entity tables
5. Add `studio_id` to every tenant-owned domain table and prepare RLS policies for PostgreSQL
6. Establish version tables for document-like domains such as Character, World, Episode, and Prompt

---

## 4. API Review

### Existing Endpoint Inventory

| Endpoint                             | Purpose                                | Notes                                                    |
| ------------------------------------ | -------------------------------------- | -------------------------------------------------------- |
| `GET /health`                        | Basic health response                  | No readiness/liveness separation                         |
| `GET /api/v1/auth/me`                | Clerk-backed current session bootstrap | Creates user/studio membership on first access           |
| `POST /api/v1/auth/logout`           | Placeholder sign-out acknowledgement   | No server-side session invalidation                      |
| `GET /api/v1/users/me`               | Current user profile                   | No profile mutation except preferences                   |
| `PATCH /api/v1/users/me/preferences` | Preferences merge                      | No schema granularity for preference sections            |
| `GET /api/v1/studios`                | User memberships list                  | Returns memberships, not studio search/list with filters |
| `POST /api/v1/studios`               | Create studio and owner membership     | No invitations, no slug input, no settings payload       |

### Missing APIs vs Frontend Requirements

Missing entirely:

- Character Studio APIs
- World Studio APIs
- Episode Studio APIs
- Asset Studio APIs
- AI Studio APIs
- Production Studio APIs
- Publishing Studio APIs
- Collaboration Studio APIs
- Intelligence Studio APIs

Missing platform APIs:

- Membership management
- Team administration
- Invitations
- Search APIs
- Saved search APIs
- Recent activity APIs
- Notification APIs
- Review/assignment/comment APIs
- Background job status APIs

### Duplicate APIs

- No major duplicate APIs are currently implemented
- Risk of future duplication is high because no shared pagination, filtering, or list-query contract exists yet

### DTO Consistency Review

Current DTO strengths:

- Pydantic models are used consistently for implemented routes
- Alias mapping to frontend-friendly camelCase is already present for user fields

Current DTO gaps:

- DTO scope is limited to auth/user/studio bootstrap
- No pagination DTOs
- No filtering DTOs
- No search DTOs
- No domain-specific create/update/read models for any Phase 1 studio

### Pagination Review

Assessment:

- No list endpoint supports pagination
- This is already a mismatch with the documented backend principles and the frontend’s library-heavy studio surfaces

### Filtering Review

Assessment:

- No list endpoint supports filtering, sorting, or search query parameters

### Search Review

Assessment:

- No backend search endpoints exist
- No indexing abstraction exists
- No query normalization or category-based search contract exists server-side

---

## 5. Implementation Roadmap

### Phase 0 - Platform Hardening

1. Convert runtime to migration-only initialization
2. Standardize PostgreSQL-first configuration
3. Introduce shared pagination, filtering, and list-query DTOs
4. Establish repository and service conventions per bounded context
5. Define event and outbox infrastructure before domain fan-out

### Phase 1 - Authentication

Priority: Highest

Implement:

- Identity persistence hardening
- Clerk token verification robustness
- Membership switching/session context API
- Audit trail for authentication and membership changes
- Invitation and onboarding flows

### Phase 2 - Character

Implement:

- Character entities
- Character repository/service/API
- Version history
- Search and filtering
- Character tests and migrations

### Phase 3 - World

Implement:

- World and region entities
- Hierarchical world retrieval
- Search and filtering
- Migrations and tests

### Phase 4 - Episode

Implement:

- Episode, scene, script, and related planning entities
- Ordering and version persistence
- Search/filter/list APIs

### Phase 5 - Asset

Implement:

- Asset metadata model
- Collections, versions, tags, derivatives
- Storage abstraction and asset APIs

### Phase 6 - AI

Implement:

- Prompt templates and versions
- AI jobs and outputs
- Provider log persistence
- Worker task execution contracts

### Phase 7 - Production

Implement:

- Production workspaces, milestones, tasks, dependencies
- Planning and health endpoints
- Background processing hooks where needed

### Phase 8 - Publishing

Implement:

- Publications, releases, targets, approvals, notes
- Scheduling and export metadata endpoints

### Phase 9 - Collaboration

Implement:

- Comments, mentions, assignments, reviews, discussions, notifications
- Shared activity feed persistence

### Phase 10 - Intelligence

Implement:

- Saved searches
- Recent opens
- Aggregated activity read models
- Insight/recommendation placeholder persistence layer
- API support for command/search history surfaces

### Recommended Delivery Principle

Build domain-by-domain in the same order as frontend dependency pressure:

1. Authentication
2. Character
3. World
4. Episode
5. Asset
6. AI
7. Production
8. Publishing
9. Collaboration
10. Intelligence

---

## 6. Technical Risks

### Risk 1 - Frontend/Backend Contract Drift

The frontend now exposes stable studio flows across nine major domains, but the backend only serves identity and studio bootstrap. The longer this gap persists, the greater the risk that backend DTOs and persistence models will diverge from the stable frontend contracts.

### Risk 2 - SQLite/PostgreSQL Mismatch

Runtime defaults and Alembic baseline still point at SQLite-oriented behavior, while architecture and production targets require PostgreSQL semantics, RLS, and PostgreSQL-native UUID behavior.

### Risk 3 - Migration Debt

If domain tables are added before the platform-wide decisions on UUIDs, soft deletes, audit fields, and versioning are standardized, migration churn will compound rapidly.

### Risk 4 - Missing Event Infrastructure

Publishing, Collaboration, and Intelligence all assume cross-domain activity and asynchronous processing. Without event/outbox infrastructure, later backend implementation may fragment into synchronous coupling between bounded contexts.

### Risk 5 - Worker Surface Is Empty

Celery is configured but there are no tasks, retry strategies, queues per domain, or monitoring conventions. AI, Publishing, Collaboration, and Intelligence will all need asynchronous workloads.

### Risk 6 - Security Gaps

The development-only Clerk header override in [apps/api/src/nabhaverse_api/presentation/api/dependencies.py](apps/api/src/nabhaverse_api/presentation/api/dependencies.py) is a useful local tool but a production risk if not environment-guarded.

---

## 7. Recommended Approval Boundary

Program A should not proceed directly to broad implementation until the following architecture decisions are approved:

1. PostgreSQL-only runtime posture
2. Migration-only schema bootstrapping
3. Shared audit and soft-delete conventions
4. Bounded-context table ownership and naming for all domains
5. Search and activity read-model strategy for Intelligence
6. Event/outbox pattern for asynchronous cross-domain updates

---

## 8. Conclusion

The current backend is a valid foundation for identity and studio bootstrapping, but it is not yet a platform backend for the completed frontend system. Program A should therefore begin with platform hardening and a disciplined domain-by-domain rollout rather than immediate feature implementation.

This document is an architecture review only. No schema or runtime implementation changes are recommended in this step.
