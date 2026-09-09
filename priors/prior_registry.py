"""
Population Prior Registry for MigraineRelief.

Manages curated priors derived from literature and observational cohorts.
"""

from typing import Dict, List, Optional
from priors.population_prior import PopulationPrior


class PriorRegistry:
    """Central registry of population priors."""

    def __init__(self):
        self._priors: Dict[str, PopulationPrior] = {}
        self._load_default_priors()

    def _load_default_priors(self):
        """Loads canonical population priors."""
        # 1. Early Triptan Trial Prior (Burstein et al. 2000, Cochrane)
        self.register(
            PopulationPrior(
                prior_id="PRIOR_TRIPTAN_EARLY_2H_PAIN_FREE",
                target_metric="2h_pain_free_rate",
                description="2-hour pain freedom rate when triptan taken within 60 minutes of attack onset.",
                source_dataset="Burstein et al. 2000 & Cochrane Systematic Review",
                evidence_level=2,
                alpha=6.8,
                beta=3.2,
                mean_rate=0.68,
                confidence_interval=[0.58, 0.77],
                covariate_modifiers={"severe_baseline_intensity": -0.15, "aura_present": -0.05}
            )
        )

        # 2. Delayed Triptan Trial Prior (> 2 hours onset)
        self.register(
            PopulationPrior(
                prior_id="PRIOR_TRIPTAN_DELAYED_2H_PAIN_FREE",
                target_metric="2h_pain_free_rate",
                description="2-hour pain freedom rate when triptan taken after 120 minutes of attack onset.",
                source_dataset="Burstein et al. 2000 & Cochrane Systematic Review",
                evidence_level=2,
                alpha=3.5,
                beta=6.5,
                mean_rate=0.35,
                confidence_interval=[0.25, 0.45],
                covariate_modifiers={"allodynia_present": -0.20}
            )
        )

        # 3. NSAID (Ibuprofen/Naproxen) Trial Prior
        self.register(
            PopulationPrior(
                prior_id="PRIOR_NSAID_EARLY_2H_PAIN_FREE",
                target_metric="2h_pain_free_rate",
                description="2-hour pain freedom rate for acute NSAID administration in mild-to-moderate attacks.",
                source_dataset="AHS Guidelines & Cochrane NSAID Review",
                evidence_level=2,
                alpha=4.5,
                beta=5.5,
                mean_rate=0.45,
                confidence_interval=[0.35, 0.55],
                covariate_modifiers={"severe_baseline_intensity": -0.25}
            )
        )

        # 4. Observational Daily Attack Risk (Wearable 11,879)
        self.register(
            PopulationPrior(
                prior_id="PRIOR_WEARABLE_BASELINE_ATTACK_RISK",
                target_metric="daily_attack_probability",
                description="Baseline daily attack risk in episodic migraineurs under normal lifestyle conditions.",
                source_dataset="Wearable Lifestyle Cohort (11,879 patient-days)",
                evidence_level=3,
                alpha=2.0,
                beta=8.0,
                mean_rate=0.20,
                confidence_interval=[0.12, 0.28],
                covariate_modifiers={"sleep_deficit_gt_2h": 0.25, "stress_gt_8": 0.20}
            )
        )

        # 5. BMJ 2024 AMADEUS Network Meta-Analysis Priors (17 Acute Drugs, 137 RCTs, 89,445 Patients)
        self._load_amadeus_bmj2024_priors()

    def _load_amadeus_bmj2024_priors(self) -> None:
        """Loads canonical priors from the BMJ 2024 AMADEUS Network Meta-Analysis (Karlsson et al. / PMC11409395)."""
        import os
        import json

        data_path = os.path.join(
            os.path.dirname(__file__), "..", "data", "amadeus_bmj2024", "amadeus_17_drugs_meta_analysis.json"
        )
        if not os.path.exists(data_path):
            return

        with open(data_path, "r") as f:
            data = json.load(f)

        drugs = data.get("drugs", {})
        for key, drug in drugs.items():
            prior_id = f"PRIOR_AMADEUS_{key.upper()}"
            mean_rate = float(drug.get("mean_2h_pain_free_rate", 0.25))
            # Parameterize Beta(alpha, beta) centered on mean_rate with pseudo-sample size of 10
            alpha = round(mean_rate * 10.0, 2)
            beta_val = round((1.0 - mean_rate) * 10.0, 2)

            self.register(
                PopulationPrior(
                    prior_id=prior_id,
                    target_metric="2h_pain_free_rate",
                    description=f"BMJ 2024 NMA 2h pain freedom prior for {drug.get('drug_name')}.",
                    source_dataset="BMJ 2024;386:e080107 (Karlsson et al. / PMC11409395)",
                    evidence_level=2,
                    alpha=alpha,
                    beta=beta_val,
                    mean_rate=mean_rate,
                    confidence_interval=drug.get("ci_95_2h", []),
                    odds_ratio_vs_placebo=drug.get("or_pain_free_2h_vs_placebo"),
                    ci_95=drug.get("ci_95_2h", []),
                    drug_name=drug.get("drug_name"),
                    drug_class=drug.get("drug_class"),
                    routes=drug.get("routes", []),
                    cinema_confidence=drug.get("cinema_confidence"),
                    vasoconstrictive=drug.get("vasoconstrictive_contraindication_cad", False),
                    pediatric_cleared=drug.get("pediatric_cleared", False),
                    gastric_stasis_bypass=drug.get("gastric_stasis_bypass", False),
                    disclaimer="AMADEUS 2024 PRIOR: Derived from 137 randomized controlled trials (N=89,445). Anchors baseline Bayesian expectation.",
                )
            )

    def register(self, prior: PopulationPrior) -> None:
        self._priors[prior.prior_id] = prior

    def get_prior(self, prior_id: str) -> Optional[PopulationPrior]:
        return self._priors.get(prior_id)

    def list_priors(self) -> List[PopulationPrior]:
        return list(self._priors.values())

    def get_amadeus_priors(self) -> List[PopulationPrior]:
        """Returns all priors derived from the BMJ 2024 AMADEUS network meta-analysis."""
        return [p for p in self._priors.values() if p.prior_id.startswith("PRIOR_AMADEUS_")]

    def get_prior_for_drug(self, drug_name: str) -> Optional[PopulationPrior]:
        """Finds prior by matching drug name substring."""
        target = drug_name.lower().replace(" ", "_")
        for prior in self._priors.values():
            if prior.drug_name and target in prior.drug_name.lower().replace(" ", "_"):
                return prior
            if prior.prior_id.lower().endswith(target):
                return prior
        return None
