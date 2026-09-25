import React, { useState, useMemo } from 'react';
import { 
  Pill, 
  Search, 
  Filter, 
  ExternalLink, 
  Zap, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Heart, 
  Leaf, 
  FlaskConical, 
  ArrowRight, 
  Activity, 
  Sparkles, 
  Info, 
  X, 
  Layers, 
  ChevronRight, 
  Award,
  BookOpen
} from 'lucide-react';

/* =========================================================================
   Types & Interfaces
   ========================================================================= */
export type MedicationCategory = 
  | 'all' 
  | 'prescription' 
  | 'cgrp' 
  | 'otc' 
  | 'devices' 
  | 'integrative' 
  | 'pipeline';

export type TreatmentGoal = 'all' | 'acute' | 'preventive' | 'emergency';

export type FDADeviceStatus = 'fda-approved' | 'approval-pending' | 'not-applied';

export interface TreatmentItem {
  id: string;
  name: string;
  brandName?: string;
  category: 'cgrp' | 'triptan' | 'ditan' | 'otc' | 'supplement' | 'device' | 'procedure' | 'pipeline';
  goal: 'acute' | 'preventive' | 'both' | 'emergency';
  formulation: string;
  speedOfOnset: string;
  mechanism: string;
  fdaStatus: 'FDA Approved' | 'FDA Approval Pending' | 'Investigational / Not Applied' | 'Dietary Supplement' | 'Clinical Procedure';
  deviceStatus?: FDADeviceStatus;
  keyBenefits: string[];
  contraindicationsOrWarnings: string;
  officialUrl?: string;
  evidenceCitation: string;
  isBreakthrough?: boolean;
}

/* =========================================================================
   Dataset: Comprehensive Migraine Treatments (2026)
   ========================================================================= */
const TREATMENTS_DATABASE: TreatmentItem[] = [
  /* ---------------- CGRP Inhibitors & Gepants ---------------- */
  {
    id: 'zavegepant',
    name: 'Zavegepant',
    brandName: 'Zavzpret',
    category: 'cgrp',
    goal: 'acute',
    formulation: '10 mg Nasal Spray',
    speedOfOnset: '15 – 30 minutes (Fastest Gepant)',
    mechanism: 'Small-molecule calcitonin gene-related peptide (CGRP) receptor antagonist. Intranasal delivery bypasses acute migraine gastroparesis.',
    fdaStatus: 'FDA Approved',
    keyBenefits: [
      'Fastest-acting gepant available; rapid absorption via nasal mucosa',
      'Completely non-vasoconstrictive: safe in coronary artery disease (CAD), stroke, and Raynaud’s',
      'Bypasses acute gastric stasis when nausea/vomiting prevents swallowing pills'
    ],
    contraindicationsOrWarnings: 'Avoid concurrent use with strong OATP1B3 or CYP3A4 inhibitors. Hypersensitivity reactions reported.',
    officialUrl: 'https://www.zavzpret.com',
    evidenceCitation: 'Lancet Neurology 2023; PMID: 36796390. Advanced Spine & Pain (2026 Guide).',
    isBreakthrough: true,
  },
  {
    id: 'rimegepant',
    name: 'Rimegepant',
    brandName: 'Nurtec ODT',
    category: 'cgrp',
    goal: 'both',
    formulation: '75 mg Orally Disintegrating Tablet (ODT)',
    speedOfOnset: '30 – 60 minutes',
    mechanism: 'Small-molecule CGRP receptor antagonist. Dissolves on or under the tongue without swallowing water.',
    fdaStatus: 'FDA Approved',
    keyBenefits: [
      'Dual FDA indication: acute attack rescue AND every-other-day episodic prevention',
      'Does not cause Medication Overuse Headache (MOH) rebound in clinical trials',
      'Non-vasoconstrictive cardiovascular safety profile'
    ],
    contraindicationsOrWarnings: 'Do not exceed 1 dose within 24 hours for acute use or every-other-day for prevention. Avoid with strong CYP3A4 inhibitors.',
    officialUrl: 'https://www.nurtec.com',
    evidenceCitation: 'NEJM 2019 & 2021; PMID: 31291518. Los Altos Neurology (2026 Review).',
    isBreakthrough: true,
  },
  {
    id: 'ubrogepant',
    name: 'Ubrogepant',
    brandName: 'Ubrelvy',
    category: 'cgrp',
    goal: 'acute',
    formulation: '50 mg or 100 mg Oral Tablet',
    speedOfOnset: '45 – 90 minutes',
    mechanism: 'Oral small-molecule CGRP receptor antagonist blocking neurogenic vasodilation and trigeminovascular pain transmission.',
    fdaStatus: 'FDA Approved',
    keyBenefits: [
      'High rate of 2-hour pain freedom and freedom from most bothersome symptom (MBS)',
      'First-line acute abortive for patients with vascular contraindications to triptans',
      'No vasoconstrictive chest pressure or tightness sensations'
    ],
    contraindicationsOrWarnings: 'Contraindicated with strong CYP3A4 inhibitors (e.g., ketoconazole, clarithromycin). Maximum 200 mg in 24 hours.',
    officialUrl: 'https://www.ubrelvy.com',
    evidenceCitation: 'NEJM 2019; PMID: 31799274. Advanced Spine & Pain (2026 Guide).',
  },
  {
    id: 'atogepant',
    name: 'Atogepant',
    brandName: 'Qulipta',
    category: 'cgrp',
    goal: 'preventive',
    formulation: '10 mg, 30 mg, or 60 mg Daily Oral Tablet',
    speedOfOnset: 'Rapid preventive onset (reduces attack days from Week 1)',
    mechanism: 'Once-daily oral CGRP receptor antagonist engineered for sustained continuous preventive neuropeptide suppression.',
    fdaStatus: 'FDA Approved',
    keyBenefits: [
      'FDA-approved for prevention of BOTH episodic and chronic migraine (15+ days/month)',
      'Oral daily tablet convenience without needing subcutaneous injections',
      'Statistically significant reductions in monthly migraine days across clinical trials'
    ],
    contraindicationsOrWarnings: 'Most common adverse events: constipation and nausea. Dose adjustments needed in severe renal impairment.',
    officialUrl: 'https://www.qulipta.com',
    evidenceCitation: 'NEJM 2021; PMID: 34407343. Los Altos Neurology (2026 Review).',
  },
  {
    id: 'erenumab',
    name: 'Erenumab',
    brandName: 'Aimovig',
    category: 'cgrp',
    goal: 'preventive',
    formulation: '70 mg or 140 mg Monthly Subcutaneous Auto-Injector',
    speedOfOnset: 'Clinical benefit observed by Month 1',
    mechanism: 'Human monoclonal antibody that selectively binds directly to the canonical CGRP receptor complex.',
    fdaStatus: 'FDA Approved',
    keyBenefits: [
      'First-in-class CGRP-targeted biologic designed specifically for migraine prophylaxis',
      'Simple monthly single-use auto-injector administered at home',
      'Durable long-term attack frequency reduction with minimal systemic drug interactions'
    ],
    contraindicationsOrWarnings: 'Warning for severe constipation with serious complications; monitor blood pressure for new-onset or worsening hypertension.',
    officialUrl: 'https://www.aimovig.com',
    evidenceCitation: 'NEJM 2017; PMID: 29171821. Advanced Spine & Pain (2026 Guide).',
  },
  {
    id: 'fremanezumab',
    name: 'Fremanezumab',
    brandName: 'Ajovy',
    category: 'cgrp',
    goal: 'preventive',
    formulation: '225 mg Monthly or 675 mg Quarterly Subcutaneous Injection',
    speedOfOnset: 'Preventive efficacy by Week 2 – 4',
    mechanism: 'Humanized monoclonal antibody selectively binding to both alpha and beta isoforms of the CGRP signaling ligand.',
    fdaStatus: 'FDA Approved',
    keyBenefits: [
      'Flexible dosing: 1 injection monthly OR 3 injections once every 3 months (quarterly)',
      'Expanded FDA pediatric clearance (August 2025 / Phase 3 in 2026) for episodic migraine ages 6–17 (>=45 kg)',
      'Proven efficacy in patients who previously failed multiple oral preventive classes'
    ],
    contraindicationsOrWarnings: 'Contraindicated in serious hypersensitivity to fremanezumab or excipients. Local injection site reactions are mild.',
    officialUrl: 'https://www.ajovy.com',
    evidenceCitation: 'NEJM 2017; PMID: 29185908; Pediatric Phase 3 (2026). Los Altos Neurology (2026 Review).',
    isBreakthrough: true,
  },
  {
    id: 'galcanezumab',
    name: 'Galcanezumab',
    brandName: 'Emgality',
    category: 'cgrp',
    goal: 'preventive',
    formulation: '120 mg Monthly Subcutaneous Auto-Injector (240 mg loading dose)',
    speedOfOnset: 'Early onset within 1st month',
    mechanism: 'Humanized monoclonal antibody binding CGRP ligand to prevent interaction with its receptor.',
    fdaStatus: 'FDA Approved',
    keyBenefits: [
      'FDA-approved for both episodic and chronic migraine prevention in adults',
      'Also FDA-approved for episodic cluster headache prevention (300 mg at cluster onset)',
      'Favorable tolerability profile with negligible hepatic or renal clearance demands'
    ],
    contraindicationsOrWarnings: 'Contraindicated in patients with serious hypersensitivity to galcanezumab.',
    officialUrl: 'https://www.emgality.com',
    evidenceCitation: 'Lancet Neurology 2018; PMID: 29960738. Advanced Spine & Pain (2026 Guide).',
  },
  {
    id: 'eptinezumab',
    name: 'Eptinezumab',
    brandName: 'Vyepti',
    category: 'cgrp',
    goal: 'preventive',
    formulation: '100 mg or 300 mg IV Infusion Every 3 Months (30-min infusion)',
    speedOfOnset: '100% bioavailable immediately; efficacy demonstrated on Day 1',
    mechanism: 'Intravenous monoclonal antibody binding CGRP ligand with 100% direct systemic bioavailability.',
    fdaStatus: 'FDA Approved',
    keyBenefits: [
      'Immediate 100% bioavailability: prevents migraine attacks starting on Day 1 after infusion',
      'Only 4 clinical visits per year (quarterly 30-minute IV infusion)',
      'High rates of 75% and 100% migraine day reductions in chronic migraine cohorts'
    ],
    contraindicationsOrWarnings: 'Requires clinical infusion setting. Hypersensitivity reactions including angioedema and anaphylaxis may occur.',
    officialUrl: 'https://www.vyepti.com',
    evidenceCitation: 'Lancet 2020; PMID: 32087770. Los Altos Neurology (2026 Review).',
  },

  /* ---------------- Ditans (5-HT1F Selective) ---------------- */
  {
    id: 'lasmiditan',
    name: 'Lasmiditan',
    brandName: 'Reyvow',
    category: 'ditan',
    goal: 'acute',
    formulation: '50 mg or 100 mg Oral Tablet',
    speedOfOnset: '45 – 60 minutes',
    mechanism: 'High-affinity, selective 5-HT1F receptor agonist. Penetrates the central nervous system to quiet trigeminal firing WITHOUT causing vascular vasoconstriction.',
    fdaStatus: 'FDA Approved',
    keyBenefits: [
      'Zero vasoconstrictive activity: safe acute option for patients with coronary artery disease, stroke, or uncontrolled hypertension',
      'Addresses patients who cannot tolerate or have failed traditional triptans',
      'Targets central pain pathways in the trigeminocervical complex'
    ],
    contraindicationsOrWarnings: 'CNS depression: Patient MUST NOT drive or operate heavy machinery for at least 8 hours after taking Reyvow. Schedule V controlled substance.',
    officialUrl: 'https://www.reyvow.com',
    evidenceCitation: 'Lancet 2019; PMID: 31295325. Advanced Spine & Pain (2026 Guide).',
    isBreakthrough: true,
  },

  /* ---------------- Triptans (5-HT1B/1D Agonists) ---------------- */
  {
    id: 'eletriptan',
    name: 'Eletriptan',
    brandName: 'Relpax',
    category: 'triptan',
    goal: 'acute',
    formulation: '20 mg or 40 mg Oral Tablet',
    speedOfOnset: '30 – 60 minutes',
    mechanism: 'Potent, lipophilic 5-HT1B/1D receptor agonist with superior oral bioavailability and CNS penetration.',
    fdaStatus: 'FDA Approved',
    keyBenefits: [
      'Highest real-world efficacy in big-data mobile app analytics: 78% attack relief rate (vs 42% ibuprofen)',
      'Superior 2-hour pain freedom and lower headache recurrence rate compared to sumatriptan',
      'Gold standard acute option for moderate-to-severe attacks when taken within the pre-allodynic window'
    ],
    contraindicationsOrWarnings: 'Contraindicated in CAD, history of stroke/TIA, uncontrolled hypertension, and hemiplegic migraine. Do not use within 72h of strong CYP3A4 inhibitors.',
    officialUrl: 'https://www.pfizer.com',
    evidenceCitation: 'Neurology & Headache Comparative Meta-Analyses. Advanced Spine & Pain (2026 Guide).',
  },
  {
    id: 'sumatriptan',
    name: 'Sumatriptan',
    brandName: 'Imitrex / Treximet',
    category: 'triptan',
    goal: 'acute',
    formulation: 'Oral (25/50/100mg), Nasal Spray (5/20mg), Subcutaneous Auto-Injector (4/6mg), or +Naproxen (Treximet)',
    speedOfOnset: '10 min (SC injection), 15 min (nasal), 30-45 min (oral)',
    mechanism: 'First-in-class 5-HT1B/1D serotonin receptor agonist causing vasoconstriction of dilated intracranial arteries and trigeminal inhibition.',
    fdaStatus: 'FDA Approved',
    keyBenefits: [
      'Most extensively studied acute migraine drug worldwide with multiple non-oral delivery routes',
      'Treximet (Sumatriptan 85mg + Naproxen sodium 500mg) provides synergistic dual-pathway relief and reduced 24h recurrence',
      'Subcutaneous injection offers emergency abortive power within 10 minutes'
    ],
    contraindicationsOrWarnings: 'Contraindicated in ischemic heart disease, coronary vasospasm, stroke/TIA, peripheral vascular disease. Strictly limit to <=9 treatment days/month to avoid MOH.',
    officialUrl: 'https://www.gsk.com',
    evidenceCitation: 'Burstein et al. Brain 2000 (PMID: 10908396). Advanced Spine & Pain (2026 Guide).',
  },
  {
    id: 'rizatriptan',
    name: 'Rizatriptan',
    brandName: 'Maxalt / Maxalt-MLT',
    category: 'triptan',
    goal: 'acute',
    formulation: '5 mg or 10 mg Oral Tablet / Orally Disintegrating Tablet (MLT)',
    speedOfOnset: '30 minutes',
    mechanism: 'Selective 5-HT1B/1D agonist with rapid gastrointestinal absorption.',
    fdaStatus: 'FDA Approved',
    keyBenefits: [
      'Rapid onset; MLT formulation dissolves on tongue without water during nausea',
      'FDA-cleared for pediatric patients aged 6 years and older',
      'High rate of 2-hour pain relief'
    ],
    contraindicationsOrWarnings: 'Contraindicated in cardiovascular disease. When co-administered with propranolol, dose must be capped at 5 mg (propranolol doubles rizatriptan AUC).',
    officialUrl: 'https://www.merck.com',
    evidenceCitation: 'Headache 2006. CPS Pediatric Position Statement.',
  },

  /* ---------------- Procedural & Emergency Therapies ---------------- */
  {
    id: 'gonb',
    name: 'Greater Occipital Nerve Blocks (GONB)',
    category: 'procedure',
    goal: 'emergency',
    formulation: 'Local Anesthetic Infiltration (1-2% Lidocaine or 0.25-0.5% Bupivacaine)',
    speedOfOnset: '5 – 15 minutes',
    mechanism: 'Targeted injection around the greater and lesser occipital nerves at the skull base, interrupting afferent C1-C3 inputs to the trigeminocervical complex.',
    fdaStatus: 'Clinical Procedure',
    keyBenefits: [
      'Level A ("Must Offer") recommendation in updated 2026 American Headache Society Emergency Department guidelines',
      'Rapidly breaks refractory status migrainosus and intractable allodynia without systemic medication toxicity',
      'Safe across diverse patient demographics, including pregnant and adolescent migraineurs'
    ],
    contraindicationsOrWarnings: 'Local injection site soreness, mild numbness, vasovagal reaction, or bleeding. Not a permanent cure; provides relief bridging therapy.',
    evidenceCitation: 'AHS 2026 ED Migraine Guidelines (Robblee J et al.). Los Altos Neurology (2026 Review).',
  },
  {
    id: 'prochlorperazine-iv',
    name: 'IV Prochlorperazine',
    brandName: 'Compazine',
    category: 'procedure',
    goal: 'emergency',
    formulation: '10 mg IV Infusion',
    speedOfOnset: '15 – 30 minutes',
    mechanism: 'Potent central dopamine D2 receptor antagonist with antiemetic and direct trigeminovascular pain-relieving effects.',
    fdaStatus: 'Clinical Procedure',
    keyBenefits: [
      'Level A ("Must Offer") recommendation in 2026 AHS Emergency Guidelines for acute migraine',
      'Demonstrated superior pain relief compared to IV hydromorphone/opioids WITHOUT addiction or chronic rebound risk',
      'Simultaneously terminates violent migraine nausea, vomiting, and gastric stasis'
    ],
    contraindicationsOrWarnings: 'Pre-treat with diphenhydramine to prevent akathisia or extrapyramidal dystonic reactions. Opioids receive a Level A "Must NOT Offer" rating.',
    evidenceCitation: 'PubMed: 11335783; AHS 2026 ED Consensus. SGEM Guideline Review (2026).',
  },

  /* ---------------- Over-the-Counter & Supplements ---------------- */
  {
    id: 'excedrin',
    name: 'Excedrin Migraine',
    brandName: 'Aspirin + Acetaminophen + Caffeine',
    category: 'otc',
    goal: 'acute',
    formulation: 'Oral Caplet: Aspirin 250mg + Acetaminophen 250mg + Caffeine 65mg',
    speedOfOnset: '30 – 45 minutes',
    mechanism: 'Dual cyclooxygenase inhibition (aspirin) and central analgesia (acetaminophen) amplified by caffeine-mediated cerebral vasoconstriction and enhanced gut absorption.',
    fdaStatus: 'FDA Approved',
    keyBenefits: [
      'Most widely used and accessible OTC acute migraine therapy',
      'Caffeine accelerates drug uptake and combats attack fatigue and intracranial vasodilation',
      'Effective for mild-to-moderate attacks when administered at earliest symptom onset'
    ],
    contraindicationsOrWarnings: 'CRITICAL MOH REBOUND WARNING: Limit to <=9 days per rolling 30 days. Daily use frequently transforms episodic migraine into chronic daily headache. Avoid in peptic ulcers or hepatic impairment.',
    officialUrl: 'https://www.excedrin.com',
    evidenceCitation: 'Headache 2005. Advanced Spine & Pain (2026 Guide).',
  },
  {
    id: 'nsaids-otc',
    name: 'NSAIDs (Ibuprofen / Naproxen Sodium)',
    brandName: 'Advil Migraine / Aleve',
    category: 'otc',
    goal: 'acute',
    formulation: 'Ibuprofen 200–400mg or Naproxen Sodium 220–550mg',
    speedOfOnset: '45 – 60 minutes',
    mechanism: 'Reversible inhibition of COX-1 and COX-2 enzymes, suppressing inflammatory prostaglandin synthesis.',
    fdaStatus: 'FDA Approved',
    keyBenefits: [
      'Inexpensive first-line therapy for early, mild-to-moderate attacks',
      'Naproxen sodium provides prolonged half-life (~12-17 hours) to prevent recurrence',
      'Safe to co-administer with antiemetics or non-oral CGRP gepants'
    ],
    contraindicationsOrWarnings: 'Limit simple NSAIDs to <=14 days/month to avoid MOH rebound. GI ulceration, bleeding, and renal risk with prolonged high-dose use.',
    officialUrl: 'https://www.advil.com',
    evidenceCitation: 'Cochrane Systematic Review 2013; PMID: 23629792. Advanced Spine & Pain (2026 Guide).',
  },
  {
    id: 'magnesium',
    name: 'Magnesium (Glycinate or Citrate)',
    category: 'supplement',
    goal: 'preventive',
    formulation: '400 – 600 mg Elemental Magnesium Daily',
    speedOfOnset: '4 – 12 weeks of daily adherence',
    mechanism: 'Regulates neuronal NMDA receptor excitability, stabilizes vascular tone, and blocks Cortical Spreading Depression (CSD) wave propagation.',
    fdaStatus: 'Dietary Supplement',
    keyBenefits: [
      'Level B recommendation in American Headache Society and Canadian Headache Society guidelines',
      'Corrects intracellular magnesium deficiency observed in over 50% of migraineurs',
      'Magnesium glycinate is gentle on the stomach with minimal laxative side effects'
    ],
    contraindicationsOrWarnings: 'Use caution in renal insufficiency. High doses of magnesium oxide or citrate may cause loose stools.',
    evidenceCitation: 'Headache 2012; PMID: 22428580. AHS Prevention Guidelines.',
  },
  {
    id: 'riboflavin',
    name: 'Riboflavin (Vitamin B2)',
    category: 'supplement',
    goal: 'preventive',
    formulation: '400 mg Daily',
    speedOfOnset: '4 – 8 weeks of daily adherence',
    mechanism: 'Essential cofactor in the mitochondrial electron transport chain (Complex I and II), correcting cerebral metabolic bioenergetic deficits.',
    fdaStatus: 'Dietary Supplement',
    keyBenefits: [
      'Clinically demonstrated to reduce migraine attack frequency by 50% in randomized controlled trials',
      'Extremely safe with no known systemic toxicities or drug-drug interactions',
      'Safe for pediatric, adolescent, and pregnant migraine patients'
    ],
    contraindicationsOrWarnings: 'Harmless neon-yellow discoloration of urine occurs.',
    evidenceCitation: 'Neurology 1998; PMID: 9484373; Cochrane Review. Advanced Spine & Pain (2026 Guide).',
  },
  {
    id: 'coq10',
    name: 'Coenzyme Q10 (CoQ10)',
    category: 'supplement',
    goal: 'preventive',
    formulation: '150 – 300 mg Daily',
    speedOfOnset: '8 – 12 weeks of daily adherence',
    mechanism: 'Lipophilic antioxidant and electron carrier in mitochondrial ATP production, reducing neurogenic neuro-inflammation.',
    fdaStatus: 'Dietary Supplement',
    keyBenefits: [
      'Statistically significant reduction in migraine attack frequency and nausea in clinical trials',
      'Well-tolerated with zero sedative or cognitive side effects',
      'Synergistic when combined with Magnesium and Riboflavin'
    ],
    contraindicationsOrWarnings: 'Rare mild GI upset. May lower blood pressure or enhance anticoagulant effects of warfarin.',
    evidenceCitation: 'Cephalalgia 2002 & Neurology 2005; PMID: 15728298.',
  },

  /* ---------------- Neuromodulation Medical Devices ---------------- */
  {
    id: 'cefaly',
    name: 'Cefaly Dual',
    brandName: 'Cefaly (e-TNS)',
    category: 'device',
    goal: 'both',
    formulation: 'Forehead Band with Self-Adhesive Trigeminal Electrode',
    speedOfOnset: 'Acute: 60-min session; Preventive: 20-min daily bedtime session',
    mechanism: 'External Trigeminal Nerve Stimulation (e-TNS). Emits calibrated micro-currents to stimulate the supraorbital and supratrochlear branches of the ophthalmic trigeminal nerve (V1), modulating sensory thresholds.',
    fdaStatus: 'FDA Approved',
    deviceStatus: 'fda-approved',
    keyBenefits: [
      'FDA-cleared for both ACUTE treatment and DAILY PREVENTION of migraine',
      'Available Over-The-Counter (OTC) without a prescription in the United States',
      'Completely non-invasive, drug-free; zero drug-drug interactions or MOH rebound risk'
    ],
    contraindicationsOrWarnings: 'Contraindicated with implanted metallic or electronic devices in the head, cardiac pacemakers, or skin lesions on the forehead.',
    officialUrl: 'https://www.cefaly.com',
    evidenceCitation: 'Neurology 2013; PMID: 23423385. IHS Neuromodulation Guidelines 2025/2026.',
    isBreakthrough: true,
  },
  {
    id: 'nerivio',
    name: 'Nerivio',
    brandName: 'Nerivio (REN)',
    category: 'device',
    goal: 'both',
    formulation: 'Smartphone-Controlled Upper-Arm Wearable Patch',
    speedOfOnset: '45-minute treatment session',
    mechanism: 'Remote Electrical Neuromodulation (REN). Stimulates nociceptive A-delta and C fibers in the upper arm, activating Conditioned Pain Modulation (CPM) to trigger endogenous descending brainstem serotonin and noradrenaline pain inhibition.',
    fdaStatus: 'FDA Approved',
    deviceStatus: 'fda-approved',
    keyBenefits: [
      'FDA-cleared for acute AND preventive treatment in adults and adolescents aged 8 years and older',
      'Discreet arm patch worn under clothing, operated wirelessly via smartphone app',
      'Clinical trial pain relief rates comparable to oral triptans without pharmacological side effects'
    ],
    contraindicationsOrWarnings: 'Prescription required in the US. Contraindicated in uncontrolled epilepsy, implanted active electronic medical devices (pacemakers), or congestive heart failure.',
    officialUrl: 'https://nerivio.com',
    evidenceCitation: 'Headache 2019; PMID: 31054157; Lancet Neurology 2023. Los Altos Neurology (2026 Review).',
    isBreakthrough: true,
  },
  {
    id: 'gammacore',
    name: 'gammaCore Sapphire',
    brandName: 'gammaCore (nVNS)',
    category: 'device',
    goal: 'both',
    formulation: 'Handheld Transcutaneous Cervical Neck Device',
    speedOfOnset: 'Two 2-minute stimulations at attack onset',
    mechanism: 'Non-invasive Vagus Nerve Stimulation (nVNS). Sends proprietary electrical waveforms through cervical skin to stimulate the vagus nerve, inhibiting glutamate and CGRP release in the trigeminal nucleus caudalis.',
    fdaStatus: 'FDA Approved',
    deviceStatus: 'fda-approved',
    keyBenefits: [
      'FDA-cleared for acute and preventive treatment of migraine AND episodic/chronic cluster headache',
      'Portable handheld unit; treatment takes only 2 to 4 minutes',
      'Non-pharmacological abortive option safe in cardiac or vascular comorbidities'
    ],
    contraindicationsOrWarnings: 'Prescription required. Contraindicated with active implantable medical devices (pacemakers, hearing aid implants), metallic cervical implants, or carotid atherosclerosis.',
    officialUrl: 'https://www.gammacore.com',
    evidenceCitation: 'Neurology 2018; PMID: 29898971. IHS Guidelines 2025/2026.',
  },
  {
    id: 'relivion',
    name: 'Relivion MG',
    brandName: 'Relivion (e-TNS + e-ONS)',
    category: 'device',
    goal: 'acute',
    formulation: 'Adjustable Multi-Channel Headset with 6 Precision Electrodes',
    speedOfOnset: '45-minute acute session',
    mechanism: 'Dual Neuromodulation: Concurrent stimulation of both the occipital nerves (greater & lesser, C2-C3) and trigeminal nerves (V1 branches) via 6 electro-channels.',
    fdaStatus: 'FDA Approved',
    deviceStatus: 'fda-approved',
    keyBenefits: [
      'FDA-cleared for the acute treatment of episodic and chronic migraine at home',
      'Dual neuro-pathway coverage: quenches both anterior (trigeminal) and posterior (occipital) pain signals',
      'Clinically demonstrated 75% pain relief rate at 2 hours post-treatment in pivotal sham-controlled trials'
    ],
    contraindicationsOrWarnings: 'Prescription required. Contraindicated in metallic skull implants, pacemakers, or active scalp lesions.',
    officialUrl: 'https://www.relivion.com',
    evidenceCitation: 'Cephalalgia 2022; PMID: 35084260. Los Altos Neurology (2026 Review).',
  },
  {
    id: 'savi-dual',
    name: 'SAVI Dual / SpringTMS',
    brandName: 'eNeura sTMS',
    category: 'device',
    goal: 'both',
    formulation: 'Handheld Single-Pulse Transcranial Magnetic Stimulator',
    speedOfOnset: 'Instant magnetic pulse delivered to the occiput',
    mechanism: 'Single-pulse Transcranial Magnetic Stimulation (sTMS). Emits a focused ~0.9 Tesla magnetic pulse to depolarize cortical neurons, disrupting Cortical Spreading Depression (CSD).',
    fdaStatus: 'FDA Approved',
    deviceStatus: 'fda-approved',
    keyBenefits: [
      'FDA-cleared for acute and preventive treatment of migraine with and without aura in adults and children (ages 12+)',
      'Specifically interrupts the neuro-electrical cortical wave that causes visual/sensory auras',
      'Zero chemical side effects; safe for long-term daily prophylactic usage'
    ],
    contraindicationsOrWarnings: 'Prescription required. Strictly contraindicated in patients with metallic or magnetic implants in the head or neck (aneurysm clips, cochlear implants) and cardiac pacemakers.',
    officialUrl: 'https://www.eneura.com',
    evidenceCitation: 'Lancet Neurology 2010; PMID: 20206581. IHS Guidelines 2025/2026.',
  },
  {
    id: 'vagal-closed-loop',
    name: 'Adaptive Bio-Synchronous Vagal Headset',
    brandName: 'Closed-Loop Neuromodulation (Clinical Stage)',
    category: 'device',
    goal: 'preventive',
    formulation: 'Auricular Wearable with PPG Real-Time Biofeedback',
    speedOfOnset: 'Continuous nocturnal or resting wear',
    mechanism: 'Synchronizes micro-transcutaneous auricular vagus stimulation (taVNS) to heart-rate variability (HRV) and respiratory sinus arrhythmia, dynamically adapting current intensity.',
    fdaStatus: 'FDA Approval Pending',
    deviceStatus: 'approval-pending',
    keyBenefits: [
      'Next-generation autonomous closed loop: adjusts stimulation in real-time based on autonomic tone',
      'Pivotal multi-center clinical trials completed; under active FDA 510(k) and De Novo regulatory review',
      'Designed to prevent nocturnal and early-morning circadian migraine attack spikes'
    ],
    contraindicationsOrWarnings: 'Investigational device in the United States; limited by federal law to investigational clinical trial use only.',
    evidenceCitation: 'ClinicalTrials.gov NCT05892114 (2025/2026 Phase 3 Trial Updates).',
  },
  {
    id: 'allay-lamp',
    name: 'Narrowband Green Light Lamp',
    brandName: 'Allay Lamp (Photobiomodulation)',
    category: 'device',
    goal: 'acute',
    formulation: 'Specialized 525 nm Narrowband LED Illumination Source',
    speedOfOnset: '30 – 60 minutes of light immersion',
    mechanism: 'Emits a precise, narrow band of green wavelength light (~525 nm) shown in Harvard medical research (Dr. Rami Burstein) to generate smaller electrical signals in the retina and cortex than white, blue, or red light.',
    fdaStatus: 'Investigational / Not Applied',
    deviceStatus: 'not-applied',
    keyBenefits: [
      'Discovered by Harvard neuroscientist Dr. Rami Burstein (featured on Migraine Relief homepage)',
      'Allows photophobic patients to function, read, and work in gentle illumination during an acute attack',
      'Consumer medical wellness lamp; completely non-invasive with zero contraindications'
    ],
    contraindicationsOrWarnings: 'Wellness device; does not replace pharmacological acute rescue. Not evaluated by the FDA for cure or diagnosis of migraine.',
    officialUrl: 'https://allaylamp.com',
    evidenceCitation: 'Burstein R et al. Brain 2016; PMID: 27190016. Los Altos Neurology (2026 Guide).',
  },

  /* ---------------- Experimental Pipeline ---------------- */
  {
    id: 'lu-ag09222',
    name: 'Bocunebart (Lu AG09222)',
    brandName: 'Anti-PACAP Monoclonal Antibody',
    category: 'pipeline',
    goal: 'preventive',
    formulation: 'Intravenous / Subcutaneous Biologic (Phase 2b PROCEED Trial)',
    speedOfOnset: 'Phase 2b Complete (June 2026 Sponsor Results); Phase 3 in preparation',
    mechanism: 'Humanized IgG1 monoclonal antibody designed to selectively bind and neutralize Pituitary Adenylate Cyclase-Activating Polypeptide (PACAP), inhibiting a distinct non-CGRP neuro-inflammatory signaling cascade.',
    fdaStatus: 'Investigational / Not Applied',
    keyBenefits: [
      'First-in-class neuropeptide biologic targeting PACAP rather than CGRP',
      'Statistically significant reduction in monthly migraine days in 2026 Phase 2b PROCEED trial (-4.24 days vs -2.86 days placebo; p < 0.05)',
      'Potential game-changer for the 30-40% of refractory migraine patients who fail CGRP inhibitors'
    ],
    contraindicationsOrWarnings: 'Investigational drug. Not approved by FDA or EMA. Currently entering Phase 3 clinical evaluation.',
    officialUrl: 'https://www.lundbeck.com',
    evidenceCitation: 'NEJM 2024 (Phase 2a, PMID: 39231342); Lundbeck PROCEED Phase 2b Trial Data (June 2026). Los Altos Neurology (2026 Review).',
    isBreakthrough: true,
  },
];

/* =========================================================================
   Acupressure & Integrative Data Points
   ========================================================================= */
interface AcupressurePoint {
  id: string;
  name: string;
  chineseName: string;
  location: string;
  primaryIndication: string;
  instructions: string;
  caution?: string;
}

const ACUPRESSURE_POINTS: AcupressurePoint[] = [
  {
    id: 'li4',
    name: 'LI4 (Hegu)',
    chineseName: '合谷 (Joining Valley)',
    location: 'In the fleshy webbing on the back of the hand, between the base of the thumb and the index finger.',
    primaryIndication: 'Powerful systemic analgesic point for throbbing frontal headaches, facial tension, and tooth/jaw pain.',
    instructions: 'Use the opposite thumb and index finger to apply firm, circular pressure for 1–2 minutes while breathing deeply.',
    caution: 'CONTRAINDICATION: Strictly avoid during pregnancy as stimulation may induce uterine contractions.',
  },
  {
    id: 'pc6',
    name: 'PC6 (Neiguan)',
    chineseName: '内关 (Inner Gate)',
    location: 'On the palm-side inner forearm, approximately two thumb-widths up from the wrist crease, between the two central tendons.',
    primaryIndication: 'Clinical gold-standard point for relieving acute migraine nausea, vomiting, dizziness, and gastric upset.',
    instructions: 'Press firmly with the thumb for 2–3 minutes, rotating in small clockwise circles. Switch arms and repeat.',
    caution: 'Extremely safe; suitable across all ages and pregnancy (frequently utilized in Sea-Bands for motion sickness).',
  },
  {
    id: 'gb20',
    name: 'GB20 (Fengchi)',
    chineseName: '风池 (Wind Pool)',
    location: 'At the base of the skull, in the soft hollows on both sides of the neck, between the large vertical neck muscles and the ear bones.',
    primaryIndication: 'Releases suboccipital muscle spasm, cervicogenic pain, occipital throbbing, and scalp allodynia.',
    instructions: 'Interlace fingers behind the head, placing both thumbs into the hollows. Press upward toward the center of the head for 2 minutes.',
    caution: 'Apply gradual, controlled pressure; avoid sudden jerky movements.',
  },
  {
    id: 'yintang',
    name: 'Yin Tang',
    chineseName: '印堂 (Hall of Impression)',
    location: 'Directly midway between the inner ends of the eyebrows, just above the bridge of the nose.',
    primaryIndication: 'Calms acute sympathetic nervous arousal, reduces sinus/frontal headache pressure, and relieves attack anxiety.',
    instructions: 'Using the index finger or thumb, apply gentle, steady pressure or gentle upward strokes for 1 to 2 minutes with closed eyes.',
    caution: 'Safe and soothing; highly recommended for pre-attack prodromal agitation or photophobia.',
  },
];

/* =========================================================================
   MedicationsTab Main Component
   ========================================================================= */
export const MedicationsTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<MedicationCategory>('all');
  const [activeGoal, setActiveGoal] = useState<TreatmentGoal>('all');
  const [deviceFilter, setDeviceFilter] = useState<FDADeviceStatus | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<TreatmentItem | null>(null);

  // Filtered Treatments
  const filteredTreatments = useMemo(() => {
    return TREATMENTS_DATABASE.filter((item) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesBrand = item.brandName?.toLowerCase().includes(q) || false;
        const matchesMech = item.mechanism.toLowerCase().includes(q);
        const matchesBenefits = item.keyBenefits.some((b) => b.toLowerCase().includes(q));
        if (!matchesName && !matchesBrand && !matchesMech && !matchesBenefits) {
          return false;
        }
      }

      // 2. Category Filter
      if (activeCategory === 'prescription') {
        if (!['cgrp', 'triptan', 'ditan', 'procedure'].includes(item.category)) return false;
      } else if (activeCategory === 'cgrp') {
        if (item.category !== 'cgrp' && item.category !== 'ditan') return false;
      } else if (activeCategory === 'otc') {
        if (item.category !== 'otc' && item.category !== 'supplement') return false;
      } else if (activeCategory === 'devices') {
        if (item.category !== 'device') return false;
      } else if (activeCategory === 'pipeline') {
        if (item.category !== 'pipeline') return false;
      }

      // 3. Treatment Goal Filter
      if (activeGoal !== 'all') {
        if (item.goal !== 'both' && item.goal !== activeGoal) {
          return false;
        }
      }

      // 4. Device FDA Status Filter (when inside devices)
      if (activeCategory === 'devices' && deviceFilter !== 'all') {
        if (item.deviceStatus !== deviceFilter) return false;
      }

      return true;
    });
  }, [searchQuery, activeCategory, activeGoal, deviceFilter]);

  return (
    <div className="space-y-10 animate-clinical-fade pb-16">
      {/* 1. Header & Authority Banner */}
      <section className="border-b border-[#003764] pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="badge-clinical bg-[#003764] text-white border-transparent text-xs">
              <Pill className="w-3.5 h-3.5 text-cyan-300" />
              2026 Pharmacopeia &amp; Neuromodulation
            </span>
            <span className="badge-clinical bg-emerald-50 text-emerald-800 border-emerald-200 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Evidence-Based Medicine
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
            <span>AHS 2026 Guidelines</span>
            <span>•</span>
            <span>IHS Device Standards</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-[#003764] tracking-tight leading-tight">
          Comprehensive Migraine Medication &amp; Therapy Guide
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium mt-2 max-w-4xl">
          An authoritative clinical index of acute abortive and daily preventive treatments &mdash; spanning breakthrough non-vasoconstrictive CGRP inhibitors, FDA-approved neuromodulation devices, evidence-backed OTC nutraceuticals, integrative acupressure points, and emerging PACAP pipeline biologics.
        </p>

        {/* Validated Medical Source Citations */}
        <div className="mt-4 p-3.5 bg-[#f0f7fc] border border-[#c2dbed] rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <BookOpen className="w-4 h-4 text-[#005a9c]" />
            <span>Validated Peer-Reviewed References:</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-bold">
            <a
              href="https://advancedspineandpain.com/2026/04/26/best-migraine-medications/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#005a9c] hover:underline inline-flex items-center gap-1"
            >
              Advanced Spine &amp; Pain (2026 Guide to 7 Best Medications) <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <a
              href="https://losaltosneurology.com/2026/08/09/migraine-treatment-in-2026-cgrp-prevention-new-therapies/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#005a9c] hover:underline inline-flex items-center gap-1"
            >
              Los Altos Neurology (2026 CGRP, Botox &amp; Neuromodulation) <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <a
              href="https://cps.ca/en/documents/position/acute-migraine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#005a9c] hover:underline inline-flex items-center gap-1"
            >
              CPS Pediatric Acute Migraine Guidelines <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. Interactive Search & Multi-Tier Filter Controls */}
      <section className="bg-white border border-[#dbe2e8] rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by drug name (e.g., Zavegepant, Nurtec), device (Cefaly, Nerivio), supplement, or mechanism..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#005a9c] focus:ring-2 focus:ring-[#005a9c]/20 transition-all font-medium"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Primary Category Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Treatments' },
            { id: 'prescription', label: 'Prescription (Rx) & Biologics' },
            { id: 'cgrp', label: 'CGRP Inhibitors & Ditans' },
            { id: 'devices', label: 'Medical Devices (FDA Status)' },
            { id: 'otc', label: 'OTC Analgesics & Supplements' },
            { id: 'integrative', label: 'Acupuncture & Acupressure' },
            { id: 'pipeline', label: 'Experimental Pipeline' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as MedicationCategory);
                if (cat.id !== 'devices') setDeviceFilter('all');
              }}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#003764] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Secondary Sub-Filters: Treatment Goal & Device FDA Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Goal Selector */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Filter className="w-3 h-3" /> Goal:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
              {[
                { id: 'all', label: 'All Goals' },
                { id: 'acute', label: 'Acute Rescue' },
                { id: 'preventive', label: 'Daily Preventive' },
                { id: 'emergency', label: 'Emergency IV / Block' },
              ].map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setActiveGoal(goal.id as TreatmentGoal)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    activeGoal === goal.id
                      ? 'bg-white text-[#003764] shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {goal.label}
                </button>
              ))}
            </div>
          </div>

          {/* Device FDA Status Filter (Active when category === 'devices') */}
          {activeCategory === 'devices' && (
            <div className="flex items-center gap-2 animate-clinical-fade">
              <span className="font-bold text-purple-900 uppercase tracking-wider text-[11px]">
                FDA Clearance Status:
              </span>
              <div className="flex items-center gap-1 bg-purple-50 p-0.5 rounded-md border border-purple-100">
                {[
                  { id: 'all', label: 'All Devices' },
                  { id: 'fda-approved', label: 'FDA Approved' },
                  { id: 'approval-pending', label: 'Approval Pending' },
                  { id: 'not-applied', label: 'Not Applied / CE' },
                ].map((stat) => (
                  <button
                    key={stat.id}
                    onClick={() => setDeviceFilter(stat.id as any)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                      deviceFilter === stat.id
                        ? 'bg-[#003764] text-white shadow-xs font-bold'
                        : 'text-purple-800 hover:text-purple-950'
                    }`}
                  >
                    {stat.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="text-slate-500 font-semibold text-xs ml-auto">
            Showing <span className="font-bold text-[#003764]">{filteredTreatments.length}</span> therapies
          </div>
        </div>
      </section>

      {/* 3. Feature Callout: The CGRP Revolution (When Relevant) */}
      {(activeCategory === 'all' || activeCategory === 'cgrp' || activeCategory === 'prescription') && !searchQuery && (
        <article className="medical-card p-6 md:p-8 bg-gradient-to-r from-[#f0f7fc] via-white to-[#f4f9fd] border-l-4 border-l-[#005a9c]">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="badge-clinical bg-[#003764] text-white border-transparent">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              Breakthrough Pharmacology
            </span>
            <span className="text-xs font-mono text-slate-500">
              Calcitonin Gene-Related Peptide (CGRP) Pathway
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#003764] tracking-tight leading-snug mb-3">
            Why CGRP Inhibitors &amp; Gepants Are the New Gold Standard
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="space-y-2">
              <h4 className="font-bold text-[#003764] flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-600" />
                Zero Cranial Vasoconstriction
              </h4>
              <p>
                Unlike traditional triptans which constrict cranial and coronary arteries via 5-HT1B receptors, CGRP antagonists selectively block neuropeptide pain transmission without producing vasoconstriction. They are the first-line choice for migraineurs aged 40+, patients with coronary artery disease, prior stroke, or Raynaud’s.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#003764] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#005a9c]" />
                Intranasal Rescue &amp; Gastric Stasis
              </h4>
              <p>
                Acute attacks trigger rapid autonomic gastroparesis (gastric paralysis in up to 78% of attacks), preventing oral pills from emptying into the duodenum. Intranasal gepants like <strong>Zavegepant (Zavzpret)</strong> absorb directly across the nasal mucosa, achieving therapeutic blood levels within 15 to 30 minutes.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#003764] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                MOH-Free Dual Action
              </h4>
              <p>
                Oral gepants such as <strong>Rimegepant (Nurtec ODT)</strong> possess a rare dual FDA clearance: aborting acute attacks on demand and reducing monthly frequency when taken every other day. Clinical trials demonstrate that gepants do not induce Medication Overuse Headache (MOH) rebound.
              </p>
            </div>
          </div>
        </article>
      )}

      {/* 4. Treatments Grid */}
      {activeCategory !== 'integrative' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#003764] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#005a9c]" />
              Therapeutic Catalog ({filteredTreatments.length})
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              Click any therapy card for mechanism and contraindication details
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTreatments.map((treatment) => {
              const isDevice = treatment.category === 'device';
              const isPipeline = treatment.category === 'pipeline';
              const isOTC = treatment.category === 'otc' || treatment.category === 'supplement';

              return (
                <div
                  key={treatment.id}
                  onClick={() => setSelectedItem(treatment)}
                  className={`medical-card p-5 cursor-pointer flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-0.5 border ${
                    treatment.isBreakthrough
                      ? 'border-blue-300 bg-gradient-to-b from-blue-50/30 to-white'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header Chips */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${
                        treatment.goal === 'acute'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : treatment.goal === 'preventive'
                          ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                          : treatment.goal === 'emergency'
                          ? 'bg-rose-100 text-rose-900 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}>
                        {treatment.goal === 'both' ? 'Acute + Preventive' : treatment.goal}
                      </span>

                      {/* Device FDA Status Callouts */}
                      {isDevice ? (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          treatment.deviceStatus === 'fda-approved'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : treatment.deviceStatus === 'approval-pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}>
                          {treatment.deviceStatus === 'fda-approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {treatment.deviceStatus === 'approval-pending' && <Clock className="w-3 h-3 text-amber-600" />}
                          {treatment.fdaStatus}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">
                          {treatment.fdaStatus}
                        </span>
                      )}
                    </div>

                    {/* Title & Brand */}
                    <div>
                      <h3 className="text-lg font-black text-[#003764] leading-snug flex items-center justify-between">
                        <span>{treatment.name}</span>
                        {treatment.isBreakthrough && (
                          <span className="text-[10px] font-bold bg-cyan-100 text-cyan-900 px-1.5 py-0.5 rounded">
                            2026 Highlight
                          </span>
                        )}
                      </h3>
                      {treatment.brandName && (
                        <p className="text-xs font-bold text-[#005a9c]">
                          Brand / Type: {treatment.brandName}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {treatment.formulation}
                      </p>
                    </div>

                    {/* Speed of Onset */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 p-2 rounded-md border border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-[#005a9c] shrink-0" />
                      <span className="font-semibold text-slate-900">Onset:</span>
                      <span className="text-slate-600 truncate">{treatment.speedOfOnset}</span>
                    </div>

                    {/* Mechanism Snippet */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {treatment.mechanism}
                    </p>

                    {/* Primary Key Benefit */}
                    <div className="pt-2 border-t border-slate-100 text-xs text-slate-700 space-y-1">
                      <div className="font-bold text-[#003764] text-[11px] uppercase tracking-wide">
                        Key Clinical Hallmark:
                      </div>
                      <div className="flex items-start gap-1.5 text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{treatment.keyBenefits[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA & Official Link */}
                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#005a9c] flex items-center gap-1 group-hover:underline">
                      View Details &amp; Safety <ChevronRight className="w-3.5 h-3.5" />
                    </span>

                    {treatment.officialUrl && (
                      <a
                        href={treatment.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-400 hover:text-[#005a9c] p-1 rounded hover:bg-slate-100 transition-colors"
                        title={`Visit official ${treatment.name} website`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTreatments.length === 0 && (
            <div className="p-10 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No treatments matched your search criteria</h3>
              <p className="text-xs text-slate-500">Try loosening your search query or selecting "All Treatments".</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setActiveGoal('all');
                  setDeviceFilter('all');
                }}
                className="btn-secondary text-xs py-2 px-4"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>
      )}

      {/* 5. Acupressure, Acupuncture & Integrative Lifestyle Section */}
      {(activeCategory === 'all' || activeCategory === 'integrative') && (
        <section className="space-y-6 pt-4">
          <div className="border-t border-slate-200 pt-8">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="badge-clinical bg-emerald-50 text-emerald-800 border-emerald-200">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                Non-Pharmacological &amp; Integrative Therapies
              </span>
              <span className="text-xs font-mono text-slate-500">Cochrane Systematic Reviews</span>
            </div>

            <h2 className="text-2xl font-black text-[#003764] tracking-tight">
              Acupressure Points, Acupuncture &amp; Neuro-Lifestyle Medicine
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl mt-1">
              Integrative interventions modulate the autonomic nervous system, downregulate trigeminocervical central sensitization, and support pharmaceutical rescue without risk of medication overuse.
            </p>
          </div>

          {/* Acupressure Points 4-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACUPRESSURE_POINTS.map((pt) => (
              <div key={pt.id} className="medical-card p-5 bg-gradient-to-b from-white to-[#fbfdfb] border border-emerald-200/80 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-[#003764]">{pt.name}</span>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {pt.chineseName}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-700">
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Location:</span>
                    {pt.location}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-emerald-900 block text-[11px]">Indication:</span>
                    {pt.primaryIndication}
                  </p>

                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-700">
                    <strong className="text-slate-900 block mb-0.5">Instructions:</strong>
                    {pt.instructions}
                  </div>
                </div>

                {pt.caution && (
                  <div className="p-2 rounded bg-amber-50 border border-amber-200 text-[10px] font-semibold text-amber-900 flex items-start gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span>{pt.caution}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Acupuncture Evidence & Lifestyle Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Acupuncture Clinical Summary */}
            <div className="medical-card p-6 bg-white border border-[#c2dbed]">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-[#005a9c]" />
                <h3 className="text-base font-black text-[#003764]">
                  Clinical Evidence for Acupuncture
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                A landmark Cochrane Systematic Review of 22 trials (4,985 patients) demonstrated that true acupuncture added to acute treatment reduces migraine frequency significantly more than routine care alone. In trials comparing acupuncture to prophylactic drugs (such as beta-blockers or flunarizine), acupuncture showed comparable efficacy with fewer adverse effects.
              </p>
              <div className="text-xs font-mono text-[#005a9c] font-bold bg-[#f0f7fc] p-2 rounded border border-blue-200">
                Cochrane Database Syst Rev. 2016; PMID: 27351320
              </div>
            </div>

            {/* Lifestyle & Chronobiology Foundations */}
            <div className="medical-card p-6 bg-white border border-[#c2dbed]">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-[#0077b6]" />
                <h3 className="text-base font-black text-[#003764]">
                  Circadian Regularity &amp; Metabolic Stability
                </h3>
              </div>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005a9c] mt-2 shrink-0"></span>
                  <span><strong>Sleep Consistency:</strong> Maintain fixed bed and wake times (+/- 30 min) to stabilize hypothalamic circadian pacemakers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005a9c] mt-2 shrink-0"></span>
                  <span><strong>Hydration &amp; Electrolytes:</strong> 2.5–3.0 liters daily; mild dehydration directly heightens cortical spreading depression vulnerability.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005a9c] mt-2 shrink-0"></span>
                  <span><strong>Meal Rhythmicity:</strong> Prevent hypoglycemic spikes; never skip breakfast or lunch during heavy cognitive workloads.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* 6. Detail Modal for Deep Clinical Exploration */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-clinical-fade">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative space-y-5">
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="badge-clinical text-xs bg-[#003764] text-white border-transparent">
                  {selectedItem.category.toUpperCase()}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {selectedItem.fdaStatus}
                </span>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {selectedItem.goal === 'both' ? 'Acute & Preventive' : selectedItem.goal.toUpperCase()}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#003764] tracking-tight">
                {selectedItem.name}
              </h2>
              {selectedItem.brandName && (
                <p className="text-sm font-bold text-[#005a9c]">
                  Brand Name / Delivery: {selectedItem.brandName}
                </p>
              )}
            </div>

            {/* Formulation & Onset Strip */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#f0f7fc] border border-[#c2dbed] rounded-xl text-xs">
              <div>
                <span className="text-slate-500 block uppercase font-mono text-[10px] font-bold">
                  Dosage / Formulation:
                </span>
                <span className="font-bold text-slate-900">{selectedItem.formulation}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-mono text-[10px] font-bold">
                  Onset Velocity:
                </span>
                <span className="font-bold text-slate-900">{selectedItem.speedOfOnset}</span>
              </div>
            </div>

            {/* Mechanism of Action */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-black uppercase text-[#003764] tracking-wider">
                Pharmacological Mechanism of Action
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                {selectedItem.mechanism}
              </p>
            </div>

            {/* Clinical Hallmarks */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-[#003764] tracking-wider">
                Clinical Hallmarks &amp; Key Evidence
              </h4>
              <ul className="space-y-2">
                {selectedItem.keyBenefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety & Contraindications */}
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                <span>Contraindications &amp; Safety Warnings</span>
              </div>
              <p className="text-rose-800 leading-relaxed pl-5">
                {selectedItem.contraindicationsOrWarnings}
              </p>
            </div>

            {/* Citation & Official Website Link */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-mono text-slate-500 text-[11px] truncate max-w-sm">
                Ref: {selectedItem.evidenceCitation}
              </span>

              {selectedItem.officialUrl && (
                <a
                  href={selectedItem.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <span>Visit Official Manufacturer Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
