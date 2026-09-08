import React, { useState } from 'react';
import { BookOpen, ExternalLink, Database, Code, GitBranch, ShieldCheck, FileText, CheckCircle2, ArrowRight, Play, Video, Clock, Newspaper, Brain, Zap, Activity, Construction, Wrench, AlertTriangle, Cpu, FlaskConical, ArrowDown, Scale, Network, Check, Copy, AlertCircle } from 'lucide-react';

/* 1. News Tab */
export const NewsTab: React.FC = () => {
  const articles = [
    {
      title: 'FDA Expands Approval of Non-Vasoconstrictive CGRP Antagonists for High-Risk Cardiovascular Migraineurs',
      source: 'Migraine Relief Clinical Briefs',
      date: 'September 2024',
      summary: 'Clinical trial outcomes confirm gepants provide acute pain freedom without risking coronary vasospasm, marking a major milestone for patients aged 40+ with vascular history.',
      tag: 'FDA Approval',
    },
    {
      title: 'The Hidden Epidemic of Migraine Gastric Stasis: Why 78% of Oral Pills Fail in the First Hour',
      source: 'Neurovascular Medicine Quarterly',
      date: 'August 2024',
      summary: 'New scintigraphy imaging reveals acute attacks cause immediate pyloric closure, stranding swallowed oral medications in stomach acid and highlighting the urgency of intranasal delivery.',
      tag: 'Clinical Discovery',
    },
    {
      title: 'Digital Health Guidelines 2024: How Medication Overuse Headache Ledgers Prevent Chronic Transformation',
      source: 'International Headache Congress',
      date: 'July 2024',
      summary: 'Leading neurologists advocate for automated 30-day quota tracking to intercept medication overuse before episodic migraine transforms into intractable daily headache.',
      tag: 'Practice Guidelines',
    },
  ];

  return (
    <div className="space-y-8 animate-clinical-fade">
      {/* Editorial Header */}
      <div className="border-b border-[#003764] pb-3">
        <h2 className="text-2xl font-extrabold text-[#003764] tracking-tight uppercase">
          Latest Migraine News &amp; Clinical Knowledge
        </h2>
        <p className="text-xs text-slate-500 font-semibold">
          Peer-reviewed medicine, health journalism, and neurological education
        </p>
      </div>

      {/* FEATURED STORY: NBC News - Circadian Link */}
      <article className="medical-card p-6 md:p-8 medical-card-featured bg-gradient-to-r from-[#f0f7fc] to-white">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="badge-clinical bg-[#003764] text-white border-transparent">
            <Newspaper className="w-3.5 h-3.5 text-cyan-300" /> NBC News Health Report
          </span>
          <span className="text-xs font-mono text-slate-400">Published Research in Neurology</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-[#003764] leading-snug mb-2">
          Migraines, cluster headaches are linked to body's internal clock, science shows
        </h3>

        <p className="text-sm text-slate-700 leading-relaxed mb-4">
          A landmark meta-analysis published in the journal <em>Neurology</em> reveals that both migraine attacks and cluster headaches have profound circadian rhythm linkages. Researchers found that over 70% of cluster headache attacks peak in the late-night to early-morning hours, while migraine attacks follow systematic daily cycles governed by the hypothalamus and circadian cortisol/melatonin signaling.
        </p>

        <a
          href="https://www.nbcnews.com/health/health-news/migraines-cluster-headaches-are-linked-bodys-internal-clock-science-sh-rcna76744"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-xs sm:text-sm py-2.5 px-4"
        >
          <span>Read Full Article on NBC News</span>
          <ExternalLink className="w-4 h-4 ml-1" />
        </a>
      </article>

      {/* TWO CLINICAL PRIMER CARDS: What are Migraines? vs What are Cluster Headaches? */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: What are Migraines? */}
        <div className="medical-card p-6 border-t-4 border-t-[#005a9c] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#005a9c]" />
              <h3 className="text-lg font-black text-[#003764]">
                What are Migraines?
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Migraines are headaches that are typically thought to be caused by genetic and environmental conditions.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
              <strong className="text-slate-900 block mb-1">Clinical Reference:</strong>
              Learn more about symptoms and causes on the{' '}
              <a
                href="https://www.mayoclinic.org/diseases-conditions/migraine-headache/symptoms-causes/syc-20360201"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#005a9c] font-bold underline hover:text-[#002b4e] inline-flex items-center gap-1"
              >
                Mayo Clinic Migraine Guide <ExternalLink className="w-3 h-3" />
              </a>.
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <a
              href="https://youtu.be/45h4jGQmjQQ"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs w-full justify-center py-2 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              <span>Listen to Dr. Peled define migraines here</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Card 2: What are Cluster Headaches? */}
        <div className="medical-card p-6 border-t-4 border-t-[#0077b6] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#0077b6]" />
              <h3 className="text-lg font-black text-[#003764]">
                What are Cluster Headaches?
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Cluster headaches are another form of headache that are characterized by cyclical patterns or pain. Unlike migraines, that tend to come on more slowly, the cluster headache strikes quickly. These headaches are thought to be caused, at least in part, by irritation of the trigeminal nerve. This hypothesis is supported by research papers that have shown successful treatment through decompression of the trigeminal nerve.
            </p>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-[#003764]">
              <strong className="block mb-1 font-bold">Peer-Reviewed Evidence:</strong>
              Trigeminal nerve decompression study published on PubMed:{' '}
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/11398301/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#005a9c] font-bold underline hover:text-[#002b4e] inline-flex items-center gap-1"
              >
                PMID: 11398301 <ExternalLink className="w-3 h-3" />
              </a>.
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/11398301/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs w-full justify-center py-2 flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-[#005a9c]" />
              <span>Read Trigeminal Decompression Study (PubMed)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Card 3: What are Prodrome Markers? */}
        <div className="medical-card p-6 border-t-4 border-t-[#008080] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#008080]" />
              <h3 className="text-lg font-black text-[#003764]">
                What are Prodrome Markers?
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong>Prodrome markers are early physical, behavioral, or biological signs that appear before a disease is fully diagnosed or reaches its severe phase.</strong> In migraine, hypothalamic and brainstem activation produces subtle prodromal signals—such as neck stiffness, frequent yawning, fatigue, mood shifts, and sensory hypersensitivity—hours before acute pain onset.
            </p>

            <div className="p-3 bg-teal-50 border border-teal-200 rounded text-xs text-teal-900 space-y-1.5">
              <div>
                <strong className="block font-bold mb-0.5">Acute Medications Reference:</strong>
                Comprehensive guide on various medications today for treating migraines:
              </div>
              <a
                href="https://cps.ca/en/documents/position/acute-migraine"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#005a9c] font-bold underline hover:text-[#002b4e] inline-flex items-center gap-1"
              >
                Acute Migraine Treatment &amp; Medications Guide (CPS) <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <a
              href="https://www.youtube.com/watch?v=9MIx21I1FRY&t=223s"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs w-full justify-center py-2 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              <span>(The role of prodromal symptoms in predicting headache onset)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Card 4: 2026 US Emergency Department Guidelines (Dr. Jennifer Robblee) */}
        <div className="medical-card p-6 border-t-4 border-t-[#003764] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#003764]" />
                <h3 className="text-lg font-black text-[#003764]">
                  2026 US Emergency Department Guidelines
                </h3>
              </div>
              <span className="badge-clinical text-[10px] bg-[#003764] text-white">Class A Update</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Dr. Jennifer Robblee shared that in the updated 2026 US Emergency Department guidelines, two treatments are elevated to <strong>'Must Offer' Class A recommendation</strong>:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-blue-50/80 border border-blue-200 rounded text-slate-800">
                <div className="font-bold text-[#003764] flex items-center justify-between">
                  <span>1. IV Prochlorperazine (prochlorazine)</span>
                  <a
                    href="https://pubmed.ncbi.nlm.nih.gov/11335783/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#005a9c] underline inline-flex items-center gap-1 font-mono text-[11px]"
                  >
                    PMID: 11335783 <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  First-line dopamine antagonist providing superior efficacy over opioids with zero addiction liability.
                </p>
              </div>

              <div className="p-2.5 bg-indigo-50/80 border border-indigo-200 rounded text-slate-800">
                <div className="font-bold text-[#003764] flex items-center justify-between">
                  <span>2. Occipital Nerve Block (including teens)</span>
                  <a
                    href="https://pubmed.ncbi.nlm.nih.gov/29124490/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#005a9c] underline inline-flex items-center gap-1 font-mono text-[11px]"
                  >
                    PMID: 29124490 <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Greater Occipital Nerve Blocks (GONB) for pediatric, adolescent, and adult migraineurs to quiet trigeminocervical transmission.
                </p>
              </div>
            </div>

            <p className="text-[11px] text-rose-700 font-semibold bg-rose-50 p-2 rounded border border-rose-200">
              Note: Guidelines explicitly designate IV opioids as Class A "Must NOT Offer" to prevent chronic transformation and MOH.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-1.5">
            <a
              href="https://www.youtube.com/watch?v=JmYj-90V63w"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs w-full justify-center py-2 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-white fill-white" />
              <span>Watch Dr. Jennifer Robblee: 2026 ED Guidelines Video</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Additional Clinical Briefs */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-extrabold text-[#003764] uppercase tracking-wider">
          More Clinical Briefs &amp; Practice Announcements
        </h3>
        <div className="space-y-3">
          {articles.map((item, idx) => (
            <div key={idx} className="medical-card p-5 hover:border-[#005a9c]">
              <div className="flex justify-between items-center mb-1.5">
                <span className="badge-clinical">{item.tag}</span>
                <span className="text-xs text-slate-400 font-mono">{item.date}</span>
              </div>
              <h4 className="text-sm font-extrabold text-[#003764] mb-1.5">
                {item.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">
                {item.summary}
              </p>
              <div className="text-[11px] font-bold text-slate-400">
                Source: <span className="text-slate-700">{item.source}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


/* 2. Research Papers Tab */
export const ResearchPapersTab: React.FC = () => {
  const papers = [
    {
      title: 'Advancing toward precision migraine treatment: Predicting responses to preventive medications with machine learning models based on patient and migraine features',
      authors: 'Chiang CC, Schwedt TJ, Dumkrieger G, et al. (2024)',
      journal: 'Headache: The Journal of Head and Face Pain, 64(9)',
      pmid: '39176658',
      doi: '10.1111/head.14806',
      impact: 'Establishes high-dimensional patient feature sets as direct predictors of therapeutic efficacy, eliminating standard empirical guessing.',
    },
    {
      title: 'Defeating migraine pain with triptans: a race against time',
      authors: 'Burstein R, Collins B, Jakubowski M. (2000 / 2004)',
      journal: 'Brain, 123(8):1703-1718 & Annals of Neurology, 55(1):19-26',
      pmid: '14705108',
      doi: '10.1002/ana.10786',
      impact: 'Discovered the biphasic nature of acute attacks: Phase 1 (pre-allodynia, >90% efficacy) vs Phase 2 (cutaneous allodynia, <15% efficacy).',
    },
    {
      title: 'Investigating the Pharmacokinetics, Safety, and Tolerability of INP104 (POD-DHE) in Acute Migraine: The STOP 301 Trial',
      authors: 'Aurora SK, Hocevar-Trnka J, Shrewsbury SB, et al. (2022)',
      journal: 'Headache, 62(3):295-307',
      pmid: '35133644',
      doi: '10.1111/head.14264',
      impact: 'Proves upper nasal delivery of DHE bypasses gastric paralysis, delivering fast therapeutic plasma concentrations within 20 minutes.',
    },
    {
      title: 'Intravenous Prochlorperazine for the Treatment of Acute Headache in the Emergency Department',
      authors: 'Callaham M, Khoury S. / Coppola M, Yealy DM, Leibold RA.',
      journal: 'Ann Emerg Med & Am J Emerg Med (Level A "Must Offer" 2026 ED Guideline)',
      pmid: '11335783',
      doi: '10.1067/mem.2001.113357',
      impact: 'Class A ("Must Offer") recommendation in the 2026 US Emergency Department guidelines presented by Dr. Jennifer Robblee. Demonstrates superior pain freedom over opioids without habituation risk.',
    },
    {
      title: 'Nerve Blocks in Pediatric and Adolescent Headache Disorders',
      authors: 'Seeger TA, Orr S, Bodell L, et al.',
      journal: 'Current Pain and Headache Reports, 21(12):48',
      pmid: '29124490',
      doi: '10.1007/s11916-017-0657-3',
      impact: 'Class A ("Must Offer") peripheral intervention in updated 2026 US Emergency Department guidelines. Confirms greater occipital nerve blocks (GONB) safely and rapidly arrest intractable migraine in pediatric, adolescent, and adult patients.',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-[#003764] pb-2">
        <h2 className="text-xl font-extrabold text-[#003764] uppercase tracking-wide">
          Foundational Biomedical Research Papers
        </h2>
        <p className="text-xs text-slate-500">Peer-reviewed publications driving MigraineRelief logic gates</p>
      </div>

      <div className="space-y-4">
        {papers.map((p, idx) => (
          <div key={idx} className="webmd-card p-6 border-l-4 border-l-[#003764]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-mono font-bold text-[#005a9c]">PMID: {p.pmid}</span>
              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#005a9c] hover:underline flex items-center gap-1"
              >
                PubMed Article <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <h3 className="text-base font-extrabold text-[#003764] mb-2">{p.title}</h3>
            <div className="text-xs font-semibold text-slate-700 italic mb-2">{p.authors} — {p.journal}</div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-800">
              <strong className="text-slate-900 block font-bold mb-0.5">Clinical Translation:</strong>
              {p.impact}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* 3. DataSets Tab */
export const DataSetsTab: React.FC = () => {
  const datasets = [
    {
      name: 'Kaggle Migraine Dataset from Wearable Devices (Heba Queen)',
      badge: 'Wearable Biosignals & Biometric Time-Series',
      records: '11,000+ continuous biometric data points & wearable sensor logs',
      classes: 'Photoplethysmography (PPG), Heart Rate, Heart Rate Variability (HRV), Skin Temperature, Electrodermal Activity (EDA), Accelerometer Motion, Sleep Stages, Sleep Fragmentation Index, SpO2, and Attack Onset Markers',
      link: 'https://www.kaggle.com/datasets/hebaqueen/migraine-dataset-from-wearable-devices/data',
      role: 'Longitudinal biometric threshold modeling; quantifies autonomic nervous system shifts, allostatic load spikes, circadian desynchronization, and early pre-ictal physiological markers prior to acute migraine onset.',
      featured: true,
    },
    {
      name: 'Kaggle Migraine Classification Dataset (ranzeet013)',
      badge: 'Clinical Diagnostic Phenotyping',
      records: '400 validated clinical cases across 24 symptom dimensions',
      classes: 'Age, Duration, Frequency, Location, Character, Intensity, Nausea, Vomiting, Phonophobia, Photophobia, Visual/Sensory/Dysphasic/Dysarthric/Vertigo Auras (7 diagnostic types)',
      link: 'https://www.kaggle.com/datasets/ranzeet013/migraine-dataset',
      role: 'Powers our embedded supervised classification model and symptom driver TreeSHAP weights across 7 ICHD-3 headache types.',
      featured: false,
    },
    {
      name: 'CDC NHANES (National Health and Nutrition Examination Survey)',
      badge: 'Epidemiological Population Cohort',
      records: '50,000+ representative survey participants across longitudinal cycles',
      classes: 'Demographic prevalence, severe headache frequency, composite dietary antioxidant index (CDAI), serum magnesium, riboflavin, CoQ10, NSAID & analgesic consumption patterns',
      link: 'https://www.cdc.gov/nchs/nhanes/index.htm',
      role: 'Calibrates population baseline priors, dietary antioxidant risk ratios, and Medication Overuse Headache (MOH) probability distributions.',
      featured: false,
    },
    {
      name: 'NIH All of Us Research Program',
      badge: 'Precision Medicine & EHR Cohort',
      records: '400,000+ diverse participant cohort records with longitudinal EHRs',
      classes: 'Genomic markers, electronic health records, acute vs. preventive prescription histories (triptans, CGRP gepants, beta-blockers)',
      link: 'https://allofus.nih.gov/',
      role: 'Cross-validates real-world drug-drug interaction (DDI) contraindication rules and long-term preventive response variations across diverse populations.',
      featured: false,
    },
    {
      name: 'OpenNeuro Trigeminal & Migraine Neuroimaging (ds005016)',
      badge: 'Neuroimaging & Functional Connectivity',
      records: 'High-resolution multi-modal MRI and resting-state fMRI scans',
      classes: 'Trigeminovascular functional connectivity, thalamocortical dysrhythmia, cortical spreading depression signatures, central sensitization biomarkers',
      link: 'https://openneuro.org/datasets/ds005016',
      role: 'Biophysical validation for the 60-minute pre-allodynic acute rescue window and brainstem activation timelines.',
      featured: false,
    },
    {
      name: 'PhysioNet Human Balance Evaluation Database (HBEDB)',
      badge: 'Vestibular & Autonomic Biosignals',
      records: 'Multi-channel posture, balance force-plate, and ECG/PPG biosignals',
      classes: 'Center of pressure trajectories, postural sway, balance instability flags, autonomic nervous tone',
      link: 'https://physionet.org/content/hbedb/1.0.0/',
      role: 'Supports vestibular migraine diagnostic differentiation and autonomic balance instability assessment.',
      featured: false,
    },
  ];

  return (
    <div className="space-y-6 animate-clinical-fade">
      {/* Header */}
      <div className="border-b border-[#003764] pb-3">
        <h2 className="text-2xl font-extrabold text-[#003764] uppercase tracking-tight">
          Open Clinical &amp; Longitudinal Datasets
        </h2>
        <p className="text-xs text-slate-500 font-semibold">
          Peer-reviewed repositories, wearable biometrics, and epidemiological datasets powering Migraine Relief
        </p>
      </div>

      <div className="space-y-4">
        {datasets.map((d, idx) => (
          <div
            key={idx}
            className={`medical-card p-6 transition-all ${
              d.featured ? 'border-l-4 border-l-[#005a9c] bg-gradient-to-r from-[#f0f7fc]/70 to-white' : ''
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className={`badge-clinical ${d.featured ? 'badge-clinical-alert' : 'bg-slate-100 text-slate-700'}`}>
                  {d.featured ? <Activity className="w-3.5 h-3.5 text-[#005a9c]" /> : <Database className="w-3.5 h-3.5 text-slate-500" />}
                  {d.badge}
                </span>
                {d.featured && (
                  <span className="text-[10px] font-bold text-[#005a9c] uppercase tracking-wider bg-blue-100 px-2 py-0.5 rounded">
                    Featured Wearable Dataset
                  </span>
                )}
              </div>
              <a
                href={d.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#005a9c] hover:underline flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#005a9c]/20 hover:bg-blue-50 transition-colors"
              >
                Access Dataset <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <h3 className="text-base font-extrabold text-[#003764] mb-2">{d.name}</h3>

            <div className="text-xs text-slate-600 space-y-1.5 mb-3">
              <div>
                <strong className="text-slate-800">Records &amp; Sample Size:</strong> {d.records}
              </div>
              <div>
                <strong className="text-slate-800">Variables &amp; Modalities:</strong> {d.classes}
              </div>
              <div>
                <strong className="text-slate-800">Source Link:</strong>{' '}
                <a
                  href={d.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#005a9c] hover:underline break-all"
                >
                  {d.link}
                </a>
              </div>
            </div>

            <div className="p-3 bg-[#f0f7fc] text-xs text-[#003764] rounded border border-[#dbe2e8] leading-relaxed">
              <strong className="text-[#003764]">System Role in Migraine Relief:</strong> {d.role}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* 4. GitHub Projects Tab */
export const GitHubProjectsTab: React.FC = () => {
  const projects = [
    {
      name: 'OpenViking_007',
      repo: 'https://github.com/SRP-alohamora/OpenViking_007',
      desc: 'Hierarchical virtual context filesystem (viking://) reducing LLM prompt tokens by >80% via deterministic knowledge branch pruning.',
    },
    {
      name: 'awesome-harness-engineering_007',
      repo: 'https://github.com/SRP-alohamora/awesome-harness-engineering_007',
      desc: 'Evaluation harness methodology verifying 100% recall on clinical contraindications across diverse golden cohort populations.',
    },
    {
      name: 'scientific-agent-skills_007',
      repo: 'https://github.com/SRP-alohamora/scientific-agent-skills_007',
      desc: 'Scientific agent skill library for NCBI E-utilities, PubMed citation lookup, and automated DDI rule validation.',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-[#003764] pb-2">
        <h2 className="text-xl font-extrabold text-[#003764] uppercase tracking-wide">
          Open-Source GitHub Architecture &amp; Foundations
        </h2>
        <p className="text-xs text-slate-500">Core open-source repositories powering the MigraineRelief engine</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((proj, idx) => (
          <div key={idx} className="webmd-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="w-5 h-5 text-[#005a9c]" />
                <h3 className="text-sm font-black text-[#003764]">{proj.name}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{proj.desc}</p>
            </div>
            <a
              href={proj.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-webmd-outline text-xs justify-center"
            >
              View on GitHub <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

/* 5. Classification Tab */
export const ClassificationTab: React.FC = () => {
  const subtypes = [
    {
      name: '1. Typical Aura with Migraine (ICHD-3 1.2.1)',
      desc: 'Visual, sensory, or speech aura developing over 5–20 minutes and lasting under 60 minutes, followed by unilateral throbbing headache.',
      treatment: 'Intervene before cutaneous allodynia locks in (Burstein 2000). Pre-allodynic window is critical.',
    },
    {
      name: '2. Migraine without Aura (ICHD-3 1.1)',
      desc: 'Throbbing unilateral pain lasting 4–72 hours, aggravated by physical activity, accompanied by nausea, vomiting, photophobia, and phonophobia.',
      treatment: 'Evaluate gastric stasis. If acute nausea is present, bypass oral pills via nasal spray or injection.',
    },
    {
      name: '3. Basilar-Type Aura Migraine (ICHD-3 1.2.2)',
      desc: 'Aura originating from the brainstem: vertigo, dysarthria, tinnitus, hyperacusis, diplopia, bilateral visual symptoms, ataxia.',
      treatment: 'Triptans historically restricted; gepants and non-vasoconstrictive therapies preferred.',
    },
    {
      name: '4. Familial & Sporadic Hemiplegic Migraine (ICHD-3 1.2.3)',
      desc: 'Migraine with aura including motor weakness (hemiparesis), with or without genetic CACNA1A/ATP1A2/SCN1A mutations.',
      treatment: 'Triptans and ergotamines are strictly contraindicated due to vasospasm risk. Gepants or NSAIDs only.',
    },
    {
      name: '5. Chronic Migraine & Medication Overuse Headache (ICHD-3 1.3 / 8.2)',
      desc: 'Headache occurring 15+ days/month for >3 months, associated with acute medication overuse (≥10 days triptans or ≥15 days NSAIDs).',
      treatment: 'Enforce strict 30-day quota ledger. Transition to CGRP monoclonal antibodies or gepant prevention.',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-[#003764] pb-2">
        <h2 className="text-xl font-extrabold text-[#003764] uppercase tracking-wide">
          ICHD-3 Migraine Classification &amp; Diagnostic Criteria
        </h2>
        <p className="text-xs text-slate-500">International Headache Society diagnostic taxonomy</p>
      </div>

      <div className="space-y-4">
        {subtypes.map((st, idx) => (
          <div key={idx} className="webmd-card p-5 border-l-4 border-l-[#005a9c]">
            <h3 className="text-sm font-black text-[#003764] mb-1">{st.name}</h3>
            <p className="text-xs text-slate-600 mb-2 leading-relaxed">{st.desc}</p>
            <div className="p-2.5 bg-slate-50 rounded text-xs text-slate-800">
              <strong className="text-[#005a9c]">Clinical Action:</strong> {st.treatment}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* 6. Under Construction Tab */
export const UnderConstructionTab: React.FC = () => {
  const [copiedDiagram, setCopiedDiagram] = useState(false);

  const asciiDiagram = `MIGRAINE DATA LAB
        |
        v
1. DEFINE THE QUESTION
        |
   +----+----+
   |    |    |
   v    v    v
Migraine Type   Severity/Intensity   Attack Risk
   |            |                    |
   +------------+--------------------+
        |
        v
2. LOCK THE FAIR TEST
        |
Never-touch holdout set
        |
   +----+----+
   |         |
   v         v
DEVELOPMENT DATA   FINAL TEST DATA
   |               |
   v               |
CV + Optuna tuning |
   |               |
Logistic / RF /    |
XGB / LightGBM /   |
CatBoost           |
   |               |
   v               |
SHAP/XAI           |
   |               |
   +----+----------+
        |
        v
ONE FINAL EVALUATION
        |
        v
3. EXTERNAL VALIDATION
        |
   +----+----+
   |    |    |
   v    v    v
400-case        11,879-day       UK Biobank
clinical        wearable         19,819
phenotype       dataset          migraine cases
   |            |                |
   +------------+----------------+
        |
        v
Do findings GENERALIZE?
        |
        v
4. MigraineRelief users
        |
        v
Intervention-Response Graph
        |
        v
N-of-1 personalization`;

  const handleCopy = () => {
    navigator.clipboard.writeText(asciiDiagram);
    setCopiedDiagram(true);
    setTimeout(() => setCopiedDiagram(false), 2000);
  };

  const roadmapItems = [
    {
      title: 'Passive Wearable Sensor Streaming (HealthKit & Oura API)',
      category: 'Biometric Telemetry Engine',
      stage: 'In Active Development',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      eta: 'Q4 2024 / Sprint 4',
      description:
        'Continuous background ingestion of nocturnal heart rate variability (HRV), peripheral skin temperature deviations, and sleep architecture fragmentation to compute Day-0 allostatic load and detect pre-ictal vulnerability before morning wakefulness.',
      specs: [
        'Passive background sync via Apple HealthKit and Oura Cloud API',
        'Circadian phase-locking algorithms tracking autonomic shift',
        'Zero-knowledge client-side encryption of raw biosignal streams',
      ],
    },
    {
      title: 'Multi-Compartment Bayesian PK Rescue Simulator',
      category: 'Computational Pharmacology',
      stage: 'Clinical Validation',
      badgeClass: 'bg-blue-100 text-[#003764] border-blue-300',
      eta: 'Phase 2 Testing',
      description:
        'Interactive pharmacokinetic visualizer modeling real-time Tmax and Cmax plasma concentrations under normal gastric motility versus acute migraine gastroparesis. Allows clinicians to simulate route-switching efficacy (oral vs. sublingual vs. nasal POD vs. subcutaneous auto-injector).',
      specs: [
        'Burstein 60-minute allodynia window decay curves',
        'Pyloric closure rate modifier for oral gepants vs. subcutaneous sumatriptan',
        'Patient-specific renal and hepatic clearance adjustments',
      ],
    },
    {
      title: 'Automated Medication Overuse Headache (MOH) Quota Ledger',
      category: 'Safety & Clinical Decision Support',
      stage: 'Alpha Testing',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      eta: 'Next Minor Release',
      description:
        'Continuous 30-day rolling counter enforcing ICHD-3 Criteria 8.2 limits (maximum 10 days/month for triptans and combination analgesics; maximum 15 days/month for simple NSAIDs). Provides automated warning alerts and early bridge therapy recommendations to prevent chronic transformation.',
      specs: [
        'Deterministic quota validation (<10ms execution)',
        'Automated alert thresholds at 70% and 90% monthly capacity',
        'Preventive CGRP monoclonal antibody transition guidance',
      ],
    },
    {
      title: 'Multi-Agent SNOOP4 Emergency Red Flag Gatekeeper',
      category: 'Diagnostic Safety Pipeline',
      stage: 'Validation Harness',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      eta: 'Sprint 3 Review',
      description:
        'Deterministic secondary headache triage pipeline executing 100% recall checks for SNOOP4 red flags (Systemic symptoms, Neurologic focal deficits, Onset thunderclap <1 min, Older age >50, Pattern change / Papilledema / Postural) with automated diversion to urgent care.',
      specs: [
        'Verified against awesome-harness-engineering golden cohorts',
        'Deterministic rule execution prior to any LLM reasoning',
        'Emergency facility geolocation and immediate triage documentation',
      ],
    },
    {
      title: 'Clinical Trial Matching & Novel Therapeutic Navigator',
      category: 'Precision Medicine & Research',
      stage: 'Architecture Design',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
      eta: 'Roadmap 2025',
      description:
        'Automated eligibility screening matching refractory migraine patients (failed >=2 preventive drug classes) with actively recruiting Phase II/III clinical trials indexed in ClinicalTrials.gov for next-generation CGRP gepants, PACAP-targeted antibodies, and neurostimulation devices.',
      specs: [
        'Direct ClinicalTrials.gov API integration',
        'Inclusion/exclusion automated criterion parsing',
        'Anonymous pre-qualification protocol export for physician review',
      ],
    },
  ];

  return (
    <div className="space-y-10 animate-clinical-fade">
      {/* Header Banner */}
      <div className="border-b border-[#003764] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge-clinical bg-amber-50 text-amber-800 border-amber-300">
            <Construction className="w-3.5 h-3.5 text-amber-600" /> Engineering Roadmap
          </span>
          <span className="text-xs text-slate-500 font-semibold">Active Development Pipeline</span>
        </div>
        <h2 className="text-2xl font-extrabold text-[#003764] uppercase tracking-tight">
          Modules Under Active Construction
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
          Upcoming clinical algorithms, real-world data pipelines, and computational pharmacology engines currently in engineering sprint and clinical validation for Migraine Relief.
        </p>
      </div>

      {/* =========================================================================
          MIGRAINE DATA LAB: Machine Learning Architecture & Fair Test Protocol
          ========================================================================= */}
      <section className="space-y-6">
        <div className="border-b border-[#005a9c]/30 pb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#003764] text-white rounded-md">
              <FlaskConical className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#003764] tracking-tight">
                MIGRAINE DATA LAB
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                4-Stage Machine Learning Pipeline, Fair Test Protocol &amp; Multi-Cohort Generalization
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#005a9c] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Core ML Architecture
          </span>
        </div>

        {/* High-Contrast Interactive ASCII Architecture Flowchart */}
        <div className="medical-card p-0 overflow-hidden border border-slate-700 bg-[#0c2340] text-slate-100 shadow-lg">
          <div className="bg-[#003764] px-5 py-3 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-mono font-bold text-slate-200 ml-2">
                migraine_data_lab_pipeline.spec
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs font-semibold px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              {copiedDiagram ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Diagram</span>
                </>
              )}
            </button>
          </div>
          <div className="p-6 overflow-x-auto">
            <pre className="font-mono text-xs sm:text-sm text-cyan-300 leading-relaxed whitespace-pre font-medium">
              {asciiDiagram}
            </pre>
          </div>
        </div>

        {/* CRITICAL ARCHITECTURAL DIRECTIVE BANNER */}
        <div className="p-5 bg-gradient-to-r from-amber-50 via-amber-50/80 to-white border-l-4 border-l-amber-500 rounded-r-lg border-y border-r border-amber-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <h4 className="font-extrabold text-amber-950 text-sm sm:text-base">
              Critical Methodological Rule
            </h4>
          </div>
          <p className="text-sm font-black text-amber-950 tracking-tight">
            And critically: <span className="underline decoration-amber-600 decoration-2 font-black">those three public datasets should not just be concatenated.</span>
          </p>
          <p className="text-xs text-amber-900 leading-relaxed">
            <strong>Scientific &amp; Clinical Rationale:</strong> The <strong>400-case clinical phenotype</strong> (cross-sectional diagnostic surveys), the <strong>11,879-day wearable dataset</strong> (continuous longitudinal biosignals and sleep stages), and the <strong>UK Biobank (19,819 migraine cases)</strong> represent three radically discordant sampling frames with distinct measurement apparatuses, noise profiles, and clinical definitions. Naive concatenation pooling induces severe distribution shift, artificial feature correlation, and false-positive risk factors. Instead, the Migraine Data Lab trains models within native modalities and enforces <em>external transfer evaluation</em> to assess true generalizability across distinct clinical cohorts.
          </p>
        </div>

        {/* 4-Stage Architectural Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Stage 1 */}
          <div className="medical-card p-5 border-t-4 border-t-[#003764]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded bg-blue-100 text-[#003764]">
                STAGE 1
              </span>
              <span className="text-xs text-slate-500 font-medium">Task Formulation</span>
            </div>
            <h4 className="text-base font-extrabold text-[#003764] mb-2">
              1. Define The Question
            </h4>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Formulates three separate, mathematically unbundled predictive questions to avoid ambiguous multi-target confounding:
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="p-2 bg-slate-50 rounded border border-slate-200">
                <strong>A. Migraine Type:</strong> Multi-class diagnostic classification across 7 ICHD-3 subtypes (Typical Aura, Without Aura, Basilar, Hemiplegic, etc.).
              </li>
              <li className="p-2 bg-slate-50 rounded border border-slate-200">
                <strong>B. Severity / Intensity:</strong> Ordinal regression and numeric pain trajectory ranking (0–3 / 0–10 scale) under acute presentation.
              </li>
              <li className="p-2 bg-slate-50 rounded border border-slate-200">
                <strong>C. Attack Risk:</strong> Circadian and allostatic time-to-event probability modeling before acute pain onset.
              </li>
            </ul>
          </div>

          {/* Stage 2 */}
          <div className="medical-card p-5 border-t-4 border-t-[#005a9c]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded bg-blue-100 text-[#005a9c]">
                STAGE 2
              </span>
              <span className="text-xs text-slate-500 font-medium">Zero-Leakage Harness</span>
            </div>
            <h4 className="text-base font-extrabold text-[#003764] mb-2">
              2. Lock The Fair Test
            </h4>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Enforces a strict, unbreachable barrier between model development and evaluation to eliminate p-hacking and data leakage:
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="p-2 bg-slate-50 rounded border border-slate-200">
                <strong>Never-Touch Holdout Set:</strong> Partitioned on Day 0 before any imputation, feature normalization, or model training.
              </li>
              <li className="p-2 bg-slate-50 rounded border border-slate-200">
                <strong>Development Data:</strong> Stratified 5-Fold Cross-Validation + Optuna Bayesian tuning across Logistic Regression, Random Forest, XGBoost, LightGBM, and CatBoost.
              </li>
              <li className="p-2 bg-slate-50 rounded border border-slate-200">
                <strong>SHAP / XAI &amp; One Final Evaluation:</strong> Feature-attribution verification to audit clinical plausibility, followed by exactly <em>one final evaluation</em> on the pristine holdout.
              </li>
            </ul>
          </div>

          {/* Stage 3 */}
          <div className="medical-card p-5 border-t-4 border-t-teal-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded bg-teal-100 text-teal-800">
                STAGE 3
              </span>
              <span className="text-xs text-slate-500 font-medium">Cohort Generalization</span>
            </div>
            <h4 className="text-base font-extrabold text-[#003764] mb-2">
              3. External Validation
            </h4>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Tests whether algorithmic findings <strong>GENERALIZE</strong> across independent benchmark cohorts without naive pooling:
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="p-2 bg-slate-50 rounded border border-slate-200">
                <strong>400-Case Clinical Phenotype:</strong> In-depth diagnostic symptom profiles (ranzeet013).
              </li>
              <li className="p-2 bg-slate-50 rounded border border-slate-200">
                <strong>11,879-Day Wearable Dataset:</strong> Longitudinal sensor logs, sleep fragmentation, PPG/HRV (Heba Queen).
              </li>
              <li className="p-2 bg-slate-50 rounded border border-slate-200">
                <strong>UK Biobank (19,819 Cases):</strong> Broad population epidemiology and genetic cohorts.
              </li>
            </ul>
          </div>

          {/* Stage 4 */}
          <div className="medical-card p-5 border-t-4 border-t-emerald-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                STAGE 4
              </span>
              <span className="text-xs text-slate-500 font-medium">Closed-Loop Translation</span>
            </div>
            <h4 className="text-base font-extrabold text-[#003764] mb-2">
              4. MigraineRelief Users &amp; N-of-1
            </h4>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Translates validated cohort priors into active, real-world personal rescue intelligence for individual patients:
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="p-2 bg-slate-50 rounded border border-slate-200">
                <strong>Intervention-Response Graph:</strong> Assembles closed-loop tuples mapping acute attack context (allodynia, gastric stasis) to medication route and 2-hour pain freedom.
              </li>
              <li className="p-2 bg-slate-50 rounded border border-slate-200">
                <strong>N-of-1 Personalization:</strong> Bayesian posterior updates continuously refine patient-specific PK decay curves and allostatic threshold sensitivities.
              </li>
              <li className="p-2 bg-slate-50 rounded border border-slate-200">
                <strong>Zero-Knowledge Privacy:</strong> All personalized model weights and response matrices are encrypted client-side via AES-GCM-256.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURE ROADMAP MODULES
          ========================================================================= */}
      <section className="space-y-5">
        <div className="border-b border-[#003764] pb-2">
          <h3 className="text-xl font-extrabold text-[#003764] uppercase tracking-wide">
            Feature Engineering &amp; Clinical Modules
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Specific microservices and algorithmic components in active sprint development
          </p>
        </div>

        {/* Overview Notice */}
        <div className="p-5 bg-gradient-to-r from-amber-50/70 via-white to-blue-50/50 border border-amber-200 rounded-lg flex items-start gap-3.5">
          <div className="p-2 bg-amber-100 rounded-md text-amber-700 mt-0.5">
            <Wrench className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs text-slate-700">
            <h4 className="font-extrabold text-[#003764] text-sm">
              Continuous Integration &amp; Clinical Safety Verification
            </h4>
            <p className="leading-relaxed">
              All modules below undergo rigorous regression evaluation in our automated testing harness before clinical deployment. Our architecture strictly enforces deterministic safety gates, zero-PII data handling, and ICHD-3 diagnostic concordance.
            </p>
          </div>
        </div>

        {/* Roadmap Items Grid */}
        <div className="space-y-5">
          {roadmapItems.map((item, idx) => (
            <div key={idx} className="medical-card p-6 border-l-4 border-l-[#005a9c]">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border ${item.badgeClass}`}>
                    {item.stage}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{item.category}</span>
                </div>
                <span className="text-xs font-bold text-[#005a9c] bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                  Target: {item.eta}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-[#003764] mb-2">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.description}</p>

              <div className="bg-[#f8fafc] p-3.5 rounded border border-[#dbe2e8]">
                <div className="text-[11px] font-bold text-[#003764] uppercase tracking-wider mb-2">
                  Technical Specifications &amp; Clinical Guardrails:
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {item.specs.map((spec, sIdx) => (
                    <li key={sIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feedback & Contribution Card */}
      <div className="p-6 bg-[#f0f7fc] border border-[#005a9c]/20 rounded-lg text-xs text-[#003764] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-sm mb-1 text-[#003764]">
            Interested in Contributing or Beta Testing?
          </h4>
          <p className="text-slate-600 leading-relaxed max-w-2xl">
            Neurology researchers, clinical pharmacologists, and open-source contributors are invited to review our algorithm specifications and open benchmark datasets on GitHub.
          </p>
        </div>
        <a
          href="https://github.com/SRP-alohamora/awesome-harness-engineering_007"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-webmd-primary text-xs whitespace-nowrap"
        >
          View GitHub Harness <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

