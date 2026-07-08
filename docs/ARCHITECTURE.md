# Architecture

## Purpose

This repository establishes the engineering foundation for NabhaVerse Studio before any feature delivery begins.

## Architectural Principles

- Clean Architecture is mandatory.
- Domain-Driven Design is mandatory.
- Multi-tenant isolation is mandatory.
- Production code must favor maintainability over delivery speed.

## Monorepo Boundaries

- `apps/web` contains the Next.js presentation application.
- `apps/api` contains FastAPI delivery and application bootstrap code.
- `apps/workers` contains background worker bootstrap code.
- `packages/*` contains shared frontend contracts and utilities.
- `docs/*` contains architectural and operational guidance.

## Layering Rules

Future implementation inside TypeScript packages and Python services must follow this order:

1. `domain`
2. `application`
3. `infrastructure`
4. `presentation`

Allowed dependency direction points inward only:

- `presentation -> application -> domain`
- `infrastructure -> application -> domain`
- `domain` depends on nothing outside itself.

## Shared Package Intent

- `@nabhaverse/ui`: presentation primitives only.
- `@nabhaverse/database`: persistence contracts and integration bootstrap only.
- `@nabhaverse/ai`: provider adapters and orchestration contracts only.
- `@nabhaverse/prompts`: prompt templates and prompt metadata only.
- `@nabhaverse/types`: shared transport-safe types only.
- `@nabhaverse/utils`: framework-agnostic utilities only.
- `@nabhaverse/config`: environment parsing and configuration contracts only.

## Shared Studio Plugin Framework

- Character Studio and World Studio both consume a shared plugin registry in `apps/web/src/features/studio/plugins`.
- Shared navigation and document editing surfaces live in `apps/web/src/components/studio` and are composed by domain-specific workspaces.
- Domain features provide registry metadata, workspace state, and plugin-specific presentation, but do not reimplement the shared shell mechanics.
- This keeps route resolution, section navigation, and document editing behavior consistent across creative studios while preserving bounded-context ownership of world and character content.

## Enforcement

- ESLint `no-restricted-imports` prevents cross-app leakage and protects shared package roles.
- TypeScript package names act as import aliases for approved shared dependencies.
- Python structure mirrors the same architectural layers for future feature work.
- CI validates linting, type checks, tests, and builds on every push and pull request.

## Explicitly Deferred

This foundation does not introduce:

- business logic
- feature workflows
- persistence schemas
- UI implementation
