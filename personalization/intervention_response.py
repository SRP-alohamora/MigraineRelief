"""
Intervention-Response Data Model for MigraineRelief.

Encodes patient-reported acute intervention outcomes:
P(2-hour pain freedom | Intervention, Timing, Baseline Severity, Context).
"""

from enum import Enum
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field


class InterventionType(str, Enum):
    TRIPTAN = "triptan"
    NSAID = "nsaid"
    GEPANT = "gepant"
    DITAN = "ditan"
    COMBINATION = "combination"
    REST_HYDRATION = "rest_hydration"
    NEUROMODULATION = "neuromodulation"


class TimingWindow(str, Enum):
    EARLY_LE_60_MIN = "early_le_60_min"
    INTERMEDIATE_60_TO_120_MIN = "intermediate_60_to_120_min"
    DELAYED_GT_120_MIN = "delayed_gt_120_min"


class InterventionRecord(BaseModel):
    """Single episode of acute migraine intervention tracking."""
    record_id: str
    patient_id: str
    timestamp_utc: str
    intervention_type: InterventionType
    specific_agent: str  # e.g., 'Sumatriptan 50mg', 'Ibuprofen 400mg'
    timing_window: TimingWindow
    minutes_from_onset: int
    baseline_pain_score: int = Field(ge=0, le=10)
    aura_present: bool = False
    allodynia_present: bool = False
    # Outcomes at 2 hours post-dose
    pain_free_at_2h: bool
    headache_relief_at_2h: bool  # Pain reduction to mild or none
    most_bothersome_symptom_free_at_2h: bool = False
    adverse_effects_reported: Optional[str] = None
