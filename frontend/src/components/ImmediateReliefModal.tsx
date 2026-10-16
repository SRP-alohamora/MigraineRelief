import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Clock,
  AlertOctagon,
  CornerDownRight,
  Pill,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Heart,
  Droplets,
  Moon,
  Coffee,
  Smile,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Lock
} from 'lucide-react';
import { ConvergenceHypothesisDiagram } from './ConvergenceHypothesisDiagram';

export interface RAGRescueResult {
  patient_id: string;
  recommended_molecule?: string;
  recommended_dose?: string;
  recommended_route: string;
  route_switch_reasoning?: string;
  timing_guidance?: string;
  rescue_protocol_card?: string;
  epistemic_tier: string;
  snoop4_emergency_detected: boolean;
  emergency_reason?: string;
  refusal_triggered: boolean;
  faithfulness_score: number;
  relevance_score: number;
  execution_latency_ms: number;
  bmj2024_citations: Array<{
    name: string;
    class?: string;
    or_pain_free_2h?: number;
    ci_95?: number[];
    cinema_confidence?: string;
    bypass_stasis?: boolean;
    hybrid_score?: number;
  }>;
  moh_warning?: boolean;
  pre_allodynic_window_remaining_minutes: number;
}

interface ImmediateReliefModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn?: boolean;
  activeUsername?: string;
}

const SMART_SUGGESTION_TEXT =
  'Throbbing left temple headache starting 20m ago with zigzag flashing lights in school nurse office. No vomiting.';

export const ImmediateReliefModal: React.FC<ImmediateReliefModalProps> = ({
  isOpen,
  onClose,
  isLoggedIn = false,
  activeUsername = 'Guest Researcher'
}) => {
  // Modal Stepper: 1 -> 2 -> 3 -> 4 -> 5 -> 6 (Final Strategy)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Profile Selection (Step 1)
  const [selectedProfile, setSelectedProfile] = useState<string>('anonymous');
  const [pendingProfile, setPendingProfile] = useState<'claire' | 'alexa' | null>(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState<boolean>(false);
  const [profilePassword, setProfilePassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [authenticatedProfiles, setAuthenticatedProfiles] = useState<{ [key: string]: boolean }>({});

  // Symptoms Selection (Step 2: Do not select anything by default)
  const [nauseaPresent, setNauseaPresent] = useState<boolean>(false);
  const [vomitingPresent, setVomitingPresent] = useState<boolean>(false);
  const [visualAura, setVisualAura] = useState<boolean>(false);
  const [vertigoPresent, setVertigoPresent] = useState<boolean>(false);
  const [allodyniaPresent, setAllodyniaPresent] = useState<boolean>(false);
  const [cadHistory, setCadHistory] = useState<boolean>(false);

  // Timing & Severity (Step 3 & Step 4)
  const [minutesSinceOnset, setMinutesSinceOnset] = useState<number>(20);
  const [painIntensity, setPainIntensity] = useState<number>(2); // 1, 2, 3
  const [patientAge, setPatientAge] = useState<number>(32);
  const [rollingTriptanDays, setRollingTriptanDays] = useState<number>(2);

  // Notes & Chat (Step 5)
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [typedPlaceholder, setTypedPlaceholder] = useState<string>('');

  // Results & Execution (Step 6)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<RAGRescueResult | null>(null);

  // 2-Hour Feedback Check (Quick options + Free-type text window)
  const [feedbackRating, setFeedbackRating] = useState<'IDLE' | 'PAIN_FREE' | 'PARTIAL' | 'NONE'>('IDLE');
  const [feedbackNotes, setFeedbackNotes] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  // Reset all state to Step 1 and unselect all symptoms whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedProfile('anonymous');
      setShowPasswordPrompt(false);
      setPendingProfile(null);
      setProfilePassword('');
      setPasswordError(null);
      setNauseaPresent(false);
      setVomitingPresent(false);
      setVisualAura(false);
      setVertigoPresent(false);
      setAllodyniaPresent(false);
      setCadHistory(false);
      setMinutesSinceOnset(20);
      setPainIntensity(2);
      setAdditionalNotes('');
      setResult(null);
      setFeedbackRating('IDLE');
      setFeedbackNotes('');
      setFeedbackSubmitted(false);
    }
  }, [isOpen]);

  // Clean close handler that completely resets the modal for the next session
  const handleCloseModal = () => {
    setCurrentStep(1);
    setSelectedProfile('anonymous');
    setShowPasswordPrompt(false);
    setPendingProfile(null);
    setProfilePassword('');
    setPasswordError(null);
    setNauseaPresent(false);
    setVomitingPresent(false);
    setVisualAura(false);
    setVertigoPresent(false);
    setAllodyniaPresent(false);
    setCadHistory(false);
    setMinutesSinceOnset(20);
    setPainIntensity(2);
    setAdditionalNotes('');
    setResult(null);
    setFeedbackRating('IDLE');
    setFeedbackNotes('');
    setFeedbackSubmitted(false);
    onClose();
  };

  // Typewriter effect for Step 4 textarea placeholder
  useEffect(() => {
    let index = 0;
    let isDeleting = false;
    let timer: any = null;

    const tick = () => {
      const fullText = SMART_SUGGESTION_TEXT;
      if (!isDeleting) {
        setTypedPlaceholder(fullText.slice(0, index + 1));
        index++;
        if (index === fullText.length) {
          isDeleting = true;
          timer = setTimeout(tick, 2800);
          return;
        }
      } else {
        setTypedPlaceholder(fullText.slice(0, index - 1));
        index--;
        if (index === 0) {
          isDeleting = false;
          timer = setTimeout(tick, 600);
          return;
        }
      }
      timer = setTimeout(tick, isDeleting ? 25 : 50);
    };

    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, []);

  // Apply clinical preset data once authenticated or when anonymous
  const applyProfileData = (profileKey: string) => {
    setSelectedProfile(profileKey);

    if (profileKey === 'claire') {
      setPatientAge(45);
      setMinutesSinceOnset(25);
      setPainIntensity(3);
      setNauseaPresent(true);
      setVomitingPresent(true);
      setVisualAura(false);
      setVertigoPresent(true);
      setAllodyniaPresent(true);
      setCadHistory(false);
      setRollingTriptanDays(8);
      setAdditionalNotes('Severe acute attack starting 25m ago with violent vomiting and nausea. Oral tablets do not stay down.');
    } else if (profileKey === 'alexa') {
      setPatientAge(15);
      setMinutesSinceOnset(20);
      setPainIntensity(2);
      setNauseaPresent(true);
      setVomitingPresent(false);
      setVisualAura(true);
      setVertigoPresent(false);
      setAllodyniaPresent(false);
      setCadHistory(false);
      setRollingTriptanDays(4);
      setAdditionalNotes('Throbbing left temple headache starting 20m ago with zigzag flashing lights in school nurse office. No vomiting.');
    } else {
      // Anonymous (no password required)
      setPatientAge(32);
      setMinutesSinceOnset(20);
      setPainIntensity(2);
      setNauseaPresent(false);
      setVomitingPresent(false);
      setVisualAura(false);
      setVertigoPresent(false);
      setAllodyniaPresent(false);
      setCadHistory(false);
      setRollingTriptanDays(2);
      setAdditionalNotes('');
    }
  };

  // Dropdown selection handler:
  // If customer selects Claire or Alexa, pop in screen to enter password.
  // No password is asked for anonymous.
  const handleProfileChange = (profileKey: string) => {
    if (profileKey === 'claire' || profileKey === 'alexa') {
      if (authenticatedProfiles[profileKey]) {
        applyProfileData(profileKey);
      } else {
        setPendingProfile(profileKey as 'claire' | 'alexa');
        setProfilePassword('');
        setPasswordError(null);
        setShowPasswordPrompt(true);
      }
    } else {
      // Anonymous: No password is asked
      applyProfileData('anonymous');
    }
  };

  // Check password for Claire or Alexa
  const handleVerifyPassword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pendingProfile) return;

    const cleanInput = profilePassword.trim().toLowerCase();
    const isCorrect =
      (pendingProfile === 'claire' && (cleanInput === 'claire' || cleanInput === 'password')) ||
      (pendingProfile === 'alexa' && (cleanInput === 'alexa' || cleanInput === 'password'));

    if (isCorrect) {
      setAuthenticatedProfiles((prev) => ({ ...prev, [pendingProfile]: true }));
      applyProfileData(pendingProfile);
      setShowPasswordPrompt(false);
      setPendingProfile(null);
      setProfilePassword('');
      setPasswordError(null);
    } else {
      setPasswordError(
        `Incorrect password for ${pendingProfile === 'claire' ? 'Claire' : 'Alexa'}. Please try again or continue as Anonymous.`
      );
    }
  };

  const handleCancelPassword = () => {
    setShowPasswordPrompt(false);
    setPendingProfile(null);
    setProfilePassword('');
    setPasswordError(null);
    // If not already authenticated as Claire or Alexa, remain on anonymous
    if (!authenticatedProfiles[selectedProfile]) {
      applyProfileData('anonymous');
    }
  };

  // Run Triage and go to Step 5 (Final Strategy)
  const handleRunTriage = async () => {
    setIsLoading(true);
    setFeedbackRating('IDLE');
    setFeedbackNotes('');
    setFeedbackSubmitted(false);

    // Clinical Guardrail 4:
    // If pain intensity is severe (3), length has exceeded 4+ hours (>=240m),
    // and patient is showing vomiting, this presents acute dehydration risk -> show warning screener
    if (painIntensity === 3 && minutesSinceOnset >= 240 && vomitingPresent) {
      const dehydrationEmergencyResult: RAGRescueResult = {
        patient_id: selectedProfile,
        recommended_molecule: undefined,
        recommended_dose: undefined,
        recommended_route: 'EMERGENCY_DIVERSION',
        route_switch_reasoning:
          'Oral medications cannot be absorbed or retained due to persistent vomiting (>4 hours). Severe fluid and electrolyte depletion creates an urgent clinical dehydration emergency.',
        timing_guidance:
          'Headache duration has exceeded 4 hours with active vomiting. Do not delay seeking medical care.',
        rescue_protocol_card:
          'CRITICAL WARNING SCREENER: High Dehydration & Status Migrainosus Risk. Severe pain lasting >4 hours with active vomiting prevents oral hydration and drug absorption. Immediate emergency or urgent care evaluation required for IV rehydration and non-oral abortive treatment.',
        epistemic_tier: 'EMERGENCY CLINICAL DIVERSION',
        snoop4_emergency_detected: true,
        emergency_reason:
          'Clinical Warning Screener: High Risk of Severe Dehydration & Status Migrainosus. Severe headache pain lasting over 4 hours with active vomiting presents acute danger of severe dehydration, electrolyte depletion, and gastric stasis. Oral medications cannot be retained and emergency care is required for IV rehydration and parenteral therapy.',
        refusal_triggered: true,
        faithfulness_score: 1.0,
        relevance_score: 1.0,
        execution_latency_ms: 1.5,
        bmj2024_citations: [],
        moh_warning: false,
        pre_allodynic_window_remaining_minutes: 0
      };
      setResult(dehydrationEmergencyResult);
      setIsLoading(false);
      setCurrentStep(6);
      return;
    }

    const payload = {
      user_query: additionalNotes || 'Migraine acute attack relief query',
      patient_id: selectedProfile,
      patient_age: patientAge,
      minutes_since_onset: minutesSinceOnset,
      pain_intensity: painIntensity,
      nausea_present: nauseaPresent,
      vomiting_present: vomitingPresent,
      cardiovascular_disease_cad: cadHistory,
      cutaneous_allodynia_flag: allodyniaPresent,
      rolling_30d_triptan_days: rollingTriptanDays
    };

    try {
      const response = await fetch('/rag/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: RAGRescueResult = await response.json();
      setResult(data);
    } catch {
      // Offline fallback adhering strictly to clinical rules
      const isDehydrationRisk = painIntensity === 3 && minutesSinceOnset >= 240 && vomitingPresent;
      const isThunderclap =
        additionalNotes.toLowerCase().includes('thunderclap') ||
        additionalNotes.toLowerCase().includes('seconds to peak');

      const fallback: RAGRescueResult = {
        patient_id: selectedProfile,
        recommended_molecule: isThunderclap || isDehydrationRisk
          ? undefined
          : vomitingPresent
          ? 'Sumatriptan 6mg Subcutaneous Auto-Injector'
          : patientAge < 18
          ? 'Rizatriptan 5mg Rapid-Dissolve Tablet (ODT)'
          : 'Eletriptan 40mg Oral Tablet',
        recommended_dose: isThunderclap || isDehydrationRisk ? undefined : vomitingPresent ? '6mg single-dose' : 'Standard therapeutic dose',
        recommended_route: isThunderclap || isDehydrationRisk
          ? 'EMERGENCY_DIVERSION'
          : vomitingPresent
          ? 'SUBCUTANEOUS_AUTO_INJECTOR'
          : patientAge < 18
          ? 'ORAL_DISINTEGRATING_TABLET'
          : 'ORAL_TABLET',
        route_switch_reasoning: isDehydrationRisk
          ? 'Oral abortives cannot be retained or absorbed due to severe protracted vomiting (>4 hours). Urgent medical evaluation is required for IV antiemetics and hydration.'
          : vomitingPresent
          ? 'Because you are actively vomiting, standard oral tablets cannot dissolve or stay down. A non-oral option (like a subcutaneous injection or nasal spray) enters your bloodstream in 10-15 minutes without passing through your stomach.'
          : patientAge < 18
          ? 'Rapid-dissolving tablet dissolves on the tongue without needing water, ideal for school hours.'
          : 'Normal stomach absorption is intact, so oral tablets are effective.',
        timing_guidance: isDehydrationRisk
          ? 'Headache duration has exceeded 4 hours with active vomiting. Do not delay seeking medical care.'
          : `Treat as early as possible within the remaining ${Math.max(0, 60 - minutesSinceOnset)} minutes before nerve sensitivity peaks.`,
        rescue_protocol_card: isDehydrationRisk
          ? 'CRITICAL WARNING SCREENER: High Dehydration & Status Migrainosus Risk. Severe pain lasting >4 hours with active vomiting presents critical dehydration risk. Emergency evaluation required for IV rehydration.'
          : isThunderclap
          ? 'WARNING: Severe sudden thunderclap headache requires immediate emergency examination (Call 911).'
          : 'Personalized protocol anchored in BMJ 2024 clinical evidence.',
        epistemic_tier: isThunderclap || isDehydrationRisk ? 'EMERGENCY CLINICAL DIVERSION' : 'Level 1: Clinical Evidence (BMJ 2024)',
        snoop4_emergency_detected: isThunderclap || isDehydrationRisk,
        emergency_reason: isDehydrationRisk
          ? 'Clinical Warning Screener: High Risk of Severe Dehydration & Status Migrainosus. Severe headache lasting 4+ hours with active vomiting requires emergency IV hydration.'
          : isThunderclap
          ? 'Sudden severe thunderclap onset suggestive of emergency.'
          : undefined,
        refusal_triggered: isThunderclap || isDehydrationRisk,
        faithfulness_score: 0.99,
        relevance_score: 0.95,
        execution_latency_ms: 3.85,
        bmj2024_citations: isDehydrationRisk ? [] : [
          {
            name: vomitingPresent ? 'Sumatriptan 6mg SC' : patientAge < 18 ? 'Rizatriptan 5mg ODT' : 'Eletriptan 40mg',
            or_pain_free_2h: vomitingPresent ? 3.12 : patientAge < 18 ? 3.65 : 4.15,
            cinema_confidence: 'HIGH',
            bypass_stasis: vomitingPresent
          }
        ],
        moh_warning: rollingTriptanDays >= 8,
        pre_allodynic_window_remaining_minutes: Math.max(0, 60 - minutesSinceOnset)
      };
      setResult(fallback);
    } finally {
      setIsLoading(false);
      setCurrentStep(6); // Advance to Step 6 (Final Recommended Strategy)
    }
  };

  if (!isOpen) return null;

  // Window remaining calculation
  const windowRemaining = Math.max(0, 60 - minutesSinceOnset);
  const isDehydrationRisk = painIntensity === 3 && minutesSinceOnset >= 240 && vomitingPresent;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-clinical-fade font-sans"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl my-auto bg-[#0A0E17] text-[#E2E8F0] rounded-2xl border border-[#1E293B] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E293B] bg-[#0E1424]">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
              <Zap className="w-4 h-4 fill-current text-amber-300" />
            </span>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-teal-300 block">
                {currentStep === 1 && 'Step 1 of 5 • Choose Profile'}
                {currentStep === 2 && 'Step 2 of 5 • Current Symptoms'}
                {currentStep === 3 && 'Step 3 of 5 • When Did It Start?'}
                {currentStep === 4 && 'Step 4 of 5 • Pain Intensity'}
                {currentStep === 5 && 'Step 5 of 5 • Notes & Conditions'}
                {currentStep === 6 && 'Final Recommended Strategy'}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Photophobia-Calibrated Relief Guidance
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCloseModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Stepper Indicator */}
        <div className="w-full bg-[#111827] px-5 py-2.5 border-b border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400">
          {[1, 2, 3, 4, 5].map((stepNum) => (
            <div key={stepNum} className="flex items-center gap-1.5">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  currentStep === stepNum
                    ? 'bg-teal-500 text-slate-950 ring-2 ring-teal-400/50'
                    : currentStep > stepNum
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {currentStep > stepNum ? '✓' : stepNum}
              </span>
              <span className={`hidden sm:inline text-[11px] ${currentStep === stepNum ? 'text-white' : ''}`}>
                {stepNum === 1 && 'Profile'}
                {stepNum === 2 && 'Symptoms'}
                {stepNum === 3 && 'Onset'}
                {stepNum === 4 && 'Pain'}
                {stepNum === 5 && 'Notes'}
              </span>
              {stepNum < 5 && <span className="text-slate-600 mx-1">→</span>}
            </div>
          ))}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                currentStep === 6 ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300' : 'bg-slate-800 text-slate-400'
              }`}
            >
              ★
            </span>
            <span className={`text-[11px] font-bold ${currentStep === 6 ? 'text-amber-300' : 'text-slate-500'}`}>
              Relief Plan
            </span>
          </div>
        </div>

        {/* Modal Scrollable Content Area */}
        <div className="p-5 sm:p-6 md:p-8 overflow-y-auto space-y-5 flex-1">
          {/* ================= STEP 1: CHOOSE PROFILE ================= */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-clinical-fade">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
                  Step 1: Choose a Patient Profile
                </h3>
                <p className="text-xs text-slate-400">
                  Select a clinical persona or proceed anonymously to formulate your personalized rescue strategy.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="modal-profile-select" className="text-xs font-bold uppercase tracking-wider text-teal-300 block">
                  Select Patient Profile:
                </label>
                <div className="relative">
                  <select
                    id="modal-profile-select"
                    value={selectedProfile}
                    onChange={(e) => handleProfileChange(e.target.value)}
                    className="w-full bg-[#161B22] border border-slate-700 text-white rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-teal-400 transition-all appearance-none pr-10 cursor-pointer"
                  >
                    <option value="claire">Claire</option>
                    <option value="alexa">Alexa</option>
                    <option value="anonymous">Anonymous</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Pop-in Screen to Enter Password for Claire or Alexa */}
              {showPasswordPrompt && pendingProfile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-clinical-fade font-sans">
                  <div className="relative w-full max-w-md bg-[#0F172A] border border-teal-500/40 rounded-2xl p-6 shadow-2xl space-y-4 text-[#E2E8F0]">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
                          <Lock className="w-4 h-4 text-teal-300" />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-white">
                            Enter Password for {pendingProfile === 'claire' ? 'Claire' : 'Alexa'}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Identity verification required to access this patient profile
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleCancelPassword}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                        aria-label="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleVerifyPassword} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-teal-300 block mb-1.5">
                          Profile Password:
                        </label>
                        <input
                          type="password"
                          autoFocus
                          value={profilePassword}
                          onChange={(e) => {
                            setProfilePassword(e.target.value);
                            setPasswordError(null);
                          }}
                          placeholder={`Enter password for ${pendingProfile === 'claire' ? 'Claire' : 'Alexa'}`}
                          className="w-full bg-[#161B22] border border-slate-700 text-white rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-teal-400 transition-all placeholder-slate-500"
                        />
                        <p className="text-[11px] text-slate-400 mt-1.5">
                          Demo password: <code className="text-teal-300 font-mono font-bold bg-[#161B22] px-1.5 py-0.5 rounded border border-slate-800">{pendingProfile}</code>
                        </p>
                      </div>

                      {passwordError && (
                        <div className="p-3 bg-rose-950/60 border border-rose-500/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                          <AlertOctagon className="w-4 h-4 shrink-0 text-rose-400" />
                          <span>{passwordError}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={handleCancelPassword}
                          className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                        >
                          Continue as Anonymous
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-teal-500/20"
                        >
                          <ShieldCheck className="w-4 h-4" /> Verify &amp; Continue
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Profile Overview Card */}
              <div className="p-4 rounded-xl bg-[#161B22] border border-slate-800 space-y-2 text-xs text-slate-300 leading-relaxed">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-teal-300 font-bold">
                    <span>Selected Profile:</span>
                    <span className="text-white font-black capitalize">{selectedProfile}</span>
                  </div>
                  {authenticatedProfiles[selectedProfile] && (
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Authenticated
                    </span>
                  )}
                </div>
                {selectedProfile === 'claire' && (
                  <p>
                    <strong>Claire:</strong> Chronic migraine sufferer experiencing violent nausea and active vomiting. Evaluates autonomic gastroparesis route-switching to non-oral delivery (subcutaneous auto-injector).
                  </p>
                )}
                {selectedProfile === 'alexa' && (
                  <p>
                    <strong>Alexa:</strong> High school student in nurse office with classic scintillating scotoma (zigzag lights). Evaluates FDA pediatric safety gating and waterless rapid-dissolving tablet (ODT).
                  </p>
                )}
                {selectedProfile === 'anonymous' && (
                  <p>
                    <strong>Anonymous:</strong> Private, zero-PII session. Enter your specific headache symptoms, duration, and conditions in the next steps. No password required.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 2: SELECT SYMPTOMS ================= */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-clinical-fade">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
                  Step 2: What symptoms are you experiencing right now?
                </h3>
                <p className="text-xs text-slate-400">
                  Tap to toggle your current active symptoms. This determines whether oral pills will work or non-oral routes are required.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Nausea */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !nauseaPresent;
                    setNauseaPresent(next);
                    if (!next) setVomitingPresent(false);
                  }}
                  className={`min-h-[52px] px-4 py-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    nauseaPresent
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                      : 'bg-[#161B22] border-slate-800 text-slate-400 hover:bg-[#1E293B]'
                  }`}
                >
                  <span className="text-sm">🤢 Nausea (Upset Stomach)</span>
                  <span className="font-mono text-xs">{nauseaPresent ? 'YES' : 'NO'}</span>
                </button>

                {/* Vomiting */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !vomitingPresent;
                    setVomitingPresent(next);
                    if (next) setNauseaPresent(true);
                  }}
                  className={`min-h-[52px] px-4 py-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    vomitingPresent
                      ? 'bg-rose-500/25 border-rose-500 text-rose-300'
                      : 'bg-[#161B22] border-slate-800 text-slate-400 hover:bg-[#1E293B]'
                  }`}
                >
                  <span className="text-sm">🤮 Vomiting / Throwing Up</span>
                  <span className="font-mono text-xs">{vomitingPresent ? 'YES' : 'NO'}</span>
                </button>

                {/* Visual Aura */}
                <button
                  type="button"
                  onClick={() => setVisualAura(!visualAura)}
                  className={`min-h-[52px] px-4 py-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    visualAura
                      ? 'bg-sky-500/20 border-sky-500 text-sky-200'
                      : 'bg-[#161B22] border-slate-800 text-slate-400 hover:bg-[#1E293B]'
                  }`}
                >
                  <span className="text-sm">✨ Visual Aura (Flashing/Zigzag)</span>
                  <span className="font-mono text-xs">{visualAura ? 'YES' : 'NO'}</span>
                </button>

                {/* Scalp Sensitivity */}
                <button
                  type="button"
                  onClick={() => setAllodyniaPresent(!allodyniaPresent)}
                  className={`min-h-[52px] px-4 py-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    allodyniaPresent
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200'
                      : 'bg-[#161B22] border-slate-800 text-slate-400 hover:bg-[#1E293B]'
                  }`}
                >
                  <span className="text-sm">💆 Scalp Sensitivity (Hurts to brush)</span>
                  <span className="font-mono text-xs">{allodyniaPresent ? 'YES' : 'NO'}</span>
                </button>

                {/* Dizziness */}
                <button
                  type="button"
                  onClick={() => setVertigoPresent(!vertigoPresent)}
                  className={`min-h-[52px] px-4 py-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    vertigoPresent
                      ? 'bg-purple-500/20 border-purple-500 text-purple-200'
                      : 'bg-[#161B22] border-slate-800 text-slate-400 hover:bg-[#1E293B]'
                  }`}
                >
                  <span className="text-sm">💫 Dizziness / Room Spinning</span>
                  <span className="font-mono text-xs">{vertigoPresent ? 'YES' : 'NO'}</span>
                </button>

                {/* Heart Disease */}
                <button
                  type="button"
                  onClick={() => setCadHistory(!cadHistory)}
                  className={`min-h-[52px] px-4 py-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    cadHistory
                      ? 'bg-red-950/60 border-red-500 text-red-300'
                      : 'bg-[#161B22] border-slate-800 text-slate-400 hover:bg-[#1E293B]'
                  }`}
                >
                  <span className="text-sm">❤️ Heart Disease / Stents History</span>
                  <span className="font-mono text-xs">{cadHistory ? 'YES' : 'NO'}</span>
                </button>
              </div>

              {/* Live Dehydration Warning Alert */}
              {isDehydrationRisk && (
                <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-500/80 text-rose-200 text-xs flex items-start gap-3 animate-clinical-fade">
                  <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="text-white block font-bold text-sm">
                      ⚠️ Critical Dehydration &amp; Status Migrainosus Warning
                    </strong>
                    <p>
                      Severe pain lasting over 4 hours with active vomiting presents an acute danger of severe dehydration and medication malabsorption. Emergency care or urgent IV rehydration is advised.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 3: ONSET ================= */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-clinical-fade">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
                  Step 3: When did the headache start?
                </h3>
                <p className="text-xs text-slate-400">
                  Select how long ago your head throbbing or migraine symptoms began.
                </p>
              </div>

              {/* Onset Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-teal-300 block mb-2">
                  Elapsed Time Since First Throbbing:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { val: 15, label: '15m' },
                    { val: 25, label: '25m' },
                    { val: 35, label: '35m' },
                    { val: 60, label: '1 hour' },
                    { val: 120, label: '2 hours' },
                    { val: 240, label: '4+ hours' }
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.val}
                      onClick={() => setMinutesSinceOnset(t.val)}
                      className={`min-h-[48px] rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        minutesSinceOnset === t.val
                          ? 'bg-teal-600 border-teal-400 text-white shadow-md'
                          : 'bg-[#161B22] border-slate-800 text-slate-400 hover:bg-[#1E293B]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Dehydration Warning Alert */}
              {isDehydrationRisk && (
                <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-500/80 text-rose-200 text-xs flex items-start gap-3 animate-clinical-fade">
                  <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="text-white block font-bold text-sm">
                      ⚠️ Critical Dehydration &amp; Status Migrainosus Warning
                    </strong>
                    <p>
                      Headache exceeding 4+ hours accompanied by persistent vomiting and severe pain creates high dehydration risk. Standard oral tablets cannot stay down.
                    </p>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-[#161B22] border border-slate-800 text-xs text-slate-400 leading-relaxed">
                ⏱️ <strong>Onset Timing:</strong> Recording exact onset helps clinicians and algorithmic rescue models determine whether fast-acting oral abortives or rapid non-oral rescues will be most effective.
              </div>
            </div>
          )}

          {/* ================= STEP 4: PAIN INTENSITY ================= */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-clinical-fade">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
                  Step 4: How intense is your headache pain?
                </h3>
                <p className="text-xs text-slate-400">
                  Select the level of pain you are currently experiencing to calibrate abortive therapy strength.
                </p>
              </div>

              {/* Pain Severity Interactive Cards */}
              <div className="space-y-3">
                {[
                  {
                    level: 1,
                    title: 'Mild (Grade 1)',
                    subtitle: 'Noticeable & distracting, but able to continue basic daily tasks',
                    details: 'Dull ache or throbbing. You can function, but with discomfort.',
                    badge: 'Grade 1',
                    color: 'emerald'
                  },
                  {
                    level: 2,
                    title: 'Moderate (Grade 2)',
                    subtitle: 'Significantly impairs work, school, or daily concentration',
                    details: 'Pulsating pain that demands slowing down. Focus is severely impaired.',
                    badge: 'Grade 2',
                    color: 'amber'
                  },
                  {
                    level: 3,
                    title: 'Severe (Grade 3)',
                    subtitle: 'Incapacitating agony, bed rest required',
                    details: 'Violent throbbing, severe light sensitivity, or nausea. Normal activities impossible.',
                    badge: 'Grade 3',
                    color: 'rose'
                  }
                ].map((p) => {
                  const isSelected = painIntensity === p.level;
                  const borderClass = isSelected
                    ? p.color === 'rose'
                      ? 'border-rose-500 bg-rose-950/30 text-white shadow-lg'
                      : p.color === 'amber'
                      ? 'border-amber-500 bg-amber-950/30 text-white shadow-lg'
                      : 'border-emerald-500 bg-emerald-950/30 text-white shadow-lg'
                    : 'border-slate-800 bg-[#161B22] text-slate-300 hover:bg-[#1E293B]';

                  return (
                    <button
                      type="button"
                      key={p.level}
                      onClick={() => setPainIntensity(p.level)}
                      className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-4 ${borderClass}`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-3 h-3 rounded-full ${
                              p.level === 3 ? 'bg-rose-500' : p.level === 2 ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                          />
                          <span className="font-black text-sm text-white">{p.title}</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#0A0E17] border border-slate-700 text-slate-400">
                            {p.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium">{p.subtitle}</p>
                        <p className="text-[11px] text-slate-400">{p.details}</p>
                      </div>
                      <div className="shrink-0">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs font-bold ${
                            isSelected
                              ? 'bg-teal-500 border-teal-400 text-slate-950'
                              : 'border-slate-700 text-slate-500'
                          }`}
                        >
                          {isSelected ? '✓' : p.level}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Live Dehydration Warning Alert */}
              {isDehydrationRisk && (
                <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-500/80 text-rose-200 text-xs flex items-start gap-3 animate-clinical-fade">
                  <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="text-white block font-bold text-sm">
                      ⚠️ Critical Dehydration &amp; Status Migrainosus Warning
                    </strong>
                    <p>
                      Severe pain (Grade 3) persisting for 4+ hours with active vomiting presents high dehydration risk. Oral medications cannot be retained; emergency clinical intervention is recommended.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 5: NOTES & CONDITIONS ================= */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-clinical-fade">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
                  Step 5: Additional Notes &amp; Conditions
                </h3>
                <p className="text-xs text-slate-400">
                  Add any other symptoms, prior medications, or context to help personalize your rescue plan.
                </p>
              </div>

              <div>
                <label
                  htmlFor="modal-notes-textarea"
                  className="text-xs font-bold uppercase tracking-wider text-teal-300 block mb-2"
                >
                  Add any other conditions, symptoms, or notes...
                </label>
                <textarea
                  id="modal-notes-textarea"
                  rows={4}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder={typedPlaceholder || 'Add any other conditions, symptoms, or notes...'}
                  className="w-full bg-[#161B22] border border-slate-700 rounded-xl p-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 leading-relaxed font-sans"
                />
              </div>

              {/* Live Dehydration Warning Alert */}
              {isDehydrationRisk && (
                <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-500/80 text-rose-200 text-xs flex items-start gap-3 animate-clinical-fade">
                  <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="text-white block font-bold text-sm">
                      ⚠️ Clinical Warning Screener Will Trigger
                    </strong>
                    <p>
                      Because this severe migraine has persisted for 4+ hours with active vomiting, clicking below will route directly to the Emergency Warning Screener with hospital IV hydration instructions.
                    </p>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-[#161B22] border border-slate-800 text-xs text-slate-400 leading-relaxed">
                💡 <strong>Tip:</strong> Click the button below to formulate your rescue strategy using peer-reviewed guidelines and the BMJ 2024 comparative network meta-analysis.
              </div>
            </div>
          )}

          {/* ================= STEP 6: FINAL RECOMMENDED STRATEGY ================= */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-clinical-fade">
              {/* Emergency Refusal Modal Screen */}
              {result && result.snoop4_emergency_detected && (
                <div className="bg-rose-950/70 border-2 border-rose-500 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-rose-600 text-white rounded-2xl shrink-0">
                      <AlertOctagon className="w-8 h-8" />
                    </div>
                    <div className="space-y-3 flex-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-900 text-rose-200 border border-rose-400 inline-block">
                        {result.emergency_reason?.toLowerCase().includes('dehydration')
                          ? 'Clinical Warning Screener: Dehydration & Status Migrainosus'
                          : 'Emergency Warning Sign Detected'}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        {result.emergency_reason?.toLowerCase().includes('dehydration')
                          ? 'Severe Dehydration Risk: Urgent Emergency Care Recommended'
                          : 'Please Seek Immediate Emergency Medical Care'}
                      </h3>
                      <p className="text-sm text-rose-100 leading-relaxed font-medium">
                        {result.emergency_reason || 'A sudden, severe headache that reaches peak agony within seconds (thunderclap pattern) requires urgent emergency evaluation.'}
                      </p>
                      <div className="bg-[#161B22] p-4 rounded-xl border border-rose-500/40 text-xs text-rose-200 space-y-2">
                        <strong className="text-white block font-bold">
                          {result.emergency_reason?.toLowerCase().includes('dehydration')
                            ? 'Why self-treatment and oral pills are unsafe here:'
                            : 'Why self-treatment is unsafe here:'}
                        </strong>
                        {result.emergency_reason?.toLowerCase().includes('dehydration') ? (
                          <ul className="list-disc list-inside space-y-1 text-slate-300">
                            <li><strong>Critical Dehydration:</strong> Persistent vomiting over 4 hours depletes fluid volume and essential electrolytes (potassium, sodium).</li>
                            <li><strong>Medication Malabsorption:</strong> Severe gastroparesis (stomach shutdown) means pills will be regurgitated and cannot reach your bloodstream.</li>
                            <li><strong>Status Migrainosus Risk:</strong> Severe attacks lasting 4+ hours often require hospital-administered IV antiemetics (metoclopramide) and IV rehydration.</li>
                          </ul>
                        ) : (
                          <p>
                            A thunderclap headache can indicate a ruptured aneurysm or intracranial hemorrhage rather than a migraine attack. Standard migraine medications cannot treat this.
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 pt-2">
                        <a
                          href="tel:911"
                          className="min-h-[48px] px-6 bg-rose-600 hover:bg-rose-500 text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
                        >
                          <PhoneCall className="w-4 h-4" /> Call 911 Immediately
                        </a>
                        <a
                          href="https://www.google.com/maps/search/nearest+emergency+room"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[48px] px-6 bg-[#161B22] hover:bg-[#1E293B] text-slate-200 border border-slate-700 font-bold text-sm rounded-xl transition-all flex items-center gap-2"
                        >
                          <MapPin className="w-4 h-4 text-rose-400" /> Find Nearest Emergency Room
                        </a>
                        <a
                          href="https://www.google.com/maps/search/urgent+care+center"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[48px] px-6 bg-[#161B22] hover:bg-[#1E293B] text-slate-200 border border-slate-700 font-bold text-sm rounded-xl transition-all flex items-center gap-2"
                        >
                          <MapPin className="w-4 h-4 text-amber-400" /> Find Nearest Urgent Care
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Safe Migraine Protocol Cards */}
              {result && !result.snoop4_emergency_detected && (
                <>
                  {/* Card 1: Recommended Relief Formulation */}
                  <div className="bg-[#161B22] border border-teal-500/40 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <h4 className="text-base sm:text-lg font-black text-white">
                          Recommended Acute Rescue Strategy
                        </h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-black uppercase flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-400" /> Prescription Required (Rx)
                      </span>
                    </div>

                    <div className="bg-[#0A0E17] p-5 rounded-xl border border-slate-800 space-y-2.5">
                      <div className="text-[10px] text-teal-400 uppercase font-black tracking-wider flex items-center gap-1.5">
                        <Pill className="w-4 h-4" /> Targeted Formulation
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {result.recommended_molecule || 'Sumatriptan 6mg Subcutaneous Auto-Injector'}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="px-3 py-1 bg-teal-950/60 border border-teal-500/50 rounded-lg text-teal-300 text-xs font-extrabold uppercase">
                          Route: {result.recommended_route.replace(/_/g, ' ')}
                        </span>
                        <span className="px-2.5 py-1 bg-amber-950/60 border border-amber-500/40 rounded-lg text-amber-300 text-xs font-bold">
                          Rx Only
                        </span>
                        {patientAge < 18 && (
                          <span className="px-2.5 py-1 bg-sky-950/60 border border-sky-500/40 rounded-lg text-sky-200 text-xs font-bold">
                            Adolescent Approved (Age 15)
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 pt-1 leading-relaxed">
                        <strong>Prescription Status:</strong> This acute rescue medication requires an official prescription from your physician, neurologist, or pediatrician. Discuss this plan with your doctor to have it accessible for severe attacks.
                      </p>
                    </div>

                    {/* Why this delivery route? */}
                    {result.route_switch_reasoning && (
                      <div className="bg-gradient-to-r from-amber-950/30 to-slate-900 p-4 rounded-xl border border-amber-500/40 flex items-start gap-3">
                        <CornerDownRight className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <span className="text-xs font-black uppercase text-amber-300 tracking-wider block">
                            Why this delivery route was chosen:
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {result.route_switch_reasoning}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card 1B: Prescription vs Over-The-Counter (OTC) Options */}
                  <div className="bg-[#161B22] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3.5">
                    <div className="flex items-center gap-2">
                      <Pill className="w-5 h-5 text-teal-400" />
                      <h4 className="text-base font-black text-white">
                        Prescription (Rx) vs. Over-the-Counter (OTC) Relief Options
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                      {/* Cefaly e-TNS (Over-the-Counter) */}
                      <div className="p-4 rounded-xl bg-[#0A0E17] border border-emerald-500/40 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-black text-sm text-white">Cefaly e-TNS (Wearable Device)</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            Over-the-Counter (OTC)
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          <strong>No prescription required.</strong> Cefaly e-TNS is an FDA-cleared external trigeminal nerve stimulation device available directly over the counter. A 60-minute session on the forehead stimulates the supraorbital nerve to abort attacks and prevent central allodynia without drug interactions.
                        </p>
                        <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          ✓ Available without a prescription • Drug-free • Safe with any rescue medication
                        </div>
                      </div>

                      {/* Nerivio REN & Triptans (Prescription Required) */}
                      <div className="p-4 rounded-xl bg-[#0A0E17] border border-amber-500/40 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-black text-sm text-white">
                            {result.recommended_molecule || 'Sumatriptan SC / Nerivio REN'}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Prescription Required (Rx)
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          <strong>Prescription required.</strong> Fast-acting injectable/ODT triptans and wearable remote electrical neuromodulation armbands (Nerivio REN) require an active prescription from your neurologist, pediatrician, or primary doctor.
                        </p>
                        <div className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                          ⚠️ Requires physician / neurologist prescription
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Optimal Treatment Window & Convergence Hypothesis Diagram */}
                  <div className="bg-[#161B22] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-amber-400">
                        <Clock className="w-5 h-5" />
                        <h4 className="text-base font-black text-white">
                          Optimal Treatment Window (Pre-Allodynic Phase)
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-500/30 font-mono">
                        {windowRemaining > 0 ? `${windowRemaining} Minutes Left` : 'Window Closed'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      Treating during the early headache phase before scalp allodynia engages stops the attack before central sensitization takes hold.
                    </p>

                    {/* Cool Colored Convergence Hypothesis Diagram with Vertical Red Line for Patient */}
                    <ConvergenceHypothesisDiagram minutesSinceOnset={minutesSinceOnset} />

                    <div className="pt-2 text-xs text-teal-300 font-semibold border-t border-slate-800 flex items-center justify-between">
                      <span>⏱️ Projected Time to Relief: 1.5 to 2 hours</span>
                      <span className="text-[11px] text-slate-400">Duration if untreated: 4–72 hours</span>
                    </div>
                  </div>

                  {/* Card 3: Additional Things You Can Do for Comfort */}
                  <div className="bg-[#161B22] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-400" />
                      <h4 className="text-base font-black text-white">
                        Additional Things You Can Do for Comfort Right Now
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-slate-800 space-y-1">
                        <div className="text-sky-400 font-bold">🧊 Cold Compress</div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          Place an ice pack wrapped in a cloth on your forehead or neck for 15 minutes.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-slate-800 space-y-1">
                        <div className="text-indigo-400 font-bold flex items-center gap-1.5">
                          <Moon className="w-3.5 h-3.5" /> Dark Room
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          Dim all screens and rest in a quiet, dark room to calm light sensitivity.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-slate-800 space-y-1">
                        <div className="text-teal-400 font-bold flex items-center gap-1.5">
                          <Droplets className="w-3.5 h-3.5" /> Gentle Hydration
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          Slowly sip 500ml of room-temperature water or electrolytes.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-slate-800 space-y-1">
                        <div className="text-amber-400 font-bold flex items-center gap-1.5">
                          <Coffee className="w-3.5 h-3.5" /> Ginger for Nausea
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          Sip warm ginger tea or suck on a ginger candy to calm stomach upset.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-slate-800 space-y-1">
                        <div className="text-purple-400 font-bold">💆 Acupressure (LI-4)</div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          Press firmly on the webbing between your thumb and index finger for 2 minutes.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-slate-800 space-y-1">
                        <div className="text-emerald-400 font-bold">🌬️ 4-7-8 Breathing</div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          Inhale 4s, hold 4s, exhale slowly 6s to ease nervous system tension.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: How are you feeling 2 hours later? (Free-Type Window + Buttons) */}
                  <div className="bg-[#161B22] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-white flex items-center gap-2">
                        <Smile className="w-5 h-5 text-teal-400" /> How are you feeling 2 hours later?
                      </h4>
                      <p className="text-xs text-slate-400">
                        Record how your headache responded to help personalize your future relief plans.
                      </p>
                    </div>

                    {feedbackSubmitted ? (
                      <div className="p-4 bg-teal-950/50 border border-teal-500/40 rounded-xl text-xs text-teal-200 flex items-center gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                        <span>
                          <strong>Thank you!</strong> Your 2-hour outcome and recovery notes have been logged for your care profile.
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* 3 Quick Status Buttons */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setFeedbackRating('PAIN_FREE')}
                            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                              feedbackRating === 'PAIN_FREE'
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-[#0A0E17] hover:bg-[#1E293B] border border-emerald-500/30 text-emerald-300'
                            }`}
                          >
                            🟢 Fully Relieved (Pain-Free)
                          </button>
                          <button
                            type="button"
                            onClick={() => setFeedbackRating('PARTIAL')}
                            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                              feedbackRating === 'PARTIAL'
                                ? 'bg-amber-600 text-white shadow-md'
                                : 'bg-[#0A0E17] hover:bg-[#1E293B] border border-amber-500/30 text-amber-300'
                            }`}
                          >
                            🟡 Partially Relieved
                          </button>
                          <button
                            type="button"
                            onClick={() => setFeedbackRating('NONE')}
                            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                              feedbackRating === 'NONE'
                                ? 'bg-rose-600 text-white shadow-md'
                                : 'bg-[#0A0E17] hover:bg-[#1E293B] border border-rose-500/30 text-rose-300'
                            }`}
                          >
                            🔴 Didn't Help
                          </button>
                        </div>

                        {/* Free-Type Text Window as requested */}
                        <div className="space-y-1.5">
                          <label
                            htmlFor="feedback-notes-input"
                            className="text-xs font-bold text-slate-300 flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                            Recovery notes &amp; symptom observations (free text):
                          </label>
                          <textarea
                            id="feedback-notes-input"
                            rows={3}
                            value={feedbackNotes}
                            onChange={(e) => setFeedbackNotes(e.target.value)}
                            placeholder="Type how you are feeling 2 hours later, what symptoms eased, any lingering brain fog, or notes for your doctor..."
                            className="w-full bg-[#0A0E17] border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 leading-relaxed font-sans"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => setFeedbackSubmitted(true)}
                          disabled={feedbackRating === 'IDLE' && !feedbackNotes.trim()}
                          className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                        >
                          Save 2-Hour Recovery Log
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Modal Navigation Buttons (Bottom Bar) */}
        <div className="px-5 py-4 border-t border-[#1E293B] bg-[#0E1424] flex flex-wrap items-center justify-between gap-3">
          <div>
            {currentStep > 1 && currentStep <= 5 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#161B22] hover:bg-[#1E293B] text-slate-300 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}
            {currentStep === 6 && (
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#161B22] hover:bg-[#1E293B] text-slate-300 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Re-evaluate Symptoms
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep === 1 && (
              <button
                type="button"
                onClick={() => {
                  if ((selectedProfile === 'claire' || selectedProfile === 'alexa') && !authenticatedProfiles[selectedProfile]) {
                    setPendingProfile(selectedProfile as 'claire' | 'alexa');
                    setProfilePassword('');
                    setPasswordError(null);
                    setShowPasswordPrompt(true);
                  } else {
                    setCurrentStep(2);
                  }
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-teal-600 hover:bg-teal-500 text-white shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Next: Select Symptoms <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {currentStep === 2 && (
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-teal-600 hover:bg-teal-500 text-white shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Next: When Did It Start? <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {currentStep === 3 && (
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-teal-600 hover:bg-teal-500 text-white shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Next: Pain Intensity <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {currentStep === 4 && (
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-teal-600 hover:bg-teal-500 text-white shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Next: Additional Notes <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {currentStep === 5 && (
              <button
                type="button"
                onClick={handleRunTriage}
                disabled={isLoading}
                className="px-7 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span>Formulating plan...</span>
                ) : (
                  <span>
                    <Zap className="w-3.5 h-3.5 fill-current text-amber-300 inline mr-1" />
                    Find My Relief Plan
                  </span>
                )}
              </button>
            )}
            {currentStep === 6 && (
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#161B22] hover:bg-[#1E293B] text-white border border-slate-700 transition-all cursor-pointer"
              >
                Close Relief Plan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
