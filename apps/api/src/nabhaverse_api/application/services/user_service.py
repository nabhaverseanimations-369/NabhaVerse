from __future__ import annotations

from fastapi import HTTPException
from nabhaverse_api.application.dto.auth_dto import UserOut
from nabhaverse_api.infrastructure.database.repositories import UserRepository
from sqlalchemy.ext.asyncio import AsyncSession


class UserService:
    def __init__(self, session: AsyncSession) -> None:
        self.users = UserRepository(session)

    async def get_user(self, user_id: str) -> UserOut:
        user = await self.users.get_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        return UserOut(
            id=user.id,
            clerkUserId=user.clerk_user_id,
            email=user.email,
            fullName=user.full_name,
            avatarUrl=user.avatar_url,
            preferences=user.preferences,
        )

    async def update_preferences(self, user_id: str, preferences: dict[str, object]) -> UserOut:
        user = await self.users.get_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        merged = {**user.preferences, **preferences}
        updated = await self.users.update_preferences(user, merged)
        await self.users.session.commit()

        return UserOut(
            id=updated.id,
            clerkUserId=updated.clerk_user_id,
            email=updated.email,
            fullName=updated.full_name,
            avatarUrl=updated.avatar_url,
            preferences=updated.preferences,
        )
