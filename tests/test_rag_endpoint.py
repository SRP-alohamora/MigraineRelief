"""Tests for Track 2 LangGraph RAG endpoints, demo personas, and anonymous sessions."""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_rag_triage_claire_gastric_stasis_route_switch():
    """Verify that acute attack with nausea & vomiting switches to non-oral route and cites BMJ 2024."""
    payload = {
        "user_query": "Severe migraine attack with vomiting and intense nausea starting 25m ago.",
        "patient_id": "claire",
        "patient_age": 45,
        "minutes_since_onset": 25,
        "pain_intensity": 3,
        "nausea_present": True,
        "vomiting_present": True,
        "cardiovascular_disease_cad": False,
        "rolling_30d_triptan_days": 8,
    }
    res = client.post("/rag/triage", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["snoop4_emergency_detected"] is False
    assert data["recommended_route"] != "ORAL_TABLET"
    assert data["faithfulness_score"] >= 0.98
    assert data["relevance_score"] >= 0.90
    assert data["execution_latency_ms"] < 2500.0  # Well within 2.5s SLA
    assert data["moh_warning"] is True
    assert data["pre_allodynic_window_remaining_minutes"] == 35


def test_rag_triage_alexa_pediatric_filter():
    """Verify that 15yo patient triggers FDA pediatric clearance filter."""
    payload = {
        "user_query": "Throbbing headache with zigzag visual aura in school nurse office.",
        "patient_id": "alexa",
        "patient_age": 15,
        "minutes_since_onset": 20,
        "pain_intensity": 2,
        "nausea_present": True,
        "vomiting_present": False,
        "rolling_30d_triptan_days": 4,
    }
    res = client.post("/rag/triage", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["snoop4_emergency_detected"] is False
    assert data["pre_allodynic_window_remaining_minutes"] == 40
    # Must retrieve Rizatriptan 5mg ODT or Nerivio
    rec = (data["recommended_molecule"] or "").lower()
    assert "rizatriptan" in rec or "nerivio" in rec


def test_rag_triage_snoop4_thunderclap_refusal():
    """Verify that thunderclap onset triggers immediate SNOOP4 emergency refusal and 911 alert."""
    payload = {
        "user_query": "Instant 10/10 thunderclap headache reached peak in 10 seconds with stiff neck.",
        "patient_id": "emergency_patient",
        "patient_age": 40,
        "minutes_since_onset": 5,
        "pain_intensity": 3,
    }
    res = client.post("/rag/triage", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["snoop4_emergency_detected"] is True
    assert data["refusal_triggered"] is True
    assert "SNOOP4" in (data["emergency_reason"] or "")


def test_rag_triage_dehydration_status_migrainosus_screener():
    """Verify that severe pain (3) lasting >4h (240m) with vomiting triggers dehydration warning screener."""
    payload = {
        "user_query": "Severe headache for 4+ hours with violent vomiting and dry heaving.",
        "patient_id": "anonymous",
        "patient_age": 32,
        "minutes_since_onset": 240,
        "pain_intensity": 3,
        "nausea_present": True,
        "vomiting_present": True,
    }
    res = client.post("/rag/triage", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["snoop4_emergency_detected"] is True
    assert data["refusal_triggered"] is True
    assert "Dehydration" in (data["emergency_reason"] or "")



def test_rag_demo_profile_loader():
    """Verify that both Alexa Rivera and Claire Sterling demo profiles load persistently."""
    res_alexa = client.get("/rag/demo-profile/alexa")
    assert res_alexa.status_code == 200
    alexa_data = res_alexa.json()
    assert alexa_data["metadata"]["customer_login"] == "alexa"
    assert "step_by_step_rescue_flow" in alexa_data

    res_claire = client.get("/rag/demo-profile/claire")
    assert res_claire.status_code == 200
    claire_data = res_claire.json()
    assert claire_data["metadata"]["customer_login"] == "claire"
    assert "step_by_step_rescue_flow" in claire_data


def test_rag_anonymous_session():
    """Verify that ephemeral zero-PII anonymous session token is generated."""
    res = client.post("/rag/anonymous-session")
    assert res.status_code == 200
    data = res.json()
    assert "session_id" in data
    assert data["token_type"] == "ephemeral_guest"
    assert "Zero-PII" in data["privacy"]
