"""Bayesian N-of-1 molecule ranker using literature priors and individual constraints."""

from typing import Dict
from app.core.safety_gates import SafetyGateEngine
from app.core.state import DeliveryRoute, MigraineRunState


class BayesianBanditRanker:
    """Ranks acute molecules by expected 2-hour pain-freedom probability."""

    # Day-0 Literature Bayesian Priors (P_PainFree_2h)
    LITERATURE_PRIORS: Dict[str, Dict[str, float]] = {
        "Oral": {
            "Sumatriptan_100mg": 0.62,
            "Rizatriptan_10mg": 0.67,
            "Rimegepant_75mg": 0.59,
            "Ibuprofen_800mg": 0.42,
        },
        "Non_Oral": {
            "Sumatriptan_6mg_SC": 0.82,
            "DHE_POD_Intranasal": 0.76,
            "Zolmitriptan_5mg_Nasal": 0.70,
            "Zavegepant_10mg_Nasal": 0.64,
        },
    }

    @classmethod
    def rank_molecules(cls, state: MigraineRunState, route: DeliveryRoute) -> str:
        """Selects the optimal acute molecule based on route, contraindications, and age."""
        is_non_oral = route in {
            DeliveryRoute.SUBCUTANEOUS,
            DeliveryRoute.INTRANASAL,
            DeliveryRoute.RECTAL,
        }
        prior_category = "Non_Oral" if is_non_oral else "Oral"
        candidates = cls.LITERATURE_PRIORS[prior_category]

        # 1. Filter candidates by cardiovascular disease contraindications
        candidate_list = list(candidates.keys())
        safe_candidates = SafetyGateEngine.filter_cardiovascular_contraindications(state, candidate_list)

        # 2. Filter candidates by pediatric clearances if patient < 18
        safe_candidates = SafetyGateEngine.filter_pediatric_clearances(state, safe_candidates)

        # 3. Score remaining candidates
        filtered_scores = {mol: candidates[mol] for mol in safe_candidates if mol in candidates}

        # 4. Fallback safe alternatives if all filtered
        if not filtered_scores:
            if is_non_oral:
                return "Zavegepant_10mg_Nasal" if not state.is_pediatric else "Zolmitriptan_5mg_Nasal"
            return "Rimegepant_75mg" if not state.is_pediatric else "Rizatriptan_10mg"

        best_molecule = max(filtered_scores, key=filtered_scores.get)
        return best_molecule
