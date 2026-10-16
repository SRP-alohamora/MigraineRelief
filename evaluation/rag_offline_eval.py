"""
Offline Evaluation & Threshold Sweeper for MigraineRelief Clinical RAG.
=======================================================================
Measures:
- Precision, Recall, TP, FP, TN, FN
- ROC-AUC
- Faithfulness (>98% target)
- Relevance (>92% target)
- Latency Ceiling (<2.5s target)
- Sweeps decision threshold tau in [0.10, 0.95] to find the optimal operating point.
"""

from typing import Dict, List, Any, Tuple
import numpy as np
import pandas as pd
from sklearn.metrics import roc_auc_score
from pathlib import Path
from evaluation.rag_golden_dataset import simulate_expanded_rag_dataset, split_temporal_dataset


class RAGOfflineEvaluator:
    """Evaluates RAG pipeline outputs against golden labels across varying thresholds."""

    def __init__(self, df: pd.DataFrame):
        self.df = df

    @staticmethod
    def evaluate_at_threshold(
        y_true: np.ndarray,
        y_prob: np.ndarray,
        faithfulness_vals: np.ndarray,
        relevance_vals: np.ndarray,
        latency_vals: np.ndarray,
        threshold: float
    ) -> Dict[str, Any]:
        """Calculates confusion matrix and RAG metrics at a specific decision threshold."""
        y_pred = (y_prob >= threshold).astype(int)
        
        tp = int(np.sum((y_true == 1) & (y_pred == 1)))
        fp = int(np.sum((y_true == 0) & (y_pred == 1)))
        tn = int(np.sum((y_true == 0) & (y_pred == 0)))
        fn = int(np.sum((y_true == 1) & (y_pred == 0)))
        
        precision = float(tp / (tp + fp)) if (tp + fp) > 0 else 1.0
        recall = float(tp / (tp + fn)) if (tp + fn) > 0 else 0.0
        specificity = float(tn / (tn + fp)) if (tn + fp) > 0 else 1.0
        f1 = float(2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0.0
        
        # When model accepts (pred == 1), what is average faithfulness and relevance?
        accepted_mask = (y_pred == 1)
        if np.sum(accepted_mask) > 0:
            avg_faithfulness = float(np.mean(faithfulness_vals[accepted_mask]))
            avg_relevance = float(np.mean(relevance_vals[accepted_mask]))
        else:
            avg_faithfulness = 1.0
            avg_relevance = 1.0
            
        avg_latency_ms = float(np.mean(latency_vals))
        
        return {
            "threshold": round(threshold, 2),
            "tp": tp,
            "fp": fp,
            "tn": tn,
            "fn": fn,
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "specificity": round(specificity, 4),
            "f1_score": round(f1, 4),
            "faithfulness": round(avg_faithfulness, 4),
            "relevance": round(avg_relevance, 4),
            "mean_latency_ms": round(avg_latency_ms, 2),
            "latency_ceiling_met": avg_latency_ms < 2500.0,
        }

    def sweep_thresholds(
        self,
        thresholds: List[float] = None
    ) -> Tuple[pd.DataFrame, float, Dict[str, Any]]:
        """Sweeps decision thresholds from 0.10 to 0.95 and identifies optimal tau."""
        if thresholds is None:
            thresholds = [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95]
            
        y_true = self.df["is_valid_ground_truth"].values
        y_prob = self.df["model_prob_valid"].values
        faith_vals = self.df["eval_faithfulness"].values
        rel_vals = self.df["eval_relevance"].values
        lat_vals = self.df["eval_latency_ms"].values
        
        roc_auc = float(roc_auc_score(y_true, y_prob))
        
        results: List[Dict[str, Any]] = []
        for t in thresholds:
            res = self.evaluate_at_threshold(y_true, y_prob, faith_vals, rel_vals, lat_vals, t)
            results.append(res)
            
        sweep_df = pd.DataFrame(results)
        
        # Optimal Threshold Selection Criteria:
        # 1. Faithfulness >= 0.98
        # 2. Relevance >= 0.92
        # 3. Maximum F1 / Recall subject to safety constraints
        candidates = sweep_df[
            (sweep_df["faithfulness"] >= 0.98) &
            (sweep_df["relevance"] >= 0.92) &
            (sweep_df["precision"] >= 0.95)
        ]
        
        if not candidates.empty:
            optimal_row = candidates.sort_values(by=["f1_score", "recall"], ascending=False).iloc[0].to_dict()
        else:
            optimal_row = sweep_df.sort_values(by="f1_score", ascending=False).iloc[0].to_dict()
            
        return sweep_df, roc_auc, optimal_row


def run_full_offline_eval() -> Dict[str, Any]:
    """Executes end-to-end offline evaluation over Train, Validation, and Test sets."""
    raw_df = simulate_expanded_rag_dataset(total_samples=600, random_seed=42)
    train_df, val_df, test_df = split_temporal_dataset(raw_df)
    
    # Run sweep on Validation set to pick optimal threshold
    val_evaluator = RAGOfflineEvaluator(val_df)
    val_sweep, val_roc_auc, optimal_config = val_evaluator.sweep_thresholds()
    optimal_tau = optimal_config["threshold"]
    
    # Evaluate Locked Test Set at optimal threshold tau*
    test_evaluator = RAGOfflineEvaluator(test_df)
    test_sweep, test_roc_auc, _ = test_evaluator.sweep_thresholds([optimal_tau])
    test_result = test_sweep.iloc[0].to_dict()
    
    return {
        "dataset_summary": {
            "total_samples": len(raw_df),
            "train_samples": len(train_df),
            "val_samples": len(val_df),
            "test_samples": len(test_df),
        },
        "validation_roc_auc": round(val_roc_auc, 4),
        "test_roc_auc": round(test_roc_auc, 4),
        "optimal_threshold_tau": optimal_tau,
        "validation_sweep": val_sweep,
        "test_holdout_performance": test_result,
    }


if __name__ == "__main__":
    report = run_full_offline_eval()
    print("=" * 80)
    print("MIGRAINERELIEF RAG OFFLINE EVALUATION & THRESHOLD SWEEP REPORT")
    print("=" * 80)
    print(f"Validation ROC-AUC: {report['validation_roc_auc']}")
    print(f"Test Holdout ROC-AUC: {report['test_roc_auc']}")
    print(f"Optimal Threshold (tau*): {report['optimal_threshold_tau']}")
    print("\n--- VALIDATION THRESHOLD SWEEP TABLE ---")
    print(report["validation_sweep"][["threshold", "precision", "recall", "f1_score", "faithfulness", "relevance", "tp", "fp", "fn"]].to_string(index=False))
    print("\n--- FINAL TEST HOLDOUT EVALUATION AT OPTIMAL TAU* ---")
    for k, v in report["test_holdout_performance"].items():
        print(f"{k}: {v}")
