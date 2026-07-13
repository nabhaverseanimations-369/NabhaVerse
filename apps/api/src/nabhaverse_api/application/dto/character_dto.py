from __future__ import annotations

from typing import Any, Literal

from nabhaverse_api.application.dto.auth_dto import PaginationOut
from pydantic import BaseModel, Field

CharacterStatus = Literal["draft", "in-review", "approved", "archived"]
RelationshipType = Literal["ally", "rival", "mentor", "family", "team"]


class CharacterOut(BaseModel):
    id: str
    slug: str
    name: str
    avatar_url: str | None = Field(default=None, alias="avatarUrl")
    status: CharacterStatus
    owner: str
    studio: str
    tags: list[str]
    favorite: bool
    recently_opened_at: str | None = Field(default=None, alias="recentlyOpenedAt")
    updated_at: str = Field(alias="updatedAt")
    version: str
    summary: str
    lock_version: int = Field(alias="lockVersion")


class CharacterPageOut(BaseModel):
    items: list[CharacterOut]
    pagination: PaginationOut


class CreateCharacterIn(BaseModel):
    name: str
    status: CharacterStatus = "draft"
    summary: str = ""
    avatar_url: str | None = Field(default=None, alias="avatarUrl")
    owner_user_id: str | None = Field(default=None, alias="ownerUserId")
    tags: list[str] = Field(default_factory=list)
    favorite: bool = False
    initial_version_label: str = Field(default="v1.0", alias="initialVersionLabel")


class UpdateCharacterIn(BaseModel):
    name: str | None = None
    status: CharacterStatus | None = None
    summary: str | None = None
    avatar_url: str | None = Field(default=None, alias="avatarUrl")
    owner_user_id: str | None = Field(default=None, alias="ownerUserId")
    tags: list[str] | None = None
    favorite: bool | None = None
    lock_version: int = Field(alias="lockVersion")


class CharacterVersionOut(BaseModel):
    id: str
    character_id: str = Field(alias="characterId")
    label: str
    created_at: str = Field(alias="createdAt")
    author: str
    summary: str
    active: bool


class CharacterVersionPageOut(BaseModel):
    items: list[CharacterVersionOut]
    pagination: PaginationOut


class CreateCharacterVersionIn(BaseModel):
    label: str
    summary: str = ""
    snapshot: dict[str, Any] = Field(default_factory=dict)
    active: bool = True


class CharacterRelationshipOut(BaseModel):
    id: str
    character_id: str = Field(alias="characterId")
    related_character_id: str = Field(alias="relatedCharacterId")
    related_name: str = Field(alias="relatedName")
    relationship_type: RelationshipType = Field(alias="relationshipType")
    notes: str


class CharacterRelationshipPageOut(BaseModel):
    items: list[CharacterRelationshipOut]
    pagination: PaginationOut


class CreateCharacterRelationshipIn(BaseModel):
    related_character_id: str = Field(alias="relatedCharacterId")
    relationship_type: RelationshipType = Field(alias="relationshipType")
    notes: str = ""
