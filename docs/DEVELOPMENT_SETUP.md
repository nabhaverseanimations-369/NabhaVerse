# Development Setup

This guide covers how to set up your local development environment for **NabhaVerse Studio**.

---

## Prerequisites

| Tool    | Version | Install                                                      |
| ------- | ------- | ------------------------------------------------------------ |
| Node.js | 22 LTS  | [nodejs.org](https://nodejs.org)                             |
| pnpm    | 11.5.2  | `corepack enable && corepack prepare pnpm@11.5.2 --activate` |
| Python  | 3.12+   | [python.org](https://www.python.org/)                        |
| Docker  | latest  | [docker.com](https://www.docker.com/)                        |
| Git     | latest  | [git-scm.com](https://git-scm.com)                           |

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/nabhaverseanimations-369/NabhaVerse.git
cd NabhaVerse

# Install dependencies
pnpm install

# Run validation (lint + typecheck + test + build)
pnpm validate
```

## Run Locally

```bash
# Full stack (web + api + worker + redis + postgres)
pnpm dev:all

# Web app (Next.js)
pnpm dev

# API service (FastAPI)
python3 -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
uvicorn nabhaverse_api.main:app --host 0.0.0.0 --port 8000
```

`pnpm dev:all` expects Docker Desktop to be running and Python dependencies installed in `.venv`.

---

## Branch Naming

Branch names must follow this pattern:

```
<prefix>/<lowercase-kebab-case-description>
```

**Approved prefixes:**

| Prefix      | Purpose                      |
| ----------- | ---------------------------- |
| `feature/`  | New feature development      |
| `fix/`      | Bug fixes                    |
| `chore/`    | Maintenance and housekeeping |
| `docs/`     | Documentation changes        |
| `refactor/` | Code refactoring             |
| `test/`     | Test additions or fixes      |
| `ci/`       | CI/CD changes                |
| `build/`    | Build system changes         |
| `infra/`    | Infrastructure changes       |
| `copilot/`  | Copilot agent work           |

**Examples:**

```bash
git checkout -b feature/character-master-profile
git checkout -b fix/dashboard-loading-error
git checkout -b docs/update-api-reference
```

---

## Pull Request Titles

PR titles can be written in natural language — no Conventional Commit prefix required. The CI pipeline normalizes them automatically by prefixing `chore:` before running `commitlint` validation.

**Valid examples:**

- `Add character master profile page`
- `Fix dashboard performance issue`
- `Update authentication flow`

**Invalid:**

- Empty title

---

## CI Checks

All pull requests targeting `main` or `develop` run the following checks:

| Job           | Description                                               |
| ------------- | --------------------------------------------------------- |
| `pr-title`    | Validates the PR title is non-empty and passes commitlint |
| `validate`    | Runs `pnpm validate` (lint, typecheck, test, build)       |
| `branch-name` | Validates branch name matches approved prefix pattern     |

---

## Scripts

| Command          | Description                                               |
| ---------------- | --------------------------------------------------------- |
| `pnpm validate`  | Run all checks: lint, typecheck, test, build              |
| `pnpm dev:all`   | Start full local stack: web, api, worker, redis, postgres |
| `pnpm lint`      | Run ESLint / Ruff                                         |
| `pnpm typecheck` | Run TypeScript type checks                                |
| `pnpm test`      | Run test suite                                            |
| `pnpm build`     | Build all packages                                        |
