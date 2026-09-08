import React from 'react';
import { ShieldCheck, Lock, HeartHandshake, Sparkles, Cpu, Target, CheckCircle2, AlertCircle } from 'lucide-react';

export const ValueProposition: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section: Who We Are */}
      <div className="card-panel p-8 md:p-12 bg-gradient-to-br from-teal-50/80 via-white to-indigo-50/60 border-teal-200">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold mb-4">
            <HeartHandshake className="w-4 h-4 text-teal-700" /> Patient-First Neurovascular Science
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Who We Are
          </h2>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-6 font-medium">
            We are <strong>MigraineRelief AI</strong>—an open-science precision digital health initiative engineered by clinical data scientists, biomedical researchers, and lived-experience migraine advocates.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            For decades, headache medicine has left over 1.1 billion patients trapped in a painful cycle of passive symptom logging, unvalidated trigger-hunting, and generic trial-and-error prescriptions. When an attack strikes, patients are often left curled on bathroom floors, vomiting up swallowed pills that cannot be absorbed due to acute gastric paralysis.
          </p>
          <div className="p-4 bg-white/90 rounded-2xl border border-teal-200/80 text-xs md:text-sm text-slate-800 flex items-start gap-3 shadow-sm">
            <Sparkles className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Our Singular Objective:</strong> To transform acute migraine care from helpless guesswork into a deterministic, <span className="text-teal-800 font-bold">&lt;50ms real-time rescue copilot</span> that protects your brain before central sensitization locks in.
            </div>
          </div>
        </div>
      </div>

      {/* Why Should You Upload Data */}
      <div className="card-panel p-8 md:p-10">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold mb-3 border border-indigo-200">
            <Target className="w-4 h-4 text-indigo-600" /> The N-of-1 Data Imperative
          </div>
          <h3 className="text-xl md:text-3xl font-black text-slate-900 mb-3">
            Why Should a Migraine Patient Upload Their Data?
          </h3>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            The average migraine patient spends <strong>7+ years</strong> and cycles through <strong>5+ different acute medications</strong> before finding partial relief. Why? Because every migraineur possesses a unique neurovascular fingerprint that population-wide averages cannot capture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold mb-4">
              01
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Uncovering Your Latent Window</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your wearable logs (sleep fragmentation, nocturnal HRV drops) reveal your individual allostatic threshold. We alert you when your brain is vulnerable so you never miss the 60-minute pre-allodynic treatment window.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-4">
              02
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Solving the Gastric Stasis Trap</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              By analyzing your past attacks, we identify whether acute nausea halts stomach emptying. We switch your formulation to nasal spray or subcutaneous injection—raising 2-hour pain freedom from 38% to 82%.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold mb-4">
              03
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Preventing Medication Overuse</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Taking acute rescue drugs more than 9 days/month paradoxically transforms episodic attacks into daily chronic pain. We maintain an automated rolling 30-day ledger (ICHD-3 Sec 8.2) to safeguard your brain.
            </p>
          </div>
        </div>
      </div>

      {/* What Are We Going To Do With Your Data */}
      <div className="card-panel p-8 md:p-10 bg-slate-900 text-white rounded-3xl">
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-bold mb-3 border border-teal-500/30">
            <Cpu className="w-4 h-4 text-teal-400" /> Transparent Computational Workflow
          </div>
          <h3 className="text-xl md:text-3xl font-black text-white mb-3">
            What Are We Going To Do With Your Data?
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Zero ambiguity. Zero hidden data brokers. Here is the exact mathematical and clinical pipeline applied to your uploaded logs:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4 items-start">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-slate-100 mb-1">Zero-Knowledge Client-Side Parsing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                When you drag and drop Apple Health <code className="text-teal-300">export.xml</code> or Oura JSON, the parser runs <em>entirely inside your browser sandbox</em>. We encrypt your profile using Web Crypto <strong>AES-GCM-256</strong>. Raw logs never touch our cloud.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-slate-100 mb-1">Calculate Your Allostatic Threshold</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We extract your rolling sleep deficit, nocturnal HRV baseline (RMSSD), and barometric pressure sensitivity to compute your daily Migraine Resistance Threshold.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-slate-100 mb-1">Formulate In-Attack Rescue Regimen</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                During an acute attack, our deterministic StateGraph executes in under 5ms: evaluating SNOOP4 red flags, checking pediatric &amp; cardiovascular safety, selecting non-oral delivery if nausea is present, and pairing with prokinetic antiemetics.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold flex-shrink-0">
              4
            </div>
            <div>
              <h4 className="font-bold text-slate-100 mb-1">Bayesian N-of-1 Closed Loop</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                You provide 1-tap feedback at 2 hours and 24 hours ("Pain Free: Yes/No"). Your feedback continuously updates your personal Bayesian posterior weights—making each subsequent attack more treatable.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Lock className="w-4 h-4 text-emerald-400" />
            Zero Protected Health Information (PHI) Stored on External Servers
          </div>
          <div className="text-xs text-slate-400">
            Open-Science MIT Licensed Architecture • Non-Commercial Research
          </div>
        </div>
      </div>
    </div>
  );
};
