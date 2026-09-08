"""Unit tests for skills (DDI, dosage limits, PubMed) and telemetry tracing."""

import pytest
from app.skills.ddi_validator import DDIValidator
from app.skills.dosage_checker import DosageChecker
from app.skills.pubmed_validator import PubMedValidator
from app.telemetry.tracer import ExecutionTracer
from app.telemetry.metrics import RescueMetrics


def test_ddi_washout_violation():
    """Verify 24-hour washout rule between triptans/ergots."""
    is_safe, issues = DDIValidator.evaluate_ddi(
        candidate_molecule="Sumatriptan_100mg",
        active_medications=[],
        hours_since_last_triptan_or_ergot=12,
    )
    assert is_safe is False
    assert any("24-Hour Washout" in issue for issue in issues)


def test_ddi_propranolol_rizatriptan_interaction():
    """Verify Propranolol + Rizatriptan dose reduction advice."""
    is_safe, issues = DDIValidator.evaluate_ddi(
        candidate_molecule="Rizatriptan_10mg",
        active_medications=["Propranolol 40mg"],
        hours_since_last_triptan_or_ergot=48,
    )
    assert is_safe is True  # Permitted with dose adjustment
    assert any("Propranolol" in issue and "5mg" in issue for issue in issues)


def test_ddi_maoi_contraindication():
    """Verify MAO inhibitors strictly contraindicate triptans."""
    is_safe, issues = DDIValidator.evaluate_ddi(
        candidate_molecule="Sumatriptan_100mg",
        active_medications=["Phenelzine (MAOI)"],
        hours_since_last_triptan_or_ergot=48,
    )
    assert is_safe is False
    assert any("MAO inhibitors" in issue for issue in issues)


def test_dosage_checker_redose_validation():
    """Verify minimum redose interval and 24h maximum dosage limits."""
    # Too soon
    safe_interval, msg = DosageChecker.validate_redose(
        "Sumatriptan_100mg", hours_since_prior_dose=1.0, accumulated_24h_mg=100.0
    )
    assert safe_interval is False
    assert "Minimum re-dose interval violation" in msg

    # Exceeding 24h max
    safe_max, msg = DosageChecker.validate_redose(
        "Sumatriptan_100mg", hours_since_prior_dose=3.0, accumulated_24h_mg=200.0
    )
    assert safe_max is False
    assert "24-Hour maximum dose exceeded" in msg

    # Valid redose
    valid, msg = DosageChecker.validate_redose(
        "Sumatriptan_100mg", hours_since_prior_dose=3.0, accumulated_24h_mg=100.0
    )
    assert valid is True
    assert msg is None


def test_pubmed_evidence_retrieval():
    """Verify canonical PubMed citation retrieval and validation."""
    evidence = PubMedValidator.get_evidence_by_key("burstein_allodynia_2004")
    assert evidence is not None
    assert evidence["pmid"] == "15159473"
    assert "cutaneous allodynia" in evidence["title"].lower()

    assert PubMedValidator.validate_citation("15159473") is True
    assert PubMedValidator.validate_citation("999999999") is False


def test_execution_tracer_and_metrics():
    """Verify ExecutionTracer records steps and export trajectory."""
    tracer = ExecutionTracer(run_id="test-run-456")
    tracer.record_step("Intake", details={"input": "test"})
    tracer.record_step("Triage", status="SUCCESS")

    trajectory = tracer.export_trajectory()
    assert len(trajectory) == 2
    assert trajectory[0]["step"] == "Intake"
    assert tracer.get_total_latency_ms() > 0

    RescueMetrics.reset()
    RescueMetrics.record_request(4.5, is_emergency=False, route_switched=True)
    RescueMetrics.record_request(2.1, is_emergency=True, route_switched=False)
    summary = RescueMetrics.get_summary()
    assert summary["total_requests"] == 2
    assert summary["emergency_diverts"] == 1
    assert summary["route_switches"] == 1
