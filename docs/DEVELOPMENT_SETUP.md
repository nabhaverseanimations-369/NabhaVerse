# Development Setup

## Prerequisites
- Node.js 22+
- pnpm 11.5.2+
- Python 3.12+
- Docker and Docker Compose

## Install Dependencies
```bash
pnpm install
python -m pip install --upgrade pip
pip install -e .[dev]
```

## Local Commands
```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Local Infrastructure
```bash
docker compose up -d postgres redis api workers
```

## Branch Naming
Use the pattern:
- `feature/<ticket-or-scope>`
- `fix/<ticket-or-scope>`
- `chore/<ticket-or-scope>`
- `docs/<ticket-or-scope>`
- `refactor/<ticket-or-scope>`
- `test/<ticket-or-scope>`
- `ci/<ticket-or-scope>`
- `build/<ticket-or-scope>`
- `infra/<ticket-or-scope>`

All branch names must be lowercase kebab-case after the prefix.

## Commit Standard
Use Conventional Commits for every commit.
Examples:
- `chore: initialize monorepo foundation`
- `ci: add pull request validation workflow`
- `docs: document architecture boundaries`

## Pull Requests
- Follow the pull request template.
- Describe architectural impact before implementation details.
- Do not introduce feature logic in foundation PRs.
