from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import models
from api.routes.models import router as cache_router

app = FastAPI(title="LLM Drift Monitor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(models.router, prefix="/api/models", tags=["models"])
app.include_router(models.cache_router, prefix="/api/cache", tags=["cache"])

@app.get("/")
def read_root():
    return {"status": "ok", "service": "llm-drift-monitor"}
