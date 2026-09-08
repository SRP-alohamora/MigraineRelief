"""In-attack emergency rescue API endpoints (<50ms SLA)."""

from typing import List, Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.core.graph import MigraineStateGraphRunner
from app.core.state import MigraineRunState

router = APIRouter(prefix="/rescue", tags=["Acute Rescue"])
graph_runner = MigraineStateGraphRunner()


class RescueRequest(BaseModel):
    """In-attack prompt (<3 taps payload)."""

    minutes_since_onset: int = Field(..., ge=0, le=1440, description="Elapsed minutes since attack onset")
    nausea_present: bool = Field(default=False, description="Presence of nausea / gastric stasis")
    vomiting_present: bool = Field(default=False, description="Presence of active vomiting")
    cutaneous_allodynia_flag: bool = Field(default=False, description="Scalp / skin sensitivity present")
    current_pain_scale: int = Field(default=7, ge=1, le=10, description="Pain score 1-10")
    patient_age: int = Field(default=35, ge=1, le=120, description="Age in years")
    cardiovascular_disease: bool = Field(default=False, description="Known CAD / stroke / ischemia history")
    hemiplegic_migraine_history: bool = Field(default=False, description="History of motor weakness or hemiplegic aura")
    rolling_30d_triptan_days: int = Field(default=0, ge=0, description="Triptan days in rolling 30-day window")
    rolling_30d_nsaid_days: int = Field(default=0, ge=0, description="NSAID days in rolling 30-day window")
    approved_medications: List[str] = Field(default_factory=list, description="Patient's prescribed medications formulary")


@router.post("/evaluate", response_model=MigraineRunState)
async def evaluate_acute_rescue(payload: RescueRequest) -> MigraineRunState:
    """Real-time acute rescue endpoint.
    
    Latency SLA: <50ms.
    Deterministic execution without external LLM round trips on the critical path.
    """
    state = MigraineRunState(
        minutes_since_onset=payload.minutes_since_onset,
        nausea_present=payload.nausea_present,
        vomiting_present=payload.vomiting_present,
        cutaneous_allodynia_flag=payload.cutaneous_allodynia_flag,
        current_pain_scale=payload.current_pain_scale,
        patient_age=payload.patient_age,
        cardiovascular_disease=payload.cardiovascular_disease,
        hemiplegic_migraine_history=payload.hemiplegic_migraine_history,
        rolling_30d_triptan_days=payload.rolling_30d_triptan_days,
        rolling_30d_nsaid_days=payload.rolling_30d_nsaid_days,
        approved_medications=payload.approved_medications,
    )

    result_state = graph_runner.run(state)
    return result_state
