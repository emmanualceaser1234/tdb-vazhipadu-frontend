import { useTranslation } from 'react-i18next';
import { CheckCircle2, IndianRupee, Calendar, User, Phone, Star, Landmark, RotateCcw } from 'lucide-react';
import type { Order } from '../types/vazhipadu';

interface OrderConfirmationCardProps {
  order: Order;
  templeName?: string;
  onBookAnother: () => void;
}

export function OrderConfirmationCard({
  order,
  templeName,
  onBookAnother,
}: OrderConfirmationCardProps) {
  const { t } = useTranslation();
  const formattedDate = new Date(order.createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <section
      aria-labelledby="confirmation-heading"
      className="bg-slate-800/90 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 relative overflow-hidden"
    >
      {/* Decorative gradient glow */}
      <div
        className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Success Badge & Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-3 text-emerald-400">
          <CheckCircle2 className="w-9 h-9" aria-hidden="true" />
        </div>
        <div className="inline-block px-3 py-1 bg-emerald-950/80 border border-emerald-700/60 rounded-full text-emerald-300 text-xs font-semibold mb-2">
          Booking Confirmed
        </div>
        <h2
          id="confirmation-heading"
          className="text-2xl sm:text-3xl font-extrabold text-slate-100"
        >
          Vazhipadu Booked Successfully
        </h2>
        <p className="text-xs text-slate-400 mt-1">Booked on {formattedDate}</p>
      </div>

      {/* Order Number Highlight Card */}
      <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 text-center mb-6">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">
          Order Number
        </span>
        <p
          data-testid="order-number"
          className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 tracking-wide select-all"
        >
          {order.orderNumber}
        </p>
      </div>

      {/* Grid: Devotee & Temple Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Devotee Info */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 space-y-2.5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Devotee Details
          </h3>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2 text-slate-200 font-medium">
              <User className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
              <span>{order.devoteeName}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-xs">
              <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" aria-hidden="true" />
              <span>+91 {order.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-xs">
              <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" aria-hidden="true" />
              <span>Nakshatra: <strong className="text-slate-200">{order.nakshatra}</strong></span>
            </div>
          </div>
        </div>

        {/* Temple & Date Info */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 space-y-2.5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Temple & Date
          </h3>
          <div className="space-y-1.5 text-sm">
            {templeName && (
              <div className="flex items-center gap-2 text-slate-200 font-medium">
                <Landmark className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
                <span>{templeName}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-300 text-xs">
              <Calendar className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" aria-hidden="true" />
              <span>
                Offering Date: <strong className="text-slate-200">{order.offeringDate}</strong>
              </span>
            </div>
            <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span>Status: {order.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Offerings Itemized List */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Booked Offerings ({order.items.length})
        </h3>
        <ul className="space-y-2 bg-slate-900/60 border border-slate-700/60 rounded-xl p-3" aria-label="Booked offerings">
          {order.items.map((item) => {
            const lineTotal = item.priceRupees * item.quantity;
            return (
              <li
                key={item.offeringId}
                className="flex items-center justify-between py-1.5 border-b border-slate-800/80 last:border-b-0 text-sm"
              >
                <div>
                  <span className="font-medium text-slate-200">{item.offeringName}</span>
                  <span className="text-xs text-slate-400 ml-2">
                    (Qty: {item.quantity} × ₹{item.priceRupees})
                  </span>
                </div>
                <div className="flex items-center gap-0.5 text-slate-200 font-semibold">
                  <IndianRupee className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{lineTotal.toLocaleString('en-IN')}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Grand Total */}
      <div className="flex items-center justify-between p-4 bg-emerald-950/40 border border-emerald-800/40 rounded-xl mb-6">
        <span className="text-sm font-semibold text-slate-300">Total Amount Paid</span>
        <div className="flex items-center gap-1 text-2xl font-bold text-emerald-400">
          <IndianRupee className="w-5 h-5" aria-hidden="true" />
          <span>{order.totalAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Action: Book Another Offering */}
      <button
        type="button"
        onClick={onBookAnother}
        className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-emerald-900/30 active:scale-98"
      >
        <RotateCcw className="w-4 h-4" aria-hidden="true" />
        <span>{t('bookAnother')}</span>
      </button>
    </section>
  );
}
