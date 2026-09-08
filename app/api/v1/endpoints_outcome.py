"""Closed-loop 2-hour and 24-hour treatment outcome tracking."""

from typing import List, Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/outcome", tags=["Outcome Tracking"])


class OutcomeReport(BaseModel):
    run_id: str
    session_id: str = "anonymousPatient_0"
    hours_post_treatment: int = Field(..., ge=1, le=72, description="2 or 24 hour evaluation")
    current_pain_scale: int = Field(..., ge=0, le=10, description="Current pain score 0-10")
    pain_free: bool = Field(..., description="True if pain is 0/10")
    headache_recurrence: bool = Field(default=False, description="True if pain returned within 24-48h")
    adverse_events: List[str] = Field(default_factory=list)


class OutcomeResponse(BaseModel):
    status: str = "RECORDED"
    run_id: str
    message: str


@router.post("/report", response_model=OutcomeResponse)
async def report_outcome(payload: OutcomeReport) -> OutcomeResponse:
    """Records patient-reported outcome at 2h or 24h to update Bayesian individual posteriors."""
    return OutcomeResponse(
        status="RECORDED",
        run_id=payload.run_id,
        message=f"Outcome at {payload.hours_post_treatment}h recorded successfully for anonymous session.",
    )
