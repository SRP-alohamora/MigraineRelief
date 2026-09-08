"""
Data Quality Report Generator for MigraineRelief.

Documents dataset provenance, unit of analysis, missingness, and diagnostic boundaries.
"""

from typing import Dict, List, Optional, Any
import pandas as pd
from datasets.schema_registry import SchemaRegistry


class DataQualityReportGenerator:
    """Generates standardized clinical data quality audit reports."""

    def __init__(self, registry: Optional[SchemaRegistry] = None):
        self.registry = registry or SchemaRegistry()

    def generate_report(self) -> str:
        """Produces full markdown report across all registered evidence layers."""
        metadata_map = self.registry.get_all_metadata()

        lines = [
            "# MigraineRelief Data Quality & Schema Integrity Audit",
            "",
            "## Architectural Invariant Notice",
            "> [!IMPORTANT]",
            "> **Non-Concatenation Invariant**: Public datasets (Clinical 400, Wearable 11,879, UK Biobank 19,819) ",
            "> represent fundamentally distinct epidemiological and observational evidence layers. ",
            "> They are **never pooled** into a single master training matrix.",
            "",
            "## Summary of Registered Evidence Layers",
            "",
            "| Layer ID | Dataset Name | Rows | Patients | Repeated Measures | Unit of Analysis | Target Column | Dataset SHA-256 |",
            "| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |",
        ]

        for layer_id, meta in metadata_map.items():
            rep = "Yes (Longitudinal)" if meta.has_repeated_measures else "No (Cross-Sectional)"
            unit = "Patient-day observation" if meta.has_repeated_measures else "Single clinical encounter"
            hash_abbr = meta.dataset_hash[:10] + "..." if meta.dataset_hash else "N/A"

            lines.append(
                f"| `{layer_id}` | {meta.name} | {meta.n_rows:,} | {meta.n_patients:,} | "
                f"{rep} | {unit} | `{meta.target_column}` | `{hash_abbr}` |"
            )

        lines.extend([
            "",
            "## Detailed Dataset Profiles",
            "",
            "### 1. Kaggle Migraine Clinical Phenotype Cohort (`clinical_400`)",
            "- **Source**: Ranzeet013, validated against 400 patient clinical records.",
            "- **Target**: 7-class ICHD-based diagnostic migraine categorization (`Type`).",
            "- **Features**: 23 clinical symptoms (Aura disturbances, pain severity, duration, autonomic signs).",
            "- **Splitting Protocol**: Stratified Row Splitting (`SplitStrategy.ROW_STRATIFIED`). Zero repeated patient measures.",
            "- **Clinical Utility**: Level 3 diagnostic phenotyping prior.",
            "",
            "### 2. Wearable & Lifestyle Physiological Cohort (`wearable_11879`)",
            "- **Source**: Kaggle / Digital Biomarkers Longitudinal Study (11,879 patient-days across 100 individuals).",
            "- **Target**: Daily attack occurrence (`migraine_occurrence`) and pain severity (`intensity`).",
            "- **Features**: Sleep duration, screen time, perceived stress, mood, hydration, plus derived personal baseline deviations and lag-1 historical states.",
            "- **Splitting Protocol**: **Patient-Grouped Splitting (`SplitStrategy.PATIENT_GROUPED`) is MANDATORY**. Row splitting strictly raises `PatientLeakageError`.",
            "- **Clinical Utility**: Level 3 dynamic behavioral trigger prior.",
            "",
            "### 3. UK Biobank Field 20002 Cohort (`uk_biobank`)",
            "- **Source**: UK Biobank Field 20002 (Non-cancer illness code, self-reported).",
            "- **Diagnostic Scope**: Code 1265 (Migraine, ~19,819 cases), Code 1263 (Headache non-migraine, ~9,240 cases), and population controls.",
            "- **Data Policy**: Microdata access requires UKB approved application (MTA). Adapter implements schema-driven contracts without fabricating synthetic records.",
            "- **Clinical Utility**: Level 3 population-level epidemiology prior.",
        ])

        return "\n".join(lines)
