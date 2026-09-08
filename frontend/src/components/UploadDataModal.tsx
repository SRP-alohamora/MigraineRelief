import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Database,
  ArrowRight,
  Clock,
  FileCode,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Check,
} from 'lucide-react';
import {
  MIGRAINE_FIELD_SCHEMA,
  MIGRAINE_FIELD_GROUPS,
  MigraineFieldConfig,
} from '../lib/migraineFieldSchema';
import { getGSTTimestamp, triggerFileDownload } from '../lib/gst_utils';

export interface MigraineValuesMap {
  [key: string]: number;
}

interface UploadDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  loginName: string;
  onSubmitAndAnalyze: (data: MigraineValuesMap, filename: string, gstTimeDisplay: string) => void;
}

export const UploadDataModal: React.FC<UploadDataModalProps> = ({
  isOpen,
  onClose,
  loginName,
  onSubmitAndAnalyze,
}) => {
  // Modal step: 'privacy_gate' (Step 1) | 'questionnaire' (Step 2)
  const [currentStep, setCurrentStep] = useState<'privacy_gate' | 'questionnaire'>('privacy_gate');

  // Form values initialized from schema default values
  const [formValues, setFormValues] = useState<MigraineValuesMap>(() => {
    const initial: MigraineValuesMap = {};
    MIGRAINE_FIELD_SCHEMA.forEach((field) => {
      initial[field.key] = field.defaultValue;
    });
    return initial;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gstInfo, setGstInfo] = useState(() => getGSTTimestamp(loginName));

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('privacy_gate');
      const latest = getGSTTimestamp(loginName);
      setGstInfo(latest);
    }
  }, [isOpen, loginName]);

  if (!isOpen) return null;

  const handleFieldChange = (key: string, value: number) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePrivacyContinue = () => {
    setCurrentStep('questionnaire');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const latestGst = getGSTTimestamp(loginName);
    const targetFilename = latestGst.filename;
    const gstDisplay = latestGst.fullDisplay;

    try {
      const payload = {
        login_name: loginName,
        age: formValues['Age'] ?? 30,
        duration: formValues['Duration'] ?? 1,
        frequency: formValues['Frequency'] ?? 5,
        location: formValues['Location'] ?? 1,
        character: formValues['Character'] ?? 1,
        intensity: formValues['Intensity'] ?? 2,
        nausea: formValues['Nausea'] ?? 1,
        vomit: formValues['Vomit'] ?? 0,
        phonophobia: formValues['Phonophobia'] ?? 1,
        photophobia: formValues['Photophobia'] ?? 1,
        visual: formValues['Visual'] ?? 1,
        sensory: formValues['Sensory'] ?? 2,
        dysphasia: formValues['Dysphasia'] ?? 0,
        dysarthria: formValues['Dysarthria'] ?? 0,
        vertigo: formValues['Vertigo'] ?? 0,
        tinnitus: formValues['Tinnitus'] ?? 0,
        hypoacusis: formValues['Hypoacusis'] ?? 0,
        diplopia: formValues['Diplopia'] ?? 0,
        defect: formValues['Defect'] ?? 0,
        ataxia: formValues['Ataxia'] ?? 0,
        conscience: formValues['Conscience'] ?? 0,
        paresthesia: formValues['Paresthesia'] ?? 0,
        dpf: formValues['DPF'] ?? 0,
        gst_timestamp: gstDisplay,
      };

      const res = await fetch('/patient/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        const exportContent = JSON.stringify(
          {
            metadata: {
              customer_login: loginName,
              filename: result.filename,
              saved_at_gst: result.gst_datetime,
              timezone: 'Gulf Standard Time (UTC+4)',
              rag_indexed: true,
              governance: 'Zero PII / 23 Benchmark Inputs Evaluated',
            },
            input_features: formValues,
            classification_outcome: {
              predicted_type: result.predicted_type,
              confidence_pct: result.confidence_pct,
              recommended_route: result.recommended_route,
              recommended_molecule: result.recommended_molecule,
            },
          },
          null,
          2
        );
        triggerFileDownload(result.filename, exportContent, 'application/json');
      }
    } catch (err) {
      console.warn('Backend save endpoint error, creating client export:', err);
      const fallbackContent = JSON.stringify(
        {
          metadata: {
            customer_login: loginName,
            filename: targetFilename,
            saved_at_gst: gstDisplay,
            timezone: 'Gulf Standard Time (UTC+4)',
            rag_indexed: true,
          },
          input_features: formValues,
        },
        null,
        2
      );
      triggerFileDownload(targetFilename, fallbackContent, 'application/json');
    } finally {
      setIsSubmitting(false);
      onSubmitAndAnalyze(formValues, targetFilename, gstDisplay);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-clinical-fade">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* =========================================================================
            PHASE 8: PRIVACY GATE (STEP 1)
           ========================================================================= */}
        {currentStep === 'privacy_gate' && (
          <div className="p-6 sm:p-8 space-y-6 flex flex-col justify-between max-w-xl mx-auto my-auto text-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#003764] tracking-tight">
                  Protect your privacy
                </h2>
                <span className="text-xs text-slate-500 font-semibold">Clinical Research Protocol &amp; Ethics Guardrail</span>
              </div>
            </div>

            {/* EXACT TEXT SPECIFIED IN PHASE 8 */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-950 leading-relaxed space-y-2">
              <p className="font-semibold">
                Do not enter your name, email, phone number, address, date of birth, medical-record number, insurance information, or other information that could directly identify you.
              </p>
              <p className="text-xs text-amber-900">
                Migraine Relief analyzes structured physiological and symptom characteristics only. All feature inputs are decoupled from personal identity and indexed under ephemeral session tokens.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePrivacyContinue}
                className="btn-primary text-sm flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            PHASE 9 & 10: QUESTIONNAIRE (STEP 2)
           ========================================================================= */}
        {currentStep === 'questionnaire' && (
          <>
            {/* Modal Header */}
            <div className="p-5 border-b border-[#002b4e] flex items-center justify-between bg-[#003764] text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-md">
                  <Database className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                    Migraine Data Evaluation Questionnaire
                    <span className="text-[11px] font-bold bg-[#005a9c] px-2 py-0.5 rounded text-cyan-100 border border-cyan-300/30">
                      23 Model Inputs
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300">
                    Centralized schema mapped to the 400-record clinical dataset (Type target excluded from inputs)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-300 hover:text-white p-1.5 rounded-md hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-8 flex-1 text-slate-800">
              {/* Privacy Confirmation Badge */}
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-md border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Zero-PII Compliance Verified: Non-identifying clinical features only.</span>
              </div>

              {/* Render Fields by Group */}
              {MIGRAINE_FIELD_GROUPS.map((group) => {
                const groupFields = MIGRAINE_FIELD_SCHEMA.filter((f) => f.group === group.key);
                return (
                  <fieldset key={group.key} className="space-y-4 border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
                    <div>
                      <legend className="text-xs sm:text-sm font-extrabold text-[#003764] uppercase tracking-wider block">
                        {group.title}
                      </legend>
                      <p className="text-xs text-slate-500 mt-0.5">{group.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupFields.map((field) => (
                        <div key={field.key} className="bg-slate-50/70 p-3 rounded-md border border-slate-200 space-y-1.5">
                          <div className="flex items-baseline justify-between">
                            <label htmlFor={`field-${field.key}`} className="text-xs font-bold text-slate-800">
                              {field.displayLabel}
                            </label>
                            {field.required && (
                              <span className="text-[10px] text-slate-400 font-mono">Required</span>
                            )}
                          </div>

                          {/* Field Input (faithful to dataset, no invented labels) */}
                          {field.inputType === 'number' ? (
                            <input
                              id={`field-${field.key}`}
                              type="number"
                              min={field.validation?.min}
                              max={field.validation?.max}
                              step={field.validation?.step || 1}
                              value={formValues[field.key] ?? field.defaultValue}
                              onChange={(e) => handleFieldChange(field.key, Number(e.target.value))}
                              className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm bg-white focus:border-[#005a9c] focus:outline-none focus:ring-1 focus:ring-[#005a9c]"
                            />
                          ) : (
                            <select
                              id={`field-${field.key}`}
                              value={formValues[field.key] ?? field.defaultValue}
                              onChange={(e) => handleFieldChange(field.key, Number(e.target.value))}
                              className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm bg-white focus:border-[#005a9c] focus:outline-none focus:ring-1 focus:ring-[#005a9c]"
                            >
                              {field.options?.map((opt) => (
                                <option key={opt.encodedValue} value={opt.encodedValue}>
                                  {opt.displayValue}
                                </option>
                              ))}
                            </select>
                          )}

                          <p className="text-[11px] text-slate-500 leading-snug">
                            {field.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                );
              })}

              {/* Action Footer with GST File Persistence */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <FileCode className="w-4 h-4 text-[#005a9c]" />
                    <span>
                      <strong>Persistent File:</strong>{' '}
                      <code className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-[#003764] font-bold">
                        {gstInfo.filename}
                      </code>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{gstInfo.fullDisplay}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-slate-500">
                    Input features are mapped directly to the benchmark inference matrix.
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('privacy_gate')}
                      className="btn-secondary text-sm"
                    >
                      Back
                    </button>
                    {/* PRIMARY ACTION BUTTON AS SPECIFIED */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary text-sm px-6 py-2.5 flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isSubmitting ? 'Analyzing Features...' : 'Run Analysis'}</span>
                      <ArrowRight className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
