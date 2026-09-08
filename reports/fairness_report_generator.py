"""
Fairness and Subgroup Disparity Report Generator for MigraineRelief.
"""

from typing import Dict, Any
from evaluation.subgroup_eval import generate_subgroup_audit_summary


class FairnessReportGenerator:
    """Produces detailed algorithmic fairness and clinical slice reports."""

    @staticmethod
    def generate_report(audit_results: Dict[str, Any], model_name: str) -> str:
        summary_md = generate_subgroup_audit_summary(audit_results)
        lines = [
            f"# Algorithmic Fairness & Subgroup Performance Report: {model_name}",
            "",
            "> [!NOTE]",
            "> **Fairness Objective**: Ensure clinical model does not systematically underperform on vulnerable ",
            "> or lower-prevalence clinical slices (e.g. elderly cohorts, severe pain episodes, or atypical aura).",
            "",
            summary_md,
            "",
            "### Clinical Action Plan for Detected Disparities",
            "- If severe disparities exist (Macro F1 drop >= 0.15), the system triggers clinician review and falls back to Level 1 clinical guidelines.",
            "- In automated patient summaries, lower-confidence flags are appended for affected subgroup members.",
        ]
        return "\n".join(lines)
