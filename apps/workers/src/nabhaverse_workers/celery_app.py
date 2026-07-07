from celery import Celery

celery_app = Celery("nabhaverse")
celery_app.conf.update(
    broker_url="redis://localhost:6379/0",
    result_backend="redis://localhost:6379/0",
    task_default_queue="foundation",
)
