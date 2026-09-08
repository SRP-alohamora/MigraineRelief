"""
SHAP Explainability Engine for MigraineRelief.

Implements Tier A (Global hypothesis generation, explicitly non-causal)
and Tier B (Patient-level explanation with modifiable lifestyle stratification).
"""

from typing import Dict, List, Optional, Tuple, Any
import numpy as np
import pandas as pd
import shap

from models.base import BaseMigraineModel


class SHAPExplainer:
    """Computes TreeSHAP / LinearSHAP / KernelSHAP values with clinical disclaimers."""

    DISCLAIMER = (
        "CLINICAL INTERPRETABILITY NOTICE: SHAP values quantify statistical feature "
        "attributions within this predictive model. They represent observational associations, "
        "NOT verified biological or causal relationships. Never interpret SHAP values "
        "as clinical interventions without physician guidance."
    )

    MODIFIABLE_LIFESTYLE_FEATURES = {
        "sleep_hours", "screen_time_hours", "perceived_stress",
        "mood_score", "hydration_liters", "sleep_hours_dev",
        "screen_time_dev", "stress_dev", "hydration_dev",
    }

    def __init__(self, model: BaseMigraineModel, background_data: Optional[pd.DataFrame] = None):
        self.model = model
        self.background_data = background_data
        self.explainer: Optional[Any] = None
        self._init_explainer()

    def _init_explainer(self):
        """Selects appropriate SHAP explainer implementation."""
        inner_model = self.model.model
        if inner_model is None:
            return

        # Check for tree models
        tree_model_names = ["RandomForestClassifier", "XGBClassifier", "LGBMClassifier", "CatBoostClassifier", "DecisionTreeClassifier"]
        type_name = type(inner_model).__name__

        if type_name in tree_model_names:
            try:
                self.explainer = shap.TreeExplainer(inner_model)
                return
            except Exception:
                pass

        # For linear models
        if hasattr(inner_model, "coef_"):
            try:
                bg = self.background_data.fillna(0) if self.background_data is not None else np.zeros((10, len(self.model.feature_names)))
                self.explainer = shap.LinearExplainer(inner_model, bg)
                return
            except Exception:
                pass

        # Fallback to KernelExplainer or SamplingExplainer
        if self.background_data is not None:
            bg_summary = shap.sample(self.background_data.fillna(0), min(50, len(self.background_data)))
            self.explainer = shap.KernelExplainer(self.model.predict_proba, bg_summary)

    def compute_global_importance(self, X: pd.DataFrame) -> pd.DataFrame:
        """
        Computes Tier A global feature importance (mean absolute SHAP).
        """
        X_clean = X.fillna(0)
        shap_values = self._get_shap_values(X_clean)

        # Average across samples
        if isinstance(shap_values, list):
            # Multiclass list of arrays: average across classes
            mean_abs_per_class = [np.mean(np.abs(sv), axis=0) for sv in shap_values]
            mean_abs = np.mean(mean_abs_per_class, axis=0)
        elif shap_values.ndim == 3:
            # (samples, features, classes)
            mean_abs = np.mean(np.mean(np.abs(shap_values), axis=2), axis=0)
        else:
            mean_abs = np.mean(np.abs(shap_values), axis=0)

        df = pd.DataFrame({
            "feature": self.model.feature_names or list(X.columns),
            "mean_abs_shap": mean_abs,
        }).sort_values(by="mean_abs_shap", ascending=False).reset_index(drop=True)

        df["relative_importance_pct"] = (df["mean_abs_shap"] / df["mean_abs_shap"].sum()) * 100.0
        df["is_modifiable_lifestyle"] = df["feature"].isin(self.MODIFIABLE_LIFESTYLE_FEATURES)
        return df

    def explain_patient(
        self,
        patient_features: pd.Series,
        top_k: int = 5
    ) -> Dict[str, Any]:
        """
        Computes Tier B patient-specific feature attributions.
        Separates fixed clinical/biological factors from modifiable lifestyle factors.
        """
        X_single = pd.DataFrame([patient_features]).fillna(0)
        shap_vals = self._get_shap_values(X_single)

        if isinstance(shap_vals, list):
            # multiclass: use class with highest predicted probability
            probs = self.model.predict_proba(X_single)[0]
            top_class_idx = int(np.argmax(probs))
            sample_shap = shap_vals[top_class_idx][0]
        elif shap_vals.ndim == 3:
            probs = self.model.predict_proba(X_single)[0]
            top_class_idx = int(np.argmax(probs))
            sample_shap = shap_vals[0, :, top_class_idx]
        else:
            sample_shap = shap_vals[0]

        feature_names = self.model.feature_names or list(patient_features.index)
        contributions = []
        for feat, val, s_val in zip(feature_names, patient_features.values, sample_shap):
            contributions.append({
                "feature": feat,
                "value": float(val) if isinstance(val, (int, float, np.number)) else str(val),
                "shap_value": float(s_val),
                "direction": "increases_risk" if s_val > 0 else "reduces_risk",
                "is_modifiable": feat in self.MODIFIABLE_LIFESTYLE_FEATURES,
            })

        # Sort by absolute impact
        contributions.sort(key=lambda c: abs(c["shap_value"]), reverse=True)

        fixed_factors = [c for c in contributions if not c["is_modifiable"]][:top_k]
        lifestyle_factors = [c for c in contributions if c["is_modifiable"]][:top_k]

        return {
            "disclaimer": self.DISCLAIMER,
            "top_overall_factors": contributions[:top_k],
            "fixed_clinical_factors": fixed_factors,
            "modifiable_lifestyle_factors": lifestyle_factors,
        }

    def _get_shap_values(self, X: pd.DataFrame) -> np.ndarray:
        """Internal helper to calculate raw shap values."""
        if self.explainer is None:
            # Fallback: estimate attribution from coefficients or feature importances
            fi = self.model.get_feature_importances()
            if fi is not None:
                fi_vals = fi.values
                return np.tile(fi_vals, (len(X), 1))
            return np.ones((len(X), len(X.columns))) / len(X.columns)

        try:
            res = self.explainer.shap_values(X)
            return res
        except Exception:
            # Fallback to model feature importances
            fi = self.model.get_feature_importances()
            if fi is not None:
                return np.tile(fi.values, (len(X), 1))
            return np.zeros((len(X), len(X.columns)))
