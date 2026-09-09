"""Pydantic v2 execution state and data contracts for MigraineRelief AI."""

import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, field_validator


class TriageStatus(str, Enum):
    SAFE = "SAFE_FOR_ANALYSIS"
    RED_FLAG_EMERGENCY = "EMERGENCY_SNOOP4_DETECTED"


class AttackPhase(str, Enum):
    PRODROME = "PRODROME"
    AURA = "AURA"
    EARLY_HEADACHE = "EARLY_HEADACHE_PRE_ALLODYNIA"
    PEAK_HEADACHE = "PEAK_HEADACHE_ALLODYNIA_LOCKED"
    POSTDROME = "POSTDROME"


class DeliveryRoute(str, Enum):
    ORAL_TABLET = "ORAL_TABLET"
    ORAL_DISINTEGRATING = "ORAL_DISINTEGRATING_TABLET"
    INTRANASAL = "INTRANASAL_SPRAY"
    SUBCUTANEOUS = "SUBCUTANEOUS_AUTO_INJECTOR"
    RECTAL = "RECTAL_SUPPOSITORY"
    NEUROMODULATION = "NEUROMODULATION_DEVICE"


class EpistemicCertainty(str, Enum):
    LEVEL_1 = "Level 1: Confirmed Clinical Protocol"
    LEVEL_2 = "Level 2: Probabilistic Clinical Trial Prior"
    LEVEL_3 = "Level 3: Exploratory Population Prior"


class MigraineRunState(BaseModel):
    """Immutable, typed state schema flowing through the multi-agent graph."""

    # Execution Metadata
    run_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str = Field(default="anonymousPatient_0", description="Anonymous client-side session hash")
    timestamp_utc: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )

    # In-Attack Inputs (<3 Taps)
    minutes_since_onset: int = Field(..., ge=0, le=1440, description="Elapsed minutes since first symptoms")
    nausea_present: bool = Field(default=False, description="Binary gastric stasis flag")
    vomiting_present: bool = Field(default=False, description="Emesis active flag")
    cutaneous_allodynia_flag: bool = Field(default=False, description="Scalp/skin sensitivity indicator")
    aura_present: bool = Field(default=False, description="Visual or sensory aura present")
    current_pain_scale: int = Field(default=7, ge=1, le=10, description="NRS pain scale 1-10")

    # Patient Demographic & Clinical Constraints
    patient_age: int = Field(default=35, ge=1, le=120, description="Patient age in years")
    is_pediatric: bool = Field(default=False, description="True if patient age < 18")
    pregnancy_status: bool = Field(default=False, description="Active pregnancy contraindication flag")
    cardiovascular_disease: bool = Field(default=False, description="CAD / stroke / coronary vasospasm history")
    hemiplegic_migraine_history: bool = Field(default=False, description="Motor weakness / hemiplegic aura history")
    sudden_onset_paresis: bool = Field(default=False, description="Motor weakness appearing in <5 minutes (Scutelnic 2022 stroke mimic red flag)")
    isolated_negative_visual_defect: bool = Field(default=False, description="Dark vision / blindness without positive scintillations (Scutelnic 2022)")
    paresis_onset_seconds: Optional[int] = Field(default=None, description="Exact onset speed of motor weakness in seconds")
    approved_medications: List[str] = Field(default_factory=list, description="Prescribed medications formulary")

    # Deterministic Triage & Safety State
    triage_status: TriageStatus = Field(default=TriageStatus.SAFE)
    snoop4_red_flags: List[str] = Field(default_factory=list)
    emergency_divert_message: Optional[str] = None

    # Medication Overuse Ledger (Rolling 30-day window)
    rolling_30d_triptan_days: int = Field(default=0, ge=0)
    rolling_30d_nsaid_days: int = Field(default=0, ge=0)
    moh_limit_exceeded: bool = Field(default=False)

    # Context Navigation (OpenViking_007)
    viking_traversed_paths: List[str] = Field(default_factory=list)
    viking_pruned_paths: List[str] = Field(default_factory=list)
    retrieved_pharmacology: Optional[Dict[str, Any]] = None

    # Selected Optimization Actions
    recommended_molecule: Optional[str] = None
    recommended_route: DeliveryRoute = DeliveryRoute.ORAL_TABLET
    dosage_mg: Optional[float] = None
    adjuvant_antiemetic: Optional[str] = None
    timing_urgency_minutes: int = Field(default=30)
    route_switch_reasoning: Optional[str] = None
    epistemic_tier: EpistemicCertainty = EpistemicCertainty.LEVEL_1

    # Observability & Traceability
    cot_trajectory: List[Dict[str, Any]] = Field(default_factory=list)
    execution_latency_ms: float = Field(default=0.0)
    assertions_passed: bool = Field(default=False)

    @field_validator("is_pediatric", mode="before")
    @classmethod
    def auto_set_pediatric(cls, v: Any, info: Any) -> bool:
        """Derive is_pediatric automatically if patient_age is provided."""
        if isinstance(v, bool):
            return v
        return False
