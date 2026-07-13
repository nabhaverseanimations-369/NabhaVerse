from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query, Response, status
from nabhaverse_api.application.dto.character_dto import (
    CharacterOut,
    CharacterPageOut,
    CharacterRelationshipOut,
    CharacterRelationshipPageOut,
    CharacterVersionOut,
    CharacterVersionPageOut,
    CreateCharacterIn,
    CreateCharacterRelationshipIn,
    CreateCharacterVersionIn,
    UpdateCharacterIn,
)
from nabhaverse_api.application.services.character_service import CharacterService
from nabhaverse_api.infrastructure.database.session import get_session
from nabhaverse_api.presentation.api.dependencies import CurrentAuthContext
from nabhaverse_api.presentation.api.foundation import COMMON_ERROR_RESPONSES
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/characters", tags=["characters"])


@router.get(
    "",
    response_model=CharacterPageOut,
    summary="List characters",
    description=(
        "List characters in a studio with PostgreSQL-backed " "search, filters, and pagination."
    ),
    responses=COMMON_ERROR_RESPONSES,
)
async def list_characters(
    context: CurrentAuthContext,
    session: Annotated[AsyncSession, Depends(get_session)],
    studio_id: Annotated[str, Query(alias="studioId", description="Studio identifier")],
    query: Annotated[str | None, Query()] = None,
    tags: Annotated[list[str] | None, Query()] = None,
    status_filter: Annotated[list[str] | None, Query(alias="status")] = None,
    owner_user_id: Annotated[str | None, Query(alias="ownerUserId")] = None,
    limit: Annotated[int, Query(ge=1, le=100)] = 25,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> CharacterPageOut:
    service = CharacterService(session)
    return await service.list_characters(
        actor_user_id=context.user_id,
        studio_id=studio_id,
        query=query,
        tags=tags or [],
        status_filters=status_filter or [],
        owner_user_id=owner_user_id,
        limit=limit,
        offset=offset,
    )


@router.post(
    "",
    response_model=CharacterOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create character",
    description="Create a character, attach tags, and seed an initial version.",
    responses=COMMON_ERROR_RESPONSES,
)
async def create_character(
    payload: CreateCharacterIn,
    context: CurrentAuthContext,
    session: Annotated[AsyncSession, Depends(get_session)],
    studio_id: Annotated[str, Query(alias="studioId", description="Studio identifier")],
) -> CharacterOut:
    service = CharacterService(session)
    return await service.create_character(
        actor_user_id=context.user_id,
        studio_id=studio_id,
        payload=payload,
    )


@router.get(
    "/{character_id}",
    response_model=CharacterOut,
    summary="Get character",
    description="Return a single character by identifier.",
    responses=COMMON_ERROR_RESPONSES,
)
async def get_character(
    character_id: Annotated[str, Path(description="Character identifier")],
    context: CurrentAuthContext,
    session: Annotated[AsyncSession, Depends(get_session)],
    studio_id: Annotated[str, Query(alias="studioId", description="Studio identifier")],
) -> CharacterOut:
    service = CharacterService(session)
    return await service.get_character(
        actor_user_id=context.user_id,
        studio_id=studio_id,
        character_id=character_id,
    )


@router.patch(
    "/{character_id}",
    response_model=CharacterOut,
    summary="Update character",
    description="Update mutable character fields with optimistic concurrency protection.",
    responses=COMMON_ERROR_RESPONSES,
)
async def update_character(
    character_id: Annotated[str, Path(description="Character identifier")],
    payload: UpdateCharacterIn,
    context: CurrentAuthContext,
    session: Annotated[AsyncSession, Depends(get_session)],
    studio_id: Annotated[str, Query(alias="studioId", description="Studio identifier")],
) -> CharacterOut:
    service = CharacterService(session)
    return await service.update_character(
        actor_user_id=context.user_id,
        studio_id=studio_id,
        character_id=character_id,
        payload=payload,
    )


@router.delete(
    "/{character_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete character",
    description="Soft-delete a character.",
    responses=COMMON_ERROR_RESPONSES,
)
async def delete_character(
    character_id: Annotated[str, Path(description="Character identifier")],
    context: CurrentAuthContext,
    session: Annotated[AsyncSession, Depends(get_session)],
    studio_id: Annotated[str, Query(alias="studioId", description="Studio identifier")],
) -> Response:
    service = CharacterService(session)
    await service.delete_character(
        actor_user_id=context.user_id,
        studio_id=studio_id,
        character_id=character_id,
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/{character_id}/versions",
    response_model=CharacterVersionPageOut,
    summary="List character versions",
    description="List versions for a character.",
    responses=COMMON_ERROR_RESPONSES,
)
async def list_character_versions(
    character_id: Annotated[str, Path(description="Character identifier")],
    context: CurrentAuthContext,
    session: Annotated[AsyncSession, Depends(get_session)],
    studio_id: Annotated[str, Query(alias="studioId", description="Studio identifier")],
    limit: Annotated[int, Query(ge=1, le=100)] = 25,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> CharacterVersionPageOut:
    service = CharacterService(session)
    return await service.list_versions(
        actor_user_id=context.user_id,
        studio_id=studio_id,
        character_id=character_id,
        limit=limit,
        offset=offset,
    )


@router.post(
    "/{character_id}/versions",
    response_model=CharacterVersionOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create character version",
    description="Create a new version entry for a character and optionally mark it active.",
    responses=COMMON_ERROR_RESPONSES,
)
async def create_character_version(
    character_id: Annotated[str, Path(description="Character identifier")],
    payload: CreateCharacterVersionIn,
    context: CurrentAuthContext,
    session: Annotated[AsyncSession, Depends(get_session)],
    studio_id: Annotated[str, Query(alias="studioId", description="Studio identifier")],
) -> CharacterVersionOut:
    service = CharacterService(session)
    return await service.create_version(
        actor_user_id=context.user_id,
        studio_id=studio_id,
        character_id=character_id,
        payload=payload,
    )


@router.get(
    "/{character_id}/relationships",
    response_model=CharacterRelationshipPageOut,
    summary="List character relationships",
    description="List relationships for a character.",
    responses=COMMON_ERROR_RESPONSES,
)
async def list_character_relationships(
    character_id: Annotated[str, Path(description="Character identifier")],
    context: CurrentAuthContext,
    session: Annotated[AsyncSession, Depends(get_session)],
    studio_id: Annotated[str, Query(alias="studioId", description="Studio identifier")],
    limit: Annotated[int, Query(ge=1, le=100)] = 25,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> CharacterRelationshipPageOut:
    service = CharacterService(session)
    return await service.list_relationships(
        actor_user_id=context.user_id,
        studio_id=studio_id,
        character_id=character_id,
        limit=limit,
        offset=offset,
    )


@router.post(
    "/{character_id}/relationships",
    response_model=CharacterRelationshipOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create character relationship",
    description="Create a directed relationship between two characters.",
    responses=COMMON_ERROR_RESPONSES,
)
async def create_character_relationship(
    character_id: Annotated[str, Path(description="Character identifier")],
    payload: CreateCharacterRelationshipIn,
    context: CurrentAuthContext,
    session: Annotated[AsyncSession, Depends(get_session)],
    studio_id: Annotated[str, Query(alias="studioId", description="Studio identifier")],
) -> CharacterRelationshipOut:
    service = CharacterService(session)
    return await service.create_relationship(
        actor_user_id=context.user_id,
        studio_id=studio_id,
        character_id=character_id,
        payload=payload,
    )
