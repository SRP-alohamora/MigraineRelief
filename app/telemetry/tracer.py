"""Execution trajectory tracer and OpenTelemetry instrumentation hooks."""

import time
from typing import Any, Dict, List, Optional


class ExecutionTracer:
    """Manages structured Chain-of-Thought (CoT) trajectories and latency metrics."""

    def __init__(self, run_id: str, session_id: str = "anonymousPatient_0"):
        self.run_id = run_id
        self.session_id = session_id
        self.trajectory: List[Dict[str, Any]] = []
        self.start_time: float = time.perf_counter()

    def record_step(self, step_name: str, status: str = "SUCCESS", details: Optional[Dict[str, Any]] = None) -> None:
        """Records an execution step with high-resolution relative timestamp."""
        elapsed_ms = (time.perf_counter() - self.start_time) * 1000.0
        entry: Dict[str, Any] = {
            "step": step_name,
            "status": status,
            "elapsed_ms": round(elapsed_ms, 3),
        }
        if details:
            entry.update(details)
        self.trajectory.append(entry)

    def get_total_latency_ms(self) -> float:
        """Returns total elapsed time in milliseconds."""
        return (time.perf_counter() - self.start_time) * 1000.0

    def export_trajectory(self) -> List[Dict[str, Any]]:
        """Returns the complete recorded trajectory list."""
        return list(self.trajectory)
