"""
Adapter for the 400-case Kaggle Migraine Clinical Phenotype Dataset (ranzeet013).
"""

import os
from typing import Dict, List, Optional, Tuple, Any
import numpy as np
import pandas as pd

from datasets.base import BaseDatasetAdapter, DatasetMetadata, TaskType


class ClinicalDatasetAdapter(BaseDatasetAdapter):
    """
    Adapter for the 400-case clinical migraine dataset.
    Unit of analysis: Individual clinical patient case (cross-sectional, no repeated measures).
    """

    DEFAULT_PATH = os.path.join(
        os.path.dirname(__file__), "..", "data", "clinical_400", "clinical_migraine_400.csv"
    )

    EXPECTED_FEATURES = [
        "Age", "Duration", "Frequency", "Location", "Character", "Intensity",
        "Nausea", "Vomit", "Phonophobia", "Photophobia", "Visual", "Sensory",
        "Dysphasia", "Dysarthria", "Vertigo", "Tinnitus", "Hypoacusis",
        "Diplopia", "Defect", "Ataxia", "Conscience", "Paresthesia", "DPF"
    ]

    def __init__(self, filepath: Optional[str] = None):
        super().__init__(filepath or self.DEFAULT_PATH)

    def load(self) -> pd.DataFrame:
        """Loads and normalizes the 400-case clinical dataset."""
        if not os.path.exists(self.filepath):
            raise FileNotFoundError(f"Clinical dataset not found at: {self.filepath}")

        df = pd.read_csv(self.filepath)
        # Strip string whitespace
        if "Type" in df.columns:
            df["Type"] = df["Type"].astype(str).str.strip()

        # Add clinically grounded subgroup flags
        if "Age" in df.columns:
            df["subgroup_age_bracket"] = pd.cut(
                df["Age"],
                bins=[0, 30, 50, 120],
                labels=["under_30", "30_to_50", "over_50"]
            ).astype(str)

        if "Intensity" in df.columns:
            df["subgroup_high_intensity"] = (df["Intensity"] >= 3).astype(int)

        if "Visual" in df.columns and "Sensory" in df.columns:
            df["subgroup_aura_present"] = (
                (df["Visual"] > 0) | (df["Sensory"] > 0)
            ).astype(int)

        if "Frequency" in df.columns:
            df["subgroup_frequent_migraine"] = (df["Frequency"] >= 4).astype(int)

        self._df = df
        return self._df

    def validate(self) -> bool:
        """Validates column presence, cardinality, and data types."""
        if self._df is None:
            self.load()
        assert self._df is not None

        missing_cols = [c for c in self.EXPECTED_FEATURES if c not in self._df.columns]
        if missing_cols:
            raise ValueError(f"Clinical dataset missing expected columns: {missing_cols}")

        if "Type" not in self._df.columns:
            raise ValueError("Clinical dataset missing target column 'Type'")

        return True

    def get_features_and_target(
        self, task: TaskType = TaskType.MIGRAINE_TYPE_CLASSIFICATION
    ) -> Tuple[pd.DataFrame, pd.Series, Optional[pd.Series]]:
        """
        Extracts X, y, and patient groups for the requested task.
        Since each row is an independent patient, groups is None.
        """
        if self._df is None:
            self.load()
        assert self._df is not None

        if task == TaskType.MIGRAINE_TYPE_CLASSIFICATION:
            target_col = "Type"
            feature_cols = [c for c in self.EXPECTED_FEATURES if c != target_col]
            X = self._df[feature_cols].copy()
            y = self._df[target_col].copy()
            return X, y, None

        elif task == TaskType.SEVERITY_PREDICTION:
            target_col = "Intensity"
            feature_cols = [c for c in self.EXPECTED_FEATURES if c != target_col]
            X = self._df[feature_cols].copy()
            y = self._df[target_col].copy()
            return X, y, None

        elif task == TaskType.ATTACK_RISK_PREDICTION:
            # Frequent migraine phenotype (Frequency >= 4) as binary risk target
            y = (self._df["Frequency"] >= 4).astype(int)
            feature_cols = [c for c in self.EXPECTED_FEATURES if c != "Frequency"]
            X = self._df[feature_cols].copy()
            return X, y, None

        else:
            raise ValueError(f"Task {task} not supported by ClinicalDatasetAdapter")

    def get_metadata(self) -> DatasetMetadata:
        """Returns structured metadata and provenance."""
        if self._df is None:
            self.load()
        assert self._df is not None

        n_rows = len(self._df)
        dataset_hash = self.compute_hash(self._df)
        quality_summary = self.generate_quality_report(self._df)

        return DatasetMetadata(
            name="Kaggle Migraine Classification Dataset (ranzeet013)",
            version="1.0.0",
            source="https://www.kaggle.com/datasets/ranzeet013/migraine-dataset",
            n_rows=n_rows,
            n_patients=n_rows,
            has_repeated_measures=False,
            patient_id_column=None,
            time_column=None,
            target_column="Type",
            feature_columns=self.EXPECTED_FEATURES,
            subgroup_columns=[
                "subgroup_age_bracket",
                "subgroup_high_intensity",
                "subgroup_aura_present",
                "subgroup_frequent_migraine",
            ],
            dataset_hash=dataset_hash,
            quality_summary=quality_summary,
        )
