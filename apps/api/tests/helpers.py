from __future__ import annotations

from typing import cast

from fastapi.testclient import TestClient


def make_auth_headers(
    *,
    user_id: str,
    email: str,
    name: str,
) -> dict[str, str]:
    return {
        "X-Clerk-User-Id": user_id,
        "X-Clerk-Email": email,
        "X-Clerk-Name": name,
    }


def get_primary_studio_id(client: TestClient, headers: dict[str, str]) -> str:
    session_response = client.get("/api/v1/auth/me", headers=headers)
    assert session_response.status_code == 200
    return cast(str, session_response.json()["memberships"][0]["studio"]["id"])
