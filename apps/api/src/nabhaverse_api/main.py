from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from nabhaverse_api.infrastructure.config import get_settings
from nabhaverse_api.infrastructure.database.session import init_db
from nabhaverse_api.presentation.api.v1.router import api_router


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    await init_db()
    yield


settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="Authentication and identity services for NabhaVerse Studio.",
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/health", tags=["platform"])
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}
