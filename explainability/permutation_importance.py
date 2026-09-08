"""
Model-Agnostic Permutation Feature Importance for MigraineRelief.
"""

from typing import Dict, List, Optional, Tuple, Any
import numpy as np
import pandas as pd
from sklearn.metrics import f1_score
from models.base import BaseMigraineModel


class PermutationFeatureImportance:
    """Evaluates validation score degradation under feature value shuffling."""

    def __init__(
        self,
        model: BaseMigraineModel,
        n_repeats: int = 5,
        random_state: int = 42,
    ):
        self.model = model
        self.n_repeats = n_repeats
        self.random_state = random_state

    def compute(
        self,
        X_val: pd.DataFrame,
        y_val: pd.Series,
    ) -> pd.DataFrame:
        """
        Computes mean metric drop per permuted feature.
        """
        baseline_preds = self.model.predict(X_val)
        baseline_score = float(f1_score(y_val, baseline_preds, average="macro", zero_division=0))

        rng = np.random.RandomState(self.random_state)
        feature_names = self.model.feature_names or list(X_val.columns)
        results = []

        for feat in feature_names:
            if feat not in X_val.columns:
                continue

            drops = []
            for _ in range(self.n_repeats):
                X_perm = X_val.copy()
                X_perm[feat] = rng.permutation(X_perm[feat].values)
                perm_preds = self.model.predict(X_perm)
                perm_score = float(f1_score(y_val, perm_preds, average="macro", zero_division=0))
                drops.append(baseline_score - perm_score)

            results.append({
                "feature": feat,
                "mean_f1_drop": float(np.mean(drops)),
                "std_f1_drop": float(np.std(drops)),
            })

        df = pd.DataFrame(results).sort_values(by="mean_f1_drop", ascending=False).reset_index(drop=True)
        return df
