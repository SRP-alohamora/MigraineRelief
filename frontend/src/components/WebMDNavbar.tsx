import React, { useState } from 'react';
import { Search, User, Sparkles, Menu, X, LogOut, ChevronRight, BookOpen, Database, GitBranch, Layers, Newspaper, Construction } from 'lucide-react';

export type NavRoute = '/' | '/news' | '/research' | '/datasets' | '/github' | '/classification' | '/under-construction' | '/login' | '/results';

interface WebMDNavbarProps {
  currentRoute: NavRoute;
  onNavigate: (route: NavRoute) => void;
  hasAnalyzedData: boolean;
  onOpenLogin: () => void;
  isLoggedIn: boolean;
  username: string;
  onLogout: () => void;
}

export const WebMDNavbar: React.FC<WebMDNavbarProps> = ({
  currentRoute,
  onNavigate,
  hasAnalyzedData,
  onOpenLogin,
  isLoggedIn,
  username,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRouteClick = (route: NavRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-[#dbe2e8] bg-white sticky top-0 z-40 shadow-sm">
      {/* 1. Main Branding & Search Row */}
      <div className="app-container py-3 sm:py-4 flex items-center justify-between gap-4">
        {/* Brand Name strictly "Migraine Relief" */}
        <div
          onClick={() => handleRouteClick('/')}
          className="cursor-pointer flex items-baseline gap-1"
        >
          <span className="text-2xl sm:text-3xl font-black text-[#003764] tracking-tight font-sans">
            Migraine <span className="text-[#005a9c]">Relief</span>
          </span>
        </div>

        {/* Search Input */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search migraine clinical trials, aura features, medications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-1.5 sm:py-2 border border-slate-300 rounded-full text-xs sm:text-sm focus:outline-none focus:border-[#005a9c] focus:ring-1 focus:ring-[#005a9c]"
            />
            <button
              type="button"
              className="absolute right-3 top-2 sm:top-2.5 text-slate-400 hover:text-[#005a9c]"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-md text-[#003764] hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 2. Primary Desktop Navigation Bar (STRICTLY: News, Research Papers, DataSets, GitHub Projects, Classification, Login) */}
      <nav className="bg-[#005a9c] text-white hidden md:block">
        <div className="app-container flex items-center justify-between">
          <div className="flex items-center space-x-1 py-1">
            <button
              onClick={() => handleRouteClick('/')}
              className={`px-3.5 py-2 text-xs lg:text-sm font-bold whitespace-nowrap transition-colors rounded ${
                currentRoute === '/' ? 'bg-[#003764] text-white shadow-inner' : 'hover:bg-[#004b87] text-white'
              }`}
            >
              Home
            </button>

            {/* 1. News */}
            <button
              onClick={() => handleRouteClick('/news')}
              className={`px-3.5 py-2 text-xs lg:text-sm font-bold whitespace-nowrap transition-colors rounded ${
                currentRoute === '/news' ? 'bg-[#003764] text-white shadow-inner' : 'hover:bg-[#004b87] text-white'
              }`}
            >
              News
            </button>

            {/* 2. Research Papers */}
            <button
              onClick={() => handleRouteClick('/research')}
              className={`px-3.5 py-2 text-xs lg:text-sm font-bold whitespace-nowrap transition-colors rounded ${
                currentRoute === '/research' ? 'bg-[#003764] text-white shadow-inner' : 'hover:bg-[#004b87] text-white'
              }`}
            >
              Research Papers
            </button>

            {/* 3. DataSets */}
            <button
              onClick={() => handleRouteClick('/datasets')}
              className={`px-3.5 py-2 text-xs lg:text-sm font-bold whitespace-nowrap transition-colors rounded ${
                currentRoute === '/datasets' ? 'bg-[#003764] text-white shadow-inner' : 'hover:bg-[#004b87] text-white'
              }`}
            >
              DataSets
            </button>

            {/* 4. GitHub Projects */}
            <button
              onClick={() => handleRouteClick('/github')}
              className={`px-3.5 py-2 text-xs lg:text-sm font-bold whitespace-nowrap transition-colors rounded ${
                currentRoute === '/github' ? 'bg-[#003764] text-white shadow-inner' : 'hover:bg-[#004b87] text-white'
              }`}
            >
              GitHub Projects
            </button>

            {/* 5. Classification */}
            <button
              onClick={() => handleRouteClick('/classification')}
              className={`px-3.5 py-2 text-xs lg:text-sm font-bold whitespace-nowrap transition-colors rounded ${
                currentRoute === '/classification' ? 'bg-[#003764] text-white shadow-inner' : 'hover:bg-[#004b87] text-white'
              }`}
            >
              Classification
            </button>

            {/* 6. Under Construction */}
            <button
              onClick={() => handleRouteClick('/under-construction')}
              className={`px-3.5 py-2 text-xs lg:text-sm font-bold whitespace-nowrap transition-colors rounded flex items-center gap-1.5 ${
                currentRoute === '/under-construction' ? 'bg-[#003764] text-white shadow-inner' : 'hover:bg-[#004b87] text-white'
              }`}
            >
              <Construction className="w-3.5 h-3.5 text-amber-300" />
              <span>Under Construction</span>
            </button>

            {/* Analysis Results Tab (Lights up when data is submitted) */}
            {hasAnalyzedData && (
              <button
                onClick={() => handleRouteClick('/results')}
                className={`px-3.5 py-2 text-xs lg:text-sm font-black whitespace-nowrap transition-all rounded flex items-center gap-1.5 ml-2 ${
                  currentRoute === '/results'
                    ? 'bg-amber-400 text-slate-900 shadow-md'
                    : 'bg-amber-300 hover:bg-amber-400 text-slate-900 animate-pulse'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 fill-current text-slate-900" />
                My Personalized Analysis
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              </button>
            )}
          </div>

          {/* 6. Login / Profile Control */}
          <div className="py-1">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-100 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-cyan-300" />
                  {username}
                </span>
                <button
                  type="button"
                  onClick={onLogout}
                  className="text-xs font-bold px-2.5 py-1 rounded bg-[#003764] hover:bg-[#002b4e] text-white transition-colors border border-blue-400/30 flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="text-xs font-bold px-3 py-1.5 rounded bg-[#003764] hover:bg-[#002b4e] text-white transition-colors border border-blue-400/30 flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 3. Mobile Navigation Drawer (375px & 768px Viewports) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#003764] text-white border-t border-blue-800/50 p-4 space-y-2 animate-clinical-fade">
          <button
            type="button"
            onClick={() => handleRouteClick('/')}
            className={`w-full text-left px-3 py-2.5 rounded font-bold text-sm flex items-center justify-between ${
              currentRoute === '/' ? 'bg-[#005a9c]' : 'hover:bg-white/10'
            }`}
          >
            <span>Home</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            type="button"
            onClick={() => handleRouteClick('/news')}
            className={`w-full text-left px-3 py-2.5 rounded font-bold text-sm flex items-center justify-between ${
              currentRoute === '/news' ? 'bg-[#005a9c]' : 'hover:bg-white/10'
            }`}
          >
            <span className="flex items-center gap-2"><Newspaper className="w-4 h-4 text-cyan-300" /> News</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            type="button"
            onClick={() => handleRouteClick('/research')}
            className={`w-full text-left px-3 py-2.5 rounded font-bold text-sm flex items-center justify-between ${
              currentRoute === '/research' ? 'bg-[#005a9c]' : 'hover:bg-white/10'
            }`}
          >
            <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-cyan-300" /> Research Papers</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            type="button"
            onClick={() => handleRouteClick('/datasets')}
            className={`w-full text-left px-3 py-2.5 rounded font-bold text-sm flex items-center justify-between ${
              currentRoute === '/datasets' ? 'bg-[#005a9c]' : 'hover:bg-white/10'
            }`}
          >
            <span className="flex items-center gap-2"><Database className="w-4 h-4 text-cyan-300" /> DataSets</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            type="button"
            onClick={() => handleRouteClick('/github')}
            className={`w-full text-left px-3 py-2.5 rounded font-bold text-sm flex items-center justify-between ${
              currentRoute === '/github' ? 'bg-[#005a9c]' : 'hover:bg-white/10'
            }`}
          >
            <span className="flex items-center gap-2"><GitBranch className="w-4 h-4 text-cyan-300" /> GitHub Projects</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            type="button"
            onClick={() => handleRouteClick('/classification')}
            className={`w-full text-left px-3 py-2.5 rounded font-bold text-sm flex items-center justify-between ${
              currentRoute === '/classification' ? 'bg-[#005a9c]' : 'hover:bg-white/10'
            }`}
          >
            <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-cyan-300" /> Classification</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            type="button"
            onClick={() => handleRouteClick('/under-construction')}
            className={`w-full text-left px-3 py-2.5 rounded font-bold text-sm flex items-center justify-between ${
              currentRoute === '/under-construction' ? 'bg-[#005a9c]' : 'hover:bg-white/10'
            }`}
          >
            <span className="flex items-center gap-2">
              <Construction className="w-4 h-4 text-amber-300" /> Under Construction
            </span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          {hasAnalyzedData && (
            <button
              type="button"
              onClick={() => handleRouteClick('/results')}
              className="w-full text-left px-3 py-2.5 rounded font-black text-sm bg-amber-400 text-slate-900 flex items-center justify-between mt-2"
            >
              <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> My Personalized Analysis</span>
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            </button>
          )}

          <div className="pt-3 mt-3 border-t border-blue-800">
            {isLoggedIn ? (
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-300" /> {username}
                </span>
                <button
                  type="button"
                  onClick={onLogout}
                  className="text-xs font-bold px-3 py-1 bg-rose-600 rounded text-white"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 bg-[#005a9c] hover:bg-[#004b87] rounded text-center text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
