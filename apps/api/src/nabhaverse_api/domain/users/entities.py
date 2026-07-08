from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class User:
    id: str
    clerk_user_id: str
    email: str | None
    full_name: str | None
    avatar_url: str | None
    preferences: dict[str, object]
    created_at: datetime
    updated_at: datetime
