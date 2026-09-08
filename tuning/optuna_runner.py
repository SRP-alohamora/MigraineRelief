"""
Optuna Hyperparameter Optimizer for MigraineRelief models.

CANONICAL ARCHITECTURAL INVARIANT:
Hyperparameter tuning is strictly isolated inside training folds.
The locked holdout evaluation set must NEVER be exposed to Optuna.
"""

from typing import Dict, List, Optional, Tuple, Any, Type
import numpy as np
import pandas as pd
import optuna
from optuna.samplers import TPESampler

from models.base import BaseMigraineModel
from models.xgboost_model import XGBoostModel
from models.lightgbm_model import LightGBMModel
from models.catboost_model import CatBoostModel
from models.random_forest import RandomForestModel
from models.logistic import LogisticRegressionModel
from evaluation.splitters import SplitterRegistry, SplitStrategy
from evaluation.metrics import compute_classification_metrics

# Silence Optuna verbose logs
optuna.logging.set_verbosity(optuna.logging.WARNING)


class OptunaHyperparameterTuner:
    """Tunes candidate models via TPE Bayesian optimization over inner CV folds."""

    def __init__(
        self,
        model_cls: Type[BaseMigraineModel],
        n_trials: int = 20,
        inner_splits: int = 3,
        strategy: SplitStrategy = SplitStrategy.ROW_STRATIFIED,
        metric: str = "macro_f1",
        random_state: int = 42,
    ):
        self.model_cls = model_cls
        self.n_trials = n_trials
        self.inner_splits = inner_splits
        self.strategy = strategy
        self.metric = metric
        self.random_state = random_state
        self.best_params: Dict[str, Any] = {}
        self.best_score: float = -float("inf")

    def _sample_params(self, trial: optuna.Trial, model_name: str) -> Dict[str, Any]:
        """Defines bounded, clinically sound hyperparameter search spaces."""
        if model_name == "XGBoost":
            return {
                "max_depth": trial.suggest_int("max_depth", 3, 7),
                "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.2, log=True),
                "n_estimators": trial.suggest_int("n_estimators", 50, 200, step=25),
                "subsample": trial.suggest_float("subsample", 0.6, 1.0),
                "colsample_bytree": trial.suggest_float("colsample_bytree", 0.6, 1.0),
                "random_state": self.random_state,
            }
        elif model_name == "LightGBM":
            return {
                "max_depth": trial.suggest_int("max_depth", 3, 7),
                "num_leaves": trial.suggest_int("num_leaves", 15, 63),
                "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.2, log=True),
                "n_estimators": trial.suggest_int("n_estimators", 50, 200, step=25),
                "subsample": trial.suggest_float("subsample", 0.6, 1.0),
                "colsample_bytree": trial.suggest_float("colsample_bytree", 0.6, 1.0),
                "random_state": self.random_state,
                "verbose": -1,
            }
        elif model_name == "CatBoost":
            return {
                "depth": trial.suggest_int("depth", 3, 7),
                "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.2, log=True),
                "iterations": trial.suggest_int("iterations", 50, 200, step=25),
                "random_seed": self.random_state,
                "verbose": 0,
            }
        elif model_name == "RandomForest":
            return {
                "n_estimators": trial.suggest_int("n_estimators", 50, 200, step=25),
                "max_depth": trial.suggest_int("max_depth", 3, 10),
                "min_samples_split": trial.suggest_int("min_samples_split", 2, 10),
                "min_samples_leaf": trial.suggest_int("min_samples_leaf", 1, 5),
                "random_state": self.random_state,
            }
        elif model_name == "LogisticRegression":
            return {
                "C": trial.suggest_float("C", 1e-3, 1e2, log=True),
                "random_state": self.random_state,
            }
        else:
            return {}

    def tune(
        self,
        X_train: pd.DataFrame,
        y_train: pd.Series,
        groups_train: Optional[pd.Series] = None,
        has_repeated_measures: bool = False,
    ) -> Tuple[Dict[str, Any], float]:
        """
        Runs Optuna Bayesian optimization strictly on training data using inner CV.
        """
        temp_instance = self.model_cls()
        model_name = temp_instance.name

        cv = SplitterRegistry.get_cv_splitter(
            strategy=self.strategy,
            n_splits=self.inner_splits,
            random_state=self.random_state,
            has_repeated_measures=has_repeated_measures,
        )

        splits = list(cv.split(X_train, y_train, groups=groups_train))

        def objective(trial: optuna.Trial) -> float:
            sampled = self._sample_params(trial, model_name)
            fold_scores = []

            for inner_tr_idx, inner_val_idx in splits:
                X_tr, X_val = X_train.iloc[inner_tr_idx], X_train.iloc[inner_val_idx]
                y_tr, y_val = y_train.iloc[inner_tr_idx], y_train.iloc[inner_val_idx]

                model = self.model_cls(params=sampled)
                model.fit(X_tr, y_tr)
                preds = model.predict(X_val)
                probs = model.predict_proba(X_val)

                metrics = compute_classification_metrics(y_val, preds, probs)
                score = metrics.get(self.metric, metrics.get("macro_f1", 0.0))
                fold_scores.append(score)

            return float(np.mean(fold_scores))

        sampler = TPESampler(seed=self.random_state)
        study = optuna.create_study(direction="maximize", sampler=sampler)
        study.optimize(objective, n_trials=self.n_trials)

        self.best_params = study.best_params
        self.best_score = float(study.best_value)
        return self.best_params, self.best_score
