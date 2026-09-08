import React, { useState } from 'react';
import { X, User, Lock, ShieldCheck, ArrowRight, LogOut } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  username: string;
  onLogin: (name: string) => void;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  username,
  onLogin,
  onLogout,
}) => {
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUser.trim()) return;
    onLogin(emailOrUser.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-[#003764] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-300" />
            <h2 className="text-lg font-bold tracking-tight">
              {isLoggedIn ? 'Account Profile' : 'MigraineRelief Login'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoggedIn ? (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 bg-[#f0f7fc] text-[#005a9c] rounded-full flex items-center justify-center mx-auto border-2 border-[#005a9c]">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#003764]">{username}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Active Clinical Session • Encrypted Local Storage Enabled
                </p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 text-left">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Your submitted migraine analysis and RAG vectors are linked to this profile.</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-webmd-outline flex-1"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-[#f0f7fc] border border-[#c2dbed] rounded text-xs text-slate-700 flex items-start gap-2">
                <Lock className="w-4 h-4 text-[#005a9c] flex-shrink-0 mt-0.5" />
                <span>
                  Log in to securely persist your migraine attack patterns, RAG memory index, and predictive rescue recommendations.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username or Clinical ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., ClinicalUser_92"
                  value={emailOrUser}
                  onChange={(e) => setEmailOrUser(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-[#005a9c] focus:outline-none focus:ring-1 focus:ring-[#005a9c]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Access Key / Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:border-[#005a9c] focus:outline-none focus:ring-1 focus:ring-[#005a9c]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-webmd w-full justify-center"
                >
                  <span>Sign In / Activate Profile</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onLogin('Anonymous Neurologist');
                    onClose();
                  }}
                  className="text-xs font-bold text-[#005a9c] hover:underline"
                >
                  Or continue as Anonymous Guest Researcher
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
