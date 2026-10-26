import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import type { Offering } from '../types/vazhipadu';
import { ALL_NAKSHATRAS } from '../types/vazhipadu';
import { useCart } from '../hooks/useCart';
import { CartDrawer } from '../components/CartDrawer';
import { OrderForm, getTodayISO, validateForm } from '../components/OrderForm';

// ─── Test Fixtures ────────────────────────────────────────────────────────────
const mockOffering1: Offering = {
  id: 'off-1',
  templeId: 'temple-1',
  name: 'Pushpanjali',
  description: 'Special flower offering to the deity',
  priceRupees: 30,
  isActive: true,
  category: 'Archana',
};

const mockOffering2: Offering = {
  id: 'off-2',
  templeId: 'temple-1',
  name: 'Archana',
  description: 'Chanting of sacred names',
  priceRupees: 50,
  isActive: true,
  category: 'Special',
};

describe('Phase 2: Cart and Order Form', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ─── Test 1: Total Calculation ──────────────────────────────────────────────
  describe('Cart Total Calculation', () => {
    it('calculates total correctly: 2 x ₹30 + 1 x ₹50 = ₹110', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockOffering1); // 1 x 30
        result.current.addToCart(mockOffering1); // 2 x 30 = 60
        result.current.addToCart(mockOffering2); // 1 x 50 = 50
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.totalItems).toBe(3);
      expect(result.current.totalAmount).toBe(110);
    });

    it('renders itemized breakdown and grand total in CartDrawer', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockOffering1);
        result.current.addToCart(mockOffering1);
        result.current.addToCart(mockOffering2);
      });

      render(
        <CartDrawer
          cart={result.current}
          isOpen={true}
          onClose={vi.fn()}
        />,
      );

      // Verify item names appear in list
      expect(screen.getByText('Pushpanjali')).toBeInTheDocument();
      expect(screen.getByText('Archana')).toBeInTheDocument();

      // Verify quantities
      expect(screen.getByLabelText('Quantity: 2')).toBeInTheDocument();
      expect(screen.getByLabelText('Quantity: 1')).toBeInTheDocument();

      // Verify grand total displays 110
      expect(screen.getByLabelText('Grand total 110 rupees')).toBeInTheDocument();

      // Verify itemized breakdown formula contains both offerings
      expect(screen.getByText(/2 Pushpanjali @ ₹30 \+ 1 Archana @ ₹50/)).toBeInTheDocument();
    });

    it('increments, decrements, and removes items correctly', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockOffering1);
        result.current.incrementItem('off-1');
      });
      expect(result.current.items[0].quantity).toBe(2);

      act(() => {
        result.current.decrementItem('off-1');
      });
      expect(result.current.items[0].quantity).toBe(1);

      act(() => {
        result.current.decrementItem('off-1');
      });
      expect(result.current.items).toHaveLength(0);
      expect(result.current.totalAmount).toBe(0);

      act(() => {
        result.current.addToCart(mockOffering2);
        result.current.removeItem('off-2');
      });
      expect(result.current.items).toHaveLength(0);
    });
  });

  // ─── Test 2: LocalStorage Hydration / Persistence ───────────────────────────
  describe('LocalStorage Cart Persistence', () => {
    it('persists cart across simulated page refresh/re-render', () => {
      // First session: add items to cart
      const { result: firstSession, unmount } = renderHook(() => useCart());

      act(() => {
        firstSession.current.addToCart(mockOffering1);
        firstSession.current.addToCart(mockOffering1);
        firstSession.current.addToCart(mockOffering2);
      });

      expect(firstSession.current.totalAmount).toBe(110);
      expect(localStorage.getItem('vazhipadu_cart')).not.toBeNull();

      // Simulate full page refresh by unmounting the hook
      unmount();

      // Second session: mount fresh useCart hook (hydrates from localStorage)
      const { result: secondSession } = renderHook(() => useCart());

      expect(secondSession.current.items).toHaveLength(2);
      expect(secondSession.current.totalItems).toBe(3);
      expect(secondSession.current.totalAmount).toBe(110);
      expect(secondSession.current.items[0].offering.name).toBe('Pushpanjali');
      expect(secondSession.current.items[0].quantity).toBe(2);
      expect(secondSession.current.items[1].offering.name).toBe('Archana');
      expect(secondSession.current.items[1].quantity).toBe(1);
    });

    it('gracefully handles corrupted localStorage JSON', () => {
      localStorage.setItem('vazhipadu_cart', '{invalid_json}');
      const { result } = renderHook(() => useCart());
      expect(result.current.items).toEqual([]);
      expect(result.current.totalAmount).toBe(0);
    });
  });

  // ─── Test 3: Order Form Real-time Validation ────────────────────────────────
  describe('Order Form Validation', () => {
    it('throws inline error "Date cannot be in the past" when past date is selected', () => {
      render(
        <OrderForm
          onSubmit={vi.fn()}
          isSubmitting={false}
          submitError={null}
        />,
      );

      const dateInput = screen.getByLabelText(/Date of Offering/i);
      fireEvent.change(dateInput, { target: { value: '2020-01-01' } });
      fireEvent.blur(dateInput);

      expect(screen.getByText('Date cannot be in the past.')).toBeInTheDocument();
    });

    it('throws 10-digit requirement error when phone is invalid', () => {
      render(
        <OrderForm
          onSubmit={vi.fn()}
          isSubmitting={false}
          submitError={null}
        />,
      );

      const phoneInput = screen.getByLabelText(/Phone Number/i);
      fireEvent.change(phoneInput, { target: { value: '98765' } });
      fireEvent.blur(phoneInput);

      expect(screen.getByText(/10-digit/i)).toBeInTheDocument();
    });

    it('validates devotee name requiring at least 2 characters', () => {
      render(
        <OrderForm
          onSubmit={vi.fn()}
          isSubmitting={false}
          submitError={null}
        />,
      );

      const nameInput = screen.getByLabelText(/Devotee Name/i);
      fireEvent.change(nameInput, { target: { value: 'A' } });
      fireEvent.blur(nameInput);

      expect(screen.getByText(/Name must be at least 2 characters/i)).toBeInTheDocument();
    });

    it('features all 27 Malayalam/Vedic Nakshatras in the dropdown', () => {
      render(
        <OrderForm
          onSubmit={vi.fn()}
          isSubmitting={false}
          submitError={null}
        />,
      );

      const select = screen.getByLabelText(/Birth Star/i);
      const options = Array.from(select.querySelectorAll('option')).map((o) => o.value);

      expect(ALL_NAKSHATRAS).toHaveLength(27);
      ALL_NAKSHATRAS.forEach((star) => {
        expect(options).toContain(star);
      });
    });

    it('shows all inline validation errors when submitting an empty form', () => {
      const mockSubmit = vi.fn();
      render(
        <OrderForm
          onSubmit={mockSubmit}
          isSubmitting={false}
          submitError={null}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: /Place Order/i }));

      expect(screen.getByText('Devotee name is required.')).toBeInTheDocument();
      expect(screen.getByText('Phone number is required.')).toBeInTheDocument();
      expect(screen.getByText('Please select your birth star (Nakshatra).')).toBeInTheDocument();
      expect(screen.getByText('Offering date is required.')).toBeInTheDocument();
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('calls onSubmit with valid form data', () => {
      const mockSubmit = vi.fn();
      render(
        <OrderForm
          onSubmit={mockSubmit}
          isSubmitting={false}
          submitError={null}
        />,
      );

      const today = getTodayISO();

      fireEvent.change(screen.getByLabelText(/Devotee Name/i), {
        target: { value: 'Arjun Menon' },
      });
      fireEvent.change(screen.getByLabelText(/Phone Number/i), {
        target: { value: '9876543210' },
      });
      fireEvent.change(screen.getByLabelText(/Birth Star/i), {
        target: { value: 'Rohini' },
      });
      fireEvent.change(screen.getByLabelText(/Date of Offering/i), {
        target: { value: today },
      });

      fireEvent.click(screen.getByRole('button', { name: /Place Order/i }));

      expect(mockSubmit).toHaveBeenCalledTimes(1);
      expect(mockSubmit).toHaveBeenCalledWith({
        devoteeName: 'Arjun Menon',
        phone: '9876543210',
        nakshatra: 'Rohini',
        offeringDate: today,
      });
    });

    it('unit tests validateForm helper directly', () => {
      const today = getTodayISO();
      const valid = validateForm({
        devoteeName: 'Sita',
        phone: '9988776655',
        nakshatra: 'Ashwathi',
        offeringDate: today,
      });
      expect(Object.keys(valid)).toHaveLength(0);

      const invalid = validateForm({
        devoteeName: ' ',
        phone: '123',
        nakshatra: '',
        offeringDate: '2019-12-31',
      });
      expect(invalid.devoteeName).toBe('Devotee name is required.');
      expect(invalid.phone).toContain('10-digit');
      expect(invalid.nakshatra).toBe('Please select your birth star (Nakshatra).');
      expect(invalid.offeringDate).toBe('Date cannot be in the past.');
    });
  });
});
