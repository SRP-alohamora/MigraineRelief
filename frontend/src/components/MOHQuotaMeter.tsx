import React from 'react';
import { Calendar, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface MOHQuotaMeterProps {
  triptanDays: number;
  nsaidDays: number;
}

export const MOHQuotaMeter: React.FC<MOHQuotaMeterProps> = ({
  triptanDays,
  nsaidDays,
}) => {
  const triptanLimit = 9;
  const nsaidLimit = 14;

  const triptanPercent = Math.min(100, Math.round((triptanDays / triptanLimit) * 100));
  const nsaidPercent = Math.min(100, Math.round((nsaidDays / nsaidLimit) * 100));

  const isTriptanOver = triptanDays >= 10;
  const isNsaidOver = nsaidDays >= 15;

  return (
    <div className="card-panel p-6 md:p-8 mb-8 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Medication Overuse Headache (MOH) Quota
          </h3>
          <p className="text-xs text-slate-500">ICHD-3 Section 8.2 clinical limits tracker</p>
        </div>
        <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-md">
          Rolling 30-Day Window
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Triptans / Ergots */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span className="text-slate-800">Triptans &amp; Ergots (Limit: &le;9 days)</span>
            <span className={`font-mono font-bold ${isTriptanOver ? 'text-rose-600' : 'text-slate-700'}`}>
              {triptanDays} / 9 days {isTriptanOver && '(EXCEEDED)'}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                isTriptanOver
                  ? 'bg-rose-500'
                  : triptanDays >= 8
                  ? 'bg-amber-500'
                  : 'bg-indigo-600'
              }`}
              style={{ width: `${triptanPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {9 - triptanDays > 0 ? `${9 - triptanDays} acute treatment days remaining this cycle` : 'Threshold reached'}
          </p>
        </div>

        {/* NSAIDs / Analgesics */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span className="text-slate-800">NSAIDs &amp; Combination Analgesics (Limit: &le;14 days)</span>
            <span className={`font-mono font-bold ${isNsaidOver ? 'text-rose-600' : 'text-slate-700'}`}>
              {nsaidDays} / 14 days {isNsaidOver && '(EXCEEDED)'}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                isNsaidOver
                  ? 'bg-rose-500'
                  : nsaidDays >= 12
                  ? 'bg-amber-500'
                  : 'bg-emerald-600'
              }`}
              style={{ width: `${nsaidPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {14 - nsaidDays > 0 ? `${14 - nsaidDays} acute treatment days remaining this cycle` : 'Threshold reached'}
          </p>
        </div>
      </div>

      {(isTriptanOver || isNsaidOver) && (
        <div className="mt-5 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>
            <strong>Clinical Safety Interception:</strong> Taking acute medications beyond monthly limits paradoxically resets trigeminal firing thresholds, causing daily rebound attacks. Discuss transition to preventive CGRP or neuromodulation with your neurologist.
          </span>
        </div>
      )}
    </div>
  );
};
