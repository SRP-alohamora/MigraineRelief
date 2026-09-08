"""Unit tests for OpenViking virtual context pruning and token reduction verification."""

import pytest
from app.core.state import MigraineRunState, DeliveryRoute
from app.knowledge.viking_navigator import VikingContextNavigator
from app.knowledge.viking_client import VikingClient


@pytest.fixture
def navigator():
    return VikingContextNavigator()


def test_viking_pruning_on_gastric_stasis(navigator):
    """Verify that when non-oral delivery is indicated, oral transmucosal branch is pruned."""
    state = MigraineRunState(
        minutes_since_onset=45,
        nausea_present=True,
        recommended_route=DeliveryRoute.INTRANASAL,
        recommended_molecule="Sumatriptan_6mg_SC",
    )
    result = navigator.resolve_context(state)

    assert "viking://knowledge/migraine/delivery_routes/oral_transmucosal/" in result["pruned_paths"]
    assert any("non_oral" in p for p in result["traversed_paths"])
    assert result["token_reduction_percent"] >= 80.0
    assert result["token_estimate"] <= 1500


def test_viking_pruning_on_normal_motility(navigator):
    """Verify that when oral tablet is indicated, non-oral branch is pruned."""
    state = MigraineRunState(
        minutes_since_onset=20,
        nausea_present=False,
        recommended_route=DeliveryRoute.ORAL_TABLET,
        recommended_molecule="Rizatriptan_10mg",
    )
    result = navigator.resolve_context(state)

    assert "viking://knowledge/migraine/delivery_routes/non_oral/" in result["pruned_paths"]
    assert any("oral_transmucosal" in p for p in result["traversed_paths"])
    assert result["token_reduction_percent"] >= 80.0


def test_viking_client_leaf_retrieval():
    """Verify that local virtual context files can be resolved and read."""
    client = VikingClient()
    content = client.read_leaf("knowledge/pharmacology/sumatriptan_sc.md")
    assert "Sumatriptan Subcutaneous Auto-Injector" in content
    assert "Contraindications" in content

    branch_items = client.list_branch("knowledge/pharmacology")
    assert len(branch_items) > 0
    assert any("sumatriptan_sc.md" in item for item in branch_items)
