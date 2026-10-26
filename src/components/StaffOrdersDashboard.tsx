import { useState, useEffect, useCallback, useId } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  RefreshCw,
} from 'lucide-react';
import type { Order, OrderStatus, PaginatedResult } from '../types/vazhipadu';
import { getOrders, cancelOrder } from '../api/mockClient';

// ─── Status Badge Component ───────────────────────────────────────────────────
interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'CONFIRMED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
        <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
        CONFIRMED
      </span>
    );
  }

  if (status === 'CANCELLED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-400 border border-rose-800/80">
        <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
        CANCELLED
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/80">
      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
      PENDING
    </span>
  );
}

// ─── Cancel Order Modal ───────────────────────────────────────────────────────
interface CancelModalProps {
  order: Order | null;
  isOpen: boolean;
  isCancelling: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

function CancelModal({
  order,
  isOpen,
  isCancelling,
  onConfirm,
  onClose,
}: CancelModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-modal-title"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-rose-400">
          <div className="w-10 h-10 rounded-full bg-rose-950/80 border border-rose-800 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 id="cancel-modal-title" className="text-lg font-bold text-slate-100">
              Cancel Vazhipadu Order
            </h3>
            <p className="text-xs text-slate-400">This action will cancel the booking.</p>
          </div>
        </div>

        <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1.5 text-xs text-slate-300">
          <p>
            <strong className="text-slate-400">Order Number:</strong>{' '}
            <span className="font-mono text-slate-200">{order.orderNumber}</span>
          </p>
          <p>
            <strong className="text-slate-400">Devotee:</strong> {order.devoteeName} ({order.phone})
          </p>
          <p>
            <strong className="text-slate-400">Offering Date:</strong> {order.offeringDate}
          </p>
          <p>
            <strong className="text-slate-400">Amount:</strong> ₹
            {order.totalAmount.toLocaleString('en-IN')}
          </p>
        </div>

        <p className="text-xs text-slate-400">
          Are you sure you want to cancel this order? The devotee booking status will be updated immediately.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isCancelling}
            className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            Keep Order
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isCancelling}
            className="px-4 py-2 text-sm font-semibold bg-rose-600 hover:bg-rose-500 disabled:bg-slate-700 text-white rounded-xl transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-lg shadow-rose-950/40"
          >
            {isCancelling ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Cancelling…
              </>
            ) : (
              'Confirm Cancellation'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function StaffOrdersDashboard() {
  const uid = useId();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL search params
  const statusParam = (searchParams.get('status') as OrderStatus | 'ALL') || 'ALL';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const phoneParam = searchParams.get('phone') || '';
  const dateParam = searchParams.get('date') || '';

  // Data state
  const [ordersResult, setOrdersResult] = useState<PaginatedResult<Order>>({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Cancellation state
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);

  // Fetch orders from mock client
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const result = await getOrders({
        status: statusParam,
        page: pageParam,
        limit: 10,
        phone: phoneParam || undefined,
        dateFrom: dateParam || undefined,
        dateTo: dateParam || undefined,
      });
      setOrdersResult(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load orders.';
      setFetchError(message);
    } finally {
      setIsLoading(false);
    }
  }, [statusParam, pageParam, phoneParam, dateParam]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  // Update URL params helper
  const updateQuery = useCallback(
    (updates: { status?: string; page?: number; phone?: string; date?: string }) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        if (updates.status !== undefined) {
          if (updates.status === 'ALL') {
            next.delete('status');
          } else {
            next.set('status', updates.status);
          }
        }

        if (updates.phone !== undefined) {
          if (!updates.phone) {
            next.delete('phone');
          } else {
            next.set('phone', updates.phone);
          }
        }

        if (updates.date !== undefined) {
          if (!updates.date) {
            next.delete('date');
          } else {
            next.set('date', updates.date);
          }
        }

        if (updates.page !== undefined) {
          next.set('page', String(updates.page));
        }

        return next;
      });
    },
    [setSearchParams],
  );

  // Filter change handlers (automatically reset page to 1)
  function handleStatusChange(newStatus: string) {
    updateQuery({ status: newStatus, page: 1 });
  }

  function handlePhoneChange(newPhone: string) {
    updateQuery({ phone: newPhone, page: 1 });
  }

  function handleDateChange(newDate: string) {
    updateQuery({ date: newDate, page: 1 });
  }

  function handleResetFilters() {
    setSearchParams(new URLSearchParams());
  }

  function handlePageChange(newPage: number) {
    updateQuery({ page: newPage });
  }

  // Cancel order execution
  async function handleConfirmCancel() {
    if (!orderToCancel) return;
    setIsCancelling(true);
    try {
      const updated = await cancelOrder(orderToCancel.id);
      // Dynamically update local state without full reload
      setOrdersResult((prev) => ({
        ...prev,
        data: prev.data.map((o) => (o.id === updated.id ? updated : o)),
      }));
      setCancelFeedback(`Order ${updated.orderNumber} successfully cancelled.`);
      setOrderToCancel(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel order.';
      setCancelFeedback(`Error: ${message}`);
    } finally {
      setIsCancelling(false);
    }
  }

  const { data: orders, total, page, totalPages } = ordersResult;

  return (
    <div className="space-y-6">
      {/* ── Dashboard Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Staff Orders Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage, filter, and review devotee vazhipadu bookings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-xl font-medium">
            Total Orders: <strong className="text-emerald-400">{total}</strong>
          </span>
          <button
            type="button"
            onClick={() => void fetchOrders()}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Refresh orders"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ── Feedback Notification ── */}
      {cancelFeedback && (
        <div
          role="status"
          aria-live="polite"
          className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center justify-between shadow-md"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
            <span>{cancelFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setCancelFeedback(null)}
            className="text-emerald-400 hover:text-emerald-200 text-xs font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Filters Bar ── */}
      <section
        aria-labelledby="filters-heading"
        className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 id="filters-heading" className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Filter & Search</span>
          </h3>
          {(statusParam !== 'ALL' || phoneParam || dateParam || pageParam !== 1) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Status Filter */}
          <div>
            <label
              htmlFor={`${uid}-status`}
              className="block text-xs font-semibold text-slate-400 mb-1"
            >
              Filter by Status
            </label>
            <select
              id={`${uid}-status`}
              value={statusParam}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="PENDING">PENDING</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label
              htmlFor={`${uid}-date`}
              className="block text-xs font-semibold text-slate-400 mb-1"
            >
              Filter by Date
            </label>
            <div className="relative">
              <input
                id={`${uid}-date`}
                type="date"
                value={dateParam}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 [color-scheme:dark]"
              />
              {dateParam && (
                <button
                  type="button"
                  onClick={() => handleDateChange('')}
                  aria-label="Clear date filter"
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Phone Search */}
          <div>
            <label
              htmlFor={`${uid}-phone`}
              className="block text-xs font-semibold text-slate-400 mb-1"
            >
              Search by Phone
            </label>
            <div className="relative">
              <input
                id={`${uid}-phone`}
                type="tel"
                placeholder="e.g. 9876543210"
                value={phoneParam}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"
              />
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              {phoneParam && (
                <button
                  type="button"
                  onClick={() => handlePhoneChange('')}
                  aria-label="Clear phone search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Error Banner ── */}
      {fetchError && (
        <div
          role="alert"
          className="p-4 bg-red-950 border border-red-700 rounded-xl text-red-200 text-sm flex items-center justify-between"
        >
          <span>{fetchError}</span>
          <button
            type="button"
            onClick={() => void fetchOrders()}
            className="px-3 py-1 bg-red-800 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ── Table View ── */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" aria-label="Staff Orders Table">
            <thead className="bg-slate-900/90 border-b border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3.5">
                  Order ID
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Date
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Devotee Name
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Phone
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Offerings Summary
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Total Price
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Status
                </th>
                <th scope="col" className="px-4 py-3.5 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80">
              {isLoading && orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                      <span>Loading orders…</span>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading && orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-300 mb-1">No orders found</p>
                    <p className="text-xs">Try adjusting your status, date, or phone search filters</p>
                  </td>
                </tr>
              )}

              {orders.map((order) => {
                const offeringsSummary = order.items
                  .map((i) => `${i.quantity} x ${i.offeringName}`)
                  .join(', ');

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Order ID */}
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-emerald-400">
                      {order.orderNumber}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                        <span>{order.offeringDate}</span>
                      </div>
                    </td>

                    {/* Devotee */}
                    <td className="px-4 py-3.5 font-medium text-slate-200">
                      <div>{order.devoteeName}</div>
                      <div className="text-xs text-amber-400/80">{order.nakshatra}</div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3.5 text-xs text-slate-300 font-mono">
                      {order.phone}
                    </td>

                    {/* Offerings Summary */}
                    <td className="px-4 py-3.5 text-xs text-slate-300 max-w-xs truncate" title={offeringsSummary}>
                      {offeringsSummary}
                    </td>

                    {/* Total Price */}
                    <td className="px-4 py-3.5 font-bold text-slate-100">
                      <span className="flex items-center gap-0.5">
                        <IndianRupee className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                        {order.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      {order.status !== 'CANCELLED' ? (
                        <button
                          type="button"
                          onClick={() => setOrderToCancel(order)}
                          className="px-2.5 py-1 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-600 border border-rose-800/60 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400"
                          aria-label={`Cancel Order ${order.orderNumber}`}
                        >
                          Cancel Order
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Cancelled</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3.5 bg-slate-900/90 border-t border-slate-700 text-xs text-slate-400">
          <div>
            Showing <strong className="text-slate-200">{orders.length > 0 ? (page - 1) * 10 + 1 : 0}</strong> to{' '}
            <strong className="text-slate-200">{Math.min(page * 10, total)}</strong> of{' '}
            <strong className="text-slate-200">{total}</strong> orders
          </div>

          <div className="flex items-center gap-2">
            <span className="mr-2">
              Page <strong className="text-slate-200">{page}</strong> of{' '}
              <strong className="text-slate-200">{totalPages}</strong>
            </span>

            <button
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1 || isLoading}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages || isLoading}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Cancel Order Dialog ── */}
      <CancelModal
        order={orderToCancel}
        isOpen={!!orderToCancel}
        isCancelling={isCancelling}
        onConfirm={() => void handleConfirmCancel()}
        onClose={() => setOrderToCancel(null)}
      />
    </div>
  );
}
