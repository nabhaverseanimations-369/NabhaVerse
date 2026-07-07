import assert from "node:assert/strict";
import test from "node:test";
import { existsSync } from "node:fs";

const requiredPaths = [
  "apps/web/package.json",
  "apps/api/src/nabhaverse_api/main.py",
  "apps/workers/src/nabhaverse_workers/celery_app.py",
  "packages/ui/src/index.ts",
  "packages/database/src/index.ts",
  "docs/ARCHITECTURE.md",
  "docker-compose.yml",
  ".github/workflows/ci.yml",
];

test("foundation scaffolding files exist", () => {
  for (const requiredPath of requiredPaths) {
    assert.equal(existsSync(requiredPath), true, `${requiredPath} should exist`);
  }
});
