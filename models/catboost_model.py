"""
CatBoost Gradient Boosted Trees Model.
"""

from typing import Dict, Any, Optional
import numpy as np
import pandas as pd
from catboost import CatBoostClassifier
from sklearn.preprocessing import LabelEncoder
from models.base import BaseMigraineModel


class CatBoostModel(BaseMigraineModel):
    """CatBoost with symmetric trees and categorical feature handling."""

    def __init__(self, params: Optional[Dict[str, Any]] = None):
        default_params = {
            "iterations": 100,
            "depth": 5,
            "learning_rate": 0.05,
            "random_seed": 42,
            "verbose": 0,
            "thread_count": -1,
        }
        if params:
            default_params.update(params)
        super().__init__("CatBoost", default_params)
        self.label_encoder = LabelEncoder()

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "CatBoostModel":
        self.feature_names = list(X.columns)
        y_enc = self.label_encoder.fit_transform(y)
        self.classes_ = self.label_encoder.classes_

        self.model = CatBoostClassifier(**self.params)
        self.model.fit(X.fillna(0), y_enc)
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        preds = self.model.predict(X.fillna(0)).ravel()
        return self.label_encoder.inverse_transform(preds)

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        return self.model.predict_proba(X.fillna(0))
