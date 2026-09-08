"""Pytest configuration, fixtures, and golden cohort loaders."""

import json
from pathlib import Path
from typing import Any, Dict
import pytest
from app.core.graph import MigraineStateGraphRunner
from app.core.state import MigraineRunState


@pytest.fixture(scope="session")
def graph_runner() -> MigraineStateGraphRunner:
    """Session-scoped multi-agent StateGraph runner."""
    return MigraineStateGraphRunner()


@pytest.fixture(scope="session")
def golden_cohorts_dir() -> Path:
    """Path to the golden cohorts JSON directory."""
    return Path(__file__).resolve().parent / "golden_cohorts"


def load_cohort(filename: str) -> Dict[str, Any]:
    """Helper to load a golden cohort JSON file."""
    path = Path(__file__).resolve().parent / "golden_cohorts" / filename
    return json.loads(path.read_text(encoding="utf-8"))
