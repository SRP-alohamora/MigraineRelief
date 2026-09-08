"""
Cross-Fold Feature Stability Scoring for MigraineRelief.

Implements Tier C: Quantifies whether feature attributions remain stable across CV folds,
guarding against declaring unstable partition artifacts as clinical findings.
"""

from typing import Dict, List, Optional, Tuple, Any
import numpy as np
import pandas as pd


class FeatureStabilityScorer:
    """Computes cross-fold rank variance, direction consistency, and stability bands."""

    BAND_THRESHOLDS = [
        (0.85, "HIGH"),
        (0.65, "MODERATE"),
        (0.40, "LOW"),
        (0.00, "UNSTABLE"),
    ]

    @staticmethod
    def compute_stability(
        fold_importances: List[pd.Series],
    ) -> pd.DataFrame:
        """
        Takes a list of feature importance Series (one per CV fold).
        Returns stability metrics per feature.
        """
        n_folds = len(fold_importances)
        if n_folds < 2:
            raise ValueError("At least 2 fold importance series are required for stability scoring.")

        # Combine into DataFrame: columns are folds, rows are features
        df_folds = pd.concat(fold_importances, axis=1)
        df_ranks = df_folds.rank(ascending=False) # 1 = most important

        all_features = df_folds.index
        n_features = len(all_features)

        results = []
        for feat in all_features:
            ranks = df_ranks.loc[feat].values
            values = df_folds.loc[feat].values

            mean_rank = float(np.mean(ranks))
            std_rank = float(np.std(ranks))

            # Direction consistency: proportion of folds with positive sign (or >= 0)
            n_positive = np.sum(values >= 0)
            n_negative = np.sum(values < 0)
            direction_consistency = float(max(n_positive, n_negative) / n_folds)

            # Normalized rank variance (0 = invariant rank, 1 = max variance)
            max_possible_var = ((n_features - 1) / 2.0) ** 2
            rank_var = float(np.var(ranks))
            norm_rank_stability = 1.0 - min(1.0, rank_var / max_possible_var if max_possible_var > 0 else 0.0)

            # Composite stability score: 60% rank stability, 40% direction consistency
            stability_score = float((0.60 * norm_rank_stability) + (0.40 * direction_consistency))

            # Determine band
            band = "UNSTABLE"
            for thresh, label in FeatureStabilityScorer.BAND_THRESHOLDS:
                if stability_score >= thresh:
                    band = label
                    break

            results.append({
                "feature": feat,
                "mean_rank": mean_rank,
                "std_rank": std_rank,
                "direction_consistency": direction_consistency,
                "stability_score": stability_score,
                "stability_band": band,
            })

        res_df = pd.DataFrame(results).sort_values(by="stability_score", ascending=False).reset_index(drop=True)
        return res_df

    @staticmethod
    def generate_stability_report(stability_df: pd.DataFrame) -> str:
        """Generates markdown summary of feature stability bands."""
        lines = [
            "### Cross-Fold Feature Attribution Stability Analysis",
            "Stability bands: **HIGH** (≥0.85), **MODERATE** (0.65–0.84), **LOW** (0.40–0.64), **UNSTABLE** (<0.40)",
            "",
            "| Feature | Mean Rank | Rank Std | Direction Consistency | Stability Score | Band |",
            "| :--- | :--- | :--- | :--- | :--- | :--- |",
        ]

        for _, row in stability_df.iterrows():
            badge = {
                "HIGH": "🟢 HIGH",
                "MODERATE": "🟡 MODERATE",
                "LOW": "🟠 LOW",
                "UNSTABLE": "🔴 UNSTABLE",
            }.get(row["stability_band"], row["stability_band"])

            lines.append(
                f"| {row['feature']} | #{row['mean_rank']:.1f} | ±{row['std_rank']:.2f} | "
                f"{row['direction_consistency'] * 100:.0f}% | {row['stability_score']:.3f} | {badge} |"
            )

        return "\n".join(lines)
