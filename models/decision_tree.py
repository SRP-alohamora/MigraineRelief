"""
Decision Tree Baseline Model.
"""

from typing import Dict, Any, Optional
import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from models.base import BaseMigraineModel


class DecisionTreeModel(BaseMigraineModel):
    """Interpretable shallow decision tree baseline."""

    def __init__(self, params: Optional[Dict[str, Any]] = None):
        default_params = {
            "max_depth": 5,
            "min_samples_split": 10,
            "min_samples_leaf": 5,
            "random_state": 42,
            "class_weight": "balanced",
        }
        if params:
            default_params.update(params)
        super().__init__("DecisionTree", default_params)

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "DecisionTreeModel":
        self.feature_names = list(X.columns)
        self.model = DecisionTreeClassifier(**self.params)
        self.model.fit(X.fillna(0), y)
        self.classes_ = self.model.classes_
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        return self.model.predict(X.fillna(0))

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        return self.model.predict_proba(X.fillna(0))
