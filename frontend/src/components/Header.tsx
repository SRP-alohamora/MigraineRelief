import React from 'react';
import { ShieldCheck, Zap, SlidersHorizontal, Sparkles, BarChart3, Newspaper } from 'lucide-react';
import { KnowledgeTiles } from './KnowledgeTiles';

interface HeaderProps {
  activeTab: 'rescue' | 'research' | 'kaggle' | 'mission';
  setActiveTab: (tab: 'rescue' | 'research' | 'kaggle' | 'mission') => void;
  onOpenCustomize: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenCustomize,
}) => {
  return (
    <header className="mb-6 bg-white">
      {/* 1. Website Title in Black on White Background */}
      <div className="pt-2 pb-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight font-sans">
            MigraineRelief
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            Precision Acute Attack Rescue &amp; Neurovascular Decision Support
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Zero-Knowledge Client Encryption
          </div>

          <button
            type="button"
            onClick={onOpenCustomize}
            className="btn-primary flex items-center gap-2 py-2 px-3.5 text-xs sm:text-sm font-semibold rounded-xl"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Customize Protocol</span>
          </button>
        </div>
      </div>

      {/* 2. Image Strip: Not more than 1 inch tall/wide */}
      <div
        className="w-full my-3 overflow-hidden rounded-xl border border-slate-200 shadow-sm relative group"
        style={{ height: '1in', maxHeight: '1in' }}
        title="Trigeminovascular Synapse: Ionic Channel Gating & Receptor Antagonism"
      >
        <img
          src="/neural_synapse_ions.jpg"
          alt="Neural Synapse and Ionic Gating Cascade across the synaptic cleft"
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute bottom-1.5 left-3 text-[11px] font-medium text-white/90 drop-shadow flex items-center gap-1.5 pointer-events-none font-mono">
          <span className="w-2 h-2 rounded-full bg-teal-400 inline-block animate-pulse"></span>
          Trigeminovascular Synapse • CGRP &amp; 5-HT 1B/1D Molecular Cascade
        </div>
      </div>

      {/* 3. Knowledge Tiles placed right below the image strip */}
      <KnowledgeTiles />

      {/* 4. Clean, Simple Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pt-2 pb-px scrollbar-none">
        {[
          { id: 'rescue', label: 'Acute Rescue Copilot', icon: Zap },
          { id: 'kaggle', label: 'Kaggle Clinical Insights & Aura', icon: BarChart3 },
          { id: 'research', label: 'Latest Breakthrough Research', icon: Newspaper },
          { id: 'mission', label: 'Why Upload Data & About Us', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2.5 px-3.5 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-all rounded-t-lg ${
                isActive
                  ? 'border-teal-700 text-teal-800 bg-teal-50/60'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
