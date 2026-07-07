# NabhaVerse Studio — Engineering Handbook

> This file is the permanent instruction set for every GitHub Copilot session in this repository.  
> Every contributor and every AI agent works within these boundaries.

---

## Project Overview

**NabhaVerse Studio** is an AI Operating System for Animated Storytelling.

- Built as a long-term, enterprise-grade SaaS platform.
- Enables creators to design, produce, and publish complete animated universes.
- Combines AI services, creative tools, and production pipeline infrastructure.
- Documentation-first development — architecture is designed and approved before implementation begins.

---

## Technology Stack

### Frontend

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 16.x | React framework, SSR/SSG, App Router |
| React | 19.x | UI library |
| TypeScript | 5.x | Strict static typing |
| Tailwind CSS | 4.x | Utility-first styling |
| shadcn/ui | Latest | Accessible component primitives |
| TanStack Query | 5.x | Server state management, caching |
| React Hook Form | 7.x | Form state and validation |
| Zod | 3.x | Schema validation (client + server shared) |
| Framer Motion | 11.x | Animations and transitions |

### Backend

| Tool | Version | Purpose |
|---|---|---|
| FastAPI | Latest | Python web framework, OpenAPI |
| SQLAlchemy | 2.x | ORM (async) |
| Pydantic | 2.x | Data validation and settings |
| Alembic | Latest | Database migrations |
| Celery | 5.x | Background job queue |
| JWT | — | Authentication tokens |
| Python | 3.12+ | Runtime |

### Databases and Storage

| Service | Purpose |
|---|---|
| PostgreSQL 15+ | Primary relational database |
| Redis | Cache, Celery broker, session store |
| Supabase Storage | File and asset storage |

### Infrastructure

| Tool | Purpose |
|---|---|
| Turborepo | Monorepo build orchestration |
| pnpm | Package manager |
| Docker | Containerisation |
| GitHub Actions | CI/CD |
| Vercel | Frontend deployment |
| Railway / Fly.io | Backend deployment |

### Testing

| Tool | Scope |
|---|---|
| Vitest | Frontend unit tests |
| Playwright | End-to-end tests |
| pytest | Backend unit and integration tests |
| axe-core | Automated accessibility tests |
| Chromatic | Visual regression tests (Storybook) |

### Code Quality

| Tool | Scope |
|---|---|
| ESLint | TypeScript/JavaScript linting |
| Prettier | TypeScript/JavaScript formatting |
| Ruff | Python linting (replaces flake8, isort) |
| Black | Python formatting |
| MyPy | Python static type checking |
| Pre-commit | Git hooks for automated checks |

---

## Architecture Principles

### Clean Architecture

- Separate concerns into layers: domain, application, infrastructure, presentation.
- Inner layers have no dependencies on outer layers.
- Business rules never depend on frameworks or databases.

### Domain-Driven Design (DDD)

- Organise code around bounded contexts: `character`, `episode`, `world`, `asset`, `ai`, `production`.
- Each bounded context owns its entities, repositories, and services.
- Use domain events for cross-context communication.

### SOLID Principles

- **S** — Single Responsibility: each module, class, and function does one thing.
- **O** — Open/Closed: extend behaviour via composition, not modification.
- **L** — Liskov Substitution: substitutable implementations behind interfaces.
- **I** — Interface Segregation: small, focused interfaces.
- **D** — Dependency Inversion: depend on abstractions, not concretions.

### Feature-First Organisation

```
apps/web/src/features/
├── character/
│   ├── api/          ← API client functions
│   ├── components/   ← Feature-specific components
│   ├── hooks/        ← Feature-specific hooks
│   ├── schemas/      ← Zod schemas
│   ├── types/        ← TypeScript types
│   └── index.ts      ← Public API
```

### Event-Driven Where Appropriate

- Domain events decouple modules from each other.
- The transactional outbox pattern guarantees at-least-once delivery.
- Consumers are never synchronously coupled to producers.

---

## Development Rules

| Rule | Description |
|---|---|
| No quick hacks | Every solution must be production-ready. If there is no clean solution, discuss first. |
| No duplicated business logic | Extract shared logic into domain services or shared packages. |
| Loose coupling | Modules communicate via interfaces and events, not direct imports across bounded contexts. |
| Reusable components | UI components live in `packages/ui`. Never duplicate component logic in `apps/`. |
| Documentation before implementation | Architecture must be documented and approved before code is written. |
| Architecture before features | Database, design system, API contracts first — then application features. |
| Production-ready by default | No TODO comments, no commented-out code, no placeholder logic in merged branches. |

---

## Git Workflow

### Branch Naming

Branch names must use an approved prefix followed by lowercase kebab-case:

```
feature/    → New features
fix/        → Bug fixes
chore/      → Maintenance, dependency updates
docs/       → Documentation changes
refactor/   → Code refactoring (no behaviour change)
test/       → Test additions or changes
ci/         → CI/CD changes
build/      → Build system changes
infra/      → Infrastructure changes
copilot/    → AI-assisted branches
```

Examples:
```
feature/character-master-profile
fix/asset-upload-validation
docs/sprint-3-design-system
copilot/extend-architecture-documentation
```

### Commit Messages

Follow **Conventional Commits**:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`, `perf`

Examples:
```
feat(character): add master profile form
fix(assets): resolve file upload MIME type validation
docs(architecture): extend database schema with event system
```

### Pull Request Rules

- Never commit directly to `main`.
- Every feature requires a Pull Request with a description.
- PRs must pass all CI checks before merge.
- Request review from at least one team member.
- Squash merges preferred for feature branches.

---

## Coding Standards

### TypeScript

- **Strict mode always on.** `"strict": true` in `tsconfig.json`.
- Use `interface` for object shapes, `type` for unions and intersections.
- No `any` — use `unknown` and narrow via type guards.
- No `as` type assertions without a comment explaining why they are safe.
- Prefer named exports over default exports (exceptions: Next.js pages, layouts).
- Always type function parameters and return values explicitly in public APIs.
- Use `readonly` for data that should not be mutated.

### Python

- Python 3.12+ features are available.
- Type hints on every function signature, every class attribute.
- Use Pydantic models for all request/response validation.
- Use `from __future__ import annotations` for forward references.
- Follow Google Python style guide for docstrings.
- No mutable default arguments (`def f(items=[])` is forbidden).

### File and Folder Naming

| Item | Convention |
|---|---|
| React components | `PascalCase.tsx` |
| React hooks | `useCamelCase.ts` |
| Utility functions | `camelCase.ts` |
| Type files | `camelCase.types.ts` |
| Test files | `ComponentName.test.tsx` or `module.test.ts` |
| Story files | `ComponentName.stories.tsx` |
| Python modules | `snake_case.py` |
| Python classes | `PascalCase` |
| Python functions | `snake_case` |
| Folders (TS) | `kebab-case/` |
| Folders (Python) | `snake_case/` |

---

## UI Principles

### Accessibility First

- Every component must meet WCAG 2.1 Level AA.
- All interactive elements must be keyboard accessible.
- All icons that convey meaning must have `aria-label`.
- Focus management must be explicit (modals trap focus; focus returns on close).
- `prefers-reduced-motion` must be respected in all animations.

### Responsive Design

- Mobile-first: design for the smallest viewport, then enhance upward.
- Breakpoints: `xs` (0), `sm` (640), `md` (768), `lg` (1024), `xl` (1280), `2xl` (1536).
- No fixed pixel widths on page-level containers.

### Consistent Design System

- All UI comes from `packages/ui` or `shadcn/ui`.
- Never write inline styles in application code.
- All colours, spacing, and typography reference design tokens.
- Never hardcode hex values or pixel sizes in component files.

### Light and Dark Themes

- Default theme: **dark**.
- All semantic token pairs must meet contrast requirements in both themes.
- Theme state persists in `localStorage`, falls back to `prefers-color-scheme`.

### Storybook

- Every shared UI component must have a Storybook story before it is merged.
- Stories must cover: Default, Loading, Error, Empty, Disabled, DarkTheme, Mobile.

---

## AI Principles

### Provider Pattern

- All AI provider calls go through an adapter interface.
- Business logic never imports provider SDKs directly.
- Switching providers requires only a new adapter — no business logic changes.

```python
class AIProvider(Protocol):
    async def complete(self, request: CompletionRequest) -> CompletionResponse: ...
    async def generate_image(self, request: ImageRequest) -> ImageResponse: ...
```

### Prompt Versioning

- Prompts are versioned entities in the database (`prompt_templates`, `prompt_versions`).
- Prompt content uses `{{variable}}` placeholders resolved at runtime.
- Never hardcode prompts in application code.

### AI Jobs

- Every AI operation is a tracked job in `ai_jobs`.
- Jobs have steps (`ai_job_steps`), outputs (`ai_outputs`), and provider logs (`ai_provider_logs`).
- Jobs are submitted to the Celery queue, never executed inline in API handlers.

### Background Workers

- AI work is always async — never block an HTTP request waiting for an AI response.
- Celery workers process jobs; results are pushed via WebSocket or polling.

### Retry and Observability

- All AI jobs have configurable `max_attempts` with exponential backoff.
- Provider latency, token usage, and cost are logged in `ai_provider_logs`.
- Failed jobs surface in the UI with actionable error messages.

### No Provider-Specific Business Logic

- Error handling, retry logic, and output parsing live in adapters.
- The domain layer receives structured `CompletionResponse` objects, not raw API responses.

---

## Database Principles

### PostgreSQL

- PostgreSQL 15+ is the only permitted relational database.
- No MySQL, SQLite (except tests), or NoSQL for primary storage.

### UUID Primary Keys

- All tables use `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`.
- No integer auto-increment primary keys.

### Soft Deletes

- Rows are never physically deleted.
- Use `deleted_at TIMESTAMPTZ` (NULL = active).
- All queries on soft-deletable tables must filter `WHERE deleted_at IS NULL` unless intentionally querying deleted records.

### Audit Logging

- All entity tables carry `created_at`, `updated_at`, `created_by`, `updated_by`.
- Use database triggers or SQLAlchemy event listeners to keep `updated_at` current.

### Multi-Tenancy

- Every tenant-owned table has `studio_id UUID NOT NULL REFERENCES studios(id)`.
- Row Level Security (RLS) policies enforce tenant isolation at the database layer.

### Row Level Security

- RLS is enabled on all `studio_id`-scoped tables.
- Application roles use the policy: `studio_id IN (SELECT studio_id FROM studio_memberships WHERE user_id = auth.uid())`.

### Proper Indexing

- Every foreign key column has an index.
- Every filterable column used in application queries has an index.
- Every `deleted_at` column has a partial index: `WHERE deleted_at IS NULL`.
- Use `CREATE INDEX CONCURRENTLY` in production migrations.

---

## Security Principles

### Least Privilege

- Database roles have only the permissions they need.
- Service accounts cannot read other tenants' data (enforced by RLS).
- API keys are scoped to specific resources and operations.

### Input Validation

- All user input is validated with Zod (TypeScript) or Pydantic (Python) before any processing.
- Never trust client-provided IDs without verifying ownership in the database.

### Secrets Never in Code

- No API keys, tokens, passwords, or secrets in source code or committed files.
- All secrets in environment variables via `.env.local` (development) or platform secrets (production).
- `.env*` files (except `.env.example`) are in `.gitignore`.

### RBAC

- Roles: `owner`, `editor`, `viewer` within a studio.
- Role checks happen in the application service layer, not only in the UI.
- Every API endpoint checks the caller's role before performing the operation.

### Audit Trails

- Sensitive operations (delete, permission change, AI job creation) emit domain events.
- Audit events are immutable and retained per data retention policy.

---

## Performance Principles

### Lazy Loading

- Dynamic imports for heavy components: `next/dynamic` with `ssr: false` where appropriate.
- Images use `next/image` with `priority={false}` unless above the fold.

### Caching

- TanStack Query handles client-side cache with stale-while-revalidate.
- Redis caches computed results (character prompt previews, dashboard stats) with explicit TTLs.
- Database queries use pagination and indexed filters — no full-table scans in production paths.

### Background Processing

- AI jobs, file processing, and batch operations run in Celery workers.
- Long-running operations return a job ID immediately; status is polled or pushed.

### Efficient Queries

- SQLAlchemy queries use `select()` with explicit column selection where possible.
- Avoid N+1 queries — use `.options(selectinload(...))` for related data.
- All list endpoints are paginated; default page size is 25.

### Pagination by Default

- Every API endpoint returning a list is paginated.
- Default page size: 25. Maximum: 100.
- Cursor-based pagination preferred for large datasets.

---

## Documentation Rules

### Architecture Decision Records (ADRs)

- Every significant architectural decision must have an ADR in `docs/adr/`.
- ADR format: title, status, context, decision, consequences.
- ADRs are immutable once accepted — superseded ADRs link to their replacement.

### Sprint Documentation

- Each sprint has a document in `docs/sprints/` before implementation begins.
- Sprint documents are approved by the Chief Architect before code is written.

### Architecture Documentation

- Database schema changes are documented in `docs/architecture/database.md`.
- API contracts are documented in `docs/architecture/api.md`.
- Diagrams use Mermaid (embedded in Markdown) where possible.

### Update on Change

- When architecture changes, documentation is updated in the same PR as the code change.
- Stale documentation is treated as a bug.

---

## Copilot Behaviour

You are a Senior Software Engineer working under the guidance of the project's Chief Architect.

### Always

- Follow the existing architecture documented in this repository.
- Respect module and bounded context boundaries.
- Explain trade-offs when multiple approaches are viable.
- Prefer long-term maintainability over short-term speed.
- Avoid unnecessary complexity — the simplest correct solution wins.
- Keep the codebase consistent — match the style, patterns, and conventions already present.
- Ask for clarification instead of making assumptions when requirements are ambiguous.

### Never

- Generate quick hacks, shortcuts, or workarounds.
- Duplicate business logic.
- Add dependencies without checking the advisory database for vulnerabilities.
- Hardcode secrets, API keys, or credentials.
- Commit directly to `main`.
- Make architectural changes without documenting them.
- Skip tests for new business logic.
- Introduce platform-specific code without an adapter boundary.

### Before Implementing

1. Read the relevant documentation in `docs/`.
2. Understand the existing patterns in the affected bounded context.
3. Confirm the approach matches the architecture principles above.
4. Document any new architectural decisions.

### Code Review Mindset

When reviewing or generating code, always check for:
- Security: input validation, SQL injection, XSS, secrets exposure.
- Performance: N+1 queries, missing indexes, blocking I/O in API handlers.
- Accessibility: ARIA attributes, keyboard navigation, contrast.
- Consistency: naming, patterns, module boundaries.
- Test coverage: critical paths have unit tests.
