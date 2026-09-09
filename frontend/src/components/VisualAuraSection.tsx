import React, { useState } from 'react';
import {
  Eye,
  Sparkles,
  Search,
  ExternalLink,
  MessageSquare,
  Clock,
  Layers,
  ChevronRight,
  Info,
  Activity,
  Maximize2,
  X,
} from 'lucide-react';
import { AURA_PHENOMENA, PATIENT_AURA_EXPERIENCES, AuraPhenomenon } from '../lib/auraData';

export const VisualAuraSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewItem, setPreviewItem] = useState<AuraPhenomenon | null>(null);

  const categories = [
    { id: 'all', label: 'All 28 Phenomena' },
    { id: 'positive', label: 'Positive (Scintillating / Zigzags)' },
    { id: 'negative', label: 'Negative (Blind Spots / Scotomas)' },
    { id: 'distortion', label: 'Distortions (Snow / Haze / Pixelation)' },
    { id: 'atypical', label: 'Atypical & Patient Variants' },
  ];

  const filteredAuras = AURA_PHENOMENA.filter((aura) => {
    if (selectedCategory !== 'all' && aura.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        aura.name.toLowerCase().includes(q) ||
        aura.description.toLowerCase().includes(q) ||
        aura.numberLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 mb-8 border-b border-slate-200 pb-8">
      {/* Section Header */}
      <div className="border-b border-[#003764] pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#003764] text-white rounded-md">
                <Eye className="w-5 h-5 text-cyan-300" />
              </div>
              <h2 className="text-xl font-extrabold text-[#003764] uppercase tracking-wide">
                IHS Visual Aura Iconography &amp; Real-World Progression
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Standardized visual disturbance table developed by <strong>Dr. Michele Viana &amp; NorHead</strong> (Cephalalgia 2024;44(2)) and endorsed by the <strong>International Headache Society (IHS)</strong>. Captures the full spatiotemporal march of cortical spreading depression across 28 elementary visual symptoms.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold bg-blue-50 text-[#005a9c] px-2.5 py-1 rounded border border-blue-200">
              Cephalalgia 2024 / 215 Patients
            </span>
            <a
              href="https://ihs-headache.org/en/resources/visual-aura-table/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-white bg-[#005a9c] hover:bg-[#003764] px-3 py-1 rounded transition-colors inline-flex items-center gap-1 shadow-sm"
            >
              IHS Official Table <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#003764] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64 flex-shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search # number, teichopsia, blur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#005a9c]"
          />
        </div>
      </div>

      {/* 28-Aura Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {filteredAuras.map((aura) => {
          const isSpecialVariant = aura.id === 27;
          const isClassicTeichopsia = aura.id === 3;

          return (
            <div
              key={aura.id}
              onClick={() => setPreviewItem(aura)}
              className={`group bg-white rounded-lg border-2 cursor-pointer transition-all overflow-hidden flex flex-col hover:shadow-lg ${
                isSpecialVariant
                  ? 'border-amber-400 ring-1 ring-amber-300/40'
                  : isClassicTeichopsia
                  ? 'border-cyan-500 ring-1 ring-cyan-300/40'
                  : 'border-slate-200 hover:border-[#005a9c]'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-square bg-slate-950 overflow-hidden">
                <img
                  src={aura.imagePath}
                  alt={aura.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Number Badge */}
                <div className="absolute top-1.5 left-1.5 bg-[#003764]/95 text-cyan-300 font-mono text-[11px] font-black px-1.5 py-0.5 rounded shadow">
                  {aura.numberLabel}
                </div>

                {/* Variant Label */}
                {isSpecialVariant && (
                  <div className="absolute top-1.5 right-1.5 bg-amber-500 text-slate-900 font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                    GREYSCALE
                  </div>
                )}
                {isClassicTeichopsia && (
                  <div className="absolute top-1.5 right-1.5 bg-cyan-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                    CLASSIC
                  </div>
                )}

                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/90 text-slate-900 text-[10px] font-bold px-2 py-1 rounded shadow flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" /> Inspect
                  </span>
                </div>
              </div>

              {/* Card Label */}
              <div className="p-2.5 flex-1 flex flex-col justify-between text-left">
                <div>
                  <h4 className="text-[11px] font-black text-slate-900 line-clamp-1 group-hover:text-[#005a9c]">
                    {aura.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                    {aura.description}
                  </p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider ${
                      aura.category === 'positive'
                        ? 'text-emerald-700'
                        : aura.category === 'negative'
                        ? 'text-rose-700'
                        : aura.category === 'distortion'
                        ? 'text-purple-700'
                        : 'text-slate-600'
                    }`}
                  >
                    {aura.categoryLabel.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-[#005a9c] font-bold group-hover:underline">
                    Details &rarr;
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-World Patient Experiences Section (Migraine Trust Community) */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#005a9c] text-white rounded-md">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#003764] uppercase tracking-wide">
                Real-World Aura Evolution: Patient Community Observations
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Observed sequences from the Migraine Trust clinical discussion (<a href="https://x.com/MigraineTrust/status/1852374303544643655" target="_blank" rel="noreferrer" className="text-[#005a9c] hover:underline font-semibold">@MigraineTrust #1852374303544643655</a>). Aura symptoms evolve dynamically over time.
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold bg-white text-slate-700 px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto shadow-xs">
            Dynamic Cortical Spreading Depression (CSD)
          </span>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {PATIENT_AURA_EXPERIENCES.map((exp, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-lg border border-slate-200 hover:border-[#005a9c] transition-all hover:shadow-md flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#003764]">
                    {exp.patientLabel}
                  </span>
                  <span className="font-mono text-[10px] font-black bg-blue-50 text-[#005a9c] px-2 py-0.5 rounded border border-blue-200">
                    {exp.sequenceDisplay}
                  </span>
                </div>

                <blockquote className="text-xs text-slate-700 italic leading-relaxed border-l-2 border-[#005a9c] pl-2.5 py-0.5">
                  "{exp.quote}"
                </blockquote>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
                  <Activity className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-700">Clinical Mechanism:</strong>{' '}
                    {exp.clinicalInsight}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scientific Clinical Takeaway Box */}
        <div className="p-3.5 bg-white rounded-lg border border-blue-200 text-xs text-slate-700 leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#005a9c] flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#003764]">Why Progression Sequence Matters:</strong> Unlike acute ischemic events which present with sudden, maximal negative visual deficits (&lt;5 minutes), classic migraine aura typically manifests as a progressive positive march advancing at 2–3 mm/min across the occipital cortex, commonly starting as color spots (#8) or shimmering arcs (#13) before expanding into fortification teichopsia (#3, #27) and resolving with diffuse blur (#2).
          </div>
        </div>
      </div>

      {/* Inspect Modal Dialog */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-300 p-6 space-y-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <span className="bg-[#003764] text-cyan-300 font-mono text-sm font-black px-2.5 py-0.5 rounded">
                  {previewItem.numberLabel}
                </span>
                <h3 className="text-base font-black text-slate-900">{previewItem.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-square bg-slate-950 rounded-lg overflow-hidden border border-slate-200 shadow-inner">
              <img
                src={previewItem.imagePath}
                alt={previewItem.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Phenomenon Description:</strong>
                <p>{previewItem.description}</p>
              </div>

              <div className="p-2 bg-blue-50/70 rounded border border-blue-100">
                <strong className="text-[#005a9c] block mb-0.5">Neurobiological Significance:</strong>
                <p>{previewItem.clinicalSignificance}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">
                Viana et al. Cephalalgia 2024 / IHS
              </span>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="px-4 py-1.5 bg-[#005a9c] text-white font-bold rounded-lg hover:bg-[#003764] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
