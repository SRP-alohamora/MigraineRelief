import React, { useState, useEffect } from 'react';
import { WebMDNavbar, NavRoute } from './components/WebMDNavbar';
import { FeaturedResearchSection } from './components/FeaturedResearchSection';
import { UploadDataModal, MigraineValuesMap } from './components/UploadDataModal';
import { PersonalizedResultsTab } from './components/PersonalizedResultsTab';
import {
  NewsTab,
  ResearchPapersTab,
  DataSetsTab,
  GitHubProjectsTab,
  ClassificationTab,
  UnderConstructionTab,
} from './components/NavigationSections';
import { LoginModal } from './components/LoginModal';
import { ShieldCheck, ChevronRight, Zap, Clock, Lock, ArrowRight, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  // Client-Side URL Route Management
  const [currentRoute, setCurrentRoute] = useState<NavRoute>(() => {
    const p = window.location.pathname;
    if (['/news', '/research', '/datasets', '/github', '/classification', '/under-construction', '/login', '/results'].includes(p)) {
      return p as NavRoute;
    }
    return '/';
  });

  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Authentication State with LocalStorage persistence
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem('migraine_user_name') || 'Guest Researcher';
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem('migraine_user_name');
  });

  // Uploaded Migraine Clinical Data with LocalStorage persistence
  const [userData, setUserData] = useState<MigraineValuesMap | null>(() => {
    try {
      const saved = localStorage.getItem('migraine_user_data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Saved Filename & GST Timestamp
  const [savedFilename, setSavedFilename] = useState<string>(() => {
    return localStorage.getItem('migraine_saved_filename') || '';
  });
  const [savedGstTime, setSavedGstTime] = useState<string>(() => {
    return localStorage.getItem('migraine_saved_gst_time') || '';
  });

  const hasAnalyzedData = !!userData;

  // Sync route changes with browser history
  const navigateTo = (route: NavRoute) => {
    if (route === '/login') {
      setIsLoginModalOpen(true);
      return;
    }
    setCurrentRoute(route);
    if (window.location.pathname !== route) {
      window.history.pushState({}, '', route);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      if (['/news', '/research', '/datasets', '/github', '/classification', '/under-construction', '/login', '/results'].includes(p)) {
        setCurrentRoute(p as NavRoute);
      } else {
        setCurrentRoute('/');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLogin = (name: string) => {
    setUsername(name);
    setIsLoggedIn(true);
    localStorage.setItem('migraine_user_name', name);
  };

  const handleLogout = () => {
    setUsername('Guest Researcher');
    setIsLoggedIn(false);
    localStorage.removeItem('migraine_user_name');
  };

  const handleDataSubmit = (data: MigraineValuesMap, filename: string, gstTime: string) => {
    setUserData(data);
    setSavedFilename(filename);
    setSavedGstTime(gstTime);
    localStorage.setItem('migraine_user_data', JSON.stringify(data));
    localStorage.setItem('migraine_saved_filename', filename);
    localStorage.setItem('migraine_saved_gst_time', gstTime);
    navigateTo('/results');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* 1. WebMD-Inspired Header with Strict 6 Navigation Items */}
      <WebMDNavbar
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        hasAnalyzedData={hasAnalyzedData}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
      />

      {/* 2. Main Page Container */}
      <main className="flex-1 app-container py-6 sm:py-8">
        {/* Breadcrumb Strip */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6 flex items-center gap-1.5 font-medium">
          <button
            onClick={() => navigateTo('/')}
            className="hover:text-[#005a9c] hover:underline"
          >
            Migraine Relief
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-bold capitalize">
            {currentRoute === '/'
              ? 'Research & Clinical Trials'
              : currentRoute === '/research'
              ? 'Research Papers'
              : currentRoute === '/datasets'
              ? 'DataSets'
              : currentRoute === '/github'
              ? 'GitHub Projects'
              : currentRoute === '/classification'
              ? 'Classification'
              : currentRoute === '/under-construction'
              ? 'Under Construction'
              : currentRoute === '/results'
              ? 'My Personalized Analysis'
              : 'News'}
          </span>
        </nav>

        {/* =========================================================================
            PHASE 4: HOMEPAGE
            Strictly contains only:
            1. Header (rendered above)
            2. Main migraine research story (Chiang et al. 2024)
            3. Second migraine research story (Burstein et al. 2000)
            4. Data-analysis CTA ("Upload your migraine data to analyze & learn key patterns")
            5. Small research/medical disclaimer (rendered below)
            6. Footer (rendered below)
           ========================================================================= */}
        {currentRoute === '/' && (
          <div className="space-y-8">
            {/* Homepage Hero */}
            <section className="hero-band px-6 py-12 sm:px-10 sm:py-16 md:py-20 animate-clinical-fade">
              <div className="relative max-w-3xl mx-auto text-center space-y-6">
                <span className="hero-eyebrow">
                  <Sparkles className="w-3.5 h-3.5 text-[#0077b6]" />
                  Precision Acute Attack Intelligence
                </span>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.1] text-[#003764]">
                  Every minute counts <br className="hidden sm:block" />
                  when a <span className="text-gradient-brand">migraine</span> strikes.
                </h1>

                <p className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
                  Migraine Relief translates landmark neurovascular research into a real-time decision copilot &mdash;
                  matching timing, formulation route, and medication overuse safety limits before the pre-allodynic
                  window closes.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="btn-primary text-sm sm:text-base px-7 py-3.5 w-full sm:w-auto"
                  >
                    <span>Analyze My Migraine Patterns</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('/research')}
                    className="btn-secondary text-sm sm:text-base px-7 py-3.5 w-full sm:w-auto"
                  >
                    Explore the Research
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-8 max-w-xl mx-auto">
                  <div className="stat-chip px-3 py-4 sm:p-5 flex flex-col items-center gap-2">
                    <span className="icon-chip w-9 h-9 sm:w-10 sm:h-10">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <span className="text-lg sm:text-xl font-black text-[#003764]">60 min</span>
                    <span className="text-[10px] sm:text-xs text-slate-500 font-semibold text-center leading-tight">
                      Pre-Allodynic Window
                    </span>
                  </div>
                  <div className="stat-chip px-3 py-4 sm:p-5 flex flex-col items-center gap-2">
                    <span className="icon-chip icon-chip-teal w-9 h-9 sm:w-10 sm:h-10">
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <span className="text-lg sm:text-xl font-black text-[#003764]">&lt;50ms</span>
                    <span className="text-[10px] sm:text-xs text-slate-500 font-semibold text-center leading-tight">
                      Rescue Engine Latency
                    </span>
                  </div>
                  <div className="stat-chip px-3 py-4 sm:p-5 flex flex-col items-center gap-2">
                    <span className="icon-chip w-9 h-9 sm:w-10 sm:h-10">
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <span className="text-lg sm:text-xl font-black text-[#003764]">Zero-PII</span>
                    <span className="text-[10px] sm:text-xs text-slate-500 font-semibold text-center leading-tight">
                      Client-Side Encryption
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <FeaturedResearchSection
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
            />

            {/* Small Research & Medical Disclaimer as specified in Phase 4 */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-500 leading-relaxed text-center max-w-3xl mx-auto">
              <strong>Research &amp; Medical Disclaimer:</strong> Migraine Relief is an educational decision-support and pattern-discovery platform designed to promote precision neurology research and shared clinical dialogue. It does not provide medical diagnoses or prescribe treatment regimens. Consult a qualified neurologist or physician for clinical management.
            </div>
          </div>
        )}

        {/* Route: News */}
        {currentRoute === '/news' && <NewsTab />}

        {/* Route: Research Papers */}
        {currentRoute === '/research' && <ResearchPapersTab />}

        {/* Route: DataSets */}
        {currentRoute === '/datasets' && <DataSetsTab />}

        {/* Route: GitHub Projects */}
        {currentRoute === '/github' && <GitHubProjectsTab />}

        {/* Route: Classification */}
        {currentRoute === '/classification' && <ClassificationTab />}

        {/* Route: Under Construction */}
        {currentRoute === '/under-construction' && <UnderConstructionTab />}

        {/* Route: Personalized Results */}
        {currentRoute === '/results' && (
          <PersonalizedResultsTab
            data={userData}
            savedFilename={savedFilename}
            gstTimeDisplay={savedGstTime}
            onRetest={() => setIsUploadModalOpen(true)}
          />
        )}
      </main>

      {/* 3. Footer */}
      <footer className="bg-[#f8fafc] border-t border-[#dbe2e8] mt-16 pt-10 pb-12 text-slate-600 text-xs">
        <div className="app-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <span className="text-xl font-black text-[#003764] tracking-tight block mb-2 font-sans">
                Migraine <span className="text-[#005a9c]">Relief</span>
              </span>
              <p className="text-xs text-slate-500 leading-relaxed">
                Evidence-based migraine research, clinical trial translation, and machine-learning pattern discovery.
              </p>
            </div>

            <div>
              <h4 className="font-extrabold text-[#003764] uppercase tracking-wider mb-3">
                Research Navigation
              </h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigateTo('/news')} className="hover:text-[#005a9c]">
                    Latest News
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('/research')} className="hover:text-[#005a9c]">
                    Research Papers
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('/datasets')} className="hover:text-[#005a9c]">
                    Open DataSets
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('/github')} className="hover:text-[#005a9c]">
                    GitHub Projects
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('/under-construction')} className="hover:text-[#005a9c]">
                    Under Construction
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-[#003764] uppercase tracking-wider mb-3">
                Clinical Standards
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-4 h-4" /> Zero-PII Policy
                </li>
                <li>ICHD-3 Diagnostic Taxonomy</li>
                <li>Pre-Allodynic Window Evidence</li>
                <li>Non-Vasoconstrictive CGRP Safety</li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-[#003764] uppercase tracking-wider mb-3">
                Editorial Recognition
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Featuring award-winning neurological research by Dr. Chia-Chun Chiang (2024 Harold G. Wolff Lecture Award, American Headache Society) and Dr. Rami Burstein (Harvard Medical School / Brain 2000).
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-300 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400">
            <p className="text-[11px] leading-relaxed max-w-2xl">
              <strong>Medical Disclaimer:</strong> Migraine Relief is provided for educational and research support purposes only. Never disregard professional medical advice because of something you have read on this platform.
            </p>
            <div className="text-[11px] text-right whitespace-nowrap">
              &copy; {new Date().getFullYear()} Migraine Relief. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* 4. Modal: Upload Migraine Clinical Data Form (with Phase 8 Privacy Gate) */}
      <UploadDataModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        loginName={username}
        onSubmitAndAnalyze={handleDataSubmit}
      />

      {/* 5. Modal: User Account / Login */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        isLoggedIn={isLoggedIn}
        username={username}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default App;
