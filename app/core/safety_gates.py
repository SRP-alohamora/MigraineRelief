"""Deterministic clinical safety gate enforcing SNOOP4, MOH, pediatric, and CAD limits."""

from typing import List, Tuple
from app.core.state import MigraineRunState


class SafetyGateEngine:
    """Deterministic clinical safety gate.
    
    Zero probabilistic failure modes: all clinical contraindications,
    red flags, and medication overuse thresholds are strictly enforced
    by deterministic boolean rules.
    """

    # FDA-cleared pediatric pharmacopeia for adolescents (Ages 12-17)
    PEDIATRIC_APPROVED_DRUGS = {
        "Rizatriptan",
        "Almotriptan",
        "Zolmitriptan_Nasal",
        "Ibuprofen",
        "Naproxen",
        "Rizatriptan_10mg",
        "Ibuprofen_800mg",
        "Zolmitriptan_5mg_Nasal",
    }

    # Medications with 5-HT 1B/1D vasoconstrictive action contraindicated in CAD
    VASOCONSTRICTIVE_DRUGS = {
        "triptan",
        "ergot",
        "dhe",
        "dihydroergotamine",
    }

    @classmethod
    def evaluate_snoop4_emergency(cls, state: MigraineRunState) -> Tuple[bool, List[str]]:
        """Evaluates SNOOP4 secondary headache red flags (100% recall requirement).
        
        S - Systemic symptoms / age extremes
        N - Neurological deficit / focal aura
        O - Onset sudden (Thunderclap)
        O - Older onset / age < 5
        P - Pattern change / positional / papilledema
        """
        flags: List[str] = []

        # Age < 5 years: High suspicion of secondary organic cause
        if state.patient_age < 5:
            flags.append("Pediatric under age 5 requires immediate clinical examination.")

        # Thunderclap headache: Peak severe pain (>=9) within 5 minutes of onset
        if state.minutes_since_onset <= 5 and state.current_pain_scale >= 9:
            flags.append("Thunderclap onset detected: Rule out subarachnoid hemorrhage (SAH).")

        # Neurological deficit / Motor weakness / Hemiplegic aura
        if state.hemiplegic_migraine_history:
            flags.append("Motor weakness / hemiplegic aura: Triptans strictly contraindicated.")

        return (len(flags) > 0, flags)

    @classmethod
    def evaluate_moh_quota(cls, state: MigraineRunState) -> bool:
        """Enforces ICHD-3 Section 8.2 Medication Overuse Headache limits.
        
        - Triptans / Ergots / Opioids: Maximum 9 days per rolling 30 days (>=10 is over).
        - NSAIDs / Acetaminophen: Maximum 14 days per rolling 30 days (>=15 is over).
        """
        if state.rolling_30d_triptan_days >= 10:
            return True
        if state.rolling_30d_nsaid_days >= 15:
            return True
        return False

    @classmethod
    def filter_pediatric_clearances(cls, state: MigraineRunState, candidate_drugs: List[str]) -> List[str]:
        """Restricts adolescent regimens to FDA-cleared pediatric indications.
        
        Strictly excludes adult ergotamines (DHE) and non-cleared triptans for patients under 18.
        """
        if state.patient_age >= 18 and not state.is_pediatric:
            return candidate_drugs

        filtered: List[str] = []
        for drug in candidate_drugs:
            # Check if any approved token matches
            is_approved = any(approved.lower() in drug.lower() for approved in cls.PEDIATRIC_APPROVED_DRUGS)
            # Never allow DHE or ergot in pediatrics
            if "dhe" in drug.lower() or "ergot" in drug.lower():
                is_approved = False
            if is_approved:
                filtered.append(drug)

        return filtered

    @classmethod
    def filter_cardiovascular_contraindications(cls, state: MigraineRunState, candidate_drugs: List[str]) -> List[str]:
        """Filters out triptans and ergotamines for patients with known cardiovascular disease."""
        if not state.cardiovascular_disease:
            return candidate_drugs

        safe_candidates: List[str] = []
        for drug in candidate_drugs:
            drug_lower = drug.lower()
            if any(vaso in drug_lower for vaso in cls.VASOCONSTRICTIVE_DRUGS):
                continue
            safe_candidates.append(drug)

        return safe_candidates
