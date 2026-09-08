import React from 'react';
import { Layers, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { ParsedHealthSummary } from '../lib/wasm_parser';

interface DiagnosticReportProps {
  summary: ParsedHealthSummary | null;
}

export const DiagnosticReport: React.FC<DiagnosticReportProps> = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="card-panel p-6 md:p-8 mb-8 bg-white animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Day-0 Diagnostic Baseline &amp; Epistemic Audit
          </h3>
          <p className="text-xs text-slate-500">Multimodal biomarker extraction</p>
        </div>
        <span className="text-xs text-slate-600 font-mono bg-slate-100 px-3 py-1 rounded-md font-bold">
          {summary.recordCount.toLocaleString()} Records Decoded Locally
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 mb-1 font-semibold">Avg Sleep Duration</div>
          <div className="text-xl font-black text-slate-900">{summary.averageSleepHours}h</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 mb-1 font-semibold">Sleep Fragmentation</div>
          <div className="text-xl font-black text-amber-600">{summary.sleepFragmentationIndex}</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 mb-1 font-semibold">RMSSD Baseline</div>
          <div className="text-xl font-black text-teal-700">{summary.averageHrvMs} ms</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 mb-1 font-semibold">Monthly Attack Days</div>
          <div className="text-xl font-black text-rose-600">{summary.monthlyHeadacheDays} d/mo</div>
        </div>
      </div>

      {/* Epistemic Insights */}
      <div className="space-y-4">
        {/* Tier 1 */}
        <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-200">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge-tier-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Level 1: Confirmed Clinical Protocol
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900 mb-1">
            Gastric Motility &amp; Formulation Mismatch
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Your logs record acute nausea in {Math.round(summary.nauseaRatio * 100)}% of attacks. Swallowed oral pills fail because acute migraine gastroparesis arrests stomach emptying. Switching to intranasal or subcutaneous non-oral delivery bypasses gastric stasis.
          </p>
        </div>

        {/* Tier 2 */}
        <div className="bg-sky-50/50 p-5 rounded-xl border border-sky-200">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge-tier-2">
              <Sparkles className="w-3.5 h-3.5" /> Level 2: Probabilistic Clinical Trial Prior
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900 mb-1">
            Pre-Allodynic Treatment Window
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Burstein et al. (2004) proves triptan administration within &le;60 minutes achieves an 82% 2-hour pain-free rate vs only 38% after cutaneous allodynia locks in. Our in-attack timer protects this window.
          </p>
        </div>

        {/* Tier 3 */}
        <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-200">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge-tier-3">
              <AlertCircle className="w-3.5 h-3.5" /> Level 3: Exploratory Population Prior
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900 mb-1">
            Sleep Fragmentation Threshold Modifier
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Public wearable datasets show sleep fragmentation &gt;0.35 correlates with a 2.1x increase in next-day attack vulnerability. We use this to warn you to keep acute medications nearby, rather than blaming your lifestyle.
          </p>
        </div>
      </div>
    </div>
  );
};
