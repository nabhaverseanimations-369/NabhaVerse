from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime

from nabhaverse_api.domain.auth.permissions import Permission, Role


@dataclass(frozen=True)
class Studio:
    id: str
    name: str
    slug: str
    created_at: datetime
    updated_at: datetime


@dataclass(frozen=True)
class Membership:
    id: str
    user_id: str
    studio: Studio
    role: Role
    permissions: list[Permission]
    created_at: datetime
