import { useState, useEffect } from 'react';
import { useInRouterContext, MemoryRouter } from 'react-router-dom';
import { Shield, LogOut, ClipboardList, Tag } from 'lucide-react';
import type { StaffUser } from '../types/auth';
import { getStoredStaffUser, logoutStaff } from '../api/authService';
import { StaffLogin } from './StaffLogin';
import { StaffOrdersDashboard } from './StaffOrdersDashboard';
import { StaffOfferingsManager } from './StaffOfferingsManager';

function StaffPortalContent() {
  const [currentUser, setCurrentUser] = useState<StaffUser | null>(getStoredStaffUser);
  const [activeTab, setActiveTab] = useState<'orders' | 'offerings'>('orders');

  useEffect(() => {
    setCurrentUser(getStoredStaffUser());
  }, []);

  function handleLogout() {
    logoutStaff();
    setCurrentUser(null);
  }

  // If not logged in, show Staff Login view
  if (!currentUser) {
    return <StaffLogin onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="space-y-6">
      {/* ── Staff Session Header ── */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
            <Shield className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                {currentUser.name}
              </h2>
              <span className="text-[10px] uppercase font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentUser.email} · {currentUser.templeName ?? 'Central Office'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="min-h-[44px] px-4 py-2 bg-slate-900 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-700 text-slate-300 hover:text-rose-300 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-rose-500 self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* ── Sub-Navigation Tabs: Orders vs Offerings ── */}
      <div className="flex items-center gap-2 p-1 bg-slate-800/80 border border-slate-700/80 rounded-2xl max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex-1 min-h-[44px] flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-pressed={activeTab === 'orders'}
        >
          <ClipboardList className="w-4 h-4" aria-hidden="true" />
          <span>Booked Orders</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('offerings')}
          className={`flex-1 min-h-[44px] flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
            activeTab === 'offerings'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-pressed={activeTab === 'offerings'}
        >
          <Tag className="w-4 h-4" aria-hidden="true" />
          <span>Manage Offerings</span>
        </button>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'orders' ? (
        <StaffOrdersDashboard />
      ) : (
        <StaffOfferingsManager />
      )}
    </div>
  );
}

export function StaffPortal() {
  const inRouter = useInRouterContext();
  if (!inRouter) {
    return (
      <MemoryRouter>
        <StaffPortalContent />
      </MemoryRouter>
    );
  }
  return <StaffPortalContent />;
}
