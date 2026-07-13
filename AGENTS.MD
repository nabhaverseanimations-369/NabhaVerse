# NabhaVerse AI Agent Entry Point

Before making any changes, read these documents in order:

1. docs/ARCHITECTURE_CONSTITUTION.md
2. docs/ENGINEERING_GUIDE.md
3. docs/AI_AGENT_GUIDE.md
4. docs/BACKEND_PATTERNS.md

Rules:

- Follow Clean Architecture.
- Repositories contain persistence only.
- Business rules belong in Domain Services.
- Do not redesign public contracts.
- Preserve Studio SDK APIs.
- Keep frontend contracts backward compatible.
- Write tests for all new functionality.
- Open a Pull Request and stop for review.