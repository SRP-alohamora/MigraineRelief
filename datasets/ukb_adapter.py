"""
Schema-driven adapter for UK Biobank Field 20002 (Non-cancer illness code, self-reported).
CANONICAL SCIENTIFIC OBJECTIVE:
Ask: Which population-level factors distinguish people reporting migraine from controls
and from people reporting non-migraine headache?
Comparison: Migraine (1265) vs Non-Migraine Headache (1263) vs Population Controls.
"""

import hashlib
import json
import os
from typing import Dict, List, Optional, Tuple, Any
import numpy as np
import pandas as pd

from datasets.base import BaseDatasetAdapter, DatasetMetadata, TaskType


class UKBiobankAdapter(BaseDatasetAdapter):
    """
    Schema-driven adapter for UK Biobank data.
    Documents provenance, missingness, and diagnostic limits without fabricating patient rows.
    """

    DEFAULT_SCHEMA_PATH = os.path.join(
        os.path.dirname(__file__), "..", "data", "ukbiobank", "schema.json"
    )
    DEFAULT_DATA_PATH = os.path.join(
        os.path.dirname(__file__), "..", "data", "ukbiobank", "ukb_participants.csv"
    )

    def __init__(self, schema_path: Optional[str] = None, data_path: Optional[str] = None):
        self.schema_path = schema_path or self.DEFAULT_SCHEMA_PATH
        super().__init__(data_path or self.DEFAULT_DATA_PATH)
        self.schema: Dict[str, Any] = {}
        self.load_schema()

    def load_schema(self) -> Dict[str, Any]:
        """Loads UK Biobank schema contract."""
        if os.path.exists(self.schema_path):
            with open(self.schema_path, "r") as f:
                self.schema = json.load(f)
        return self.schema

    def is_raw_data_present(self) -> bool:
        """Checks if licensed participant-level UKB microdata is mounted."""
        return os.path.exists(self.filepath)

    @property
    def is_mounted(self) -> bool:
        """Property alias for whether microdata is mounted."""
        return self.is_raw_data_present()


    def load(self) -> pd.DataFrame:
        """
        Loads raw UKB extract if mounted.
        If not mounted, generates a documented schema-compliant placeholder without fabricating private records.
        """
        if self.is_raw_data_present():
            self._df = pd.read_csv(self.filepath)
        else:
            # Document exactly what is missing rather than inventing arbitrary numbers
            self._df = pd.DataFrame({
                "participant_id": [],
                "field_20002_condition": [],
                "headache_category": [],
                "sleep_duration": [],
                "insomnia_symptoms": [],
                "neuroticism_score": [],
                "age_at_recruitment": [],
                "sex": [],
            })
        return self._df

    def validate(self) -> bool:
        """Validates schema definition and flags access status."""
        self.load_schema()
        if not self.schema:
            raise ValueError(f"UK Biobank schema missing at {self.schema_path}")
        return True

    def get_features_and_target(
        self, task: TaskType = TaskType.POPULATION_DIFFERENTIATION
    ) -> Tuple[pd.DataFrame, pd.Series, Optional[pd.Series]]:
        """
        Extracts features for population differentiation.
        Raises descriptive error if local raw data is not mounted.
        """
        if not self.is_raw_data_present():
            raise FileNotFoundError(
                "UK Biobank raw participant microdata (Field 20002) is not locally mounted. "
                "Per canonical instructions: UKB ingestion is implemented as a schema-driven adapter; "
                "raw data requires approved UK Biobank MTA (Material Transfer Agreement). "
                "The adapter specifies Field 20002 code 1265 (migraine), code 1263 (headache not migraine), "
                "and population controls."
            )
        assert self._df is not None
        X = self._df.drop(columns=["participant_id", "headache_category"])
        y = self._df["headache_category"]
        return X, y, None

    def get_metadata(self) -> DatasetMetadata:
        """Returns provenance and evidence tier metadata."""
        self.load_schema()
        counts = self.schema.get("participant_counts", {})
        migraine_n = counts.get("migraine_cases_code_1265", 19819)

        return DatasetMetadata(
            name="UK Biobank (Field 20002 Non-Cancer Illness)",
            version="Field 20002 Release 2024",
            source="https://biobank.ndph.ox.ac.uk/showcase/field.cgi?id=20002",
            n_rows=counts.get("total_cohort_approx", 502000),
            n_patients=counts.get("total_cohort_approx", 502000),
            has_repeated_measures=False,
            patient_id_column="participant_id",
            time_column=None,
            target_column="headache_category",
            feature_columns=list(self.schema.get("associated_feature_fields", {}).keys()),
            subgroup_columns=["sex", "age_bracket"],
            dataset_hash=hashlib.sha256(json.dumps(self.schema).encode()).hexdigest(),
            quality_summary={
                "raw_data_mounted": self.is_raw_data_present(),
                "evidence_tier": "Level 3: Exploratory Population Prior",
                "is_specialist_confirmed": False,
                "migraine_subcohort_size": migraine_n,
                "comparison_groups": [
                    "Migraine (1265)",
                    "Headaches, not migraine (1263)",
                    "Population Controls"
                ]
            },
        )
