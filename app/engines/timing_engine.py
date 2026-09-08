"""Pre-allodynic timing window decay calculation engine.

Based on Burstein et al. (Ann Neurol 2004): Central sensitization / cutaneous allodynia
greatly impairs triptan efficacy if treatment is delayed past the critical 60-minute window.
"""

from app.core.state import MigraineRunState


class TimingEngine:
    """Calculates central sensitization velocity and remaining pre-allodynic window."""

    PRE_ALLODYNIA_THRESHOLD_MINUTES: int = 60

    @classmethod
    def calculate_urgency_window(cls, state: MigraineRunState) -> int:
        """Returns remaining minutes before cutaneous allodynia locks in."""
        if state.cutaneous_allodynia_flag:
            return 0

        elapsed = state.minutes_since_onset
        remaining = max(0, cls.PRE_ALLODYNIA_THRESHOLD_MINUTES - elapsed)
        return remaining

    @classmethod
    def predict_allodynia_lockin(cls, state: MigraineRunState) -> bool:
        """Returns True if central sensitization has likely occurred or is locked in."""
        return state.cutaneous_allodynia_flag or state.minutes_since_onset >= 90
