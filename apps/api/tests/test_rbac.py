from nabhaverse_api.domain.auth.permissions import Permission, Role, has_permission


def test_owner_has_manage_studio_permission() -> None:
    assert has_permission(Role.OWNER, Permission.MANAGE_STUDIO)


def test_viewer_cannot_manage_members() -> None:
    assert not has_permission(Role.VIEWER, Permission.MANAGE_MEMBERS)
