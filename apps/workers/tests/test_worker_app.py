from nabhaverse_workers.celery_app import celery_app


def test_worker_queue_name() -> None:
    assert celery_app.conf.task_default_queue == "foundation"
