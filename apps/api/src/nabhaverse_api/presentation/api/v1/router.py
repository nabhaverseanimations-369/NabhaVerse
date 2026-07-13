from __future__ import annotations

from fastapi import APIRouter
from nabhaverse_api.presentation.api.v1 import auth, characters, memberships, studios, users

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(studios.router)
api_router.include_router(memberships.router)
api_router.include_router(characters.router)
