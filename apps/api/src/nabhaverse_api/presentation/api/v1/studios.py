from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query, status
from nabhaverse_api.application.dto.auth_dto import CreateStudioIn, StudioOut, StudioPageOut
from nabhaverse_api.application.services.studio_service import StudioService
from nabhaverse_api.infrastructure.database.session import get_session
from nabhaverse_api.presentation.api.dependencies import AuthContext, get_current_auth_context
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/studios", tags=["studios"])


@router.get(
    "",
    response_model=StudioPageOut,
    summary="List accessible studios",
    description="Return the current user's studio memberships with pagination.",
)
async def list_studios(
    context: Annotated[AuthContext, Depends(get_current_auth_context)],
    session: Annotated[AsyncSession, Depends(get_session)],
    limit: Annotated[int, Query(ge=1, le=100)] = 25,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> StudioPageOut:
    service = StudioService(session)
    return await service.list_memberships_for_user(
        user_id=context.user_id,
        limit=limit,
        offset=offset,
    )


@router.post(
    "",
    response_model=StudioOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create studio",
    description="Create a studio and assign the current user as owner.",
)
async def create_studio(
    payload: CreateStudioIn,
    context: Annotated[AuthContext, Depends(get_current_auth_context)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> StudioOut:
    service = StudioService(session)
    return await service.create_studio_for_user(context.user_id, payload.name)


@router.get(
    "/{studio_id}",
    response_model=StudioOut,
    summary="Get studio",
    description="Return a studio visible to the current user.",
)
async def get_studio(
    studio_id: Annotated[str, Path(description="Studio identifier")],
    context: Annotated[AuthContext, Depends(get_current_auth_context)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> StudioOut:
    service = StudioService(session)
    return await service.get_studio_for_user(user_id=context.user_id, studio_id=studio_id)
