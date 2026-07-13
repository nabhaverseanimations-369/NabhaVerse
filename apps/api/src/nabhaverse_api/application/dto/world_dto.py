from __future__ import annotations

from typing import Any, Literal

from nabhaverse_api.application.dto.auth_dto import PaginationOut
from pydantic import BaseModel, Field

WorldStatus = Literal["draft", "in-review", "published", "archived"]
WorldRelationshipType = Literal["ally", "trade", "conflict", "shared-history"]


class WorldStatisticsOut(BaseModel):
    regions: int
    locations: int
    cultures: int = 0
    species: int = 0


class WorldOut(BaseModel):
    id: str
    slug: str
    name: str
    cover_image_url: str | None = Field(default=None, alias="coverImageUrl")
    description: str
    status: WorldStatus
    studio: str
    tags: list[str]
    favorite: bool
    recently_opened_at: str | None = Field(default=None, alias="recentlyOpenedAt")
    updated_at: str = Field(alias="updatedAt")
    version: str
    timeline_summary: str = Field(alias="timelineSummary")
    statistics: WorldStatisticsOut
    lock_version: int = Field(alias="lockVersion")


class WorldPageOut(BaseModel):
    items: list[WorldOut]
    pagination: PaginationOut


class CreateWorldIn(BaseModel):
    name: str
    status: WorldStatus = "draft"
    description: str = ""
    cover_image_url: str | None = Field(default=None, alias="coverImageUrl")
    tags: list[str] = Field(default_factory=list)
    favorite: bool = False
    initial_version_label: str = Field(default="v1.0", alias="initialVersionLabel")
    timeline_summary: str = Field(default="", alias="timelineSummary")


class UpdateWorldIn(BaseModel):
    name: str | None = None
    status: WorldStatus | None = None
    description: str | None = None
    cover_image_url: str | None = Field(default=None, alias="coverImageUrl")
    tags: list[str] | None = None
    favorite: bool | None = None
    timeline_summary: str | None = Field(default=None, alias="timelineSummary")
    lock_version: int = Field(alias="lockVersion")


class WorldVersionOut(BaseModel):
    id: str
    world_id: str = Field(alias="worldId")
    label: str
    created_at: str = Field(alias="createdAt")
    author: str
    summary: str
    active: bool


class WorldVersionPageOut(BaseModel):
    items: list[WorldVersionOut]
    pagination: PaginationOut


class CreateWorldVersionIn(BaseModel):
    label: str
    summary: str = ""
    snapshot: dict[str, Any] = Field(default_factory=dict)
    active: bool = True


class WorldRegionOut(BaseModel):
    id: str
    world_id: str = Field(alias="worldId")
    parent_region_id: str | None = Field(default=None, alias="parentRegionId")
    name: str
    slug: str
    kind: str
    summary: str


class WorldRegionPageOut(BaseModel):
    items: list[WorldRegionOut]
    pagination: PaginationOut


class CreateWorldRegionIn(BaseModel):
    parent_region_id: str | None = Field(default=None, alias="parentRegionId")
    name: str
    kind: str = "region"
    summary: str = ""


class WorldLocationOut(BaseModel):
    id: str
    world_id: str = Field(alias="worldId")
    region_id: str | None = Field(default=None, alias="regionId")
    name: str
    slug: str
    location_type: str = Field(alias="locationType")
    summary: str


class WorldLocationPageOut(BaseModel):
    items: list[WorldLocationOut]
    pagination: PaginationOut


class CreateWorldLocationIn(BaseModel):
    region_id: str | None = Field(default=None, alias="regionId")
    name: str
    location_type: str = Field(default="landmark", alias="locationType")
    summary: str = ""


class WorldRelationshipOut(BaseModel):
    id: str
    world_id: str = Field(alias="worldId")
    related_world_id: str = Field(alias="relatedWorldId")
    related_name: str = Field(alias="relatedName")
    relationship_type: WorldRelationshipType = Field(alias="relationshipType")
    notes: str
