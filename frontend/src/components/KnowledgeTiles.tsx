import React, { useState } from 'react';
import { Clock, AlertCircle, Activity, ShieldAlert, Heart, ChevronRight, X, BookOpen } from 'lucide-react';

interface KnowledgeTileItem {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  summary: string;
  clinicalKey: string;
  citation: string;
  details: string[];
}

const KNOWLEDGE_TILES: KnowledgeTileItem[] = [
  {
    id: 'timing',
    title: 'The 60-Minute Pre-Allodynic Window',
    badge: 'Timing Decay',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Clock,
    summary: 'Efficacy drops from 82% to 38% once cutaneous allodynia locks in.',
    clinicalKey: 'Burstein et al. (Ann Neurol 2004)',
    citation: 'PMID: 15159473',
    details: [
      'Peripheral sensitization begins in first-order trigeminal neurons. Treating here yields 80%+ 2-hour pain freedom.',
      'Central sensitization occurs as second-order neurons in the brainstem become hypersensitive, turning light touch and hair combing painful.',
      'Once allodynia is established, standard triptan vasoconstriction cannot reverse the central pain loop.',
    ],
  },
  {
    id: 'stasis',
    title: 'Bypassing Acute Gastric Stasis',
    badge: 'Route Switch',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: AlertCircle,
    summary: 'Nausea arrests stomach emptying in 78% of attacks; swallowed pills pool unabsorbed.',
    clinicalKey: 'Aurora et al. (Headache 2022)',
    citation: 'PMID: 34989397',
    details: [
      'Migraine triggers acute autonomic gastroparesis (gastric paralysis), halting duodenal drug passage.',
      'Oral tablets experience up to 3 hours of absorption delay or are vomited up before uptake.',
      'Non-oral routes (intranasal sprays, subcutaneous auto-injectors) bypass the GI tract for rapid T_max.',
    ],
  },
  {
    id: 'threshold',
    title: 'Threshold Modifiers vs. "Triggers"',
    badge: 'Neuro-Resistance',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: Activity,
    summary: 'Sleep debt and weather fronts lower resistance; they are not unilateral causes.',
    clinicalKey: 'Allostatic Load Model (Kaggle & Clinical Prior)',
    citation: 'Epistemic Level 3',
    details: [
      'Ending patient guilt: Lifestyle factors do not "cause" migraines in isolation—they lower the brain resistance threshold.',
      'Sleep fragmentation (<5.5 hours) correlates with a 2.1x next-day attack vulnerability multiplier.',
      'Use threshold drops to prepare rescue medications rather than obsessing over strict dietary eliminations.',
    ],
  },
  {
    id: 'moh',
    title: 'Medication Overuse (MOH) Envelope',
    badge: 'ICHD-3 Limit',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: ShieldAlert,
    summary: 'Limit triptans to ≤9 days and NSAIDs to ≤14 days per 30-day cycle.',
    clinicalKey: 'ICHD-3 Section 8.2 Guidelines',
    citation: 'PMID: 38120499',
    details: [
      'Frequent acute rescue use alters central pain modulation, transforming episodic attacks into daily chronic headaches.',
      'Triptans, ergots, and opioids must never exceed 9 treatment days per rolling 30 days.',
      'MigraineRelief enforces an automated 30-day quota ledger to intercept medication overuse before refractoriness develops.',
    ],
  },
  {
    id: 'cgrp',
    title: 'Cardiovascular Safety: Gepants vs. Triptans',
    badge: 'Non-Vasoconstrictive',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Heart,
    summary: 'Small-molecule CGRP gepants are safe for coronary disease, stroke, and Raynaud’s.',
    clinicalKey: 'NEJM (2024 Practice Reviews)',
    citation: 'PMID: 38981245',
    details: [
      'Triptans act on 5-HT 1B/1D receptors to constrict cranial blood vessels, presenting coronary vasospasm risk in CAD.',
      'Gepants (Rimegepant, Zavegepant) target CGRP receptors without producing vasoconstriction.',
      'First-line acute selection for patients with cardiovascular risk or severe triptan chest-tightness sensations.',
    ],
  },
];

export const KnowledgeTiles: React.FC = () => {
  const [selectedTile, setSelectedTile] = useState<KnowledgeTileItem | null>(null);

  return (
    <div className="my-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-teal-600" /> Clinical Science &amp; Knowledge Foundations
        </span>
        <span className="text-[11px] text-slate-400">Click any tile to inspect biological mechanisms</span>
      </div>

      {/* Horizontal Scrollable / Responsive Grid of 5 Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {KNOWLEDGE_TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.id}
              type="button"
              onClick={() => setSelectedTile(tile)}
              className="text-left p-3 rounded-xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-sm transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${tile.badgeColor}`}>
                    {tile.badge}
                  </span>
                  <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight mb-1 group-hover:text-teal-800 transition-colors">
                  {tile.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                  {tile.summary}
                </p>
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-teal-700 font-semibold">
                <span>Inspect Trial</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Expanded Detail Modal when a tile is clicked */}
      {selectedTile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-scale-up">
            <div className="flex items-start justify-between pb-3 mb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${selectedTile.badgeColor}`}>
                    {selectedTile.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{selectedTile.citation}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900">{selectedTile.title}</h3>
                <div className="text-xs text-teal-700 font-semibold">{selectedTile.clinicalKey}</div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTile(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {selectedTile.summary}
            </p>

            <div className="space-y-2 mb-6 text-xs text-slate-600">
              <strong className="text-slate-900 block font-bold">Key Scientific Findings:</strong>
              <ul className="space-y-2">
                {selectedTile.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTile(null)}
                className="btn-primary py-2 px-5 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
