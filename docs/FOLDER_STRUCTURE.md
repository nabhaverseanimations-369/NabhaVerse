# Folder Structure

```text
.
├── apps
│   ├── api
│   │   ├── src/nabhaverse_api
│   │   │   ├── application
│   │   │   ├── domain
│   │   │   ├── infrastructure
│   │   │   └── presentation
│   │   └── tests
│   ├── web
│   │   └── src/app
│   └── workers
│       ├── src/nabhaverse_workers
│       │   ├── application
│       │   ├── domain
│       │   ├── infrastructure
│       │   └── presentation
│       └── tests
├── docker
├── docs
├── packages
│   ├── ai
│   ├── config
│   ├── database
│   ├── prompts
│   ├── types
│   ├── ui
│   └── utils
└── scripts
    └── tests
```

## Rules
- Add new product features inside an existing bounded area instead of creating ad hoc top-level folders.
- Keep framework entrypoints in `apps/*` and reusable contracts in `packages/*`.
- Add documentation updates in `docs/*` whenever a boundary or workflow changes.
- Keep infrastructure assets in `docker/*` and automation in `.github/*`.
