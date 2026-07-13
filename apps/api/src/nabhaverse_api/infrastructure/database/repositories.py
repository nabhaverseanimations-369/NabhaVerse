from __future__ import annotations

from datetime import UTC, datetime
from typing import cast

from nabhaverse_api.domain.auth.permissions import Permission, Role
from nabhaverse_api.infrastructure.database.models import (
    CharacterModel,
    CharacterRelationshipModel,
    CharacterTagModel,
    CharacterVersionModel,
    MembershipModel,
    PermissionModel,
    RoleModel,
    RolePermissionModel,
    StudioModel,
    UserModel,
)
from sqlalchemy import delete, exists, func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.sql.elements import ColumnElement


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


class CharacterRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(
        self,
        *,
        studio_id: str,
        owner_user_id: str,
        slug: str,
        name: str,
        status: str,
        summary: str,
        avatar_url: str | None,
        is_favorite: bool,
    ) -> CharacterModel:
        character = CharacterModel(
            studio_id=studio_id,
            owner_user_id=owner_user_id,
            slug=slug,
            name=name,
            status=status,
            summary=summary,
            avatar_url=avatar_url,
            is_favorite=is_favorite,
        )
        self.session.add(character)
        await self.session.flush()
        return character

    async def get_by_id(self, *, studio_id: str, character_id: str) -> CharacterModel | None:
        statement = (
            select(CharacterModel)
            .options(
                selectinload(CharacterModel.owner),
                selectinload(CharacterModel.studio),
                selectinload(CharacterModel.tags),
                selectinload(CharacterModel.versions),
            )
            .where(
                CharacterModel.id == character_id,
                CharacterModel.studio_id == studio_id,
                CharacterModel.deleted_at.is_(None),
            )
        )
        return cast(CharacterModel | None, await self.session.scalar(statement))

    async def get_by_slug(self, *, studio_id: str, slug: str) -> CharacterModel | None:
        statement = select(CharacterModel).where(
            CharacterModel.studio_id == studio_id,
            CharacterModel.slug == slug,
            CharacterModel.deleted_at.is_(None),
        )
        return cast(CharacterModel | None, await self.session.scalar(statement))

    def _filters(
        self,
        *,
        studio_id: str,
        query: str | None,
        tags: list[str],
        status: list[str],
        owner_user_id: str | None,
    ) -> list[ColumnElement[bool]]:
        filters: list[ColumnElement[bool]] = [
            CharacterModel.studio_id == studio_id,
            CharacterModel.deleted_at.is_(None),
        ]
        if status:
            filters.append(CharacterModel.status.in_(status))
        if owner_user_id:
            filters.append(CharacterModel.owner_user_id == owner_user_id)
        if query:
            q = f"%{query.strip().lower()}%"
            tag_match = exists(
                select(CharacterTagModel.id).where(
                    CharacterTagModel.character_id == CharacterModel.id,
                    CharacterTagModel.deleted_at.is_(None),
                    func.lower(CharacterTagModel.tag).like(q),
                )
            )
            owner_match = exists(
                select(UserModel.id).where(
                    UserModel.id == CharacterModel.owner_user_id,
                    UserModel.deleted_at.is_(None),
                    or_(
                        func.lower(UserModel.full_name).like(q),
                        func.lower(UserModel.email).like(q),
                    ),
                )
            )
            filters.append(
                or_(
                    func.lower(CharacterModel.name).like(q),
                    func.lower(CharacterModel.summary).like(q),
                    tag_match,
                    owner_match,
                )
            )
        for tag in tags:
            normalized = tag.strip().lower()
            if not normalized:
                continue
            filters.append(
                exists(
                    select(CharacterTagModel.id).where(
                        CharacterTagModel.character_id == CharacterModel.id,
                        CharacterTagModel.deleted_at.is_(None),
                        func.lower(CharacterTagModel.tag) == normalized,
                    )
                )
            )
        return filters

    async def list_for_studio(
        self,
        *,
        studio_id: str,
        query: str | None,
        tags: list[str],
        status: list[str],
        owner_user_id: str | None,
        limit: int,
        offset: int,
    ) -> list[CharacterModel]:
        statement = (
            select(CharacterModel)
            .options(
                selectinload(CharacterModel.owner),
                selectinload(CharacterModel.studio),
                selectinload(CharacterModel.tags),
                selectinload(CharacterModel.versions),
            )
            .where(
                *self._filters(
                    studio_id=studio_id,
                    query=query,
                    tags=tags,
                    status=status,
                    owner_user_id=owner_user_id,
                )
            )
            .order_by(CharacterModel.updated_at.desc())
            .limit(limit)
            .offset(offset)
        )
        rows = await self.session.scalars(statement)
        return list(rows.all())

    async def count_for_studio(
        self,
        *,
        studio_id: str,
        query: str | None,
        tags: list[str],
        status: list[str],
        owner_user_id: str | None,
    ) -> int:
        statement = select(func.count(CharacterModel.id)).where(
            *self._filters(
                studio_id=studio_id,
                query=query,
                tags=tags,
                status=status,
                owner_user_id=owner_user_id,
            )
        )
        count = await self.session.scalar(statement)
        return int(count or 0)

    async def update(
        self,
        character: CharacterModel,
        *,
        name: str,
        status: str,
        summary: str,
        avatar_url: str | None,
        is_favorite: bool,
        owner_user_id: str,
    ) -> CharacterModel:
        character.name = name
        character.status = status
        character.summary = summary
        character.avatar_url = avatar_url
        character.is_favorite = is_favorite
        character.owner_user_id = owner_user_id
        await self.session.flush()
        return character

    async def set_active_version(
        self, character: CharacterModel, version_id: str
    ) -> CharacterModel:
        character.active_version_id = version_id
        await self.session.flush()
        return character

    async def soft_delete(self, character: CharacterModel) -> CharacterModel:
        character.deleted_at = datetime.now(UTC)
        await self.session.flush()
        return character


class CharacterTagRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_for_character(self, character_id: str) -> list[CharacterTagModel]:
        statement = (
            select(CharacterTagModel)
            .where(
                CharacterTagModel.character_id == character_id,
                CharacterTagModel.deleted_at.is_(None),
            )
            .order_by(CharacterTagModel.tag.asc())
        )
        tags = await self.session.scalars(statement)
        return list(tags.all())

    async def replace_tags(self, *, character_id: str, tags: list[str]) -> list[CharacterTagModel]:
        existing = await self.list_for_character(character_id)
        existing_map = {row.tag.lower(): row for row in existing}
        target = {tag.strip().lower(): tag.strip() for tag in tags if tag.strip()}

        now = datetime.now(UTC)
        for row in existing:
            if row.tag.lower() not in target:
                row.deleted_at = now

        for key, value in target.items():
            if key in existing_map and existing_map[key].deleted_at is None:
                continue
            self.session.add(CharacterTagModel(character_id=character_id, tag=value))

        await self.session.flush()
        return await self.list_for_character(character_id)

    async def delete_for_character(self, character_id: str) -> None:
        await self.session.execute(
            delete(CharacterTagModel).where(CharacterTagModel.character_id == character_id)
        )
        await self.session.flush()


class CharacterVersionRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(
        self,
        *,
        character_id: str,
        author_user_id: str,
        label: str,
        summary: str,
        snapshot: dict[str, object],
        is_active: bool,
    ) -> CharacterVersionModel:
        version = CharacterVersionModel(
            character_id=character_id,
            author_user_id=author_user_id,
            label=label,
            summary=summary,
            snapshot=snapshot,
            is_active=is_active,
        )
        self.session.add(version)
        await self.session.flush()
        return version

    async def list_for_character(
        self,
        *,
        character_id: str,
        limit: int,
        offset: int,
    ) -> list[CharacterVersionModel]:
        statement = (
            select(CharacterVersionModel)
            .options(selectinload(CharacterVersionModel.author))
            .where(
                CharacterVersionModel.character_id == character_id,
                CharacterVersionModel.deleted_at.is_(None),
            )
            .order_by(CharacterVersionModel.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        versions = await self.session.scalars(statement)
        return list(versions.all())

    async def get_active_for_character(self, character_id: str) -> CharacterVersionModel | None:
        statement = (
            select(CharacterVersionModel)
            .where(
                CharacterVersionModel.character_id == character_id,
                CharacterVersionModel.is_active.is_(True),
                CharacterVersionModel.deleted_at.is_(None),
            )
            .order_by(CharacterVersionModel.created_at.desc())
        )
        return cast(CharacterVersionModel | None, await self.session.scalar(statement))

    async def count_for_character(self, character_id: str) -> int:
        statement = select(func.count(CharacterVersionModel.id)).where(
            CharacterVersionModel.character_id == character_id,
            CharacterVersionModel.deleted_at.is_(None),
        )
        count = await self.session.scalar(statement)
        return int(count or 0)

    async def deactivate_active_for_character(self, character_id: str) -> None:
        statement = (
            update(CharacterVersionModel)
            .where(
                CharacterVersionModel.character_id == character_id,
                CharacterVersionModel.is_active.is_(True),
                CharacterVersionModel.deleted_at.is_(None),
            )
            .values(is_active=False)
        )
        await self.session.execute(statement)
        await self.session.flush()


class CharacterRelationshipRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(
        self,
        *,
        character_id: str,
        related_character_id: str,
        relationship_type: str,
        notes: str,
        created_by_user_id: str,
    ) -> CharacterRelationshipModel:
        relationship = CharacterRelationshipModel(
            character_id=character_id,
            related_character_id=related_character_id,
            relationship_type=relationship_type,
            notes=notes,
            created_by_user_id=created_by_user_id,
        )
        self.session.add(relationship)
        await self.session.flush()
        return relationship

    async def get_by_pair(
        self,
        *,
        character_id: str,
        related_character_id: str,
        relationship_type: str,
    ) -> CharacterRelationshipModel | None:
        statement = select(CharacterRelationshipModel).where(
            CharacterRelationshipModel.character_id == character_id,
            CharacterRelationshipModel.related_character_id == related_character_id,
            CharacterRelationshipModel.relationship_type == relationship_type,
            CharacterRelationshipModel.deleted_at.is_(None),
        )
        return cast(CharacterRelationshipModel | None, await self.session.scalar(statement))

    async def list_for_character(
        self,
        *,
        character_id: str,
        limit: int,
        offset: int,
    ) -> list[CharacterRelationshipModel]:
        statement = (
            select(CharacterRelationshipModel)
            .options(selectinload(CharacterRelationshipModel.related_character))
            .where(
                CharacterRelationshipModel.character_id == character_id,
                CharacterRelationshipModel.deleted_at.is_(None),
            )
            .order_by(CharacterRelationshipModel.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        relationships = await self.session.scalars(statement)
        return list(relationships.all())

    async def count_for_character(self, character_id: str) -> int:
        statement = select(func.count(CharacterRelationshipModel.id)).where(
            CharacterRelationshipModel.character_id == character_id,
            CharacterRelationshipModel.deleted_at.is_(None),
        )
        count = await self.session.scalar(statement)
        return int(count or 0)
