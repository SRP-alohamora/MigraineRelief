"""
LightGBM Gradient Boosted Trees Model.
"""

from typing import Dict, Any, Optional
import numpy as np
import pandas as pd
from lightgbm import LGBMClassifier
from sklearn.preprocessing import LabelEncoder
from models.base import BaseMigraineModel


class LightGBMModel(BaseMigraineModel):
    """Light Gradient Boosting Machine with histogram-based split finding."""

    def __init__(self, params: Optional[Dict[str, Any]] = None):
        default_params = {
            "n_estimators": 100,
            "max_depth": 5,
            "num_leaves": 31,
            "learning_rate": 0.05,
            "subsample": 0.8,
            "colsample_bytree": 0.8,
            "random_state": 42,
            "verbose": -1,
            "n_jobs": -1,
        }
        if params:
            default_params.update(params)
        super().__init__("LightGBM", default_params)
        self.label_encoder = LabelEncoder()

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "LightGBMModel":
        self.feature_names = list(X.columns)
        y_enc = self.label_encoder.fit_transform(y)
        self.classes_ = self.label_encoder.classes_

        self.model = LGBMClassifier(**self.params)
        self.model.fit(X.fillna(0), y_enc)
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        preds = self.model.predict(X.fillna(0))
        return self.label_encoder.inverse_transform(preds)

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        return self.model.predict_proba(X.fillna(0))
