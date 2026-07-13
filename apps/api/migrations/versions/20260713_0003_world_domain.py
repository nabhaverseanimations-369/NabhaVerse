"""Add world domain tables.

Revision ID: 20260713_0003
Revises: 20260713_0002
Create Date: 2026-07-13
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "20260713_0003"
down_revision = "20260713_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "worlds",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("studio_id", sa.String(length=36), nullable=False),
        sa.Column("owner_user_id", sa.String(length=36), nullable=False),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("cover_image_url", sa.String(length=1024), nullable=True),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column("timeline_summary", sa.Text(), nullable=False, server_default=""),
        sa.Column("is_favorite", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("recently_opened_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("active_version_id", sa.String(length=36), nullable=True),
        sa.Column("lock_version", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["owner_user_id"], ["users.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["studio_id"], ["studios.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("studio_id", "slug", name="uq_worlds_studio_slug"),
    )
    op.create_index(op.f("ix_worlds_name"), "worlds", ["name"], unique=False)
    op.create_index(op.f("ix_worlds_owner_user_id"), "worlds", ["owner_user_id"], unique=False)
    op.create_index(op.f("ix_worlds_status"), "worlds", ["status"], unique=False)
    op.create_index(op.f("ix_worlds_studio_id"), "worlds", ["studio_id"], unique=False)

    op.create_table(
        "world_versions",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("world_id", sa.String(length=36), nullable=False),
        sa.Column("author_user_id", sa.String(length=36), nullable=False),
        sa.Column("label", sa.String(length=64), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False, server_default=""),
        sa.Column("snapshot", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["author_user_id"], ["users.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["world_id"], ["worlds.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("world_id", "label", name="uq_world_versions_world_label"),
    )
    op.create_index(
        op.f("ix_world_versions_author_user_id"),
        "world_versions",
        ["author_user_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_world_versions_world_id"),
        "world_versions",
        ["world_id"],
        unique=False,
    )

    op.create_table(
        "world_regions",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("world_id", sa.String(length=36), nullable=False),
        sa.Column("parent_region_id", sa.String(length=36), nullable=True),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("kind", sa.String(length=64), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["parent_region_id"], ["world_regions.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["world_id"], ["worlds.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("world_id", "slug", name="uq_world_regions_world_slug"),
    )
    op.create_index(op.f("ix_world_regions_kind"), "world_regions", ["kind"], unique=False)
    op.create_index(op.f("ix_world_regions_name"), "world_regions", ["name"], unique=False)
    op.create_index(
        op.f("ix_world_regions_parent_region_id"),
        "world_regions",
        ["parent_region_id"],
        unique=False,
    )
    op.create_index(op.f("ix_world_regions_world_id"), "world_regions", ["world_id"], unique=False)

    op.create_table(
        "world_locations",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("world_id", sa.String(length=36), nullable=False),
        sa.Column("region_id", sa.String(length=36), nullable=True),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("location_type", sa.String(length=64), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["region_id"], ["world_regions.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["world_id"], ["worlds.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("world_id", "slug", name="uq_world_locations_world_slug"),
    )
    op.create_index(
        op.f("ix_world_locations_location_type"),
        "world_locations",
        ["location_type"],
        unique=False,
    )
    op.create_index(op.f("ix_world_locations_name"), "world_locations", ["name"], unique=False)
    op.create_index(
        op.f("ix_world_locations_region_id"),
        "world_locations",
        ["region_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_world_locations_world_id"),
        "world_locations",
        ["world_id"],
        unique=False,
    )

    op.create_table(
        "world_timelines",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("world_id", sa.String(length=36), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("era", sa.String(length=128), nullable=False),
        sa.Column("start_year", sa.Integer(), nullable=True),
        sa.Column("end_year", sa.Integer(), nullable=True),
        sa.Column("summary", sa.Text(), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["world_id"], ["worlds.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_world_timelines_era"), "world_timelines", ["era"], unique=False)
    op.create_index(
        op.f("ix_world_timelines_world_id"),
        "world_timelines",
        ["world_id"],
        unique=False,
    )

    op.create_table(
        "world_relationships",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("world_id", sa.String(length=36), nullable=False),
        sa.Column("related_world_id", sa.String(length=36), nullable=False),
        sa.Column("relationship_type", sa.String(length=32), nullable=False),
        sa.Column("notes", sa.Text(), nullable=False, server_default=""),
        sa.Column("created_by_user_id", sa.String(length=36), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["created_by_user_id"], ["users.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["related_world_id"], ["worlds.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["world_id"], ["worlds.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "world_id",
            "related_world_id",
            "relationship_type",
            name="uq_world_relationships_pair_type",
        ),
    )
    op.create_index(
        op.f("ix_world_relationships_created_by_user_id"),
        "world_relationships",
        ["created_by_user_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_world_relationships_related_world_id"),
        "world_relationships",
        ["related_world_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_world_relationships_relationship_type"),
        "world_relationships",
        ["relationship_type"],
        unique=False,
    )
    op.create_index(
        op.f("ix_world_relationships_world_id"),
        "world_relationships",
        ["world_id"],
        unique=False,
    )

    op.create_table(
        "world_tags",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("world_id", sa.String(length=36), nullable=False),
        sa.Column("tag", sa.String(length=64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["world_id"], ["worlds.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("world_id", "tag", name="uq_world_tags_world_tag"),
    )
    op.create_index(op.f("ix_world_tags_tag"), "world_tags", ["tag"], unique=False)
    op.create_index(op.f("ix_world_tags_world_id"), "world_tags", ["world_id"], unique=False)

    op.create_table(
        "world_activities",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("world_id", sa.String(length=36), nullable=False),
        sa.Column("actor_user_id", sa.String(length=36), nullable=False),
        sa.Column("activity_type", sa.String(length=64), nullable=False),
        sa.Column("message", sa.Text(), nullable=False, server_default=""),
        sa.Column("payload", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["actor_user_id"], ["users.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["world_id"], ["worlds.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_world_activities_activity_type"),
        "world_activities",
        ["activity_type"],
        unique=False,
    )
    op.create_index(
        op.f("ix_world_activities_actor_user_id"),
        "world_activities",
        ["actor_user_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_world_activities_world_id"),
        "world_activities",
        ["world_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_world_activities_world_id"), table_name="world_activities")
    op.drop_index(op.f("ix_world_activities_actor_user_id"), table_name="world_activities")
    op.drop_index(op.f("ix_world_activities_activity_type"), table_name="world_activities")
    op.drop_table("world_activities")

    op.drop_index(op.f("ix_world_tags_world_id"), table_name="world_tags")
    op.drop_index(op.f("ix_world_tags_tag"), table_name="world_tags")
    op.drop_table("world_tags")

    op.drop_index(op.f("ix_world_relationships_world_id"), table_name="world_relationships")
    op.drop_index(
        op.f("ix_world_relationships_relationship_type"),
        table_name="world_relationships",
    )
    op.drop_index(op.f("ix_world_relationships_related_world_id"), table_name="world_relationships")
    op.drop_index(
        op.f("ix_world_relationships_created_by_user_id"),
        table_name="world_relationships",
    )
    op.drop_table("world_relationships")

    op.drop_index(op.f("ix_world_timelines_world_id"), table_name="world_timelines")
    op.drop_index(op.f("ix_world_timelines_era"), table_name="world_timelines")
    op.drop_table("world_timelines")

    op.drop_index(op.f("ix_world_locations_world_id"), table_name="world_locations")
    op.drop_index(op.f("ix_world_locations_region_id"), table_name="world_locations")
    op.drop_index(op.f("ix_world_locations_name"), table_name="world_locations")
    op.drop_index(op.f("ix_world_locations_location_type"), table_name="world_locations")
    op.drop_table("world_locations")

    op.drop_index(op.f("ix_world_regions_world_id"), table_name="world_regions")
    op.drop_index(op.f("ix_world_regions_parent_region_id"), table_name="world_regions")
    op.drop_index(op.f("ix_world_regions_name"), table_name="world_regions")
    op.drop_index(op.f("ix_world_regions_kind"), table_name="world_regions")
    op.drop_table("world_regions")

    op.drop_index(op.f("ix_world_versions_world_id"), table_name="world_versions")
    op.drop_index(op.f("ix_world_versions_author_user_id"), table_name="world_versions")
    op.drop_table("world_versions")

    op.drop_index(op.f("ix_worlds_studio_id"), table_name="worlds")
    op.drop_index(op.f("ix_worlds_status"), table_name="worlds")
    op.drop_index(op.f("ix_worlds_owner_user_id"), table_name="worlds")
    op.drop_index(op.f("ix_worlds_name"), table_name="worlds")
    op.drop_table("worlds")
