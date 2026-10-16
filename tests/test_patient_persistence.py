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


def test_alexa_and_claire_account_login_and_demo_records():
    """Verify that Alexa and Claire can log in with username/password as their name, and demo data persists."""
    # 1. Alexa Rivera Login (alexa / alexa)
    res_alexa = client.post("/auth/login", json={"email": "alexa", "password": "alexa"})
    assert res_alexa.status_code == 200
    data_alexa = res_alexa.json()
    assert data_alexa["access_token"] is not None
    assert data_alexa["user"]["display_name"] == "Alexa Rivera"

    # 2. Claire Sterling Login (claire / claire)
    res_claire = client.post("/auth/login", json={"email": "claire", "password": "claire"})
    assert res_claire.status_code == 200
    data_claire = res_claire.json()
    assert data_claire["access_token"] is not None
    assert data_claire["user"]["display_name"] == "Claire Sterling"

    # 3. Persistent Demo File Verification
    alexa_file = os.path.join(os.getcwd(), "data", "patient_records", "alexa_rivera_demo_gst.json")
    claire_file = os.path.join(os.getcwd(), "data", "patient_records", "claire_sterling_demo_gst.json")
    assert os.path.exists(alexa_file), "Alexa Rivera persistent demo file must exist"
    assert os.path.exists(claire_file), "Claire Sterling persistent demo file must exist"

