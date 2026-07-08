from fastapi.testclient import TestClient
from nabhaverse_api.main import app


def test_protected_auth_me_requires_identity() -> None:
    with TestClient(app) as client:
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 401


def test_auth_me_with_clerk_identity_headers() -> None:
    with TestClient(app) as client:
        response = client.get(
            "/api/v1/auth/me",
            headers={
                "X-Clerk-User-Id": "user_test_001",
                "X-Clerk-Email": "user@nabhaverse.test",
                "X-Clerk-Name": "Test User",
            },
        )

        assert response.status_code == 200
        payload = response.json()
        assert payload["user"]["clerkUserId"] == "user_test_001"
        assert len(payload["memberships"]) >= 1
