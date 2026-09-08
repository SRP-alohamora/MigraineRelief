"""API v1 router configuration."""

from fastapi import APIRouter
from app.api.v1.endpoints_rescue import router as rescue_router
from app.api.v1.endpoints_sandbox import router as sandbox_router
from app.api.v1.endpoints_outcome import router as outcome_router
from app.api.v1.endpoints_patient import router as patient_router

api_v1_router = APIRouter()
api_v1_router.include_router(rescue_router)
api_v1_router.include_router(sandbox_router)
api_v1_router.include_router(outcome_router)
api_v1_router.include_router(patient_router)

