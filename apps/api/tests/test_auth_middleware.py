from fastapi.testclient import TestClient
from helpers import make_auth_headers
from nabhaverse_api.main import app


def test_protected_auth_me_requires_identity() -> None:
    with TestClient(app) as client:
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 401


def test_auth_me_with_clerk_identity_headers() -> None:
    with TestClient(app) as client:
        response = client.get(
            "/api/v1/auth/me",
            headers=make_auth_headers(
                user_id="user_test_001",
                email="user@nabhaverse.test",
                name="Test User",
            ),
        )

        assert response.status_code == 200
        payload = response.json()
        assert payload["user"]["clerkUserId"] == "user_test_001"
        assert len(payload["memberships"]) >= 1
