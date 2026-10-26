import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as mockClient from '../api/mockClient';
import type { Order, PaginatedResult } from '../types/vazhipadu';
import { StaffOrdersDashboard } from '../components/StaffOrdersDashboard';

// ─── Test Fixtures ────────────────────────────────────────────────────────────
const mockConfirmedOrder: Order = {
  id: 'order-101',
  orderNumber: 'TDB-20261026-1001',
  templeId: 'temple-1',
  devoteeName: 'Anand Kumar',
  phone: '9876543210',
  nakshatra: 'Rohini',
  offeringDate: '2026-10-28',
  items: [
    {
      offeringId: 'off-1',
      offeringName: 'Pushpanjali',
      priceRupees: 30,
      quantity: 2,
      devoteeName: 'Anand Kumar',
      nakshatra: 'Rohini',
      date: '2026-10-28',
    },
  ],
  totalAmount: 60,
  status: 'CONFIRMED',
  createdAt: '2026-10-26T08:00:00.000Z',
};

const mockCancelledOrder: Order = {
  id: 'order-102',
  orderNumber: 'TDB-20261026-1002',
  templeId: 'temple-1',
  devoteeName: 'Suresh Pillai',
  phone: '9812345678',
  nakshatra: 'Makayiram',
  offeringDate: '2026-10-29',
  items: [
    {
      offeringId: 'off-2',
      offeringName: 'Archana',
      priceRupees: 50,
      quantity: 1,
      devoteeName: 'Suresh Pillai',
      nakshatra: 'Makayiram',
      date: '2026-10-29',
    },
  ],
  totalAmount: 50,
  status: 'CANCELLED',
  createdAt: '2026-10-26T09:00:00.000Z',
};

const mockInitialPaginatedResult: PaginatedResult<Order> = {
  data: [mockConfirmedOrder, mockCancelledOrder],
  total: 2,
  page: 1,
  limit: 10,
  totalPages: 1,
};

describe('Phase 4: Staff Orders Management Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(mockClient, 'getOrders').mockResolvedValue(mockInitialPaginatedResult);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ─── Test 1: Status Filtering & Page Reset ──────────────────────────────────
  it('filtering by status CANCELLED updates displayed list and resets page to 1', async () => {
    const getOrdersSpy = vi.spyOn(mockClient, 'getOrders');

    // Mount on page 2
    render(
      <MemoryRouter initialEntries={['/staff/orders?status=ALL&page=2']}>
        <StaffOrdersDashboard />
      </MemoryRouter>,
    );

    await screen.findByText('TDB-20261026-1001');

    // Change status filter to 'CANCELLED'
    const statusSelect = screen.getByLabelText(/Filter by Status/i);

    // Mock response for CANCELLED filter
    getOrdersSpy.mockResolvedValueOnce({
      data: [mockCancelledOrder],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });

    fireEvent.change(statusSelect, { target: { value: 'CANCELLED' } });

    // Verify getOrders was called with status 'CANCELLED' and page reset to 1
    await waitFor(() => {
      expect(getOrdersSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'CANCELLED',
          page: 1,
        }),
      );
    });

    // Verify displayed list only shows cancelled order
    expect(await screen.findByText('TDB-20261026-1002')).toBeInTheDocument();
    expect(screen.queryByText('TDB-20261026-1001')).not.toBeInTheDocument();
  });

  // ─── Test 2: URL Parameter Persistence Across Refresh ───────────────────────
  it('page refresh retains URL filter parameters', async () => {
    const getOrdersSpy = vi.spyOn(mockClient, 'getOrders').mockResolvedValueOnce({
      data: [mockConfirmedOrder],
      total: 15,
      page: 2,
      limit: 10,
      totalPages: 2,
    });

    // Simulate page refresh with existing query params in the URL
    render(
      <MemoryRouter initialEntries={['/staff/orders?status=CONFIRMED&page=2&phone=9876543210']}>
        <StaffOrdersDashboard />
      </MemoryRouter>,
    );

    // Form controls should be hydrated from URL parameters
    const statusSelect = screen.getByLabelText(/Filter by Status/i);
    const phoneInput = screen.getByLabelText(/Search by Phone/i);

    expect(statusSelect).toHaveValue('CONFIRMED');
    expect(phoneInput).toHaveValue('9876543210');

    // Verify getOrders was called with the exact URL parameters
    await waitFor(() => {
      expect(getOrdersSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'CONFIRMED',
          page: 2,
          phone: '9876543210',
        }),
      );
    });
  });

  // ─── Test 3: Order Cancellation Action ──────────────────────────────────────
  it('clicking "Cancel Order" updates target order status badge to CANCELLED immediately', async () => {
    const updatedCancelledOrder: Order = {
      ...mockConfirmedOrder,
      status: 'CANCELLED',
    };

    const cancelOrderSpy = vi
      .spyOn(mockClient, 'cancelOrder')
      .mockResolvedValueOnce(updatedCancelledOrder);

    render(
      <MemoryRouter initialEntries={['/staff/orders']}>
        <StaffOrdersDashboard />
      </MemoryRouter>,
    );

    // Order initially has CONFIRMED badge and Cancel Order button
    await screen.findByText('TDB-20261026-1001');
    expect(screen.getAllByText('CONFIRMED').length).toBeGreaterThanOrEqual(1);

    const cancelBtn = screen.getByRole('button', {
      name: /Cancel Order TDB-20261026-1001/i,
    });
    fireEvent.click(cancelBtn);

    // Confirmation modal should be open
    expect(screen.getByRole('dialog', { name: /Cancel Vazhipadu Order/i })).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to cancel this order\?/i)).toBeInTheDocument();

    // Confirm cancellation
    const confirmBtn = screen.getByRole('button', { name: /Confirm Cancellation/i });
    fireEvent.click(confirmBtn);

    // Verify cancelOrder was called with the order id
    await waitFor(() => {
      expect(cancelOrderSpy).toHaveBeenCalledWith('order-101');
    });

    // Target order status badge must immediately update to CANCELLED without full page reload
    await waitFor(() => {
      expect(screen.getAllByText('CANCELLED').length).toBeGreaterThanOrEqual(1);
    });

    // Feedback notification should be visible
    expect(screen.getByText(/successfully cancelled/i)).toBeInTheDocument();
  });

  // ─── Test 4: Pagination Controls ────────────────────────────────────────────
  it('navigates pages using pagination controls and updates query', async () => {
    const getOrdersSpy = vi.spyOn(mockClient, 'getOrders').mockResolvedValueOnce({
      data: [mockConfirmedOrder],
      total: 25,
      page: 1,
      limit: 10,
      totalPages: 3,
    });

    render(
      <MemoryRouter initialEntries={['/staff/orders?page=1']}>
        <StaffOrdersDashboard />
      </MemoryRouter>,
    );

    await screen.findByText('TDB-20261026-1001');

    // Click Next Page button
    const nextBtn = screen.getByRole('button', { name: /Next Page/i });
    expect(nextBtn).toBeEnabled();

    getOrdersSpy.mockResolvedValueOnce({
      data: [mockCancelledOrder],
      total: 25,
      page: 2,
      limit: 10,
      totalPages: 3,
    });

    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(getOrdersSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
        }),
      );
    });
  });
});
