from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.api.v1.router import router
from app.database import engine, Base


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Eunoia AI",
    description="AI companion backend",
    version="1.0.0"
)


# ============================
# CORS CONFIGURATION
# ============================

allowed_origins = [
    "https://eunoia-9o34gxdhp-alwan-shaikh.vercel.app",
    "http://localhost:3000",
    "http://localhost:8000",
]


# If Railway variable exists, add those origins too
env_origins = os.getenv("ALLOWED_ORIGINS")

if env_origins:
    allowed_origins.extend(
        [
            origin.strip()
            for origin in env_origins.split(",")
            if origin.strip()
        ]
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================
# ROUTES
# ============================

@app.get("/")
def home():
    return {
        "message": "Eunoia AI Backend Running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


app.include_router(router)