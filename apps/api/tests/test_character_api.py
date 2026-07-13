from __future__ import annotations

from fastapi.testclient import TestClient
from nabhaverse_api.main import app


def test_character_endpoints_crud_and_nested_routes(auth_headers: dict[str, str]) -> None:
    with TestClient(app) as client:
        session_response = client.get("/api/v1/auth/me", headers=auth_headers)
        assert session_response.status_code == 200
        studio_id = session_response.json()["memberships"][0]["studio"]["id"]

        create_response = client.post(
            f"/api/v1/characters?studioId={studio_id}",
            headers=auth_headers,
            json={
                "name": "Aurora Vale",
                "status": "draft",
                "summary": "Pilot character",
                "tags": ["lead", "pilot"],
                "favorite": True,
                "initialVersionLabel": "v1.0",
            },
        )
        assert create_response.status_code == 201
        created = create_response.json()
        character_id = created["id"]

        list_response = client.get(
            f"/api/v1/characters?studioId={studio_id}&query=aurora&status=draft&tags=lead",
            headers=auth_headers,
        )
        assert list_response.status_code == 200
        list_payload = list_response.json()
        assert list_payload["pagination"]["total"] >= 1

        get_response = client.get(
            f"/api/v1/characters/{character_id}?studioId={studio_id}",
            headers=auth_headers,
        )
        assert get_response.status_code == 200

        patch_response = client.patch(
            f"/api/v1/characters/{character_id}?studioId={studio_id}",
            headers=auth_headers,
            json={
                "status": "approved",
                "summary": "Approved pilot character",
                "lockVersion": created["lockVersion"],
            },
        )
        assert patch_response.status_code == 200
        assert patch_response.json()["status"] == "approved"

        version_response = client.post(
            f"/api/v1/characters/{character_id}/versions?studioId={studio_id}",
            headers=auth_headers,
            json={"label": "v1.1", "summary": "Revisions", "active": True},
        )
        assert version_response.status_code == 201

        versions_list = client.get(
            f"/api/v1/characters/{character_id}/versions?studioId={studio_id}",
            headers=auth_headers,
        )
        assert versions_list.status_code == 200
        assert versions_list.json()["pagination"]["total"] >= 1

        target_response = client.post(
            f"/api/v1/characters?studioId={studio_id}",
            headers=auth_headers,
            json={
                "name": "Nox-7",
                "status": "in-review",
                "summary": "Support tactician",
                "tags": ["android"],
                "favorite": False,
            },
        )
        assert target_response.status_code == 201
        target_character_id = target_response.json()["id"]

        relationship_response = client.post(
            f"/api/v1/characters/{character_id}/relationships?studioId={studio_id}",
            headers=auth_headers,
            json={
                "relatedCharacterId": target_character_id,
                "relationshipType": "team",
                "notes": "Core pair",
            },
        )
        assert relationship_response.status_code == 201

        relationships_list = client.get(
            f"/api/v1/characters/{character_id}/relationships?studioId={studio_id}",
            headers=auth_headers,
        )
        assert relationships_list.status_code == 200
        assert relationships_list.json()["pagination"]["total"] >= 1

        delete_response = client.delete(
            f"/api/v1/characters/{character_id}?studioId={studio_id}",
            headers=auth_headers,
        )
        assert delete_response.status_code == 204


def test_character_create_rejects_owner_outside_studio(
    auth_headers: dict[str, str],
) -> None:
    with TestClient(app) as client:
        owner_session = client.get("/api/v1/auth/me", headers=auth_headers)
        assert owner_session.status_code == 200
        studio_id = owner_session.json()["memberships"][0]["studio"]["id"]

        external_headers = {
            "X-Clerk-User-Id": "user_external_owner_002",
            "X-Clerk-Email": "external-owner@nabhaverse.test",
            "X-Clerk-Name": "External Owner",
        }
        external_session = client.get("/api/v1/auth/me", headers=external_headers)
        assert external_session.status_code == 200
        external_user_id = external_session.json()["user"]["id"]

        response = client.post(
            f"/api/v1/characters?studioId={studio_id}",
            headers=auth_headers,
            json={
                "name": "Boundary Character",
                "status": "draft",
                "ownerUserId": external_user_id,
            },
        )

        assert response.status_code == 404
        assert response.json()["detail"] == "Owner is not a member of this studio"
