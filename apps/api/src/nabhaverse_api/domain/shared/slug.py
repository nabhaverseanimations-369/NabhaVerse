from __future__ import annotations


def slugify(value: str, *, fallback: str) -> str:
    normalized = "".join(char.lower() if char.isalnum() else "-" for char in value)
    slug = "-".join(part for part in normalized.split("-") if part)
    return slug or fallback
