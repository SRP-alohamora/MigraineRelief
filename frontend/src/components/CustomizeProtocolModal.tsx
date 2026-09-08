import React, { useState } from 'react';
import { X, Sliders, ShieldAlert, Heart, CheckCircle2 } from 'lucide-react';

export interface CustomProtocolSettings {
  patientAge: number;
  routePreference: 'auto' | 'nasal' | 'sc' | 'oral';
  hasCAD: boolean;
  hasHemiplegicAura: boolean;
  isPregnant: boolean;
  avoidTriptanSensations: boolean;
  avoidSedation: boolean;
  triptanDays: number;
  nsaidDays: number;
}

interface CustomizeProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CustomProtocolSettings;
  onSave: (newSettings: CustomProtocolSettings) => void;
}

export const CustomizeProtocolModal: React.FC<CustomizeProtocolModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<CustomProtocolSettings>(settings);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl border border-teal-200">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Customize Rescue Protocol</h2>
              <p className="text-xs text-slate-500">Tune clinical safety gates, route preferences, and sensitivities</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Age & Adolescent Clearance */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Patient Age &amp; Pediatric Clearances
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="5"
                max="90"
                value={formData.patientAge}
                onChange={(e) => setFormData({ ...formData, patientAge: Number(e.target.value) })}
                className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
              />
              <span className="text-xs text-slate-500">
                {formData.patientAge < 18 ? (
                  <span className="text-amber-600 font-semibold">
                    Adolescent Mode: FDA-approved pediatric indications only (Rizatriptan, Ibuprofen, Zolmitriptan nasal). DHE strictly barred.
                  </span>
                ) : (
                  'Adult Pharmacopeia Active (Full acute formulary including DHE POD, SC Sumatriptan, Gepants)'
                )}
              </span>
            </div>
          </div>

          {/* Delivery Route Preference */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Delivery Route Optimization Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'auto', label: 'Auto Motility' },
                { id: 'nasal', label: 'Prefer Nasal' },
                { id: 'sc', label: 'Prefer Injection' },
                { id: 'oral', label: 'Oral Only' },
              ].map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setFormData({ ...formData, routePreference: r.id as any })}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                    formData.routePreference === r.id
                      ? 'bg-teal-50 text-teal-700 border-teal-300 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Auto Motility dynamically detects nausea/vomiting and switches away from oral pills to bypass stomach paralysis.
            </p>
          </div>

          {/* Clinical Contraindications & Co-Morbidities */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" /> Clinical Safety Gates &amp; Conditions
            </label>
            <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasCAD}
                  onChange={(e) => setFormData({ ...formData, hasCAD: e.target.checked })}
                  className="mt-1 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">Cardiovascular Disease / CAD / Raynaud's</div>
                  <div className="text-xs text-slate-500">
                    Eliminates vasoconstrictive triptans and ergots. Directs exclusively to non-vasoconstrictive CGRP gepants (Rimegepant / Zavegepant).
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasHemiplegicAura}
                  onChange={(e) => setFormData({ ...formData, hasHemiplegicAura: e.target.checked })}
                  className="mt-1 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">Hemiplegic Aura / Motor Weakness History</div>
                  <div className="text-xs text-slate-500">
                    SNOOP4 red flag: triptans strictly contraindicated due to basilar vasospasm risk.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.avoidTriptanSensations}
                  onChange={(e) => setFormData({ ...formData, avoidTriptanSensations: e.target.checked })}
                  className="mt-1 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">Aversion to Triptan Chest Tightness / Flushing</div>
                  <div className="text-xs text-slate-500">
                    Prefers gepants (CGRP antagonists) with placebo-level adverse reaction profiles.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Medication Overuse Ledger Adjustments */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Monthly Acute Medication Intake (Rolling 30-Day Days)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-600 block mb-1">Triptans / Ergots:</span>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={formData.triptanDays}
                  onChange={(e) => setFormData({ ...formData, triptanDays: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800"
                />
                <span className="text-xs text-slate-400 mt-1 block">Limit: &le;9 days</span>
              </div>
              <div>
                <span className="text-xs text-slate-600 block mb-1">NSAIDs / Analgesics:</span>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={formData.nsaidDays}
                  onChange={(e) => setFormData({ ...formData, nsaidDays: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800"
                />
                <span className="text-xs text-slate-400 mt-1 block">Limit: &le;14 days</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              <CheckCircle2 className="w-4 h-4" /> Save &amp; Re-evaluate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
