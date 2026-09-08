"""Unit tests for acute rescue optimization engines: route switching, timing, and bandit ranking."""

import pytest
from app.core.state import MigraineRunState, DeliveryRoute
from app.engines.timing_engine import TimingEngine
from app.engines.route_engine import RouteSwitchingEngine
from app.engines.bandit_ranker import BayesianBanditRanker


def test_timing_engine_decay():
    """Verify pre-allodynic window decays correctly until 60 minutes."""
    state_early = MigraineRunState(minutes_since_onset=15)
    assert TimingEngine.calculate_urgency_window(state_early) == 45
    assert TimingEngine.predict_allodynia_lockin(state_early) is False

    state_late = MigraineRunState(minutes_since_onset=75)
    assert TimingEngine.calculate_urgency_window(state_late) == 0
    assert TimingEngine.predict_allodynia_lockin(state_late) is False  # 75 < 90, no flag

    state_allodynic = MigraineRunState(minutes_since_onset=30, cutaneous_allodynia_flag=True)
    assert TimingEngine.calculate_urgency_window(state_allodynic) == 0
    assert TimingEngine.predict_allodynia_lockin(state_allodynic) is True

    state_locked_in = MigraineRunState(minutes_since_onset=95)
    assert TimingEngine.predict_allodynia_lockin(state_locked_in) is True


def test_route_switching_normal_motility():
    """Verify oral tablet route is preserved when no nausea or vomiting is present."""
    state = MigraineRunState(
        minutes_since_onset=20,
        nausea_present=False,
        vomiting_present=False,
    )
    route, adjuvant, reasoning = RouteSwitchingEngine.select_delivery_route(state)
    assert route == DeliveryRoute.ORAL_TABLET
    assert adjuvant is None
    assert "bioavailability preserved" in reasoning.lower()


def test_route_switching_nausea_gastric_stasis():
    """Verify nausea triggers non-oral intranasal switch and adjuvant antiemetic."""
    state = MigraineRunState(
        minutes_since_onset=40,
        nausea_present=True,
        vomiting_present=False,
    )
    route, adjuvant, reasoning = RouteSwitchingEngine.select_delivery_route(state)
    assert route == DeliveryRoute.INTRANASAL
    assert "Ondansetron" in adjuvant
    assert "gastric stasis" in reasoning.lower()


def test_route_switching_vomiting_gastric_stasis():
    """Verify vomiting triggers subcutaneous auto-injector switch and prokinetic suppository/IM."""
    state = MigraineRunState(
        minutes_since_onset=50,
        nausea_present=True,
        vomiting_present=True,
    )
    route, adjuvant, reasoning = RouteSwitchingEngine.select_delivery_route(state)
    assert route == DeliveryRoute.SUBCUTANEOUS
    assert "Metoclopramide" in adjuvant
    assert "gastric stasis" in reasoning.lower()


def test_bandit_ranking_adult_oral():
    """Verify adult patient with normal motility receives top-ranked oral candidate (Rizatriptan)."""
    state = MigraineRunState(
        patient_age=35,
        minutes_since_onset=20,
    )
    mol = BayesianBanditRanker.rank_molecules(state, DeliveryRoute.ORAL_TABLET)
    assert mol == "Rizatriptan_10mg"


def test_bandit_ranking_adult_non_oral():
    """Verify adult non-oral route selects top non-oral candidate (Sumatriptan SC)."""
    state = MigraineRunState(
        patient_age=45,
        minutes_since_onset=45,
    )
    mol = BayesianBanditRanker.rank_molecules(state, DeliveryRoute.SUBCUTANEOUS)
    assert mol == "Sumatriptan_6mg_SC"


def test_bandit_ranking_claire_refractory_non_oral():
    """Verify Claire (45yo, non-oral intranasal) selects optimal nasal candidate."""
    state = MigraineRunState(
        patient_age=45,
        minutes_since_onset=75,
        nausea_present=True,
    )
    mol = BayesianBanditRanker.rank_molecules(state, DeliveryRoute.INTRANASAL)
    assert "DHE" in mol or "Sumatriptan" in mol or "Zolmitriptan" in mol


def test_bandit_ranking_alexa_pediatric_adolescent():
    """Verify Alexa (15yo female) never receives DHE and gets pediatric approved drug."""
    state = MigraineRunState(
        patient_age=15,
        is_pediatric=True,
        minutes_since_onset=30,
    )
    # Non-oral
    mol_non_oral = BayesianBanditRanker.rank_molecules(state, DeliveryRoute.INTRANASAL)
    assert "DHE" not in mol_non_oral
    assert mol_non_oral == "Zolmitriptan_5mg_Nasal"

    # Oral
    mol_oral = BayesianBanditRanker.rank_molecules(state, DeliveryRoute.ORAL_TABLET)
    assert mol_oral == "Rizatriptan_10mg"


def test_bandit_ranking_cad_contraindication():
    """Verify patient with cardiovascular disease receives non-triptan / non-ergotamine CGRP antagonist."""
    state = MigraineRunState(
        patient_age=58,
        cardiovascular_disease=True,
        minutes_since_onset=30,
    )
    # Oral
    mol_oral = BayesianBanditRanker.rank_molecules(state, DeliveryRoute.ORAL_TABLET)
    assert mol_oral == "Rimegepant_75mg"

    # Non-oral
    mol_non_oral = BayesianBanditRanker.rank_molecules(state, DeliveryRoute.INTRANASAL)
    assert mol_non_oral == "Zavegepant_10mg_Nasal"
