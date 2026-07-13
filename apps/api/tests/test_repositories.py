from __future__ import annotations

import pytest
from nabhaverse_api.domain.auth.permissions import Role
from nabhaverse_api.infrastructure.database.repositories import (
    MembershipRepository,
    RoleRepository,
    StudioRepository,
    UserRepository,
)
from sqlalchemy.ext.asyncio import AsyncSession


@pytest.mark.anyio
async def test_user_repository_create_and_lookup(db_session: AsyncSession) -> None:
    repository = UserRepository(db_session)

    created = await repository.create(
        clerk_user_id="clerk_repo_user_1",
        email="repo-user@nabhaverse.test",
        full_name="Repo User",
        avatar_url=None,
    )
    await db_session.commit()

    by_clerk = await repository.get_by_clerk_user_id("clerk_repo_user_1")
    by_email = await repository.get_by_email("repo-user@nabhaverse.test")

    assert by_clerk is not None
    assert by_email is not None
    assert created.id == by_clerk.id == by_email.id


@pytest.mark.anyio
async def test_studio_and_membership_repositories(db_session: AsyncSession) -> None:
    users = UserRepository(db_session)
    studios = StudioRepository(db_session)
    roles = RoleRepository(db_session)
    memberships = MembershipRepository(db_session)

    user = await users.create(
        clerk_user_id="clerk_repo_owner_1",
        email="owner-repo@nabhaverse.test",
        full_name="Owner Repo",
        avatar_url=None,
    )
    studio = await studios.create(name="Repo Studio", slug="repo-studio")
    owner_role = await roles.get_by_name(Role.OWNER)

    assert owner_role is not None

    membership = await memberships.create(
        user_id=user.id,
        studio_id=studio.id,
        role_id=owner_role.id,
    )
    await db_session.commit()

    fetched = await memberships.get_by_user_and_studio(user_id=user.id, studio_id=studio.id)
    assert fetched is not None
    assert fetched.id == membership.id

    listed = await memberships.list_for_studio(studio_id=studio.id, limit=10, offset=0)
    assert len(listed) == 1

    count = await memberships.count_for_studio(studio_id=studio.id)
    assert count == 1
