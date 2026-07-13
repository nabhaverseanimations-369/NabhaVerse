from __future__ import annotations

from uuid import UUID


def parse_uuid(value: str, *, field_name: str) -> UUID:
    try:
        return UUID(value)
    except ValueError as exc:
        raise ValueError(f"Invalid UUID for {field_name}") from exc
