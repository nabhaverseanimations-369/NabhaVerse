from __future__ import annotations

import asyncio
from collections.abc import AsyncIterator, Iterator
from pathlib import Path
from typing import Any

import pytest
from nabhaverse_api.infrastructure.config import get_settings
from nabhaverse_api.infrastructure.database.session import SessionFactory, engine, init_db


@pytest.fixture
def auth_headers() -> Iterator[dict[str, str]]:
    yield {
        "X-Clerk-User-Id": "user_owner_001",
        "X-Clerk-Email": "owner@nabhaverse.test",
        "X-Clerk-Name": "Owner User",
    }


@pytest.fixture
def initialized_db() -> Iterator[None]:
    get_settings.cache_clear()
    asyncio.run(engine.dispose())
    Path("nabhaverse.db").unlink(missing_ok=True)
    asyncio.run(init_db())
    yield
    get_settings.cache_clear()
    asyncio.run(engine.dispose())
    Path("nabhaverse.db").unlink(missing_ok=True)


@pytest.fixture
async def db_session(initialized_db: None) -> AsyncIterator[Any]:
    async with SessionFactory() as session:
        yield session
