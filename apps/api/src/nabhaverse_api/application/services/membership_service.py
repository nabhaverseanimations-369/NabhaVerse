from __future__ import annotations

from fastapi import HTTPException, status
from nabhaverse_api.application.dto.auth_dto import (
    MembershipOut,
    MembershipPageOut,
    StudioOut,
)
from nabhaverse_api.application.services.foundation import (
    AccessContext,
    not_found,
    require_entity,
    to_pagination,
)
from nabhaverse_api.domain.auth.permissions import (
    ROLE_PERMISSIONS,
    Permission,
    Role,
)
from nabhaverse_api.infrastructure.database.models import MembershipModel
from nabhaverse_api.infrastructure.database.repositories import (
    MembershipRepository,
    RoleRepository,
    StudioRepository,
    UserRepository,
)
from sqlalchemy.ext.asyncio import AsyncSession


def membership_to_dto(membership: MembershipModel) -> MembershipOut:
    return MembershipOut(
        id=membership.id,
        userId=membership.user_id,
        studio=StudioOut(
            id=membership.studio.id,
            name=membership.studio.name,
            slug=membership.studio.slug,
        ),
        role=Role(membership.role.name),
        permissions=sorted(
            ROLE_PERMISSIONS[Role(membership.role.name)],
            key=lambda permission: permission.value,
        ),
    )


class MembershipService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.memberships = MembershipRepository(session)
        self.roles = RoleRepository(session)
        self.studios = StudioRepository(session)
        self.users = UserRepository(session)
        self.access = AccessContext(self.memberships, self.users)

    async def get_membership_for_user(self, *, user_id: str, studio_id: str) -> MembershipModel:
        return await self.access.require_membership(user_id=user_id, studio_id=studio_id)

    async def list_memberships_for_studio(
        self,
        *,
        actor_user_id: str,
        studio_id: str,
        limit: int,
        offset: int,
    ) -> MembershipPageOut:
        await self.access.require_permission(
            actor_user_id=actor_user_id,
            studio_id=studio_id,
            permission=Permission.MANAGE_MEMBERS,
        )

        items = await self.memberships.list_for_studio(
            studio_id=studio_id,
            limit=limit,
            offset=offset,
        )
        total = await self.memberships.count_for_studio(studio_id=studio_id)
        return MembershipPageOut(
            items=[membership_to_dto(item) for item in items],
            pagination=to_pagination(total=total, limit=limit, offset=offset),
        )

    async def create_membership(
        self,
        *,
        actor_user_id: str,
        studio_id: str,
        target_user_id: str,
        role: Role,
    ) -> MembershipOut:
        await self.access.require_permission(
            actor_user_id=actor_user_id,
            studio_id=studio_id,
            permission=Permission.MANAGE_MEMBERS,
        )

        studio = await self.studios.get_by_id(studio_id)
        if studio is None:
            raise not_found("Studio not found")

        await self.access.require_user(target_user_id)

        existing = await self.memberships.get_by_user_and_studio(
            user_id=target_user_id,
            studio_id=studio_id,
        )
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Membership already exists",
            )

        role_row = await self.roles.get_by_name(role)
        if role_row is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Role not configured",
            )

        membership = await self.memberships.create(
            user_id=target_user_id,
            studio_id=studio_id,
            role_id=role_row.id,
        )
        await self.session.commit()

        created = await self.memberships.get_by_id(membership.id)
        if created is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Membership could not be loaded",
            )
        return membership_to_dto(created)

    async def assign_role(
        self,
        *,
        actor_user_id: str,
        studio_id: str,
        membership_id: str,
        role: Role,
    ) -> MembershipOut:
        await self.access.require_permission(
            actor_user_id=actor_user_id,
            studio_id=studio_id,
            permission=Permission.MANAGE_MEMBERS,
        )

        membership = await self.memberships.get_by_id(membership_id)
        if membership is None or membership.studio_id != studio_id:
            raise not_found("Membership not found")

        role_row = await self.roles.get_by_name(role)
        if role_row is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Role not configured",
            )

        updated = await self.memberships.update_role(membership, role_row.id)
        await self.session.commit()
        await self.session.refresh(updated)

        refreshed = await self.memberships.get_by_id(updated.id)
        refreshed = require_entity(refreshed, detail="Membership could not be loaded")
        return membership_to_dto(refreshed)
