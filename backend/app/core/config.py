import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Eunoia"
    API_VERSION: str = "v1"
    GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./eunoia.db")
    ALLOWED_ORIGINS: list[str] = [origin.strip() for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",") if origin.strip()]

settings = Settings()
