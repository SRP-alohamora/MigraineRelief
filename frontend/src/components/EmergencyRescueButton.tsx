import React, { useState } from 'react';
import { Zap, AlertTriangle, Clock, Activity } from 'lucide-react';

interface EmergencyRescueButtonProps {
  onTriggerRescue: (params: {
    minutesSinceOnset: number;
    nauseaPresent: boolean;
    vomitingPresent: boolean;
    cutaneousAllodynia: boolean;
    painScale: number;
  }) => Promise<void>;
  loading: boolean;
}

export const EmergencyRescueButton: React.FC<EmergencyRescueButtonProps> = ({
  onTriggerRescue,
  loading,
}) => {
  const [minutesSinceOnset, setMinutesSinceOnset] = useState<number>(20);
  const [nauseaPresent, setNauseaPresent] = useState<boolean>(false);
  const [vomitingPresent, setVomitingPresent] = useState<boolean>(false);
  const [cutaneousAllodynia, setCutaneousAllodynia] = useState<boolean>(false);
  const [painScale, setPainScale] = useState<number>(7);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerRescue({
      minutesSinceOnset,
      nauseaPresent,
      vomitingPresent,
      cutaneousAllodynia,
      painScale,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card-panel p-6 md:p-8 mb-8 border-rose-100 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-rose-500 fill-current" /> In-Attack Emergency Rescue Triage
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Formulate optimal medication, route, and timing within &lt;50ms
          </p>
        </div>
        <span className="text-xs px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full font-bold font-mono">
          &lt;3 Taps • Deterministic Engine
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Onset Time Quick Select */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
            <Clock className="w-4 h-4 text-teal-600" /> Minutes Since Onset
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[15, 30, 60, 120].map((mins) => (
              <button
                type="button"
                key={mins}
                onClick={() => setMinutesSinceOnset(mins)}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  minutesSinceOnset === mins
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Symptoms Toggles */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Gastric Motility Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                const next = !nauseaPresent;
                setNauseaPresent(next);
                if (!next) setVomitingPresent(false);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                nauseaPresent
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Nausea {nauseaPresent ? '✓' : ''}
            </button>
            <button
              type="button"
              onClick={() => {
                const next = !vomitingPresent;
                setVomitingPresent(next);
                if (next) setNauseaPresent(true);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                vomitingPresent
                  ? 'bg-rose-100 text-rose-900 border-rose-300 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Vomiting {vomitingPresent ? '✓' : ''}
            </button>
          </div>
        </div>

        {/* Pain Scale Slider */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-rose-600" /> Current Pain Severity
            </label>
            <span className="text-sm font-extrabold text-rose-600">{painScale}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={painScale}
            onChange={(e) => setPainScale(Number(e.target.value))}
            className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
            <span>Mild (1-3)</span>
            <span>Moderate (4-6)</span>
            <span>Severe (7-10)</span>
          </div>
        </div>
      </div>

      {/* Giant Trigger Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-emergency"
      >
        <Zap className="w-5 h-5 fill-current animate-soft-pulse" />
        {loading ? 'Evaluating Pre-Allodynic Window...' : 'ACTIVATE RESCUE COPILOT'}
      </button>
    </form>
  );
};
