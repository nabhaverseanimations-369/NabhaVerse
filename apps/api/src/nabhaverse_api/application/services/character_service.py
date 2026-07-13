from __future__ import annotations

from typing import cast

from fastapi import HTTPException, status
from nabhaverse_api.application.dto.auth_dto import PaginationOut
from nabhaverse_api.application.dto.character_dto import (
    CharacterOut,
    CharacterPageOut,
    CharacterRelationshipOut,
    CharacterRelationshipPageOut,
    CharacterStatus,
    CharacterVersionOut,
    CharacterVersionPageOut,
    CreateCharacterIn,
    CreateCharacterRelationshipIn,
    CreateCharacterVersionIn,
    RelationshipType,
    UpdateCharacterIn,
)
from nabhaverse_api.domain.auth.permissions import Permission, Role, has_permission
from nabhaverse_api.domain.characters.services import CharacterDomainService
from nabhaverse_api.infrastructure.database.models import (
    CharacterModel,
    CharacterVersionModel,
    MembershipModel,
)
from nabhaverse_api.infrastructure.database.repositories import (
    CharacterRelationshipRepository,
    CharacterRepository,
    CharacterTagRepository,
    CharacterVersionRepository,
    MembershipRepository,
    UserRepository,
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.exc import StaleDataError


class CharacterService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.domain = CharacterDomainService()
        self.memberships = MembershipRepository(session)
        self.users = UserRepository(session)
        self.characters = CharacterRepository(session)
        self.tags = CharacterTagRepository(session)
        self.versions = CharacterVersionRepository(session)
        self.relationships = CharacterRelationshipRepository(session)

    async def _membership(self, *, actor_user_id: str, studio_id: str) -> MembershipModel:
        membership = await self.memberships.get_by_user_and_studio(
            user_id=actor_user_id,
            studio_id=studio_id,
        )
        if membership is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Membership not found"
            )
        return membership

    async def _require_permission(
        self,
        *,
        actor_user_id: str,
        studio_id: str,
        permission: Permission,
    ) -> None:
        membership = await self._membership(actor_user_id=actor_user_id, studio_id=studio_id)
        role = Role(membership.role.name)
        if not has_permission(role, permission):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Missing permission")

    async def _get_character(self, *, studio_id: str, character_id: str) -> CharacterModel:
        character = await self.characters.get_by_id(studio_id=studio_id, character_id=character_id)
        if character is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found")
        return character

    def _character_to_dto(self, character: CharacterModel) -> CharacterOut:
        active_version = next(
            (
                version
                for version in character.versions
                if version.id == character.active_version_id
            ),
            None,
        )
        if active_version is None:
            active_version = next(
                (version for version in character.versions if version.is_active), None
            )
        version_label = active_version.label if active_version is not None else "v1.0"

        owner_name = (
            character.owner.full_name or character.owner.email or character.owner.clerk_user_id
        )
        tag_values = sorted(
            [tag.tag for tag in character.tags if tag.deleted_at is None],
        )

        return CharacterOut(
            id=character.id,
            slug=character.slug,
            name=character.name,
            avatarUrl=character.avatar_url,
            status=cast(CharacterStatus, character.status),
            owner=owner_name,
            studio=character.studio.name,
            tags=tag_values,
            favorite=character.is_favorite,
            recentlyOpenedAt=(
                character.recently_opened_at.isoformat() if character.recently_opened_at else None
            ),
            updatedAt=character.updated_at.isoformat(),
            version=version_label,
            summary=character.summary,
            lockVersion=character.lock_version,
        )

    def _version_to_dto(self, version: CharacterVersionModel) -> CharacterVersionOut:
        author_name = (
            version.author.full_name or version.author.email or version.author.clerk_user_id
        )
        return CharacterVersionOut(
            id=version.id,
            characterId=version.character_id,
            label=version.label,
            createdAt=version.created_at.isoformat(),
            author=author_name,
            summary=version.summary,
            active=version.is_active,
        )

    async def list_characters(
        self,
        *,
        actor_user_id: str,
        studio_id: str,
        query: str | None,
        tags: list[str],
        status_filters: list[str],
        owner_user_id: str | None,
        limit: int,
        offset: int,
    ) -> CharacterPageOut:
        await self._require_permission(
            actor_user_id=actor_user_id,
            studio_id=studio_id,
            permission=Permission.VIEW_CONTENT,
        )

        filters = self.domain.normalize_filters(
            query=query,
            tags=tags,
            status=status_filters,
            owner_user_id=owner_user_id,
        )
        items = await self.characters.list_for_studio(
            studio_id=studio_id,
            query=filters.query,
            tags=filters.tags,
            status=filters.status,
            owner_user_id=filters.owner_user_id,
            limit=limit,
            offset=offset,
        )
        total = await self.characters.count_for_studio(
            studio_id=studio_id,
            query=filters.query,
            tags=filters.tags,
            status=filters.status,
            owner_user_id=filters.owner_user_id,
        )
        return CharacterPageOut(
            items=[self._character_to_dto(item) for item in items],
            pagination=PaginationOut(total=total, limit=limit, offset=offset),
        )

    async def create_character(
        self,
        *,
        actor_user_id: str,
        studio_id: str,
        payload: CreateCharacterIn,
    ) -> CharacterOut:
        await self._require_permission(
            actor_user_id=actor_user_id,
            studio_id=studio_id,
            permission=Permission.MANAGE_CHARACTERS,
        )

        owner_user_id = payload.owner_user_id or actor_user_id
        owner = await self.users.get_by_id(owner_user_id)
        if owner is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Owner not found")

        status_value = self.domain.validate_status(payload.status)
        tags = self.domain.normalize_tags(payload.tags)

        base_slug = self.domain.slugify(payload.name)
        slug = base_slug
        collision_index = 1
        while await self.characters.get_by_slug(studio_id=studio_id, slug=slug) is not None:
            collision_index += 1
            slug = f"{base_slug}-{collision_index}"

        character = await self.characters.create(
            studio_id=studio_id,
            owner_user_id=owner_user_id,
            slug=slug,
            name=payload.name,
            status=status_value,
            summary=payload.summary,
            avatar_url=payload.avatar_url,
            is_favorite=payload.favorite,
        )
        await self.tags.replace_tags(character_id=character.id, tags=tags)

        version_label = self.domain.validate_version_label(payload.initial_version_label)
        version = await self.versions.create(
            character_id=character.id,
            author_user_id=actor_user_id,
            label=version_label,
            summary="Initial version",
            snapshot={"source": "character:create"},
            is_active=True,
        )
        await self.characters.set_active_version(character, version.id)

        await self.session.commit()

        created = await self._get_character(studio_id=studio_id, character_id=character.id)
        return self._character_to_dto(created)

    async def get_character(
        self,
        *,
        actor_user_id: str,
        studio_id: str,
        character_id: str,
    ) -> CharacterOut:
        await self._require_permission(
            actor_user_id=actor_user_id,
            studio_id=studio_id,
            permission=Permission.VIEW_CONTENT,
        )
        character = await self._get_character(studio_id=studio_id, character_id=character_id)
        return self._character_to_dto(character)

    async def update_character(
        self,
        *,
        actor_user_id: str,
        studio_id: str,
        character_id: str,
        payload: UpdateCharacterIn,
    ) -> CharacterOut:
        await self._require_permission(
            actor_user_id=actor_user_id,
            studio_id=studio_id,
            permission=Permission.MANAGE_CHARACTERS,
        )
        character = await self._get_character(studio_id=studio_id, character_id=character_id)

        if payload.lock_version != character.lock_version:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Character version conflict"
            )

        owner_user_id = payload.owner_user_id or character.owner_user_id
        owner = await self.users.get_by_id(owner_user_id)
        if owner is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Owner not found")

        status_value = self.domain.validate_status(payload.status or character.status)

        try:
            await self.characters.update(
                character,
                name=payload.name or character.name,
                status=status_value,
                summary=payload.summary if payload.summary is not None else character.summary,
                avatar_url=(
                    payload.avatar_url if payload.avatar_url is not None else character.avatar_url
                ),
                is_favorite=(
                    payload.favorite if payload.favorite is not None else character.is_favorite
                ),
                owner_user_id=owner_user_id,
            )
            if payload.tags is not None:
                normalized_tags = self.domain.normalize_tags(payload.tags)
                await self.tags.replace_tags(character_id=character.id, tags=normalized_tags)
            await self.session.commit()
        except StaleDataError as exc:
            await self.session.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Character version conflict",
            ) from exc

        updated = await self._get_character(studio_id=studio_id, character_id=character_id)
        return self._character_to_dto(updated)

    async def delete_character(
        self,
        *,
        actor_user_id: str,
        studio_id: str,
        character_id: str,
    ) -> None:
        await self._require_permission(
            actor_user_id=actor_user_id,
            studio_id=studio_id,
            permission=Permission.MANAGE_CHARACTERS,
        )
        character = await self._get_character(studio_id=studio_id, character_id=character_id)
        await self.characters.soft_delete(character)
        await self.session.commit()

    async def list_versions(
        self,
        *,
        actor_user_id: str,
        studio_id: str,
        character_id: str,
        limit: int,
        offset: int,
    ) -> CharacterVersionPageOut:
        await self._require_permission(
            actor_user_id=actor_user_id,
            studio_id=studio_id,
            permission=Permission.VIEW_CONTENT,
        )
        character = await self._get_character(studio_id=studio_id, character_id=character_id)
        items = await self.versions.list_for_character(
            character_id=character.id,
            limit=limit,
            offset=offset,
        )
        total = await self.versions.count_for_character(character.id)
        return CharacterVersionPageOut(
            items=[self._version_to_dto(item) for item in items],
            pagination=PaginationOut(total=total, limit=limit, offset=offset),
        )

    async def create_version(
        self,
        *,
        actor_user_id: str,
        studio_id: str,
        character_id: str,
        payload: CreateCharacterVersionIn,
    ) -> CharacterVersionOut:
        await self._require_permission(
            actor_user_id=actor_user_id,
            studio_id=studio_id,
            permission=Permission.MANAGE_CHARACTERS,
        )
        character = await self._get_character(studio_id=studio_id, character_id=character_id)

        label = self.domain.validate_version_label(payload.label)
        if payload.active:
            await self.versions.deactivate_active_for_character(character.id)

        version = await self.versions.create(
            character_id=character.id,
            author_user_id=actor_user_id,
            label=label,
            summary=payload.summary,
            snapshot=payload.snapshot,
            is_active=payload.active,
        )
        if payload.active:
            await self.characters.set_active_version(character, version.id)

        await self.session.commit()
        versions = await self.versions.list_for_character(
            character_id=character.id, limit=1, offset=0
        )
        return self._version_to_dto(versions[0])

    async def list_relationships(
        self,
        *,
        actor_user_id: str,
        studio_id: str,
        character_id: str,
        limit: int,
        offset: int,
    ) -> CharacterRelationshipPageOut:
        await self._require_permission(
            actor_user_id=actor_user_id,
            studio_id=studio_id,
            permission=Permission.VIEW_CONTENT,
        )
        character = await self._get_character(studio_id=studio_id, character_id=character_id)
        items = await self.relationships.list_for_character(
            character_id=character.id,
            limit=limit,
            offset=offset,
        )
        total = await self.relationships.count_for_character(character.id)

        return CharacterRelationshipPageOut(
            items=[
                CharacterRelationshipOut(
                    id=item.id,
                    characterId=item.character_id,
                    relatedCharacterId=item.related_character_id,
                    relatedName=item.related_character.name,
                    relationshipType=cast(RelationshipType, item.relationship_type),
                    notes=item.notes,
                )
                for item in items
            ],
            pagination=PaginationOut(total=total, limit=limit, offset=offset),
        )

    async def create_relationship(
        self,
        *,
        actor_user_id: str,
        studio_id: str,
        character_id: str,
        payload: CreateCharacterRelationshipIn,
    ) -> CharacterRelationshipOut:
        await self._require_permission(
            actor_user_id=actor_user_id,
            studio_id=studio_id,
            permission=Permission.MANAGE_CHARACTERS,
        )

        character = await self._get_character(studio_id=studio_id, character_id=character_id)
        self.domain.validate_relationship_pair(
            character_id=character.id,
            related_character_id=payload.related_character_id,
        )
        relationship_type = self.domain.validate_relationship_type(payload.relationship_type)

        related = await self._get_character(
            studio_id=studio_id,
            character_id=payload.related_character_id,
        )

        existing = await self.relationships.get_by_pair(
            character_id=character.id,
            related_character_id=related.id,
            relationship_type=relationship_type,
        )
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Relationship already exists",
            )

        created = await self.relationships.create(
            character_id=character.id,
            related_character_id=related.id,
            relationship_type=relationship_type,
            notes=payload.notes,
            created_by_user_id=actor_user_id,
        )
        await self.session.commit()

        rows = await self.relationships.list_for_character(
            character_id=character.id, limit=1, offset=0
        )
        row = rows[0] if rows else created
        related_name = (
            row.related_character.name if getattr(row, "related_character", None) else related.name
        )

        return CharacterRelationshipOut(
            id=row.id,
            characterId=row.character_id,
            relatedCharacterId=row.related_character_id,
            relatedName=related_name,
            relationshipType=cast(RelationshipType, row.relationship_type),
            notes=row.notes,
        )
