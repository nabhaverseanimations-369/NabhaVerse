from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends
from nabhaverse_api.application.dto.auth_dto import SessionOut
from nabhaverse_api.application.services.auth_service import AuthService
from nabhaverse_api.infrastructure.auth.clerk import AuthIdentity
from nabhaverse_api.infrastructure.database.session import get_session
from nabhaverse_api.presentation.api.dependencies import get_current_identity
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me", response_model=SessionOut)
async def me(
    session: Annotated[AsyncSession, Depends(get_session)],
    identity: Annotated[AuthIdentity, Depends(get_current_identity)],
) -> SessionOut:
    service = AuthService(session)
    return await service.current_session(identity)


@router.post("/logout")
async def logout() -> dict[str, str]:
    # Clerk sessions are revoked client-side; API logout endpoint is kept for
    # future server-side session revocation/audit handling.
    return {"status": "signed_out"}
