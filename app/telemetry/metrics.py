"""Prometheus and latency metric collectors."""

from typing import Dict


class RescueMetrics:
    """In-memory metrics accumulator for monitoring real-time rescue path."""

    _total_requests: int = 0
    _emergency_diverts: int = 0
    _route_switches: int = 0
    _total_latency_ms: float = 0.0

    @classmethod
    def record_request(cls, latency_ms: float, is_emergency: bool = False, route_switched: bool = False) -> None:
        cls._total_requests += 1
        cls._total_latency_ms += latency_ms
        if is_emergency:
            cls._emergency_diverts += 1
        if route_switched:
            cls._route_switches += 1

    @classmethod
    def get_summary(cls) -> Dict[str, float]:
        avg_latency = (cls._total_latency_ms / cls._total_requests) if cls._total_requests > 0 else 0.0
        return {
            "total_requests": cls._total_requests,
            "emergency_diverts": cls._emergency_diverts,
            "route_switches": cls._route_switches,
            "average_latency_ms": round(avg_latency, 3),
        }

    @classmethod
    def reset(cls) -> None:
        cls._total_requests = 0
        cls._emergency_diverts = 0
        cls._route_switches = 0
        cls._total_latency_ms = 0.0
