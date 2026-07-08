from fastapi.testclient import TestClient
from nabhaverse_api.main import app

client = TestClient(app)


def test_api_metadata() -> None:
    assert app.title == "NabhaVerse API"


def test_health_endpoint() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
