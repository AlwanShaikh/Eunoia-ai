from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.api.v1.router import router


app = FastAPI(
    title="Eunoia AI",
    version="1.0.0"
)


allowed_origins = [
    "https://eunoia-pkyn53hkm-alwan-shaikh.vercel.app",
    "http://localhost:3000",
]

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


@app.get("/")
def home():
    return {"message": "Eunoia AI Backend Running"}


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(router)