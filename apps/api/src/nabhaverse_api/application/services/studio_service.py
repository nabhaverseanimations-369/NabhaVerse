from __future__ import annotations

from fastapi import HTTPException
from nabhaverse_api.application.dto.auth_dto import MembershipOut, StudioOut
from nabhaverse_api.domain.auth.permissions import ROLE_PERMISSIONS, Role
from nabhaverse_api.infrastructure.database.repositories import (
    MembershipRepository,
    RoleRepository,
    StudioRepository,
)
from sqlalchemy.ext.asyncio import AsyncSession


def slugify(value: str) -> str:
    normalized = "".join(char.lower() if char.isalnum() else "-" for char in value)
    slug = "-".join(part for part in normalized.split("-") if part)
    return slug or "studio"


class StudioService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.studios = StudioRepository(session)
        self.memberships = MembershipRepository(session)
        self.roles = RoleRepository(session)

    async def create_studio_for_user(self, user_id: str, name: str) -> StudioOut:
        base_slug = slugify(name)
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

    async def list_memberships_for_user(self, user_id: str) -> list[MembershipOut]:
        memberships = await self.memberships.list_for_user(user_id)
        return [
            MembershipOut(
                id=membership.id,
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
            for membership in memberships
        ]
