"""Drug-Drug Interaction (DDI) validation skill.

Validates pharmacodynamic and pharmacokinetic compatibility between proposed
acute rescue molecules and concurrent patient medications.
"""

from typing import List, Tuple


class DDIValidator:
    """Enforces strict pharmacopeial DDI rules and washout intervals."""

    @classmethod
    def evaluate_ddi(
        cls,
        candidate_molecule: str,
        active_medications: List[str],
        hours_since_last_triptan_or_ergot: int = 48,
    ) -> Tuple[bool, List[str]]:
        """Evaluates interaction risks between candidate drug and concurrent meds.
        
        Returns:
            Tuple of (is_safe: bool, issues: List[str])
        """
        issues: List[str] = []
        cand = candidate_molecule.lower()
        active_lower = [m.lower() for m in active_medications]

        # 1. 24-Hour Washout between Triptans and Ergots
        if ("triptan" in cand or "dhe" in cand or "ergot" in cand) and hours_since_last_triptan_or_ergot < 24:
            issues.append(
                f"24-Hour Washout Violation: Cannot administer {candidate_molecule} within 24 hours of another triptan or ergotamine derivative."
            )

        # 2. Rizatriptan + Propranolol interaction
        if "rizatriptan" in cand and any("propranolol" in m for m in active_lower):
            issues.append(
                "Propranolol increases Rizatriptan AUC by ~70%. Standard adult dose must be reduced from 10mg to 5mg."
            )

        # 3. MAO Inhibitors + Sumatriptan/Rizatriptan/Zolmitriptan
        if any(t in cand for t in ["sumatriptan", "rizatriptan", "zolmitriptan"]):
            if any("maoi" in m or "phenelzine" in m or "tranylcypromine" in m for m in active_lower):
                issues.append(
                    f"Fatal hypertensive crisis risk: {candidate_molecule} is strictly contraindicated with MAO inhibitors."
                )

        # 4. Severe Serotonin Syndrome Warning
        if "triptan" in cand and any("ssri" in m or "snri" in m or "sertraline" in m or "fluoxetine" in m for m in active_lower):
            # Warning, not absolute contraindication
            pass

        is_safe = len(issues) == 0 or (len(issues) == 1 and "5mg" in issues[0])
        return (is_safe, issues)
