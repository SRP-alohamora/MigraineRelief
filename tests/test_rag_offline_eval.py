"""
Pytest suite verifying the RAG offline evaluation and threshold sweep engine.
"""
import pytest
from evaluation.rag_golden_dataset import (
    simulate_expanded_rag_dataset,
    split_temporal_dataset,
    CURATED_GOLDEN_SEEDS,
)
from evaluation.rag_offline_eval import (
    RAGOfflineEvaluator,
    run_full_offline_eval,
)


def test_golden_dataset_structure():
    """Verify curated golden seeds have positive and adversarial negative cases."""
    positives = [s for s in CURATED_GOLDEN_SEEDS if s["is_valid_entry"] == 1]
    negatives = [s for s in CURATED_GOLDEN_SEEDS if s["is_valid_entry"] == 0]
    
    assert len(positives) >= 6
    assert len(negatives) >= 6
    
    # Check for critical clinical error categories in negatives
    error_cats = {s["error_category"] for s in negatives}
    assert "WRONG_ROUTE_STASIS" in error_cats
    assert "CONTRAINDICATION_CAD" in error_cats
    assert "MISSED_EMERGENCY" in error_cats
    assert "PROHIBITED_OPIOID" in error_cats


def test_temporal_dataset_split():
    """Verify strictly chronological temporal splitting without lookahead leakage."""
    df = simulate_expanded_rag_dataset(total_samples=200, random_seed=42)
    train, val, test = split_temporal_dataset(df, train_ratio=0.6, val_ratio=0.2)
    
    assert len(train) == 120
    assert len(val) == 40
    assert len(test) == 40
    
    # Verify strict temporal ordering: max(train) <= min(val) and max(val) <= min(test)
    assert train["timestamp"].max() <= val["timestamp"].min()
    assert val["timestamp"].max() <= test["timestamp"].min()


def test_offline_eval_threshold_sweep_and_roc_auc():
    """Verify threshold sweep calculates precision, recall, ROC-AUC and meets latency ceiling."""
    report = run_full_offline_eval()
    
    assert report["validation_roc_auc"] >= 0.90
    assert report["test_roc_auc"] >= 0.90
    assert 0.40 <= report["optimal_threshold_tau"] <= 0.70
    
    test_perf = report["test_holdout_performance"]
    assert test_perf["latency_ceiling_met"] is True
    assert test_perf["mean_latency_ms"] < 2500.0  # Must be strictly under 2.5s
    assert test_perf["recall"] >= 0.95  # Must maintain high recall on valid clinical queries
