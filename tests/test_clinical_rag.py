"""
Automated pytest suite for LangGraph Clinical RAG pipeline.
"""
import pytest
from app.rag.clinical_rag_graph import (
    ClinicalRAGState,
    build_migraine_rag_graph,
    RETRIEVER,
)


def test_retriever_initialization():
    """Verify hybrid retriever initializes with BMJ 2024 corpus, devices, and 400 cases."""
    assert len(RETRIEVER.pharma_docs) >= 17  # 17 BMJ drugs + FDA devices
    assert len(RETRIEVER.case_docs) == 400
    assert RETRIEVER.pharma_bm25 is not None
    assert RETRIEVER.cases_bm25 is not None


def test_snoop4_emergency_refusal():
    """Verify refusal-first gate triggers immediately on thunderclap headache."""
    app = build_migraine_rag_graph()
    state = ClinicalRAGState(user_query="Sudden thunderclap worst headache of my life within seconds.")
    res = app.invoke(state)
    
    assert res["snoop4_emergency_detected"] is True
    assert res["refusal_triggered"] is True
    assert "REFUSAL & DIVERSION" in res["rescue_protocol_card"]
    assert res["faithfulness_score"] == 1.0
    assert res["relevance_score"] == 1.0


def test_acute_rescue_route_switching_and_faithfulness():
    """Verify acute attack with vomiting switches route to non-oral and maintains >98% faithfulness."""
    app = build_migraine_rag_graph()
    state = ClinicalRAGState(
        user_query="Severe acute migraine started 20 minutes ago with intense nausea and active vomiting.",
        patient_id="claire_sterling",
        vomiting_present=True,
        minutes_since_onset=20,
    )
    res = app.invoke(state)
    
    assert res["snoop4_emergency_detected"] is False
    assert res["refusal_triggered"] is False
    assert res["recommended_route"] in ["SUBCUTANEOUS_AUTO_INJECTOR", "INTRANASAL_SPRAY", "NEUROMODULATION"]
    assert res["recommended_molecule"] is not None
    assert res["faithfulness_score"] >= 0.98
    assert res["relevance_score"] >= 0.92
    assert "OPTIMAL RESCUE WINDOW" in res["timing_guidance"]


def test_cardiovascular_contraindication_filter():
    """Verify CAD history filters out vasoconstrictive triptans in favor of non-vasoconstrictive options."""
    app = build_migraine_rag_graph()
    state = ClinicalRAGState(
        user_query="Severe migraine attack in patient with coronary artery disease and prior heart attack.",
        patient_id="cad_patient",
        cardiovascular_disease_cad=True,
    )
    res = app.invoke(state)
    
    assert res["snoop4_emergency_detected"] is False
    assert res["faithfulness_score"] >= 0.98
    assert res["relevance_score"] >= 0.92
    # Recommended option must NOT be a vasoconstrictive oral triptan
    card = res["rescue_protocol_card"]
    assert "Non-vasoconstrictive" in card or "safe in cardiovascular disease" in card.lower()
