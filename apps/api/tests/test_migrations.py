from __future__ import annotations

from pathlib import Path

from alembic import command
from alembic.config import Config
from pytest import MonkeyPatch
from sqlalchemy import create_engine, inspect


def test_alembic_upgrade_creates_identity_and_studio_tables(
    tmp_path: Path,
    monkeypatch: MonkeyPatch,
) -> None:
    database_path = tmp_path / "migration_test.db"
    monkeypatch.setenv("DATABASE_URL", f"sqlite+aiosqlite:///{database_path}")

    from nabhaverse_api.infrastructure.config import get_settings

    get_settings.cache_clear()
    config = Config("apps/api/alembic.ini")
    command.upgrade(config, "head")

    engine = create_engine(f"sqlite:///{database_path}")
    try:
        tables = set(inspect(engine).get_table_names())
    finally:
        engine.dispose()

    assert {
        "users",
        "studios",
        "roles",
        "permissions",
        "role_permissions",
        "memberships",
    }.issubset(tables)
    get_settings.cache_clear()
