"""
Subgroup evaluation and algorithmic fairness auditing for MigraineRelief.

Audits model performance degradation across clinical slices:
- Age brackets (under 30, 30-50, over 50)
- Attack severity (mild/moderate vs high intensity)
- Aura status (with aura vs without aura)
- Frequency (episodic vs frequent/chronic)
"""

from typing import Dict, List, Optional, Any
import numpy as np
import pandas as pd
from sklearn.metrics import f1_score, accuracy_score, balanced_accuracy_score


class SubgroupEvaluator:
    """Evaluates model performance across clinical subgroups to detect performance disparities."""

    @staticmethod
    def evaluate_subgroups(
        y_true: np.ndarray,
        y_pred: np.ndarray,
        subgroups_df: pd.DataFrame,
        subgroup_cols: Optional[List[str]] = None,
        min_samples: int = 10
    ) -> Dict[str, Any]:
        """
        Computes metric breakdown across subgroup slices.
        """
        y_true = np.asarray(y_true)
        y_pred = np.asarray(y_pred)
        cols = subgroup_cols or list(subgroups_df.columns)

        overall_f1 = float(f1_score(y_true, y_pred, average="macro", zero_division=0))
        results: Dict[str, Any] = {
            "overall_macro_f1": overall_f1,
            "overall_accuracy": float(accuracy_score(y_true, y_pred)),
            "subgroups": {},
            "degradations": {},
            "disparities_detected": False,
        }

        max_drop = 0.0

        for col in cols:
            if col not in subgroups_df.columns:
                continue

            col_slices = {}
            for val in subgroups_df[col].dropna().unique():
                mask = (subgroups_df[col] == val).values
                n_slice = np.sum(mask)
                if n_slice < min_samples:
                    continue

                slice_true = y_true[mask]
                slice_pred = y_pred[mask]
                slice_f1 = float(f1_score(slice_true, slice_pred, average="macro", zero_division=0))
                slice_acc = float(accuracy_score(slice_true, slice_pred))
                drop = overall_f1 - slice_f1

                col_slices[str(val)] = {
                    "n_samples": int(n_slice),
                    "macro_f1": slice_f1,
                    "accuracy": slice_acc,
                    "f1_drop_from_overall": drop,
                }

                if drop > max_drop:
                    max_drop = drop
                if drop >= 0.15:
                    results["disparities_detected"] = True
                    results["degradations"][f"{col}:{val}"] = {
                        "drop": drop,
                        "slice_f1": slice_f1,
                        "overall_f1": overall_f1,
                    }

            if col_slices:
                results["subgroups"][col] = col_slices

        results["max_f1_drop"] = max_drop
        return results


def generate_subgroup_audit_summary(audit_results: Dict[str, Any]) -> str:
    """Formats markdown summary of fairness and subgroup audit."""
    lines = [
        "### Clinical Subgroup Fairness & Disparity Audit",
        f"- **Overall Macro F1**: {audit_results.get('overall_macro_f1', 0.0):.4f}",
        f"- **Max Subgroup F1 Degradation**: {audit_results.get('max_f1_drop', 0.0):.4f}",
        f"- **Severe Disparities Detected (drop >= 0.15)**: {audit_results.get('disparities_detected', False)}",
        "",
        "| Subgroup Dimension | Slice Value | Sample Count | Macro F1 | Disparity vs Overall |",
        "| :--- | :--- | :--- | :--- | :--- |",
    ]

    subgroups = audit_results.get("subgroups", {})
    for col, slices in subgroups.items():
        for val, metrics in slices.items():
            drop = metrics["f1_drop_from_overall"]
            drop_str = f"-{drop:.4f}" if drop > 0 else f"+{abs(drop):.4f}"
            alert = " ⚠️" if drop >= 0.15 else ""
            lines.append(
                f"| {col} | {val} | {metrics['n_samples']} | {metrics['macro_f1']:.4f} | {drop_str}{alert} |"
            )

    return "\n".join(lines)
