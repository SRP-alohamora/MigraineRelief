"""
Abstract Model Interface for MigraineRelief.

All candidate models in the fair tournament adhere to this unified interface.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
import numpy as np
import pandas as pd


class BaseMigraineModel(ABC):
    """Unified wrapper interface for ML tournament models."""

    def __init__(self, name: str, params: Optional[Dict[str, Any]] = None):
        self.name = name
        self.params = params or {}
        self.model: Optional[Any] = None
        self.feature_names: List[str] = []
        self.classes_: np.ndarray = np.array([])

    @abstractmethod
    def fit(self, X: pd.DataFrame, y: pd.Series) -> "BaseMigraineModel":
        """Fits model to training features and target labels."""
        pass

    @abstractmethod
    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """Predicts class labels."""
        pass

    @abstractmethod
    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        """Predicts calibrated class probabilities."""
        pass

    def get_feature_importances(self) -> Optional[pd.Series]:
        """Returns feature importances if available, indexed by feature name."""
        if self.model is None:
            return None

        if hasattr(self.model, "feature_importances_"):
            importances = self.model.feature_importances_
            if len(importances) == len(self.feature_names):
                return pd.Series(importances, index=self.feature_names).sort_values(ascending=False)

        elif hasattr(self.model, "coef_"):
            # For linear models: mean absolute coefficient across classes
            coefs = np.mean(np.abs(self.model.coef_), axis=0) if self.model.coef_.ndim > 1 else np.abs(self.model.coef_)
            if len(coefs) == len(self.feature_names):
                return pd.Series(coefs, index=self.feature_names).sort_values(ascending=False)

        return None

    def get_params(self) -> Dict[str, Any]:
        """Returns model hyperparameters."""
        return self.params.copy()

    def set_params(self, **params) -> "BaseMigraineModel":
        """Updates model hyperparameters."""
        self.params.update(params)
        return self
