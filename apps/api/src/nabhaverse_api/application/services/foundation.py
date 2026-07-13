from __future__ import annotations

from fastapi import HTTPException, status
from nabhaverse_api.application.dto.auth_dto import PaginationOut
from nabhaverse_api.domain.auth.permissions import Permission, Role, has_permission
from nabhaverse_api.infrastructure.database.models import MembershipModel, UserModel
from nabhaverse_api.infrastructure.database.repositories import MembershipRepository, UserRepository


def to_pagination(*, total: int, limit: int, offset: int) -> PaginationOut:
    return PaginationOut(total=total, limit=limit, offset=offset)


def not_found(detail: str) -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


def forbidden(detail: str = "Missing permission") -> HTTPException:
    return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


def conflict(detail: str) -> HTTPException:
    return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=detail)


def unprocessable(detail: str) -> HTTPException:
    return HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail)


def require_entity[TEntity](entity: TEntity | None, *, detail: str) -> TEntity:
    if entity is None:
        raise not_found(detail)
    return entity


async def require_user(
    users: UserRepository,
    user_id: str,
    *,
    detail: str = "User not found",
) -> UserModel:
    user = await users.get_by_id(user_id)
    return require_entity(user, detail=detail)


class AccessContext:
    def __init__(self, memberships: MembershipRepository, users: UserRepository) -> None:
        self.memberships = memberships
        self.users = users

    async def require_membership(self, *, user_id: str, studio_id: str) -> MembershipModel:
        membership = await self.memberships.get_by_user_and_studio(
            user_id=user_id,
            studio_id=studio_id,
        )
        return require_entity(membership, detail="Membership not found")

    async def require_permission(
        self,
        *,
        actor_user_id: str,
        studio_id: str,
        permission: Permission,
    ) -> MembershipModel:
        membership = await self.require_membership(user_id=actor_user_id, studio_id=studio_id)
        role = Role(membership.role.name)
        if not has_permission(role, permission):
            raise forbidden()
        return membership

    async def require_user(self, user_id: str, *, detail: str = "User not found") -> UserModel:
        return await require_user(self.users, user_id, detail=detail)
