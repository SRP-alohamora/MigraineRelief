"""
Logistic Regression Baseline Model.
"""

from typing import Dict, Any, Optional
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from models.base import BaseMigraineModel


class LogisticRegressionModel(BaseMigraineModel):
    """Calibrated L2/ElasticNet regularized Logistic Regression baseline."""

    def __init__(self, params: Optional[Dict[str, Any]] = None):
        default_params = {
            "C": 1.0,
            "solver": "lbfgs",
            "max_iter": 1000,
            "random_state": 42,
            "class_weight": "balanced",
        }
        if params:
            default_params.update(params)
        super().__init__("LogisticRegression", default_params)
        self.scaler = StandardScaler()

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "LogisticRegressionModel":
        self.feature_names = list(X.columns)
        X_scaled = self.scaler.fit_transform(X.fillna(0))
        self.model = LogisticRegression(**self.params)
        self.model.fit(X_scaled, y)
        self.classes_ = self.model.classes_
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        X_scaled = self.scaler.transform(X.fillna(0))
        return self.model.predict(X_scaled)

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        X_scaled = self.scaler.transform(X.fillna(0))
        return self.model.predict_proba(X_scaled)
