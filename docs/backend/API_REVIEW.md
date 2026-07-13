# API Review

**Program:** Phase 2, Program A - Backend Platform  
**Status:** Architecture Review Only  
**Last Updated:** 2026-07-13

## Existing API Surface

Versioned API routing is defined in [apps/api/src/nabhaverse_api/presentation/api/v1/router.py](apps/api/src/nabhaverse_api/presentation/api/v1/router.py).

Current endpoints:

| Method  | Path                           | Purpose                                    |
| ------- | ------------------------------ | ------------------------------------------ |
| `GET`   | `/health`                      | Basic health check                         |
| `GET`   | `/api/v1/auth/me`              | Clerk-backed current session bootstrap     |
| `POST`  | `/api/v1/auth/logout`          | Placeholder logout acknowledgement         |
| `GET`   | `/api/v1/users/me`             | Current user profile                       |
| `PATCH` | `/api/v1/users/me/preferences` | Merge preference payload into current user |
| `GET`   | `/api/v1/studios`              | List current user memberships              |
| `POST`  | `/api/v1/studios`              | Create a studio and owner membership       |

## Frontend Compatibility Assessment

The frontend now exposes stable UX contracts for Character, World, Episode, Asset, AI, Production, Publishing, Collaboration, and Intelligence. None of those domains currently have corresponding backend APIs.

Result:

- Frontend compatibility is currently preserved only because frontend behavior remains mock-driven
- Once backend replacement begins, API parity work will be substantial across all frontend modules

## Missing Endpoints

### Platform and Identity

Missing:

- Membership switching
- Membership administration
- Invitations
- Studio settings
- Team management
- Profile mutation beyond preferences

### Domain APIs

Entirely missing:

- Character APIs
- World APIs
- Episode APIs
- Asset APIs
- AI APIs
- Production APIs
- Publishing APIs
- Collaboration APIs
- Intelligence APIs

## Pagination Review

Assessment:

- No endpoint currently supports pagination
- This is incompatible with future list-heavy frontend surfaces such as libraries, feeds, and search results

Recommendation:

- Establish a shared pagination contract before implementing domain list endpoints

## Filtering Review

Assessment:

- No endpoint supports filtering or sorting
- Frontend libraries already depend on rich filtering behavior

Recommendation:

- Standardize reusable filter DTOs and query parsing before domain rollout

## Search Review

Assessment:

- No backend search endpoints exist
- No cross-studio search or search category APIs exist
- No saved-search or search-history APIs exist

Recommendation:

- Define search contracts aligned with the stable frontend intelligence/search UX before any indexing implementation begins

## Validation Review

Current strengths:

- Implemented request payloads use Pydantic models
- Current responses are explicit and typed

Current gaps:

- Validation scope is limited to auth/studio foundation DTOs
- No domain request/response DTO sets exist
- No reusable pagination/filter/search request DTOs exist

## DTO Consistency Review

Current DTOs live in [apps/api/src/nabhaverse_api/application/dto/auth_dto.py](apps/api/src/nabhaverse_api/application/dto/auth_dto.py).

Assessment:

- DTO naming and camelCase aliases are compatible with frontend expectations for the implemented surfaces
- DTO coverage is too narrow for the stable frontend platform
- No domain DTO conventions exist yet for create/update/list/detail/version responses

## Error Handling Review

Current behavior:

- Uses `HTTPException` directly inside services for some flows
- Uses `401` for auth failures and `404` for user not found

Assessment:

- Error handling is functional but not standardized
- No domain error taxonomy exists
- No consistent API error envelope exists

Recommendation:

- Introduce a shared error contract before domain APIs expand significantly

## Endpoint-by-Endpoint Notes

### `GET /api/v1/auth/me`

Strengths:

- Useful bootstrap endpoint for frontend identity loading
- Ensures local user and default studio creation

Gaps:

- Side effects on read path increase coupling
- No explicit idempotency/audit behavior

### `GET /api/v1/studios`

Strengths:

- Returns membership context required for studio-aware UX

Gaps:

- Returns memberships only, not searchable/filterable studios
- No pagination
- No studio settings or ownership detail beyond role

### `POST /api/v1/studios`

Strengths:

- Minimal creation flow exists

Gaps:

- No slug control
- No settings payload
- No invitation or member seeding behavior

## Summary

The current API is valid only for authentication bootstrap and basic studio membership creation. It is not yet a backend API platform for the frozen frontend system. Program A should prioritize reusable API patterns first, then implement domain APIs in the agreed order.
