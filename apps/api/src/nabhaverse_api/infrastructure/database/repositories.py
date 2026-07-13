from __future__ import annotations

from typing import cast

from nabhaverse_api.domain.auth.permissions import Permission, Role
from nabhaverse_api.infrastructure.database.models import (
    MembershipModel,
    PermissionModel,
    RoleModel,
    RolePermissionModel,
    StudioModel,
    UserModel,
)
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload


class UserRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_clerk_user_id(self, clerk_user_id: str) -> UserModel | None:
        statement = select(UserModel).where(UserModel.clerk_user_id == clerk_user_id)
        return cast(UserModel | None, await self.session.scalar(statement))

    async def get_by_id(self, user_id: str) -> UserModel | None:
        statement = select(UserModel).where(UserModel.id == user_id, UserModel.deleted_at.is_(None))
        return cast(UserModel | None, await self.session.scalar(statement))

    async def get_by_email(self, email: str) -> UserModel | None:
        statement = select(UserModel).where(
            UserModel.email == email,
            UserModel.deleted_at.is_(None),
        )
        return cast(UserModel | None, await self.session.scalar(statement))

    async def create(
        self,
        *,
        clerk_user_id: str,
        email: str | None,
        full_name: str | None,
        avatar_url: str | None,
    ) -> UserModel:
        user = UserModel(
            clerk_user_id=clerk_user_id,
            email=email,
            full_name=full_name,
            avatar_url=avatar_url,
            preferences={},
        )
        self.session.add(user)
        await self.session.flush()
        return user

    async def update_preferences(
        self,
        user: UserModel,
        preferences: dict[str, object],
    ) -> UserModel:
        user.preferences = preferences
        await self.session.flush()
        return user


class RoleRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_name(self, role: Role) -> RoleModel | None:
        statement = select(RoleModel).where(RoleModel.name == role.value)
        return cast(RoleModel | None, await self.session.scalar(statement))

    async def get_by_id(self, role_id: str) -> RoleModel | None:
        statement = select(RoleModel).where(RoleModel.id == role_id)
        return cast(RoleModel | None, await self.session.scalar(statement))

    async def permissions_for_role(self, role_id: str) -> list[Permission]:
        statement = (
            select(PermissionModel)
            .join(RolePermissionModel, RolePermissionModel.permission_id == PermissionModel.id)
            .where(RolePermissionModel.role_id == role_id)
        )
        permission_rows = await self.session.scalars(statement)
        return [Permission(row.name) for row in permission_rows.all()]


class StudioRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_slug(self, slug: str) -> StudioModel | None:
        statement = select(StudioModel).where(
            StudioModel.slug == slug,
            StudioModel.deleted_at.is_(None),
        )
        return cast(StudioModel | None, await self.session.scalar(statement))

    async def get_by_id(self, studio_id: str) -> StudioModel | None:
        statement = select(StudioModel).where(
            StudioModel.id == studio_id,
            StudioModel.deleted_at.is_(None),
        )
        return cast(StudioModel | None, await self.session.scalar(statement))

    async def create(self, *, name: str, slug: str) -> StudioModel:
        studio = StudioModel(name=name, slug=slug)
        self.session.add(studio)
        await self.session.flush()
        return studio


class MembershipRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, *, user_id: str, studio_id: str, role_id: str) -> MembershipModel:
        membership = MembershipModel(user_id=user_id, studio_id=studio_id, role_id=role_id)
        self.session.add(membership)
        await self.session.flush()
        return membership

    async def get_by_id(self, membership_id: str) -> MembershipModel | None:
        statement = (
            select(MembershipModel)
            .execution_options(populate_existing=True)
            .options(
                selectinload(MembershipModel.studio),
                selectinload(MembershipModel.role),
            )
            .where(MembershipModel.id == membership_id, MembershipModel.deleted_at.is_(None))
        )
        return cast(MembershipModel | None, await self.session.scalar(statement))

    async def get_by_user_and_studio(
        self,
        *,
        user_id: str,
        studio_id: str,
    ) -> MembershipModel | None:
        statement = (
            select(MembershipModel)
            .options(
                selectinload(MembershipModel.studio),
                selectinload(MembershipModel.role),
            )
            .where(
                MembershipModel.user_id == user_id,
                MembershipModel.studio_id == studio_id,
                MembershipModel.deleted_at.is_(None),
            )
        )
        return cast(MembershipModel | None, await self.session.scalar(statement))

    async def list_for_user(self, user_id: str) -> list[MembershipModel]:
        statement = (
            select(MembershipModel)
            .options(
                selectinload(MembershipModel.studio),
                selectinload(MembershipModel.role),
            )
            .join(MembershipModel.studio)
            .join(MembershipModel.role)
            .where(MembershipModel.user_id == user_id, MembershipModel.deleted_at.is_(None))
        )
        memberships = await self.session.scalars(statement)
        return list(memberships.all())

    async def list_for_studio(
        self,
        *,
        studio_id: str,
        limit: int,
        offset: int,
    ) -> list[MembershipModel]:
        statement = (
            select(MembershipModel)
            .options(
                selectinload(MembershipModel.studio),
                selectinload(MembershipModel.role),
            )
            .where(MembershipModel.studio_id == studio_id, MembershipModel.deleted_at.is_(None))
            .order_by(MembershipModel.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        memberships = await self.session.scalars(statement)
        return list(memberships.all())

    async def count_for_studio(self, *, studio_id: str) -> int:
        statement = select(MembershipModel).where(
            MembershipModel.studio_id == studio_id,
            MembershipModel.deleted_at.is_(None),
        )
        memberships = await self.session.scalars(statement)
        return len(memberships.all())

    async def update_role(self, membership: MembershipModel, role_id: str) -> MembershipModel:
        membership.role_id = role_id
        await self.session.flush()
        await self.session.refresh(membership)
        return membership
