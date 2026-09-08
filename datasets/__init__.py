"""
MigraineRelief Datasets Module.

Implements schema-driven adapters for heterogeneous migraine evidence layers:
- ClinicalDatasetAdapter (400-case diagnostic phenotyping)
- WearableDatasetAdapter (11,879 patient-day dynamic behavioral/wearable logs)
- UKBiobankAdapter (Field 20002 population epidemiology schema)
- SchemaRegistry (Data quality checks and feature typing)

CANONICAL ARCHITECTURAL DIRECTIVE:
These heterogeneous public datasets must remain separate scientific evidence layers.
DO NOT concatenate them into a single pooled training matrix.
"""

from datasets.base import BaseDatasetAdapter, DatasetMetadata, TaskType
from datasets.clinical_adapter import ClinicalDatasetAdapter
from datasets.wearable_adapter import WearableDatasetAdapter
from datasets.ukb_adapter import UKBiobankAdapter
from datasets.schema_registry import SchemaRegistry, DatasetRegistry, assert_never_concatenated

__all__ = [
    "BaseDatasetAdapter",
    "DatasetMetadata",
    "TaskType",
    "ClinicalDatasetAdapter",
    "WearableDatasetAdapter",
    "UKBiobankAdapter",
    "SchemaRegistry",
    "DatasetRegistry",
    "assert_never_concatenated",
]

