"""Tests for patient data ingestion, GST timestamped file persistence, and Kaggle subtype classification."""

import os
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_save_patient_data_gst_persistence():
    """Verify that patient data saves as loginname_timestamp in GST format and indexes to RAG."""
    payload = {
        "login_name": "dr_sarah_connor",
        "age": 30,
        "duration": 1,
        "frequency": 5,
        "location": 1,
        "character": 1,
        "intensity": 2,
        "nausea": 1,
        "vomit": 0,
        "phonophobia": 1,
        "photophobia": 1,
        "visual": 1,
        "sensory": 2,
        "dysphasia": 0,
        "dysarthria": 0,
        "vertigo": 0,
        "tinnitus": 0,
        "hypoacusis": 0,
        "diplopia": 0,
        "defect": 0,
        "ataxia": 0,
        "conscience": 0,
        "paresthesia": 0,
        "dpf": 0,
        "average_sleep_hours": 6.0,
        "sleep_fragmentation": True,
        "stress_let_down": True,
        "barometric_sensitivity": True,
        "cutaneous_allodynia": True,
        "rolling_30d_triptan_days": 4,
        "rolling_30d_nsaid_days": 6,
        "cardiovascular_disease": False,
    }

    res = client.post("/patient/save-data", json=payload)
    assert res.status_code == 200
    data = res.json()

    assert data["status"] == "SUCCESS_SAVED_AND_ANALYZED"
    assert "dr_sarah_connor" in data["filename"]
    assert "_GST.json" in data["filename"]
    assert "GST" in data["gst_datetime"]
    assert data["predicted_type"] == "Typical aura with migraine"
    assert data["confidence_pct"] >= 90
    assert data["rag_memory_indexed"] is True

    # Verify physical file persistence
    full_path = os.path.join(os.getcwd(), "data", "patient_records", data["filename"])
    assert os.path.exists(full_path)
