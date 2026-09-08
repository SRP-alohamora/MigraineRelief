"""
Bootstrap Confidence Interval Estimator.

Supports:
- Standard row-level bootstrap for cross-sectional studies
- Patient-level cluster bootstrap for repeated-measures studies
- Computes empirical 95% Confidence Intervals (2.5% to 97.5%) and bootstrap standard error.
"""

from typing import Callable, Dict, List, Optional, Tuple, Any
import numpy as np
import pandas as pd


class BootstrapEstimator:
    """Computes robust empirical 95% confidence intervals via resampling."""

    @staticmethod
    def estimate_ci(
        y_true: np.ndarray,
        y_pred: np.ndarray,
        metric_fn: Callable[[np.ndarray, np.ndarray], float],
        n_bootstraps: int = 1000,
        ci_level: float = 0.95,
        groups: Optional[np.ndarray] = None,
        random_state: int = 42
    ) -> Dict[str, float]:
        """
        Computes metric point estimate and bootstrap confidence intervals.
        If groups is provided, performs cluster-level resampling by patient ID.
        """
        y_true = np.asarray(y_true)
        y_pred = np.asarray(y_pred)
        point_estimate = float(metric_fn(y_true, y_pred))

        rng = np.random.RandomState(random_state)
        n_samples = len(y_true)
        boot_scores: List[float] = []

        alpha = (1.0 - ci_level) / 2.0
        low_pct = alpha * 100.0
        high_pct = (1.0 - alpha) * 100.0

        if groups is None:
            # Row-level bootstrap
            for _ in range(n_bootstraps):
                indices = rng.choice(n_samples, size=n_samples, replace=True)
                # Check for single-class degenerate case
                if len(np.unique(y_true[indices])) < 2:
                    continue
                try:
                    score = metric_fn(y_true[indices], y_pred[indices])
                    boot_scores.append(float(score))
                except Exception:
                    continue
        else:
            # Cluster bootstrap by patient ID
            groups = np.asarray(groups)
            unique_patients = np.unique(groups)
            n_patients = len(unique_patients)
            patient_to_indices = {pid: np.where(groups == pid)[0] for pid in unique_patients}

            for _ in range(n_bootstraps):
                sampled_patients = rng.choice(unique_patients, size=n_patients, replace=True)
                sample_indices = []
                for pid in sampled_patients:
                    sample_indices.extend(patient_to_indices[pid])
                sample_indices = np.array(sample_indices)

                if len(np.unique(y_true[sample_indices])) < 2:
                    continue
                try:
                    score = metric_fn(y_true[sample_indices], y_pred[sample_indices])
                    boot_scores.append(float(score))
                except Exception:
                    continue

        if len(boot_scores) < 10:
            return {
                "point_estimate": point_estimate,
                "ci_lower": point_estimate,
                "ci_upper": point_estimate,
                "std_error": 0.0,
                "n_valid_bootstraps": len(boot_scores),
            }

        ci_lower = float(np.percentile(boot_scores, low_pct))
        ci_upper = float(np.percentile(boot_scores, high_pct))
        std_error = float(np.std(boot_scores))

        return {
            "point_estimate": point_estimate,
            "ci_lower": ci_lower,
            "ci_upper": ci_upper,
            "std_error": std_error,
            "n_valid_bootstraps": len(boot_scores),
        }
