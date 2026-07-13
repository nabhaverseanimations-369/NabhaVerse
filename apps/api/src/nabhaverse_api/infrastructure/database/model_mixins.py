from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from nabhaverse_api.domain.shared.datetime_utils import utc_now
from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, declarative_mixin, mapped_column


@declarative_mixin
class UUIDMixin:
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))


@declarative_mixin
class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
    )


@declarative_mixin
class SoftDeleteMixin:
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


@declarative_mixin
class VersionMixin:
    lock_version: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
