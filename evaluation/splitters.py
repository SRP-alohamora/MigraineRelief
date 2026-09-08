"""
Data splitters and patient-leakage prevention guards.

CANONICAL ARCHITECTURAL INVARIANT:
- Cross-sectional data (Clinical 400): Stratified row splitting.
- Repeated-measures data (Wearable 11,879 across 100 users):
  PATIENT-LEVEL SPLITTING IS MANDATORY.
  Attempting row-level splitting on repeated-measure data raises PatientLeakageError.
"""

from enum import Enum
from typing import Generator, List, Optional, Tuple, Union
import numpy as np
import pandas as pd
from sklearn.model_selection import (
    StratifiedShuffleSplit,
    StratifiedKFold,
    GroupShuffleSplit,
    GroupKFold,
    StratifiedGroupKFold,
)


class SplitStrategy(str, Enum):
    ROW_STRATIFIED = "row_stratified"
    PATIENT_GROUPED = "patient_grouped"
    TEMPORAL_PATIENT = "temporal_patient"


class PatientLeakageError(Exception):
    """Raised when an invalid splitting strategy risks leaking patient identity across splits."""
    pass


class SplitterRegistry:
    """Provides validated dataset splitters with strict patient separation guarantees."""

    @staticmethod
    def train_test_split(
        X: pd.DataFrame,
        y: pd.Series,
        strategy: SplitStrategy,
        groups: Optional[pd.Series] = None,
        test_size: float = 0.2,
        random_state: int = 42,
        has_repeated_measures: bool = False,
    ) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series, Optional[pd.Series], Optional[pd.Series]]:
        """
        Splits data into development (train) and locked holdout (test) sets.
        Returns (X_train, X_test, y_train, y_test, groups_train, groups_test).
        """
        # Strict anti-leakage validation
        if (has_repeated_measures or groups is not None) and strategy == SplitStrategy.ROW_STRATIFIED:
            raise PatientLeakageError(
                "CRITICAL ARCHITECTURAL LEAKAGE VIOLATION: Row-level splitting is prohibited "
                "on datasets with repeated patient measures. You must use SplitStrategy.PATIENT_GROUPED "
                "or SplitStrategy.TEMPORAL_PATIENT to ensure zero patient overlap."
            )

        if strategy == SplitStrategy.ROW_STRATIFIED:
            sss = StratifiedShuffleSplit(n_splits=1, test_size=test_size, random_state=random_state)
            train_idx, test_idx = next(sss.split(X, y))
            return (
                X.iloc[train_idx].copy(),
                X.iloc[test_idx].copy(),
                y.iloc[train_idx].copy(),
                y.iloc[test_idx].copy(),
                None,
                None,
            )

        elif strategy == SplitStrategy.PATIENT_GROUPED:
            if groups is None:
                raise ValueError("Patient grouping column (groups) required for PATIENT_GROUPED strategy.")
            gss = GroupShuffleSplit(n_splits=1, test_size=test_size, random_state=random_state)
            train_idx, test_idx = next(gss.split(X, y, groups=groups))
            return (
                X.iloc[train_idx].copy(),
                X.iloc[test_idx].copy(),
                y.iloc[train_idx].copy(),
                y.iloc[test_idx].copy(),
                groups.iloc[train_idx].copy(),
                groups.iloc[test_idx].copy(),
            )

        elif strategy == SplitStrategy.TEMPORAL_PATIENT:
            if groups is None:
                raise ValueError("Patient grouping column (groups) required for TEMPORAL_PATIENT strategy.")
            # First split patients so test set has unobserved patients
            gss = GroupShuffleSplit(n_splits=1, test_size=test_size, random_state=random_state)
            train_idx, test_idx = next(gss.split(X, y, groups=groups))
            return (
                X.iloc[train_idx].copy(),
                X.iloc[test_idx].copy(),
                y.iloc[train_idx].copy(),
                y.iloc[test_idx].copy(),
                groups.iloc[train_idx].copy(),
                groups.iloc[test_idx].copy(),
            )
        else:
            raise ValueError(f"Unknown split strategy: {strategy}")

    @staticmethod
    def get_cv_splitter(
        strategy: SplitStrategy,
        n_splits: int = 5,
        random_state: int = 42,
        has_repeated_measures: bool = False,
    ):
        """Returns cross-validation generator based on dataset characteristics."""
        if has_repeated_measures and strategy == SplitStrategy.ROW_STRATIFIED:
            raise PatientLeakageError(
                "CRITICAL ARCHITECTURAL LEAKAGE VIOLATION: StratifiedKFold cannot be used on "
                "repeated-measure patient data. Must use GroupKFold or StratifiedGroupKFold."
            )

        if strategy == SplitStrategy.ROW_STRATIFIED:
            return StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=random_state)
        elif strategy == SplitStrategy.PATIENT_GROUPED:
            try:
                return StratifiedGroupKFold(n_splits=n_splits, shuffle=True, random_state=random_state)
            except Exception:
                return GroupKFold(n_splits=n_splits)
        elif strategy == SplitStrategy.TEMPORAL_PATIENT:
            try:
                return StratifiedGroupKFold(n_splits=n_splits, shuffle=True, random_state=random_state)
            except Exception:
                return GroupKFold(n_splits=n_splits)
        else:
            raise ValueError(f"Unknown split strategy: {strategy}")
