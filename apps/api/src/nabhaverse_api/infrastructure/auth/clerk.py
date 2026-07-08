from __future__ import annotations

from dataclasses import dataclass

import httpx
from jose import jwt
from jose.exceptions import JWTError
from nabhaverse_api.infrastructure.config import Settings


class AuthenticationError(Exception):
    pass


@dataclass(frozen=True)
class AuthIdentity:
    clerk_user_id: str
    email: str | None
    full_name: str | None
    avatar_url: str | None


class ClerkTokenVerifier:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._jwks_cache: dict[str, object] | None = None

    async def _get_jwks(self) -> dict[str, object]:
        if self._jwks_cache is not None:
            return self._jwks_cache

        if not self._settings.clerk_jwks_url:
            raise AuthenticationError("CLERK_JWKS_URL is not configured")

        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(self._settings.clerk_jwks_url)
            response.raise_for_status()

        payload = response.json()
        if not isinstance(payload, dict):
            raise AuthenticationError("Invalid Clerk JWKS response")

        self._jwks_cache = payload
        return payload

    async def verify(self, token: str) -> AuthIdentity:
        jwks = await self._get_jwks()

        try:
            claims = jwt.decode(
                token,
                jwks,
                algorithms=["RS256"],
                issuer=self._settings.clerk_issuer,
                audience=self._settings.clerk_audience,
                options={"verify_aud": self._settings.clerk_audience is not None},
            )
        except JWTError as exc:
            raise AuthenticationError("Invalid Clerk token") from exc

        subject = claims.get("sub")
        if not isinstance(subject, str) or not subject:
            raise AuthenticationError("Token subject is missing")

        email: str | None = None
        email_claim = claims.get("email")
        if isinstance(email_claim, str):
            email = email_claim

        first_name = claims.get("first_name")
        last_name = claims.get("last_name")
        full_name: str | None = None
        if isinstance(first_name, str) and isinstance(last_name, str):
            full_name = f"{first_name} {last_name}".strip() or None

        avatar_url: str | None = None
        picture = claims.get("picture")
        if isinstance(picture, str):
            avatar_url = picture

        return AuthIdentity(
            clerk_user_id=subject,
            email=email,
            full_name=full_name,
            avatar_url=avatar_url,
        )
