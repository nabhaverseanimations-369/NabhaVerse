from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends
from nabhaverse_api.application.dto.auth_dto import UpdatePreferencesIn, UserOut
from nabhaverse_api.application.services.user_service import UserService
from nabhaverse_api.infrastructure.database.session import get_session
from nabhaverse_api.presentation.api.dependencies import AuthContext, get_current_auth_context
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/users", tags=["users"])


@router.get(
    "/me",
    response_model=UserOut,
    summary="Get current profile",
    description="Return the authenticated backend user profile synchronized from Clerk.",
)
async def get_me(
    context: Annotated[AuthContext, Depends(get_current_auth_context)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> UserOut:
    service = UserService(session)
    return await service.get_user(context.user_id)


@router.patch(
    "/me/preferences",
    response_model=UserOut,
    summary="Update profile preferences",
    description="Merge profile preferences for the authenticated user.",
)
async def update_preferences(
    payload: UpdatePreferencesIn,
    context: Annotated[AuthContext, Depends(get_current_auth_context)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> UserOut:
    service = UserService(session)
    return await service.update_preferences(context.user_id, payload.preferences)
