from __future__ import annotations

from enum import StrEnum


class Role(StrEnum):
    OWNER = "owner"
    ADMIN = "admin"
    PRODUCER = "producer"
    ANIMATOR = "animator"
    WRITER = "writer"
    EDITOR = "editor"
    VIEWER = "viewer"


class Permission(StrEnum):
    MANAGE_STUDIO = "manage:studio"
    MANAGE_MEMBERS = "manage:members"
    MANAGE_BILLING = "manage:billing"
    MANAGE_ASSETS = "manage:assets"
    MANAGE_EPISODES = "manage:episodes"
    MANAGE_CHARACTERS = "manage:characters"
    USE_AI_STUDIO = "use:ai_studio"
    VIEW_ANALYTICS = "view:analytics"
    PUBLISH_CONTENT = "publish:content"
    VIEW_CONTENT = "view:content"


ROLE_PERMISSIONS: dict[Role, set[Permission]] = {
    Role.OWNER: {
        Permission.MANAGE_STUDIO,
        Permission.MANAGE_MEMBERS,
        Permission.MANAGE_BILLING,
        Permission.MANAGE_ASSETS,
        Permission.MANAGE_EPISODES,
        Permission.MANAGE_CHARACTERS,
        Permission.USE_AI_STUDIO,
        Permission.VIEW_ANALYTICS,
        Permission.PUBLISH_CONTENT,
        Permission.VIEW_CONTENT,
    },
    Role.ADMIN: {
        Permission.MANAGE_MEMBERS,
        Permission.MANAGE_ASSETS,
        Permission.MANAGE_EPISODES,
        Permission.MANAGE_CHARACTERS,
        Permission.USE_AI_STUDIO,
        Permission.VIEW_ANALYTICS,
        Permission.PUBLISH_CONTENT,
        Permission.VIEW_CONTENT,
    },
    Role.PRODUCER: {
        Permission.MANAGE_ASSETS,
        Permission.MANAGE_EPISODES,
        Permission.MANAGE_CHARACTERS,
        Permission.USE_AI_STUDIO,
        Permission.VIEW_ANALYTICS,
        Permission.PUBLISH_CONTENT,
        Permission.VIEW_CONTENT,
    },
    Role.ANIMATOR: {
        Permission.MANAGE_ASSETS,
        Permission.MANAGE_EPISODES,
        Permission.USE_AI_STUDIO,
        Permission.VIEW_CONTENT,
    },
    Role.WRITER: {
        Permission.MANAGE_EPISODES,
        Permission.MANAGE_CHARACTERS,
        Permission.VIEW_CONTENT,
    },
    Role.EDITOR: {
        Permission.MANAGE_EPISODES,
        Permission.PUBLISH_CONTENT,
        Permission.VIEW_CONTENT,
    },
    Role.VIEWER: {
        Permission.VIEW_CONTENT,
    },
}


def has_permission(role: Role, permission: Permission) -> bool:
    return permission in ROLE_PERMISSIONS.get(role, set())
