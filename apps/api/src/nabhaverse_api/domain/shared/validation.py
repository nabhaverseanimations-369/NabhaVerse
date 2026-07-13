from __future__ import annotations


def ensure_allowed(*, field_name: str, value: str, allowed: set[str]) -> str:
    if value not in allowed:
        raise ValueError(f"Invalid {field_name}")
    return value
