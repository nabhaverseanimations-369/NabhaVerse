from fastapi import FastAPI

app = FastAPI(
    title="NabhaVerse API",
    description="Foundation application bootstrap for future bounded contexts.",
    version="0.1.0",
)


@app.get("/health", tags=["platform"])
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}
