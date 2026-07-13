from __future__ import annotations

from typing import Any

from nabhaverse_api.domain.auth.permissions import Permission, Role
from pydantic import BaseModel, Field


class StudioOut(BaseModel):
    id: str
    name: str
    slug: str


class MembershipOut(BaseModel):
    id: str
    user_id: str = Field(alias="userId")
    studio: StudioOut
    role: Role
    permissions: list[Permission]


class UserOut(BaseModel):
    id: str
    clerk_user_id: str = Field(alias="clerkUserId")
    email: str | None
    full_name: str | None = Field(alias="fullName")
    avatar_url: str | None = Field(alias="avatarUrl")
    preferences: dict[str, Any]


class SessionOut(BaseModel):
    user: UserOut
    memberships: list[MembershipOut]


class UpdatePreferencesIn(BaseModel):
    preferences: dict[str, Any]


class CreateStudioIn(BaseModel):
    name: str


class PaginationOut(BaseModel):
    total: int
    limit: int
    offset: int


class MembershipPageOut(BaseModel):
    items: list[MembershipOut]
    pagination: PaginationOut


class StudioPageOut(BaseModel):
    items: list[MembershipOut]
    pagination: PaginationOut


class CreateMembershipIn(BaseModel):
    user_id: str = Field(alias="userId")
    role: Role


class UpdateMembershipRoleIn(BaseModel):
    role: Role
