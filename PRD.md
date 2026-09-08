# Product Requirements Document (PRD)
## Project: MigraineRelief AI
> **Document Version:** 1.0.0  
> **Status:** Approved / Ready for Engineering  
> **Target Audience:** Product, Engineering, Design, Neurological Advisors, Regulatory Counsel  
> **Canonical Strategy Reference:** `migrainerelief_strategy.md` (Internal)  
> **Historical Inspiration:** `brainstorm.md`

---

## 1. Executive Summary & Product Vision

Migraine is the second leading cause of disability worldwide and the leading cause among young women, afflicting over 1.1 billion individuals. When acute attacks strike, patients face a severe double-bind: agonizing, paralyzing pain combined with acute cognitive dysfunction and nausea, forcing them to make high-stakes pharmacological decisions under extreme uncertainty.

Existing digital health tools fail sufferers at this critical moment:
* **Passive tracking diaries (e.g., Migraine Buddy)** demand exhausting 15-minute questionnaires while the patient is photosensitive, nauseated, and in 8/10 agony.
* **Open-domain AI chatbots (ChatGPT, Claude)** provide generic, post-hoc summaries with zero persistent memory of patient pharmacokinetics, formulation route mismatches, or medication overuse limits.
* **Diagnostic toys (e.g., 400-case Kaggle classifiers)** solve a problem already addressed by deterministic clinical criteria (ICHD-3).

### The Product Vision
**MigraineRelief** is an ultra-low friction, privacy-first precision clinical copilot engineered to solve the most painful, high-uncertainty decision in headache medicine: **the 60-minute acute rescue window**.

Rather than blaming arbitrary foods or making unvalidated 24-hour predictions, MigraineRelief matches patient phenotype, prodrome velocity, gastric motility state, and allodynia onset to the optimal abortive molecule, delivery route (oral vs. non-oral), and adjuvant antiemetic—while strictly enforcing Medication Overuse Headache (MOH) safety envelopes.

#### Foundational Definitions & Educational References
* **Prodrome Markers**: *Prodrome markers are early physical, behavioral, or biological signs that appear before a disease is fully diagnosed or reaches its severe phase.* In migraine, hypothalamic and brainstem activation produces subtle prodromal signals (neck stiffness, yawning, fluid retention, mood swings, photophobia) hours before headache pain strikes.
  * Educational Video: [(The role of prodromal symptoms in predicting headache onset)](https://www.youtube.com/watch?v=9MIx21I1FRY&t=223s)
* **Contemporary Acute Pharmacotherapies**: For a comprehensive clinical reference on acute migraine medications across age groups, formulation routes, and efficacy ladders:
  * Clinical Reference: [Acute Migraine Treatment & Medications Guide (CPS Position Statement)](https://cps.ca/en/documents/position/acute-migraine)

By instrumenting a closed loop between **Context → Intervention → Timing → Response → Outcome**, MigraineRelief builds the world's first proprietary **Intervention-Response Graph**, turning acute rescue failure into a predictable, compoundable science.

---

## 2. Problem Statement & Clinical Foundations

*(Derived from `brainstorm.md` Section 1.1, updated with First-Principles Neurology)*

### 2.1 The Clinical Reality of Migraine
Migraine is not "just a headache." It is an agonizing, complex neurovascular disorder characterized by:
1. **Cortical Spreading Depression (CSD)**: A self-propagating wave of neuronal and glial depolarization across the cerebral cortex, triggering visual and sensory auras.
2. **Trigeminovascular Activation**: Sensory afferents release vasoactive neuropeptides (Calcitonin Gene-Related Peptide [CGRP], Substance P, PACAP), causing neurogenic inflammation and severe throbbing unilateral or holocranial pain.
3. **Acute Autonomic Gastroparesis (Gastric Stasis)**: Within 30–60 minutes of attack onset, sympathetic outflow shuts down gastric emptying. Oral medications get trapped in the stomach, delayed from reaching the duodenum for absorption (Aurora et al., *Headache* 2022).
4. **The Race Against Central Sensitization (Cutaneous Allodynia)**: Within 60–120 minutes of headache onset, second-order neurons in the trigeminocervical complex and third-order neurons in the thalamus become sensitized. Once cutaneous allodynia locks in (scalp/skin sensitivity where light touch feels like burning embers), peripheral abortive medications (such as oral triptans) fail to abort pain (Burstein et al., *Ann Neurol* 2004).

### 2.2 Updated 2026 US Emergency Department (ED) Migraine Guidelines
*(American Headache Society Consensus led by Dr. Jennifer Robblee)*

In the updated clinical consensus for acute migraine in emergency and urgent care settings, the evidence base was formally restructured around non-opioid, mechanistically targeted parenterals. Dr. Jennifer Robblee and colleagues established two **Level A ("Must Offer")** recommendations:
1. **Intravenous (IV) Prochlorperazine (prochlorazine)**: Dopamine antagonist with potent antiemetic and central analgesic properties, clinically demonstrated to outperform hydromorphone without addiction liability ([PubMed: 11335783](https://pubmed.ncbi.nlm.nih.gov/11335783/)).
2. **Greater Occipital Nerve Blocks (GONB) for Migraine Patients Including Teens**: Target peripheral infiltration with local anesthetics (bupivacaine/lidocaine) that rapidly quiets afferent inputs to the trigeminocervical complex, providing effective relief even in pediatric and adolescent refractory migraine ([Nerve Blocks in Pediatric and Adolescent Headache Disorders, PubMed: 29124490](https://pubmed.ncbi.nlm.nih.gov/29124490/)).
3. **Opioid Restriction ("Must NOT Offer")**: Level A recommendation explicitly against IV hydromorphone and IV opioids due to proven lack of efficacy and high risk of perpetuating chronic transformation and rebound headache.
* Guideline Discussion & Overview: [Dr. Jennifer Robblee SGEM Presentation](https://thesgem.com/2026/01/sgem-xtra-hit-me-with-your-best-block-2025-ahs-ed-migraine-guidelines/) | [YouTube Video Overview](https://www.youtube.com/watch?v=JmYj-90V63w)

### 2.3 The Three Clinical Tragedies
* **The Acute Rescue Failure Roulette**: 30% to 50% of acute migraine rescue attempts fail because medications are taken too late or administered orally during gastric stasis, leading to violent vomiting fits, prolonged disability, and emergency department visits.
* **The Medication Overuse Headache (MOH) Trap**: Sufferers taking triptans/ergots/opioids on $\ge 10$ days/month or NSAIDs on $\ge 15$ days/month transform episodic migraine into daily chronic refractory agony, unaware that their rescue medication is perpetuating the cycle.
* **The Privacy & Surveillance Barrier**: Traditional digital health tools collect invasive Protected Health Information (PHI), selling aggregate data to advertisers and insurers, creating severe adoption resistance among privacy-sensitive users.


---

## 3. Target User Personas & Clinical Scenarios

*(Derived from `brainstorm.md` Section 3, mapped to the Acute Rescue Architecture)*

```
+----------------------------------------------------------------------------------------------------+
|                                    TARGET CLINICAL PERSONA MATRIX                                  |
+------------------------------------+---------------------------------------------------------------+
| Dimension                          | Persona 1: Alexa Rivera                                       | Persona 2: Claire Sterling                    |
+------------------------------------+---------------------------------------------------------------+
| Gender / Age / Role                | Female, 15 / High School Sophomore                            | Female, 45 / Professional & Mother            |
| Clinical Classification            | Episodic Probable Migraine without Aura                       | Chronic Refractory Migraine with Gastroparesis|
| Attack Frequency / Duration        | 2–4 attacks/month; 6 to 18 hours per attack                   | 18–22 days/month; 24 to 72 hours per attack   |
| Primary Acute Barrier              | Unpredictable school onset; sedative medication limits        | Severe nausea & vomiting fits; oral malabsorption|
| Past Treatment History             | OTC NSAIDs (ibuprofen, naproxen), acetaminophen (MOH risk)    | 20+ years; failed triptans, TCAs, Botox, AEDs |
| Key Psychological Need             | Academic preservation; privacy; stigma reduction              | Emergency crisis rescue; dignity; non-oral relief|
+------------------------------------+---------------------------------------------------------------+
```

### 3.1 Persona 1: Alexa Rivera — The High School Sophomore (Adolescent Episodic Migraine)
* **Demographics**: 15-year-old female, high school sophomore.
* **The Living Reality**: Attacks strike unpredictably during high-stress exam weeks, in fluorescent-lit classrooms, after skipped cafeteria meals, or following pubertal hormonal shifts (luteal-phase estrogen drop). When an attack hits at school, Alexa experiences blinding photophobia, throbbing unilateral pain, and cognitive clouding ("brain fog"). School nurses frequently dismiss her pain as adolescent anxiety or academic avoidance.
* **Pharmacological & Regulatory Constraints**:
  - **Pediatric Labeling Constraints**: Most adult migraine drugs lack FDA clearance under 18. Only a small subset (e.g., oral rizatriptan for ages 6+, zolmitriptan/almotriptan nasal sprays for ages 12+) carry pediatric indications.
  - **MOH Rebound Risk**: Frequent reliance on over-the-counter analgesics (Excedrin, ibuprofen) puts Alexa at catastrophic risk of chronic transformation.
  - **Sedation Restrictions**: Alexa cannot take sedating rescue medications (e.g., promethazine, diphenhydramine) during the school day.
* **How MigraineRelief Solves Alexa's Problem**:
  - **Zero-PII Anonymous Access**: Alexa can use the platform without school or parental surveillance fears (`anonymousPatient_0`).
  - **Pediatric Safety Filtering**: Ensures recommended acute protocols comply strictly with FDA pediatric indications and non-sedating criteria.
  - **MOH Monthly Quota Meter**: Visually guards Alexa against taking OTC combination analgesics on more than 9 days per month.
  - **Prodrome Window Alert**: Teaches Alexa to spot subtle prodromes (neck stiffness, yawning) and execute non-sedating rescue within the 30-minute pre-allodynic window.

### 3.2 Persona 2: Claire Sterling — The 20-Year Chronic Refractory Sufferer
* **Demographics**: 45-year-old female, senior corporate manager and mother (perimenopausal migraine exacerbation).
* **The Living Reality ("The Bathroom Floor Agony")**:
  - Two decades of chronic refractory migraine (>18 headache days/month). Has systematically cycled through and failed beta-blockers, topiramate, amitriptyline, valproate, Botox, and multiple triptans.
  - When severe attacks peak, severe autonomic activation triggers **acute migraine-induced gastric stasis (gastroparesis)** and violent vomiting fits.
  - Oral tablets, liquids, and antiemetics are immediately vomited or stalled in the stomach. Scalp allodynia makes hair resting on her head feel like burning embers.
  - She spends 8 to 14 hours curled on cold bathroom tile in total darkness, incapacitated.
* **Pharmacological & Regulatory Constraints**:
  - **Zero Oral Bioavailability**: Any oral abortive (tablets, capsules) is useless during gastric stasis.
  - **Cardiovascular & Triptan Non-Response**: Developed chest tightness from sumatriptan; requires non-vasoconstrictive alternatives (gepants, ditans) or upper nasal space DHE.
* **How MigraineRelief Solves Claire's Problem**:
  - **Real-Time Gastric Stasis Route Switcher**: When Claire reports nausea, the system immediately suppresses oral tablets and activates her prescribed Tier-2 Non-Oral Rescue Protocol (Intranasal POD DHE, SC Sumatriptan auto-injector, or Nasal Zavegepant + Rectal/SC antiemetic).
  - **Pre-Allodynia Urgency Timer**: Notifies Claire the instant aura begins to inject before cutaneous allodynia locks in central pain pathways.
  - **Physician Refractory Dossier**: Generates a clean, exportable clinical summary documenting her step-therapy failures and route requirements for specialist visits and insurance prior-authorizations.

---

## 4. Product Strategy & Core Wedge

### 4.1 Product Positioning Formula
> **For** individuals with episodic or chronic migraine experiencing frequent rescue failures and unpredictable attacks,  
> **MigraineRelief** helps them **abort acute attacks within 2 hours and eliminate medication overuse rebound**  
> **by** intelligently optimizing medication timing, formulation route (oral vs. non-oral), and adjuvant therapies during the critical pre-allodynic window,  
> **unlike** passive symptom diaries (Migraine Buddy) that demand tedious logging during pain, or generic chatbots that offer ungrounded post-hoc advice.

### 4.2 The Decision-Value Chain
```
USER PROBLEM      → Throbbing pain, vomiting, cognitive paralysis, fear of 72h disability
UNCERTAINTY       → "Is this escalating? Should I take an acute pill now? Will oral pills work with nausea?"
REQUIRED INFO     → Attack velocity, prodromal state, gastric motility, 30-day analgesic balance
DATA              → Time-stamped prodrome check, wearable sleep/HRV deviance, minutes elapsed since onset
SIGNAL            → Autonomic shift + neck stiffness; 35 min elapsed; acute nausea reported; 8/10 MOH days used
INFERENCE         → High escalation probability; oral route 70% failure risk; high MOH rebound risk
DECISION          → Bypass oral route; avoid triptan class; select non-oral CGRP gepant or SC sumatriptan
ACTION            → Patient administers non-oral rescue within the 30-minute pre-allodynia window
OUTCOME           → 2-hour pain freedom achieved; gastric vomiting avoided; MOH safety limit preserved
FEEDBACK          → 2h and 24h automated check-ins update N-of-1 PK model and cohort prior distributions
```

### 4.3 Epistemic Certainty Tiers
Every insight, alert, and recommendation rendered in MigraineRelief is tagged with an explicit epistemic certainty tier to prevent clinical overreach:
* **Level 1: Confirmed Clinical Protocol** (Deterministic medical ground truth: ICHD-3 criteria, SNOOP4 emergency red flags, FDA drug interactions, contraindications, MOH monthly quotas).
* **Level 2: Probabilistic Clinical Trial Prior** (Established Bayesian priors derived from published Phase III clinical trials: $T_{\max}$ absorption curves, route efficacy under gastric stasis, Burstein allodynia timing decay).
* **Level 3: Exploratory Population Prior — Observational Public Baselines** (Correlational priors extracted from public datasets: 400-case Kaggle Ranzeet013 diagnostic classifier, 11,879 patient-day wearable lifestyle cohort, UK Biobank Field 20002 non-cancer illness survey). These provide non-causal hypothesis generation and initial Bayesian anchors, never concatenated into a single synthetic matrix.
* **Level 4: Patient-Specific Posterior — N-of-1 Personalization** (Individualized Bayesian posterior distribution: $P(\text{2h pain freedom} \mid \text{Intervention}, \text{Timing}, \text{Baseline Severity}, \text{Context})$. Conjugate Beta-Binomial updating where trial likelihood smoothly supersedes the population anchor prior as personal longitudinal episodes accumulate).

### 4.4 Fair Test & External Validation Architectural Mandate
To ensure clinical rigor and scientific reproducibility, all machine learning evaluation adheres to:
1. **Strict Holdout Lock**: Development, feature engineering, and hyperparameter tuning occur exclusively within development cross-validation. The final holdout set is evaluated **exactly once** after model selection is frozen.
2. **Anti-Leakage Patient Splitting**: Any dataset with repeated patient measures (such as the 11,879 patient-day wearable cohort) strictly mandates patient-level grouping (`SplitStrategy.PATIENT_GROUPED`). Row-level random splitting raises a fatal `PatientLeakageError`.
3. **Six-Model Tournament**: Benchmarks Logistic Regression, Decision Tree, Random Forest, XGBoost, LightGBM, and CatBoost under identical CV splits with multi-attribute selection (Macro F1, calibration ECE, Brier score).
4. **Three-Tier Explainability**: Tier A (explicitly non-causal global SHAP hypotheses), Tier B (patient-level waterfall separating fixed clinical from modifiable lifestyle factors), and Tier C (cross-fold feature attribution stability scoring).
5. **Cross-Dataset Replication Engine**: Tracks whether findings replicate across independent cohorts without pooling heterogeneous rows.


---

## 5. System Architecture & Decoupled Engines

```mermaid
flowchart TD
    subgraph Intake_Layer ["1. Ultra-Low Friction Intake (<3 Taps / Anonymous Upload)"]
        UI_Attack["In-Attack Emergency Button (<3 Taps)"]
        Anon_Upload["Anonymous Sandbox: Apple Health / Oura / CSV Drop"]
        Sensors["Passive Wearable Background Sync (Sleep & HRV)"]
    end

    subgraph Deterministic_Guardrails ["2. Deterministic Safety & Normalization Gate"]
        SNOOP["SNOOP4 Emergency Gate: Secondary Headache Red Flags"]
        MOH_Gate["MOH Quota Ledger: Monthly Triptan/Analgesic Counter"]
        Contra_Gate["Cardiovascular & Pediatric Filter"]
    end

    subgraph State_Store ["3. Longitudinal Patient State Ledger"]
        Patient_History["Past Trajectories, Adverse Reactions, Failed Meds"]
        MOH_Ledger["30-Day Rolling Medication Intake Count"]
        N_of_1_Store["Personal Pharmacokinetic Decay Curves"]
    end

    subgraph Optimization_Brain ["4. Acute Rescue & Decision Brain"]
        Timing_Engine["Pre-Allodynia Timing Window Clock"]
        Route_Engine["Gastric Stasis Route-Switching Engine"]
        Bayes_Ranker["Bayesian N-of-1 Molecule & Route Ranker"]
    end

    subgraph Action_Output ["5. Action Delivery & Explanation"]
        Rescue_Card["Personalized Acute Rescue Card (Instant Delivery)"]
        Epistemic_Badge["Epistemic Tier Tagging (Level 1 / 2 / 3)"]
        Explanation["Plain-English Rationale & Timing Warning"]
    end

    subgraph Outcome_Loop ["6. Closed-Loop Feedback & Compounding Graph"]
        Push_2h["Automated 2h Push Notification (Pain Free? Regurgitation?)"]
        Push_24h["Automated 24h Push Notification (Recurrence? Repeat Rescue?)"]
        Graph_Store["Proprietary Intervention-Response Graph"]
    end

    UI_Attack --> SNOOP
    Anon_Upload --> SNOOP
    Sensors --> Timing_Engine

    SNOOP -->|Pass| MOH_Gate
    SNOOP -->|Red Flag Detected| ER_Divert["URGENT: Divert to Emergency Services / 911"]

    MOH_Gate --> Contra_Gate
    Contra_Gate --> Patient_History

    Patient_History --> Timing_Engine
    MOH_Ledger --> Timing_Engine
    N_of_1_Store --> Timing_Engine

    Timing_Engine --> Route_Engine
    Route_Engine --> Bayes_Ranker
    Bayes_Ranker --> Rescue_Card

    Rescue_Card --> Epistemic_Badge
    Rescue_Card --> Explanation

    Rescue_Card --> Push_2h
    Push_2h --> Push_24h
    Push_24h --> Graph_Store
    Graph_Store -.->|Async Update| N_of_1_Store
```

---

## 6. Detailed Feature Specifications

### Feature 1: The Anonymous Self-Service Diagnostic Sandbox (Day-0 Intake)
* **Goal**: Provide instant, zero-barrier diagnostic value on Day 1 using historical user data, solving the cold-start problem without requiring accounts or PHI.
* **User Flow**:
  1. User accesses web app (zero login, zero cookies, zero email).
  2. Drag-and-drops an Apple Health `export.xml`, Oura `export.json`, or spreadsheet diary (or completes an optional 2-minute retrospective survey).
  3. Client-side WebAssembly parser processes data entirely within browser memory (`anonymousPatient_0`).
  4. Immediate personal diagnostic report rendered:
     - **Historical Rescue Failure Post-Mortem**: Identifies past attacks where oral triptans were taken >90 min post-onset with nausea, estimating absorption failure rate.
     - **Cumulative Stressor Threshold Audit**: Evaluates past attacks against sleep debt (<5.5h) and stress deltas using Kaggle/literature priors.
     - **MOH Rebound Risk Scan**: Audits 30-day rolling periods against ICHD-3 $\ge 10$ day criteria.
  5. User saves local encrypted key (`AES-GCM-256`) and pins the `<3-Tap Emergency Attack Button` to their mobile home screen.

### Feature 2: In-Attack Real-Time Rescue Copilot (<3-Tap Emergency Flow)
* **Goal**: Minimize cognitive load during photophobia and severe pain, delivering optimal guidance in $<15$ seconds.
* **User Flow**:
  1. **Tap 1**: User taps glowing red button: `[Attack Starting / Migraine Alert]`.
  2. **Tap 2**: User answers single binary question: `[Nausea Present? YES / NO]`.
  3. **Tap 3 (Optional)**: Aura present (`YES / NO`).
  4. **Output**: System immediately generates the **Personalized Acute Rescue Card**:
     - Specific molecule, dose, and route from the patient's approved profile.
     - Exact timing urgency: *"Administer within the next 25 minutes before central sensitization locks in."*
     - Clear epistemic tier badge.

### Feature 3: Gastric Stasis & Formulation Route Switcher
* **Goal**: Prevent acute rescue failure caused by gastroparesis and oral malabsorption.
* **Logic**:
  - `IF Nausea == True OR Vomiting == True OR Minutes_Elapsed > 90`:
    - Suppress oral tablet recommendations.
    - Elevate prescribed non-oral routes:
      - *Option A*: Intranasal spray (e.g., Zavegepant, Zolmitriptan, POD DHE).
      - *Option B*: Subcutaneous auto-injector (e.g., Sumatriptan 4mg/6mg SC).
      - *Option C*: Prescribed prokinetic/antiemetic adjuvant (e.g., Metoclopramide 10mg / Ondansetron ODT) 15 minutes prior to oral rescue.
  - Display clinical rationale: `[Level 1: Confirmed Clinical Protocol]` *"Migraine-induced gastric stasis arrests stomach absorption. Oral tablets have a 70% failure rate when taken during nausea."*

### Feature 4: Medication Overuse Headache (MOH) Quota Ledger
* **Goal**: Halt the transformation from episodic to chronic migraine caused by analgesic rebound.
* **Logic**:
  - Implements rolling 30-day intake ledger for each medication class based on ICHD-3 Section 8.2:
    - Triptans, Ergots, Opioids, Combinations: Max **9 days per rolling 30 days** (Limit: 10).
    - Simple Analgesics (NSAIDs, Acetaminophen): Max **14 days per rolling 30 days** (Limit: 15).
  - When user reaches limit (e.g., 9/10 triptan days):
    - System issues **Hard Warning**: *"MOH Threshold Imminent. Taking a triptan today risks rebound chronic migraine."*
    - Automatically diverts patient to non-pharmacological or non-MOH rescue options: neuromodulation devices (Nerivio, Cefaly), peripheral nerve blocks, or urgent physician triage.

### Feature 5: Closed-Loop High-Fidelity Outcome Capture (2h & 24h)
* **Goal**: Instrument the gold-standard FDA/ICHD-3 clinical trial endpoints with zero survey friction.
* **Logic**:
  - **At $t = 2.0$ Hours Post-Rescue**: System sends automated mobile push notification:
    - Prompt: *"How is your head right now?"*
    - Single-tap responses: `[Pain-Free 🟢]`, `[Mild / Manageable 🟡]`, `[Severe / Unchanged 🔴]`, `[Regurgitated / Vomited 🤮]`.
  - **At $t = 24.0$ Hours Post-Rescue**: System sends secondary push notification:
    - Prompt: *"Did the headache return today?"*
    - Single-tap responses: `[No Recurrence 🟢]`, `[Recurrence (Took 2nd Dose) 🟡]`, `[Continuous Agony 🔴]`.
  - **Graph Storage**: The resulting tuple `(Phenotype, Timing_Δt, Route, Nausea_Present, Outcome_2h, Outcome_24h)` is appended to the patient's local encrypted ledger and (with consent) the de-identified global Intervention-Response Graph.

### Feature 6: Cumulative Stressor Threshold Meter (Reframing Triggers)
* **Goal**: Eliminate trigger orthorexia and food anxiety by modeling migraine as a multi-factorial allostatic threshold disorder.
* **Logic**:
  - Calculates daily brain sensitivity:
    $$\text{Threshold Resistance} = 1.0 - \Big(w_{\text{sleep}} \Delta\text{SleepDebt} + w_{\text{stress}} \Delta\text{StressDrop} + w_{\text{hormone}} \text{LutealDrop}\Big)$$
  - Initialized with **Kaggle wearable baseline prior weights** ($w_{\text{sleep}} = 0.45, w_{\text{stress}} = 0.35$).
  - UI displays a simple "Brain Resistance Meter" (High / Moderate / Sensitive).
  - Messaging: *"Your threshold is lower today due to 4.5 hours of sleep. You don't need to fear triggers—just keep your acute rescue kit nearby."*

### Feature 7: Clinical Safety Gates & SNOOP4 Emergency Triage
* **Goal**: Protect patient safety and eliminate legal liability by identifying life-threatening secondary headaches.
* **Logic**:
  - Continuous deterministic filter across all intakes. Checks for:
    - **S**ystemic symptoms (fever, unexplained weight loss).
    - **N**eurological deficits (unilateral motor paralysis, sudden speech loss, confusion).
    - **O**nset sudden (thunderclap headache reaching 10/10 intensity in $<1$ minute — rule out subarachnoid hemorrhage).
    - **O**lder onset (new headache type after age 50).
    - **P**ostural aggravation or papilledema.
  - **Action**: If any SNOOP4 flag triggers, the app locks acute guidance, displays an unclosable red alert banner, and instructs immediate 911 / emergency department consultation.

---

## 7. Data Strategy & Privacy Architecture

### 7.1 Zero-Knowledge Patient Schema (`anonymousPatient_0`)
To eliminate HIPAA vulnerabilities and protect vulnerable users (such as adolescents):
* No real names, email addresses, phone numbers, or IP addresses are stored.
* Patient profiles exist locally in browser storage, encrypted using **Web Crypto `AES-GCM-256`**.
* The public/cloud sync layer only receives fully anonymized, high-entropy cryptographic hashes:
```json
{
  "client_id": "anon_8f3d19a2e4c",
  "attack_event": {
    "timestamp_utc": "2026-09-07T03:15:00Z",
    "minutes_from_onset": 35,
    "gastric_stasis_flag": true,
    "allodynia_present": false,
    "selected_molecule": "Sumatriptan",
    "selected_route": "Subcutaneous",
    "dose_mg": 6,
    "adjuvant_antiemetic": "Metoclopramide",
    "outcome_2h_pain_free": true,
    "outcome_regurgitated": false,
    "outcome_24h_recurrence": false,
    "rolling_30d_moh_count": 6
  }
}
```

### 7.2 The Intervention-Response Graph Schema
Every closed-loop rescue event contributes to a multi-dimensional comparative effectiveness graph:
* **Node (Context)**: `[Phenotype, Age_Tier, Nausea_Status, Aura_Status, Baseline_HRV_Deviance]`
* **Edge (Intervention & Timing)**: `[Drug_Class, Molecule, Route, Timing_Δt, Adjuvant]`
* **Node (Outcome)**: `[2h_Pain_Freedom, Regurgitation_Rate, 24h_Recurrence, Functional_Restoration]`

---

## 8. User Experience (UX) & Design Specifications

1. **Dark Mode / Photophobia-Optimized UI**:
   - The entire app defaults to an ultra-low luminance, pure dark palette (`#0B0D12` background, deep slate `#1E222D` cards, soft amber/cyan indicators).
   - Zero high-frequency animations or blinding white flashes.
2. **The <3-Tap In-Attack Experience**:
   - Giant, high-contrast touch targets ($\ge 64\text{px}$) designed for trembling hands, visual aura scotomas, and photophobic distress.
   - Text rendered at $\ge 18\text{pt}$ with high legibility (Inter/SF Pro Display).
3. **The Instant Action Card Layout**:
   ```
   +-------------------------------------------------------------+
   |  ⚡ ACUTE RESCUE ACTION CARD             [Level 1: Protocol]|
   +-------------------------------------------------------------+
   |  TAKE NOW (Elapsed: 28 min | Pre-Allodynia Window Active):  |
   |                                                             |
   |  👉 Sumatriptan 6mg Subcutaneous Auto-Injector             |
   |     + 10mg Metoclopramide Oral Tablet                       |
   |                                                             |
   |  ⚠️ ROUTE SWITCH APPLIED:                                   |
   |  Oral triptan bypassed due to reported nausea (gastroparesis|
   |  risk). SC injection bypasses stomach for 12-minute relief. |
   |                                                             |
   |  [ ✅ CONFIRM DOSE TAKEN ]        [ ⏳ DELAY (5 MIN) ]      |
   +-------------------------------------------------------------+
   |  MOH Ledger: 4/10 Triptan days used this month (Safe Zone)  |
   +-------------------------------------------------------------+
   ```

---

## 9. Non-Functional Requirements (NFRs)

* **Latency**: In-attack rescue card generation must complete in $<50\text{ms}$ on client device. Zero network round-trips required for the core rescue path.
* **Offline-First Availability**: Full rescue protocol execution and MOH tracking must function 100% offline (airplane mode, subway, rural areas) using local cached IndexedDB.
* **Reliability**: Zero crashes during the emergency flow. The in-attack view must be isolated from heavy background sync tasks.
* **Zero Hallucination Mandate**: Prescribing logic is strictly deterministic and hard-coded to peer-reviewed clinical guidelines. Generative LLMs are strictly forbidden from modifying drug classes, routes, or dosages.

---

## 10. Phased Rollout & Milestones

```
+----------------------------------------------------------------------------------------------------+
|                                      PHASED RELEASE ROADMAP                                        |
+-------------------+---------------------------------------------+----------------------------------+
| Phase             | Scope & Key Deliverables                    | Exit Criteria / Target           |
+-------------------+---------------------------------------------+----------------------------------+
| Phase 1: MVP      | • Anonymous Self-Service Upload Sandbox     | • 500 active users               |
| (Months 1–4)      | • In-Attack Copilot (<3-tap emergency flow) | • ≥75% of attacks logged in-event|
|                   | • Gastric Stasis Route-Switching Engine     | • 2h outcome completion ≥60%     |
|                   | • MOH Monthly Quota Ledger                  | • Zero SNOOP4 triage escapes     |
|                   | • Day-0 Bayesian Literature Priors          |                                  |
+-------------------+---------------------------------------------+----------------------------------+
| Phase 2: N-of-1   | • Personal PK Window Profiler (Attacks 1–5) | • 2,500 active users             |
| (Months 5–9)      | • Cumulative Stressor Threshold Meter       | • First 10,000 closed-loop rescue|
|                   | • Passive Wearable Sync (Apple/Oura)        |   events recorded in graph       |
|                   | • Causal Trigger vs. Prodrome Disentangler  |                                  |
+-------------------+---------------------------------------------+----------------------------------+
| Phase 3: Clinic   | • Physician Refractory Dossier Generator    | • 10,000 active users            |
| (Months 10–15)    | • Payer CGRP Step-Therapy Prior-Auth Export | • First 5 neurology clinic pilots|
|                   | • Neurologist Shared Decision-Making Portal | • Measurable 20% MOH reduction   |
+-------------------+---------------------------------------------+----------------------------------+
| Phase 4: Platform | • De-identified Real-World Evidence Network | • 50,000+ active users           |
| (Months 16+)      | • Biopharma Phase IV Comparative Analytics  | • First biopharma RWE license    |
|                   | • Closed-Loop DTx Device Integrations       |                                  |
+-------------------+---------------------------------------------+----------------------------------+
```

---

## 11. Success Metrics & Key Performance Indicators (KPIs)

1. **Clinical Efficacy**:
   - **Primary Endpoint**: 2-hour pain-freedom rate (Target: $\ge 25\%$ relative improvement over patient baseline).
   - **Route-Switch Efficacy**: Reduction in rescue regurgitation/vomiting rate in patients with nausea (Target: $\ge 40\%$ reduction).
   - **MOH Avoidance**: Percentage of high-frequency users who avoid exceeding the 10-day monthly limit (Target: $\ge 90\%$).
2. **Engagement & UX Friction**:
   - **In-Attack Logging Speed**: Average time to complete emergency attack intake (Target: $<15$ seconds).
   - **Outcome Response Rate**: Response rate to the 2-hour and 24-hour push check-ins (Target: $\ge 65\%$).
3. **Data Compounding**:
   - Number of verified `Context → Intervention → Timing → Response → Outcome` tuples added to the proprietary graph per month (Target: $>5,000/\text{month}$ by Month 6).

---

## 12. Regulatory Posture & Safety Risk Management

* **FDA Software as a Medical Device (SaMD) Classification**:
  - MigraineRelief operates under **FDA Enforcement Discretion for Clinical Decision Support (CDS) Software** and General Wellness guidelines.
  - The software does not unilaterally prescribe drugs; it organizes, visualizes, and optimizes the timing of *already-prescribed* patient medications according to FDA package inserts and published clinical protocols.
* **Liability Safeguards**:
  - The deterministic SNOOP4 gate screens every interaction for life-threatening secondary headache etiologies.
  - Transparent epistemic tags ensure patients and clinicians understand the scientific certainty of every insight.
  - Mandatory clinical onboarding disclaimer: *"MigraineRelief is an educational precision decision copilot designed to assist patient self-management and physician shared decision-making. Always consult your neurologist before altering medical regimens."*
