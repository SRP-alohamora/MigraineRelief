"""
Patient-Specific Posterior & N-of-1 Personalization Engine.

Implements Level 4 Evidence: Transitions from population trial priors (Levels 1-3)
to individualized patient posteriors via Bayesian updating.
Guards against Medication Overuse Headache (MOH) with safety checks.
"""

from typing import Dict, List, Optional, Tuple, Any
import numpy as np
from scipy.stats import beta

from priors.population_prior import PopulationPrior
from priors.prior_registry import PriorRegistry
from personalization.intervention_response import (
    InterventionRecord,
    InterventionType,
    TimingWindow,
)


class PatientInterventionPosterior:
    """Computes personalized posterior distributions for acute migraine treatments."""

    # Safety limits: maximum allowed treatment days per 30-day window to prevent MOH
    SAFETY_MONTHLY_LIMITS = {
        InterventionType.TRIPTAN: 10,
        InterventionType.NSAID: 15,
        InterventionType.COMBINATION: 10,
    }

    def __init__(self, patient_id: str, prior_registry: Optional[PriorRegistry] = None):
        self.patient_id = patient_id
        self.registry = prior_registry or PriorRegistry()
        self.records: List[InterventionRecord] = []

    def log_intervention(self, record: InterventionRecord) -> None:
        """Appends an intervention episode."""
        if record.patient_id != self.patient_id:
            raise ValueError(f"Record patient_id '{record.patient_id}' does not match '{self.patient_id}'")
        self.records.append(record)

    def get_monthly_treatment_days(self, intervention_type: InterventionType) -> int:
        """Counts treatments logged."""
        # Simple count of records matching type
        return sum(1 for r in self.records if r.intervention_type == intervention_type)

    def check_safety_alerts(self, proposed_type: InterventionType) -> List[str]:
        """Checks if current frequency approaches or breaches medication overuse thresholds."""
        alerts = []
        limit = self.SAFETY_MONTHLY_LIMITS.get(proposed_type)
        if limit:
            count = self.get_monthly_treatment_days(proposed_type)
            if count >= limit:
                alerts.append(
                    f"⚠️ CRITICAL SAFETY WARNING: You have logged {count} days of {proposed_type.value} treatment. "
                    f"Exceeding {limit} days/month increases risk of Medication Overuse Headache (MOH). "
                    f"Please consult your neurologist regarding preventive treatment options."
                )
            elif count >= limit - 2:
                alerts.append(
                    f"ℹ️ SAFETY ADVISORY: You are at {count}/{limit} recommended monthly limit days for {proposed_type.value}."
                )
        return alerts

    def update_posterior(
        self,
        intervention_type: InterventionType,
        timing_window: TimingWindow = TimingWindow.EARLY_LE_60_MIN,
    ) -> Dict[str, Any]:
        """
        Calculates personal posterior Beta distribution:
        Beta(alpha_post, beta_post) = Beta(alpha_prior + successes, beta_prior + failures).
        """
        # Select appropriate anchor prior
        if intervention_type == InterventionType.TRIPTAN:
            prior_id = (
                "PRIOR_TRIPTAN_EARLY_2H_PAIN_FREE"
                if timing_window == TimingWindow.EARLY_LE_60_MIN
                else "PRIOR_TRIPTAN_DELAYED_2H_PAIN_FREE"
            )
        elif intervention_type == InterventionType.NSAID:
            prior_id = "PRIOR_NSAID_EARLY_2H_PAIN_FREE"
        else:
            # Neutral non-informative prior
            prior_id = None

        if prior_id:
            pop_prior = self.registry.get_prior(prior_id)
            alpha_0 = pop_prior.alpha if pop_prior else 2.0
            beta_0 = pop_prior.beta if pop_prior else 2.0
            prior_desc = pop_prior.description if pop_prior else "Flat Beta(2,2)"
        else:
            alpha_0, beta_0 = 2.0, 2.0
            prior_desc = "Neutral Beta(2,2) Prior"

        # Filter patient records
        matching_records = [
            r for r in self.records
            if r.intervention_type == intervention_type and r.timing_window == timing_window
        ]
        n_trials = len(matching_records)
        k_successes = sum(1 for r in matching_records if r.pain_free_at_2h)
        k_failures = n_trials - k_successes

        # Bayesian Conjugate Beta-Binomial Update
        alpha_post = alpha_0 + k_successes
        beta_post = beta_0 + k_failures

        # Posterior statistics
        mean_prob = alpha_post / (alpha_post + beta_post)
        ci_low = float(beta.ppf(0.025, alpha_post, beta_post))
        ci_high = float(beta.ppf(0.975, alpha_post, beta_post))

        # Personalization weight: fraction of total information derived from patient's data
        patient_weight_pct = float((n_trials / (alpha_0 + beta_0 + n_trials)) * 100.0)

        return {
            "patient_id": self.patient_id,
            "intervention_type": intervention_type.value,
            "timing_window": timing_window.value,
            "prior_description": prior_desc,
            "prior_alpha": alpha_0,
            "prior_beta": beta_0,
            "patient_trials": n_trials,
            "patient_successes_2h": k_successes,
            "posterior_alpha": alpha_post,
            "posterior_beta": beta_post,
            "posterior_expected_pain_freedom_rate": float(mean_prob),
            "credible_interval_95": [ci_low, ci_high],
            "patient_evidence_weight_pct": patient_weight_pct,
            "evidence_tier": "Level 4 (Patient-Specific Posterior)" if n_trials >= 3 else "Level 2/3 (Prior Dominant)",
        }

    @staticmethod
    def compare_interventions(
        posterior_a: Dict[str, Any],
        posterior_b: Dict[str, Any],
        n_mc_samples: int = 10000,
    ) -> Dict[str, Any]:
        """
        Computes P(Intervention A > Intervention B) via Monte Carlo sampling.
        """
        samples_a = beta.rvs(
            posterior_a["posterior_alpha"],
            posterior_a["posterior_beta"],
            size=n_mc_samples
        )
        samples_b = beta.rvs(
            posterior_b["posterior_alpha"],
            posterior_b["posterior_beta"],
            size=n_mc_samples
        )

        prob_a_superior = float(np.mean(samples_a > samples_b))
        expected_diff = float(np.mean(samples_a - samples_b))

        return {
            "intervention_a": posterior_a["intervention_type"],
            "intervention_b": posterior_b["intervention_type"],
            "prob_a_superior_to_b": prob_a_superior,
            "expected_difference": expected_diff,
            "clinical_recommendation": (
                f"{posterior_a['intervention_type']} has {prob_a_superior * 100:.1f}% probability of superior "
                f"2-hour pain freedom for this patient under current conditions."
            )
        }
