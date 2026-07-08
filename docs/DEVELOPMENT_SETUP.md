# Development Setup

This guide describes local setup for the NabhaVerse monorepo, including Clerk authentication.

## Prerequisites

| Tool      | Version | Notes                                                    |
| --------- | ------- | -------------------------------------------------------- |
| Node.js   | 22.x    | Use `/usr/local/opt/node@22/bin` on macOS when needed    |
| pnpm      | 11.5.2  | `npm install -g pnpm`                                    |
| Python    | 3.12+   | 3.13 currently works locally in this repository          |
| Git       | latest  | Required for branch and PR workflow                      |
| Clerk CLI | latest  | `brew install clerk/stable/clerk` or preferred installer |

## Environment Configuration

Create local env files from examples before running services:

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

### Required Variables

#### Web (`apps/web/.env.local`)

| Variable                                          | Required | Description                                        |
| ------------------------------------------------- | -------- | -------------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`               | Yes      | Clerk public key used by client-side auth UI       |
| `CLERK_SECRET_KEY`                                | Yes      | Clerk server key for server-side auth helpers      |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`                   | Yes      | Sign-in route path (default `/login`)              |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`                   | Yes      | Sign-up route path (default `/signup`)             |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | Yes      | Fallback route after sign-in                       |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | Yes      | Fallback route after sign-up                       |
| `NEXT_PUBLIC_API_URL`                             | Yes      | API base URL used by the frontend                  |
| `CLERK_WEBHOOK_SIGNING_SECRET`                    | No       | Needed only when webhook endpoints are implemented |

#### API (`apps/api/.env`)

| Variable         | Required | Description                                     |
| ---------------- | -------- | ----------------------------------------------- |
| `DATABASE_URL`   | Yes      | Async SQLAlchemy connection URL                 |
| `CLERK_ISSUER`   | Yes      | JWT issuer used for Clerk token validation      |
| `CLERK_JWKS_URL` | Yes      | JWKS endpoint used to validate Clerk signatures |
| `CLERK_AUDIENCE` | Optional | Expected `aud` claim for token validation       |

## Clerk Setup

From repository root:

```bash
clerk auth login
cd apps/web
clerk init --app app_3GDammYddAbXMR6V6r6XO8EdeJX
clerk doctor
```

If `clerk init` cannot detect framework from root in monorepo mode, run it from `apps/web` as shown above.

## Local Development

```bash
# 1) Install JavaScript dependencies
pnpm install

# 2) Set up Python environment
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e '.[dev]'

# 3) Start web app only
pnpm --filter @nabhaverse/web dev

# 4) Start monorepo dev pipelines (if configured and ports available)
pnpm dev
```

## Running the App

- Web app: `http://localhost:3000`
- API app: run API service as configured in your local workflow (`pnpm dev` or direct Python command)
- Auth sanity check:

1. Open web app
2. Click sign in/sign up controls
3. Complete test signup
4. Confirm user profile control appears

## Running Tests and Validation

```bash
# Full repository gate
pnpm validate

# Individual phases
pnpm lint
pnpm typecheck
pnpm test
pnpm build

# Python tests directly
pytest

# Frontend unit + accessibility tests (Vitest)
pnpm --filter @nabhaverse/web test

# Frontend test watch mode
pnpm --filter @nabhaverse/web test:watch

# Storybook for reusable UI components
pnpm --filter @nabhaverse/web storybook

# Storybook static verification build
pnpm --filter @nabhaverse/web storybook:build
```

### Writing Frontend Component Tests

- Place tests adjacent to components using `*.test.tsx` (example: `src/components/layout/sidebar.test.tsx`).
- Use `renderWithProviders` from `apps/web/src/test/test-utils.tsx` for components that depend on theme, workspace state, or toast context.
- Use `vitest-axe` for accessibility checks (`expect(results).toHaveNoViolations()`).
- Use keyboard-first assertions for interactive controls (`user.tab()`, `user.keyboard("{Enter}")`) to validate focus and navigation behavior.

### Storybook Usage Guidelines

- Add a `*.stories.tsx` file for every reusable shared component.
- Include at least one default story and representative state variants (loading, empty, trend/status variations).
- Keep stories deterministic: avoid network requests and use static fixture props.
- Run `storybook:build` before PR updates to ensure all stories compile.

## Common Troubleshooting

### `pnpm` fails or wrong Node version is used

Use Node 22 explicitly:

```bash
export PATH="/usr/local/opt/node@22/bin:$PATH"
```

### `next dev` fails with `EADDRINUSE`

Another dev server is running on port 3000. Stop the conflicting process or run on another port:

```bash
pnpm exec next dev --hostname 0.0.0.0 --port 3001
```

### Clerk auth UI not showing

Check `apps/web/.env.local` has valid Clerk keys and run:

```bash
cd apps/web
clerk doctor
```

### Backend returns 401 for valid sessions

Validate API Clerk settings:

- `CLERK_ISSUER`
- `CLERK_JWKS_URL`
- `CLERK_AUDIENCE` (if enforced)

### CI or local validation fails after dependency changes

Resync lockfiles and rerun:

```bash
pnpm install --frozen-lockfile
pnpm validate
```
