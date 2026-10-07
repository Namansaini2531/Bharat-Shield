import sys
from pathlib import Path

# Add project root and backend directory to sys.path
PROJECT_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(PROJECT_ROOT))
sys.path.insert(0, str(PROJECT_ROOT / "backend"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.intelligence import router as intelligence_router
from backend.app.api.auth import router as auth_router
from backend.app.api.admin import router as admin_router
from backend.app.api.websocket import router as websocket_router
from bots.whatsapp.webhook import router as whatsapp_router

app = FastAPI(
    title="BHARAT-SHIELD Intelligence API",
    description="Multilingual, Multimodal Detection and Evidence Platform for LLM-Enabled Malign Information Operations",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(intelligence_router)
app.include_router(admin_router)
app.include_router(whatsapp_router)
app.include_router(websocket_router)


@app.get("/")
def read_root():
    return {
        "message": "Welcome to BHARAT-SHIELD API",
        "status": "online",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}