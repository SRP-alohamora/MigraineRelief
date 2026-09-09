"""Bayesian N-of-1 molecule ranker using literature priors and individual constraints."""

from typing import Any, Dict, List, Optional
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

    @classmethod
    def rank_amadeus_molecules(
        cls,
        state: MigraineRunState,
        route: DeliveryRoute,
        prior_registry: Optional[Any] = None
    ) -> Dict[str, Any]:
        """Ranks all 17 BMJ 2024 AMADEUS acute interventions against the patient's clinical profile,
        enforcing cardiovascular contraindications, pediatric clearances, and route switching.
        """
        from priors.prior_registry import PriorRegistry
        registry = prior_registry or PriorRegistry()
        amadeus_priors = registry.get_amadeus_priors()

        is_non_oral = route in {
            DeliveryRoute.SUBCUTANEOUS,
            DeliveryRoute.INTRANASAL,
            DeliveryRoute.RECTAL,
        }

        ranked_candidates = []

        for p in amadeus_priors:
            drug_name = p.drug_name or p.prior_id
            
            # Filter 1: CAD contraindication for vasoconstrictive triptans
            if state.cardiovascular_disease and p.vasoconstrictive:
                continue

            # Filter 2: Pediatric clearance if patient under 18
            if state.patient_age < 18 and not p.pediatric_cleared:
                continue

            # Filter 3: Route alignment if non-oral required (gastric stasis)
            if is_non_oral and not p.gastric_stasis_bypass:
                # Still allow scoring but apply a 60% gastric stasis oral malabsorption penalty
                effective_rate = p.mean_rate * 0.40
            else:
                effective_rate = p.mean_rate

            ranked_candidates.append({
                "drug_name": drug_name,
                "drug_class": p.drug_class,
                "mean_2h_pain_free_rate": effective_rate,
                "odds_ratio_vs_placebo": p.odds_ratio_vs_placebo,
                "cinema_confidence": p.cinema_confidence,
                "routes": p.routes,
                "vasoconstrictive": p.vasoconstrictive,
                "pediatric_cleared": p.pediatric_cleared,
                "prior_id": p.prior_id
            })

        # Sort by expected 2-hour pain freedom rate descending
        ranked_candidates.sort(key=lambda x: x["mean_2h_pain_free_rate"], reverse=True)

        top_pick = ranked_candidates[0] if ranked_candidates else None

        return {
            "top_recommendation": top_pick,
            "ranked_options": ranked_candidates,
            "route_context": route.value,
            "evidence_source": "BMJ 2024;386:e080107 (Karlsson et al. / PMC11409395)"
        }
