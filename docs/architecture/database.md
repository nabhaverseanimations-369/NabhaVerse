# NabhaVerse Studio — Database Architecture

**Version:** 2.1  
**Sprint:** 2 (Extended)  
**Status:** Architecture Phase — Documentation Only  
**Last Updated:** 2026-07-07

---

## Overview

NabhaVerse Studio uses **PostgreSQL 15+** as its primary relational database. The schema is designed around five core principles:

1. **Multi-tenancy via `studio_id`** — every tenant-owned row carries a `studio_id` foreign key; Row Level Security (RLS) policies enforce isolation at the database layer.
2. **UUID primary keys** — all tables use `gen_random_uuid()` as the default primary key to avoid enumerable IDs and support distributed inserts.
3. **Soft deletes** — rows are never physically deleted; `deleted_at TIMESTAMPTZ` marks them as removed while preserving audit history.
4. **Audit columns** — `created_at`, `updated_at`, `created_by`, and `updated_by` are present on every entity table.
5. **Strict indexing** — every foreign key, every filterable column, and every soft-delete column carries an appropriate index.

---

## Naming Conventions

| Convention | Rule |
|---|---|
| Table names | `snake_case`, plural nouns |
| Column names | `snake_case` |
| Primary key | `id UUID` |
| Foreign keys | `<referenced_table_singular>_id UUID` |
| Timestamps | `TIMESTAMPTZ NOT NULL DEFAULT now()` |
| Soft delete | `deleted_at TIMESTAMPTZ` (NULL = active) |
| Enum types | PostgreSQL `ENUM` or `TEXT` with `CHECK` constraint |
| Boolean flags | `is_<state>` prefix |
| JSON columns | `JSONB` for structured extensibility |

---

## Schema Diagram — Domain Overview

```
┌──────────────┐    ┌────────────────┐    ┌─────────────────┐
│    studios   │───▶│    users       │    │  memberships    │
└──────┬───────┘    └────────────────┘    └─────────────────┘
       │
       ├──▶ characters ──▶ character_versions
       ├──▶ episodes   ──▶ scenes
       ├──▶ locations
       ├──▶ assets ──▶ asset_collections ──▶ asset_versions ──▶ asset_derivatives
       │            └──▶ asset_tags
       ├──▶ prompt_templates ──▶ prompt_versions ──▶ prompt_variables
       ├──▶ ai_jobs ──▶ ai_job_steps ──▶ ai_outputs
       │         └──▶ ai_provider_logs
       └──▶ events ──▶ domain_events ──▶ event_subscriptions
                  └──▶ outbox
```

---

## Sprint 2 — Core Schema

### `studios`
Central tenant unit. Every resource belongs to exactly one studio.

```sql
CREATE TABLE studios (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  logo_url      TEXT,
  plan          TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','pro','enterprise')),
  settings      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ,
  created_by    UUID NOT NULL REFERENCES users(id),
  updated_by    UUID NOT NULL REFERENCES users(id)
);
CREATE INDEX idx_studios_slug ON studios(slug);
CREATE INDEX idx_studios_deleted_at ON studios(deleted_at) WHERE deleted_at IS NULL;
```

### `users`
Platform users, synced from Clerk on first login.

```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id      TEXT NOT NULL UNIQUE,
  email         TEXT NOT NULL UNIQUE,
  full_name     TEXT,
  avatar_url    TEXT,
  metadata      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);
```

### `studio_memberships`
Many-to-many join between users and studios with role assignment.

```sql
CREATE TABLE studio_memberships (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id  UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner','editor','viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (studio_id, user_id)
);
CREATE INDEX idx_studio_memberships_studio_id ON studio_memberships(studio_id);
CREATE INDEX idx_studio_memberships_user_id ON studio_memberships(user_id);
```

### `characters`
Master character records. All version history is in `character_versions`.

```sql
CREATE TABLE characters (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id       UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL,
  role            TEXT CHECK (role IN ('protagonist','antagonist','supporting','minor')),
  description     TEXT,
  identity        JSONB NOT NULL DEFAULT '{}',
  personality     JSONB NOT NULL DEFAULT '{}',
  visual_identity JSONB NOT NULL DEFAULT '{}',
  voice_profile   JSONB NOT NULL DEFAULT '{}',
  ai_rules        JSONB NOT NULL DEFAULT '{}',
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','archived')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ,
  created_by      UUID NOT NULL REFERENCES users(id),
  updated_by      UUID NOT NULL REFERENCES users(id)
);
CREATE UNIQUE INDEX idx_characters_studio_slug ON characters(studio_id, slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_characters_studio_id ON characters(studio_id);
CREATE INDEX idx_characters_status ON characters(status);
```

### `character_versions`
Immutable snapshots of a character's state at any point in time.

```sql
CREATE TABLE character_versions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  version      INTEGER NOT NULL,
  snapshot     JSONB NOT NULL,
  change_notes TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by   UUID NOT NULL REFERENCES users(id),
  UNIQUE (character_id, version)
);
CREATE INDEX idx_character_versions_character_id ON character_versions(character_id);
```

### `episodes`
Top-level story units.

```sql
CREATE TABLE episodes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id   UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL,
  logline     TEXT,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'idea' CHECK (status IN ('idea','outline','script','storyboard','in_production','completed','published')),
  episode_number INTEGER,
  season_number  INTEGER,
  metadata    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ,
  created_by  UUID NOT NULL REFERENCES users(id),
  updated_by  UUID NOT NULL REFERENCES users(id)
);
CREATE UNIQUE INDEX idx_episodes_studio_slug ON episodes(studio_id, slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_episodes_studio_id ON episodes(studio_id);
CREATE INDEX idx_episodes_status ON episodes(status);
```

### `scenes`
Atomic story unit within an episode.

```sql
CREATE TABLE scenes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id  UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  studio_id   UUID NOT NULL REFERENCES studios(id),
  title       TEXT,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  dialogue    TEXT,
  stage_notes TEXT,
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','locked')),
  metadata    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ,
  created_by  UUID NOT NULL REFERENCES users(id),
  updated_by  UUID NOT NULL REFERENCES users(id)
);
CREATE INDEX idx_scenes_episode_id ON scenes(episode_id);
CREATE INDEX idx_scenes_studio_id ON scenes(studio_id);
CREATE INDEX idx_scenes_order_index ON scenes(episode_id, order_index);
```

### `locations`
World-building location records.

```sql
CREATE TABLE locations (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id        UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL,
  environment_type TEXT CHECK (environment_type IN ('indoor','outdoor','fantasy','sci_fi','underwater','aerial','underground','other')),
  description      TEXT,
  specifications   JSONB NOT NULL DEFAULT '{}',
  ai_rules         JSONB NOT NULL DEFAULT '{}',
  status           TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','archived')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at       TIMESTAMPTZ,
  created_by       UUID NOT NULL REFERENCES users(id),
  updated_by       UUID NOT NULL REFERENCES users(id)
);
CREATE UNIQUE INDEX idx_locations_studio_slug ON locations(studio_id, slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_locations_studio_id ON locations(studio_id);
```

### `assets`
Core asset record — file metadata and studio ownership. Extended in Sprint 2.1.

```sql
CREATE TABLE assets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id    UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  asset_type   TEXT NOT NULL CHECK (asset_type IN ('character','prop','building','vehicle','music','sfx','font','logo','icon','texture','material','animation','video','document','other')),
  mime_type    TEXT,
  file_url     TEXT,
  file_size    BIGINT,
  metadata     JSONB NOT NULL DEFAULT '{}',
  status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','archived')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at   TIMESTAMPTZ,
  created_by   UUID NOT NULL REFERENCES users(id),
  updated_by   UUID NOT NULL REFERENCES users(id)
);
CREATE INDEX idx_assets_studio_id ON assets(studio_id);
CREATE INDEX idx_assets_asset_type ON assets(asset_type);
CREATE INDEX idx_assets_status ON assets(status);
```

### `prompts`
Reusable prompt records. Versioning extended in Sprint 2.1.

```sql
CREATE TABLE prompts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id   UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  prompt_type TEXT NOT NULL CHECK (prompt_type IN ('master','negative','character','environment','voice','animation','storyboard','custom')),
  content     TEXT NOT NULL,
  variables   JSONB NOT NULL DEFAULT '[]',
  metadata    JSONB NOT NULL DEFAULT '{}',
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','archived')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ,
  created_by  UUID NOT NULL REFERENCES users(id),
  updated_by  UUID NOT NULL REFERENCES users(id)
);
CREATE INDEX idx_prompts_studio_id ON prompts(studio_id);
CREATE INDEX idx_prompts_prompt_type ON prompts(prompt_type);
```

---

## Sprint 2.1 Extension — Event System

### Design Goal
Support domain event sourcing, reliable inter-service messaging via the transactional outbox pattern, and flexible subscription/notification routing — all without requiring a dedicated message broker during early development.

---

### `events`
Raw event log — every observable state change in the system appends a row here. Immutable append-only.

```sql
CREATE TABLE events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id     UUID REFERENCES studios(id) ON DELETE SET NULL,
  event_type    TEXT NOT NULL,               -- e.g. 'character.created', 'job.completed'
  aggregate_id  UUID NOT NULL,               -- ID of the entity that changed
  aggregate_type TEXT NOT NULL,              -- e.g. 'character', 'ai_job'
  payload       JSONB NOT NULL DEFAULT '{}', -- Full event data
  correlation_id UUID,                       -- Links events in a single request chain
  causation_id   UUID,                       -- ID of event that caused this event
  actor_id      UUID REFERENCES users(id),   -- User who triggered the event
  version       INTEGER NOT NULL DEFAULT 1,  -- Aggregate version at time of event
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Immutable: no updated_at, no deleted_at
CREATE INDEX idx_events_studio_id ON events(studio_id);
CREATE INDEX idx_events_aggregate ON events(aggregate_type, aggregate_id);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_correlation_id ON events(correlation_id);
CREATE INDEX idx_events_created_at ON events(created_at);
```

### `domain_events`
Structured domain events with semantic typing, used for business logic reactions. Sourced from `events` after processing.

```sql
CREATE TABLE domain_events (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id       UUID NOT NULL REFERENCES events(id),
  studio_id      UUID REFERENCES studios(id) ON DELETE SET NULL,
  domain         TEXT NOT NULL,              -- Bounded context: 'character', 'production', 'ai'
  event_name     TEXT NOT NULL,              -- Semantic name: 'CharacterApproved'
  event_version  TEXT NOT NULL DEFAULT 'v1', -- Schema version for forward-compat
  payload        JSONB NOT NULL DEFAULT '{}',
  metadata       JSONB NOT NULL DEFAULT '{}',
  processed_at   TIMESTAMPTZ,               -- NULL until handled by at least one subscriber
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_domain_events_event_id ON domain_events(event_id);
CREATE INDEX idx_domain_events_studio_id ON domain_events(studio_id);
CREATE INDEX idx_domain_events_domain ON domain_events(domain);
CREATE INDEX idx_domain_events_event_name ON domain_events(event_name);
CREATE INDEX idx_domain_events_processed_at ON domain_events(processed_at) WHERE processed_at IS NULL;
```

### `event_subscriptions`
Declares which handler should receive which domain events. Supports both webhook delivery and internal worker routing.

```sql
CREATE TABLE event_subscriptions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id      UUID REFERENCES studios(id) ON DELETE CASCADE,  -- NULL = system-level subscription
  name           TEXT NOT NULL,
  description    TEXT,
  domain         TEXT,                       -- NULL = subscribe to all domains
  event_name     TEXT,                       -- NULL = subscribe to all events in domain
  handler_type   TEXT NOT NULL CHECK (handler_type IN ('worker','webhook','email','log')),
  handler_target TEXT NOT NULL,              -- Queue name, webhook URL, email address, etc.
  filter_rules   JSONB NOT NULL DEFAULT '{}',-- JSONLogic expression for conditional routing
  is_active      BOOLEAN NOT NULL DEFAULT true,
  retry_count    INTEGER NOT NULL DEFAULT 3,
  timeout_ms     INTEGER NOT NULL DEFAULT 30000,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at     TIMESTAMPTZ,
  created_by     UUID NOT NULL REFERENCES users(id)
);
CREATE INDEX idx_event_subscriptions_studio_id ON event_subscriptions(studio_id);
CREATE INDEX idx_event_subscriptions_domain_event ON event_subscriptions(domain, event_name);
CREATE INDEX idx_event_subscriptions_is_active ON event_subscriptions(is_active) WHERE is_active = true;
```

### `outbox`
Transactional outbox pattern — events are written to this table within the same database transaction as the triggering business operation, guaranteeing at-least-once delivery without distributed transactions.

```sql
CREATE TABLE outbox (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_event_id UUID NOT NULL REFERENCES domain_events(id),
  subscription_id UUID NOT NULL REFERENCES event_subscriptions(id),
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','delivered','failed','dead_letter')),
  attempt_count   INTEGER NOT NULL DEFAULT 0,
  max_attempts    INTEGER NOT NULL DEFAULT 3,
  next_retry_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_error      TEXT,
  delivered_at    TIMESTAMPTZ,
  locked_at       TIMESTAMPTZ,   -- Set when a worker claims this row (optimistic lock)
  locked_by       TEXT,          -- Worker instance ID
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_outbox_status_retry ON outbox(status, next_retry_at) WHERE status IN ('pending','failed');
CREATE INDEX idx_outbox_domain_event_id ON outbox(domain_event_id);
CREATE INDEX idx_outbox_subscription_id ON outbox(subscription_id);
CREATE INDEX idx_outbox_locked_at ON outbox(locked_at) WHERE locked_at IS NOT NULL;
```

---

## Sprint 2.1 Extension — AI Job Pipeline

### Design Goal
Provide a durable, observable, and retryable job pipeline for all AI operations. Every AI call is tracked with full lifecycle: submission → steps → output → provider log. Provider-specific details are isolated in `ai_provider_logs` to keep business logic provider-agnostic.

---

### `ai_jobs`
Top-level AI work order. Represents a single user-requested AI operation (e.g. "generate character prompt", "create storyboard for scene 3").

```sql
CREATE TABLE ai_jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id       UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  job_type        TEXT NOT NULL CHECK (job_type IN ('prompt_generation','image_generation','video_generation','voice_generation','animation_generation','text_completion','storyboard','batch')),
  subject_type    TEXT,          -- 'character', 'scene', 'episode', etc.
  subject_id      UUID,          -- ID of the related entity
  input_payload   JSONB NOT NULL DEFAULT '{}',
  output_payload  JSONB NOT NULL DEFAULT '{}',
  status          TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','completed','failed','cancelled','retrying')),
  priority        INTEGER NOT NULL DEFAULT 5,  -- 1 = highest, 10 = lowest
  attempt_count   INTEGER NOT NULL DEFAULT 0,
  max_attempts    INTEGER NOT NULL DEFAULT 3,
  scheduled_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  failed_at       TIMESTAMPTZ,
  error_message   TEXT,
  worker_id       TEXT,
  parent_job_id   UUID REFERENCES ai_jobs(id),  -- For sub-jobs within a batch
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ,
  created_by      UUID NOT NULL REFERENCES users(id)
);
CREATE INDEX idx_ai_jobs_studio_id ON ai_jobs(studio_id);
CREATE INDEX idx_ai_jobs_status ON ai_jobs(status);
CREATE INDEX idx_ai_jobs_subject ON ai_jobs(subject_type, subject_id);
CREATE INDEX idx_ai_jobs_scheduled_at ON ai_jobs(scheduled_at) WHERE status = 'queued';
CREATE INDEX idx_ai_jobs_parent_job_id ON ai_jobs(parent_job_id);
```

### `ai_job_steps`
Individual processing steps within a job. A job may have multiple sequential or parallel steps (e.g. "parse input" → "call OpenAI" → "post-process output"). Enables granular progress tracking.

```sql
CREATE TABLE ai_job_steps (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_job_id     UUID NOT NULL REFERENCES ai_jobs(id) ON DELETE CASCADE,
  step_name     TEXT NOT NULL,               -- e.g. 'validate_input', 'call_provider', 'format_output'
  step_order    INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','running','completed','failed','skipped')),
  input_data    JSONB NOT NULL DEFAULT '{}',
  output_data   JSONB NOT NULL DEFAULT '{}',
  error_message TEXT,
  duration_ms   INTEGER,
  started_at    TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_job_steps_ai_job_id ON ai_job_steps(ai_job_id);
CREATE INDEX idx_ai_job_steps_status ON ai_job_steps(status);
CREATE INDEX idx_ai_job_steps_order ON ai_job_steps(ai_job_id, step_order);
```

### `ai_outputs`
Persisted outputs from completed AI jobs. Separating outputs from jobs allows multiple output formats per job (e.g. raw text + structured JSON + rendered asset).

```sql
CREATE TABLE ai_outputs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_job_id     UUID NOT NULL REFERENCES ai_jobs(id) ON DELETE CASCADE,
  studio_id     UUID NOT NULL REFERENCES studios(id),
  output_type   TEXT NOT NULL CHECK (output_type IN ('text','json','image_url','video_url','audio_url','file_url','structured_data','error')),
  content       TEXT,                          -- Text or URL
  content_json  JSONB,                         -- Structured output
  asset_id      UUID REFERENCES assets(id),   -- If output was saved as an asset
  model_used    TEXT,                          -- e.g. 'gpt-4o', 'dall-e-3'
  provider      TEXT,                          -- e.g. 'openai', 'elevenlabs'
  tokens_used   INTEGER,
  cost_usd      NUMERIC(10, 6),
  quality_score NUMERIC(3, 2),                -- 0.00–1.00, set by human review or auto-eval
  is_approved   BOOLEAN,
  reviewed_by   UUID REFERENCES users(id),
  reviewed_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_outputs_ai_job_id ON ai_outputs(ai_job_id);
CREATE INDEX idx_ai_outputs_studio_id ON ai_outputs(studio_id);
CREATE INDEX idx_ai_outputs_provider ON ai_outputs(provider);
CREATE INDEX idx_ai_outputs_is_approved ON ai_outputs(is_approved);
```

### `ai_provider_logs`
Raw provider-level request/response logs. Stored separately to keep business tables clean and to support billing, debugging, and compliance audit trails.

```sql
CREATE TABLE ai_provider_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_job_id       UUID NOT NULL REFERENCES ai_jobs(id) ON DELETE CASCADE,
  ai_job_step_id  UUID REFERENCES ai_job_steps(id),
  studio_id       UUID NOT NULL REFERENCES studios(id),
  provider        TEXT NOT NULL,             -- 'openai', 'elevenlabs', 'fal_ai', 'replicate', etc.
  model           TEXT,
  endpoint        TEXT,
  http_method     TEXT NOT NULL DEFAULT 'POST',
  request_headers JSONB NOT NULL DEFAULT '{}',
  request_body    JSONB NOT NULL DEFAULT '{}',
  response_status INTEGER,
  response_body   JSONB NOT NULL DEFAULT '{}',
  error_code      TEXT,
  error_message   TEXT,
  tokens_input    INTEGER,
  tokens_output   INTEGER,
  cost_usd        NUMERIC(10, 6),
  latency_ms      INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Retention: may be pruned after 90 days per data policy
CREATE INDEX idx_ai_provider_logs_ai_job_id ON ai_provider_logs(ai_job_id);
CREATE INDEX idx_ai_provider_logs_studio_id ON ai_provider_logs(studio_id);
CREATE INDEX idx_ai_provider_logs_provider ON ai_provider_logs(provider);
CREATE INDEX idx_ai_provider_logs_created_at ON ai_provider_logs(created_at);
```

---

## Sprint 2.1 Extension — Expanded Asset Management

### Design Goal
Evolve the asset system from a flat file registry into a full asset lifecycle model. Assets can be organised into collections, tracked through version history, transformed into derivatives (thumbnails, optimised variants), and labelled with semantic tags.

---

### `asset_collections`
Named groupings of assets for organisation (e.g. "Season 1 Characters", "Background Plates", "SFX Library").

```sql
CREATE TABLE asset_collections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id   UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  parent_id   UUID REFERENCES asset_collections(id),  -- Nested collections
  cover_asset_id UUID REFERENCES assets(id),
  is_public   BOOLEAN NOT NULL DEFAULT false,
  metadata    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ,
  created_by  UUID NOT NULL REFERENCES users(id),
  updated_by  UUID NOT NULL REFERENCES users(id)
);
CREATE INDEX idx_asset_collections_studio_id ON asset_collections(studio_id);
CREATE INDEX idx_asset_collections_parent_id ON asset_collections(parent_id);

-- Join table: assets ↔ collections (many-to-many)
CREATE TABLE asset_collection_members (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES asset_collections(id) ON DELETE CASCADE,
  asset_id      UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  order_index   INTEGER NOT NULL DEFAULT 0,
  added_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  added_by      UUID NOT NULL REFERENCES users(id),
  UNIQUE (collection_id, asset_id)
);
CREATE INDEX idx_asset_collection_members_collection_id ON asset_collection_members(collection_id);
CREATE INDEX idx_asset_collection_members_asset_id ON asset_collection_members(asset_id);
```

### `asset_versions`
Immutable version history for an asset. Every file upload or metadata edit increments the version.

```sql
CREATE TABLE asset_versions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id      UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  studio_id     UUID NOT NULL REFERENCES studios(id),
  version       INTEGER NOT NULL,
  file_url      TEXT NOT NULL,
  file_size     BIGINT,
  mime_type     TEXT,
  checksum_sha256 TEXT,
  change_notes  TEXT,
  is_current    BOOLEAN NOT NULL DEFAULT false,
  metadata      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by    UUID NOT NULL REFERENCES users(id),
  UNIQUE (asset_id, version)
);
CREATE INDEX idx_asset_versions_asset_id ON asset_versions(asset_id);
CREATE INDEX idx_asset_versions_is_current ON asset_versions(asset_id, is_current) WHERE is_current = true;
```

### `asset_derivatives`
Machine-generated variants of an asset (thumbnails, web-optimised images, audio previews, video proxies). Never edited manually — always regenerated from the source.

```sql
CREATE TABLE asset_derivatives (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id         UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  asset_version_id UUID NOT NULL REFERENCES asset_versions(id) ON DELETE CASCADE,
  studio_id        UUID NOT NULL REFERENCES studios(id),
  derivative_type  TEXT NOT NULL CHECK (derivative_type IN ('thumbnail','preview','webp','compressed','proxy','waveform','sprite_sheet','pdf_preview','other')),
  file_url         TEXT NOT NULL,
  file_size        BIGINT,
  mime_type        TEXT,
  width            INTEGER,
  height           INTEGER,
  duration_ms      INTEGER,           -- For audio/video derivatives
  generation_params JSONB NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_asset_derivatives_asset_id ON asset_derivatives(asset_id);
CREATE INDEX idx_asset_derivatives_version_id ON asset_derivatives(asset_version_id);
CREATE INDEX idx_asset_derivatives_type ON asset_derivatives(derivative_type);
```

### `asset_tags`
Flat tag vocabulary shared per studio, referenced by assets for full-text and categorical search.

```sql
CREATE TABLE asset_tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id  UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL,
  color      TEXT,          -- hex or semantic token
  tag_group  TEXT,          -- Optional grouping: 'character', 'style', 'episode'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES users(id),
  UNIQUE (studio_id, slug)
);
CREATE INDEX idx_asset_tags_studio_id ON asset_tags(studio_id);
CREATE INDEX idx_asset_tags_slug ON asset_tags(studio_id, slug);

-- Join table: assets ↔ tags (many-to-many)
CREATE TABLE asset_tag_assignments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id   UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  tag_id     UUID NOT NULL REFERENCES asset_tags(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by UUID NOT NULL REFERENCES users(id),
  UNIQUE (asset_id, tag_id)
);
CREATE INDEX idx_asset_tag_assignments_asset_id ON asset_tag_assignments(asset_id);
CREATE INDEX idx_asset_tag_assignments_tag_id ON asset_tag_assignments(tag_id);
```

---

## Sprint 2.1 Extension — Prompt Versioning

### Design Goal
Elevate prompts from mutable text fields to versioned, variable-interpolated templates. Enables A/B testing, rollback, change attribution, and structured variable resolution at runtime.

---

### `prompt_templates`
Top-level prompt template record. Analogous to `characters` — the living entity that accumulates versions.

```sql
CREATE TABLE prompt_templates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id       UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  category        TEXT NOT NULL CHECK (category IN ('character','environment','voice','animation','storyboard','episode','system','custom')),
  subject_type    TEXT,       -- Optional: 'character', 'location', etc.
  subject_id      UUID,       -- Optional: link to specific entity
  active_version_id UUID,     -- FK set after first version exists (circular, set via migration)
  tags            TEXT[] NOT NULL DEFAULT '{}',
  is_global       BOOLEAN NOT NULL DEFAULT false,  -- True = available across all studios
  metadata        JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ,
  created_by      UUID NOT NULL REFERENCES users(id),
  updated_by      UUID NOT NULL REFERENCES users(id)
);
CREATE INDEX idx_prompt_templates_studio_id ON prompt_templates(studio_id);
CREATE INDEX idx_prompt_templates_category ON prompt_templates(category);
CREATE INDEX idx_prompt_templates_subject ON prompt_templates(subject_type, subject_id);
```

### `prompt_versions`
Immutable snapshot of a prompt template at a specific version. Every edit creates a new version; old versions are never modified.

```sql
CREATE TABLE prompt_versions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_template_id UUID NOT NULL REFERENCES prompt_templates(id) ON DELETE CASCADE,
  studio_id          UUID NOT NULL REFERENCES studios(id),
  version            INTEGER NOT NULL,
  content            TEXT NOT NULL,     -- Raw prompt text with {{variable}} placeholders
  content_negative   TEXT,              -- Negative prompt section
  model_hint         TEXT,              -- Recommended model: 'gpt-4o', 'dall-e-3', etc.
  provider_hint      TEXT,              -- Recommended provider
  change_notes       TEXT,
  is_published       BOOLEAN NOT NULL DEFAULT false,
  test_results       JSONB NOT NULL DEFAULT '[]',  -- Array of test run results
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by         UUID NOT NULL REFERENCES users(id),
  UNIQUE (prompt_template_id, version)
);
CREATE INDEX idx_prompt_versions_template_id ON prompt_versions(prompt_template_id);
CREATE INDEX idx_prompt_versions_is_published ON prompt_versions(prompt_template_id, is_published) WHERE is_published = true;
```

### `prompt_variables`
Variable definitions for a specific prompt version. Defines name, type, default value, and validation rules for each `{{placeholder}}` in the prompt content.

```sql
CREATE TABLE prompt_variables (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_version_id  UUID NOT NULL REFERENCES prompt_versions(id) ON DELETE CASCADE,
  prompt_template_id UUID NOT NULL REFERENCES prompt_templates(id) ON DELETE CASCADE,
  name               TEXT NOT NULL,               -- Matches {{name}} in prompt content
  label              TEXT NOT NULL,               -- Human-readable label
  description        TEXT,
  variable_type      TEXT NOT NULL CHECK (variable_type IN ('text','number','boolean','enum','entity_ref','list','json')),
  default_value      TEXT,
  enum_options       TEXT[],                      -- Valid values if variable_type = 'enum'
  entity_type        TEXT,                        -- If variable_type = 'entity_ref': 'character', 'location', etc.
  is_required        BOOLEAN NOT NULL DEFAULT true,
  validation_rules   JSONB NOT NULL DEFAULT '{}', -- JSON Schema fragment for validation
  order_index        INTEGER NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (prompt_version_id, name)
);
CREATE INDEX idx_prompt_variables_version_id ON prompt_variables(prompt_version_id);
CREATE INDEX idx_prompt_variables_template_id ON prompt_variables(prompt_template_id);
```

---

## Row Level Security (RLS) Policy Guidelines

All tables with `studio_id` must have RLS enabled:

```sql
-- Pattern for every studio-scoped table
ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;

CREATE POLICY studio_isolation ON <table_name>
  USING (
    studio_id IN (
      SELECT studio_id FROM studio_memberships
      WHERE user_id = auth.uid()
    )
  );
```

System-level tables (`events`, `domain_events`, `event_subscriptions`, `outbox`) with `studio_id IS NULL` must also pass the `auth.uid()` check or use a service-role bypass.

---

## Migration Strategy

- All schema changes are managed via **Alembic** (Python) for the FastAPI backend.
- Migration files are named `YYYYMMDD_HHMMSS_<description>.py`.
- Every migration includes both `upgrade()` and `downgrade()` functions.
- Breaking changes require a multi-step migration (add column → backfill → add constraint → remove old column).
- Index creation uses `CREATE INDEX CONCURRENTLY` in production.

---

## Appendix: Table Inventory

| Table | Sprint | Domain |
|---|---|---|
| `studios` | 2 | Core |
| `users` | 2 | Core |
| `studio_memberships` | 2 | Core |
| `characters` | 2 | Character |
| `character_versions` | 2 | Character |
| `episodes` | 2 | Production |
| `scenes` | 2 | Production |
| `locations` | 2 | World |
| `assets` | 2 | Asset |
| `prompts` | 2 | AI |
| `events` | 2.1 | Event System |
| `domain_events` | 2.1 | Event System |
| `event_subscriptions` | 2.1 | Event System |
| `outbox` | 2.1 | Event System |
| `ai_jobs` | 2.1 | AI Pipeline |
| `ai_job_steps` | 2.1 | AI Pipeline |
| `ai_outputs` | 2.1 | AI Pipeline |
| `ai_provider_logs` | 2.1 | AI Pipeline |
| `asset_collections` | 2.1 | Asset |
| `asset_collection_members` | 2.1 | Asset |
| `asset_versions` | 2.1 | Asset |
| `asset_derivatives` | 2.1 | Asset |
| `asset_tags` | 2.1 | Asset |
| `asset_tag_assignments` | 2.1 | Asset |
| `prompt_templates` | 2.1 | AI |
| `prompt_versions` | 2.1 | AI |
| `prompt_variables` | 2.1 | AI |
