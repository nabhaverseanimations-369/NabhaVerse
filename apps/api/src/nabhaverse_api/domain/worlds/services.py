from __future__ import annotations

from dataclasses import dataclass

from fastapi import HTTPException, status

from nabhaverse_api.domain.shared.slug import slugify
from nabhaverse_api.domain.shared.validation import ensure_allowed

VALID_WORLD_STATUSES = {"draft", "in-review", "published", "archived"}
VALID_WORLD_RELATIONSHIP_TYPES = {"ally", "trade", "conflict", "shared-history"}


@dataclass(frozen=True)
class WorldFilters:
    query: str | None
    tags: list[str]
    status: list[str]
    region_id: str | None
    location_id: str | None


class WorldDomainService:
    def slugify(self, value: str) -> str:
        return slugify(value, fallback="world")

    def validate_status(self, status_value: str) -> str:
        try:
            return ensure_allowed(
                field_name="world status",
                value=status_value,
                allowed=VALID_WORLD_STATUSES,
            )
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Invalid world status",
            ) from exc

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
        region_id: str | None,
        location_id: str | None,
    ) -> WorldFilters:
        normalized_status = [self.validate_status(item) for item in status]
        return WorldFilters(
            query=query.strip() if query and query.strip() else None,
            tags=self.normalize_tags(tags),
            status=normalized_status,
            region_id=region_id,
            location_id=location_id,
        )

    def validate_version_label(self, label: str) -> str:
        normalized = label.strip()
        if not normalized:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Version label is required",
            )
        return normalized

    def validate_timeline_summary(self, timeline_summary: str) -> str:
        return timeline_summary.strip()

    def validate_timeline_consistency(
        self,
        *,
        start_year: int | None,
        end_year: int | None,
    ) -> None:
        if start_year is not None and end_year is not None and start_year > end_year:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Timeline start year cannot be after end year",
            )

    def validate_region_parent(self, *, world_id: str, parent_world_id: str | None) -> None:
        if parent_world_id is not None and parent_world_id != world_id:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Parent region must belong to the same world",
            )

    def validate_relationship_type(self, relationship_type: str) -> str:
        try:
            return ensure_allowed(
                field_name="world relationship type",
                value=relationship_type,
                allowed=VALID_WORLD_RELATIONSHIP_TYPES,
            )
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Invalid world relationship type",
            ) from exc

    def validate_relationship_pair(self, *, world_id: str, related_world_id: str) -> None:
        if world_id == related_world_id:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="World cannot be related to itself",
            )
