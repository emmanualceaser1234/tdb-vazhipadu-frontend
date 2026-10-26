import { useState, useId } from 'react';
import { Calendar, Phone, User, Star, AlertCircle } from 'lucide-react';
import type { Nakshatra } from '../types/vazhipadu';
import { ALL_NAKSHATRAS } from '../types/vazhipadu';

// ─── Form types ───────────────────────────────────────────────────────────────
export interface OrderFormValues {
  devoteeName: string;
  phone: string;
  nakshatra: Nakshatra | '';
  offeringDate: string;
}

export interface OrderFormErrors {
  devoteeName?: string;
  phone?: string;
  nakshatra?: string;
  offeringDate?: string;
}

interface OrderFormProps {
  onSubmit: (values: OrderFormValues) => void;
  isSubmitting: boolean;
  submitError: string | null;
}

// ─── Validation ───────────────────────────────────────────────────────────────
export function getTodayISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function validateForm(values: OrderFormValues): OrderFormErrors {
  const errors: OrderFormErrors = {};

  if (!values.devoteeName.trim()) {
    errors.devoteeName = 'Devotee name is required.';
  } else if (values.devoteeName.trim().length < 2) {
    errors.devoteeName = 'Name must be at least 2 characters.';
  }

  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!/^\d{10}$/.test(values.phone.trim())) {
    errors.phone = 'Enter a valid 10-digit Indian phone number.';
  }

  if (!values.nakshatra) {
    errors.nakshatra = 'Please select your birth star (Nakshatra).';
  }

  if (!values.offeringDate) {
    errors.offeringDate = 'Offering date is required.';
  } else if (values.offeringDate < getTodayISO()) {
    errors.offeringDate = 'Date cannot be in the past.';
  }

  return errors;
}

// ─── Inline field error ───────────────────────────────────────────────────────
function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400">
      <AlertCircle className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function OrderForm({ onSubmit, isSubmitting, submitError }: OrderFormProps) {
  const uid = useId();

  const [values, setValues] = useState<OrderFormValues>({
    devoteeName: '',
    phone: '',
    nakshatra: '',
    offeringDate: '',
  });

  const [touched, setTouched] = useState<Record<keyof OrderFormValues, boolean>>({
    devoteeName: false,
    phone: false,
    nakshatra: false,
    offeringDate: false,
  });

  const errors = validateForm(values);
  const hasErrors = Object.keys(errors).length > 0;

  function handleChange(field: keyof OrderFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (field === 'offeringDate' && value) {
      setTouched((prev) => ({ ...prev, offeringDate: true }));
    }
  }

  function handleBlur(field: keyof OrderFormValues) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Touch all fields to reveal all errors
    setTouched({ devoteeName: true, phone: true, nakshatra: true, offeringDate: true });
    if (hasErrors) return;
    onSubmit(values);
  }

  const fieldClass = (field: keyof OrderFormValues) => {
    const isInvalid = touched[field] && !!errors[field];
    return `w-full px-4 py-3 bg-slate-800 border rounded-xl text-slate-100 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
      isInvalid
        ? 'border-red-500 focus:ring-red-500'
        : 'border-slate-700 focus:ring-emerald-500 focus:border-transparent'
    }`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Order details form"
      className="space-y-5"
    >
      {/* Submit error banner */}
      {submitError && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-3 bg-red-950 border border-red-700 text-red-300 rounded-xl px-4 py-3 text-sm"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p>{submitError}</p>
        </div>
      )}

      {/* Devotee Name */}
      <div>
        <label
          htmlFor={`${uid}-name`}
          className="block text-sm font-semibold text-slate-300 mb-1.5"
        >
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            Devotee Name <span className="text-red-400">*</span>
          </span>
        </label>
        <input
          id={`${uid}-name`}
          type="text"
          autoComplete="name"
          placeholder="e.g. Arjun Menon"
          value={values.devoteeName}
          onChange={(e) => handleChange('devoteeName', e.target.value)}
          onBlur={() => handleBlur('devoteeName')}
          aria-required="true"
          aria-invalid={touched.devoteeName && !!errors.devoteeName}
          aria-describedby={errors.devoteeName ? `${uid}-name-error` : undefined}
          className={fieldClass('devoteeName')}
        />
        <FieldError id={`${uid}-name-error`} message={touched.devoteeName ? errors.devoteeName : undefined} />
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor={`${uid}-phone`}
          className="block text-sm font-semibold text-slate-300 mb-1.5"
        >
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            Phone Number <span className="text-red-400">*</span>
          </span>
        </label>
        <input
          id={`${uid}-phone`}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="10-digit mobile number"
          maxLength={10}
          value={values.phone}
          onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, ''))}
          onBlur={() => handleBlur('phone')}
          aria-required="true"
          aria-invalid={touched.phone && !!errors.phone}
          aria-describedby={errors.phone ? `${uid}-phone-error` : undefined}
          className={fieldClass('phone')}
        />
        <FieldError id={`${uid}-phone-error`} message={touched.phone ? errors.phone : undefined} />
      </div>

      {/* Nakshatra */}
      <div>
        <label
          htmlFor={`${uid}-nakshatra`}
          className="block text-sm font-semibold text-slate-300 mb-1.5"
        >
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            Birth Star (Nakshatra) <span className="text-red-400">*</span>
          </span>
        </label>
        <select
          id={`${uid}-nakshatra`}
          value={values.nakshatra}
          onChange={(e) => handleChange('nakshatra', e.target.value)}
          onBlur={() => handleBlur('nakshatra')}
          aria-required="true"
          aria-invalid={touched.nakshatra && !!errors.nakshatra}
          aria-describedby={errors.nakshatra ? `${uid}-nakshatra-error` : undefined}
          className={`${fieldClass('nakshatra')} appearance-none cursor-pointer`}
        >
          <option value="">— Select your Nakshatra —</option>
          {ALL_NAKSHATRAS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <FieldError id={`${uid}-nakshatra-error`} message={touched.nakshatra ? errors.nakshatra : undefined} />
      </div>

      {/* Offering Date */}
      <div>
        <label
          htmlFor={`${uid}-date`}
          className="block text-sm font-semibold text-slate-300 mb-1.5"
        >
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            Date of Offering <span className="text-red-400">*</span>
          </span>
        </label>
        <input
          id={`${uid}-date`}
          type="date"
          min={getTodayISO()}
          value={values.offeringDate}
          onChange={(e) => handleChange('offeringDate', e.target.value)}
          onBlur={() => handleBlur('offeringDate')}
          aria-required="true"
          aria-invalid={touched.offeringDate && !!errors.offeringDate}
          aria-describedby={errors.offeringDate ? `${uid}-date-error` : `${uid}-date-hint`}
          className={`${fieldClass('offeringDate')} [color-scheme:dark]`}
        />
        {!errors.offeringDate && (
          <p id={`${uid}-date-hint`} className="text-xs text-slate-500 mt-1.5">
            Today or any future date
          </p>
        )}
        <FieldError id={`${uid}-date-error`} message={touched.offeringDate ? errors.offeringDate : undefined} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-900/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <span
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
              aria-hidden="true"
            />
            Placing Order…
          </>
        ) : (
          'Place Order'
        )}
      </button>
    </form>
  );
}
