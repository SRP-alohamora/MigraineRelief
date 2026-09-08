"""Unit tests for deterministic clinical safety gates (SNOOP4, MOH, CAD, Pediatric)."""

import pytest
from app.core.state import MigraineRunState, TriageStatus
from app.core.safety_gates import SafetyGateEngine


def test_snoop4_thunderclap_emergency():
    """Verify sudden onset severe headache triggers immediate SNOOP4 red flag."""
    state = MigraineRunState(
        minutes_since_onset=3,
        current_pain_scale=10,
        nausea_present=False
    )
    is_emergency, flags = SafetyGateEngine.evaluate_snoop4_emergency(state)
    assert is_emergency is True
    assert len(flags) > 0
    assert any("Thunderclap onset detected" in f for f in flags)


def test_snoop4_pediatric_under_5():
    """Verify patient under age 5 triggers immediate pediatric clinical examination flag."""
    state = MigraineRunState(
        patient_age=4,  # Under 5
        minutes_since_onset=30,
        current_pain_scale=6,
    )
    is_emergency, flags = SafetyGateEngine.evaluate_snoop4_emergency(state)
    assert is_emergency is True
    assert any("under age 5" in f for f in flags)


def test_snoop4_hemiplegic_migraine():
    """Verify hemiplegic migraine triggers red flag to prevent triptan vasoconstriction."""
    state = MigraineRunState(
        minutes_since_onset=45,
        current_pain_scale=7,
        hemiplegic_migraine_history=True,
    )
    is_emergency, flags = SafetyGateEngine.evaluate_snoop4_emergency(state)
    assert is_emergency is True
    assert any("hemiplegic aura" in f for f in flags)


def test_snoop4_safe_typical_migraine():
    """Verify a typical migraine without red flags passes triage safely."""
    state = MigraineRunState(
        minutes_since_onset=45,
        current_pain_scale=7,
        patient_age=32,
        hemiplegic_migraine_history=False,
    )
    is_emergency, flags = SafetyGateEngine.evaluate_snoop4_emergency(state)
    assert is_emergency is False
    assert len(flags) == 0


def test_moh_quota_triptans_limit():
    """Verify ICHD-3 limit: >=10 triptan days in rolling 30 days triggers MOH warning."""
    # Under limit
    state_under = MigraineRunState(
        minutes_since_onset=30,
        rolling_30d_triptan_days=9,
        rolling_30d_nsaid_days=5,
    )
    assert SafetyGateEngine.evaluate_moh_quota(state_under) is False

    # Over limit
    state_over = MigraineRunState(
        minutes_since_onset=30,
        rolling_30d_triptan_days=10,
        rolling_30d_nsaid_days=5,
    )
    assert SafetyGateEngine.evaluate_moh_quota(state_over) is True


def test_moh_quota_nsaids_limit():
    """Verify ICHD-3 limit: >=15 NSAID days in rolling 30 days triggers MOH warning."""
    state_under = MigraineRunState(
        minutes_since_onset=30,
        rolling_30d_triptan_days=4,
        rolling_30d_nsaid_days=14,
    )
    assert SafetyGateEngine.evaluate_moh_quota(state_under) is False

    state_over = MigraineRunState(
        minutes_since_onset=30,
        rolling_30d_triptan_days=4,
        rolling_30d_nsaid_days=15,
    )
    assert SafetyGateEngine.evaluate_moh_quota(state_over) is True


def test_pediatric_clearance_filtering():
    """Verify adolescent patients (e.g. Alexa, 15yo) are restricted to FDA approved regimens."""
    state_adolescent = MigraineRunState(
        patient_age=15,
        is_pediatric=True,
        minutes_since_onset=30,
    )
    candidate_drugs = [
        "Sumatriptan_100mg",
        "Rizatriptan_10mg",
        "DHE_POD_Intranasal",
        "Ibuprofen_800mg",
        "Zolmitriptan_5mg_Nasal",
    ]
    filtered = SafetyGateEngine.filter_pediatric_clearances(state_adolescent, candidate_drugs)
    
    # DHE and non-pediatric approved adult formulations must be excluded
    assert "DHE_POD_Intranasal" not in filtered
    assert "Rizatriptan_10mg" in filtered
    assert "Ibuprofen_800mg" in filtered
    assert "Zolmitriptan_5mg_Nasal" in filtered


def test_cardiovascular_contraindication_filtering():
    """Verify cardiovascular disease eliminates vasoconstrictive triptans and ergots."""
    state_cad = MigraineRunState(
        patient_age=55,
        cardiovascular_disease=True,
        minutes_since_onset=30,
    )
    candidate_drugs = [
        "Sumatriptan_100mg",
        "Rizatriptan_10mg",
        "DHE_POD_Intranasal",
        "Rimegepant_75mg",
        "Ibuprofen_800mg",
    ]
    safe = SafetyGateEngine.filter_cardiovascular_contraindications(state_cad, candidate_drugs)
    assert "Sumatriptan_100mg" not in safe
    assert "Rizatriptan_10mg" not in safe
    assert "DHE_POD_Intranasal" not in safe
    assert "Rimegepant_75mg" in safe
    assert "Ibuprofen_800mg" in safe
