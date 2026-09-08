"""Pharmacopeial dosage limits and re-dosing interval checker."""

from typing import Any, Dict, Optional, Tuple


class DosageChecker:
    """Checks single dosage, 24-hour maximums, and minimum re-dosing intervals."""

    DOSAGE_REGISTRY: Dict[str, Dict[str, Any]] = {
        "Sumatriptan_100mg": {
            "single_dose_mg": 100.0,
            "max_24h_mg": 200.0,
            "min_redose_interval_hours": 2.0,
            "unit": "mg",
        },
        "Sumatriptan_6mg_SC": {
            "single_dose_mg": 6.0,
            "max_24h_mg": 12.0,
            "min_redose_interval_hours": 1.0,
            "unit": "mg",
        },
        "Rizatriptan_10mg": {
            "single_dose_mg": 10.0,
            "max_24h_mg": 30.0,
            "min_redose_interval_hours": 2.0,
            "unit": "mg",
        },
        "Zolmitriptan_5mg_Nasal": {
            "single_dose_mg": 5.0,
            "max_24h_mg": 10.0,
            "min_redose_interval_hours": 2.0,
            "unit": "mg",
        },
        "DHE_POD_Intranasal": {
            "single_dose_mg": 1.45,
            "max_24h_mg": 2.9,
            "min_redose_interval_hours": 2.0,
            "unit": "mg",
        },
        "Rimegepant_75mg": {
            "single_dose_mg": 75.0,
            "max_24h_mg": 75.0,
            "min_redose_interval_hours": 24.0,
            "unit": "mg",
        },
        "Zavegepant_10mg_Nasal": {
            "single_dose_mg": 10.0,
            "max_24h_mg": 10.0,
            "min_redose_interval_hours": 24.0,
            "unit": "mg",
        },
        "Ibuprofen_800mg": {
            "single_dose_mg": 800.0,
            "max_24h_mg": 2400.0,
            "min_redose_interval_hours": 6.0,
            "unit": "mg",
        },
    }

    @classmethod
    def get_dosage_spec(cls, molecule_key: str) -> Optional[Dict[str, Any]]:
        """Returns the dosage metadata for a given molecule key."""
        return cls.DOSAGE_REGISTRY.get(molecule_key)

    @classmethod
    def validate_redose(
        cls, molecule_key: str, hours_since_prior_dose: float, accumulated_24h_mg: float
    ) -> Tuple[bool, Optional[str]]:
        """Checks if a redose is pharmacologically permissible."""
        spec = cls.get_dosage_spec(molecule_key)
        if not spec:
            return (True, None)

        if hours_since_prior_dose < spec["min_redose_interval_hours"]:
            return (
                False,
                f"Minimum re-dose interval violation: must wait at least {spec['min_redose_interval_hours']} hours before redosing {molecule_key}.",
            )

        new_total = accumulated_24h_mg + spec["single_dose_mg"]
        if new_total > spec["max_24h_mg"]:
            return (
                False,
                f"24-Hour maximum dose exceeded: requested redose would bring total to {new_total}mg (max: {spec['max_24h_mg']}mg).",
            )

        return (True, None)
