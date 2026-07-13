from __future__ import annotations

from fastapi import HTTPException
from nabhaverse_api.application.dto.auth_dto import (
    MembershipOut,
    StudioOut,
    StudioPageOut,
)
from nabhaverse_api.application.services.foundation import to_pagination
from nabhaverse_api.domain.auth.permissions import ROLE_PERMISSIONS, Role
from nabhaverse_api.domain.shared.slug import slugify
from nabhaverse_api.infrastructure.database.repositories import (
    MembershipRepository,
    RoleRepository,
    StudioRepository,
)
from sqlalchemy.ext.asyncio import AsyncSession


class StudioService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.studios = StudioRepository(session)
        self.memberships = MembershipRepository(session)
        self.roles = RoleRepository(session)

    async def create_studio_for_user(self, user_id: str, name: str) -> StudioOut:
        base_slug = slugify(name, fallback="studio")
        slug = base_slug
        collision_index = 1
        while await self.studios.get_by_slug(slug) is not None:
            collision_index += 1
            slug = f"{base_slug}-{collision_index}"

        studio = await self.studios.create(name=name, slug=slug)
        owner_role = await self.roles.get_by_name(Role.OWNER)
        if owner_role is None:
            raise HTTPException(status_code=500, detail="Owner role is not configured")

        await self.memberships.create(user_id=user_id, studio_id=studio.id, role_id=owner_role.id)
        await self.session.commit()

        return StudioOut(id=studio.id, name=studio.name, slug=studio.slug)

    async def list_memberships_for_user(
        self,
        *,
        user_id: str,
        limit: int,
        offset: int,
    ) -> StudioPageOut:
        memberships = await self.memberships.list_for_user(user_id)
        items = memberships[offset : offset + limit]
        return StudioPageOut(
            items=[
                MembershipOut(
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
                for membership in items
            ],
            pagination=to_pagination(total=len(memberships), limit=limit, offset=offset),
        )

    async def get_studio_for_user(self, *, user_id: str, studio_id: str) -> StudioOut:
        memberships = await self.memberships.list_for_user(user_id)
        for membership in memberships:
            if membership.studio.id == studio_id:
                return StudioOut(
                    id=membership.studio.id,
                    name=membership.studio.name,
                    slug=membership.studio.slug,
                )

        raise HTTPException(status_code=404, detail="Studio not found")
