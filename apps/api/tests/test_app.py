from nabhaverse_api.main import app


def test_api_metadata() -> None:
    assert app.title == "NabhaVerse API"
