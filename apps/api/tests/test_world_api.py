from __future__ import annotations

from fastapi.testclient import TestClient
from helpers import get_primary_studio_id
from nabhaverse_api.main import app


def test_world_endpoints_crud_and_nested_routes(auth_headers: dict[str, str]) -> None:
    with TestClient(app) as client:
        studio_id = get_primary_studio_id(client, auth_headers)

        create_response = client.post(
            f"/api/v1/worlds?studioId={studio_id}",
            headers=auth_headers,
            json={
                "name": "Lunara Basin",
                "status": "draft",
                "description": "A tidal world",
                "tags": ["coastal", "trade"],
                "favorite": True,
                "initialVersionLabel": "v1.0",
                "timelineSummary": "Age of treaties",
            },
        )
        assert create_response.status_code == 201
        created = create_response.json()
        world_id = created["id"]

        list_response = client.get(
            f"/api/v1/worlds?studioId={studio_id}&query=lunara&status=draft&tags=coastal",
            headers=auth_headers,
        )
        assert list_response.status_code == 200
        assert list_response.json()["pagination"]["total"] >= 1

        get_response = client.get(f"/api/v1/worlds/{world_id}", headers=auth_headers)
        assert get_response.status_code == 200

        patch_response = client.patch(
            f"/api/v1/worlds/{world_id}",
            headers=auth_headers,
            json={
                "status": "published",
                "description": "Published world",
                "lockVersion": created["lockVersion"],
            },
        )
        assert patch_response.status_code == 200
        assert patch_response.json()["status"] == "published"

        version_response = client.post(
            f"/api/v1/worlds/{world_id}/versions",
            headers=auth_headers,
            json={"label": "v1.1", "summary": "Expanded lore", "active": True},
        )
        assert version_response.status_code == 201

        versions_response = client.get(
            f"/api/v1/worlds/{world_id}/versions",
            headers=auth_headers,
        )
        assert versions_response.status_code == 200
        assert versions_response.json()["pagination"]["total"] >= 1

        region_response = client.post(
            f"/api/v1/worlds/{world_id}/regions",
            headers=auth_headers,
            json={"name": "North Coast", "kind": "coastal", "summary": "Harbor zone"},
        )
        assert region_response.status_code == 201
        region_id = region_response.json()["id"]

        regions_list = client.get(f"/api/v1/worlds/{world_id}/regions", headers=auth_headers)
        assert regions_list.status_code == 200
        assert regions_list.json()["pagination"]["total"] >= 1

        location_response = client.post(
            f"/api/v1/worlds/{world_id}/locations",
            headers=auth_headers,
            json={
                "name": "Lantern Harbor",
                "regionId": region_id,
                "locationType": "city",
                "summary": "Primary trade city",
            },
        )
        assert location_response.status_code == 201

        locations_list = client.get(f"/api/v1/worlds/{world_id}/locations", headers=auth_headers)
        assert locations_list.status_code == 200
        assert locations_list.json()["pagination"]["total"] >= 1

        delete_response = client.delete(f"/api/v1/worlds/{world_id}", headers=auth_headers)
        assert delete_response.status_code == 204
