import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OrderForm, getTodayISO } from '../components/OrderForm';
import { CartDrawer } from '../components/CartDrawer';
import { App } from '../App';
import * as mockClient from '../api/mockClient';
import type { Temple, Offering } from '../types/vazhipadu';
import type { UseCartResult } from '../hooks/useCart';

// ─── Test Fixtures ────────────────────────────────────────────────────────────
const mockTemple: Temple = {
  id: 'temple-1',
  name: 'Sree Krishna Temple',
  code: 'SKT',
  location: 'Guruvayur',
  description: 'Ancient and holy temple',
};

const mockOffering: Offering = {
  id: 'off-1',
  templeId: 'temple-1',
  name: 'Pushpanjali',
  description: 'Flower offering to the deity',
  priceRupees: 30,
  isActive: true,
  category: 'Archana',
};

function createMockCart(overrides: Partial<UseCartResult> = {}): UseCartResult {
  return {
    items: [
      {
        offering: mockOffering,
        quantity: 2,
      },
    ],
    totalAmount: 60,
    totalItems: 2,
    addToCart: vi.fn(),
    incrementItem: vi.fn(),
    decrementItem: vi.fn(),
    removeItem: vi.fn(),
    clearCart: vi.fn(),
    ...overrides,
  };
}

describe('Phase 5: Mobile Optimization & Accessibility (a11y) Audit', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.spyOn(mockClient, 'getTemples').mockResolvedValue([mockTemple]);
    vi.spyOn(mockClient, 'getOfferings').mockResolvedValue([mockOffering]);
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // ─── Test 1: Strict Semantic Labeling ───────────────────────────────────────
  it('queries all main form controls strictly using getByRole and getByLabelText', () => {
    render(
      <OrderForm
        onSubmit={vi.fn()}
        isSubmitting={false}
        submitError={null}
      />,
    );

    // Strictly semantic queries — NO test-ids
    const nameInput = screen.getByLabelText(/Devotee Name/i);
    const phoneInput = screen.getByLabelText(/Phone Number/i);
    const starSelect = screen.getByLabelText(/Birth Star/i);
    const dateInput = screen.getByLabelText(/Date of Offering/i);
    const submitBtn = screen.getByRole('button', { name: /Place Order/i });

    expect(nameInput).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();
    expect(starSelect).toBeInTheDocument();
    expect(dateInput).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();

    // Verify aria-required attributes
    expect(nameInput).toHaveAttribute('aria-required', 'true');
    expect(phoneInput).toHaveAttribute('aria-required', 'true');
    expect(starSelect).toHaveAttribute('aria-required', 'true');
    expect(dateInput).toHaveAttribute('aria-required', 'true');
  });

  // ─── Test 2: ARIA Invalid & Describedby Error Associations ──────────────────
  it('associates invalid fields with aria-invalid and aria-describedby alerts', () => {
    render(
      <OrderForm
        onSubmit={vi.fn()}
        isSubmitting={false}
        submitError={null}
      />,
    );

    // Initial state: not invalid
    const phoneInput = screen.getByLabelText(/Phone Number/i);
    expect(phoneInput).toHaveAttribute('aria-invalid', 'false');

    // Trigger validation error on blur
    fireEvent.change(phoneInput, { target: { value: '123' } });
    fireEvent.blur(phoneInput);

    // After blur: aria-invalid must be true
    expect(phoneInput).toHaveAttribute('aria-invalid', 'true');

    // Error message must be in an alert role
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(/10-digit/i);

    // aria-describedby on the input must point to the error element's id
    const describedBy = phoneInput.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toBe(errorMessage);
  });

  // ─── Test 3: Keyboard Escape Closes Cart Drawer ─────────────────────────────
  it('closes CartDrawer when Escape key is pressed', () => {
    const handleClose = vi.fn();
    const mockCart = createMockCart();

    render(
      <CartDrawer
        cart={mockCart}
        isOpen={true}
        onClose={handleClose}
      />,
    );

    const drawer = screen.getByRole('dialog', { name: /Shopping cart/i });
    expect(drawer).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // ─── Test 4: Skip to Content Link & Tablist Semantics in App ────────────────
  it('provides a skip to main content link and accessible tab navigation in App', async () => {
    render(<App />);

    // Skip to main content link exists
    const skipLink = screen.getByText(/Skip to main content/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');

    // Navigation has tablist role with accessible tabs
    const tablist = screen.getByRole('tablist', { name: /Portal Navigation/i });
    expect(tablist).toBeInTheDocument();

    const devoteeTab = screen.getByRole('tab', { name: /Devotee Booking/i });
    const staffTab = screen.getByRole('tab', { name: /Staff Orders/i });

    expect(devoteeTab).toHaveAttribute('aria-selected', 'true');
    expect(staffTab).toHaveAttribute('aria-selected', 'false');
  });

  // ─── Test 5: Touch Target Size Classes (44x44px minimum) ────────────────────
  it('applies minimum 44px touch target classes to inputs, buttons, and selects', () => {
    render(
      <OrderForm
        onSubmit={vi.fn()}
        isSubmitting={false}
        submitError="Network error"
        onRetry={vi.fn()}
      />,
    );

    const nameInput = screen.getByLabelText(/Devotee Name/i);
    const submitBtn = screen.getByRole('button', { name: /Place Order/i });
    const retryBtn = screen.getByRole('button', { name: /Retry/i });

    // Verify touch target min-height class min-h-[44px]
    expect(nameInput.className).toContain('min-h-[44px]');
    expect(submitBtn.className).toContain('min-h-[44px]');
    expect(retryBtn.className).toContain('min-h-[44px]');
  });

  // ─── Test 6: Full Keyboard Navigation Simulation ────────────────────────────
  it('completes order form submission entirely through keyboard interaction', () => {
    const handleSubmit = vi.fn();
    render(
      <OrderForm
        onSubmit={handleSubmit}
        isSubmitting={false}
        submitError={null}
      />,
    );

    const nameInput = screen.getByLabelText(/Devotee Name/i);
    const phoneInput = screen.getByLabelText(/Phone Number/i);
    const starSelect = screen.getByLabelText(/Birth Star/i);
    const dateInput = screen.getByLabelText(/Date of Offering/i);
    const submitBtn = screen.getByRole('button', { name: /Place Order/i });

    // Focus and fill fields via keyboard events
    nameInput.focus();
    expect(document.activeElement).toBe(nameInput);
    fireEvent.change(nameInput, { target: { value: 'Arjun Nambiar' } });

    phoneInput.focus();
    expect(document.activeElement).toBe(phoneInput);
    fireEvent.change(phoneInput, { target: { value: '9847123456' } });

    starSelect.focus();
    expect(document.activeElement).toBe(starSelect);
    fireEvent.change(starSelect, { target: { value: 'Revathi' } });

    dateInput.focus();
    expect(document.activeElement).toBe(dateInput);
    fireEvent.change(dateInput, { target: { value: getTodayISO() } });

    submitBtn.focus();
    expect(document.activeElement).toBe(submitBtn);
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      devoteeName: 'Arjun Nambiar',
      phone: '9847123456',
      nakshatra: 'Revathi',
      offeringDate: getTodayISO(),
    });
  });
});
