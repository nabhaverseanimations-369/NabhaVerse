from __future__ import annotations

import pytest
from fastapi import HTTPException
from nabhaverse_api.domain.worlds.services import WorldDomainService


def test_world_domain_normalizes_tags_and_filters() -> None:
    service = WorldDomainService()

    tags = service.normalize_tags([" Coastal ", "coastal", "Trade", ""])
    assert tags == ["coastal", "trade"]

    filters = service.normalize_filters(
        query="  Lunara  ",
        tags=["Trade", ""],
        status=["draft"],
        region_id="region-1",
        location_id="location-1",
    )
    assert filters.query == "Lunara"
    assert filters.tags == ["trade"]
    assert filters.status == ["draft"]


def test_world_domain_rejects_invalid_status() -> None:
    service = WorldDomainService()
    with pytest.raises(HTTPException) as excinfo:
        service.validate_status("unknown")
    assert excinfo.value.status_code == 422


def test_world_domain_rejects_invalid_relationship_pair() -> None:
    service = WorldDomainService()
    with pytest.raises(HTTPException) as excinfo:
        service.validate_relationship_pair(world_id="w1", related_world_id="w1")
    assert excinfo.value.status_code == 422


def test_world_domain_validates_timeline_consistency() -> None:
    service = WorldDomainService()
    with pytest.raises(HTTPException) as excinfo:
        service.validate_timeline_consistency(start_year=10, end_year=5)
    assert excinfo.value.status_code == 422
