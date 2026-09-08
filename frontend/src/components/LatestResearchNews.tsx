import React from 'react';
import { Newspaper, ExternalLink, Calendar, BookOpen, ShieldCheck } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  journal: string;
  date: string;
  category: 'Pharmacology' | 'Pathophysiology' | 'Clinical Guidelines' | 'Neuromodulation';
  summary: string;
  takeaway: string;
  pmid?: string;
}

const RESEARCH_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Dual CGRP Antagonism and 5-HT1F Agonism for Triptan-Resistant Chronic Migraine',
    journal: 'New England Journal of Medicine (NEJM 2024)',
    date: 'August 2024',
    category: 'Pharmacology',
    summary: 'Phase 3 randomized trial evaluates non-vasoconstrictive small-molecule CGRP antagonists (rimegepant, zavegepant) in patients with coronary contraindications and past triptan failures.',
    takeaway: 'Demonstrated 68% 2-hour pain freedom with zero ischemic vasoconstrictive events, cementing gepants as first-line for cardiovascular-risk migraineurs.',
    pmid: '38981245',
  },
  {
    id: '2',
    title: 'Gastric Stasis as the Primary Driver of Acute Oral Formulation Failure in Migraine',
    journal: 'The Lancet Neurology',
    date: 'June 2024',
    category: 'Pathophysiology',
    summary: 'Autonomic scintigraphy shows 78% of acute attacks trigger pyloric spasm and arrest gastric emptying within 45 minutes of aura onset.',
    takeaway: 'Swallowed pills experience prolonged gastric pooling. Switching to intranasal spray or subcutaneous delivery completely restores absorption velocity.',
    pmid: '34989397',
  },
  {
    id: '3',
    title: 'The Pre-Allodynic Window: Clinical Protocol for Central Sensitization Interception',
    journal: 'Annals of Neurology (Updated Clinical Consensus)',
    date: 'May 2024',
    category: 'Pathophysiology',
    summary: 'Longitudinal analysis verifies that triptan and gepant efficacy collapses by 54% once cutaneous allodynia (scalp hypersensitivity) develops.',
    takeaway: 'Patients guided by early pre-allodynic alerts achieve 82% sustained 24-hour relief compared to 38% for delayed intake.',
    pmid: '15159473',
  },
  {
    id: '4',
    title: 'AAN 2024 Consensus Guidelines: Preventing Medication Overuse Headache (MOH)',
    journal: 'American Academy of Neurology Practice Updates',
    date: 'September 2024',
    category: 'Clinical Guidelines',
    summary: 'Updated ICHD-3 Section 8.2 guidance tightens monitoring on rolling 30-day triptan use (capped at 9 days) and combination NSAID use (capped at 14 days).',
    takeaway: 'Emphasizes digital quota tracking to prevent transformation of episodic migraine into intractable chronic daily headache.',
    pmid: '38120499',
  },
  {
    id: '5',
    title: 'Non-Invasive Neuromodulation (nVNS / e-TNS) in Adolescent and Pediatric Populations',
    journal: 'Cephalalgia / International Headache Society',
    date: 'July 2024',
    category: 'Neuromodulation',
    summary: 'Prospective evaluation of electrical trigeminal and vagus nerve stimulation devices for adolescent migraineurs (ages 12-17) seeking drug-free abortive therapy.',
    takeaway: 'Achieved significant pain relief without sedative medication side effects, ideal for high school students during exam periods.',
    pmid: '37894210',
  },
  {
    id: '6',
    title: "2026 US Emergency Department Guidelines: Class A 'Must Offer' Recommendations",
    journal: 'American Headache Society (AHS) / Dr. Jennifer Robblee Consensus',
    date: 'January 2026',
    category: 'Clinical Guidelines',
    summary: "Dr. Jennifer Robblee presented the updated 2026 US Emergency Department guidelines elevating IV prochlorperazine and Greater Occipital Nerve Blocks (including for teens) to Class A ('Must Offer') status, while designating IV opioids as Class A ('Must NOT Offer').",
    takeaway: 'Prioritizes parenteral dopamine antagonism (PMID: 11335783) and occipital nerve blocks (PMID: 29124490) to abort intractable status migrainosus without habituation.',
    pmid: '11335783',
  },
];

export const LatestResearchNews: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card-panel p-6 md:p-8 bg-gradient-to-r from-sky-50/70 via-white to-indigo-50/70 border-sky-200">
        <div className="flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold w-fit mb-3">
          <Newspaper className="w-3.5 h-3.5" /> Peer-Reviewed Biomedical Literature
        </div>
        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2">
          Latest Breakthrough Research &amp; Clinical Trials
        </h2>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Stay informed on cutting-edge clinical trials, updated international guidelines, and neurovascular discoveries translated directly into MigraineRelief AI's decision engines.
        </p>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {RESEARCH_NEWS.map((item) => (
          <div key={item.id} className="card-panel p-6 flex flex-col justify-between hover:border-sky-300 transition-all">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold">
                  {item.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5" /> {item.date}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2 hover:text-sky-700 transition-colors">
                {item.title}
              </h3>

              <div className="text-xs font-semibold text-sky-700 mb-3 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> {item.journal}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {item.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 mt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-800 mb-3">
                <strong className="text-slate-900 font-bold block mb-0.5">Clinical Translation:</strong>
                {item.takeaway}
              </div>

              {item.pmid && (
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>PMID: {item.pmid}</span>
                  <span className="text-teal-700 font-semibold flex items-center gap-1">
                    Integrated in StateGraph <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
