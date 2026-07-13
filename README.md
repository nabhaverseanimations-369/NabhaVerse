# NabhaVerse Studio

NabhaVerse Studio is an AI operating system for animated storytelling, built as a monorepo with Next.js frontend and FastAPI backend services.

## Quick Start

### 1. Clone and install dependencies

```bash
git clone https://github.com/nabhaverseanimations-369/NabhaVerse.git
cd NabhaVerse
pnpm install
```

### 2. Configure environments

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

Fill in Clerk and database values in local env files.

### 3. Set up Python toolchain

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e '.[dev]'
```

### 4. Set up Clerk

```bash
clerk auth login
cd apps/web
clerk init --app app_3GDammYddAbXMR6V6r6XO8EdeJX
clerk doctor
cd ../..
```

### 5. Run locally

```bash
pnpm --filter @nabhaverse/web dev
```

If you need all configured dev pipelines:

```bash
pnpm dev
```

## Validate Changes

```bash
pnpm validate
```

This runs lint, typecheck, tests, and build checks for the monorepo.

## Authentication Flow Check

1. Open `http://localhost:3000`
2. Use sign in / sign up controls
3. Complete signup as first test user
4. Confirm user profile control is visible

## Documentation

Detailed setup and troubleshooting:

- [docs/DEVELOPMENT_SETUP.md](docs/DEVELOPMENT_SETUP.md)

## Core Engineering Documents

- [docs/ARCHITECTURE_CONSTITUTION.md](docs/ARCHITECTURE_CONSTITUTION.md)
- [docs/ENGINEERING_GUIDE.md](docs/ENGINEERING_GUIDE.md)
- [docs/backend/BACKEND_PATTERNS.md](docs/backend/BACKEND_PATTERNS.md)
- [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md)
- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
