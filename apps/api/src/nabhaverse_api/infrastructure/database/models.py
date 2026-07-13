from __future__ import annotations

from datetime import UTC, datetime
from uuid import uuid4

from sqlalchemy import JSON, DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


def utc_now() -> datetime:
    return datetime.now(UTC)


class Base(DeclarativeBase):
    pass


class UserModel(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    clerk_user_id: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    email: Mapped[str | None] = mapped_column(String(320), nullable=True, index=True)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    preferences: Mapped[dict[str, object]] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    memberships: Mapped[list[MembershipModel]] = relationship(back_populates="user")


class StudioModel(Base):
    __tablename__ = "studios"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    name: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    memberships: Mapped[list[MembershipModel]] = relationship(back_populates="studio")


class RoleModel(Base):
    __tablename__ = "roles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    name: Mapped[str] = mapped_column(String(32), unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
    )

    memberships: Mapped[list[MembershipModel]] = relationship(back_populates="role")
    role_permissions: Mapped[list[RolePermissionModel]] = relationship(back_populates="role")


class PermissionModel(Base):
    __tablename__ = "permissions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    name: Mapped[str] = mapped_column(String(64), unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
    )

    role_permissions: Mapped[list[RolePermissionModel]] = relationship(back_populates="permission")


class RolePermissionModel(Base):
    __tablename__ = "role_permissions"

    role_id: Mapped[str] = mapped_column(
        ForeignKey("roles.id", ondelete="CASCADE"),
        primary_key=True,
    )
    permission_id: Mapped[str] = mapped_column(
        ForeignKey("permissions.id", ondelete="CASCADE"), primary_key=True
    )

    role: Mapped[RoleModel] = relationship(back_populates="role_permissions")
    permission: Mapped[PermissionModel] = relationship(back_populates="role_permissions")


class MembershipModel(Base):
    __tablename__ = "memberships"
    __table_args__ = (UniqueConstraint("user_id", "studio_id", name="uq_memberships_user_studio"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    studio_id: Mapped[str] = mapped_column(ForeignKey("studios.id", ondelete="CASCADE"), index=True)
    role_id: Mapped[str] = mapped_column(ForeignKey("roles.id", ondelete="RESTRICT"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped[UserModel] = relationship(back_populates="memberships")
    studio: Mapped[StudioModel] = relationship(back_populates="memberships")
    role: Mapped[RoleModel] = relationship(back_populates="memberships")
