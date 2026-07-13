from __future__ import annotations

from typing import Annotated

from fastapi import Depends, Header, HTTPException, status
from nabhaverse_api.application.services.auth_service import AuthContext, AuthService
from nabhaverse_api.infrastructure.auth.clerk import (
    AuthenticationError,
    AuthIdentity,
    ClerkTokenVerifier,
)
from nabhaverse_api.infrastructure.config import Settings, get_settings
from nabhaverse_api.infrastructure.database.session import get_session
from sqlalchemy.ext.asyncio import AsyncSession


def get_app_settings() -> Settings:
    return get_settings()


def get_token_verifier(
    settings: Annotated[Settings, Depends(get_app_settings)],
) -> ClerkTokenVerifier:
    return ClerkTokenVerifier(settings)


async def get_current_identity(
    verifier: Annotated[ClerkTokenVerifier, Depends(get_token_verifier)],
    authorization: Annotated[str | None, Header(alias="Authorization")] = None,
    clerk_user_id: Annotated[str | None, Header(alias="X-Clerk-User-Id")] = None,
    clerk_email: Annotated[str | None, Header(alias="X-Clerk-Email")] = None,
    clerk_name: Annotated[str | None, Header(alias="X-Clerk-Name")] = None,
) -> AuthIdentity:
    # TODO(epic-2-cleanup): Restrict or remove header-based identity
    # override outside local development.
    if clerk_user_id:
        return AuthIdentity(
            clerk_user_id=clerk_user_id,
            email=clerk_email,
            full_name=clerk_name,
            avatar_url=None,
        )

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    token = authorization.replace("Bearer ", "", 1).strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    try:
        return await verifier.verify(token)
    except AuthenticationError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc


async def get_current_auth_context(
    session: Annotated[AsyncSession, Depends(get_session)],
    identity: Annotated[AuthIdentity, Depends(get_current_identity)],
) -> AuthContext:
    service = AuthService(session)
    return await service.ensure_user(identity)


CurrentAuthContext = Annotated[AuthContext, Depends(get_current_auth_context)]
CurrentIdentity = Annotated[AuthIdentity, Depends(get_current_identity)]
