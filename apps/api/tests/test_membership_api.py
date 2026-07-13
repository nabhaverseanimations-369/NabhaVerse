from __future__ import annotations

from fastapi.testclient import TestClient
from nabhaverse_api.main import app


def test_readiness_endpoint() -> None:
    with TestClient(app) as client:
        response = client.get("/health/readiness")
        assert response.status_code == 200
        assert response.json() == {"status": "ready"}


def test_studio_listing_supports_pagination(auth_headers: dict[str, str]) -> None:
    with TestClient(app) as client:
        response = client.get("/api/v1/studios?limit=10&offset=0", headers=auth_headers)
        assert response.status_code == 200
        payload = response.json()
        assert "items" in payload
        assert payload["pagination"]["limit"] == 10


def test_studio_membership_endpoints_enforce_rbac(auth_headers: dict[str, str]) -> None:
    with TestClient(app) as client:
        owner_session = client.get("/api/v1/auth/me", headers=auth_headers)
        assert owner_session.status_code == 200
        studio_id = owner_session.json()["memberships"][0]["studio"]["id"]

        target_session = client.get(
            "/api/v1/auth/me",
            headers={
                "X-Clerk-User-Id": "user_target_001",
                "X-Clerk-Email": "target@nabhaverse.test",
                "X-Clerk-Name": "Target User",
            },
        )
        assert target_session.status_code == 200
        target_user_id = target_session.json()["user"]["id"]

        create_response = client.post(
            f"/api/v1/studios/{studio_id}/memberships",
            headers=auth_headers,
            json={"userId": target_user_id, "role": "viewer"},
        )
        assert create_response.status_code == 201

        membership_id = create_response.json()["id"]
        update_response = client.patch(
            f"/api/v1/studios/{studio_id}/memberships/{membership_id}",
            headers=auth_headers,
            json={"role": "editor"},
        )
        assert update_response.status_code == 200
        assert update_response.json()["role"] == "editor"
