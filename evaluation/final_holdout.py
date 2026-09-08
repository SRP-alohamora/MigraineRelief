"""
Final Holdout State Machine & Lock Protocol.

CANONICAL ARCHITECTURAL INVARIANT:
The final holdout evaluation set must remain strictly locked during model development,
exploration, feature engineering, and hyperparameter tuning.
It can be unlocked and evaluated EXACTLY ONCE after the final candidate model is selected.
Any premature or repeated access raises a HoldoutLockViolationError.
"""

from enum import Enum
import hashlib
import json
import os
import time
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class HoldoutState(str, Enum):
    HOLDOUT_LOCKED = "HOLDOUT_LOCKED"
    DEVELOPMENT = "DEVELOPMENT"
    TUNING_COMPLETE = "TUNING_COMPLETE"
    MODEL_SELECTED = "MODEL_SELECTED"
    FINAL_EVALUATION_ALLOWED = "FINAL_EVALUATION_ALLOWED"
    FINAL_EVALUATION_COMPLETE = "FINAL_EVALUATION_COMPLETE"


class HoldoutLockViolationError(Exception):
    """Raised when an attempt is made to evaluate on locked holdout data invalidly."""
    pass


class ModelRunManifest(BaseModel):
    """Immutable audit trail for the selected model and final holdout run."""
    run_id: str
    timestamp_utc: str
    model_name: str
    dataset_name: str
    dataset_hash: str
    hyperparameters: Dict[str, Any]
    dev_cv_score: float
    dev_cv_metric: str
    holdout_metrics: Dict[str, float] = Field(default_factory=dict)
    state: HoldoutState
    holdout_evaluated: bool = False
    notes: Optional[str] = None


class HoldoutLockManager:
    """
    Manages state transitions and strictly guards the final holdout split.
    Guarantees:
    - Final holdout data cannot be accessed during DEVELOPMENT or TUNING.
    - Model selection must be frozen before unlocking.
    - Exactly one evaluation on final holdout is permitted per run.
    """

    def __init__(self, run_id: Optional[str] = None):
        self.run_id = run_id or f"run_{int(time.time())}"
        self._state = HoldoutState.HOLDOUT_LOCKED
        self._manifest: Optional[ModelRunManifest] = None
        self._holdout_eval_count = 0

    @property
    def current_state(self) -> HoldoutState:
        return self._state

    def start_development(self) -> None:
        """Transitions from locked to development."""
        if self._state not in [HoldoutState.HOLDOUT_LOCKED]:
            raise HoldoutLockViolationError(
                f"Cannot start development from state {self._state}"
            )
        self._state = HoldoutState.DEVELOPMENT

    def complete_tuning(self) -> None:
        """Transitions from development to tuning complete."""
        if self._state != HoldoutState.DEVELOPMENT:
            raise HoldoutLockViolationError(
                f"Cannot complete tuning from state {self._state}. Must be in DEVELOPMENT."
            )
        self._state = HoldoutState.TUNING_COMPLETE

    def freeze_model_selection(
        self,
        model_name: str,
        dataset_name: str,
        dataset_hash: str,
        hyperparameters: Dict[str, Any],
        dev_cv_score: float,
        dev_cv_metric: str = "macro_f1"
    ) -> ModelRunManifest:
        """
        Freezes the winning model selection from cross-validation.
        Transitions state to MODEL_SELECTED.
        """
        if self._state != HoldoutState.TUNING_COMPLETE:
            raise HoldoutLockViolationError(
                f"Cannot freeze model from state {self._state}. Hyperparameter tuning must be complete."
            )
        self._state = HoldoutState.MODEL_SELECTED
        self._manifest = ModelRunManifest(
            run_id=self.run_id,
            timestamp_utc=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            model_name=model_name,
            dataset_name=dataset_name,
            dataset_hash=dataset_hash,
            hyperparameters=hyperparameters,
            dev_cv_score=dev_cv_score,
            dev_cv_metric=dev_cv_metric,
            state=self._state,
            holdout_evaluated=False
        )
        return self._manifest

    def authorize_final_evaluation(self) -> None:
        """Authorizes single evaluation pass against holdout test set."""
        if self._state != HoldoutState.MODEL_SELECTED:
            raise HoldoutLockViolationError(
                f"Cannot authorize final evaluation from state {self._state}. Model selection must be frozen first."
            )
        self._state = HoldoutState.FINAL_EVALUATION_ALLOWED

    def evaluate_holdout(self, eval_fn, holdout_X, holdout_y) -> Dict[str, float]:
        """
        Executes evaluation function on holdout test set.
        Enforces exactly-once execution.
        """
        if self._state != HoldoutState.FINAL_EVALUATION_ALLOWED:
            raise HoldoutLockViolationError(
                f"Access denied to locked holdout data. Current state: {self._state}. "
                f"Must be in FINAL_EVALUATION_ALLOWED."
            )
        if self._holdout_eval_count >= 1:
            raise HoldoutLockViolationError(
                "Holdout data has ALREADY been evaluated for this run. "
                "Multiple evaluations on holdout data are prohibited to prevent overfitting."
            )

        self._holdout_eval_count += 1
        metrics = eval_fn(holdout_X, holdout_y)

        self._state = HoldoutState.FINAL_EVALUATION_COMPLETE
        if self._manifest:
            self._manifest.holdout_metrics = metrics
            self._manifest.holdout_evaluated = True
            self._manifest.state = self._state

        return metrics

    def get_manifest(self) -> Optional[ModelRunManifest]:
        return self._manifest
