from __future__ import annotations

from datetime import datetime
from typing import Any, cast

from nabhaverse_api.domain.shared.datetime_utils import utc_now
from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql.elements import ColumnElement


class BaseRepository[TModel]:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def add_and_flush(self, instance: TModel) -> TModel:
        self.session.add(instance)
        await self.session.flush()
        return instance

    async def commit(self) -> None:
        await self.session.commit()

    async def rollback(self) -> None:
        await self.session.rollback()

    def paginate(
        self,
        statement: Select[tuple[TModel]],
        *,
        limit: int,
        offset: int,
    ) -> Select[tuple[TModel]]:
        return statement.limit(limit).offset(offset)

    async def count_by(self, model: type[TModel], *filters: ColumnElement[bool]) -> int:
        statement = select(func.count()).select_from(model).where(*filters)
        count = await self.session.scalar(statement)
        return int(count or 0)

    async def soft_delete(self, instance: TModel) -> TModel:
        cast(Any, instance).deleted_at = utc_now()
        await self.session.flush()
        return instance

    async def touch(self, instance: TModel, *, when: datetime | None = None) -> TModel:
        cast(Any, instance).updated_at = when or utc_now()
        await self.session.flush()
        return instance
