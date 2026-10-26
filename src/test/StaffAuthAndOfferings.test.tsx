import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StaffLogin } from '../components/StaffLogin';
import { StaffPortal } from '../components/StaffPortal';
import { StaffOfferingsManager } from '../components/StaffOfferingsManager';
import * as mockClient from '../api/mockClient';
import * as authService from '../api/authService';
import type { Offering, Temple } from '../types/vazhipadu';
import type { StaffUser } from '../types/auth';

// ─── Test Fixtures ────────────────────────────────────────────────────────────
const mockTemple: Temple = {
  id: 'temple-1',
  name: 'Sree Sabarimala Sastha Temple',
  code: 'SSS',
  location: 'Sabarimala, Pathanamthitta',
  description: 'Sacred hill shrine of Lord Ayyappa',
};

const mockOfferings: Offering[] = [
  {
    id: 'off-1',
    templeId: 'temple-1',
    name: 'Neyyabhishekam',
    description: 'Sacred ghee offering to the deity',
    priceRupees: 100,
    isActive: true,
    category: 'Abhishekam',
  },
  {
    id: 'off-2',
    templeId: 'temple-1',
    name: 'Aravana Payasam',
    description: 'Sacred delicacy offering',
    priceRupees: 150,
    isActive: true,
    category: 'Payasam',
  },
];

const mockStaffUser: StaffUser = {
  id: 'staff-001',
  name: 'Narayanan Namboothiri',
  email: 'admin@tdb.gov.in',
  role: 'ADMIN',
  templeName: 'All Temples (TDB HQ)',
};

describe('Staff Authentication and Offerings Modification', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.spyOn(mockClient, 'getTemples').mockResolvedValue([mockTemple]);
    vi.spyOn(mockClient, 'getAllOfferings').mockResolvedValue([...mockOfferings]);
    vi.spyOn(mockClient, 'getOfferings').mockResolvedValue([...mockOfferings]);
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // ─── Test 1: Staff Login with Dummy Credentials ─────────────────────────────
  describe('Staff Login', () => {
    it('shows error message on invalid credentials', async () => {
      render(<StaffLogin onLoginSuccess={vi.fn()} />);

      fireEvent.change(screen.getByLabelText(/Staff Official Email/i), {
        target: { value: 'wrong@tdb.gov.in' },
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'wrongpass' },
      });

      fireEvent.click(screen.getByRole('button', { name: /Sign In to Staff Portal/i }));

      const alert = await screen.findByRole('alert');
      expect(alert).toHaveTextContent(/Invalid email or password/i);
    });

    it('quick-fill button populates credentials and logs in successfully', async () => {
      const handleLoginSuccess = vi.fn();
      render(<StaffLogin onLoginSuccess={handleLoginSuccess} />);

      // Click the Central Admin quick fill card
      const adminFillBtn = screen.getByText(/TDB Central Administrator/i).closest('button')!;
      fireEvent.click(adminFillBtn);

      expect(screen.getByLabelText(/Staff Official Email/i)).toHaveValue('admin@tdb.gov.in');
      expect(screen.getByLabelText(/Password/i)).toHaveValue('admin123');

      // Submit login form
      fireEvent.click(screen.getByRole('button', { name: /Sign In to Staff Portal/i }));

      await waitFor(() => {
        expect(handleLoginSuccess).toHaveBeenCalledWith(
          expect.objectContaining({
            email: 'admin@tdb.gov.in',
            role: 'ADMIN',
          }),
        );
      });
    });
  });

  // ─── Test 2: Staff Portal Access Control ────────────────────────────────────
  describe('Staff Portal Access Control', () => {
    it('shows login screen when staff is not authenticated', () => {
      vi.spyOn(authService, 'getStoredStaffUser').mockReturnValue(null);
      render(<StaffPortal />);

      expect(screen.getByRole('heading', { name: /Temple Staff Portal Login/i })).toBeInTheDocument();
      expect(screen.queryByText(/Sign Out/i)).not.toBeInTheDocument();
    });

    it('renders staff portal and user badge when staff is logged in', () => {
      vi.spyOn(authService, 'getStoredStaffUser').mockReturnValue(mockStaffUser);
      render(<StaffPortal />);

      expect(screen.getByText('Narayanan Namboothiri')).toBeInTheDocument();
      expect(screen.getByText('ADMIN')).toBeInTheDocument();
      expect(screen.getByText(/All Temples \(TDB HQ\)/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign Out/i })).toBeInTheDocument();
    });

    it('signs out staff and resets view back to login', async () => {
      vi.spyOn(authService, 'getStoredStaffUser').mockReturnValue(mockStaffUser);
      const logoutSpy = vi.spyOn(authService, 'logoutStaff');

      render(<StaffPortal />);

      const signOutBtn = screen.getByRole('button', { name: /Sign Out/i });
      fireEvent.click(signOutBtn);

      expect(logoutSpy).toHaveBeenCalledTimes(1);
      expect(await screen.findByRole('heading', { name: /Temple Staff Portal Login/i })).toBeInTheDocument();
    });
  });

  // ─── Test 3: Offerings List & Modification ──────────────────────────────────
  describe('Offerings Management & Modification', () => {
    it('displays offerings list for staff review', async () => {
      render(<StaffOfferingsManager />);

      expect(await screen.findByText('Neyyabhishekam')).toBeInTheDocument();
      expect(screen.getByText('Aravana Payasam')).toBeInTheDocument();
      expect(screen.getByText('Abhishekam')).toBeInTheDocument();
    });

    it('modifies offering details (price and name) through edit modal', async () => {
      const updateSpy = vi.spyOn(mockClient, 'updateOffering').mockResolvedValueOnce({
        ...mockOfferings[0],
        name: 'Special Neyyabhishekam',
        priceRupees: 120,
      });

      render(<StaffOfferingsManager />);

      await screen.findByText('Neyyabhishekam');

      // Click "Modify" button for Neyyabhishekam
      const modifyBtn = screen.getByRole('button', { name: /Edit Neyyabhishekam/i });
      fireEvent.click(modifyBtn);

      // Verify modal is open
      expect(screen.getByRole('dialog', { name: /Modify Offering Details/i })).toBeInTheDocument();

      // Edit name and price
      const nameInput = screen.getByLabelText(/Offering Name/i);
      const priceInput = screen.getByLabelText(/Price/i);

      fireEvent.change(nameInput, { target: { value: 'Special Neyyabhishekam' } });
      fireEvent.change(priceInput, { target: { value: '120' } });

      // Save changes
      fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

      await waitFor(() => {
        expect(updateSpy).toHaveBeenCalledWith(
          'off-1',
          expect.objectContaining({
            name: 'Special Neyyabhishekam',
            priceRupees: 120,
          }),
        );
      });

      // Feedback announcement should be displayed
      expect(await screen.findByRole('status')).toHaveTextContent(/Special Neyyabhishekam/i);
    });

    it('toggles offering active/inactive status', async () => {
      const updateSpy = vi.spyOn(mockClient, 'updateOffering').mockResolvedValueOnce({
        ...mockOfferings[0],
        isActive: false,
      });

      render(<StaffOfferingsManager />);

      await screen.findByText('Neyyabhishekam');

      // Click status toggle badge
      const toggleBtn = screen.getByRole('button', { name: /Toggle status for Neyyabhishekam/i });
      fireEvent.click(toggleBtn);

      await waitFor(() => {
        expect(updateSpy).toHaveBeenCalledWith(
          'off-1',
          expect.objectContaining({
            isActive: false,
          }),
        );
      });

      expect(await screen.findByRole('status')).toHaveTextContent(/Inactive/i);
    });
  });
});
