from __future__ import annotations

import asyncio
from collections.abc import AsyncIterator
from pathlib import Path
from typing import cast

from alembic import command
from alembic.config import Config
from nabhaverse_api.domain.auth.permissions import ROLE_PERMISSIONS, Permission, Role
from nabhaverse_api.infrastructure.config import get_settings
from nabhaverse_api.infrastructure.database.models import (
    PermissionModel,
    RoleModel,
    RolePermissionModel,
)
from sqlalchemy import create_engine, inspect, select
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

settings = get_settings()
engine = create_async_engine(settings.database_url, echo=False, future=True)
SessionFactory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_session() -> AsyncIterator[AsyncSession]:
    async with SessionFactory() as session:
        yield session


def _run_migrations() -> None:
    config = Config(str(Path(__file__).resolve().parents[4] / "alembic.ini"))
    sync_url = settings.database_url.replace("+aiosqlite", "")
    url = make_url(sync_url)

    if url.get_backend_name() == "sqlite" and url.database:
        sqlite_path = Path(url.database)
        if sqlite_path.exists():
            sync_engine = create_engine(sync_url)
            try:
                inspector = inspect(sync_engine)
                tables = set(inspector.get_table_names())
                user_columns = (
                    {column["name"] for column in inspector.get_columns("users")}
                    if "users" in tables
                    else set()
                )
            finally:
                sync_engine.dispose()

            legacy_tables = {
                "users",
                "studios",
                "roles",
                "permissions",
                "role_permissions",
                "memberships",
            }
            has_legacy_foundation = legacy_tables.intersection(tables)
            has_compatible_user_shape = "deleted_at" in user_columns

            if has_legacy_foundation and not has_compatible_user_shape:
                sqlite_path.unlink()

    command.upgrade(config, "head")


async def init_db() -> None:
    await asyncio.to_thread(_run_migrations)

    async with SessionFactory() as session:
        role_rows = await session.scalars(select(RoleModel))
        existing_roles: dict[str, RoleModel] = {row.name: row for row in role_rows.all()}

        for role in Role:
            if role.value not in existing_roles:
                new_role = RoleModel(name=role.value)
                session.add(new_role)
                existing_roles[role.value] = new_role

        permission_rows = await session.scalars(select(PermissionModel))
        existing_permissions: dict[str, PermissionModel] = {
            row.name: row for row in permission_rows.all()
        }

        for permission in Permission:
            if permission.value not in existing_permissions:
                new_permission = PermissionModel(name=permission.value)
                session.add(new_permission)
                existing_permissions[permission.value] = new_permission

        await session.flush()

        for role, permissions in ROLE_PERMISSIONS.items():
            role_row = existing_roles[role.value]
            for permission in permissions:
                permission_row = existing_permissions[permission.value]
                exists_stmt = select(RolePermissionModel).where(
                    RolePermissionModel.role_id == role_row.id,
                    RolePermissionModel.permission_id == permission_row.id,
                )
                exists = cast(RolePermissionModel | None, await session.scalar(exists_stmt))
                if exists is None:
                    session.add(
                        RolePermissionModel(
                            role_id=role_row.id,
                            permission_id=permission_row.id,
                        )
                    )

        await session.commit()
