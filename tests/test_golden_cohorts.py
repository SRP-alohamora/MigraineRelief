"""Parameterized evaluation tests against awesome-harness golden cohorts."""

import pytest
from app.core.graph import MigraineStateGraphRunner
from app.core.state import MigraineRunState, TriageStatus
from tests.conftest import load_cohort


@pytest.fixture
def runner():
    return MigraineStateGraphRunner()


def test_cohort_alexa_pediatric_evaluation(runner):
    """Evaluate Persona 1 (Alexa Rivera, 15yo female) golden cohort."""
    cohort = load_cohort("cohort_alexa_pediatric.json")
    state = MigraineRunState(**cohort["input_state"])
    result = runner.run(state)

    exp = cohort["expected_assertions"]
    assert result.is_pediatric == exp["is_pediatric"]
    assert result.triage_status.value == exp["triage_status"]
    assert result.recommended_route.value == exp["recommended_route"]
    assert result.recommended_molecule in exp["recommended_molecule_in"]
    for prohibited in exp["prohibited_molecules"]:
        assert prohibited != result.recommended_molecule
    assert result.moh_limit_exceeded == exp["moh_limit_exceeded"]


def test_cohort_claire_refractory_evaluation(runner):
    """Evaluate Persona 2 (Claire Sterling, 45yo female) golden cohort."""
    cohort = load_cohort("cohort_claire_refractory.json")
    state = MigraineRunState(**cohort["input_state"])
    result = runner.run(state)

    exp = cohort["expected_assertions"]
    assert result.is_pediatric == exp["is_pediatric"]
    assert result.triage_status.value == exp["triage_status"]
    assert result.recommended_route.value == exp["recommended_route"]
    assert exp["route_switch_reasoning_contains"] in result.route_switch_reasoning.lower()
    assert exp["adjuvant_antiemetic_contains"] in result.adjuvant_antiemetic
    assert exp["viking_pruned_paths_contains"] in result.viking_pruned_paths


def test_cohort_cad_contraindicated_evaluation(runner):
    """Evaluate CAD contraindicated patient golden cohort."""
    cohort = load_cohort("cohort_cad_contraindicated.json")
    state = MigraineRunState(**cohort["input_state"])
    result = runner.run(state)

    exp = cohort["expected_assertions"]
    assert result.cardiovascular_disease is True
    assert result.recommended_molecule == exp["recommended_molecule"]
    for prohibited_class in exp["prohibited_classes"]:
        assert prohibited_class not in result.recommended_molecule.lower()
    assert result.assertions_passed is True


def test_cohort_moh_imminent_evaluation(runner):
    """Evaluate impending Medication Overuse Headache golden cohort."""
    cohort = load_cohort("cohort_moh_imminent.json")
    state = MigraineRunState(**cohort["input_state"])
    result = runner.run(state)

    exp = cohort["expected_assertions"]
    assert result.moh_limit_exceeded == exp["moh_limit_exceeded"]
    assert result.triage_status.value == exp["triage_status"]


def test_cohort_snoop4_emergency_evaluation(runner):
    """Evaluate Thunderclap SNOOP4 emergency golden cohort."""
    cohort = load_cohort("cohort_snoop4_emergency.json")
    state = MigraineRunState(**cohort["input_state"])
    result = runner.run(state)

    exp = cohort["expected_assertions"]
    assert result.triage_status.value == exp["triage_status"]
    assert exp["emergency_divert_message_contains"] in result.emergency_divert_message
    assert result.recommended_molecule is None
