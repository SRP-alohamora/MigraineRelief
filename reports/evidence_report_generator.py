"""
Evidence Graph & Cross-Dataset Replication Report Generator.
"""

from replication.replication_engine import ReplicationEngine


class EvidenceReportGenerator:
    """Produces the cross-dataset scientific replication and Evidence Graph report."""

    @staticmethod
    def generate_report(engine: ReplicationEngine) -> str:
        matrix_md = engine.generate_replication_matrix_markdown()
        lines = [
            "# MigraineRelief Evidence Graph & Cross-Dataset Replication Report",
            "",
            "> [!IMPORTANT]",
            "> **Scientific Multi-Layer Evidence Architecture**",
            "> We deliberately separate observational population priors from individualized intervention learning.",
            "> Observational datasets are cross-validated against independent cohorts without pooling heterogeneous rows.",
            "",
            "## Four-Tier Evidence Progression Framework",
            "- **Level 1 (Clinical Protocol)**: Established consensus practice guidelines (AHS, ICHD-3, EFNS).",
            "- **Level 2 (Trial Benchmark Prior)**: Rigorous randomized controlled trial efficacy anchors (e.g. Cochrane meta-analyses).",
            "- **Level 3 (Exploratory Population Prior)**: Observational patterns from public cohorts (Clinical 400, Wearable 11,879, UK Biobank 19,819).",
            "- **Level 4 (Patient-Specific Posterior)**: Proprietary N-of-1 Bayesian intervention-response learning graph.",
            "",
            matrix_md,
            "",
            "## Evidence Graph Graphviz / Connectivity",
            "```mermaid",
            "graph TD",
            "    L1[Level 1: Clinical Protocols ICHD-3] --> L2[Level 2: RCT Trial Priors Burstein 2000]",
            "    L3_Clin[Level 3: Clinical 400 Diagnostic Prior] --> L4[Level 4: N-of-1 Patient Posterior]",
            "    L3_Wear[Level 3: Wearable 11k Trigger Prior] --> L4",
            "    L3_UKB[Level 3: UK Biobank Epidemiology Prior] --> L4",
            "    L2 --> L4",
            "    L4 --> OUT[Personalized 2h Pain Freedom Prediction]",
            "```",
        ]
        return "\n".join(lines)
