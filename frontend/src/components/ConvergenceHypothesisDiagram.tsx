import React from 'react';
import { ExternalLink } from 'lucide-react';

interface ConvergenceHypothesisDiagramProps {
  minutesSinceOnset?: number;
}

export const ConvergenceHypothesisDiagram: React.FC<ConvergenceHypothesisDiagramProps> = ({
  minutesSinceOnset = 25
}) => {
  // Map minutesSinceOnset to SVG X coordinate (between 180 and 560)
  const calculatePatientX = (mins: number) => {
    if (mins <= 0) return 180;
    if (mins <= 60) {
      // 0 to 60 min maps from 180 to 395
      return 180 + (mins / 60) * 215;
    }
    // >60 to 180 min maps from 395 to 550
    const clampedOver = Math.min(mins - 60, 120);
    return 395 + (clampedOver / 120) * 155;
  };

  const patientX = calculatePatientX(minutesSinceOnset);
  const isPreAllodynic = minutesSinceOnset <= 60;

  return (
    <div className="w-full bg-[#070B12] rounded-xl border border-teal-500/30 p-3 sm:p-4 my-3 text-[#E2E8F0]">
      <div className="text-center font-bold text-xs uppercase tracking-wider text-teal-300 mb-2">
        Convergence Hypothesis &amp; Cutaneous Allodynia Progression
      </div>

      {/* Cool-Colored Vector Graphic of Convergence Hypothesis (Burstein 2004) */}
      <div className="relative w-full overflow-hidden rounded-lg bg-[#0A0F1D] border border-slate-800">
        <svg
          viewBox="0 0 760 380"
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Convergence Hypothesis Diagram: Central Sensitization, Neurovascular Activation, Trigeminal Disinhibition, Neurochemical Disruption across time"
        >
          <defs>
            {/* Cool Gradients */}
            <linearGradient id="allodyniaPeakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#4338CA" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="neurovascGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0D9488" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0F766E" stopOpacity="0.65" />
            </linearGradient>

            <linearGradient id="disinhibGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0369A1" stopOpacity="0.45" />
            </linearGradient>

            <linearGradient id="gridLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#475569" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#334155" stopOpacity="0.3" />
            </linearGradient>

            <filter id="glowEffect" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38BDF8" floodOpacity="0.5" />
            </filter>

            <filter id="redMarkerGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#EF4444" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Background grid box */}
          <rect x="20" y="20" width="720" height="280" fill="#0A0F1D" stroke="#1E293B" strokeWidth="2" />

          {/* Horizontal Level Dividers */}
          {/* Level 1: Central Sensitization / Allodynia Divider */}
          <line x1="20" y1="90" x2="740" y2="90" stroke="url(#gridLineGrad)" strokeWidth="1.5" />
          {/* Level 2: Neurovascular Activation Divider */}
          <line x1="20" y1="160" x2="740" y2="160" stroke="url(#gridLineGrad)" strokeWidth="1.5" />
          {/* Level 3: Trigeminal Disinhibition Divider */}
          <line x1="20" y1="230" x2="740" y2="230" stroke="url(#gridLineGrad)" strokeWidth="1.5" />

          {/* Right Axis Labels */}
          {/* Top Tier: Central Sensitization */}
          <text x="730" y="55" fill="#C7D2FE" fontSize="13" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">
            Central Sensitization
          </text>
          <text x="730" y="73" fill="#A5B4FC" fontSize="11" textAnchor="end" fontFamily="sans-serif">
            (Cutaneous allodynia — scalp tender)
          </text>

          {/* Tier 2: Neurovascular Activation */}
          <text x="730" y="125" fill="#5EEAD4" fontSize="13" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">
            Neurovascular Activation
          </text>
          <text x="730" y="143" fill="#2DD4BF" fontSize="11" textAnchor="end" fontFamily="sans-serif">
            (Moderate to severe headache)
          </text>

          {/* Tier 3: Trigeminal Disinhibition */}
          <text x="730" y="195" fill="#7DD3FC" fontSize="13" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">
            Trigeminal Disinhibition
          </text>
          <text x="730" y="213" fill="#38BDF8" fontSize="11" textAnchor="end" fontFamily="sans-serif">
            (Mild headache phase)
          </text>

          {/* Tier 4: Neurochemical Disruption */}
          <text x="730" y="265" fill="#94A3B8" fontSize="13" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">
            Neurochemical Disruption
          </text>

          {/* ================= MAIN BELL CURVE SHAPES ================= */}
          {/* Tier 3 Shading (Disinhibition) */}
          <path
            d="M 30 280 C 140 270 240 240 310 160 C 350 115 385 45 410 32 C 435 45 470 115 510 160 C 580 240 600 270 610 280 L 30 280 Z"
            fill="url(#disinhibGrad)"
          />

          {/* Tier 2 Shading (Neurovascular) */}
          <clipPath id="clipNeurovasc">
            <rect x="20" y="90" width="720" height="70" />
          </clipPath>
          <path
            d="M 30 280 C 140 270 240 240 310 160 C 350 115 385 45 410 32 C 435 45 470 115 510 160 C 580 240 600 270 610 280 Z"
            fill="url(#neurovascGrad)"
            clipPath="url(#clipNeurovasc)"
          />

          {/* Tier 1 Shading (Central Sensitization Peak) */}
          <clipPath id="clipSensitization">
            <rect x="20" y="20" width="720" height="70" />
          </clipPath>
          <path
            d="M 30 280 C 140 270 240 240 310 160 C 350 115 385 45 410 32 C 435 45 470 115 510 160 C 580 240 600 270 610 280 Z"
            fill="url(#allodyniaPeakGrad)"
            clipPath="url(#clipSensitization)"
          />

          {/* Main Bell Curve Glowing Outline */}
          <path
            d="M 30 280 C 140 270 240 240 310 160 C 350 115 385 45 410 32 C 435 45 470 115 510 160 C 580 240 600 270 610 280"
            fill="none"
            stroke="#A5B4FC"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#glowEffect)"
          />

          {/* ================= SUB-THRESHOLD ABORTIVE PATHWAYS (Dashed Arcs) ================= */}
          {/* Sub-threshold 1: Premonitory abort */}
          <path
            d="M 30 270 C 60 265 80 270 100 280"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1.8"
            strokeDasharray="4,4"
          />
          <polygon points="100,283 104,275 96,277" fill="#38BDF8" />

          {/* Sub-threshold 2: Aura w/o headache abort */}
          <path
            d="M 50 250 C 100 230 140 220 180 280"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1.8"
            strokeDasharray="4,4"
          />
          <polygon points="180,283 184,275 176,277" fill="#38BDF8" />

          {/* Sub-threshold 3: Mild HA abort (Early Pre-Allodynic Window) */}
          <path
            d="M 120 225 C 190 175 250 170 330 280"
            fill="none"
            stroke="#2DD4BF"
            strokeWidth="2.2"
            strokeDasharray="5,5"
          />
          <polygon points="330,283 334,275 326,277" fill="#2DD4BF" />

          {/* Sub-threshold 4: Migrainous HA abort */}
          <path
            d="M 230 170 C 330 110 390 120 460 280"
            fill="none"
            stroke="#A5B4FC"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <polygon points="460,283 464,275 456,277" fill="#A5B4FC" />

          {/* Main Resolution Arrow at tail of migraine */}
          <polygon points="610,283 614,275 606,277" fill="#818CF8" />

          {/* ================= OPTIMAL TREATMENT WINDOW CALLOUT ================= */}
          <rect x="110" y="105" width="165" height="42" rx="6" fill="#032D38" stroke="#0D9488" strokeWidth="1.5" />
          <text x="192" y="122" fill="#5EEAD4" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            ⚡ Optimal Treatment Window
          </text>
          <text x="192" y="138" fill="#CCFBF1" fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">
            Pre-Allodynic Phase (&lt;60 min)
          </text>
          <line x1="192" y1="147" x2="210" y2="185" stroke="#0D9488" strokeWidth="1.5" strokeDasharray="3,3" />

          {/* Stage Labels along Bottom Axis */}
          <text x="100" y="297" fill="#94A3B8" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
            Premonitory
          </text>
          <text x="180" y="297" fill="#94A3B8" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
            Aura w/o HA
          </text>
          <text x="330" y="297" fill="#5EEAD4" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            Mild HA (Early)
          </text>
          <text x="460" y="297" fill="#C7D2FE" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            Migrainous HA
          </text>
          <text x="610" y="297" fill="#CBD5E1" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
            Resolution
          </text>

          {/* ================= VERTICAL RED LINE (PATIENT LOCATION) ================= */}
          <line
            x1={patientX}
            y1="20"
            x2={patientX}
            y2="334"
            stroke="#EF4444"
            strokeWidth="3"
            strokeDasharray="4,2"
            filter="url(#redMarkerGlow)"
          />

          {/* Red Glow Circle at time axis intersection */}
          <circle cx={patientX} cy="320" r="4.5" fill="#EF4444" />
          <circle cx={patientX} cy="320" r="9" fill="#EF4444" fillOpacity="0.3" />

          {/* Patient Position Pin Badge at Top of Line */}
          <g transform={`translate(${patientX}, 34)`}>
            <rect
              x="-66"
              y="-13"
              width="132"
              height="26"
              rx="13"
              fill="#7F1D1D"
              stroke="#EF4444"
              strokeWidth="2"
              filter="url(#redMarkerGlow)"
            />
            <text
              x="0"
              y="3"
              fill="#FFFFFF"
              fontSize="9.5"
              fontWeight="900"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              📍 YOU ARE HERE ({minutesSinceOnset}m)
            </text>
          </g>

          {/* ================= BOTTOM BANDS (Phase & Time) ================= */}
          {/* Phase Band Bar */}
          <rect x="20" y="306" width="720" height="28" fill="#030712" stroke="#1E293B" strokeWidth="1" />
          <text x="120" y="325" fill="#E2E8F0" fontSize="11.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            Pre-headache phase
          </text>
          <line x1="220" y1="306" x2="220" y2="334" stroke="#334155" strokeWidth="1" />
          <text x="390" y="325" fill="#5EEAD4" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            Headache phase (Treat Early)
          </text>
          <line x1="560" y1="306" x2="560" y2="334" stroke="#334155" strokeWidth="1" />
          <text x="650" y="325" fill="#E2E8F0" fontSize="11.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            Post-headache phase
          </text>

          {/* Time Progression Axis */}
          <line x1="30" y1="358" x2="710" y2="358" stroke="#38BDF8" strokeWidth="2.5" />
          <polygon points="720,358 708,352 708,364" fill="#38BDF8" />
          <text x="370" y="372" fill="#7DD3FC" fontSize="11.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            Migraine evolution ──────────► Time (hours)
          </text>
        </svg>
      </div>

      {/* Patient Status Indicator Banner */}
      <div className="mt-3 p-3 rounded-xl bg-[#111827] border border-rose-500/40 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-pulse shrink-0 ring-4 ring-rose-500/20" />
          <span className="text-rose-100 font-extrabold">
            Vertical Red Line: Your reported attack onset (~{minutesSinceOnset} minutes elapsed).
          </span>
        </div>
        <span
          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
            isPreAllodynic
              ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/50'
              : 'bg-amber-950/70 text-amber-300 border border-amber-500/50'
          }`}
        >
          {isPreAllodynic ? '🟢 Inside Pre-Allodynic Window' : '🟡 Central Sensitization Zone'}
        </span>
      </div>

      {/* Tiny Citation Hyperlink */}
      <div className="mt-2 text-center text-[10px] text-slate-400">
        <span>Source: Burstein R, Jakubowski M. Unitary Hypothesis of Migraine Development. </span>
        <a
          href="https://headachejournal.onlinelibrary.wiley.com/doi/10.1111/j.1526-4610.2004.04094.x"
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-400 hover:text-teal-300 underline inline-flex items-center gap-1 font-mono break-all"
        >
          Headache 2004; 44:S9–S18
          <ExternalLink className="w-2.5 h-2.5 inline shrink-0" />
        </a>
      </div>
    </div>
  );
};
