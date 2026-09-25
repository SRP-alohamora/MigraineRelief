"""Application settings and configuration management via Pydantic v2."""

from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    PROJECT_NAME: str = "MigraineRelief AI"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = Field(default="development", description="development | staging | production")
    DEBUG: bool = Field(default=False)
    
    # Security & CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
    ]
    SECRET_KEY: str = Field(default="migrainerelief-local-dev-secret-key-32-chars-minimum")
    SUPABASE_JWT_SECRET: str = Field(default="super-secret-jwt-token-with-at-least-32-characters-for-gotrue")
    SUPABASE_URL: str = Field(default="https://localhost:8000")

    # Knowledge Layer & Context
    OPENVIKING_ROOT_URI: str = "viking://"
    VIKING_LOCAL_FS_PATH: str = "app/knowledge/viking_filesystem"
    
    # Embedded Storage
    DUCKDB_PATH: str = ":memory:"
    
    # Telemetry
    ENABLE_TELEMETRY: bool = False
    LOG_LEVEL: str = "INFO"


settings = Settings()
