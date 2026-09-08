import React from 'react';
import { Pill, ShieldCheck, AlertOctagon, Clock, CornerDownRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export interface RescueState {
  triage_status: string;
  recommended_molecule?: string;
  recommended_route: string;
  dosage_mg?: number;
  adjuvant_antiemetic?: string;
  timing_urgency_minutes: number;
  route_switch_reasoning?: string;
  epistemic_tier: string;
  execution_latency_ms: number;
  snoop4_red_flags: string[];
  emergency_divert_message?: string;
  moh_limit_exceeded: boolean;
}

interface RescueActionCardProps {
  state: RescueState;
}

export const RescueActionCard: React.FC<RescueActionCardProps> = ({ state }) => {
  const isEmergency = state.triage_status === 'EMERGENCY_SNOOP4_DETECTED';

  if (isEmergency) {
    return (
      <div className="card-panel p-6 md:p-8 border-rose-300 bg-rose-50/70 mb-8 animate-fade-in shadow-lg shadow-rose-900/5">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-md">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 border border-rose-300 rounded-full text-xs font-extrabold">
              SNOOP4 Secondary Headache Red Flag Detected
            </div>
            <h3 className="text-xl font-black text-rose-950">
              EMERGENCY: Immediate Medical Examination Required
            </h3>
            <p className="text-slate-800 text-sm leading-relaxed">
              {state.emergency_divert_message || 'Sudden or abnormal neurological symptoms require emergency evaluation.'}
            </p>
            <div className="bg-white p-4 rounded-xl border border-rose-200 text-xs text-rose-900 space-y-1">
              <strong className="block font-bold">Detected Clinical Red Flags:</strong>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {state.snoop4_red_flags.map((flag, idx) => (
                  <li key={idx}>{flag}</li>
                ))}
              </ul>
            </div>
            <a
              href="tel:911"
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-rose-600/30 text-sm"
            >
              Call Emergency Services (911)
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-panel p-6 md:p-8 mb-8 border-teal-200 bg-white animate-fade-in shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900 block">Optimal Rescue Regimen Formulated</span>
            <span className="text-xs text-slate-500 font-mono">{state.execution_latency_ms.toFixed(1)}ms deterministic execution</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-tier-1">{state.epistemic_tier}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Recommended Medication & Route */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-teal-600" /> First-Line Acute Molecule
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            {state.recommended_molecule?.replace(/_/g, ' ') || 'Rimegepant 75mg'}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="px-3 py-1 bg-teal-50 border border-teal-200 rounded-lg text-teal-800 text-xs font-bold">
              Route: {state.recommended_route.replace(/_/g, ' ')}
            </span>
            {state.dosage_mg && (
              <span className="px-3 py-1 bg-slate-200/80 rounded-lg text-slate-700 text-xs font-bold font-mono">
                Dose: {state.dosage_mg}mg
              </span>
            )}
          </div>
        </div>

        {/* Timing Window Countdown */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-600" /> Pre-Allodynic Treatment Window
          </div>
          <div className="text-2xl font-black text-indigo-700 tracking-tight mb-2">
            {state.timing_urgency_minutes} Minutes Remaining
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Administer before cutaneous allodynia locks in (Burstein 2004) to maintain 80%+ 2h pain-free efficacy.
          </p>
        </div>
      </div>

      {/* Route Switch Reasoning & Adjuvant */}
      {state.route_switch_reasoning && (
        <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/80 mb-4 text-xs text-slate-800 flex items-start gap-3">
          <CornerDownRight className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-amber-900 font-bold block text-sm">
              Physiological Route Optimization:
            </strong>
            <p className="text-slate-700 leading-relaxed">{state.route_switch_reasoning}</p>
            {state.adjuvant_antiemetic && (
              <div className="mt-2 text-teal-800 font-semibold bg-white p-2.5 rounded-lg border border-amber-200/60 inline-block">
                Prescribed Adjuvant Antiemetic: {state.adjuvant_antiemetic}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MOH Warning if applicable */}
      {state.moh_limit_exceeded && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0" />
          <span>
            <strong>Medication Overuse Warning:</strong> Rolling 30-day acute intake has reached or exceeded ICHD-3 thresholds. Frequent acute drug intake paradoxically increases attack frequency.
          </span>
        </div>
      )}
    </div>
  );
};
