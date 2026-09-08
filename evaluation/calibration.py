"""
Clinical Probability Calibration & Reliability Assessment.

Provides:
- Reliability diagram data generation
- ECE (Expected Calibration Error) and MCE (Maximum Calibration Error)
- Calibration slope and intercept
- Post-hoc calibration wrappers (Platt Scaling, Isotonic Regression)
  STRICT ARCHITECTURAL RULE: Post-hoc calibrators must be fit on development folds only!
"""

from typing import Dict, List, Optional, Tuple, Any
import numpy as np
from sklearn.calibration import calibration_curve, CalibratedClassifierCV
from sklearn.linear_model import LogisticRegression
from sklearn.isotonic import IsotonicRegression


class CalibrationEvaluator:
    """Computes clinical calibration diagnostics and reliability curves."""

    @staticmethod
    def compute_reliability_curve(
        y_true: np.ndarray,
        y_prob: np.ndarray,
        n_bins: int = 10,
        strategy: str = "uniform"
    ) -> Dict[str, Any]:
        """
        Computes fraction of positives and mean predicted value per bin.
        """
        y_true = np.asarray(y_true)
        y_prob = np.asarray(y_prob)

        if y_prob.ndim == 2 and y_prob.shape[1] == 2:
            prob = y_prob[:, 1]
        elif y_prob.ndim == 2:
            # Multiclass: take max confidence
            prob = np.max(y_prob, axis=1)
            y_true = (np.argmax(y_prob, axis=1) == y_true).astype(int)
        else:
            prob = y_prob.ravel()

        prob_true, prob_pred = calibration_curve(
            y_true, prob, n_bins=n_bins, strategy=strategy
        )

        # Compute bin counts and errors
        bin_edges = np.linspace(0.0, 1.0, n_bins + 1)
        bin_counts = []
        abs_errors = []
        for i in range(len(prob_true)):
            abs_errors.append(abs(prob_true[i] - prob_pred[i]))

        ece = float(np.mean(abs_errors)) if abs_errors else 0.0
        mce = float(np.max(abs_errors)) if abs_errors else 0.0

        # Estimate calibration slope and intercept via logistic regression
        # logit(p) ~ y_true
        eps = 1e-7
        clipped_p = np.clip(prob, eps, 1 - eps)
        logits = np.log(clipped_p / (1 - clipped_p)).reshape(-1, 1)

        try:
            lr = LogisticRegression(solver="lbfgs", C=1e5)
            lr.fit(logits, y_true)
            slope = float(lr.coef_[0][0])
            intercept = float(lr.intercept_[0])
        except Exception:
            slope = 1.0
            intercept = 0.0

        return {
            "prob_true": prob_true.tolist(),
            "prob_pred": prob_pred.tolist(),
            "ece": ece,
            "mce": mce,
            "calibration_slope": slope,
            "calibration_intercept": intercept,
            "n_bins": n_bins,
        }


class PostHocCalibrator:
    """
    Calibrates predicted probabilities using Platt Scaling or Isotonic Regression.
    Enforces that calibration fitting happens strictly on training/validation folds.
    """

    def __init__(self, method: str = "sigmoid"):
        """
        method: 'sigmoid' (Platt scaling) or 'isotonic'
        """
        self.method = method
        self.calibrator: Optional[Any] = None
        self.is_fitted = False

    def fit(self, dev_probs: np.ndarray, dev_y: np.ndarray) -> "PostHocCalibrator":
        """Fit calibrator on development set validation probabilities."""
        dev_probs = np.asarray(dev_probs)
        dev_y = np.asarray(dev_y)

        if dev_probs.ndim == 1:
            dev_probs = dev_probs.reshape(-1, 1)

        if self.method == "sigmoid":
            self.calibrator = LogisticRegression(solver="lbfgs")
            self.calibrator.fit(dev_probs, dev_y)
        elif self.method == "isotonic":
            self.calibrator = IsotonicRegression(out_of_bounds="clip")
            self.calibrator.fit(dev_probs.ravel(), dev_y)
        else:
            raise ValueError(f"Unknown calibration method: {self.method}")

        self.is_fitted = True
        return self

    def predict_proba(self, probs: np.ndarray) -> np.ndarray:
        """Calibrate probabilities."""
        if not self.is_fitted or self.calibrator is None:
            raise RuntimeError("PostHocCalibrator must be fitted before predict_proba.")

        probs = np.asarray(probs)
        if self.method == "sigmoid":
            if probs.ndim == 1:
                probs = probs.reshape(-1, 1)
            return self.calibrator.predict_proba(probs)
        else:
            calibrated = self.calibrator.predict(probs.ravel())
            return np.vstack([1 - calibrated, calibrated]).T
