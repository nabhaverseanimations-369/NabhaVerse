from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query, status
from nabhaverse_api.application.dto.auth_dto import (
    CreateMembershipIn,
    MembershipOut,
    MembershipPageOut,
    UpdateMembershipRoleIn,
)
from nabhaverse_api.application.services.membership_service import MembershipService
from nabhaverse_api.infrastructure.database.session import get_session
from nabhaverse_api.presentation.api.dependencies import AuthContext, get_current_auth_context
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/studios/{studio_id}/memberships", tags=["memberships"])


@router.get(
    "",
    response_model=MembershipPageOut,
    summary="List studio memberships",
    description=(
        "List memberships for a studio with pagination. " "Requires member-management permission."
    ),
)
async def list_memberships(
    studio_id: Annotated[str, Path(description="Studio identifier")],
    context: Annotated[AuthContext, Depends(get_current_auth_context)],
    session: Annotated[AsyncSession, Depends(get_session)],
    limit: Annotated[int, Query(ge=1, le=100)] = 25,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> MembershipPageOut:
    service = MembershipService(session)
    return await service.list_memberships_for_studio(
        actor_user_id=context.user_id,
        studio_id=studio_id,
        limit=limit,
        offset=offset,
    )


@router.post(
    "",
    response_model=MembershipOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create studio membership",
    description=(
        "Add an existing user to a studio with an assigned role. "
        "Requires member-management permission."
    ),
)
async def create_membership(
    studio_id: Annotated[str, Path(description="Studio identifier")],
    payload: CreateMembershipIn,
    context: Annotated[AuthContext, Depends(get_current_auth_context)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> MembershipOut:
    service = MembershipService(session)
    return await service.create_membership(
        actor_user_id=context.user_id,
        studio_id=studio_id,
        target_user_id=payload.user_id,
        role=payload.role,
    )


@router.patch(
    "/{membership_id}",
    response_model=MembershipOut,
    summary="Assign membership role",
    description="Update a member's role inside a studio. Requires member-management permission.",
)
async def update_membership_role(
    studio_id: Annotated[str, Path(description="Studio identifier")],
    membership_id: Annotated[str, Path(description="Membership identifier")],
    payload: UpdateMembershipRoleIn,
    context: Annotated[AuthContext, Depends(get_current_auth_context)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> MembershipOut:
    service = MembershipService(session)
    return await service.assign_role(
        actor_user_id=context.user_id,
        studio_id=studio_id,
        membership_id=membership_id,
        role=payload.role,
    )
