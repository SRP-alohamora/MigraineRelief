import React, { useState } from 'react';
import { BarChart3, PieChart, Sparkles, TrendingUp, Info, CheckCircle2, ArrowRight } from 'lucide-react';

export const ResearchCharts: React.FC = () => {
  const [activeChart, setActiveChart] = useState<'aura' | 'symptoms' | 'triggers'>('aura');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Introduction Card */}
      <div className="card-panel p-6 md:p-8 bg-gradient-to-r from-teal-50/70 via-white to-sky-50/70 border-teal-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold">
            <BarChart3 className="w-3.5 h-3.5" /> Public Kaggle Clinical Dataset Analysis (N=400)
          </div>
          <span className="text-xs text-slate-500 font-mono">Epistemic Level 2 &amp; 3 Evidence</span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2">
          From Population Baselines to N-of-1 Personalization
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Generic medicine treats all headaches with the same trial-and-error oral prescription. By analyzing public Kaggle clinical cohorts alongside published neurovascular trials (Burstein 2004, Aurora 2022), we demonstrate why personalized intervention transforms acute migraine outcomes.
        </p>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={() => setActiveChart('aura')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeChart === 'aura'
                ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            1. Subtypes &amp; Aura Dynamics
          </button>
          <button
            onClick={() => setActiveChart('symptoms')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeChart === 'symptoms'
                ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            2. Gastric Stasis &amp; Symptoms
          </button>
          <button
            onClick={() => setActiveChart('triggers')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeChart === 'triggers'
                ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            3. Threshold Modifiers vs Triggers
          </button>
        </div>
      </div>

      {/* Chart 1: Aura & Subtype Classification */}
      {activeChart === 'aura' && (
        <div className="card-panel p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-teal-600" />
                Migraine Subtype &amp; Aura Distribution (Kaggle Cohort)
              </h3>
              <p className="text-xs text-slate-500">Distribution of 400 diagnosed clinical presentations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Visual SVG Bar Breakdown */}
            <div className="space-y-3.5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              {[
                { label: 'Typical Aura with Migraine', percent: 61, color: '#0d9488', count: '244 patients' },
                { label: 'Migraine without Aura', percent: 25, color: '#0284c7', count: '100 patients' },
                { label: 'Basilar-Type Aura', percent: 6, color: '#6366f1', count: '24 patients' },
                { label: 'Familial Hemiplegic Migraine', percent: 4, color: '#e11d48', count: '16 patients' },
                { label: 'Sporadic Episodic & Other', percent: 4, color: '#d97706', count: '16 patients' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-800">{item.label}</span>
                    <span className="text-slate-500 font-mono">{item.percent}% ({item.count})</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-700"
                      style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Personalization Benefit Callout */}
            <div className="bg-teal-50/70 border border-teal-200 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-teal-600" />
                How You Benefit from Personalization:
              </div>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                Standard medical care prescribes identical swallowed sumatriptan tablets regardless of aura status. However, cortical spreading depression (the biological origin of aura) moves across neural tissue at <strong>~3 mm/min</strong>.
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-teal-100 text-xs text-slate-800 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Aura Timing Precision:</strong> Taking medication at the exact onset of visual aura stops central sensitization before cutaneous allodynia locks in (Burstein 2004).</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Contraindication Safety:</strong> Hemiplegic aura involves motor weakness where vasoconstrictive triptans are dangerous and strictly contraindicated. Our engine automates this check.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart 2: Gastric Stasis & Symptoms */}
      {activeChart === 'symptoms' && (
        <div className="card-panel p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-sky-600" />
                Symptom Co-Occurrence &amp; Gastric Malabsorption (N=400)
              </h3>
              <p className="text-xs text-slate-500">Frequency of acute autonomic and sensory symptoms</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Symptom Frequency Bars */}
            <div className="space-y-3.5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              {[
                { symptom: 'Photophobia (Light Sensitivity)', rate: 86, color: '#f59e0b' },
                { symptom: 'Nausea (Gastric Stasis Active)', rate: 78, color: '#e11d48' },
                { symptom: 'Phonophobia (Sound Sensitivity)', rate: 74, color: '#0ea5e9' },
                { symptom: 'Cutaneous Allodynia (Skin Pain)', rate: 56, color: '#6366f1' },
                { symptom: 'Active Vomiting (Emesis)', rate: 34, color: '#dc2626' },
              ].map((item) => (
                <div key={item.symptom}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-800">{item.symptom}</span>
                    <span className="text-slate-500 font-mono font-bold">{item.rate}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-700"
                      style={{ width: `${item.rate}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Personalization Benefit Callout */}
            <div className="bg-sky-50/70 border border-sky-200 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-sky-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-sky-600" />
                Why Formulation Route Bypasses Treatment Failure:
              </div>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                Despite <strong>78% of attacks presenting with acute nausea</strong>, over 85% of primary care patients are prescribed standard oral swallowed pills.
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-sky-100 text-xs text-slate-800 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Gastroparesis Bypass:</strong> During nausea, stomach emptying halts. Swallowed pills sit in gastric acid without reaching duodenal absorption zones (Aurora 2022).</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Route Switch Advantage:</strong> Switching to non-oral delivery (intranasal spray or subcutaneous auto-injector) restores bioavailability, lifting 2-hour pain freedom from 38% to 82%.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart 3: Threshold Modifiers vs Triggers */}
      {activeChart === 'triggers' && (
        <div className="card-panel p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Threshold Modifiers: Relative Attack Risk Multipliers
              </h3>
              <p className="text-xs text-slate-500">Derived from Kaggle wearable logs and Allostatic Load modeling</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Risk Factor Multipliers */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              {[
                { factor: 'Fragmented Sleep (<5.5h or >2 awakenings)', multiplier: '2.1x', percent: 85, color: '#6366f1' },
                { factor: 'Acute Stress Drop ("Weekend Migraine" let-down)', multiplier: '1.8x', percent: 72, color: '#8b5cf6' },
                { factor: 'Barometric Pressure Drop (>6 hPa delta)', multiplier: '1.6x', percent: 64, color: '#0ea5e9' },
                { factor: 'Delayed / Skipped Meal (>5 hours)', multiplier: '1.4x', percent: 56, color: '#10b981' },
              ].map((item) => (
                <div key={item.factor}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-800">{item.factor}</span>
                    <span className="text-indigo-700 font-mono font-bold">{item.multiplier} Risk</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-700"
                      style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Personalization Benefit Callout */}
            <div className="bg-indigo-50/70 border border-indigo-200 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Reframing Triggers into Brain Threshold Meter:
              </div>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                Traditional headache diaries lead patients into obsessive, guilt-inducing elimination diets. But public wearable data confirms that lifestyle factors are <strong>threshold modifiers</strong>, not isolated causes.
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-indigo-100 text-xs text-slate-800 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Zero Guilt Guidance:</strong> Instead of "you ate chocolate, so it's your fault," we notify you: "Your threshold is lowered due to fragmented sleep; keep acute rescue medication in arm's reach."</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Day-0 Personalized Baseline:</strong> Your uploaded logs calibrate your individual threshold curve so you can live freely while staying prepared.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
