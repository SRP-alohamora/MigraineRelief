"""HTTP Integration tests for FastAPI endpoints and latency SLA checks."""

import time
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check_endpoint():
    """Verify health check returns 200 HEALTHY."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert data["safety_gates"] == "ACTIVE"


def test_root_status_endpoint():
    """Verify root status endpoint returns service metadata."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["service"] == "MigraineRelief AI"


def test_evaluate_rescue_endpoint_latency():
    """Verify /rescue/evaluate endpoint executes well within the 50ms SLA."""
    payload = {
        "minutes_since_onset": 25,
        "nausea_present": True,
        "vomiting_present": False,
        "cutaneous_allodynia_flag": False,
        "current_pain_scale": 7,
        "patient_age": 35,
        "cardiovascular_disease": False,
        "rolling_30d_triptan_days": 2,
        "rolling_30d_nsaid_days": 4,
    }

    t0 = time.perf_counter()
    response = client.post("/rescue/evaluate", json=payload)
    elapsed_ms = (time.perf_counter() - t0) * 1000.0

    assert response.status_code == 200
    data = response.json()
    assert data["recommended_route"] == "INTRANASAL_SPRAY"
    assert data["execution_latency_ms"] < 50.0
    # Full HTTP roundtrip in local test client should also be fast (<100ms)
    assert elapsed_ms < 100.0


def test_evaluate_rescue_thunderclap_emergency():
    """Verify /rescue/evaluate identifies sudden severe onset as SNOOP4 emergency."""
    payload = {
        "minutes_since_onset": 2,
        "nausea_present": False,
        "vomiting_present": False,
        "cutaneous_allodynia_flag": False,
        "current_pain_scale": 10,
        "patient_age": 28,
    }
    response = client.post("/rescue/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["triage_status"] == "EMERGENCY_SNOOP4_DETECTED"
    assert "Thunderclap" in data["snoop4_red_flags"][0]


def test_sandbox_upload_endpoint():
    """Verify /api/v1/sandbox/upload parses uploaded health export."""
    mock_health_json = '{"average_sleep_hours": 5.8, "fragmentation_index": 0.45, "monthly_headache_days": 7}'
    files = {"file": ("apple_health_export.json", mock_health_json.encode("utf-8"), "application/json")}

    response = client.post("/api/v1/sandbox/upload", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["estimated_sleep_average_hours"] == 5.8
    assert len(data["key_findings"]) == 3
    assert any("Level 1" in f["tier"] for f in data["key_findings"])
    assert any("Level 2" in f["tier"] for f in data["key_findings"])
    assert any("Level 3" in f["tier"] for f in data["key_findings"])


def test_outcome_report_endpoint():
    """Verify /api/v1/outcome/report records post-treatment feedback."""
    payload = {
        "run_id": "test-run-123",
        "hours_post_treatment": 2,
        "current_pain_scale": 0,
        "pain_free": True,
        "headache_recurrence": False,
        "adverse_events": [],
    }
    response = client.post("/api/v1/outcome/report", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "RECORDED"
    assert data["run_id"] == "test-run-123"


def test_metrics_endpoint():
    """Verify /metrics returns aggregated telemetry."""
    response = client.get("/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "total_requests" in data
    assert "average_latency_ms" in data
