"""End-to-end multi-agent StateGraph execution tests and clinical assertions."""

import pytest
from app.core.graph import MigraineStateGraphRunner
from app.core.state import DeliveryRoute, MigraineRunState, TriageStatus


@pytest.fixture
def runner():
    return MigraineStateGraphRunner()


def test_snoop4_thunderclap_emergency_triage(runner):
    """Verify sudden onset severe headache immediately diverts to 911/ER."""
    state = MigraineRunState(
        minutes_since_onset=3,
        current_pain_scale=10,
        nausea_present=False,
    )
    result = runner.run(state)
    assert result.triage_status == TriageStatus.RED_FLAG_EMERGENCY
    assert "Thunderclap onset detected" in result.snoop4_red_flags[0]
    assert result.recommended_molecule is None
    assert result.execution_latency_ms < 50.0


def test_claire_gastric_stasis_route_switch(runner):
    """Verify Persona 2 (Claire - 45yo female) with nausea is switched to non-oral delivery."""
    state = MigraineRunState(
        patient_age=45,
        minutes_since_onset=75,
        nausea_present=True,
        vomiting_present=False,
    )
    result = runner.run(state)
    assert result.recommended_route == DeliveryRoute.INTRANASAL
    assert "gastric stasis" in result.route_switch_reasoning.lower()
    assert "viking://knowledge/migraine/delivery_routes/oral_transmucosal/" in result.viking_pruned_paths
    assert result.assertions_passed is True
    assert result.execution_latency_ms < 50.0


def test_alexa_pediatric_safety_restriction(runner):
    """Verify Persona 1 (Alexa - 15yo female) never receives unapproved adult ergotamines."""
    state = MigraineRunState(
        patient_age=15,
        minutes_since_onset=30,
        nausea_present=False,
    )
    result = runner.run(state)
    assert result.is_pediatric is True
    assert "DHE" not in (result.recommended_molecule or "")
    assert result.recommended_molecule in ["Rizatriptan_10mg", "Ibuprofen_800mg", "Zolmitriptan_5mg_Nasal"]
    assert result.assertions_passed is True
    assert result.execution_latency_ms < 50.0


def test_sub_50ms_latency_budget(runner):
    """Verify deterministic execution completes well within the 50ms SLA."""
    state = MigraineRunState(
        minutes_since_onset=25,
        nausea_present=True,
    )
    result = runner.run(state)
    assert result.execution_latency_ms < 50.0
    assert len(result.cot_trajectory) >= 5


def test_cad_patient_cgrp_selection(runner):
    """Verify cardiovascular patient receives CGRP antagonist without vasoconstriction."""
    state = MigraineRunState(
        patient_age=60,
        cardiovascular_disease=True,
        minutes_since_onset=30,
        nausea_present=False,
    )
    result = runner.run(state)
    assert result.recommended_molecule == "Rimegepant_75mg"
    assert "triptan" not in result.recommended_molecule.lower()
    assert result.assertions_passed is True


def test_moh_ledger_alert_in_graph(runner):
    """Verify MOH alert is recorded when rolling 30d triptan threshold is exceeded."""
    state = MigraineRunState(
        patient_age=35,
        minutes_since_onset=30,
        rolling_30d_triptan_days=11,
    )
    result = runner.run(state)
    assert result.moh_limit_exceeded is True
    assert any("MOH_Quota" in str(step.get("gate", "")) for step in result.cot_trajectory)
