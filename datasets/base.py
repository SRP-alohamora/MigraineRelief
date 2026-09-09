"""
Base dataset adapter definitions and metadata interfaces for MigraineRelief.
"""

from abc import ABC, abstractmethod
from enum import Enum
import hashlib
from typing import Dict, List, Optional, Tuple, Any
import numpy as np
import pandas as pd
from pydantic import BaseModel, Field


class TaskType(str, Enum):
    MIGRAINE_TYPE_CLASSIFICATION = "migraine_type_classification"
    SEVERITY_PREDICTION = "severity_prediction"
    ATTACK_RISK_PREDICTION = "attack_risk_prediction"
    POPULATION_DIFFERENTIATION = "population_differentiation"
    STROKE_AURA_DIFFERENTIATION = "stroke_aura_differentiation"


class DatasetMetadata(BaseModel):
    """Metadata describing a clinical or physiological dataset layer."""
    name: str
    version: str = "1.0.0"
    source: str
    n_rows: int
    n_patients: int
    has_repeated_measures: bool
    patient_id_column: Optional[str] = None
    time_column: Optional[str] = None
    target_column: str
    feature_columns: List[str]
    subgroup_columns: List[str] = Field(default_factory=list)
    dataset_hash: str
    quality_summary: Dict[str, Any] = Field(default_factory=dict)


class BaseDatasetAdapter(ABC):
    """Abstract base adapter for ingestion, validation, and feature preparation."""

    def __init__(self, filepath: Optional[str] = None):
        self.filepath = filepath
        self._df: Optional[pd.DataFrame] = None
        self._metadata: Optional[DatasetMetadata] = None

    @abstractmethod
    def load(self) -> pd.DataFrame:
        """Load and parse dataset into a pandas DataFrame."""
        pass

    @abstractmethod
    def validate(self) -> bool:
        """Execute integrity and quality gates on the raw data."""
        pass

    @abstractmethod
    def get_features_and_target(
        self, task: TaskType
    ) -> Tuple[pd.DataFrame, pd.Series, Optional[pd.Series]]:
        """
        Returns (X, y, groups) for modeling.
        groups is populated with patient IDs if repeated measurements exist.
        """
        pass

    @abstractmethod
    def get_metadata(self) -> DatasetMetadata:
        """Return structured metadata and provenance for the dataset."""
        pass

    @staticmethod
    def compute_hash(df: pd.DataFrame) -> str:
        """Compute SHA-256 hash of dataframe content for provenance."""
        data_bytes = pd.util.hash_pandas_object(df, index=True).values.tobytes()
        return hashlib.sha256(data_bytes).hexdigest()

    def generate_quality_report(self, df: pd.DataFrame, patient_col: Optional[str] = None) -> Dict[str, Any]:
        """Generate comprehensive data quality audit report."""
        n_rows = len(df)
        n_patients = df[patient_col].nunique() if patient_col and patient_col in df.columns else n_rows
        missing_counts = df.isnull().sum().to_dict()
        total_missing = sum(missing_counts.values())
        dup_rows = int(df.duplicated().sum())

        return {
            "n_rows": n_rows,
            "n_patients": n_patients,
            "repeated_measures_detected": n_patients < n_rows,
            "duplicate_rows": dup_rows,
            "missing_cells_total": int(total_missing),
            "missing_ratio": float(total_missing / (n_rows * max(1, len(df.columns)))),
            "column_types": {col: str(dtype) for col, dtype in df.dtypes.items()},
        }
