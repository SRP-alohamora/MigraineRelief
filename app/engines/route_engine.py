"""Gastric stasis & route-switching engine.

Enforces formulation switches when acute migraine-induced gastroparesis impairs
GI absorption (Aurora et al., Headache 2022).
"""

from typing import Optional, Tuple
from app.core.state import DeliveryRoute, MigraineRunState


class RouteSwitchingEngine:
    """Bypasses oral malabsorption when migraine-induced gastroparesis is active."""

    @staticmethod
    def select_delivery_route(state: MigraineRunState) -> Tuple[DeliveryRoute, Optional[str], Optional[str]]:
        """Determines formulation route, adjuvant prokinetic therapy, and clinical rationale.
        
        Returns:
            Tuple of (DeliveryRoute, adjuvant_antiemetic, reasoning)
        """
        # Gastric stasis triggers: presence of nausea, vomiting, or delayed onset (>90 min)
        gastric_stasis_active = state.nausea_present or state.vomiting_present or state.minutes_since_onset > 90

        if gastric_stasis_active:
            reasoning = (
                "Migraine-induced gastric stasis arrests stomach emptying. Oral tablets have a ~70% "
                "failure rate during acute nausea. Switching to non-oral delivery bypasses the GI tract."
            )
            # Route hierarchy for gastric stasis
            if state.vomiting_present:
                return (
                    DeliveryRoute.SUBCUTANEOUS,
                    "Metoclopramide 10mg Suppository / IM",
                    reasoning,
                )
            else:
                return (
                    DeliveryRoute.INTRANASAL,
                    "Ondansetron 4mg ODT",
                    reasoning,
                )

        return (
            DeliveryRoute.ORAL_TABLET,
            None,
            "GI motility normal. Oral tablet bioavailability preserved.",
        )
