from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    # App
    APP_NAME: str = "AI Content Platform"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    
    # Database - SQLite for local dev, PostgreSQL for production
    DATABASE_URL: str = "sqlite+aiosqlite:///./adsapp.db"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # AI Services
    REPLICATE_API_TOKEN: str = ""
    OPENAI_API_KEY: str = ""
    ELEVENLABS_API_KEY: str = ""
    HEYGEN_API_KEY: str = ""
    
    # Storage
    S3_BUCKET_NAME: str = "adsapp-media"
    S3_ACCESS_KEY: str = ""
    S3_SECRET_KEY: str = ""
    S3_ENDPOINT_URL: str = ""
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Credits System
    DEFAULT_USER_CREDITS: int = 100
    CREDITS_IMAGE_GENERATION: int = 5
    CREDITS_BACKGROUND_REMOVAL: int = 2
    CREDITS_VIDEO_GENERATION: int = 50
    CREDITS_VIDEO_PRESENTER: int = 100
    CREDITS_VOICEOVER: int = 10
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
