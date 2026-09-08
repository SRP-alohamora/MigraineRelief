"""
Unit tests for Model Tournament and Candidate Models.
"""

import pytest
import pandas as pd
import numpy as np
from datasets.clinical_adapter import ClinicalDatasetAdapter, TaskType
from models import (
    LogisticRegressionModel,
    RandomForestModel,
    XGBoostModel,
    LightGBMModel,
    CatBoostModel,
    DecisionTreeModel,
    ModelTournament,
)
from evaluation.splitters import SplitStrategy


def test_individual_models_fit_and_predict():
    X = pd.DataFrame({
        "f1": np.random.randn(40),
        "f2": np.random.randn(40),
    })
    y = pd.Series(["type_a", "type_b"] * 20)

    for model_cls in [LogisticRegressionModel, DecisionTreeModel, RandomForestModel, XGBoostModel, LightGBMModel, CatBoostModel]:
        m = model_cls()
        m.fit(X, y)
        preds = m.predict(X)
        probs = m.predict_proba(X)
        assert len(preds) == 40
        assert probs.shape[0] == 40
        assert probs.shape[1] == 2


def test_model_tournament_run():
    X = pd.DataFrame({
        "f1": np.random.randn(30),
        "f2": np.random.randn(30),
    })
    y = pd.Series(["type_a", "type_b"] * 15)

    tournament = ModelTournament(
        candidate_classes=[LogisticRegressionModel, DecisionTreeModel],
        strategy=SplitStrategy.ROW_STRATIFIED,
        n_splits=2,
        random_state=42,
    )
    leaderboard = tournament.run(X, y)
    assert len(leaderboard) == 2
    assert "composite_score" in leaderboard.columns
    assert tournament.winner_name in ["LogisticRegression", "DecisionTree"]
    assert tournament.winner_model is not None
