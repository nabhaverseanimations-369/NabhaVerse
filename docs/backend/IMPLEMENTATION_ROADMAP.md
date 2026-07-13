# Implementation Roadmap

**Program:** Phase 2, Program A - Backend Platform  
**Status:** Architecture Review Only  
**Last Updated:** 2026-07-13

## Roadmap Principles

- Preserve frozen frontend contracts
- Preserve stable Studio SDK public contracts
- Harden the platform first, then implement bounded contexts in dependency order
- Prefer migration-first, PostgreSQL-first, tenant-aware rollout

## Pre-Domain Platform Work

Before major domain implementation:

1. Remove runtime `create_all()` schema bootstrap
2. Make PostgreSQL the default runtime and migration target
3. Standardize UUID, audit, soft-delete, and tenant conventions
4. Add shared pagination, filtering, search, and error contracts
5. Establish worker, outbox, and event conventions

## Priority Order

### 1. Identity

- Complexity: Medium
- Dependencies: PostgreSQL-first config, audit conventions
- Risks: Auth drift, insecure local header override, session/audit gaps
- Recommended order: First

Reason:

- Every downstream domain depends on stable authenticated tenant context

### 2. Studio

- Complexity: Medium
- Dependencies: Identity, audit conventions, pagination/filter contracts
- Risks: Membership and invitation model drift, future tenant isolation coupling
- Recommended order: Second

Reason:

- Studio ownership and membership form the tenancy boundary for every domain

### 3. Character

- Complexity: Medium
- Dependencies: Identity, Studio, versioning pattern
- Risks: Versioning model debt if implemented before shared patterns are set
- Recommended order: Third

Reason:

- Relatively self-contained and ideal as the first content domain

### 4. World

- Complexity: Medium
- Dependencies: Identity, Studio, shared document/version patterns
- Risks: Hierarchy and relationship modeling may sprawl without conventions
- Recommended order: Fourth

### 5. Episode

- Complexity: High
- Dependencies: Character, World, shared document/version patterns
- Risks: Ordering, script storage, scene hierarchy, and review workflows
- Recommended order: Fifth

### 6. Asset

- Complexity: High
- Dependencies: Studio, storage abstraction, metadata/version patterns
- Risks: Storage lifecycle, metadata normalization, collections and tags
- Recommended order: Sixth

### 7. AI

- Complexity: High
- Dependencies: Worker platform, storage, audit/event patterns
- Risks: Async job lifecycle, output persistence, provider log growth
- Recommended order: Seventh

### 8. Production

- Complexity: High
- Dependencies: Episode, Asset, worker/event patterns
- Risks: Dependency graph complexity, scheduling semantics, workflow coupling
- Recommended order: Eighth

### 9. Publishing

- Complexity: High
- Dependencies: Production, Asset, Collaboration, event patterns
- Risks: Release scheduling, approval state modeling, export metadata coordination
- Recommended order: Ninth

### 10. Collaboration

- Complexity: High
- Dependencies: Identity, Studio, cross-domain references, notification/event strategy
- Risks: Cross-domain references, notification semantics, activity aggregation
- Recommended order: Tenth

### 11. Intelligence

- Complexity: High
- Dependencies: All prior domains, search contracts, activity read models
- Risks: Search abstraction drift, read-model coupling, recommendation placeholder persistence
- Recommended order: Eleventh

## Recommended Delivery Slices

### Slice A - Platform Hardening

- PostgreSQL-first runtime
- Migration-only bootstrapping
- Shared error/pagination/filter contracts
- Audit and soft-delete conventions

### Slice B - Identity + Studio

- Session hardening
- Membership and invitation model
- Studio settings and admin APIs

### Slice C - Content Foundations

- Character
- World
- Episode
- Asset

### Slice D - Async and Operational Foundations

- Worker task conventions
- Redis and Celery config hardening
- Event/outbox baseline

### Slice E - Workflow Domains

- AI
- Production
- Publishing

### Slice F - Cross-Cutting Domains

- Collaboration
- Intelligence

## Major Delivery Risks

1. Implementing domains before standardizing schema conventions will create migration churn
2. Implementing read-heavy domains before shared pagination/filter/search contracts will fragment APIs
3. Implementing AI/Publishing/Collaboration before worker/event conventions exist will create synchronous coupling and rework
4. Implementing Intelligence before foundational read models and search contracts exist will create unstable API contracts

## Conclusion

Program A should proceed as a platform-hardening and bounded-context rollout, not a direct feature build. Identity and Studio must be completed first, and every subsequent domain should be implemented behind the frozen frontend contracts in the documented order above.
