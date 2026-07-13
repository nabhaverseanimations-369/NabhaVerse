from __future__ import annotations

from dataclasses import dataclass

from fastapi import HTTPException, status

VALID_CHARACTER_STATUSES = {"draft", "in-review", "approved", "archived"}
VALID_RELATIONSHIP_TYPES = {"ally", "rival", "mentor", "family", "team"}


@dataclass(frozen=True)
class CharacterFilters:
    query: str | None
    tags: list[str]
    status: list[str]
    owner_user_id: str | None


class CharacterDomainService:
    def slugify(self, value: str) -> str:
        normalized = "".join(char.lower() if char.isalnum() else "-" for char in value)
        slug = "-".join(part for part in normalized.split("-") if part)
        return slug or "character"

    def validate_status(self, status_value: str) -> str:
        if status_value not in VALID_CHARACTER_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Invalid character status",
            )
        return status_value

    def normalize_tags(self, tags: list[str]) -> list[str]:
        normalized: list[str] = []
        seen: set[str] = set()
        for tag in tags:
            value = tag.strip().lower()
            if not value or value in seen:
                continue
            seen.add(value)
            normalized.append(value)
        return normalized

    def normalize_filters(
        self,
        *,
        query: str | None,
        tags: list[str],
        status: list[str],
        owner_user_id: str | None,
    ) -> CharacterFilters:
        normalized_status = [self.validate_status(item) for item in status]
        return CharacterFilters(
            query=query.strip() if query and query.strip() else None,
            tags=self.normalize_tags(tags),
            status=normalized_status,
            owner_user_id=owner_user_id,
        )

    def validate_version_label(self, label: str) -> str:
        normalized = label.strip()
        if not normalized:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Version label is required",
            )
        return normalized

    def validate_relationship_type(self, relationship_type: str) -> str:
        if relationship_type not in VALID_RELATIONSHIP_TYPES:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Invalid relationship type",
            )
        return relationship_type

    def validate_relationship_pair(self, *, character_id: str, related_character_id: str) -> None:
        if character_id == related_character_id:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Character cannot be related to itself",
            )
