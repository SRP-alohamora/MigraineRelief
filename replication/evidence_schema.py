"""
Evidence Graph & Cross-Dataset Replication Schema for MigraineRelief.

Encodes evidence items, replication status, and clinical evidence tiers (Levels 1 to 4).
"""

from enum import Enum
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field


class ReplicationStatus(str, Enum):
    REPLICATED = "REPLICATED"
    PARTIAL_REPLICATION = "PARTIAL_REPLICATION"
    NON_REPLICATED = "NON_REPLICATED"
    DOMAIN_INAPPLICABLE = "DOMAIN_INAPPLICABLE"
    HYPOTHESIS_ONLY = "HYPOTHESIS_ONLY"


class ClinicalEvidenceLevel(int, Enum):
    LEVEL_1_CLINICAL_PROTOCOL = 1       # Evidence-based clinical guidelines & consensus (AHS, ICHD-3)
    LEVEL_2_TRIAL_PRIOR = 2             # Randomized controlled trial benchmark priors (e.g. triptan 2h efficacy)
    LEVEL_3_EXPLORATORY_POPULATION = 3  # Observational public dataset priors (Clinical 400, Wearables, UKB)
    LEVEL_4_PATIENT_POSTERIOR = 4       # Proprietary patient-specific posterior / N-of-1 trial graph


class EvidenceItem(BaseModel):
    """Represents a validated or hypothesized finding across independent dataset layers."""
    finding_id: str
    finding_description: str
    target_phenotype: str
    primary_dataset: str
    primary_metric: Dict[str, float]
    external_validation_datasets: List[str]
    replication_status: ReplicationStatus
    clinical_evidence_level: ClinicalEvidenceLevel
    effect_direction_consistent: bool
    limitations: str
    actionability: str
    notes: Optional[str] = None
