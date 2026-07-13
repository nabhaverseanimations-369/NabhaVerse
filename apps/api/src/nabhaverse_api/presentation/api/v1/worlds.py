from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query, Response, status
from nabhaverse_api.application.dto.world_dto import (
    CreateWorldIn,
    CreateWorldLocationIn,
    CreateWorldRegionIn,
    CreateWorldVersionIn,
    UpdateWorldIn,
    WorldLocationOut,
    WorldLocationPageOut,
    WorldOut,
    WorldPageOut,
    WorldRegionOut,
    WorldRegionPageOut,
    WorldVersionOut,
    WorldVersionPageOut,
)
from nabhaverse_api.application.services.world_service import WorldService
from nabhaverse_api.infrastructure.database.session import get_session
from nabhaverse_api.presentation.api.dependencies import CurrentAuthContext
from nabhaverse_api.presentation.api.foundation import COMMON_ERROR_RESPONSES
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/worlds", tags=["worlds"])


@router.get(
    "",
    response_model=WorldPageOut,
    summary="List worlds",
    description="List worlds in a studio with search, filters, and pagination.",
    responses=COMMON_ERROR_RESPONSES,
)
async def list_worlds(
    context: CurrentAuthContext,
    session: Annotated[AsyncSession, Depends(get_session)],
    studio_id: Annotated[str, Query(alias="studioId", description="Studio identifier")],
    query: Annotated[str | None, Query()] = None,
    tags: Annotated[list[str] | None, Query()] = None,
    status_filter: Annotated[list[str] | None, Query(alias="status")] = None,
    region_id: Annotated[str | None, Query(alias="regionId")] = None,
    location_id: Annotated[str | None, Query(alias="locationId")] = None,
    limit: Annotated[int, Query(ge=1, le=100)] = 25,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> WorldPageOut:
    service = WorldService(session)
    return await service.list_worlds(
        actor_user_id=context.user_id,
        studio_id=studio_id,
        query=query,
        tags=tags or [],
        status_filters=status_filter or [],
        region_id=region_id,
        location_id=location_id,
        limit=limit,
        offset=offset,
    )


@router.post(
    "",
    response_model=WorldOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create world",
    description="Create a world and seed an initial version.",
    responses=COMMON_ERROR_RESPONSES,
)
async def create_world(
    payload: CreateWorldIn,
    context: CurrentAuthContext,
    session: Annotated[AsyncSession, Depends(get_session)],
    studio_id: Annotated[str, Query(alias="studioId", description="Studio identifier")],
) -> WorldOut:
    service = WorldService(session)
    return await service.create_world(
        actor_user_id=context.user_id,
        studio_id=studio_id,
        payload=payload,
    )


@router.get(
    "/{world_id}",
    response_model=WorldOut,
    summary="Get world",
    description="Return a world by identifier.",
    responses=COMMON_ERROR_RESPONSES,
)
async def get_world(
    world_id: Annotated[str, Path(description="World identifier")],
    context: CurrentAuthContext,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> WorldOut:
    service = WorldService(session)
    return await service.get_world(actor_user_id=context.user_id, world_id=world_id)


@router.patch(
    "/{world_id}",
    response_model=WorldOut,
    summary="Update world",
    description="Update mutable world fields with optimistic concurrency protection.",
    responses=COMMON_ERROR_RESPONSES,
)
async def update_world(
    world_id: Annotated[str, Path(description="World identifier")],
    payload: UpdateWorldIn,
    context: CurrentAuthContext,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> WorldOut:
    service = WorldService(session)
    return await service.update_world(
        actor_user_id=context.user_id,
        world_id=world_id,
        payload=payload,
    )


@router.delete(
    "/{world_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete world",
    description="Soft-delete a world.",
    responses=COMMON_ERROR_RESPONSES,
)
async def delete_world(
    world_id: Annotated[str, Path(description="World identifier")],
    context: CurrentAuthContext,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> Response:
    service = WorldService(session)
    await service.delete_world(actor_user_id=context.user_id, world_id=world_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/{world_id}/versions",
    response_model=WorldVersionPageOut,
    summary="List world versions",
    description="List versions for a world.",
    responses=COMMON_ERROR_RESPONSES,
)
async def list_world_versions(
    world_id: Annotated[str, Path(description="World identifier")],
    context: CurrentAuthContext,
    session: Annotated[AsyncSession, Depends(get_session)],
    limit: Annotated[int, Query(ge=1, le=100)] = 25,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> WorldVersionPageOut:
    service = WorldService(session)
    return await service.list_versions(
        actor_user_id=context.user_id,
        world_id=world_id,
        limit=limit,
        offset=offset,
    )


@router.post(
    "/{world_id}/versions",
    response_model=WorldVersionOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create world version",
    description="Create a new version for a world and optionally mark it active.",
    responses=COMMON_ERROR_RESPONSES,
)
async def create_world_version(
    world_id: Annotated[str, Path(description="World identifier")],
    payload: CreateWorldVersionIn,
    context: CurrentAuthContext,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> WorldVersionOut:
    service = WorldService(session)
    return await service.create_version(
        actor_user_id=context.user_id,
        world_id=world_id,
        payload=payload,
    )


@router.get(
    "/{world_id}/regions",
    response_model=WorldRegionPageOut,
    summary="List world regions",
    description="List regions for a world.",
    responses=COMMON_ERROR_RESPONSES,
)
async def list_world_regions(
    world_id: Annotated[str, Path(description="World identifier")],
    context: CurrentAuthContext,
    session: Annotated[AsyncSession, Depends(get_session)],
    limit: Annotated[int, Query(ge=1, le=100)] = 25,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> WorldRegionPageOut:
    service = WorldService(session)
    return await service.list_regions(
        actor_user_id=context.user_id,
        world_id=world_id,
        limit=limit,
        offset=offset,
    )


@router.post(
    "/{world_id}/regions",
    response_model=WorldRegionOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create world region",
    description="Create a region in a world.",
    responses=COMMON_ERROR_RESPONSES,
)
async def create_world_region(
    world_id: Annotated[str, Path(description="World identifier")],
    payload: CreateWorldRegionIn,
    context: CurrentAuthContext,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> WorldRegionOut:
    service = WorldService(session)
    return await service.create_region(
        actor_user_id=context.user_id,
        world_id=world_id,
        payload=payload,
    )


@router.get(
    "/{world_id}/locations",
    response_model=WorldLocationPageOut,
    summary="List world locations",
    description="List locations for a world.",
    responses=COMMON_ERROR_RESPONSES,
)
async def list_world_locations(
    world_id: Annotated[str, Path(description="World identifier")],
    context: CurrentAuthContext,
    session: Annotated[AsyncSession, Depends(get_session)],
    limit: Annotated[int, Query(ge=1, le=100)] = 25,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> WorldLocationPageOut:
    service = WorldService(session)
    return await service.list_locations(
        actor_user_id=context.user_id,
        world_id=world_id,
        limit=limit,
        offset=offset,
    )


@router.post(
    "/{world_id}/locations",
    response_model=WorldLocationOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create world location",
    description="Create a location in a world.",
    responses=COMMON_ERROR_RESPONSES,
)
async def create_world_location(
    world_id: Annotated[str, Path(description="World identifier")],
    payload: CreateWorldLocationIn,
    context: CurrentAuthContext,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> WorldLocationOut:
    service = WorldService(session)
    return await service.create_location(
        actor_user_id=context.user_id,
        world_id=world_id,
        payload=payload,
    )
