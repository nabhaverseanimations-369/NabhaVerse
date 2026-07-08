from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends
from nabhaverse_api.application.dto.auth_dto import CreateStudioIn, MembershipOut, StudioOut
from nabhaverse_api.application.services.studio_service import StudioService
from nabhaverse_api.infrastructure.database.session import get_session
from nabhaverse_api.presentation.api.dependencies import AuthContext, get_current_auth_context
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/studios", tags=["studios"])


@router.get("", response_model=list[MembershipOut])
async def list_studios(
    context: Annotated[AuthContext, Depends(get_current_auth_context)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> list[MembershipOut]:
    service = StudioService(session)
    return await service.list_memberships_for_user(context.user_id)


@router.post("", response_model=StudioOut)
async def create_studio(
    payload: CreateStudioIn,
    context: Annotated[AuthContext, Depends(get_current_auth_context)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> StudioOut:
    service = StudioService(session)
    return await service.create_studio_for_user(context.user_id, payload.name)
