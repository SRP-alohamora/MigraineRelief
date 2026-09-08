"""
Unit tests for Replication Engine and Personalization Bayesian Updating.
"""

import pytest
from replication import ReplicationEngine, ReplicationStatus, ClinicalEvidenceLevel, EvidenceItem
from priors import PriorRegistry, PopulationPrior
from personalization import (
    PatientInterventionPosterior,
    InterventionRecord,
    InterventionType,
    TimingWindow,
)


def test_replication_engine():
    engine = ReplicationEngine()
    items = engine.list_evidence()
    assert len(items) >= 3

    # Check finding
    f1 = engine.get_evidence("FINDING_001_AURA_PHENOTYPE")
    assert f1 is not None
    assert f1.clinical_evidence_level == ClinicalEvidenceLevel.LEVEL_3_EXPLORATORY_POPULATION

    md = engine.generate_replication_matrix_markdown()
    assert "Cross-Dataset Scientific Replication Matrix" in md


def test_prior_registry():
    reg = PriorRegistry()
    prior = reg.get_prior("PRIOR_TRIPTAN_EARLY_2H_PAIN_FREE")
    assert prior is not None
    assert prior.mean_rate == 0.68
    assert prior.evidence_level == 2


def test_patient_bayesian_personalization():
    reg = PriorRegistry()
    pip = PatientInterventionPosterior("user_test", reg)

    # Prior with 0 trials
    post_init = pip.update_posterior(InterventionType.TRIPTAN, TimingWindow.EARLY_LE_60_MIN)
    assert post_init["patient_trials"] == 0
    assert post_init["posterior_expected_pain_freedom_rate"] == pytest.approx(0.68, rel=1e-3)

    # Log 3 failures
    for i in range(3):
        pip.log_intervention(
            InterventionRecord(
                record_id=f"fail_{i}",
                patient_id="user_test",
                timestamp_utc="2026-09-08T00:00:00Z",
                intervention_type=InterventionType.TRIPTAN,
                specific_agent="Sumatriptan 50mg",
                timing_window=TimingWindow.EARLY_LE_60_MIN,
                minutes_from_onset=20,
                baseline_pain_score=8,
                pain_free_at_2h=False,
                headache_relief_at_2h=False,
            )
        )

    post_updated = pip.update_posterior(InterventionType.TRIPTAN, TimingWindow.EARLY_LE_60_MIN)
    assert post_updated["patient_trials"] == 3
    # With 3 failures, posterior expectation drops below initial prior 0.68
    assert post_updated["posterior_expected_pain_freedom_rate"] < 0.68
    assert post_updated["patient_evidence_weight_pct"] > 0.0


def test_medication_overuse_safety_alerts():
    reg = PriorRegistry()
    pip = PatientInterventionPosterior("user_moh", reg)

    for i in range(10):
        pip.log_intervention(
            InterventionRecord(
                record_id=f"rec_{i}",
                patient_id="user_moh",
                timestamp_utc="2026-09-08T00:00:00Z",
                intervention_type=InterventionType.TRIPTAN,
                specific_agent="Zolmitriptan",
                timing_window=TimingWindow.EARLY_LE_60_MIN,
                minutes_from_onset=15,
                baseline_pain_score=6,
                pain_free_at_2h=True,
                headache_relief_at_2h=True,
            )
        )

    alerts = pip.check_safety_alerts(InterventionType.TRIPTAN)
    assert len(alerts) > 0
    assert "Medication Overuse Headache" in alerts[0]
