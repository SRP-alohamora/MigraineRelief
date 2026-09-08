# MigraineRelief Data Quality & Schema Integrity Audit

## Architectural Invariant Notice
> [!IMPORTANT]
> **Non-Concatenation Invariant**: Public datasets (Clinical 400, Wearable 11,879, UK Biobank 19,819) 
> represent fundamentally distinct epidemiological and observational evidence layers. 
> They are **never pooled** into a single master training matrix.

## Summary of Registered Evidence Layers

| Layer ID | Dataset Name | Rows | Patients | Repeated Measures | Unit of Analysis | Target Column | Dataset SHA-256 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `clinical_400` | Kaggle Migraine Classification Dataset (ranzeet013) | 400 | 400 | No (Cross-Sectional) | Single clinical encounter | `Type` | `e267e1c141...` |
| `wearable_11879` | Kaggle Wearable/Lifestyle Migraine Dataset (11,879 patient-days) | 11,879 | 100 | Yes (Longitudinal) | Patient-day observation | `migraine_occurrence` | `2b8bfebb59...` |
| `uk_biobank` | UK Biobank (Field 20002 Non-Cancer Illness) | 502,000 | 502,000 | No (Cross-Sectional) | Single clinical encounter | `headache_category` | `b57fdb79d4...` |

## Detailed Dataset Profiles

### 1. Kaggle Migraine Clinical Phenotype Cohort (`clinical_400`)
- **Source**: Ranzeet013, validated against 400 patient clinical records.
- **Target**: 7-class ICHD-based diagnostic migraine categorization (`Type`).
- **Features**: 23 clinical symptoms (Aura disturbances, pain severity, duration, autonomic signs).
- **Splitting Protocol**: Stratified Row Splitting (`SplitStrategy.ROW_STRATIFIED`). Zero repeated patient measures.
- **Clinical Utility**: Level 3 diagnostic phenotyping prior.

### 2. Wearable & Lifestyle Physiological Cohort (`wearable_11879`)
- **Source**: Kaggle / Digital Biomarkers Longitudinal Study (11,879 patient-days across 100 individuals).
- **Target**: Daily attack occurrence (`migraine_occurrence`) and pain severity (`intensity`).
- **Features**: Sleep duration, screen time, perceived stress, mood, hydration, plus derived personal baseline deviations and lag-1 historical states.
- **Splitting Protocol**: **Patient-Grouped Splitting (`SplitStrategy.PATIENT_GROUPED`) is MANDATORY**. Row splitting strictly raises `PatientLeakageError`.
- **Clinical Utility**: Level 3 dynamic behavioral trigger prior.

### 3. UK Biobank Field 20002 Cohort (`uk_biobank`)
- **Source**: UK Biobank Field 20002 (Non-cancer illness code, self-reported).
- **Diagnostic Scope**: Code 1265 (Migraine, ~19,819 cases), Code 1263 (Headache non-migraine, ~9,240 cases), and population controls.
- **Data Policy**: Microdata access requires UKB approved application (MTA). Adapter implements schema-driven contracts without fabricating synthetic records.
- **Clinical Utility**: Level 3 population-level epidemiology prior.