from __future__ import annotations

from collections.abc import AsyncIterator
from typing import cast

from nabhaverse_api.domain.auth.permissions import ROLE_PERMISSIONS, Permission, Role
from nabhaverse_api.infrastructure.config import get_settings
from nabhaverse_api.infrastructure.database.models import (
    Base,
    PermissionModel,
    RoleModel,
    RolePermissionModel,
)
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

settings = get_settings()
engine = create_async_engine(settings.database_url, echo=False, future=True)
SessionFactory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_session() -> AsyncIterator[AsyncSession]:
    async with SessionFactory() as session:
        yield session


async def init_db() -> None:
    # TODO(epic-2-cleanup): Move to migration-only bootstrap (Alembic)
    # and remove create_all at runtime.
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

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
