# Domain Gap Analysis

**Program:** Phase 2, Program A - Backend Platform  
**Status:** Architecture Review Only  
**Last Updated:** 2026-07-13

## Identity

Existing entities:

- `User`
- Role and permission enums
- Membership/session composition through auth service

Missing entities:

- Auth session
- Audit event
- API key
- Service account
- Auth provider linkage

Existing repositories:

- `UserRepository`
- `RoleRepository`

Missing repositories:

- Session repository
- Audit repository
- API key repository

Existing services:

- `AuthService`
- `UserService`

Missing services:

- Session lifecycle service
- Audit/auth event service
- API key management service

Existing APIs:

- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me/preferences`

Missing APIs:

- Session management
- Membership switching
- Profile update endpoints beyond preferences
- API key endpoints
- Admin auth/admin identity endpoints

Existing tests:

- App metadata and health
- Auth middleware
- RBAC permission checks

Missing tests:

- Clerk token validation branches
- JWKS failure handling
- User bootstrap edge cases
- Preference validation and persistence

## Studio

Existing entities:

- `Studio`
- `Membership`
- Role/permission join tables

Missing entities:

- Invitations
- Team settings
- Studio settings/versioning
- Billing relationships

Existing repositories:

- `StudioRepository`
- `MembershipRepository`

Missing repositories:

- Invitation repository
- Settings repository
- Team repository

Existing services:

- `StudioService`

Missing services:

- Invitation lifecycle service
- Team management service
- Settings management service

Existing APIs:

- `GET /api/v1/studios`
- `POST /api/v1/studios`

Missing APIs:

- Membership management
- Team management
- Invitation accept/revoke
- Studio settings endpoints

Existing tests:

- Indirect coverage through auth bootstrap

Missing tests:

- Studio creation collisions
- Membership listing semantics
- Role mutation flows

## Character

Existing entities:

- None

Missing entities:

- Character
- Character version
- Character relationship
- Character comment/review linkage

Existing repositories:

- None

Missing repositories:

- Character repository
- Character version repository
- Relationship repository

Existing services:

- None

Missing services:

- Character CRUD service
- Versioning service
- Character search/filter service

Existing APIs:

- None

Missing APIs:

- Character list/detail/create/update/delete
- Search/filter APIs
- Version/history APIs

Existing tests:

- None

Missing tests:

- Repository tests
- Service tests
- API tests

## World

Existing entities:

- None

Missing entities:

- World
- Region/location graph
- Lore/timeline records

Existing repositories:

- None

Missing repositories:

- World repository
- Region repository
- Relationship repository

Existing services:

- None

Missing services:

- World CRUD service
- Hierarchy service
- World search/filter service

Existing APIs:

- None

Missing APIs:

- World list/detail/create/update/delete
- Region and overview APIs

Existing tests:

- None

Missing tests:

- Repository, service, and API coverage

## Episode

Existing entities:

- None

Missing entities:

- Episode
- Scene
- Script
- Storyboard/shot planning

Existing repositories:

- None

Missing repositories:

- Episode repository
- Scene repository
- Script repository

Existing services:

- None

Missing services:

- Episode planning service
- Scene ordering service
- Script persistence service

Existing APIs:

- None

Missing APIs:

- Episode list/detail/create/update/delete
- Scene ordering and workflow APIs

Existing tests:

- None

Missing tests:

- Repository, service, and API coverage

## Asset

Existing entities:

- None

Missing entities:

- Asset
- Asset collection
- Asset version
- Derivative
- Tag junctions

Existing repositories:

- None

Missing repositories:

- Asset repository
- Collection repository
- Version repository

Existing services:

- None

Missing services:

- Asset metadata service
- Versioning service
- Search/filter service

Existing APIs:

- None

Missing APIs:

- Asset list/detail/create/update/delete
- Collection and metadata APIs

Existing tests:

- None

Missing tests:

- Repository, service, and API coverage

## AI

Existing entities:

- None

Missing entities:

- Prompt template
- Prompt version
- AI job
- AI output
- Provider log

Existing repositories:

- None

Missing repositories:

- Prompt repository
- Job repository
- Provider log repository

Existing services:

- None

Missing services:

- Prompt lifecycle service
- AI job orchestration service
- Output persistence service

Existing APIs:

- None

Missing APIs:

- Prompt library
- AI jobs
- Output history
- Provider logs

Existing tests:

- None

Missing tests:

- Repository, service, worker, and API coverage

## Production

Existing entities:

- None

Missing entities:

- Production workspace
- Milestone
- Task
- Dependency
- Review/calendar records

Existing repositories:

- None

Missing repositories:

- Production repository
- Milestone repository
- Task repository

Existing services:

- None

Missing services:

- Planning service
- Dependency service
- Status/health service

Existing APIs:

- None

Missing APIs:

- Production list/detail/update
- Milestone/task/dependency APIs

Existing tests:

- None

Missing tests:

- Repository, service, and API coverage

## Publishing

Existing entities:

- None

Missing entities:

- Publication
- Release
- Distribution target
- Release note
- Export package reference

Existing repositories:

- None

Missing repositories:

- Publication repository
- Release repository
- Target repository

Existing services:

- None

Missing services:

- Release orchestration service
- Approval/scheduling service
- Export metadata service

Existing APIs:

- None

Missing APIs:

- Publication list/detail/update
- Release/target/schedule APIs

Existing tests:

- None

Missing tests:

- Repository, service, and API coverage

## Collaboration

Existing entities:

- None

Missing entities:

- Comment
- Mention
- Assignment
- Discussion
- Notification
- Review thread

Existing repositories:

- None

Missing repositories:

- Comment repository
- Mention repository
- Assignment repository
- Discussion repository
- Notification repository

Existing services:

- None

Missing services:

- Comment workflow service
- Assignment service
- Notification orchestration service
- Review/discussion service

Existing APIs:

- None

Missing APIs:

- Collaboration dashboard and workspace APIs
- Comments, mentions, assignments, discussions, notifications, reviews

Existing tests:

- None

Missing tests:

- Repository, service, worker, and API coverage

## Intelligence

Existing entities:

- None

Missing entities:

- Saved search
- Search history
- Recommendation
- Insight
- Activity read model
- Command usage record

Existing repositories:

- None

Missing repositories:

- Saved search repository
- Insight repository
- Recommendation repository
- Activity read-model repository

Existing services:

- None

Missing services:

- Search aggregation service
- Dashboard materialization service
- Command history service

Existing APIs:

- None

Missing APIs:

- Intelligence dashboard
- Saved searches
- Recent activity
- Recommendations and insights

Existing tests:

- None

Missing tests:

- Search aggregation, dashboard, and API coverage

## Summary

Only Identity and Studio have meaningful backend implementation today. Every content, workflow, collaboration, and intelligence domain remains absent behind the stable frontend contracts and must be implemented as part of Program A.
