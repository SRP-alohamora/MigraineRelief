"""
Structured Population Priors for MigraineRelief.

Level 3 Evidence: Observational population anchors derived from public cohorts.
Designated as informative starting points, NOT individualized prescriptions.
"""

from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field


class PopulationPrior(BaseModel):
    """Encapsulates an observational prior distribution for a specific clinical condition."""
    prior_id: str
    target_metric: str
    description: str
    source_dataset: str
    evidence_level: int = 3
    alpha: float
    beta: float
    mean_rate: float
    confidence_interval: List[float] = Field(default_factory=list)
    covariate_modifiers: Dict[str, float] = Field(default_factory=dict)
    odds_ratio_vs_placebo: Optional[float] = None
    ci_95: List[float] = Field(default_factory=list)
    drug_name: Optional[str] = None
    drug_class: Optional[str] = None
    routes: List[str] = Field(default_factory=list)
    cinema_confidence: Optional[str] = None
    vasoconstrictive: bool = False
    pediatric_cleared: bool = False
    gastric_stasis_bypass: bool = False
    disclaimer: str = (
        "POPULATION PRIOR NOTICE: This prior reflects aggregate observational/trial data. "
        "It provides an initial Bayesian anchor and must be updated with personal patient observations."
    )
