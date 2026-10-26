import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as mockClient from '../api/mockClient';
import type { Order, Temple, Offering } from '../types/vazhipadu';
import { ApiError } from '../types/vazhipadu';
import App from '../App';
import { OrderConfirmationCard } from '../components/OrderConfirmationCard';

// ─── Test Fixtures ────────────────────────────────────────────────────────────
const mockTemple: Temple = {
  id: 'temple-1',
  name: 'Sree Krishna Temple',
  code: 'SKT',
  location: 'Guruvayur',
  description: 'Ancient and holy Krishna temple',
};

const mockOffering: Offering = {
  id: 'off-1',
  templeId: 'temple-1',
  name: 'Palpayasam',
  description: 'Sacred milk porridge offering',
  priceRupees: 150,
  isActive: true,
  category: 'Special',
};

const mockOrderResponse: Order = {
  id: 'order-12345',
  orderNumber: 'TDB-20261026-9842',
  templeId: 'temple-1',
  devoteeName: 'Devi Prasad',
  phone: '9876543210',
  nakshatra: 'Thiruvathira',
  offeringDate: '2026-10-27',
  items: [
    {
      offeringId: 'off-1',
      offeringName: 'Palpayasam',
      priceRupees: 150,
      quantity: 1,
      devoteeName: 'Devi Prasad',
      nakshatra: 'Thiruvathira',
      date: '2026-10-27',
    },
  ],
  totalAmount: 150,
  status: 'CONFIRMED',
  createdAt: '2026-10-26T10:30:00.000Z',
};

describe('Phase 3: Order Confirmation & Idempotency', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    // Default mock: getTemples returns our test temple
    vi.spyOn(mockClient, 'getTemples').mockResolvedValue([mockTemple]);
    // Default mock: getOfferings returns our test offering
    vi.spyOn(mockClient, 'getOfferings').mockResolvedValue([mockOffering]);
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // ─── Helper: Setup App with item in cart and open checkout ──────────────────
  async function setupCartAndOpenCheckout() {
    render(<App />);

    // Wait for temple to load and select it
    await screen.findByRole('option', { name: /Sree Krishna Temple/i });
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'temple-1' },
    });

    // Wait for offering to appear
    await screen.findByText('Palpayasam');

    // Click "Add" to add offering to cart
    fireEvent.click(screen.getByRole('button', { name: /Add Palpayasam to cart/i }));

    // Open Cart Drawer
    fireEvent.click(screen.getByRole('button', { name: /Open shopping cart/i }));

    // Wait for drawer to show cart items, then click "Proceed to Devotee Details"
    const proceedBtn = await screen.findByRole('button', {
      name: /Proceed to Devotee Details/i,
    });
    fireEvent.click(proceedBtn);

    // Fill the valid form fields
    fireEvent.change(screen.getByLabelText(/Devotee Name/i), {
      target: { value: 'Devi Prasad' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '9876543210' },
    });
    fireEvent.change(screen.getByLabelText(/Birth Star/i), {
      target: { value: 'Thiruvathira' },
    });
    fireEvent.change(screen.getByLabelText(/Date of Offering/i), {
      target: { value: '2026-10-27' },
    });
  }

  // ─── Test 1: Double-Submit Prevention (Idempotency) ─────────────────────────
  it('prevents double-submit: double-clicking "Place Order" calls createOrder API exactly once', async () => {
    // Return a delayed promise so isSubmitting stays true during rapid clicks
    let resolvePromise: (value: Order) => void;
    const pendingPromise = new Promise<Order>((res) => {
      resolvePromise = res;
    });

    const createOrderSpy = vi
      .spyOn(mockClient, 'createOrder')
      .mockReturnValue(pendingPromise);

    await setupCartAndOpenCheckout();

    const submitBtn = screen.getByRole('button', { name: /Place Order/i });

    // Rapid double click
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);

    // Button should now be disabled and showing loading spinner
    expect(submitBtn).toBeDisabled();
    expect(screen.getByText(/Placing Order…/i)).toBeInTheDocument();

    // Resolve the order
    resolvePromise!(mockOrderResponse);

    // Verify createOrder was called exactly ONCE
    await waitFor(() => {
      expect(createOrderSpy).toHaveBeenCalledTimes(1);
    });
  });

  // ─── Test 2: Failure Handling & State Preservation ──────────────────────────
  it('handles mock API failure: preserves cart and input state, displays error notification with retry', async () => {
    const errorMsg = 'Simulated transient network failure (10% error)';
    const createOrderSpy = vi
      .spyOn(mockClient, 'createOrder')
      .mockRejectedValueOnce(new ApiError(errorMsg, 'TRANSIENT_ERROR'));

    await setupCartAndOpenCheckout();

    // Place order
    fireEvent.click(screen.getByRole('button', { name: /Place Order/i }));

    // Verify error notification is displayed
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toBeInTheDocument();
    expect(screen.getByText(errorMsg)).toBeInTheDocument();

    // Verify input state is preserved in form
    expect(screen.getByLabelText(/Devotee Name/i)).toHaveValue('Devi Prasad');
    expect(screen.getByLabelText(/Phone Number/i)).toHaveValue('9876543210');
    expect(screen.getByLabelText(/Birth Star/i)).toHaveValue('Thiruvathira');
    expect(screen.getByLabelText(/Date of Offering/i)).toHaveValue('2026-10-27');

    // Verify cart state is preserved (localStorage is not empty)
    const storedCart = localStorage.getItem('vazhipadu_cart');
    expect(storedCart).not.toBeNull();
    expect(storedCart).toContain('Palpayasam');

    // Now test retry option: mock next attempt as success
    createOrderSpy.mockResolvedValueOnce(mockOrderResponse);

    const retryBtn = screen.getByRole('button', { name: /Retry/i });
    fireEvent.click(retryBtn);

    // Verify confirmation view appears on successful retry
    expect(await screen.findByTestId('confirmation-view')).toBeInTheDocument();
    expect(screen.getByText('TDB-20261026-9842')).toBeInTheDocument();
  });

  // ─── Test 3: Success Flow & State Reset ──────────────────────────────────────
  it('renders order confirmation with order number, details, and resets cart state to 0 items', async () => {
    vi.spyOn(mockClient, 'createOrder').mockResolvedValue(mockOrderResponse);

    await setupCartAndOpenCheckout();

    // Click Place Order
    fireEvent.click(screen.getByRole('button', { name: /Place Order/i }));

    // Verify Confirmation View renders with Order Number
    const confirmationView = await screen.findByTestId('confirmation-view');
    expect(confirmationView).toBeInTheDocument();
    expect(screen.getByTestId('order-number')).toHaveTextContent('TDB-20261026-9842');

    // Verify devotee details rendered in summary
    expect(screen.getByText('Devi Prasad')).toBeInTheDocument();
    expect(screen.getByText(/\+91 9876543210/)).toBeInTheDocument();
    expect(screen.getByText('Thiruvathira')).toBeInTheDocument();
    expect(screen.getByText('2026-10-27')).toBeInTheDocument();

    // Verify offering name and total amount
    expect(screen.getByText('Palpayasam')).toBeInTheDocument();
    expect(screen.getAllByText('150').length).toBeGreaterThanOrEqual(1);

    // Verify cart state is reset to 0 items in localStorage and UI
    const storedCart = localStorage.getItem('vazhipadu_cart');
    expect(storedCart === null || storedCart === '[]').toBe(true);

    // Cart trigger in header should show 0 items (no badge)
    expect(screen.queryByText(/Palpayasam @/)).not.toBeInTheDocument();

    // Verify "Book Another Offering" button resets the view cleanly
    const bookAnotherBtn = screen.getByRole('button', {
      name: /Book Another Offering/i,
    });
    fireEvent.click(bookAnotherBtn);

    // Confirmation view is dismissed and hero/offerings view is restored
    expect(screen.queryByTestId('confirmation-view')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Book Temple Offerings/i })).toBeInTheDocument();
  });

  // ─── Test 4: OrderConfirmationCard Component Unit Test ──────────────────────
  it('renders OrderConfirmationCard standalone with all required elements', () => {
    const mockBookAnother = vi.fn();
    render(
      <OrderConfirmationCard
        order={mockOrderResponse}
        templeName="Sree Krishna Temple"
        onBookAnother={mockBookAnother}
      />,
    );

    expect(screen.getByText('TDB-20261026-9842')).toBeInTheDocument();
    expect(screen.getByText('Sree Krishna Temple')).toBeInTheDocument();
    expect(screen.getByText('Devi Prasad')).toBeInTheDocument();
    expect(screen.getByText(/\+91 9876543210/)).toBeInTheDocument();
    expect(screen.getByText('Thiruvathira')).toBeInTheDocument();
    expect(screen.getByText('2026-10-27')).toBeInTheDocument();
    expect(screen.getByText('Palpayasam')).toBeInTheDocument();
    expect(screen.getAllByText('150').length).toBeGreaterThanOrEqual(1);

    fireEvent.click(screen.getByRole('button', { name: /Book Another Offering/i }));
    expect(mockBookAnother).toHaveBeenCalledTimes(1);
  });
});
