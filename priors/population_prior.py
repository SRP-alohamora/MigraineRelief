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
    # Beta distribution parameters for response rates: Beta(alpha, beta)
    alpha: float
    beta: float
    mean_rate: float
    confidence_interval: List[float] = Field(default_factory=list)
    covariate_modifiers: Dict[str, float] = Field(default_factory=dict)
    disclaimer: str = (
        "POPULATION PRIOR NOTICE: This prior reflects aggregate observational study data. "
        "It provides an initial Bayesian anchor and must be updated with personal patient observations."
    )
