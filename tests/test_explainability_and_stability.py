"""
Unit tests for SHAP explainability, permutation importance, and stability scoring.
"""

import pytest
import pandas as pd
import numpy as np
from explainability import (
    SHAPExplainer,
    PermutationFeatureImportance,
    FeatureStabilityScorer,
)
from models.logistic import LogisticRegressionModel


def test_permutation_feature_importance():
    X = pd.DataFrame({
        "informative": [1.0, 1.0, 1.0, 0.0, 0.0, 0.0] * 5,
        "noise": np.random.randn(30),
    })
    y = pd.Series([1, 1, 1, 0, 0, 0] * 5)

    model = LogisticRegressionModel()
    model.fit(X, y)

    pfi = PermutationFeatureImportance(model, n_repeats=3)
    pfi_df = pfi.compute(X, y)
    assert len(pfi_df) == 2
    assert "mean_f1_drop" in pfi_df.columns
    # Informative feature should have higher drop than noise
    assert pfi_df.iloc[0]["feature"] == "informative"


def test_feature_stability_scorer():
    s1 = pd.Series([10.0, 8.0, 5.0, 2.0], index=["Visual", "Sensory", "Duration", "Age"])
    s2 = pd.Series([9.5, 8.2, 4.8, 1.9], index=["Visual", "Sensory", "Duration", "Age"])
    s3 = pd.Series([10.2, 7.9, 5.1, 2.1], index=["Visual", "Sensory", "Duration", "Age"])

    stability_df = FeatureStabilityScorer.compute_stability([s1, s2, s3])
    assert len(stability_df) == 4
    assert "stability_score" in stability_df.columns
    assert "stability_band" in stability_df.columns
    assert stability_df.iloc[0]["stability_band"] in ["HIGH", "MODERATE"]

    report = FeatureStabilityScorer.generate_stability_report(stability_df)
    assert "Cross-Fold Feature Attribution Stability Analysis" in report
