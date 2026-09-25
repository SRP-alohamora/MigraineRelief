import React from 'react';
import { 
  Pill, 
  Sparkles, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Heart, 
  FlaskConical, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Leaf, 
  Activity 
} from 'lucide-react';

interface MedicationKnowledgeTileProps {
  onLearnMore: () => void;
  onFilterSection?: (section: string) => void;
}

export const MedicationKnowledgeTile: React.FC<MedicationKnowledgeTileProps> = ({
  onLearnMore,
}) => {
  return (
    <section className="medical-card p-6 md:p-8 border-t-4 border-t-[#005a9c] bg-gradient-to-br from-white via-[#f8fbfe] to-[#f0f7fc] shadow-md hover:shadow-lg transition-all animate-clinical-fade">
      {/* Eyebrow & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="badge-clinical bg-[#003764] text-white border-transparent">
            <Pill className="w-3.5 h-3.5 text-cyan-300" />
            2026 Clinical &amp; Therapeutic Intelligence
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            FDA-Validated &amp; Evidence-Based
          </span>
        </div>
        <span className="text-xs font-mono text-slate-500 font-semibold">
          CPS • AHS 2026 Guidelines • IHS Standards
        </span>
      </div>

      {/* Main Title & Editorial Subtitle */}
      <div className="space-y-2 mb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-[#003764] tracking-tight leading-tight">
          Comprehensive Migraine Medication &amp; Neuromodulation Therapy Guide
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium max-w-3xl">
          From fast-acting CGRP nasal sprays and non-vasoconstrictive gepants to FDA-cleared neuromodulation headsets, evidence-based OTC supplements, and emerging PACAP pipeline biologics &mdash; understand how every therapeutic class halts the neurovascular cascade.
        </p>
      </div>

      {/* 4 Interactive Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Pillar 1: Breakthrough Prescription (Rx) */}
        <div 
          onClick={onLearnMore}
          className="bg-white border border-[#c2dbed] rounded-xl p-4.5 cursor-pointer hover:border-[#005a9c] hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#005a9c] flex items-center justify-center font-bold group-hover:bg-[#005a9c] group-hover:text-white transition-colors">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-[#003764] group-hover:text-[#005a9c] transition-colors">
              Prescription (Rx) &amp; CGRP Inhibitors
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Newest breakthrough CGRP receptor antagonists: fast-acting <strong>Zavegepant (Zavzpret)</strong> nasal spray, oral gepants (Nurtec, Ubrelvy, Qulipta), non-vasoconstrictive ditans (Reyvow), and 7 triptan formulations.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#005a9c]">
            <span>Cardiovascular Safe</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pillar 2: Over-The-Counter & Supplements */}
        <div 
          onClick={onLearnMore}
          className="bg-white border border-[#c2dbed] rounded-xl p-4.5 cursor-pointer hover:border-[#005a9c] hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-[#003764] group-hover:text-[#005a9c] transition-colors">
              OTC Analgesics &amp; Supplements
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              NSAIDs, Excedrin Migraine, and evidence-supported nutraceuticals: <strong>Magnesium</strong> (400-600mg), <strong>Riboflavin B2</strong> (400mg), <strong>CoQ10</strong>, Feverfew, and PA-free Butterbur alongside MOH quota safety guards.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-700">
            <span>AHS Recommended</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pillar 3: Neuromodulation Medical Devices */}
        <div 
          onClick={onLearnMore}
          className="bg-white border border-[#c2dbed] rounded-xl p-4.5 cursor-pointer hover:border-[#005a9c] hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold group-hover:bg-purple-700 group-hover:text-white transition-colors">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-[#003764] group-hover:text-[#005a9c] transition-colors">
              Medical Devices &amp; Neuromodulation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Categorized by regulatory clearance: <strong>FDA-Approved</strong> (Cefaly e-TNS, Nerivio REN, gammaCore nVNS, Relivion) vs. <strong>Approval Pending</strong> closed-loop headsets vs. <strong>Investigational</strong> green light therapy.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-purple-700">
            <span>Official Device Links</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pillar 4: Experimental Pipeline & Integrative */}
        <div 
          onClick={onLearnMore}
          className="bg-white border border-[#c2dbed] rounded-xl p-4.5 cursor-pointer hover:border-[#005a9c] hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-[#003764] group-hover:text-[#005a9c] transition-colors">
              Experimental Pipeline &amp; Acupressure
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              2026 Phase 2b PROCEED trial breakthrough: <strong>Lu AG09222 (Bocunebart)</strong> anti-PACAP mAb, Kv7 openers, plus clinical acupressure guides (LI4 Hegu, PC6 Neiguan, GB20 Fengchi) and acupuncture trials.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-amber-800">
            <span>Next-Gen Science</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Featured Clinical Citations Banner & CTA */}
      <div className="p-4 bg-white/80 border border-[#b8c6d4] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <span className="font-bold text-[#003764] flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#005a9c]" /> Validated Clinical Literature:
          </span>
          <a 
            href="https://advancedspineandpain.com/2026/04/26/best-migraine-medications/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#005a9c] font-semibold hover:underline inline-flex items-center gap-1"
          >
            Advanced Spine &amp; Pain (2026 Guide) <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-slate-300 hidden md:inline">|</span>
          <a 
            href="https://losaltosneurology.com/2026/08/09/migraine-treatment-in-2026-cgrp-prevention-new-therapies/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#005a9c] font-semibold hover:underline inline-flex items-center gap-1"
          >
            Los Altos Neurology (2026 CGRP &amp; Neuromodulation) <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* The Primary CTA Button */}
        <button
          type="button"
          onClick={onLearnMore}
          className="btn-primary text-sm sm:text-base py-3 px-6 shadow-md hover:shadow-lg transition-all w-full sm:w-auto whitespace-nowrap flex items-center gap-2 group"
          id="medications-tile-learn-more-btn"
        >
          <span>Learn More &amp; Open Medications Tab</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
