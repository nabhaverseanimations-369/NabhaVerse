# Changelog

## Unreleased

### Added

- World Studio workspace powered by the shared Studio Plugin Framework.
- Reusable World Studio components, Storybook stories, and focused tests for library, navigation, workspace, and plugin loading.
- Documentation updates for shared studio architecture and Storybook workflow.
- Episode Studio workspace powered by the shared Studio SDK, including reusable Episode panels, library routing, and plugin navigation.
- Shared Studio SDK reference contracts for Episode Studio integration with lightweight character, world, location, and asset references.

### Changed

- World and Character workspaces now share common navigation and document editor surfaces instead of duplicating shell logic.
- Episode Studio now consumes shared reference contracts instead of depending directly on Character Studio or World Studio implementation details.
