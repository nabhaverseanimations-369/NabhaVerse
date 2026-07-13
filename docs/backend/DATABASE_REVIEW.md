# Database Review

**Program:** Phase 2, Program A - Backend Platform  
**Status:** Architecture Review Only  
**Last Updated:** 2026-07-13

## Current State

Current database implementation is defined by:

- SQLAlchemy models in [apps/api/src/nabhaverse_api/infrastructure/database/models.py](apps/api/src/nabhaverse_api/infrastructure/database/models.py)
- Session/bootstrap logic in [apps/api/src/nabhaverse_api/infrastructure/database/session.py](apps/api/src/nabhaverse_api/infrastructure/database/session.py)
- Alembic migration baseline in [apps/api/migrations/versions/20260708_0001_auth_identity.py](apps/api/migrations/versions/20260708_0001_auth_identity.py)
- Alembic config in [apps/api/alembic.ini](apps/api/alembic.ini)

Only the following tables currently exist in implementation scope:

- `users`
- `studios`
- `roles`
- `permissions`
- `role_permissions`
- `memberships`

## Table Design

Assessment:

- Current tables are sufficient for auth/studio bootstrap only
- Content and workflow domain tables are absent
- Table design does not yet align with the documented multi-tenant content architecture in [docs/architecture/database.md](docs/architecture/database.md)

## Primary Keys

Current behavior:

- `users`, `studios`, and `memberships` use string UUIDs generated via Python `uuid4()`
- `roles` and `permissions` use integer autoincrement keys

Assessment:

- This partially conflicts with the documented standard that all tables use UUID primary keys
- PostgreSQL-native UUID defaults such as `gen_random_uuid()` are not used

Recommendation:

- Standardize on UUID primary keys for all future tables and plan migration strategy for integer-key foundation tables

## Foreign Keys

Implemented foreign keys:

- `memberships.user_id -> users.id`
- `memberships.studio_id -> studios.id`
- `memberships.role_id -> roles.id`
- `role_permissions.role_id -> roles.id`
- `role_permissions.permission_id -> permissions.id`

Assessment:

- Foreign key design for current foundation tables is valid
- There is no domain-level FK graph yet because no studio-domain tables exist

## UUID Usage

Assessment:

- UUID usage exists but is application-generated and string-backed rather than database-native
- The implementation is therefore not yet aligned with the PostgreSQL-first design standard

## Constraints

Implemented constraints:

- Unique `users.clerk_user_id`
- Indexed `users.email`
- Unique `studios.slug`
- Unique `roles.name`
- Unique `permissions.name`
- Unique `(memberships.user_id, memberships.studio_id)`

Assessment:

- Existing constraints are sensible for current scope
- Domain-specific validation constraints, lifecycle constraints, and versioning constraints are absent

## Indexes

Implemented indexes:

- `ix_users_clerk_user_id`
- `ix_users_email`
- `ix_studios_slug`
- `ix_memberships_user_id`
- `ix_memberships_studio_id`
- `ix_memberships_role_id`

Assessment:

- Basic indexing exists for the foundation tables
- No partial indexes for soft-delete filtering exist
- No search-oriented indexes exist
- No composite indexes for common tenant-scoped reads exist beyond the membership uniqueness constraint

## Soft Delete

Assessment:

- No current table includes `deleted_at`
- Current schema uses hard delete semantics through FK cascade behavior
- This diverges from the documented platform requirement that rows should be soft-deleted by default

Recommendation:

- Introduce `deleted_at` for tenant-owned tables before domain tables proliferate

## Audit Logging

Assessment:

- `created_at` and `updated_at` exist on some tables
- `created_by` and `updated_by` do not exist
- No audit event or immutable audit log table exists

Recommendation:

- Introduce audit columns and an audit event strategy before domain rollout

## Versioning

Assessment:

- No version tables or version columns are implemented
- No immutable history model exists for document-like domains

Recommendation:

- Establish versioning patterns before Character, World, Episode, Asset, AI Prompt, and Publishing entities are introduced

## Multi-Tenancy

Assessment:

- Multi-tenancy currently exists only through studio memberships
- No domain table currently carries `studio_id` because no domain entities are implemented
- There is no reusable tenant-scoping repository or policy layer

Recommendation:

- Require `studio_id` on all tenant-owned tables and standardize tenant-scoped indexes and query conventions

## Row-Level Security

Assessment:

- No RLS is implemented
- No policies exist
- Current default SQLite runtime makes true PostgreSQL RLS impossible in local default configuration

Recommendation:

- Shift to PostgreSQL-first runtime before RLS design is finalized and enforced

## Alembic and Schema Lifecycle

Assessment:

- Alembic exists but only one migration is present
- Runtime `create_all()` is still active, which undermines migration discipline
- Alembic config still references SQLite-oriented defaults

Recommendation:

1. Remove runtime schema creation from app startup
2. Use Alembic as the sole schema management path
3. Make PostgreSQL the default local and CI database target for backend work

## Database Risk Summary

Primary risks:

1. PostgreSQL architecture is documented but not yet the default runtime reality
2. Foundation tables do not fully conform to UUID-only standards
3. Soft delete, audit logging, versioning, and RLS are all missing
4. If domains are implemented before these platform decisions are standardized, migration debt will grow quickly

## Conclusion

The current database layer is acceptable as a foundation seed but not yet production-ready for the stable frontend platform. Program A should treat database hardening as a prerequisite to broad domain implementation.
