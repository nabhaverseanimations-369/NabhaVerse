# Testing Review

**Program:** Phase 2, Program A - Backend Platform  
**Status:** Architecture Review Only  
**Last Updated:** 2026-07-13

## Current Test Inventory

API tests:

- [apps/api/tests/test_app.py](apps/api/tests/test_app.py)
- [apps/api/tests/test_auth_middleware.py](apps/api/tests/test_auth_middleware.py)
- [apps/api/tests/test_rbac.py](apps/api/tests/test_rbac.py)

Worker tests:

- [apps/workers/tests/test_worker_app.py](apps/workers/tests/test_worker_app.py)

## Coverage Assessment

### Repository Tests

Current status:

- None

Gap:

- No direct verification of repository queries, persistence behavior, uniqueness handling, or relationship loading

### Service Tests

Current status:

- None

Gap:

- No direct tests for `AuthService`, `UserService`, or `StudioService`
- No tests for studio creation collision behavior or preference merge semantics

### API Tests

Current status:

- Minimal

Covered:

- App metadata
- Health endpoint
- Auth requirement for `/api/v1/auth/me`
- Header-override auth bootstrap flow

Gap:

- No coverage for `/users/me`
- No coverage for `/users/me/preferences`
- No coverage for `/studios`
- No error-path coverage for Clerk verification failures

### Worker Tests

Current status:

- Minimal

Covered:

- Celery default queue name assertion only

Gap:

- No task tests
- No retry tests
- No integration tests with Redis/Celery behavior

### Migration Tests

Current status:

- None

Gap:

- No tests verifying Alembic migration application or rollback behavior
- No tests comparing model metadata to migration state

## Structural Testing Gaps by Domain

- Identity: missing service and auth failure-path tests
- Studio: missing service and endpoint tests
- Character through Intelligence: no backend tests exist because no backend implementation exists

## Test Strategy Recommendation

Before domain rollout, establish:

1. Repository test fixtures against a real PostgreSQL test database
2. Service tests for auth, membership, and studio lifecycle flows
3. API tests for every endpoint, including permission and validation failures
4. Migration tests in CI
5. Worker tests for Celery task registration, retry policies, and payload semantics

## Conclusion

Backend testing currently verifies that the application boots, a protected route requires auth, a dev header override works, and static RBAC mappings behave as expected. It does not yet provide the confidence needed for production backend rollout behind the stable frontend contracts.
