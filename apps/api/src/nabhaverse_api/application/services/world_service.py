from __future__ import annotations

from typing import cast

from nabhaverse_api.application.dto.world_dto import (
    CreateWorldIn,
    CreateWorldLocationIn,
    CreateWorldRegionIn,
    CreateWorldVersionIn,
    UpdateWorldIn,
    WorldLocationOut,
    WorldLocationPageOut,
    WorldOut,
    WorldPageOut,
    WorldRegionOut,
    WorldRegionPageOut,
    WorldRelationshipOut,
    WorldRelationshipType,
    WorldStatisticsOut,
    WorldStatus,
    WorldVersionOut,
    WorldVersionPageOut,
)
from nabhaverse_api.application.services.foundation import (
    AccessContext,
    conflict,
    require_entity,
    to_pagination,
)
from nabhaverse_api.domain.auth.permissions import Permission
from nabhaverse_api.domain.shared.locking import validate_lock_version
from nabhaverse_api.domain.worlds.services import WorldDomainService
from nabhaverse_api.infrastructure.database.models import (
    WorldLocationModel,
    WorldModel,
    WorldRegionModel,
    WorldVersionModel,
)
from nabhaverse_api.infrastructure.database.repositories import (
    MembershipRepository,
    UserRepository,
    WorldLocationRepository,
    WorldRegionRepository,
    WorldRelationshipRepository,
    WorldRepository,
    WorldTagRepository,
    WorldVersionRepository,
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.exc import StaleDataError


class WorldService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.domain = WorldDomainService()
        self.memberships = MembershipRepository(session)
        self.users = UserRepository(session)
        self.worlds = WorldRepository(session)
        self.tags = WorldTagRepository(session)
        self.versions = WorldVersionRepository(session)
        self.regions = WorldRegionRepository(session)
        self.locations = WorldLocationRepository(session)
        self.relationships = WorldRelationshipRepository(session)
        self.access = AccessContext(self.memberships, self.users)

    async def _require_permission_for_world(
        self,
        *,
        actor_user_id: str,
        world: WorldModel,
        permission: Permission,
    ) -> None:
        await self.access.require_permission(
            actor_user_id=actor_user_id,
            studio_id=world.studio_id,
            permission=permission,
        )

    async def _get_world(self, world_id: str) -> WorldModel:
        world = await self.worlds.get_by_id(world_id)
        return require_entity(world, detail="World not found")

    def _world_to_dto(self, world: WorldModel) -> WorldOut:
        active_version = next(
            (version for version in world.versions if version.id == world.active_version_id),
            None,
        )
        if active_version is None:
            active_version = next(
                (version for version in world.versions if version.is_active),
                None,
            )

        version_label = active_version.label if active_version is not None else "v1.0"
        tags = sorted([tag.tag for tag in world.tags if tag.deleted_at is None])
        region_count = len([region for region in world.regions if region.deleted_at is None])
        location_count = len(
            [location for location in world.locations if location.deleted_at is None]
        )

        return WorldOut(
            id=world.id,
            slug=world.slug,
            name=world.name,
            coverImageUrl=world.cover_image_url,
            description=world.description,
            status=cast(WorldStatus, world.status),
            studio=world.studio.name,
            tags=tags,
            favorite=world.is_favorite,
            recentlyOpenedAt=(
                world.recently_opened_at.isoformat()
                if world.recently_opened_at is not None
                else None
            ),
            updatedAt=world.updated_at.isoformat(),
            version=version_label,
            timelineSummary=world.timeline_summary,
            statistics=WorldStatisticsOut(regions=region_count, locations=location_count),
            lockVersion=world.lock_version,
        )

    def _version_to_dto(self, version: WorldVersionModel) -> WorldVersionOut:
        author_name = (
            version.author.full_name or version.author.email or version.author.clerk_user_id
        )
        return WorldVersionOut(
            id=version.id,
            worldId=version.world_id,
            label=version.label,
            createdAt=version.created_at.isoformat(),
            author=author_name,
            summary=version.summary,
            active=version.is_active,
        )

    def _region_to_dto(self, region: WorldRegionModel) -> WorldRegionOut:
        return WorldRegionOut(
            id=region.id,
            worldId=region.world_id,
            parentRegionId=region.parent_region_id,
            name=region.name,
            slug=region.slug,
            kind=region.kind,
            summary=region.summary,
        )

    def _location_to_dto(self, location: WorldLocationModel) -> WorldLocationOut:
        return WorldLocationOut(
            id=location.id,
            worldId=location.world_id,
            regionId=location.region_id,
            name=location.name,
            slug=location.slug,
            locationType=location.location_type,
            summary=location.summary,
        )

    async def list_worlds(
        self,
        *,
        actor_user_id: str,
        studio_id: str,
        query: str | None,
        tags: list[str],
        status_filters: list[str],
        region_id: str | None,
        location_id: str | None,
        limit: int,
        offset: int,
    ) -> WorldPageOut:
        await self.access.require_permission(
            actor_user_id=actor_user_id,
            studio_id=studio_id,
            permission=Permission.VIEW_CONTENT,
        )
        filters = self.domain.normalize_filters(
            query=query,
            tags=tags,
            status=status_filters,
            region_id=region_id,
            location_id=location_id,
        )
        worlds = await self.worlds.list_for_studio(
            studio_id=studio_id,
            query=filters.query,
            tags=filters.tags,
            status=filters.status,
            region_id=filters.region_id,
            location_id=filters.location_id,
            limit=limit,
            offset=offset,
        )
        total = await self.worlds.count_for_studio(
            studio_id=studio_id,
            query=filters.query,
            tags=filters.tags,
            status=filters.status,
            region_id=filters.region_id,
            location_id=filters.location_id,
        )
        return WorldPageOut(
            items=[self._world_to_dto(item) for item in worlds],
            pagination=to_pagination(total=total, limit=limit, offset=offset),
        )

    async def create_world(
        self,
        *,
        actor_user_id: str,
        studio_id: str,
        payload: CreateWorldIn,
    ) -> WorldOut:
        await self.access.require_permission(
            actor_user_id=actor_user_id,
            studio_id=studio_id,
            permission=Permission.MANAGE_CHARACTERS,
        )

        base_slug = self.domain.slugify(payload.name)
        slug = base_slug
        collision_index = 1
        while await self.worlds.get_by_slug(studio_id=studio_id, slug=slug) is not None:
            collision_index += 1
            slug = f"{base_slug}-{collision_index}"

        world = await self.worlds.create(
            studio_id=studio_id,
            owner_user_id=actor_user_id,
            slug=slug,
            name=payload.name,
            status=self.domain.validate_status(payload.status),
            description=payload.description,
            cover_image_url=payload.cover_image_url,
            timeline_summary=self.domain.validate_timeline_summary(payload.timeline_summary),
            is_favorite=payload.favorite,
        )
        await self.tags.replace_tags(
            world_id=world.id,
            tags=self.domain.normalize_tags(payload.tags),
        )

        version = await self.versions.create(
            world_id=world.id,
            author_user_id=actor_user_id,
            label=self.domain.validate_version_label(payload.initial_version_label),
            summary="Initial version",
            snapshot={"source": "world:create"},
            is_active=True,
        )
        await self.worlds.set_active_version(world, version.id)
        await self.session.commit()

        created = await self._get_world(world.id)
        return self._world_to_dto(created)

    async def get_world(self, *, actor_user_id: str, world_id: str) -> WorldOut:
        world = await self._get_world(world_id)
        await self._require_permission_for_world(
            actor_user_id=actor_user_id,
            world=world,
            permission=Permission.VIEW_CONTENT,
        )
        return self._world_to_dto(world)

    async def update_world(
        self,
        *,
        actor_user_id: str,
        world_id: str,
        payload: UpdateWorldIn,
    ) -> WorldOut:
        world = await self._get_world(world_id)
        await self._require_permission_for_world(
            actor_user_id=actor_user_id,
            world=world,
            permission=Permission.MANAGE_CHARACTERS,
        )

        try:
            validate_lock_version(
                expected=payload.lock_version,
                actual=world.lock_version,
                entity_name="World",
            )
        except ValueError as exc:
            raise conflict("World version conflict") from exc

        try:
            await self.worlds.update(
                world,
                name=payload.name or world.name,
                status=self.domain.validate_status(payload.status or world.status),
                description=(
                    payload.description if payload.description is not None else world.description
                ),
                cover_image_url=(
                    payload.cover_image_url
                    if payload.cover_image_url is not None
                    else world.cover_image_url
                ),
                timeline_summary=self.domain.validate_timeline_summary(
                    payload.timeline_summary
                    if payload.timeline_summary is not None
                    else world.timeline_summary
                ),
                is_favorite=payload.favorite if payload.favorite is not None else world.is_favorite,
            )
            if payload.tags is not None:
                await self.tags.replace_tags(
                    world_id=world.id,
                    tags=self.domain.normalize_tags(payload.tags),
                )
            await self.session.commit()
        except StaleDataError as exc:
            await self.session.rollback()
            raise conflict("World version conflict") from exc

        updated = await self._get_world(world.id)
        return self._world_to_dto(updated)

    async def delete_world(self, *, actor_user_id: str, world_id: str) -> None:
        world = await self._get_world(world_id)
        await self._require_permission_for_world(
            actor_user_id=actor_user_id,
            world=world,
            permission=Permission.MANAGE_CHARACTERS,
        )
        await self.worlds.soft_delete(world)
        await self.session.commit()

    async def list_versions(
        self,
        *,
        actor_user_id: str,
        world_id: str,
        limit: int,
        offset: int,
    ) -> WorldVersionPageOut:
        world = await self._get_world(world_id)
        await self._require_permission_for_world(
            actor_user_id=actor_user_id,
            world=world,
            permission=Permission.VIEW_CONTENT,
        )
        items = await self.versions.list_for_world(world_id=world.id, limit=limit, offset=offset)
        total = await self.versions.count_for_world(world.id)
        return WorldVersionPageOut(
            items=[self._version_to_dto(item) for item in items],
            pagination=to_pagination(total=total, limit=limit, offset=offset),
        )

    async def create_version(
        self,
        *,
        actor_user_id: str,
        world_id: str,
        payload: CreateWorldVersionIn,
    ) -> WorldVersionOut:
        world = await self._get_world(world_id)
        await self._require_permission_for_world(
            actor_user_id=actor_user_id,
            world=world,
            permission=Permission.MANAGE_CHARACTERS,
        )

        if payload.active:
            await self.versions.deactivate_active_for_world(world.id)

        version = await self.versions.create(
            world_id=world.id,
            author_user_id=actor_user_id,
            label=self.domain.validate_version_label(payload.label),
            summary=payload.summary,
            snapshot=payload.snapshot,
            is_active=payload.active,
        )
        if payload.active:
            await self.worlds.set_active_version(world, version.id)

        await self.session.commit()
        versions = await self.versions.list_for_world(world_id=world.id, limit=1, offset=0)
        return self._version_to_dto(versions[0])

    async def list_regions(
        self,
        *,
        actor_user_id: str,
        world_id: str,
        limit: int,
        offset: int,
    ) -> WorldRegionPageOut:
        world = await self._get_world(world_id)
        await self._require_permission_for_world(
            actor_user_id=actor_user_id,
            world=world,
            permission=Permission.VIEW_CONTENT,
        )
        rows = await self.regions.list_for_world(world_id=world.id, limit=limit, offset=offset)
        total = await self.regions.count_for_world(world.id)
        return WorldRegionPageOut(
            items=[self._region_to_dto(item) for item in rows],
            pagination=to_pagination(total=total, limit=limit, offset=offset),
        )

    async def create_region(
        self,
        *,
        actor_user_id: str,
        world_id: str,
        payload: CreateWorldRegionIn,
    ) -> WorldRegionOut:
        world = await self._get_world(world_id)
        await self._require_permission_for_world(
            actor_user_id=actor_user_id,
            world=world,
            permission=Permission.MANAGE_CHARACTERS,
        )

        parent_world_id: str | None = None
        if payload.parent_region_id is not None:
            parent_region = await self.regions.get_by_id(payload.parent_region_id)
            parent = require_entity(parent_region, detail="Parent region not found")
            parent_world_id = parent.world_id
            self.domain.validate_region_parent(world_id=world.id, parent_world_id=parent_world_id)

        base_slug = self.domain.slugify(payload.name)
        slug = base_slug
        collision_index = 1
        while await self.regions.get_by_slug(world_id=world.id, slug=slug) is not None:
            collision_index += 1
            slug = f"{base_slug}-{collision_index}"

        region = await self.regions.create(
            world_id=world.id,
            parent_region_id=payload.parent_region_id,
            slug=slug,
            name=payload.name,
            kind=payload.kind,
            summary=payload.summary,
        )
        await self.session.commit()
        return self._region_to_dto(region)

    async def list_locations(
        self,
        *,
        actor_user_id: str,
        world_id: str,
        limit: int,
        offset: int,
    ) -> WorldLocationPageOut:
        world = await self._get_world(world_id)
        await self._require_permission_for_world(
            actor_user_id=actor_user_id,
            world=world,
            permission=Permission.VIEW_CONTENT,
        )
        rows = await self.locations.list_for_world(world_id=world.id, limit=limit, offset=offset)
        total = await self.locations.count_for_world(world.id)
        return WorldLocationPageOut(
            items=[self._location_to_dto(item) for item in rows],
            pagination=to_pagination(total=total, limit=limit, offset=offset),
        )

    async def create_location(
        self,
        *,
        actor_user_id: str,
        world_id: str,
        payload: CreateWorldLocationIn,
    ) -> WorldLocationOut:
        world = await self._get_world(world_id)
        await self._require_permission_for_world(
            actor_user_id=actor_user_id,
            world=world,
            permission=Permission.MANAGE_CHARACTERS,
        )

        if payload.region_id is not None:
            region = await self.regions.get_by_id(payload.region_id)
            parent_region = require_entity(region, detail="Region not found")
            self.domain.validate_region_parent(
                world_id=world.id,
                parent_world_id=parent_region.world_id,
            )

        base_slug = self.domain.slugify(payload.name)
        slug = base_slug
        collision_index = 1
        while await self.locations.get_by_slug(world_id=world.id, slug=slug) is not None:
            collision_index += 1
            slug = f"{base_slug}-{collision_index}"

        location = await self.locations.create(
            world_id=world.id,
            region_id=payload.region_id,
            slug=slug,
            name=payload.name,
            location_type=payload.location_type,
            summary=payload.summary,
        )
        await self.session.commit()
        return self._location_to_dto(location)

    async def create_relationship(
        self,
        *,
        actor_user_id: str,
        world_id: str,
        related_world_id: str,
        relationship_type: str,
        notes: str,
    ) -> WorldRelationshipOut:
        world = await self._get_world(world_id)
        await self._require_permission_for_world(
            actor_user_id=actor_user_id,
            world=world,
            permission=Permission.MANAGE_CHARACTERS,
        )
        related_world = await self._get_world(related_world_id)
        self.domain.validate_relationship_pair(world_id=world.id, related_world_id=related_world.id)
        normalized_type = self.domain.validate_relationship_type(relationship_type)

        existing = await self.relationships.get_by_pair(
            world_id=world.id,
            related_world_id=related_world.id,
            relationship_type=normalized_type,
        )
        if existing is not None:
            raise conflict("Relationship already exists")

        created = await self.relationships.create(
            world_id=world.id,
            related_world_id=related_world.id,
            relationship_type=normalized_type,
            notes=notes,
            created_by_user_id=actor_user_id,
        )
        await self.session.commit()
        return WorldRelationshipOut(
            id=created.id,
            worldId=created.world_id,
            relatedWorldId=created.related_world_id,
            relatedName=related_world.name,
            relationshipType=cast(WorldRelationshipType, created.relationship_type),
            notes=created.notes,
        )
