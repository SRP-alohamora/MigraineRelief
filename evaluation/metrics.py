"""
Standardized clinical and statistical evaluation metrics for MigraineRelief.

Supports:
- Multi-class classification (Macro F1, Balanced Accuracy, Per-class Recall, One-vs-Rest AUROC, Multiclass Brier Score)
- Binary attack classification (AUPRC, AUROC, Sensitivity, Specificity, Brier Score, ECE)
- Ordinal/Regression severity prediction (MAE, RMSE, Weighted Cohen's Kappa, Spearman rho)
"""

from typing import Dict, List, Optional, Union, Any
import numpy as np
import pandas as pd
from sklearn.metrics import (
    f1_score,
    balanced_accuracy_score,
    recall_score,
    precision_score,
    roc_auc_score,
    average_precision_score,
    brier_score_loss,
    mean_absolute_error,
    mean_squared_error,
    cohen_kappa_score,
)
from scipy.stats import spearmanr


def compute_expected_calibration_error(
    y_true: np.ndarray,
    y_prob: np.ndarray,
    n_bins: int = 10
) -> float:
    """
    Computes Expected Calibration Error (ECE) for binary or multi-class predictions.
    For multiclass, computes confidence-based top-1 ECE.
    """
    y_true = np.asarray(y_true)
    y_prob = np.asarray(y_prob)

    if y_prob.ndim == 1 or y_prob.shape[1] == 1:
        # Binary case
        probs = y_prob.ravel()
        preds = (probs >= 0.5).astype(int)
        bin_edges = np.linspace(0.0, 1.0, n_bins + 1)
        ece = 0.0
        n_samples = len(y_true)
        for i in range(n_bins):
            bin_mask = (probs > bin_edges[i]) & (probs <= bin_edges[i + 1])
            if i == 0:
                bin_mask = bin_mask | (probs == bin_edges[0])
            bin_size = np.sum(bin_mask)
            if bin_size > 0:
                acc = np.mean(y_true[bin_mask] == preds[bin_mask])
                conf = np.mean(probs[bin_mask])
                ece += (bin_size / n_samples) * np.abs(acc - conf)
        return float(ece)
    else:
        # Multiclass confidence-based ECE
        confidences = np.max(y_prob, axis=1)
        predictions = np.argmax(y_prob, axis=1)
        bin_edges = np.linspace(0.0, 1.0, n_bins + 1)
        ece = 0.0
        n_samples = len(y_true)
        for i in range(n_bins):
            bin_mask = (confidences > bin_edges[i]) & (confidences <= bin_edges[i + 1])
            if i == 0:
                bin_mask = bin_mask | (confidences == bin_edges[0])
            bin_size = np.sum(bin_mask)
            if bin_size > 0:
                acc = np.mean(predictions[bin_mask] == y_true[bin_mask])
                conf = np.mean(confidences[bin_mask])
                ece += (bin_size / n_samples) * np.abs(acc - conf)
        return float(ece)


def compute_classification_metrics(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    y_prob: Optional[np.ndarray] = None,
    class_names: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """
    Computes comprehensive clinical classification metrics.
    """
    y_true = np.asarray(y_true)
    y_pred = np.asarray(y_pred)

    unique_classes = np.unique(np.concatenate([y_true, y_pred]))
    is_binary = len(unique_classes) <= 2

    metrics: Dict[str, Any] = {
        "macro_f1": float(f1_score(y_true, y_pred, average="macro", zero_division=0)),
        "weighted_f1": float(f1_score(y_true, y_pred, average="weighted", zero_division=0)),
        "balanced_accuracy": float(balanced_accuracy_score(y_true, y_pred)),
        "accuracy": float(np.mean(y_true == y_pred)),
    }

    # Per-class recall
    recalls = recall_score(y_true, y_pred, average=None, zero_division=0)
    per_class = {}
    for i, c in enumerate(unique_classes):
        label = class_names[i] if class_names and i < len(class_names) else str(c)
        per_class[f"recall_class_{label}"] = float(recalls[i])
    metrics["per_class_recall"] = per_class

    # Probability-based metrics
    if y_prob is not None:
        try:
            if is_binary:
                if y_true.dtype == object or isinstance(y_true[0], str):
                    y_true_int = (y_true == unique_classes[1]).astype(int)
                else:
                    y_true_int = y_true.astype(int)
                prob_pos = y_prob[:, 1] if y_prob.ndim == 2 and y_prob.shape[1] == 2 else y_prob.ravel()
                metrics["auroc"] = float(roc_auc_score(y_true_int, prob_pos))
                metrics["auprc"] = float(average_precision_score(y_true_int, prob_pos))
                metrics["brier_score"] = float(brier_score_loss(y_true_int, prob_pos))
                metrics["ece"] = float(compute_expected_calibration_error(y_true_int, prob_pos))
            else:
                # Multiclass: map class labels to index 0..K-1
                class_to_idx = {c: idx for idx, c in enumerate(unique_classes)}
                y_true_idx = np.array([class_to_idx[val] for val in y_true])
                n_classes = y_prob.shape[1]

                metrics["auroc"] = float(
                    roc_auc_score(y_true_idx, y_prob, multi_class="ovr", average="macro")
                )
                # Multi-class Brier score: mean squared error between one-hot y and predicted probs
                y_one_hot = np.eye(n_classes)[y_true_idx]
                metrics["brier_score"] = float(np.mean(np.sum((y_prob - y_one_hot) ** 2, axis=1)))
                metrics["ece"] = float(compute_expected_calibration_error(y_true_idx, y_prob))
        except Exception as e:
            metrics["prob_metrics_error"] = str(e)

    return metrics


def compute_regression_metrics(
    y_true: np.ndarray,
    y_pred: np.ndarray
) -> Dict[str, float]:
    """
    Computes regression and ordinal severity metrics.
    """
    y_true = np.asarray(y_true, dtype=float)
    y_pred = np.asarray(y_pred, dtype=float)

    mae = float(mean_absolute_error(y_true, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))

    # Spearman rank correlation
    rho, _ = spearmanr(y_true, y_pred)

    # Weighted Cohen's Kappa (discretized to integer buckets)
    try:
        y_t_int = np.clip(np.round(y_true), 0, 10).astype(int)
        y_p_int = np.clip(np.round(y_pred), 0, 10).astype(int)
        kappa = float(cohen_kappa_score(y_t_int, y_p_int, weights="quadratic"))
    except Exception:
        kappa = 0.0

    return {
        "mae": mae,
        "rmse": rmse,
        "spearman_rho": float(rho) if not np.isnan(rho) else 0.0,
        "weighted_kappa": kappa,
    }
