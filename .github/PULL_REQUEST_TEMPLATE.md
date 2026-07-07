## Summary
- Describe the architectural intent of this change.
- Explain the bounded contexts or layers affected.

## Validation
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm build`

## Architecture Checklist
- [ ] No business logic was added outside the proper layer.
- [ ] No cross-app imports bypass shared contracts.
- [ ] Documentation was updated when boundaries changed.
