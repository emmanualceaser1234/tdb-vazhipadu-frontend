import { useState, useEffect, useCallback, useId } from 'react';
import {
  Tag,
  IndianRupee,
  Edit2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  AlertCircle,
} from 'lucide-react';
import type { Offering, Temple } from '../types/vazhipadu';
import { getAllOfferings, updateOffering, getTemples } from '../api/mockClient';

// ─── Edit Modal ───────────────────────────────────────────────────────────────
interface EditOfferingModalProps {
  offering: Offering | null;
  isOpen: boolean;
  isSaving: boolean;
  onSave: (id: string, updates: Partial<Offering>) => Promise<void>;
  onClose: () => void;
}

function EditOfferingModal({
  offering,
  isOpen,
  isSaving,
  onSave,
  onClose,
}: EditOfferingModalProps) {
  const uid = useId();
  const [name, setName] = useState('');
  const [priceRupees, setPriceRupees] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync state when offering opens
  useEffect(() => {
    if (offering) {
      setName(offering.name);
      setPriceRupees(String(offering.priceRupees));
      setCategory(offering.category);
      setDescription(offering.description);
      setIsActive(offering.isActive);
      setFormError(null);
    }
  }, [offering]);

  if (!isOpen || !offering) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Offering name is required.');
      return;
    }
    const parsedPrice = parseInt(priceRupees, 10);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError('Please enter a valid price greater than 0.');
      return;
    }

    try {
      await onSave(offering!.id, {
        name: name.trim(),
        priceRupees: parsedPrice,
        category: category.trim() || 'General',
        description: description.trim(),
        isActive,
      });
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update offering.';
      setFormError(msg);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-offering-title"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400">
            <Edit2 className="w-5 h-5" aria-hidden="true" />
            <h3 id="edit-offering-title" className="text-lg font-bold text-slate-100">
              Modify Offering Details
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm font-bold p-1 rounded focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            ✕
          </button>
        </div>

        {formError && (
          <div
            role="alert"
            className="p-3 bg-red-950/80 border border-red-700 text-red-300 text-xs rounded-xl flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Offering Name */}
          <div>
            <label
              htmlFor={`${uid}-name`}
              className="block text-xs font-semibold text-slate-300 mb-1"
            >
              Offering Name <span className="text-red-400">*</span>
            </label>
            <input
              id={`${uid}-name`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-slate-900"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Price in Rupees */}
            <div>
              <label
                htmlFor={`${uid}-price`}
                className="block text-xs font-semibold text-slate-300 mb-1"
              >
                Price (₹ INR) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id={`${uid}-price`}
                  type="number"
                  min={1}
                  value={priceRupees}
                  onChange={(e) => setPriceRupees(e.target.value)}
                  className="w-full min-h-[44px] pl-9 pr-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-slate-900"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor={`${uid}-category`}
                className="block text-xs font-semibold text-slate-300 mb-1"
              >
                Category
              </label>
              <input
                id={`${uid}-category`}
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Archana, Special, Payasam"
                className="w-full min-h-[44px] px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-slate-900"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor={`${uid}-desc`}
              className="block text-xs font-semibold text-slate-300 mb-1"
            >
              Description & Ritual Details
            </label>
            <textarea
              id={`${uid}-desc`}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-slate-900 resize-none"
            />
          </div>

          {/* Offering Active Status Toggle */}
          <div className="p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-xl flex items-center justify-between">
            <div>
              <label htmlFor={`${uid}-active`} className="text-sm font-semibold text-slate-200 block cursor-pointer">
                Booking Availability
              </label>
              <p className="text-xs text-slate-400">
                {isActive ? 'Available for devotee bookings' : 'Hidden from devotee booking selection'}
              </p>
            </div>
            <button
              id={`${uid}-active`}
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive((prev) => !prev)}
              className={`min-w-[48px] h-7 flex items-center rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                isActive ? 'bg-emerald-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                  isActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="min-h-[44px] px-4 py-2 text-sm font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="min-h-[44px] px-5 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-emerald-950/40"
            >
              {isSaving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Staff Offerings Manager Component ───────────────────────────────────
export function StaffOfferingsManager() {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTempleFilter, setSelectedTempleFilter] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Edit modal state
  const [editingOffering, setEditingOffering] = useState<Offering | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [templeList, offeringList] = await Promise.all([
        getTemples(),
        getAllOfferings(),
      ]);
      setTemples(templeList);
      setOfferings(offeringList);
    } catch {
      // degrade
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Handle saving updates to an offering
  async function handleSaveOffering(id: string, updates: Partial<Offering>) {
    setIsSaving(true);
    try {
      const updated = await updateOffering(id, updates);
      setOfferings((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setFeedback(`Successfully updated "${updated.name}" (Price: ₹${updated.priceRupees}, Status: ${updated.isActive ? 'Active' : 'Inactive'}).`);
    } finally {
      setIsSaving(false);
    }
  }

  // Quick toggle active state
  async function handleToggleActive(offering: Offering) {
    try {
      const updated = await updateOffering(offering.id, { isActive: !offering.isActive });
      setOfferings((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setFeedback(`"${updated.name}" is now marked as ${updated.isActive ? 'Active' : 'Inactive'}.`);
    } catch {
      setFeedback('Failed to update status.');
    }
  }

  // Filtered offerings
  const filteredOfferings = offerings.filter((o) => {
    const matchesTemple = selectedTempleFilter === 'ALL' || o.templeId === selectedTempleFilter;
    const matchesSearch =
      !searchFilter.trim() ||
      o.name.toLowerCase().includes(searchFilter.trim().toLowerCase()) ||
      o.category.toLowerCase().includes(searchFilter.trim().toLowerCase());
    return matchesTemple && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* ── Subheader & Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-400" aria-hidden="true" />
            <span>Manage Temple Offerings</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Edit offering names, prices, descriptions, and toggle booking availability
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-xl font-medium">
            Total: <strong className="text-emerald-400">{filteredOfferings.length}</strong>
          </span>
          <button
            type="button"
            onClick={() => void loadData()}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600"
            aria-label="Reload offerings"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ── Feedback Banner ── */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="p-3.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center justify-between shadow-md"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
            <span>{feedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-emerald-400 hover:text-emerald-200 text-xs font-bold"
            aria-label="Dismiss feedback"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg">
        {/* Temple Filter */}
        <div>
          <label htmlFor="staff-offering-temple" className="block text-xs font-semibold text-slate-400 mb-1">
            Filter by Temple
          </label>
          <select
            id="staff-offering-temple"
            value={selectedTempleFilter}
            onChange={(e) => setSelectedTempleFilter(e.target.value)}
            className="w-full min-h-[44px] px-3.5 py-2 bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
          >
            <option value="ALL">All Temples</option>
            {temples.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div>
          <label htmlFor="staff-offering-search" className="block text-xs font-semibold text-slate-400 mb-1">
            Search Offering
          </label>
          <div className="relative">
            <input
              id="staff-offering-search"
              type="search"
              placeholder="Filter by name or category…"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full min-h-[44px] pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder-slate-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Offerings Table ── */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" aria-label="Staff Offerings Management Table">
            <thead className="bg-slate-900/90 border-b border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3.5">Offering Name</th>
                <th scope="col" className="px-4 py-3.5">Category</th>
                <th scope="col" className="px-4 py-3.5">Price</th>
                <th scope="col" className="px-4 py-3.5">Status</th>
                <th scope="col" className="px-4 py-3.5">Description</th>
                <th scope="col" className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    Loading offerings…
                  </td>
                </tr>
              )}

              {!isLoading && filteredOfferings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    No offerings found matching filters
                  </td>
                </tr>
              )}

              {filteredOfferings.map((offering) => (
                <tr key={offering.id} className="hover:bg-slate-800/50 transition-colors">
                  {/* Name */}
                  <td className="px-4 py-3.5 font-bold text-slate-100">
                    {offering.name}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs bg-slate-900 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-md font-medium">
                      {offering.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3.5 font-mono font-bold text-emerald-400">
                    <span className="flex items-center gap-0.5">
                      <IndianRupee className="w-3.5 h-3.5" aria-hidden="true" />
                      {offering.priceRupees.toLocaleString('en-IN')}
                    </span>
                  </td>

                  {/* Status Toggle Badge */}
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => void handleToggleActive(offering)}
                      className={`min-h-[44px] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                        offering.isActive
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 hover:bg-emerald-900'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-750'
                      }`}
                      aria-label={`Toggle status for ${offering.name}`}
                    >
                      {offering.isActive ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Inactive</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Description */}
                  <td className="px-4 py-3.5 text-xs text-slate-400 max-w-xs truncate" title={offering.description}>
                    {offering.description}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setEditingOffering(offering)}
                      className="min-h-[44px] px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-600/40 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ml-auto focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      aria-label={`Edit ${offering.name}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Modify</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <EditOfferingModal
        offering={editingOffering}
        isOpen={!!editingOffering}
        isSaving={isSaving}
        onSave={handleSaveOffering}
        onClose={() => setEditingOffering(null)}
      />
    </div>
  );
}
