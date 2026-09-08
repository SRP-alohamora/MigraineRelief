"""
Unit tests for standardized clinical evaluation metrics and calibration.
"""

import pytest
import numpy as np
from evaluation import (
    compute_expected_calibration_error,
    compute_classification_metrics,
    compute_regression_metrics,
    CalibrationEvaluator,
    PostHocCalibrator,
    BootstrapEstimator,
    SubgroupEvaluator,
)
import pandas as pd


def test_classification_metrics_multiclass():
    y_true = np.array(["A", "B", "C", "A", "B", "C"])
    y_pred = np.array(["A", "B", "A", "A", "B", "C"])
    y_prob = np.array([
        [0.8, 0.1, 0.1],
        [0.1, 0.8, 0.1],
        [0.5, 0.3, 0.2],
        [0.7, 0.2, 0.1],
        [0.1, 0.7, 0.2],
        [0.2, 0.2, 0.6],
    ])

    metrics = compute_classification_metrics(y_true, y_pred, y_prob)
    assert "macro_f1" in metrics
    assert "balanced_accuracy" in metrics
    assert "ece" in metrics
    assert "brier_score" in metrics
    assert 0.0 <= metrics["macro_f1"] <= 1.0
    assert 0.0 <= metrics["ece"] <= 1.0


def test_expected_calibration_error_binary():
    y_true = np.array([1, 0, 1, 1, 0, 0])
    y_prob = np.array([0.9, 0.1, 0.8, 0.7, 0.2, 0.3])
    ece = compute_expected_calibration_error(y_true, y_prob)
    assert 0.0 <= ece <= 1.0


def test_bootstrap_confidence_intervals():
    y_true = np.array([1, 0, 1, 1, 0, 0, 1, 0, 1, 0])
    y_pred = np.array([1, 0, 1, 0, 0, 0, 1, 0, 1, 0])

    from sklearn.metrics import accuracy_score
    res = BootstrapEstimator.estimate_ci(
        y_true, y_pred, metric_fn=accuracy_score, n_bootstraps=100
    )
    assert "ci_lower" in res
    assert "ci_upper" in res
    assert res["ci_lower"] <= res["point_estimate"] <= res["ci_upper"]


def test_subgroup_evaluator():
    y_true = np.array([1, 1, 1, 0, 0, 0, 1, 0, 1, 0])
    y_pred = np.array([1, 1, 0, 0, 0, 1, 1, 0, 1, 0])
    subgroups_df = pd.DataFrame({
        "age_bracket": ["under_30"] * 5 + ["over_50"] * 5
    })

    audit = SubgroupEvaluator.evaluate_subgroups(
        y_true, y_pred, subgroups_df, min_samples=3
    )
    assert "overall_macro_f1" in audit
    assert "subgroups" in audit
    assert "age_bracket" in audit["subgroups"]
