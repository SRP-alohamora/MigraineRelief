"""
Unit tests for Final Holdout State Machine & Single Evaluation Guard.
"""

import pytest
import numpy as np
import pandas as pd
from evaluation import (
    HoldoutLockManager,
    HoldoutState,
    HoldoutLockViolationError,
)


def test_holdout_lock_lifecycle_happy_path():
    mgr = HoldoutLockManager(run_id="test_run_001")
    assert mgr.current_state == HoldoutState.HOLDOUT_LOCKED

    # 1. Start development
    mgr.start_development()
    assert mgr.current_state == HoldoutState.DEVELOPMENT

    # 2. Complete tuning
    mgr.complete_tuning()
    assert mgr.current_state == HoldoutState.TUNING_COMPLETE

    # 3. Freeze model
    manifest = mgr.freeze_model_selection(
        model_name="XGBoost",
        dataset_name="clinical_400",
        dataset_hash="abc123hash",
        hyperparameters={"max_depth": 4},
        dev_cv_score=0.88,
    )
    assert mgr.current_state == HoldoutState.MODEL_SELECTED
    assert manifest.model_name == "XGBoost"

    # 4. Authorize final evaluation
    mgr.authorize_final_evaluation()
    assert mgr.current_state == HoldoutState.FINAL_EVALUATION_ALLOWED

    # 5. Execute evaluation on holdout (EXACTLY ONCE)
    dummy_eval = lambda X, y: {"macro_f1": 0.89, "balanced_accuracy": 0.87}
    res = mgr.evaluate_holdout(dummy_eval, np.zeros((10, 2)), np.zeros(10))

    assert mgr.current_state == HoldoutState.FINAL_EVALUATION_COMPLETE
    assert res["macro_f1"] == 0.89
    assert mgr.get_manifest().holdout_evaluated is True


def test_premature_holdout_access_blocked():
    mgr = HoldoutLockManager()
    dummy_eval = lambda X, y: {"macro_f1": 0.89}

    # Cannot evaluate while HOLDOUT_LOCKED
    with pytest.raises(HoldoutLockViolationError):
        mgr.evaluate_holdout(dummy_eval, None, None)

    # Cannot evaluate during DEVELOPMENT
    mgr.start_development()
    with pytest.raises(HoldoutLockViolationError):
        mgr.evaluate_holdout(dummy_eval, None, None)

    # Cannot evaluate during TUNING_COMPLETE without freezing model
    mgr.complete_tuning()
    with pytest.raises(HoldoutLockViolationError):
        mgr.evaluate_holdout(dummy_eval, None, None)


def test_duplicate_holdout_evaluation_blocked():
    mgr = HoldoutLockManager()
    mgr.start_development()
    mgr.complete_tuning()
    mgr.freeze_model_selection("LR", "ds", "hash", {}, 0.8)
    mgr.authorize_final_evaluation()

    dummy_eval = lambda X, y: {"macro_f1": 0.85}
    mgr.evaluate_holdout(dummy_eval, None, None)

    # Second evaluation must raise HoldoutLockViolationError
    with pytest.raises(HoldoutLockViolationError):
        mgr.evaluate_holdout(dummy_eval, None, None)
