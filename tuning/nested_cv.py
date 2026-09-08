"""
Nested Cross-Validation Evaluator for MigraineRelief.

Prevents optimistic performance estimation by strictly separating hyperparameter
optimization (inner folds) from out-of-fold generalization assessment (outer folds).
"""

from typing import Dict, List, Optional, Tuple, Any, Type
import numpy as np
import pandas as pd

from models.base import BaseMigraineModel
from tuning.optuna_runner import OptunaHyperparameterTuner
from evaluation.splitters import SplitterRegistry, SplitStrategy
from evaluation.metrics import compute_classification_metrics


class NestedCrossValidation:
    """Orchestrates nested cross-validation with inner-fold Bayesian tuning."""

    def __init__(
        self,
        model_cls: Type[BaseMigraineModel],
        outer_splits: int = 5,
        inner_splits: int = 3,
        n_tuning_trials: int = 15,
        strategy: SplitStrategy = SplitStrategy.ROW_STRATIFIED,
        metric: str = "macro_f1",
        random_state: int = 42,
    ):
        self.model_cls = model_cls
        self.outer_splits = outer_splits
        self.inner_splits = inner_splits
        self.n_tuning_trials = n_tuning_trials
        self.strategy = strategy
        self.metric = metric
        self.random_state = random_state
        self.outer_results: List[Dict[str, Any]] = []

    def evaluate(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        groups: Optional[pd.Series] = None,
        has_repeated_measures: bool = False,
    ) -> Dict[str, Any]:
        """
        Executes complete nested cross-validation loop.
        """
        outer_cv = SplitterRegistry.get_cv_splitter(
            strategy=self.strategy,
            n_splits=self.outer_splits,
            random_state=self.random_state,
            has_repeated_measures=has_repeated_measures,
        )

        outer_splits = list(outer_cv.split(X, y, groups=groups))
        outer_f1s = []
        outer_baccs = []
        outer_eces = []
        outer_briers = []
        best_param_history = []

        for fold_idx, (train_idx, val_idx) in enumerate(outer_splits):
            X_tr, X_val = X.iloc[train_idx], X.iloc[val_idx]
            y_tr, y_val = y.iloc[train_idx], y.iloc[val_idx]
            groups_tr = groups.iloc[train_idx] if groups is not None else None

            # 1. Inner CV tuning strictly on training portion
            tuner = OptunaHyperparameterTuner(
                model_cls=self.model_cls,
                n_trials=self.n_tuning_trials,
                inner_splits=self.inner_splits,
                strategy=self.strategy,
                metric=self.metric,
                random_state=self.random_state + fold_idx,
            )
            best_params, inner_score = tuner.tune(
                X_train=X_tr,
                y_train=y_tr,
                groups_train=groups_tr,
                has_repeated_measures=has_repeated_measures,
            )
            best_param_history.append(best_params)

            # 2. Train model with tuned params on full outer training split
            outer_model = self.model_cls(params=best_params)
            outer_model.fit(X_tr, y_tr)

            # 3. Evaluate on unseen outer validation fold
            preds = outer_model.predict(X_val)
            probs = outer_model.predict_proba(X_val)
            fold_metrics = compute_classification_metrics(y_val, preds, probs)

            outer_f1s.append(fold_metrics["macro_f1"])
            outer_baccs.append(fold_metrics["balanced_accuracy"])
            outer_eces.append(fold_metrics.get("ece", 0.0))
            outer_briers.append(fold_metrics.get("brier_score", 0.0))

            self.outer_results.append({
                "fold": fold_idx + 1,
                "best_params": best_params,
                "inner_cv_score": inner_score,
                "outer_metrics": fold_metrics,
            })

        return {
            "model": self.model_cls().name,
            "outer_splits": self.outer_splits,
            "inner_splits": self.inner_splits,
            "mean_macro_f1": float(np.mean(outer_f1s)),
            "std_macro_f1": float(np.std(outer_f1s)),
            "mean_balanced_accuracy": float(np.mean(outer_baccs)),
            "mean_ece": float(np.mean(outer_eces)),
            "mean_brier": float(np.mean(outer_briers)),
            "fold_f1s": outer_f1s,
            "best_param_history": best_param_history,
        }
