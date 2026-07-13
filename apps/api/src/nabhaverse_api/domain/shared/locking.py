from __future__ import annotations


def validate_lock_version(*, expected: int, actual: int, entity_name: str) -> None:
    if expected != actual:
        raise ValueError(f"{entity_name} version conflict")
