"""FastAPI application entry point and lifespan configuration."""

from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1 import api_v1_router
from app.api.v1.endpoints_rescue import router as rescue_router
from app.api.v1.endpoints_patient import router as patient_router
from app.telemetry.metrics import RescueMetrics



@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Lifespan event handler for startup initialization and graceful shutdown."""
    # Startup actions
    yield
    # Teardown actions


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Deterministic-first clinical decision support and longitudinal biomarker intelligence for migraine.",
    lifespan=lifespan,
)

# Configure CORS for local PWA development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(api_v1_router, prefix=settings.API_V1_STR)
app.include_router(rescue_router)  # Also mount at root level /rescue for direct spec compatibility
app.include_router(patient_router)  # Also mount at root level /patient


@app.get("/", tags=["Status"])
async def root():
    """Root status endpoint."""
    return {
        "status": "ONLINE",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
    }


@app.get("/health", tags=["Status"])
async def health_check():
    """Liveness and readiness health probe."""
    return {
        "status": "HEALTHY",
        "timestamp_utc": "OK",
        "safety_gates": "ACTIVE",
    }


@app.get("/metrics", tags=["Telemetry"])
async def get_telemetry_metrics():
    """Latency and request volume telemetry metrics."""
    return RescueMetrics.get_summary()
