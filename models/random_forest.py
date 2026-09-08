"""
Random Forest Ensemble Model.
"""

from typing import Dict, Any, Optional
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from models.base import BaseMigraineModel


class RandomForestModel(BaseMigraineModel):
    """Ensemble Random Forest with balanced subsampling."""

    def __init__(self, params: Optional[Dict[str, Any]] = None):
        default_params = {
            "n_estimators": 100,
            "max_depth": 8,
            "min_samples_split": 5,
            "min_samples_leaf": 2,
            "random_state": 42,
            "class_weight": "balanced_subsample",
            "n_jobs": -1,
        }
        if params:
            default_params.update(params)
        super().__init__("RandomForest", default_params)

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "RandomForestModel":
        self.feature_names = list(X.columns)
        self.model = RandomForestClassifier(**self.params)
        self.model.fit(X.fillna(0), y)
        self.classes_ = self.model.classes_
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        return self.model.predict(X.fillna(0))

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        return self.model.predict_proba(X.fillna(0))
