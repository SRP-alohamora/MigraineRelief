"""
MigraineRelief Evaluation and Validation Module.
"""

from evaluation.final_holdout import (
    HoldoutState,
    HoldoutLockViolationError,
    ModelRunManifest,
    HoldoutLockManager,
)
from evaluation.splitters import (
    SplitStrategy,
    PatientLeakageError,
    SplitterRegistry,
)
from evaluation.leakage_checks import (
    LeakageDetectionError,
    assert_no_patient_overlap,
    assert_no_target_leakage,
    assert_temporal_ordering,
    assert_preprocessing_isolation,
)
from evaluation.metrics import (
    compute_expected_calibration_error,
    compute_classification_metrics,
    compute_regression_metrics,
)
from evaluation.calibration import (
    CalibrationEvaluator,
    PostHocCalibrator,
)
from evaluation.bootstrap import BootstrapEstimator
from evaluation.subgroup_eval import (
    SubgroupEvaluator,
    generate_subgroup_audit_summary,
)

__all__ = [
    "HoldoutState",
    "HoldoutLockViolationError",
    "ModelRunManifest",
    "HoldoutLockManager",
    "SplitStrategy",
    "PatientLeakageError",
    "SplitterRegistry",
    "LeakageDetectionError",
    "assert_no_patient_overlap",
    "assert_no_target_leakage",
    "assert_temporal_ordering",
    "assert_preprocessing_isolation",
    "compute_expected_calibration_error",
    "compute_classification_metrics",
    "compute_regression_metrics",
    "CalibrationEvaluator",
    "PostHocCalibrator",
    "BootstrapEstimator",
    "SubgroupEvaluator",
    "generate_subgroup_audit_summary",
]
