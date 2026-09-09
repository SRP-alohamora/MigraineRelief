"""Unit tests for Scutelnic et al. 2022 Stroke vs. Migraine Aura differential safety gate."""

import pytest
from app.core.state import MigraineRunState, TriageStatus
from app.core.safety_gates import SafetyGateEngine
from datasets.stroke_aura_adapter import StrokeVsAuraAdapter
from datasets.base import TaskType


def test_stroke_aura_adapter_loading_and_validation():
    """Verify Scutelnic et al. cohort loads and satisfies published sample size invariants."""
    adapter = StrokeVsAuraAdapter()
    df = adapter.load()
    assert len(df) == 693
    assert adapter.validate() is True

    stroke_count = (df["diagnosis"] == "ischemic_stroke").sum()
    mwa_count = (df["diagnosis"] == "migraine_with_aura").sum()
    assert stroke_count == 350
    assert mwa_count == 343

    # Verify features and target
    X, y, groups = adapter.get_features_and_target(TaskType.STROKE_AURA_DIFFERENTIATION)
    assert len(X) == 693
    assert len(y) == 693
    assert groups is None
    assert "paresis_sudden" in X.columns
    assert "visual_sudden" in X.columns


def test_stroke_aura_adapter_evidence_scoring():
    """Verify clinical likelihood ratio logic distinguishes acute stroke from migraine aura."""
    adapter = StrokeVsAuraAdapter()

    # Case A: Sudden motor paresis < 60 seconds (Stroke pathognomonic)
    eval_stroke = adapter.evaluate_stroke_vs_aura_evidence({
        "paresis_onset_seconds": 25,
        "visual_polarity": "negative_only",
    })
    assert eval_stroke["is_stroke_emergency"] is True
    assert eval_stroke["recommended_action"] == "IMMEDIATE_911_STROKE_CALL"
    assert any("SUDDEN PARESIS (<60s)" in flag for flag in eval_stroke["evidence_flags"])

    # Case B: Classic gradual fortification spectra with spreading sensory tingling (>5 min)
    eval_mwa = adapter.evaluate_stroke_vs_aura_evidence({
        "visual_spreading_gt_5min": True,
        "sensory_spreading_gt_5min": True,
        "sequential_succession_gt_1_symptom": True,
    })
    assert eval_mwa["is_stroke_emergency"] is False
    assert eval_mwa["recommended_action"] == "PROCEED_TO_MIGRAINE_RESCUE"
    assert any("CLASSIC GRADUAL MARCH" in flag for flag in eval_mwa["evidence_flags"])


def test_snoop4_safety_gate_sudden_paresis_emergency():
    """Verify SNOOP4 gate triggers emergency diversion for sudden motor paresis (<60s)."""
    state = MigraineRunState(
        minutes_since_onset=10,
        patient_age=65,
        paresis_onset_seconds=35,
    )
    is_emergency, flags = SafetyGateEngine.evaluate_snoop4_emergency(state)
    assert is_emergency is True
    assert any("SUDDEN PARESIS (<60s)" in flag for flag in flags)


def test_snoop4_safety_gate_isolated_negative_visual_loss():
    """Verify SNOOP4 gate flags isolated negative visual deficit (dark vision/scotoma)."""
    state = MigraineRunState(
        minutes_since_onset=20,
        patient_age=55,
        isolated_negative_visual_defect=True,
    )
    is_emergency, flags = SafetyGateEngine.evaluate_snoop4_emergency(state)
    assert is_emergency is True
    assert any("ISOLATED NEGATIVE VISUAL LOSS" in flag for flag in flags)


def test_snoop4_safe_migraine_with_aura():
    """Verify classic migraine with aura without stroke red flags passes SNOOP4 safely."""
    state = MigraineRunState(
        minutes_since_onset=25,
        patient_age=28,
        aura_present=True,
        current_pain_scale=6,
        sudden_onset_paresis=False,
        isolated_negative_visual_defect=False,
    )
    is_emergency, flags = SafetyGateEngine.evaluate_snoop4_emergency(state)
    assert is_emergency is False
    assert len(flags) == 0
