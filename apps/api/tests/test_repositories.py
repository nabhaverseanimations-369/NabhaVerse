from __future__ import annotations

import pytest
from nabhaverse_api.domain.auth.permissions import Role
from nabhaverse_api.infrastructure.database.repositories import (
    CharacterRelationshipRepository,
    CharacterRepository,
    CharacterTagRepository,
    CharacterVersionRepository,
    MembershipRepository,
    RoleRepository,
    StudioRepository,
    UserRepository,
    WorldLocationRepository,
    WorldRegionRepository,
    WorldRepository,
    WorldTagRepository,
    WorldVersionRepository,
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


@pytest.mark.anyio
async def test_character_repositories_support_search_and_relations(
    db_session: AsyncSession,
) -> None:
    users = UserRepository(db_session)
    studios = StudioRepository(db_session)
    roles = RoleRepository(db_session)
    memberships = MembershipRepository(db_session)
    characters = CharacterRepository(db_session)
    tags = CharacterTagRepository(db_session)
    versions = CharacterVersionRepository(db_session)
    relationships = CharacterRelationshipRepository(db_session)

    owner = await users.create(
        clerk_user_id="clerk_character_owner_repo",
        email="character-owner@nabhaverse.test",
        full_name="Character Owner",
        avatar_url=None,
    )
    peer = await users.create(
        clerk_user_id="clerk_character_peer_repo",
        email="character-peer@nabhaverse.test",
        full_name="Character Peer",
        avatar_url=None,
    )
    studio = await studios.create(name="Character Studio", slug="character-studio")
    owner_role = await roles.get_by_name(Role.OWNER)
    assert owner_role is not None

    await memberships.create(user_id=owner.id, studio_id=studio.id, role_id=owner_role.id)

    character = await characters.create(
        studio_id=studio.id,
        owner_user_id=owner.id,
        slug="aurora-vale",
        name="Aurora Vale",
        status="approved",
        summary="Heroic lead character",
        avatar_url=None,
        is_favorite=True,
    )
    await tags.replace_tags(character_id=character.id, tags=["lead", "pilot"])
    version = await versions.create(
        character_id=character.id,
        author_user_id=owner.id,
        label="v1.0",
        summary="Initial baseline",
        snapshot={"kind": "initial"},
        is_active=True,
    )
    await characters.set_active_version(character, version.id)

    counterpart = await characters.create(
        studio_id=studio.id,
        owner_user_id=peer.id,
        slug="nox-7",
        name="Nox-7",
        status="in-review",
        summary="Android tactician",
        avatar_url=None,
        is_favorite=False,
    )
    await relationships.create(
        character_id=character.id,
        related_character_id=counterpart.id,
        relationship_type="team",
        notes="Collaborative tactical pair.",
        created_by_user_id=owner.id,
    )
    await db_session.commit()

    filtered = await characters.list_for_studio(
        studio_id=studio.id,
        query="aurora",
        tags=["lead"],
        status=["approved"],
        owner_user_id=owner.id,
        limit=10,
        offset=0,
    )
    assert len(filtered) == 1
    assert filtered[0].name == "Aurora Vale"

    version_rows = await versions.list_for_character(character_id=character.id, limit=10, offset=0)
    assert len(version_rows) == 1
    assert version_rows[0].label == "v1.0"

    relation_rows = await relationships.list_for_character(
        character_id=character.id, limit=10, offset=0
    )
    assert len(relation_rows) == 1
    assert relation_rows[0].related_character_id == counterpart.id


@pytest.mark.anyio
async def test_world_repositories_support_search_and_hierarchy(db_session: AsyncSession) -> None:
    users = UserRepository(db_session)
    studios = StudioRepository(db_session)
    roles = RoleRepository(db_session)
    memberships = MembershipRepository(db_session)
    worlds = WorldRepository(db_session)
    tags = WorldTagRepository(db_session)
    versions = WorldVersionRepository(db_session)
    regions = WorldRegionRepository(db_session)
    locations = WorldLocationRepository(db_session)

    owner = await users.create(
        clerk_user_id="clerk_world_owner_repo",
        email="world-owner@nabhaverse.test",
        full_name="World Owner",
        avatar_url=None,
    )
    studio = await studios.create(name="World Studio", slug="world-studio")
    owner_role = await roles.get_by_name(Role.OWNER)
    assert owner_role is not None

    await memberships.create(user_id=owner.id, studio_id=studio.id, role_id=owner_role.id)

    world = await worlds.create(
        studio_id=studio.id,
        owner_user_id=owner.id,
        slug="lunara-basin",
        name="Lunara Basin",
        status="published",
        description="Tidal fantasy world",
        cover_image_url=None,
        timeline_summary="Age of treaties",
        is_favorite=True,
    )
    await tags.replace_tags(world_id=world.id, tags=["coastal", "trade"])
    version = await versions.create(
        world_id=world.id,
        author_user_id=owner.id,
        label="v1.0",
        summary="Initial release",
        snapshot={"kind": "initial"},
        is_active=True,
    )
    await worlds.set_active_version(world, version.id)

    region = await regions.create(
        world_id=world.id,
        parent_region_id=None,
        slug="north-coast",
        name="North Coast",
        kind="coastal",
        summary="Trade harbors",
    )
    await locations.create(
        world_id=world.id,
        region_id=region.id,
        slug="lantern-harbor",
        name="Lantern Harbor",
        location_type="city",
        summary="Main trading city",
    )
    await db_session.commit()

    filtered = await worlds.list_for_studio(
        studio_id=studio.id,
        query="lantern",
        tags=["trade"],
        status=["published"],
        region_id=region.id,
        location_id=None,
        limit=10,
        offset=0,
    )
    assert len(filtered) == 1
    assert filtered[0].name == "Lunara Basin"

    region_rows = await regions.list_for_world(world_id=world.id, limit=10, offset=0)
    assert len(region_rows) == 1
    assert region_rows[0].name == "North Coast"

    location_rows = await locations.list_for_world(world_id=world.id, limit=10, offset=0)
    assert len(location_rows) == 1
    assert location_rows[0].name == "Lantern Harbor"
