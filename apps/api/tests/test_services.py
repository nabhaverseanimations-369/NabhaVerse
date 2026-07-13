from __future__ import annotations

import pytest
from nabhaverse_api.application.services.auth_service import AuthService
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
