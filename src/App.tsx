import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, BrowserRouter, useInRouterContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Landmark,
  ShoppingCart,
  ChevronDown,
  IndianRupee,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import type { Temple, Offering, Order, OfferingItem, Nakshatra } from './types/vazhipadu';
import { getTemples, createOrder } from './api/mockClient';
import { OfferingsList } from './components/OfferingsList';
import { useCart } from './hooks/useCart';
import { CartDrawer } from './components/CartDrawer';
import { OrderConfirmationCard } from './components/OrderConfirmationCard';
import { StaffPortal } from './components/StaffPortal';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import type { OrderFormValues } from './components/OrderForm';

function generateIdempotencyKey(): string {
  return `idem-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function AppContent() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const isStaffRoute = location.pathname.startsWith('/staff');

  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTempleId, setSelectedTempleId] = useState<string | null>(null);
  const [templesLoading, setTemplesLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart hook with localStorage persistence
  const cart = useCart();

  // Phase 3: Order submission, idempotency & confirmation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastSubmittedValues, setLastSubmittedValues] = useState<OrderFormValues | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState<string>(generateIdempotencyKey);

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

  function handleAddToCart(offering: Offering) {
    cart.addToCart(offering);
  }

  // Phase 3: Submit order with Double-Submit Prevention & Idempotency
  const handleOrderSubmit = useCallback(
    async (values: OrderFormValues) => {
      if (isSubmitting) return;

      setIsSubmitting(true);
      setSubmitError(null);
      setLastSubmittedValues(values);

      try {
        const effectiveTempleId =
          selectedTempleId ?? cart.items[0]?.offering.templeId ?? 'temple-1';

        const orderItems: OfferingItem[] = cart.items.map((i) => ({
          offeringId: i.offering.id,
          offeringName: i.offering.name,
          priceRupees: i.offering.priceRupees,
          quantity: i.quantity,
          devoteeName: values.devoteeName,
          nakshatra: values.nakshatra as Nakshatra,
          date: values.offeringDate,
        }));

        const newOrder = await createOrder({
          templeId: effectiveTempleId,
          devoteeName: values.devoteeName,
          phone: values.phone,
          nakshatra: values.nakshatra as Nakshatra,
          offeringDate: values.offeringDate,
          items: orderItems,
          idempotencyKey,
        });

        // Success flow:
        setConfirmedOrder(newOrder);
        cart.clearCart(); // Automatically empty cart on confirmed order
        setIsCartOpen(false); // Close cart drawer
        setIdempotencyKey(generateIdempotencyKey()); // Renew key for next booking
      } catch (err) {
        // Failure flow:
        const message =
          err instanceof Error
            ? err.message
            : 'A transient network error occurred while placing the order. Please retry.';
        setSubmitError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [cart, isSubmitting, selectedTempleId, idempotencyKey],
  );

  const handleRetry = useCallback(() => {
    if (lastSubmittedValues) {
      void handleOrderSubmit(lastSubmittedValues);
    }
  }, [lastSubmittedValues, handleOrderSubmit]);

  const handleBookAnother = useCallback(() => {
    setConfirmedOrder(null);
    setSubmitError(null);
    setLastSubmittedValues(null);
  }, []);

  const selectedTemple = temples.find((t) => t.id === selectedTempleId) ?? null;
  const confirmedTemple = confirmedOrder
    ? temples.find((t) => t.id === confirmedOrder.templeId)?.name
    : undefined;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 relative overflow-x-hidden">
      {/* ── Skip to Main Content (Accessibility) ── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-3 focus:left-3 px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        {t('skipToContent')}
      </a>

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Landmark className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 leading-snug">{t('appName')}</h1>
              <p className="text-xs text-slate-400 mt-0.5 leading-normal">{t('appSubtitle')}</p>
            </div>
          </div>

          {/* Navigation Tabs: Devotee Booking vs Staff Orders */}
          <nav
            role="tablist"
            className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80"
            aria-label="Portal Navigation"
          >
            <button
              role="tab"
              type="button"
              id="tab-devotee-booking"
              aria-selected={!isStaffRoute}
              aria-controls="main-content"
              onClick={() => navigate('/')}
              className={`min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                !isStaffRoute
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t('devoteeBooking')}</span>
            </button>
            <button
              role="tab"
              type="button"
              id="tab-staff-orders"
              aria-selected={isStaffRoute}
              aria-controls="main-content"
              onClick={() => navigate('/staff/orders')}
              className={`min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                isStaffRoute
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t('staffOrders')}</span>
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {/* Language Switcher (English / Malayalam) */}
            <LanguageSwitcher />

            {/* Cart trigger button (visible on devotee view) */}
            {!isStaffRoute && (
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                aria-label={`Open shopping cart — ${cart.totalItems} item${cart.totalItems !== 1 ? 's' : ''}`}
                className="min-h-[44px] relative flex items-center gap-2.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-sm"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                  {cart.totalItems > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 min-w-5 h-5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                      {cart.totalItems}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="text-slate-200 font-medium hidden sm:inline">{t('cart')}</span>
                  {cart.totalAmount > 0 && (
                    <span className="hidden sm:inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                      <IndianRupee className="w-3 h-3" aria-hidden="true" />
                      {cart.totalAmount.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </button>
            )}
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 py-8 outline-none">
        {/* ── Route 1: Staff Orders & Offerings Management Portal ── */}
        {isStaffRoute ? (
          <StaffPortal />
        ) : confirmedOrder ? (
          /* ── Route 2: Order Confirmation View ── */
          <div className="max-w-2xl mx-auto mb-10" data-testid="confirmation-view">
            <OrderConfirmationCard
              order={confirmedOrder}
              templeName={confirmedTemple}
              onBookAnother={handleBookAnother}
            />
          </div>
        ) : (
          /* ── Route 3: Devotee Offerings Booking ── */
          <>
            {/* Hero */}
            <section aria-labelledby="hero-heading" className="mb-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 border border-emerald-800 rounded-full text-emerald-400 text-xs font-medium mb-4">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" aria-hidden="true" />
                {t('liveBookingBadge')}
              </div>
              <h2
                id="hero-heading"
                className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent mb-3 inline-block py-2 pb-5 leading-[1.3] sm:leading-[1.35] max-w-full"
              >
                {t('heroTitle')}
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                {t('heroSubtitle')}
              </p>
            </section>

            {/* Temple Selector */}
            <section aria-labelledby="temple-select-label" className="mb-8">
              <div className="max-w-lg mx-auto">
                <label
                  id="temple-select-label"
                  htmlFor="temple-select"
                  className="block text-sm font-semibold text-slate-300 mb-2"
                >
                  {t('selectTemple')}
                </label>
                <div className="relative">
                  <select
                    id="temple-select"
                    value={selectedTempleId ?? ''}
                    onChange={(e) => setSelectedTempleId(e.target.value || null)}
                    disabled={templesLoading}
                    aria-describedby="temple-select-hint"
                    className="w-full min-h-[44px] appearance-none bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-slate-900 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-wait cursor-pointer"
                  >
                    <option value="">{t('chooseTemplePlaceholder')}</option>
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
                  {templesLoading ? t('loadingTemples') : t('templesAvailable', { count: temples.length })}
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

            {/* Offerings List */}
            <OfferingsList templeId={selectedTempleId} onAddToCart={handleAddToCart} />
          </>
        )}
      </main>

      {/* Floating Cart Bar when cart has items and drawer & confirmation & staff are closed */}
      {!isStaffRoute && cart.totalItems > 0 && !isCartOpen && !confirmedOrder && (
        <div className="fixed bottom-6 inset-x-0 z-30 flex justify-center px-4 pointer-events-none">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="pointer-events-auto min-h-[44px] flex items-center justify-between gap-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-full shadow-2xl shadow-emerald-950/60 border border-emerald-400/30 transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" aria-hidden="true" />
              <span>{cart.totalItems} offering{cart.totalItems !== 1 ? 's' : ''} in cart</span>
            </div>
            <div className="flex items-center gap-1 bg-emerald-700/80 px-2.5 py-1 rounded-full text-sm">
              <IndianRupee className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{cart.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </button>
        </div>
      )}

      {/* Cart Drawer & Checkout */}
      <CartDrawer
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderSubmit={handleOrderSubmit}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onRetry={handleRetry}
      />

      <footer className="mt-16 border-t border-slate-800 py-6 text-center text-xs text-slate-600">
        © 2026 Vazhipadu — Temple Offerings Booking Platform
      </footer>
    </div>
  );
}

export function App() {
  const inRouter = useInRouterContext();
  if (!inRouter) {
    return (
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    );
  }
  return <AppContent />;
}

export default App;
