from __future__ import annotations

from dataclasses import dataclass

from nabhaverse_api.application.dto.auth_dto import MembershipOut, SessionOut, StudioOut, UserOut
from nabhaverse_api.domain.auth.permissions import ROLE_PERMISSIONS, Role
from nabhaverse_api.infrastructure.auth.clerk import AuthIdentity
from nabhaverse_api.infrastructure.database.repositories import (
    MembershipRepository,
    RoleRepository,
    StudioRepository,
    UserRepository,
)
from sqlalchemy.ext.asyncio import AsyncSession


def slugify(value: str) -> str:
    normalized = "".join(char.lower() if char.isalnum() else "-" for char in value)
    slug = "-".join(part for part in normalized.split("-") if part)
    return slug or "studio"


@dataclass(frozen=True)
class AuthContext:
    user_id: str
    clerk_user_id: str


class AuthService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.users = UserRepository(session)
        self.roles = RoleRepository(session)
        self.studios = StudioRepository(session)
        self.memberships = MembershipRepository(session)

    async def ensure_user(self, identity: AuthIdentity) -> AuthContext:
        user = await self.users.get_by_clerk_user_id(identity.clerk_user_id)
        if user is None:
            user = await self.users.create(
                clerk_user_id=identity.clerk_user_id,
                email=identity.email,
                full_name=identity.full_name,
                avatar_url=identity.avatar_url,
            )

        memberships = await self.memberships.list_for_user(user.id)
        if not memberships:
            default_name = f"{user.full_name or 'Creator'} Studio".strip()
            base_slug = slugify(default_name)
            slug = base_slug
            collision_index = 1
            while await self.studios.get_by_slug(slug) is not None:
                collision_index += 1
                slug = f"{base_slug}-{collision_index}"

            studio = await self.studios.create(name=default_name, slug=slug)
            owner_role = await self.roles.get_by_name(Role.OWNER)
            if owner_role is None:
                raise RuntimeError("Owner role has not been initialized")
            await self.memberships.create(
                user_id=user.id,
                studio_id=studio.id,
                role_id=owner_role.id,
            )

        await self.session.commit()
        return AuthContext(user_id=user.id, clerk_user_id=user.clerk_user_id)

    async def current_session(self, identity: AuthIdentity) -> SessionOut:
        context = await self.ensure_user(identity)
        user = await self.users.get_by_id(context.user_id)
        if user is None:
            raise RuntimeError("Authenticated user could not be loaded")

        memberships = await self.memberships.list_for_user(user.id)
        membership_dto = [
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
            for membership in memberships
        ]

        return SessionOut(
            user=UserOut(
                id=user.id,
                clerkUserId=user.clerk_user_id,
                email=user.email,
                fullName=user.full_name,
                avatarUrl=user.avatar_url,
                preferences=user.preferences,
            ),
            memberships=membership_dto,
        )
