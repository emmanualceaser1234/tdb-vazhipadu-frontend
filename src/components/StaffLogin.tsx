import { useState, useId } from 'react';
import { Lock, Mail, Shield, AlertCircle, ArrowRight, UserCheck, KeyRound } from 'lucide-react';
import type { StaffUser } from '../types/auth';
import { loginStaff, DUMMY_STAFF_ACCOUNTS } from '../api/authService';

interface StaffLoginProps {
  onLoginSuccess: (user: StaffUser) => void;
}

export function StaffLogin({ onLoginSuccess }: StaffLoginProps) {
  const uid = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const user = await loginStaff({ email, password });
      onLoginSuccess(user);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please check credentials.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }

  function handleQuickFill(demoEmail: string, demoPass: string) {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  }

  return (
    <div className="max-w-xl mx-auto space-y-8 py-6">
      {/* ── Login Header ── */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-indigo-600 shadow-xl shadow-emerald-950/40 text-white mb-2">
          <Shield className="w-7 h-7" aria-hidden="true" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
          Temple Staff Portal Login
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Restricted access for Travancore Devaswom Board officers & managers
        </p>
      </div>

      {/* ── Login Form Card ── */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {errorMessage && (
          <div
            role="alert"
            aria-live="assertive"
            className="flex items-start gap-3 p-3.5 bg-red-950/90 border border-red-700 text-red-200 text-xs sm:text-sm rounded-xl shadow-md"
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-label="Staff login form">
          {/* Email */}
          <div>
            <label
              htmlFor={`${uid}-email`}
              className="block text-xs font-semibold text-slate-300 mb-1.5"
            >
              Staff Official Email <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                id={`${uid}-email`}
                type="email"
                autoComplete="email"
                placeholder="e.g. admin@tdb.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-slate-900 text-sm transition-all"
                aria-required="true"
              />
              <Mail
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor={`${uid}-password`}
              className="block text-xs font-semibold text-slate-300 mb-1.5"
            >
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                id={`${uid}-password`}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-slate-900 text-sm transition-all"
                aria-required="true"
              />
              <Lock
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[44px] py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold rounded-xl transition-all duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-emerald-950/40 active:scale-98"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating…</span>
              </>
            ) : (
              <>
                <span>Sign In to Staff Portal</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* ── Demo Accounts Quick Fill ── */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <KeyRound className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>Demo Staff Accounts (Click to Quick-Fill)</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {DUMMY_STAFF_ACCOUNTS.map((acc) => (
            <button
              key={acc.user.email}
              type="button"
              onClick={() => handleQuickFill(acc.user.email, acc.password)}
              className="text-left p-3 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-700/80 hover:border-emerald-600/60 transition-all flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                    {acc.user.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded">
                    {acc.user.role}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {acc.user.email} · Password: <span className="text-slate-300 font-semibold">{acc.password}</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{acc.description}</p>
              </div>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
                Fill
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
