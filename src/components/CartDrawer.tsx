import { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart, IndianRupee, ArrowLeft, ArrowRight } from 'lucide-react';
import type { UseCartResult } from '../hooks/useCart';
import { OrderForm, type OrderFormValues } from './OrderForm';

interface CartDrawerProps {
  cart: UseCartResult;
  isOpen: boolean;
  onClose: () => void;
  onOrderSubmit?: (values: OrderFormValues) => void;
  isSubmitting?: boolean;
  submitError?: string | null;
  onRetry?: () => void;
}

export function CartDrawer({
  cart,
  isOpen,
  onClose,
  onOrderSubmit,
  isSubmitting = false,
  submitError = null,
  onRetry,
}: CartDrawerProps) {
  const [view, setView] = useState<'cart' | 'checkout'>('cart');
  const { items, totalAmount, totalItems, incrementItem, decrementItem, removeItem } = cart;

  // Reset view to 'cart' when closed or empty
  useEffect(() => {
    if (!isOpen || items.length === 0) {
      setView('cart');
    }
  }, [isOpen, items.length]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Generate formula breakdown: e.g., "2 Pushpanjali @ ₹30 + 1 Archana @ ₹50"
  const formulaBreakdown = items
    .map((i) => `${i.quantity} ${i.offering.name} @ ₹${i.offering.priceRupees}`)
    .join(' + ');

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        id="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={view === 'cart' ? 'Shopping cart' : 'Order details checkout'}
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            {view === 'checkout' ? (
              <button
                type="button"
                onClick={() => setView('cart')}
                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded p-1"
                aria-label="Back to Cart Items"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Back to Cart</span>
              </button>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                <h2 className="text-lg font-bold text-slate-100">Offering Cart</h2>
                {totalItems > 0 && (
                  <span className="text-xs font-semibold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-500 px-6">
            <ShoppingCart className="w-14 h-14 text-slate-700" aria-hidden="true" />
            <p className="font-medium text-slate-400">Your cart is empty</p>
            <p className="text-sm text-center">Add offerings from the temple list to get started</p>
          </div>
        )}

        {/* View 1: Cart Items */}
        {items.length > 0 && view === 'cart' && (
          <>
            <ul className="flex-1 overflow-y-auto px-4 py-3 space-y-3" aria-label="Cart items">
              {items.map((item) => {
                const lineTotal = item.offering.priceRupees * item.quantity;
                return (
                  <li
                    key={item.offering.id}
                    className="bg-slate-800 rounded-xl p-4 border border-slate-700"
                  >
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-100 truncate">
                          {item.offering.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          ₹{item.offering.priceRupees.toLocaleString('en-IN')} each
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.offering.id)}
                        aria-label={`Remove ${item.offering.name} from cart`}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity controls */}
                      <div
                        className="flex items-center gap-2"
                        role="group"
                        aria-label={`Quantity for ${item.offering.name}`}
                      >
                        <button
                          type="button"
                          onClick={() => decrementItem(item.offering.id)}
                          aria-label={`Decrease quantity of ${item.offering.name}`}
                          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-slate-800"
                        >
                          <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <span
                          className="w-7 text-center text-sm font-bold text-slate-100"
                          aria-live="polite"
                          aria-label={`Quantity: ${item.quantity}`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => incrementItem(item.offering.id)}
                          aria-label={`Increase quantity of ${item.offering.name}`}
                          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-slate-800"
                        >
                          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      {/* Line total */}
                      <div className="flex items-center gap-0.5 text-emerald-400 font-bold text-sm">
                        <IndianRupee className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{lineTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Footer total & actions */}
            <div className="px-5 py-4 border-t border-slate-800 bg-slate-900/95 space-y-3">
              {/* Itemized Calculation Summary */}
              <div className="p-3 bg-slate-800/80 border border-slate-700/60 rounded-lg text-xs text-slate-400">
                <span className="text-slate-500 font-medium block mb-1">Itemized Breakdown:</span>
                <p className="font-mono text-slate-300 truncate" title={formulaBreakdown}>
                  {formulaBreakdown}
                </p>
              </div>

              {/* Grand Total */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-sm font-semibold text-slate-300">Grand Total</span>
                  <p className="text-xs text-slate-500">
                    {totalItems} item{totalItems !== 1 ? 's' : ''} in cart
                  </p>
                </div>
                <div className="flex items-center gap-0.5 text-xl font-bold text-emerald-400">
                  <IndianRupee className="w-5 h-5" aria-hidden="true" />
                  <span aria-label={`Grand total ${totalAmount} rupees`}>
                    {totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Proceed to checkout button */}
              <button
                type="button"
                onClick={() => setView('checkout')}
                className="w-full min-h-[44px] py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-emerald-900/20"
              >
                <span>Proceed to Devotee Details</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </>
        )}

        {/* View 2: Devotee & Booking Details (OrderForm) */}
        {items.length > 0 && view === 'checkout' && (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* Order summary banner */}
            <div className="flex items-center justify-between p-3.5 bg-slate-800/90 border border-emerald-900/40 rounded-xl">
              <div>
                <p className="text-xs text-slate-400">Total Booking Amount</p>
                <div className="flex items-center gap-0.5 text-lg font-bold text-emerald-400">
                  <IndianRupee className="w-4 h-4" aria-hidden="true" />
                  <span>{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <span className="text-xs bg-emerald-950 border border-emerald-800 text-emerald-300 px-2.5 py-1 rounded-full font-medium">
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Order Form */}
            <OrderForm
              onSubmit={(vals) => {
                if (onOrderSubmit) {
                  onOrderSubmit(vals);
                }
              }}
              isSubmitting={isSubmitting}
              submitError={submitError}
              onRetry={onRetry}
            />
          </div>
        )}
      </aside>
    </>
  );
}
