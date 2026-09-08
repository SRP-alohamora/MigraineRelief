"""
Model Card Generator for MigraineRelief (Mitchell et al. compliant).
"""

from typing import Dict, List, Optional, Any
from evaluation.final_holdout import ModelRunManifest


class ModelCardGenerator:
    """Generates standardized clinical model cards."""

    @staticmethod
    def generate(
        manifest: ModelRunManifest,
        fairness_summary_md: Optional[str] = None,
        stability_summary_md: Optional[str] = None,
    ) -> str:
        """Constructs markdown model card."""
        holdout_str = (
            f"**Macro F1**: {manifest.holdout_metrics.get('macro_f1', 0.0):.4f} | "
            f"**Balanced Acc**: {manifest.holdout_metrics.get('balanced_accuracy', 0.0):.4f} | "
            f"**ECE**: {manifest.holdout_metrics.get('ece', 0.0):.4f}"
            if manifest.holdout_evaluated
            else "*Locked (Un-evaluated)*"
        )

        lines = [
            f"# Clinical Model Card: {manifest.model_name}",
            "",
            "## 1. Model Details",
            f"- **Run ID**: `{manifest.run_id}`",
            f"- **Timestamp**: `{manifest.timestamp_utc}`",
            f"- **Architecture / Model Type**: `{manifest.model_name}`",
            f"- **Training Dataset**: `{manifest.dataset_name}`",
            f"- **Dataset Hash**: `{manifest.dataset_hash}`",
            f"- **Hyperparameters**: `{manifest.hyperparameters}`",
            "",
            "## 2. Intended Use",
            "- **Primary Purpose**: Diagnostic phenotyping and baseline clinical risk stratification.",
            "- **Target Population**: Adult patients experiencing recurring headache episodes seeking structured clinical characterization.",
            "- **Clinical Decision Support Role**: Level 3 Observational Prior intended to assist neurologist evaluation, NOT replace physician diagnosis.",
            "",
            "## 3. Out-of-Scope & Contraindicated Uses",
            "- **Autonomous Emergency Triage**: Prohibited for ruling out secondary headaches (e.g., subarachnoid hemorrhage, meningitis, stroke).",
            "- **Pediatric Populations**: Not validated for pediatric migraine without dedicated clinical study.",
            "- **Autonomous Prescription**: Model outputs cannot autonomously authorize or dispense prescription therapeutics.",
            "",
            "## 4. Quantitative Evaluation",
            f"- **Development Cross-Validation Score ({manifest.dev_cv_metric})**: {manifest.dev_cv_score:.4f}",
            f"- **Final Locked Holdout Evaluation**: {holdout_str}",
            f"- **Holdout Lock State**: `{manifest.state.value}`",
            "",
        ]

        if fairness_summary_md:
            lines.extend([
                "## 5. Subgroup Disparity & Fairness Evaluation",
                fairness_summary_md,
                "",
            ])

        if stability_summary_md:
            lines.extend([
                "## 6. Feature Attribution Stability",
                stability_summary_md,
                "",
            ])

        lines.extend([
            "## 7. Ethical, Privacy, and Safety Disclaimers",
            "- **Zero-PII Compliance**: No patient names, phone numbers, or government IDs are processed or retained.",
            "- **Non-Causal Interpretation Notice**: Feature importances and SHAP values quantify observational correlations, not verified biological mechanisms.",
            "- **Medication Overuse Warning**: Acute treatments must not be taken more than 10-15 days per month to avoid Medication Overuse Headache (MOH).",
        ])

        return "\n".join(lines)
