"""Add character domain tables.

Revision ID: 20260713_0002
Revises: 20260708_0001
Create Date: 2026-07-13
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "20260713_0002"
down_revision = "20260708_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "characters",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("studio_id", sa.String(length=36), nullable=False),
        sa.Column("owner_user_id", sa.String(length=36), nullable=False),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("avatar_url", sa.String(length=1024), nullable=True),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False, server_default=""),
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
        sa.UniqueConstraint("studio_id", "slug", name="uq_characters_studio_slug"),
    )
    op.create_index(op.f("ix_characters_name"), "characters", ["name"], unique=False)
    op.create_index(
        op.f("ix_characters_owner_user_id"), "characters", ["owner_user_id"], unique=False
    )
    op.create_index(op.f("ix_characters_status"), "characters", ["status"], unique=False)
    op.create_index(op.f("ix_characters_studio_id"), "characters", ["studio_id"], unique=False)

    op.create_table(
        "character_versions",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("character_id", sa.String(length=36), nullable=False),
        sa.Column("author_user_id", sa.String(length=36), nullable=False),
        sa.Column("label", sa.String(length=64), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False, server_default=""),
        sa.Column("snapshot", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["author_user_id"], ["users.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["character_id"], ["characters.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("character_id", "label", name="uq_character_versions_character_label"),
    )
    op.create_index(
        op.f("ix_character_versions_author_user_id"),
        "character_versions",
        ["author_user_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_character_versions_character_id"),
        "character_versions",
        ["character_id"],
        unique=False,
    )

    op.create_table(
        "character_tags",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("character_id", sa.String(length=36), nullable=False),
        sa.Column("tag", sa.String(length=64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["character_id"], ["characters.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("character_id", "tag", name="uq_character_tags_character_tag"),
    )
    op.create_index(
        op.f("ix_character_tags_character_id"), "character_tags", ["character_id"], unique=False
    )
    op.create_index(op.f("ix_character_tags_tag"), "character_tags", ["tag"], unique=False)

    op.create_table(
        "character_relationships",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("character_id", sa.String(length=36), nullable=False),
        sa.Column("related_character_id", sa.String(length=36), nullable=False),
        sa.Column("relationship_type", sa.String(length=32), nullable=False),
        sa.Column("notes", sa.Text(), nullable=False, server_default=""),
        sa.Column("created_by_user_id", sa.String(length=36), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["character_id"], ["characters.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["created_by_user_id"], ["users.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["related_character_id"], ["characters.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "character_id",
            "related_character_id",
            "relationship_type",
            name="uq_character_relationships_pair_type",
        ),
    )
    op.create_index(
        op.f("ix_character_relationships_character_id"),
        "character_relationships",
        ["character_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_character_relationships_created_by_user_id"),
        "character_relationships",
        ["created_by_user_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_character_relationships_related_character_id"),
        "character_relationships",
        ["related_character_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_character_relationships_relationship_type"),
        "character_relationships",
        ["relationship_type"],
        unique=False,
    )

    op.create_table(
        "character_attachments",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("character_id", sa.String(length=36), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("kind", sa.String(length=32), nullable=False),
        sa.Column("url", sa.String(length=1024), nullable=False),
        sa.Column("mime_type", sa.String(length=255), nullable=True),
        sa.Column("metadata", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        sa.Column("created_by_user_id", sa.String(length=36), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["character_id"], ["characters.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["created_by_user_id"], ["users.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_character_attachments_character_id"),
        "character_attachments",
        ["character_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_character_attachments_created_by_user_id"),
        "character_attachments",
        ["created_by_user_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_character_attachments_kind"), "character_attachments", ["kind"], unique=False
    )

    op.create_table(
        "character_activities",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("character_id", sa.String(length=36), nullable=False),
        sa.Column("actor_user_id", sa.String(length=36), nullable=False),
        sa.Column("activity_type", sa.String(length=64), nullable=False),
        sa.Column("message", sa.Text(), nullable=False, server_default=""),
        sa.Column("payload", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["actor_user_id"], ["users.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["character_id"], ["characters.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_character_activities_activity_type"),
        "character_activities",
        ["activity_type"],
        unique=False,
    )
    op.create_index(
        op.f("ix_character_activities_actor_user_id"),
        "character_activities",
        ["actor_user_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_character_activities_character_id"),
        "character_activities",
        ["character_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_character_activities_character_id"), table_name="character_activities")
    op.drop_index(op.f("ix_character_activities_actor_user_id"), table_name="character_activities")
    op.drop_index(op.f("ix_character_activities_activity_type"), table_name="character_activities")
    op.drop_table("character_activities")

    op.drop_index(op.f("ix_character_attachments_kind"), table_name="character_attachments")
    op.drop_index(
        op.f("ix_character_attachments_created_by_user_id"), table_name="character_attachments"
    )
    op.drop_index(op.f("ix_character_attachments_character_id"), table_name="character_attachments")
    op.drop_table("character_attachments")

    op.drop_index(
        op.f("ix_character_relationships_relationship_type"),
        table_name="character_relationships",
    )
    op.drop_index(
        op.f("ix_character_relationships_related_character_id"),
        table_name="character_relationships",
    )
    op.drop_index(
        op.f("ix_character_relationships_created_by_user_id"),
        table_name="character_relationships",
    )
    op.drop_index(
        op.f("ix_character_relationships_character_id"),
        table_name="character_relationships",
    )
    op.drop_table("character_relationships")

    op.drop_index(op.f("ix_character_tags_tag"), table_name="character_tags")
    op.drop_index(op.f("ix_character_tags_character_id"), table_name="character_tags")
    op.drop_table("character_tags")

    op.drop_index(op.f("ix_character_versions_character_id"), table_name="character_versions")
    op.drop_index(op.f("ix_character_versions_author_user_id"), table_name="character_versions")
    op.drop_table("character_versions")

    op.drop_index(op.f("ix_characters_studio_id"), table_name="characters")
    op.drop_index(op.f("ix_characters_status"), table_name="characters")
    op.drop_index(op.f("ix_characters_owner_user_id"), table_name="characters")
    op.drop_index(op.f("ix_characters_name"), table_name="characters")
    op.drop_table("characters")
