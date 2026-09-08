"""
Unit tests for anti-leakage splitting, patient guards, and leakage checkers.
"""

import pytest
import pandas as pd
import numpy as np
from evaluation import (
    SplitterRegistry,
    SplitStrategy,
    PatientLeakageError,
    LeakageDetectionError,
    assert_no_patient_overlap,
    assert_no_target_leakage,
    assert_temporal_ordering,
)


def test_patient_leakage_error_on_row_splitting():
    df = pd.DataFrame({"feat1": range(10)})
    y = pd.Series([0, 1] * 5)
    groups = pd.Series(["p1", "p1", "p2", "p2", "p3", "p3", "p4", "p4", "p5", "p5"])

    with pytest.raises(PatientLeakageError):
        SplitterRegistry.train_test_split(
            df, y, strategy=SplitStrategy.ROW_STRATIFIED, groups=groups
        )

    with pytest.raises(PatientLeakageError):
        SplitterRegistry.get_cv_splitter(
            strategy=SplitStrategy.ROW_STRATIFIED, has_repeated_measures=True
        )


def test_patient_grouped_split_zero_overlap():
    df = pd.DataFrame({"feat1": range(20)})
    y = pd.Series([0, 1] * 10)
    groups = pd.Series([f"pat_{i // 4}" for i in range(20)])

    X_tr, X_te, y_tr, y_te, g_tr, g_te = SplitterRegistry.train_test_split(
        df, y, strategy=SplitStrategy.PATIENT_GROUPED, groups=groups, test_size=0.25
    )

    # Check zero patient overlap
    assert len(set(g_tr).intersection(set(g_te))) == 0
    assert_no_patient_overlap(
        pd.DataFrame({"user_id": g_tr}),
        pd.DataFrame({"user_id": g_te}),
        patient_col="user_id",
    )


def test_assert_no_patient_overlap_raises_on_leak():
    train_df = pd.DataFrame({"user_id": ["p1", "p2", "p3"]})
    test_df = pd.DataFrame({"user_id": ["p3", "p4"]})

    with pytest.raises(LeakageDetectionError):
        assert_no_patient_overlap(train_df, test_df, patient_col="user_id")


def test_assert_no_target_leakage():
    X = pd.DataFrame({"feature_a": [1, 2, 3], "target": [0, 1, 0]})
    y = pd.Series([0, 1, 0], name="target")

    with pytest.raises(LeakageDetectionError):
        assert_no_target_leakage(X, y)

    # Safe features
    X_safe = pd.DataFrame({"feature_a": [1, 2, 3], "feature_b": [4, 5, 6]})
    assert assert_no_target_leakage(X_safe, y) is True
