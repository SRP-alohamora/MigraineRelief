"""
Model Tournament Framework for MigraineRelief.

Executes a fair benchmark across candidate models under identical cross-validation folds.
Includes multi-attribute decision scoring (discrimination, calibration, efficiency).
"""

import copy
import time
from typing import Dict, List, Optional, Tuple, Any, Type
import numpy as np
import pandas as pd

from models.base import BaseMigraineModel
from models.logistic import LogisticRegressionModel
from models.decision_tree import DecisionTreeModel
from models.random_forest import RandomForestModel
from models.xgboost_model import XGBoostModel
from models.lightgbm_model import LightGBMModel
from models.catboost_model import CatBoostModel

from evaluation.splitters import SplitterRegistry, SplitStrategy
from evaluation.metrics import compute_classification_metrics


class ModelTournament:
    """Fair benchmark harness evaluating candidate models under identical splits."""

    DEFAULT_CANDIDATES = [
        LogisticRegressionModel,
        DecisionTreeModel,
        RandomForestModel,
        XGBoostModel,
        LightGBMModel,
        CatBoostModel,
    ]

    def __init__(
        self,
        candidate_classes: Optional[List[Type[BaseMigraineModel]]] = None,
        strategy: SplitStrategy = SplitStrategy.ROW_STRATIFIED,
        n_splits: int = 5,
        random_state: int = 42,
    ):
        self.candidate_classes = candidate_classes or self.DEFAULT_CANDIDATES
        self.strategy = strategy
        self.n_splits = n_splits
        self.random_state = random_state
        self.results: Dict[str, Dict[str, Any]] = {}
        self.leaderboard: Optional[pd.DataFrame] = None
        self.winner_name: Optional[str] = None
        self.winner_model: Optional[BaseMigraineModel] = None

    def run(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        groups: Optional[pd.Series] = None,
        has_repeated_measures: bool = False,
    ) -> pd.DataFrame:
        """
        Executes tournament over identical cross-validation folds.
        """
        cv = SplitterRegistry.get_cv_splitter(
            strategy=self.strategy,
            n_splits=self.n_splits,
            random_state=self.random_state,
            has_repeated_measures=has_repeated_measures,
        )

        splits = list(cv.split(X, y, groups=groups))
        leaderboard_rows = []

        for model_cls in self.candidate_classes:
            model_instance = model_cls()
            name = model_instance.name

            fold_f1s = []
            fold_accs = []
            fold_eces = []
            fold_briers = []
            fold_times = []

            for train_idx, val_idx in splits:
                X_tr, X_val = X.iloc[train_idx], X.iloc[val_idx]
                y_tr, y_val = y.iloc[train_idx], y.iloc[val_idx]

                # Fresh instance per fold
                fold_model = model_cls()
                t0 = time.time()
                fold_model.fit(X_tr, y_tr)
                fit_duration = time.time() - t0

                y_pred = fold_model.predict(X_val)
                y_prob = fold_model.predict_proba(X_val)

                metrics = compute_classification_metrics(y_val, y_pred, y_prob)

                fold_f1s.append(metrics["macro_f1"])
                fold_accs.append(metrics["balanced_accuracy"])
                fold_eces.append(metrics.get("ece", 0.0))
                fold_briers.append(metrics.get("brier_score", 0.0))
                fold_times.append(fit_duration)

            mean_f1 = float(np.mean(fold_f1s))
            std_f1 = float(np.std(fold_f1s))
            mean_acc = float(np.mean(fold_accs))
            mean_ece = float(np.mean(fold_eces))
            mean_brier = float(np.mean(fold_briers))
            mean_time = float(np.mean(fold_times))

            # Clinical Multi-Attribute Score:
            # Rewards discrimination (macro F1), penalizes poor calibration (ECE) and high Brier loss
            composite_score = mean_f1 - (0.25 * mean_ece) - (0.10 * mean_brier)

            self.results[name] = {
                "mean_macro_f1": mean_f1,
                "std_macro_f1": std_f1,
                "mean_balanced_acc": mean_acc,
                "mean_ece": mean_ece,
                "mean_brier": mean_brier,
                "mean_fit_time_sec": mean_time,
                "composite_score": composite_score,
                "fold_f1s": fold_f1s,
            }

            leaderboard_rows.append({
                "model": name,
                "macro_f1": mean_f1,
                "f1_std": std_f1,
                "balanced_acc": mean_acc,
                "ece": mean_ece,
                "brier_score": mean_brier,
                "fit_time_sec": mean_time,
                "composite_score": composite_score,
            })

        self.leaderboard = pd.DataFrame(leaderboard_rows).sort_values(
            by="composite_score", ascending=False
        ).reset_index(drop=True)

        self.winner_name = self.leaderboard.iloc[0]["model"]
        # Train winner on entire development set
        for model_cls in self.candidate_classes:
            m = model_cls()
            if m.name == self.winner_name:
                self.winner_model = m.fit(X, y)
                break

        return self.leaderboard

    def get_summary_markdown(self) -> str:
        """Generates markdown table of tournament results."""
        if self.leaderboard is None:
            return "Tournament has not been run yet."

        lines = [
            "### Model Tournament Leaderboard",
            f"**Evaluation**: {self.n_splits}-fold cross-validation ({self.strategy})",
            f"**Selected Champion**: `{self.winner_name}` (Composite Score: {self.leaderboard.iloc[0]['composite_score']:.4f})",
            "",
            "| Model | Macro F1 | ± Std | Balanced Acc | ECE (Calib) | Brier Score | Fit Time (s) | Composite Score | Rank |",
            "| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |",
        ]

        for rank, row in self.leaderboard.iterrows():
            marker = " 🏆" if rank == 0 else ""
            lines.append(
                f"| {row['model']}{marker} | {row['macro_f1']:.4f} | ±{row['f1_std']:.3f} | "
                f"{row['balanced_acc']:.4f} | {row['ece']:.4f} | {row['brier_score']:.4f} | "
                f"{row['fit_time_sec']:.3f} | {row['composite_score']:.4f} | #{rank + 1} |"
            )

        return "\n".join(lines)
