from __future__ import annotations

from datetime import datetime

from nabhaverse_api.infrastructure.database.model_mixins import (
    SoftDeleteMixin,
    TimestampMixin,
    UUIDMixin,
    VersionMixin,
)
from sqlalchemy import JSON, Boolean, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class UserModel(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "users"

    clerk_user_id: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    email: Mapped[str | None] = mapped_column(String(320), nullable=True, index=True)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    preferences: Mapped[dict[str, object]] = mapped_column(JSON, default=dict)

    memberships: Mapped[list[MembershipModel]] = relationship(back_populates="user")
    owned_characters: Mapped[list[CharacterModel]] = relationship(back_populates="owner")
    owned_worlds: Mapped[list[WorldModel]] = relationship(back_populates="owner")
    authored_character_versions: Mapped[list[CharacterVersionModel]] = relationship(
        back_populates="author"
    )
    authored_world_versions: Mapped[list[WorldVersionModel]] = relationship(back_populates="author")
    character_activities: Mapped[list[CharacterActivityModel]] = relationship(
        back_populates="actor"
    )
    world_activities: Mapped[list[WorldActivityModel]] = relationship(back_populates="actor")


class StudioModel(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "studios"

    name: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)

    memberships: Mapped[list[MembershipModel]] = relationship(back_populates="studio")
    characters: Mapped[list[CharacterModel]] = relationship(back_populates="studio")
    worlds: Mapped[list[WorldModel]] = relationship(back_populates="studio")


class RoleModel(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "roles"

    name: Mapped[str] = mapped_column(String(32), unique=True)

    memberships: Mapped[list[MembershipModel]] = relationship(back_populates="role")
    role_permissions: Mapped[list[RolePermissionModel]] = relationship(back_populates="role")


class PermissionModel(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "permissions"

    name: Mapped[str] = mapped_column(String(64), unique=True)

    role_permissions: Mapped[list[RolePermissionModel]] = relationship(back_populates="permission")


class RolePermissionModel(Base):
    __tablename__ = "role_permissions"

    role_id: Mapped[str] = mapped_column(
        ForeignKey("roles.id", ondelete="CASCADE"),
        primary_key=True,
    )
    permission_id: Mapped[str] = mapped_column(
        ForeignKey("permissions.id", ondelete="CASCADE"),
        primary_key=True,
    )

    role: Mapped[RoleModel] = relationship(back_populates="role_permissions")
    permission: Mapped[PermissionModel] = relationship(back_populates="role_permissions")


class MembershipModel(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "memberships"
    __table_args__ = (UniqueConstraint("user_id", "studio_id", name="uq_memberships_user_studio"),)

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    studio_id: Mapped[str] = mapped_column(ForeignKey("studios.id", ondelete="CASCADE"), index=True)
    role_id: Mapped[str] = mapped_column(ForeignKey("roles.id", ondelete="RESTRICT"), index=True)

    user: Mapped[UserModel] = relationship(back_populates="memberships")
    studio: Mapped[StudioModel] = relationship(back_populates="memberships")
    role: Mapped[RoleModel] = relationship(back_populates="memberships")


class CharacterModel(UUIDMixin, TimestampMixin, SoftDeleteMixin, VersionMixin, Base):
    __tablename__ = "characters"
    __table_args__ = (UniqueConstraint("studio_id", "slug", name="uq_characters_studio_slug"),)

    studio_id: Mapped[str] = mapped_column(ForeignKey("studios.id", ondelete="CASCADE"), index=True)
    owner_user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"),
        index=True,
    )
    slug: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String(255), index=True)
    avatar_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    status: Mapped[str] = mapped_column(String(32), index=True)
    summary: Mapped[str] = mapped_column(Text, default="")
    is_favorite: Mapped[bool] = mapped_column(Boolean, default=False)
    recently_opened_at: Mapped[datetime | None] = mapped_column(nullable=True)
    active_version_id: Mapped[str | None] = mapped_column(String(36), nullable=True)

    __mapper_args__ = {"version_id_col": VersionMixin.lock_version}

    studio: Mapped[StudioModel] = relationship(back_populates="characters")
    owner: Mapped[UserModel] = relationship(back_populates="owned_characters")
    versions: Mapped[list[CharacterVersionModel]] = relationship(back_populates="character")
    tags: Mapped[list[CharacterTagModel]] = relationship(back_populates="character")
    relationships: Mapped[list[CharacterRelationshipModel]] = relationship(
        back_populates="character",
        foreign_keys="CharacterRelationshipModel.character_id",
    )
    attachments: Mapped[list[CharacterAttachmentModel]] = relationship(back_populates="character")
    activities: Mapped[list[CharacterActivityModel]] = relationship(back_populates="character")


class CharacterVersionModel(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "character_versions"
    __table_args__ = (
        UniqueConstraint("character_id", "label", name="uq_character_versions_character_label"),
    )

    character_id: Mapped[str] = mapped_column(
        ForeignKey("characters.id", ondelete="CASCADE"),
        index=True,
    )
    author_user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"),
        index=True,
    )
    label: Mapped[str] = mapped_column(String(64))
    summary: Mapped[str] = mapped_column(Text, default="")
    snapshot: Mapped[dict[str, object]] = mapped_column(JSON, default=dict)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False)

    character: Mapped[CharacterModel] = relationship(back_populates="versions")
    author: Mapped[UserModel] = relationship(back_populates="authored_character_versions")


class CharacterTagModel(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "character_tags"
    __table_args__ = (
        UniqueConstraint("character_id", "tag", name="uq_character_tags_character_tag"),
    )

    character_id: Mapped[str] = mapped_column(
        ForeignKey("characters.id", ondelete="CASCADE"),
        index=True,
    )
    tag: Mapped[str] = mapped_column(String(64), index=True)

    character: Mapped[CharacterModel] = relationship(back_populates="tags")


class CharacterRelationshipModel(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "character_relationships"
    __table_args__ = (
        UniqueConstraint(
            "character_id",
            "related_character_id",
            "relationship_type",
            name="uq_character_relationships_pair_type",
        ),
    )

    character_id: Mapped[str] = mapped_column(
        ForeignKey("characters.id", ondelete="CASCADE"),
        index=True,
    )
    related_character_id: Mapped[str] = mapped_column(
        ForeignKey("characters.id", ondelete="CASCADE"),
        index=True,
    )
    relationship_type: Mapped[str] = mapped_column(String(32), index=True)
    notes: Mapped[str] = mapped_column(Text, default="")
    created_by_user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"),
        index=True,
    )

    character: Mapped[CharacterModel] = relationship(
        back_populates="relationships",
        foreign_keys=[character_id],
    )
    related_character: Mapped[CharacterModel] = relationship(foreign_keys=[related_character_id])


class CharacterAttachmentModel(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "character_attachments"

    character_id: Mapped[str] = mapped_column(
        ForeignKey("characters.id", ondelete="CASCADE"),
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255))
    kind: Mapped[str] = mapped_column(String(32), index=True)
    url: Mapped[str] = mapped_column(String(1024))
    mime_type: Mapped[str | None] = mapped_column(String(255), nullable=True)
    metadata_json: Mapped[dict[str, object]] = mapped_column("metadata", JSON, default=dict)
    created_by_user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"),
        index=True,
    )

    character: Mapped[CharacterModel] = relationship(back_populates="attachments")


class CharacterActivityModel(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "character_activities"

    character_id: Mapped[str] = mapped_column(
        ForeignKey("characters.id", ondelete="CASCADE"),
        index=True,
    )
    actor_user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"),
        index=True,
    )
    activity_type: Mapped[str] = mapped_column(String(64), index=True)
    message: Mapped[str] = mapped_column(Text, default="")
    payload: Mapped[dict[str, object]] = mapped_column(JSON, default=dict)

    character: Mapped[CharacterModel] = relationship(back_populates="activities")
    actor: Mapped[UserModel] = relationship(back_populates="character_activities")


class WorldModel(UUIDMixin, TimestampMixin, SoftDeleteMixin, VersionMixin, Base):
    __tablename__ = "worlds"
    __table_args__ = (UniqueConstraint("studio_id", "slug", name="uq_worlds_studio_slug"),)

    studio_id: Mapped[str] = mapped_column(ForeignKey("studios.id", ondelete="CASCADE"), index=True)
    owner_user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"),
        index=True,
    )
    slug: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String(255), index=True)
    cover_image_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    status: Mapped[str] = mapped_column(String(32), index=True)
    description: Mapped[str] = mapped_column(Text, default="")
    timeline_summary: Mapped[str] = mapped_column(Text, default="")
    is_favorite: Mapped[bool] = mapped_column(Boolean, default=False)
    recently_opened_at: Mapped[datetime | None] = mapped_column(nullable=True)
    active_version_id: Mapped[str | None] = mapped_column(String(36), nullable=True)

    __mapper_args__ = {"version_id_col": VersionMixin.lock_version}

    studio: Mapped[StudioModel] = relationship(back_populates="worlds")
    owner: Mapped[UserModel] = relationship(back_populates="owned_worlds")
    versions: Mapped[list[WorldVersionModel]] = relationship(back_populates="world")
    regions: Mapped[list[WorldRegionModel]] = relationship(back_populates="world")
    locations: Mapped[list[WorldLocationModel]] = relationship(back_populates="world")
    timeline_entries: Mapped[list[WorldTimelineModel]] = relationship(back_populates="world")
    tags: Mapped[list[WorldTagModel]] = relationship(back_populates="world")
    relationships: Mapped[list[WorldRelationshipModel]] = relationship(
        back_populates="world",
        foreign_keys="WorldRelationshipModel.world_id",
    )
    activities: Mapped[list[WorldActivityModel]] = relationship(back_populates="world")


class WorldVersionModel(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "world_versions"
    __table_args__ = (UniqueConstraint("world_id", "label", name="uq_world_versions_world_label"),)

    world_id: Mapped[str] = mapped_column(ForeignKey("worlds.id", ondelete="CASCADE"), index=True)
    author_user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"),
        index=True,
    )
    label: Mapped[str] = mapped_column(String(64))
    summary: Mapped[str] = mapped_column(Text, default="")
    snapshot: Mapped[dict[str, object]] = mapped_column(JSON, default=dict)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False)

    world: Mapped[WorldModel] = relationship(back_populates="versions")
    author: Mapped[UserModel] = relationship(back_populates="authored_world_versions")


class WorldRegionModel(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "world_regions"
    __table_args__ = (UniqueConstraint("world_id", "slug", name="uq_world_regions_world_slug"),)

    world_id: Mapped[str] = mapped_column(ForeignKey("worlds.id", ondelete="CASCADE"), index=True)
    parent_region_id: Mapped[str | None] = mapped_column(
        ForeignKey("world_regions.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    slug: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String(255), index=True)
    kind: Mapped[str] = mapped_column(String(64), index=True)
    summary: Mapped[str] = mapped_column(Text, default="")

    world: Mapped[WorldModel] = relationship(back_populates="regions")
    parent_region: Mapped[WorldRegionModel | None] = relationship(
        remote_side="WorldRegionModel.id",
        foreign_keys=[parent_region_id],
    )


class WorldLocationModel(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "world_locations"
    __table_args__ = (UniqueConstraint("world_id", "slug", name="uq_world_locations_world_slug"),)

    world_id: Mapped[str] = mapped_column(ForeignKey("worlds.id", ondelete="CASCADE"), index=True)
    region_id: Mapped[str | None] = mapped_column(
        ForeignKey("world_regions.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    slug: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String(255), index=True)
    location_type: Mapped[str] = mapped_column(String(64), index=True)
    summary: Mapped[str] = mapped_column(Text, default="")

    world: Mapped[WorldModel] = relationship(back_populates="locations")
    region: Mapped[WorldRegionModel | None] = relationship()


class WorldTimelineModel(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "world_timelines"

    world_id: Mapped[str] = mapped_column(ForeignKey("worlds.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    era: Mapped[str] = mapped_column(String(128), index=True)
    start_year: Mapped[int | None] = mapped_column(nullable=True)
    end_year: Mapped[int | None] = mapped_column(nullable=True)
    summary: Mapped[str] = mapped_column(Text, default="")

    world: Mapped[WorldModel] = relationship(back_populates="timeline_entries")


class WorldRelationshipModel(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "world_relationships"
    __table_args__ = (
        UniqueConstraint(
            "world_id",
            "related_world_id",
            "relationship_type",
            name="uq_world_relationships_pair_type",
        ),
    )

    world_id: Mapped[str] = mapped_column(ForeignKey("worlds.id", ondelete="CASCADE"), index=True)
    related_world_id: Mapped[str] = mapped_column(
        ForeignKey("worlds.id", ondelete="CASCADE"),
        index=True,
    )
    relationship_type: Mapped[str] = mapped_column(String(32), index=True)
    notes: Mapped[str] = mapped_column(Text, default="")
    created_by_user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"),
        index=True,
    )

    world: Mapped[WorldModel] = relationship(
        back_populates="relationships",
        foreign_keys=[world_id],
    )
    related_world: Mapped[WorldModel] = relationship(foreign_keys=[related_world_id])


class WorldTagModel(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "world_tags"
    __table_args__ = (UniqueConstraint("world_id", "tag", name="uq_world_tags_world_tag"),)

    world_id: Mapped[str] = mapped_column(ForeignKey("worlds.id", ondelete="CASCADE"), index=True)
    tag: Mapped[str] = mapped_column(String(64), index=True)

    world: Mapped[WorldModel] = relationship(back_populates="tags")


class WorldActivityModel(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "world_activities"

    world_id: Mapped[str] = mapped_column(ForeignKey("worlds.id", ondelete="CASCADE"), index=True)
    actor_user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"),
        index=True,
    )
    activity_type: Mapped[str] = mapped_column(String(64), index=True)
    message: Mapped[str] = mapped_column(Text, default="")
    payload: Mapped[dict[str, object]] = mapped_column(JSON, default=dict)

    world: Mapped[WorldModel] = relationship(back_populates="activities")
    actor: Mapped[UserModel] = relationship(back_populates="world_activities")
