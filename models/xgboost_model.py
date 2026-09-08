"""
XGBoost Gradient Boosted Trees Model.
"""

from typing import Dict, Any, Optional
import numpy as np
import pandas as pd
from xgboost import XGBClassifier
from sklearn.preprocessing import LabelEncoder
from models.base import BaseMigraineModel


class XGBoostModel(BaseMigraineModel):
    """Extreme Gradient Boosting with tree subsampling and shrinkage."""

    def __init__(self, params: Optional[Dict[str, Any]] = None):
        default_params = {
            "n_estimators": 100,
            "max_depth": 4,
            "learning_rate": 0.05,
            "subsample": 0.8,
            "colsample_bytree": 0.8,
            "random_state": 42,
            "eval_metric": "mlogloss",
            "n_jobs": -1,
        }
        if params:
            default_params.update(params)
        super().__init__("XGBoost", default_params)
        self.label_encoder = LabelEncoder()

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "XGBoostModel":
        self.feature_names = list(X.columns)
        y_enc = self.label_encoder.fit_transform(y)
        self.classes_ = self.label_encoder.classes_

        params = self.params.copy()
        if len(self.classes_) == 2:
            params["eval_metric"] = "logloss"

        self.model = XGBClassifier(**params)
        self.model.fit(X.fillna(0), y_enc)
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        preds = self.model.predict(X.fillna(0))
        return self.label_encoder.inverse_transform(preds)

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        return self.model.predict_proba(X.fillna(0))
