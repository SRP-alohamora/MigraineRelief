import React from 'react';
import { BookOpen, ExternalLink, Sparkles, UploadCloud, ShieldAlert, Award, ArrowRight, Clock, Brain } from 'lucide-react';

interface FeaturedResearchSectionProps {
  onOpenUploadModal: () => void;
}

export const FeaturedResearchSection: React.FC<FeaturedResearchSectionProps> = ({
  onOpenUploadModal,
}) => {
  return (
    <section className="space-y-8 animate-clinical-fade">
      {/* 1. Main Research Story (Hero Editorial Feature) */}
      <article className="medical-card p-6 md:p-8 medical-card-featured">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="badge-clinical">
            <Award className="w-3.5 h-3.5 text-[#005a9c]" />
            2024 Harold G. Wolff Lecture Award • American Headache Society
          </span>
          <span className="text-xs font-mono text-slate-500">PMID: 39176658</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#003764] leading-tight tracking-tight">
              Machine Learning Research Moves Migraine Care Toward Precision Treatment
            </h2>

            <div className="text-sm font-bold text-[#005a9c] flex flex-wrap items-center gap-2">
              <span>Lead Investigator: Chia-Chun Chiang, MD (Mayo Clinic)</span>
              <span>•</span>
              <span className="text-slate-600 font-normal">Headache: The Journal of Head and Face Pain, 64(9)</span>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              Dr. Chia-Chun Chiang and colleagues demonstrated that machine-learning algorithms trained on patient clinical characteristics and attack features can predict individualized response probabilities to preventive migraine medications. By evaluating multi-dimensional patient profiles rather than relying on empirical trial-and-error, this computational framework represents a foundational step toward shared clinical decision support and personalized therapeutic selection.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold">
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/39176658/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#005a9c] hover:underline flex items-center gap-1.5"
              >
                <span>View Citation on PubMed (PMID: 39176658)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-slate-400">|</span>
              <a
                href="https://doi.org/10.1111/head.14806"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-[#005a9c] hover:underline"
              >
                DOI: 10.1111/head.14806
              </a>
            </div>
          </div>

          {/* Medical Illustration Hero Visual */}
          <div className="lg:col-span-4 bg-[#f0f7fc] border border-[#c2dbed] rounded-lg p-5 flex flex-col justify-center items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#003764] text-white flex items-center justify-center shadow-md">
              <Brain className="w-9 h-9 text-cyan-300" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#003764] uppercase tracking-wider">
                Precision Biomarker Modeling
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-normal">
                Multi-center cohort predictive response probability modeling across preventive drug classes.
              </p>
            </div>
            <div className="text-[11px] font-mono text-[#005a9c] font-semibold bg-white px-2.5 py-1 rounded border border-blue-200">
              AHS Award-Winning Research
            </div>
          </div>
        </div>
      </article>

      {/* 2. Second Research Story */}
      <article className="medical-card p-6 md:p-8 medical-card-accent">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="badge-clinical">
            <Clock className="w-3.5 h-3.5 text-[#0077b6]" />
            Acute Attack Timing &amp; Central Sensitization
          </span>
          <span className="text-xs font-mono text-slate-500">PMID: 10908396 / 14705108</span>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl sm:text-2xl font-black text-[#003764] leading-snug">
            Why Timing Matters in Acute Migraine Treatment
          </h3>

          <div className="text-sm font-bold text-[#0077b6]">
            Burstein R et al. (2000). Defeating migraine pain with triptans: a race against time. Brain, 123(8):1703–1718.
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            In landmark investigations published in <em>Brain</em> and <em>Annals of Neurology</em>, Dr. Rami Burstein identified that acute migraine evolves in distinct pathophysiological stages: an early phase driven by first-order peripheral trigeminovascular nociceptors, followed by secondary central sensitization marked by cutaneous allodynia (scalp and facial skin tenderness). Administering abortive triptan therapy within the early pre-allodynic window achieved over 80% sustained pain-free rates, whereas efficacy fell precipitously once central allodynia was established.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/10908396/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#005a9c] hover:underline flex items-center gap-1"
            >
              <span>PubMed: Brain (2000) 123(8):1703–1709</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-slate-400">|</span>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/14705108/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#005a9c] hover:underline flex items-center gap-1"
            >
              <span>PubMed: Annals of Neurology (2004)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </article>

      {/* 3. Primary Data-Analysis CTA Section (EXACTLY AS SPECIFIED IN PHASE 7) */}
      <section className="bg-[#f0f7fc] border border-[#c2dbed] rounded-xl p-6 md:p-10 text-center shadow-sm">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#b8c6d4] text-[#003764] rounded-full text-xs font-extrabold uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#0077b6]" />
            Diagnostic Feature Evaluation &amp; Structured Pattern Analysis
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-[#003764] tracking-tight">
            Personalized Migraine Characteristic Evaluation
          </h3>

          {/* EXACT Supporting Message from Phase 7 */}
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            Explore patterns in your migraine characteristics using structured analysis. Do not enter your name or other personally identifying information.
          </p>

          {/* EXACT Button Text from Phase 7 */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenUploadModal}
              className="btn-primary text-base sm:text-lg px-8 py-4 shadow-md hover:shadow-lg transition-all"
            >
              <UploadCloud className="w-5 h-5" />
              <span>Upload your migraine data to analyze &amp; learn key patterns</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <p className="text-xs text-slate-500 pt-1">
            Compliant with clinical research ethics. Features are evaluated anonymously against peer-reviewed diagnostic benchmarks.
          </p>
        </div>
      </section>
    </section>
  );
};
