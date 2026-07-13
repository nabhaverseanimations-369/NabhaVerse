from __future__ import annotations

import pytest
from fastapi import HTTPException
from nabhaverse_api.application.dto.character_dto import (
    CreateCharacterIn,
    CreateCharacterRelationshipIn,
    CreateCharacterVersionIn,
    UpdateCharacterIn,
)
from nabhaverse_api.application.services.auth_service import AuthService
from nabhaverse_api.application.services.character_service import CharacterService
from nabhaverse_api.application.services.membership_service import MembershipService
from nabhaverse_api.application.services.studio_service import StudioService
from nabhaverse_api.domain.auth.permissions import Role
from nabhaverse_api.infrastructure.auth.clerk import AuthIdentity
from nabhaverse_api.infrastructure.database.repositories import RoleRepository, UserRepository
from sqlalchemy.ext.asyncio import AsyncSession


@pytest.mark.anyio
async def test_auth_service_onboards_user_and_default_studio(db_session: AsyncSession) -> None:
    service = AuthService(db_session)

    context = await service.ensure_user(
        AuthIdentity(
            clerk_user_id="clerk_service_user_1",
            email="service-user@nabhaverse.test",
            full_name="Service User",
            avatar_url=None,
        )
    )

    assert context.clerk_user_id == "clerk_service_user_1"

    session_out = await service.current_session(
        AuthIdentity(
            clerk_user_id="clerk_service_user_1",
            email="service-user@nabhaverse.test",
            full_name="Service User",
            avatar_url=None,
        )
    )
    assert len(session_out.memberships) == 1
    assert session_out.memberships[0].role == Role.OWNER


@pytest.mark.anyio
async def test_studio_service_creates_unique_slugs(db_session: AsyncSession) -> None:
    users = UserRepository(db_session)
    user = await users.create(
        clerk_user_id="clerk_slug_user",
        email="slug@nabhaverse.test",
        full_name="Slug User",
        avatar_url=None,
    )
    await db_session.commit()

    service = StudioService(db_session)
    first = await service.create_studio_for_user(user.id, "Launch Studio")
    second = await service.create_studio_for_user(user.id, "Launch Studio")

    assert first.slug == "launch-studio"
    assert second.slug.startswith("launch-studio-")


@pytest.mark.anyio
async def test_membership_service_assigns_roles(db_session: AsyncSession) -> None:
    auth_service = AuthService(db_session)
    owner = await auth_service.ensure_user(
        AuthIdentity("clerk_owner_service", "owner@nabhaverse.test", "Owner User", None)
    )
    target = await auth_service.ensure_user(
        AuthIdentity("clerk_target_service", "target@nabhaverse.test", "Target User", None)
    )

    owner_session = await auth_service.current_session(
        AuthIdentity("clerk_owner_service", "owner@nabhaverse.test", "Owner User", None)
    )
    studio_id = owner_session.memberships[0].studio.id

    membership_service = MembershipService(db_session)
    created = await membership_service.create_membership(
        actor_user_id=owner.user_id,
        studio_id=studio_id,
        target_user_id=target.user_id,
        role=Role.VIEWER,
    )

    assert created.role == Role.VIEWER

    updated = await membership_service.assign_role(
        actor_user_id=owner.user_id,
        studio_id=studio_id,
        membership_id=created.id,
        role=Role.EDITOR,
    )

    assert updated.role == Role.EDITOR

    roles = RoleRepository(db_session)
    editor_role = await roles.get_by_name(Role.EDITOR)
    assert editor_role is not None


@pytest.mark.anyio
async def test_character_service_flows(db_session: AsyncSession) -> None:
    auth_service = AuthService(db_session)
    owner = await auth_service.ensure_user(
        AuthIdentity("clerk_character_owner", "owner-char@nabhaverse.test", "Owner Char", None)
    )
    collaborator = await auth_service.ensure_user(
        AuthIdentity("clerk_character_collab", "collab@nabhaverse.test", "Collab Char", None)
    )

    owner_session = await auth_service.current_session(
        AuthIdentity("clerk_character_owner", "owner-char@nabhaverse.test", "Owner Char", None)
    )
    studio_id = owner_session.memberships[0].studio.id

    service = CharacterService(db_session)
    created = await service.create_character(
        actor_user_id=owner.user_id,
        studio_id=studio_id,
        payload=CreateCharacterIn(
            name="Aurora Vale",
            status="draft",
            summary="Pilot character",
            tags=["Lead", "Pilot"],
            favorite=True,
        ),
    )
    assert created.name == "Aurora Vale"
    assert created.tags == ["lead", "pilot"]

    updated = await service.update_character(
        actor_user_id=owner.user_id,
        studio_id=studio_id,
        character_id=created.id,
        payload=UpdateCharacterIn(
            status="approved",
            summary="Approved pilot character",
            lockVersion=created.lock_version,
        ),
    )
    assert updated.status == "approved"

    version = await service.create_version(
        actor_user_id=owner.user_id,
        studio_id=studio_id,
        character_id=created.id,
        payload=CreateCharacterVersionIn(
            label="v1.1",
            summary="Refined look",
            snapshot={"change": "visual"},
            active=True,
        ),
    )
    assert version.label == "v1.1"

    membership_service = MembershipService(db_session)
    await membership_service.create_membership(
        actor_user_id=owner.user_id,
        studio_id=studio_id,
        target_user_id=collaborator.user_id,
        role=Role.WRITER,
    )

    related = await service.create_character(
        actor_user_id=owner.user_id,
        studio_id=studio_id,
        payload=CreateCharacterIn(
            name="Nox-7",
            status="in-review",
            summary="Tactician",
            ownerUserId=collaborator.user_id,
            tags=["android"],
        ),
    )

    relationship = await service.create_relationship(
        actor_user_id=owner.user_id,
        studio_id=studio_id,
        character_id=created.id,
        payload=CreateCharacterRelationshipIn(
            relatedCharacterId=related.id,
            relationshipType="team",
            notes="Operational pair",
        ),
    )
    assert relationship.relationship_type == "team"

    listed = await service.list_characters(
        actor_user_id=owner.user_id,
        studio_id=studio_id,
        query="aurora",
        tags=["lead"],
        status_filters=["approved"],
        owner_user_id=None,
        limit=25,
        offset=0,
    )
    assert listed.pagination.total >= 1
    assert listed.items[0].id == created.id


@pytest.mark.anyio
async def test_character_service_rejects_owner_outside_studio(db_session: AsyncSession) -> None:
    auth_service = AuthService(db_session)
    owner = await auth_service.ensure_user(
        AuthIdentity("clerk_owner_for_boundary", "owner-boundary@nabhaverse.test", "Owner", None)
    )
    external = await auth_service.ensure_user(
        AuthIdentity(
            "clerk_external_owner",
            "external-owner@nabhaverse.test",
            "External Owner",
            None,
        )
    )

    owner_session = await auth_service.current_session(
        AuthIdentity("clerk_owner_for_boundary", "owner-boundary@nabhaverse.test", "Owner", None)
    )
    studio_id = owner_session.memberships[0].studio.id

    service = CharacterService(db_session)
    with pytest.raises(HTTPException) as excinfo:
        await service.create_character(
            actor_user_id=owner.user_id,
            studio_id=studio_id,
            payload=CreateCharacterIn(
                name="Boundary Character",
                status="draft",
                ownerUserId=external.user_id,
            ),
        )

    assert excinfo.value.status_code == 404
    assert excinfo.value.detail == "Owner is not a member of this studio"
