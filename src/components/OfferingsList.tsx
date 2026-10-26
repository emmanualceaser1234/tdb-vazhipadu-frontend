import { useState, useMemo } from 'react';
import { AlertCircle, RefreshCw, Search, Tag, IndianRupee, CheckCircle, XCircle } from 'lucide-react';
import type { Offering } from '../types/vazhipadu';
import { useOfferings } from '../hooks/useOfferings';

// ─── Skeleton card ────────────────────────────────────────────────────────────
function OfferingSkeletonCard() {
  return (
    <div
      className="bg-slate-800 rounded-xl p-5 border border-slate-700 animate-pulse"
      aria-hidden="true"
    >
      <div className="h-4 bg-slate-700 rounded w-3/4 mb-3" />
      <div className="h-3 bg-slate-700 rounded w-full mb-2" />
      <div className="h-3 bg-slate-700 rounded w-5/6 mb-4" />
      <div className="flex justify-between items-center">
        <div className="h-6 bg-slate-700 rounded w-20" />
        <div className="h-6 bg-slate-700 rounded w-16" />
      </div>
    </div>
  );
}

// ─── Individual offering card ─────────────────────────────────────────────────
interface OfferingCardProps {
  offering: Offering;
  onAddToCart: (offering: Offering) => void;
}

function OfferingCard({ offering, onAddToCart }: OfferingCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(offering.priceRupees);

  return (
    <article
      className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-emerald-600 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-900/20 flex flex-col gap-3"
      aria-label={`${offering.name} — ${formattedPrice}`}
    >
      {/* Category badge */}
      <div className="flex items-center gap-1.5">
        <Tag className="w-3 h-3 text-indigo-400" aria-hidden="true" />
        <span className="text-xs font-medium text-indigo-400 uppercase tracking-wide">
          {offering.category}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-lg font-semibold text-slate-100 leading-snug">
        {offering.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed flex-1">
        {offering.description}
      </p>

      {/* Price + status + action */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-700">
        <div className="flex items-center gap-1 text-emerald-400 font-bold text-lg">
          <IndianRupee className="w-4 h-4" aria-hidden="true" />
          <span>{offering.priceRupees.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
            Available
          </span>
          <button
            type="button"
            onClick={() => onAddToCart(offering)}
            className="min-h-[44px] min-w-[44px] px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-slate-800 flex items-center justify-center"
            aria-label={`Add ${offering.name} to cart`}
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
interface OfferingsListProps {
  templeId: string | null;
  onAddToCart: (offering: Offering) => void;
}

export function OfferingsList({ templeId, onAddToCart }: OfferingsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { offerings, loading, error, retry } = useOfferings(templeId);

  // Only show active offerings; filter by search query
  const activeOfferings = useMemo(
    () => offerings.filter((o) => o.isActive),
    [offerings],
  );

  const filteredOfferings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return activeOfferings;
    return activeOfferings.filter((o) => o.name.toLowerCase().includes(q));
  }, [activeOfferings, searchQuery]);

  const inactiveCount = useMemo(
    () => offerings.filter((o) => !o.isActive).length,
    [offerings],
  );

  // ── No temple selected ──
  if (!templeId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
          <Search className="w-7 h-7 text-slate-600" aria-hidden="true" />
        </div>
        <p className="text-lg font-medium">Select a temple to view offerings</p>
        <p className="text-sm mt-1">Choose a temple from the dropdown above</p>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div
        role="alert"
        aria-live="polite"
        className="flex flex-col items-center gap-4 py-16"
      >
        <div className="flex items-center gap-3 bg-red-950 border border-red-700 text-red-300 rounded-xl px-5 py-4 max-w-md w-full">
          <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm">{error}</p>
        </div>
        <button
          type="button"
          onClick={retry}
          className="min-h-[44px] flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section aria-label="Temple offerings" aria-busy={loading}>
      {/* Search */}
      <div className="mb-6">
        <label htmlFor="offering-search" className="sr-only">
          Search offerings
        </label>
        <div className="relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="offering-search"
            type="search"
            placeholder="Search offerings…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[44px] pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-slate-900 focus:border-transparent transition-all"
            aria-label="Search offerings by name"
          />
        </div>
      </div>

      {/* Inactive notice */}
      {!loading && inactiveCount > 0 && (
        <div
          role="note"
          className="flex items-center gap-2 mb-4 text-xs text-amber-400 bg-amber-950/40 border border-amber-800/40 rounded-lg px-4 py-2.5"
        >
          <XCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          <span>
            {inactiveCount} offering{inactiveCount > 1 ? 's are' : ' is'} currently unavailable for booking and hidden from this list.
          </span>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          role="status"
          aria-label="Loading offerings"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <OfferingSkeletonCard key={i} />
          ))}
          <span className="sr-only">Loading offerings, please wait…</span>
        </div>
      )}

      {/* Empty search state */}
      {!loading && filteredOfferings.length === 0 && searchQuery.trim() !== '' && (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center py-16 text-slate-500"
        >
          <Search className="w-10 h-10 mb-3 text-slate-600" aria-hidden="true" />
          <p className="font-medium text-slate-400">No offerings match &ldquo;{searchQuery}&rdquo;</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      )}

      {/* Empty temple state (no active offerings at all) */}
      {!loading && activeOfferings.length === 0 && searchQuery.trim() === '' && (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center py-16 text-slate-500"
        >
          <p className="font-medium">No active offerings available for this temple.</p>
        </div>
      )}

      {/* Offerings grid */}
      {!loading && filteredOfferings.length > 0 && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          role="list"
          aria-label={`${filteredOfferings.length} offering${filteredOfferings.length !== 1 ? 's' : ''} available`}
        >
          {filteredOfferings.map((offering) => (
            <div key={offering.id} role="listitem">
              <OfferingCard offering={offering} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
