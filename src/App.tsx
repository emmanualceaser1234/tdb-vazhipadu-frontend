import { useState, useEffect, useCallback } from 'react';
import { Landmark, ShoppingCart, ChevronDown } from 'lucide-react';
import type { Temple, Offering } from './types/vazhipadu';
import { getTemples } from './api/mockClient';
import { OfferingsList } from './components/OfferingsList';

function App() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTempleId, setSelectedTempleId] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [templesLoading, setTemplesLoading] = useState(true);

  const loadTemples = useCallback(async () => {
    setTemplesLoading(true);
    try {
      const data = await getTemples();
      setTemples(data);
    } catch {
      // silently degrade — temples will be empty
    } finally {
      setTemplesLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTemples();
  }, [loadTemples]);

  function handleAddToCart(_offering: Offering) {
    setCartCount((prev) => prev + 1);
  }

  const selectedTemple = temples.find((t) => t.id === selectedTempleId) ?? null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Landmark className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 leading-none">Vazhipadu</h1>
              <p className="text-xs text-slate-400 mt-0.5">Temple Offerings Booking</p>
            </div>
          </div>

          {/* Cart indicator */}
          <button
            type="button"
            aria-label={`Cart — ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
            className="relative flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <ShoppingCart className="w-5 h-5 text-slate-300" aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="text-sm text-slate-300 hidden sm:inline">Cart</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Hero ── */}
        <section aria-labelledby="hero-heading" className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 border border-emerald-800 rounded-full text-emerald-400 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" aria-hidden="true" />
            Live Booking Available
          </div>
          <h2
            id="hero-heading"
            className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent mb-3"
          >
            Book Temple Offerings
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Select a temple, choose your vazhipadu, and complete your sacred booking in minutes.
          </p>
        </section>

        {/* ── Temple Selector ── */}
        <section aria-labelledby="temple-select-label" className="mb-8">
          <div className="max-w-lg mx-auto">
            <label
              id="temple-select-label"
              htmlFor="temple-select"
              className="block text-sm font-semibold text-slate-300 mb-2"
            >
              Select Temple
            </label>
            <div className="relative">
              <select
                id="temple-select"
                value={selectedTempleId ?? ''}
                onChange={(e) => setSelectedTempleId(e.target.value || null)}
                disabled={templesLoading}
                aria-describedby="temple-select-hint"
                className="w-full appearance-none bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-4 py-3.5 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-wait cursor-pointer"
              >
                <option value="">— Choose a temple —</option>
                {temples.map((temple) => (
                  <option key={temple.id} value={temple.id}>
                    {temple.name} ({temple.location})
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                aria-hidden="true"
              />
            </div>
            <p id="temple-select-hint" className="text-xs text-slate-500 mt-1.5">
              {templesLoading ? 'Loading temples…' : `${temples.length} temple${temples.length !== 1 ? 's' : ''} available`}
            </p>
          </div>

          {/* Selected temple description */}
          {selectedTemple && (
            <div className="max-w-lg mx-auto mt-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
              <p className="text-sm font-semibold text-emerald-400 mb-1">{selectedTemple.name}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{selectedTemple.description}</p>
            </div>
          )}
        </section>

        {/* ── Offerings List ── */}
        <OfferingsList templeId={selectedTempleId} onAddToCart={handleAddToCart} />
      </main>

      <footer className="mt-16 border-t border-slate-800 py-6 text-center text-xs text-slate-600">
        © 2026 Vazhipadu — Temple Offerings Booking Platform
      </footer>
    </div>
  );
}

export default App;
