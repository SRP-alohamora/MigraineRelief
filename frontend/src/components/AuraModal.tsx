import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Eye,
  Info,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { AURA_PHENOMENA, PATIENT_AURA_EXPERIENCES, AuraPhenomenon } from '../lib/auraData';

interface AuraModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAuraIds: number[];
  onSaveSelection: (selectedIds: number[], notes: string) => void;
  initialNotes?: string;
}

export const AuraModal: React.FC<AuraModalProps> = ({
  isOpen,
  onClose,
  selectedAuraIds,
  onSaveSelection,
  initialNotes = '',
}) => {
  const [selected, setSelected] = useState<number[]>(selectedAuraIds);
  const [notes, setNotes] = useState<string>(initialNotes);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePreview, setActivePreview] = useState<AuraPhenomenon | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelected(selectedAuraIds);
      setNotes(initialNotes);
    }
  }, [isOpen, selectedAuraIds, initialNotes]);

  if (!isOpen) return null;

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClear = () => {
    setSelected([]);
  };

  const handleApply = () => {
    onSaveSelection(selected, notes);
    onClose();
  };

  const appendSequenceToNotes = () => {
    if (selected.length === 0) return;
    const seqStr = selected.map((id) => `#${id}`).join(' ➔ ');
    const addition = notes
      ? `${notes}\nProgression Sequence: ${seqStr}`
      : `Progression Sequence: ${seqStr}`;
    setNotes(addition);
  };

  const filteredPhenomena = AURA_PHENOMENA.filter((item) => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.numberLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden my-auto text-slate-800">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#003764] via-[#004b87] to-[#005a9c] text-white flex items-center justify-between border-b border-[#002b4e]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg shadow-inner">
              <Eye className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  IHS Visual Aura Iconography &amp; Pattern Identifier
                </h2>
                <span className="text-[10px] font-extrabold uppercase bg-cyan-500/20 text-cyan-200 px-2 py-0.5 rounded border border-cyan-400/30">
                  28 Standardized Patterns (#0–#27)
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5">
                Standardized visual disturbances from Viana et al. (Cephalalgia 2024 / NorHead) and International Headache Society
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Banner */}
        <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              <strong>Clinical Guidance:</strong> Visual aura can evolve dynamically (e.g. #8 colored spots ➔ #13 scintillating arc ➔ #3 jagged teichopsia ➔ #2 blur). You can select multiple patterns and describe your sequence below.
            </span>
          </div>
          <a
            href="https://ihs-headache.org/en/resources/visual-aura-table/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#005a9c] hover:underline flex-shrink-0"
          >
            IHS Official Resource <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Toolbar: Category Filters & Search */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All (28)' },
              { id: 'positive', label: 'Positive (Shimmer/Zigzag)' },
              { id: 'negative', label: 'Negative (Blind Spots)' },
              { id: 'distortion', label: 'Distortions (Snow/Haze)' },
              { id: 'atypical', label: 'Atypical & Variants' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  categoryFilter === cat.id
                    ? 'bg-[#005a9c] text-white shadow-sm'
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
              placeholder="Search pattern or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#005a9c]"
            />
          </div>
        </div>

        {/* Main Content Area: Grid of Aura Cards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {filteredPhenomena.map((item) => {
              const isSelected = selected.includes(item.id);
              const isGreyscaleVariant = item.id === 27;

              return (
                <div
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={`group relative rounded-lg border-2 cursor-pointer transition-all overflow-hidden flex flex-col bg-white hover:shadow-md ${
                    isSelected
                      ? 'border-[#005a9c] ring-2 ring-[#005a9c]/30 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-square bg-slate-900 overflow-hidden">
                    <img
                      src={item.imagePath}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Number Badge */}
                    <div className="absolute top-1.5 left-1.5 bg-[#003764]/90 backdrop-blur-sm text-white font-mono text-[11px] font-black px-1.5 py-0.5 rounded shadow">
                      {item.numberLabel}
                    </div>

                    {/* Variant Badge for #27 */}
                    {isGreyscaleVariant && (
                      <div className="absolute top-1.5 right-1.5 bg-amber-500 text-slate-900 font-extrabold text-[9px] px-1 py-0.5 rounded shadow">
                        Greyscale
                      </div>
                    )}

                    {/* Selected Checkmark Indicator */}
                    {isSelected && (
                      <div className="absolute bottom-1.5 right-1.5 bg-[#005a9c] text-white p-1 rounded-full shadow-lg animate-scale-in">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="p-2 flex-1 flex flex-col justify-between bg-white text-left">
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] font-black text-slate-900 line-clamp-1 group-hover:text-[#005a9c]">
                          {item.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-1.5 pt-1 border-t border-slate-100 flex items-center justify-between">
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${
                        item.category === 'positive' ? 'text-emerald-700' :
                        item.category === 'negative' ? 'text-rose-700' :
                        item.category === 'distortion' ? 'text-purple-700' : 'text-slate-600'
                      }`}>
                        {item.categoryLabel.split(' ')[0]}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePreview(item);
                        }}
                        className="text-[10px] text-slate-400 hover:text-[#005a9c] font-medium"
                      >
                        Info
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Patient Experience Samples */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 sm:p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-black text-[#003764] uppercase tracking-wider">
                Real Patient Evolution Observations (Migraine Trust Community)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {PATIENT_AURA_EXPERIENCES.slice(0, 4).map((exp, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    // Quick apply sequence
                    setSelected(exp.sequence);
                  }}
                  className="bg-white p-2.5 rounded border border-slate-200 hover:border-[#005a9c] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between font-bold text-[#005a9c] mb-1">
                    <span>{exp.patientLabel}</span>
                    <span className="font-mono text-[11px] bg-blue-50 px-1.5 py-0.5 rounded text-blue-700">
                      {exp.sequenceDisplay}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 italic leading-relaxed">
                    "{exp.quote}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* User Selection & Personal Evolution Notes Box */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#005a9c]" />
                  Your Selected Aura Patterns ({selected.length})
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any card above to toggle. You can pick multiple patterns that occur together or successively.
                </p>
              </div>

              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={appendSequenceToNotes}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-[#005a9c] bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  Insert Selected Sequence into Note
                </button>
              )}
            </div>

            {/* Selected Pills */}
            <div className="flex items-center gap-1.5 flex-wrap min-h-[32px]">
              {selected.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No patterns selected yet. Click cards above to select.</span>
              ) : (
                selected.map((id) => {
                  const item = AURA_PHENOMENA.find((p) => p.id === id);
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 bg-[#003764] text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm"
                    >
                      <span className="text-cyan-300 font-mono font-black">#{id}</span>
                      <span className="max-w-[120px] truncate">{item?.name || 'Aura Pattern'}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelect(id);
                        }}
                        className="hover:text-red-300 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })
              )}
            </div>

            {/* Note Input */}
            <div className="space-y-1.5">
              <label htmlFor="aura-modal-note" className="text-xs font-bold text-slate-700 block">
                Personal Notes on Aura Progression &amp; Characteristics:
              </label>
              <textarea
                id="aura-modal-note"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Example: My aura begins as #8 (colored spots), then develops into #13 (arcuate ring) -> #3 (jagged zig-zags) -> #2 (foggy blur). Takes about 30 minutes before head pain."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#005a9c] focus:border-[#005a9c]"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={selected.length === 0}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 disabled:opacity-40"
            >
              Clear Selection
            </button>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500 font-medium">
              {selected.length} pattern{selected.length === 1 ? '' : 's'} chosen
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 text-xs font-bold text-white bg-[#005a9c] hover:bg-[#003764] rounded-lg shadow transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Apply Selection &amp; Return to Questionnaire
            </button>
          </div>
        </div>

        {/* Detailed Image Preview Modal Overlay */}
        {activePreview && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setActivePreview(null)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-300 p-5 space-y-4 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[#003764] text-white font-mono text-xs font-black px-2 py-0.5 rounded">
                    {activePreview.numberLabel}
                  </span>
                  <h3 className="text-sm font-black text-slate-900">{activePreview.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePreview(null)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-square bg-slate-900 rounded-lg overflow-hidden">
                <img
                  src={activePreview.imagePath}
                  alt={activePreview.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <strong className="text-slate-700">Description:</strong>
                  <p className="text-slate-600 mt-0.5">{activePreview.description}</p>
                </div>
                <div>
                  <strong className="text-[#005a9c]">Clinical Significance:</strong>
                  <p className="text-slate-600 mt-0.5">{activePreview.clinicalSignificance}</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    toggleSelect(activePreview.id);
                    setActivePreview(null);
                  }}
                  className={`px-3 py-1.5 rounded text-xs font-bold ${
                    selected.includes(activePreview.id)
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-[#005a9c] text-white'
                  }`}
                >
                  {selected.includes(activePreview.id) ? 'Remove Pattern' : 'Select Pattern'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
