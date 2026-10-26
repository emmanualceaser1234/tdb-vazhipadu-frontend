import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OfferingsList } from '../components/OfferingsList';
import * as mockClient from '../api/mockClient';
import type { Offering } from '../types/vazhipadu';
import { ApiError } from '../types/vazhipadu';

// ─── Mock the entire mockClient module ───────────────────────────────────────
vi.mock('../api/mockClient');

const ACTIVE_OFFERINGS: Offering[] = [
  {
    id: 'off-001',
    templeId: 'temple-001',
    name: 'Pushpanjali',
    description: 'Offering of flowers with vedic hymns.',
    priceRupees: 30,
    isActive: true,
    category: 'Daily Pooja',
  },
  {
    id: 'off-002',
    templeId: 'temple-001',
    name: 'Archana',
    description: 'Personalised 108-name chanting.',
    priceRupees: 50,
    isActive: true,
    category: 'Daily Pooja',
  },
  {
    id: 'off-003',
    templeId: 'temple-001',
    name: 'Ganapathy Homam',
    description: 'Sacred fire ritual.',
    priceRupees: 150,
    isActive: true,
    category: 'Homam',
  },
];

const INACTIVE_OFFERING: Offering = {
  id: 'off-009',
  templeId: 'temple-001',
  name: 'Abhishekam (Seasonal)',
  description: 'Seasonal only — currently unavailable.',
  priceRupees: 200,
  isActive: false,
  category: 'Abhishekam',
};

const ALL_OFFERINGS = [...ACTIVE_OFFERINGS, INACTIVE_OFFERING];

function renderOfferingsList(templeId: string | null = 'temple-001') {
  const onAddToCart = vi.fn();
  const result = render(
    <OfferingsList templeId={templeId} onAddToCart={onAddToCart} />,
  );
  return { ...result, onAddToCart };
}

describe('OfferingsList – Phase 1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ── 1. Search filtering ──────────────────────────────────────────────────
  it('typing "push" filters to show Pushpanjali and hides non-matching items', async () => {
    vi.mocked(mockClient.getOfferings).mockResolvedValue(ALL_OFFERINGS);

    renderOfferingsList();

    // Wait for offerings to load
    await waitFor(() => {
      expect(screen.getByText('Pushpanjali')).toBeInTheDocument();
    });

    // Type in search
    const searchInput = screen.getByRole('searchbox', { name: /search offerings/i });
    await userEvent.type(searchInput, 'push');

    // Pushpanjali should be visible
    expect(screen.getByText('Pushpanjali')).toBeInTheDocument();

    // Non-matching items should be gone
    expect(screen.queryByText('Archana')).not.toBeInTheDocument();
    expect(screen.queryByText('Ganapathy Homam')).not.toBeInTheDocument();
  });

  it('shows empty state message when search has no matches', async () => {
    vi.mocked(mockClient.getOfferings).mockResolvedValue(ALL_OFFERINGS);
    renderOfferingsList();

    await waitFor(() => screen.getByText('Pushpanjali'));

    const searchInput = screen.getByRole('searchbox', { name: /search offerings/i });
    await userEvent.type(searchInput, 'xyznotexist');

    expect(screen.getByText(/No offerings match/i)).toBeInTheDocument();
  });

  // ── 2. Error state & retry ───────────────────────────────────────────────
  it('displays error banner when API call fails', async () => {
    vi.mocked(mockClient.getOfferings).mockRejectedValue(
      new ApiError('Simulated network error', 'NETWORK_ERROR'),
    );

    renderOfferingsList();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText(/Simulated network error/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('clicking "Try Again" triggers a re-fetch after error', async () => {
    vi.mocked(mockClient.getOfferings)
      .mockRejectedValueOnce(new ApiError('Network error', 'NETWORK_ERROR'))
      .mockResolvedValueOnce(ACTIVE_OFFERINGS);

    renderOfferingsList();

    // Wait for error state
    await waitFor(() => screen.getByRole('alert'));

    // Click retry
    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);

    // Should call getOfferings twice total
    await waitFor(() => {
      expect(mockClient.getOfferings).toHaveBeenCalledTimes(2);
    });

    // Error should be gone and offerings visible
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByText('Pushpanjali')).toBeInTheDocument();
    });
  });

  // ── 3. Inactive offerings hidden ─────────────────────────────────────────
  it('inactive offerings are NOT rendered as bookable cards', async () => {
    vi.mocked(mockClient.getOfferings).mockResolvedValue(ALL_OFFERINGS);
    renderOfferingsList();

    await waitFor(() => screen.getByText('Pushpanjali'));

    // The inactive offering name should not appear as a card heading
    expect(screen.queryByRole('article', { name: /Abhishekam/i })).not.toBeInTheDocument();
  });

  it('shows a notice informing how many offerings are unavailable', async () => {
    vi.mocked(mockClient.getOfferings).mockResolvedValue(ALL_OFFERINGS);
    renderOfferingsList();

    await waitFor(() => screen.getByText('Pushpanjali'));

    // Notice about inactive count
    expect(screen.getByRole('note')).toHaveTextContent(/1 offering is currently unavailable/i);
  });

  it('active offerings have an "Add" button', async () => {
    vi.mocked(mockClient.getOfferings).mockResolvedValue(ACTIVE_OFFERINGS);
    renderOfferingsList();

    await waitFor(() => screen.getByText('Pushpanjali'));

    const addButtons = screen.getAllByRole('button', { name: /^Add /i });
    expect(addButtons).toHaveLength(ACTIVE_OFFERINGS.length);
  });

  it('clicking "Add" on an offering calls onAddToCart with correct offering', async () => {
    vi.mocked(mockClient.getOfferings).mockResolvedValue(ACTIVE_OFFERINGS);
    const { onAddToCart } = renderOfferingsList();

    await waitFor(() => screen.getByText('Pushpanjali'));

    const addButton = screen.getByRole('button', { name: /Add Pushpanjali/i });
    fireEvent.click(addButton);

    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onAddToCart).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'off-001', name: 'Pushpanjali' }),
    );
  });

  // ── 4. Loading state ──────────────────────────────────────────────────────
  it('shows loading skeleton while fetching', () => {
    // Never resolves during this test
    vi.mocked(mockClient.getOfferings).mockReturnValue(new Promise(() => {}));
    renderOfferingsList();

    expect(screen.getByRole('status', { name: /loading offerings/i })).toBeInTheDocument();
  });

  // ── 5. No temple selected ─────────────────────────────────────────────────
  it('shows "Select a temple" prompt when templeId is null', () => {
    renderOfferingsList(null);
    expect(screen.getByText(/select a temple to view offerings/i)).toBeInTheDocument();
  });
});
