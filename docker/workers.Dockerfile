FROM python:3.12-slim

WORKDIR /workspace

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY pyproject.toml ./
COPY docs ./docs
COPY apps/api/src ./apps/api/src
COPY apps/workers/src ./apps/workers/src
RUN python -m pip install --upgrade pip && pip install -e .

CMD ["celery", "-A", "nabhaverse_workers.celery_app:celery_app", "worker", "--loglevel=info"]
