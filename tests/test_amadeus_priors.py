"""Unit tests for BMJ 2024 AMADEUS Network Meta-Analysis acute migraine pharmacotherapy priors."""

import pytest
from app.core.state import MigraineRunState, DeliveryRoute
from app.engines.bandit_ranker import BayesianBanditRanker
from priors.prior_registry import PriorRegistry


def test_amadeus_priors_registration():
    """Verify all 17 AMADEUS acute migraine medications are registered with published properties."""
    registry = PriorRegistry()
    amadeus_priors = registry.get_amadeus_priors()
    assert len(amadeus_priors) == 17

    # 1. Eletriptan (Top overall 2h pain freedom)
    eletriptan = registry.get_prior_for_drug("Eletriptan")
    assert eletriptan is not None
    assert eletriptan.odds_ratio_vs_placebo == 5.19
    assert eletriptan.mean_rate == 0.38
    assert eletriptan.vasoconstrictive is True
    assert eletriptan.cinema_confidence == "HIGH"

    # 2. Rizatriptan (Adolescent cleared, top triptan)
    rizatriptan = registry.get_prior_for_drug("Rizatriptan")
    assert rizatriptan is not None
    assert rizatriptan.odds_ratio_vs_placebo == 3.65
    assert rizatriptan.pediatric_cleared is True

    # 3. Gepants (Rimegepant, Ubrogepant: non-vasoconstrictive, safe in CAD)
    rimegepant = registry.get_prior_for_drug("Rimegepant")
    assert rimegepant is not None
    assert rimegepant.vasoconstrictive is False
    assert rimegepant.drug_class == "Gepant (CGRP receptor antagonist)"

    ubrogepant = registry.get_prior_for_drug("Ubrogepant")
    assert ubrogepant is not None
    assert ubrogepant.vasoconstrictive is False

    # 4. Ditans (Lasmiditan: non-vasoconstrictive)
    lasmiditan = registry.get_prior_for_drug("Lasmiditan")
    assert lasmiditan is not None
    assert lasmiditan.vasoconstrictive is False

    # 5. NSAID (Ibuprofen: pediatric cleared, high sustained 24h relief)
    ibuprofen = registry.get_prior_for_drug("Ibuprofen")
    assert ibuprofen is not None
    assert ibuprofen.pediatric_cleared is True
    assert ibuprofen.vasoconstrictive is False


def test_amadeus_ranking_adult_oral_unrestricted():
    """Verify healthy adult without CAD receives Eletriptan as top-ranked oral candidate."""
    state = MigraineRunState(
        patient_age=32,
        minutes_since_onset=20,
        cardiovascular_disease=False,
    )
    result = BayesianBanditRanker.rank_amadeus_molecules(state, DeliveryRoute.ORAL_TABLET)
    top_drug = result["top_recommendation"]
    assert top_drug is not None
    assert top_drug["drug_name"] == "Eletriptan"
    assert top_drug["odds_ratio_vs_placebo"] == 5.19


def test_amadeus_ranking_cardiovascular_contraindication_filter():
    """Verify patient with CAD filters out all vasoconstrictive triptans and elevates Lasmiditan/Gepants."""
    state = MigraineRunState(
        patient_age=58,
        minutes_since_onset=30,
        cardiovascular_disease=True,
    )
    result = BayesianBanditRanker.rank_amadeus_molecules(state, DeliveryRoute.ORAL_TABLET)
    top_drug = result["top_recommendation"]
    assert top_drug is not None
    # Must NOT be a vasoconstrictive triptan
    assert top_drug["vasoconstrictive"] is False
    # Top non-vasoconstrictive options include Lasmiditan (0.28) and Diclofenac (0.24) and Rimegepant (0.21)
    assert top_drug["drug_name"] in ["Lasmiditan", "Diclofenac Potassium", "Rimegepant"]

    # Verify no triptans remain in safe ranked options
    for candidate in result["ranked_options"]:
        assert candidate["vasoconstrictive"] is False


def test_amadeus_ranking_pediatric_adolescent_filter():
    """Verify adolescent (age 15) filters out non-pediatric cleared drugs and elevates Rizatriptan."""
    state = MigraineRunState(
        patient_age=15,
        is_pediatric=True,
        minutes_since_onset=25,
    )
    result = BayesianBanditRanker.rank_amadeus_molecules(state, DeliveryRoute.ORAL_TABLET)
    top_drug = result["top_recommendation"]
    assert top_drug is not None
    assert top_drug["pediatric_cleared"] is True
    assert top_drug["drug_name"] == "Rizatriptan"

    # All options must be pediatric cleared
    for candidate in result["ranked_options"]:
        assert candidate["pediatric_cleared"] is True
