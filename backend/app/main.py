from app.core.database import engine, Base
from app.models import chat
import logging
import os
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load .env from the backend root (project root /backend/.env)
dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path)

# ── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
    stream=sys.stdout,
)

logger = logging.getLogger(__name__)
Base.metadata.create_all(bind=engine)
# ── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(title="Eunoia API", version="0.1.0")

# ── CORS ─────────────────────────────────────────────────────────────────────
# In production, ALLOWED_ORIGINS must include the Vercel frontend domain.
# Multiple origins can be comma-separated.
# Example:
#   ALLOWED_ORIGINS=https://eunoia-9o34gxdhp-alwan-shaikh.vercel.app,http://localhost:3000
allowed_origins_str = os.getenv(
    "ALLOWED_ORIGINS",
    "https://eunoia-9o34gxdhp-alwan-shaikh.vercel.app,http://localhost:3000"
)
allowed_origins = [o.strip() for o in allowed_origins_str.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With", "Accept"],
)
# ── Routers ──────────────────────────────────────────────────────────────────
from app.api.chat import router as chat_router
from app.api.auth import router as auth_router
from app.api.memory import router as memory_router
from app.api.mood import router as mood_router

app.include_router(chat_router)  # POST /chat
app.include_router(auth_router)  # POST /signup, /login, /logout, GET /me
app.include_router(memory_router)  # GET/POST/PUT/DELETE /memories
app.include_router(mood_router)  # POST /mood, GET /mood/history, /mood/stats, /mood/trends

# ── Health ───────────────────────────────────────────────────────────────────
@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "eunoia-api"}