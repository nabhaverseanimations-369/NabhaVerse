#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

export PATH="/usr/local/opt/node@22/bin:$PATH"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm was not found on PATH."
  echo "Use Node 22 and pnpm 11.5.2 before running this command."
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required for Redis and Postgres."
  echo "Install Docker Desktop and ensure the Docker daemon is running."
  exit 1
fi

if [ ! -x ".venv/bin/uvicorn" ] || [ ! -x ".venv/bin/celery" ]; then
  echo "Python virtual environment is missing required executables."
  echo "Run the following once:"
  echo "  python3 -m venv .venv"
  echo "  source .venv/bin/activate"
  echo "  pip install -e '.[dev]'"
  exit 1
fi

echo "Starting Redis and Postgres via Docker Compose..."
docker compose up -d redis postgres

cleanup() {
  echo
  echo "Stopping local development processes..."
  kill "$WEB_PID" "$API_PID" "$WORKER_PID" 2>/dev/null || true
  wait "$WEB_PID" "$API_PID" "$WORKER_PID" 2>/dev/null || true
}

trap cleanup INT TERM EXIT

echo "Starting web, API, and worker..."
pnpm dev &
WEB_PID=$!

.venv/bin/uvicorn nabhaverse_api.main:app --host 0.0.0.0 --port 8000 --reload &
API_PID=$!

.venv/bin/celery -A nabhaverse_workers.celery_app:celery_app worker --loglevel=info &
WORKER_PID=$!

echo "Web:    http://localhost:3000"
echo "API:    http://localhost:8000"
echo "Health: http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop all processes started by this command."

wait "$WEB_PID" "$API_PID" "$WORKER_PID"
