# Studio SDK Architecture

## Philosophy

The Studio SDK is the shared platform contract for all workspace modules in NabhaVerse:

- Character
- World
- Episode
- Asset
- AI
- Production

Its purpose is to standardize cross-studio behavior while keeping each bounded context autonomous.

Core principles:

- Contracts-first design: studios depend on interfaces, not implementation details.
- Provider-agnostic foundations: search and command systems are abstracted for future backend/runtime providers.
- Reusable UX primitives: navigation, draft/save state, editor shell, and comment shell are shared.
- Extensible by composition: studios define their own registries and panels using SDK factories.

## Public APIs

The SDK public surface (exported from packages/studio-sdk/src/index.ts) includes:

- Contracts
  : plugin, workspace, workspace-state, document-editor, navigation, search, command, filter, reference, comment, activity, attachment, version-timeline.

- Hooks
  : useStudioDocumentDraft, useStudioSidebarState.

- Components
  : StudioPluginNavigation, StudioDocumentEditor, StudioCommentPanel.

- Utilities
  : filtering helpers for query/search and pagination.

- Testing helpers
  : plugin registry assertion and ID helper utilities.

## Plugin Lifecycle

1. Registration
   : a studio defines a typed plugin registry (StudioPluginDefinition[]) and uses createStudioDocumentPlugin for defaults.

2. Activation
   : route parameters are resolved to a plugin ID via resolveStudioRouteSegment.

3. Rendering
   : plugin ID maps to a component through registry lookup (getStudioPluginOrThrow or local typed wrappers).

4. Validation and flags
   : each plugin declares permissions, validation checkpoints, and feature flags.

5. Navigation
   : StudioPluginNavigation renders canonical links and active state.

## Reference Model

Reference contracts provide lightweight cross-context links without loading full domain objects:

- CharacterReference
- WorldReference
- LocationReference
- EpisodeReference
- AssetReference
- AIJobReference
- PromptReference
- ModelReference
- ProductionTaskReference
- ReviewReference
- MilestoneReference

References are intentionally minimal and identifier-centric to reduce coupling.

## Cross-Studio Communication

Cross-studio integration in this phase remains contract-based and UI-oriented:

- Plugin registries and shell routing rely on shared SDK interfaces.
- Draft/save transitions use the same workspace-state helpers.
- Navigation behavior uses shared route resolution contracts.
- Global search is provider-agnostic and composable through StudioSearchProvider.
- Command architecture is registry-based and decoupled from execution runtime.

Backend orchestration, indexing, realtime events, and notifications are out of scope for this iteration.

## Extension Guidelines

When adding a new studio or extending an existing one:

1. Define typed domain models inside the studio feature slice.
2. Build plugin registry entries with shared SDK factories.
3. Reuse shared shell behaviors:

- route segment resolution
- sidebar state
- draft/save state

4. Register search providers and commands through contracts, not hardcoded UI logic.
5. Add focused tests for:

- plugin registry shape and ordering
- navigation resolution
- hook behavior
- search/command helper logic

6. Keep contracts backward compatible where possible.

## Performance Notes

Current safe optimizations adopted in Epic 9.5:

- Deduplicated route parsing and plugin lookups to reduce repeated logic and drift.
- Provider-based search architecture to avoid tight coupling and support incremental indexing strategies.
- Registry-based command model to enable future lazy command loading and feature-flagged command sets.

Future optimization candidates:

- Per-plugin dynamic imports for heavy studio panels.
- Command/search provider chunk splitting per workspace scope.
- Optional prefetch policies for common studio routes.
