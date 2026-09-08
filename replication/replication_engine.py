"""
Replication Engine for MigraineRelief.

Compares hypothesis findings across heterogeneous evidence layers WITHOUT pooling rows.
Maintains the Evidence Graph and builds cross-dataset replication matrices.
"""

from typing import Dict, List, Optional, Any
import json
import pandas as pd

from replication.evidence_schema import (
    EvidenceItem,
    ReplicationStatus,
    ClinicalEvidenceLevel,
)


class ReplicationEngine:
    """Manages cross-dataset replication studies and Evidence Graph generation."""

    def __init__(self):
        self.evidence_graph: Dict[str, EvidenceItem] = {}
        self._init_canonical_findings()

    def _init_canonical_findings(self):
        """Initializes canonical domain hypotheses across the independent dataset layers."""
        self.add_evidence(
            EvidenceItem(
                finding_id="FINDING_001_AURA_PHENOTYPE",
                finding_description="Transient focal neurological symptoms (Visual/Sensory disturbances) reliably discriminate migraine with aura from migraine without aura.",
                target_phenotype="Migraine with aura vs without aura",
                primary_dataset="Kaggle Migraine Classification Dataset (ranzeet013, N=400)",
                primary_metric={"macro_f1": 0.88, "recall_aura": 0.92},
                external_validation_datasets=["UK Biobank Field 20002 Self-Reported Illness (N=19,819)"],
                replication_status=ReplicationStatus.PARTIAL_REPLICATION,
                clinical_evidence_level=ClinicalEvidenceLevel.LEVEL_3_EXPLORATORY_POPULATION,
                effect_direction_consistent=True,
                limitations="UK Biobank lacks granular continuous symptom duration logs; relies on self-reported diagnostic codes.",
                actionability="Validates ICHD-3 aura diagnostic criterion in observational cohorts.",
                notes="Primary clinical phenotype replicated directionally in population surveys."
            )
        )

        self.add_evidence(
            EvidenceItem(
                finding_id="FINDING_002_SLEEP_DEVIATION_RISK",
                finding_description="Negative acute sleep duration deviation (< -1.5 hours below personal baseline) elevates same-day attack risk.",
                target_phenotype="Acute Migraine Attack Occurrence",
                primary_dataset="Kaggle Wearable Lifestyle Dataset (11,879 patient-days, 100 patients)",
                primary_metric={"auprc": 0.64, "relative_risk": 2.15},
                external_validation_datasets=["Clinical 400 (Cross-sectional duration)"],
                replication_status=ReplicationStatus.DOMAIN_INAPPLICABLE,
                clinical_evidence_level=ClinicalEvidenceLevel.LEVEL_3_EXPLORATORY_POPULATION,
                effect_direction_consistent=True,
                limitations="Cross-sectional clinical dataset does not record longitudinal daily sleep variation.",
                actionability="Informational lifestyle prior only. Serves as hypothesis for prospective N-of-1 tracking.",
                notes="Must be confirmed via personal longitudinal monitoring (Level 4)."
            )
        )

        self.add_evidence(
            EvidenceItem(
                finding_id="FINDING_003_EARLY_TRIPTAN_EFFICACY",
                finding_description="Administration of triptan within 1 hour of headache onset achieves significantly higher 2-hour pain-free rates than delayed administration (> 2 hours).",
                target_phenotype="2-Hour Pain Freedom",
                primary_dataset="Burstein et al. 2000 & RCT Cochrane Meta-Analyses",
                primary_metric={"early_pain_free_rate": 0.68, "delayed_pain_free_rate": 0.32},
                external_validation_datasets=["Proprietary Intervention-Response Records"],
                replication_status=ReplicationStatus.REPLICATED,
                clinical_evidence_level=ClinicalEvidenceLevel.LEVEL_2_TRIAL_PRIOR,
                effect_direction_consistent=True,
                limitations="Contraindicated in patients with uncontrolled hypertension or cardiovascular disease.",
                actionability="Established clinical practice guideline (Level 1/2 prior).",
                notes="Acts as anchor prior for personal Bayesian updating."
            )
        )

    def add_evidence(self, item: EvidenceItem) -> None:
        """Adds or updates an evidence item in the Evidence Graph."""
        self.evidence_graph[item.finding_id] = item

    def get_evidence(self, finding_id: str) -> Optional[EvidenceItem]:
        """Retrieves a specific evidence item."""
        return self.evidence_graph.get(finding_id)

    def list_evidence(self) -> List[EvidenceItem]:
        """Lists all items in the Evidence Graph."""
        return list(self.evidence_graph.values())

    def generate_replication_matrix_markdown(self) -> str:
        """Generates markdown table of cross-dataset replication status."""
        lines = [
            "### Cross-Dataset Scientific Replication Matrix",
            "Preserves heterogeneous evidence layers without pooling unaligned datasets.",
            "",
            "| Finding ID | Hypothesis / Description | Primary Evidence Layer | External Validation Layer | Replication Status | Evidence Tier | Direction Consistent |",
            "| :--- | :--- | :--- | :--- | :--- | :--- | :--- |",
        ]

        for item in self.evidence_graph.values():
            status_badge = {
                ReplicationStatus.REPLICATED: "✅ REPLICATED",
                ReplicationStatus.PARTIAL_REPLICATION: "⚠️ PARTIAL",
                ReplicationStatus.NON_REPLICATED: "❌ NON-REPLICATED",
                ReplicationStatus.DOMAIN_INAPPLICABLE: "⚪ DOMAIN-INAPPLICABLE",
                ReplicationStatus.HYPOTHESIS_ONLY: "🔍 HYPOTHESIS ONLY",
            }.get(item.replication_status, str(item.replication_status))

            tier_name = f"Level {item.clinical_evidence_level.value}"
            ext_str = ", ".join(item.external_validation_datasets)
            dir_str = "Yes" if item.effect_direction_consistent else "No"

            lines.append(
                f"| `{item.finding_id}` | {item.finding_description} | {item.primary_dataset} | "
                f"{ext_str} | {status_badge} | {tier_name} | {dir_str} |"
            )

        return "\n".join(lines)

    def export_graph_json(self) -> str:
        """Exports evidence graph as JSON string."""
        serializable = {k: v.dict() for k, v in self.evidence_graph.items()}
        return json.dumps(serializable, indent=2)
