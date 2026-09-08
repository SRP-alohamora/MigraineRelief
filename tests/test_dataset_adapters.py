"""
Unit tests for MigraineRelief Dataset Adapters and Schema Registry.
"""

import pytest
import pandas as pd
from datasets import (
    ClinicalDatasetAdapter,
    WearableDatasetAdapter,
    UKBiobankAdapter,
    SchemaRegistry,
    DatasetRegistry,
    assert_never_concatenated,
    TaskType,
)


def test_clinical_adapter_loading():
    adapter = ClinicalDatasetAdapter()
    df = adapter.load()
    assert len(df) == 400
    assert "Type" in df.columns
    assert "subgroup_high_intensity" in df.columns
    assert "subgroup_aura_present" in df.columns

    X, y, groups = adapter.get_features_and_target(TaskType.MIGRAINE_TYPE_CLASSIFICATION)
    assert len(X) == 400
    assert len(y) == 400
    assert groups is None  # Cross-sectional, independent patients


def test_wearable_adapter_loading():
    adapter = WearableDatasetAdapter()
    df = adapter.load()
    assert len(df) == 11879
    assert "user_id" in df.columns
    assert "deviation_sleep_hours" in df.columns
    assert "deviation_screen_time_hours" in df.columns

    meta = adapter.get_metadata()
    assert meta.has_repeated_measures is True
    assert meta.n_patients == 100

    X, y, groups = adapter.get_features_and_target(TaskType.ATTACK_RISK_PREDICTION)
    assert len(X) == 11879
    assert len(groups) == 11879
    assert len(groups.unique()) == 100


def test_ukb_adapter_schema():
    adapter = UKBiobankAdapter()
    meta = adapter.get_metadata()
    assert "Field 20002" in meta.name
    schema = adapter.load_schema()
    assert "field_id" in schema
    assert schema["field_id"] == "20002"


def test_assert_never_concatenated():
    c_df = pd.DataFrame({"Age": [25], "Visual": [1], "Intensity": [3]})
    w_df = pd.DataFrame({"user_id": ["u1"], "sleep_hours": [7.5], "stress": [4]})
    # Heterogeneous datasets must pass architectural assertion
    assert assert_never_concatenated(c_df, w_df) is True
