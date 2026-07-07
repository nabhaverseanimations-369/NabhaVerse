# Development Setup

This guide covers how to set up your local development environment for **NabhaVerse Studio**.

---

## Prerequisites

| Tool    | Version | Install                            |
| ------- | ------- | ---------------------------------- |
| Node.js | 22.x    | [nodejs.org](https://nodejs.org)   |
| pnpm    | 11.5.2  | `npm install -g pnpm`              |
| Python  | 3.12+   | [python.org](https://python.org)   |
| Git     | latest  | [git-scm.com](https://git-scm.com) |

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/nabhaverseanimations-369/NabhaVerse.git
cd NabhaVerse

# Install dependencies
pnpm install

# Install Python tooling required by pnpm validate
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e '.[dev]'

# Run validation (lint + typecheck + test + build)
pnpm validate
```

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

| Command          | Description                                  |
| ---------------- | -------------------------------------------- |
| `pnpm validate`  | Run all checks: lint, typecheck, test, build |
| `pnpm lint`      | Run ESLint / Ruff                            |
| `pnpm typecheck` | Run TypeScript type checks                   |
| `pnpm test`      | Run test suite                               |
| `pnpm build`     | Build all packages                           |
