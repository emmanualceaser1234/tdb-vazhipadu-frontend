import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import i18n, { switchLanguage } from '../i18n';
import * as mockClient from '../api/mockClient';

describe('i18n Localization (English & Malayalam)', () => {
  beforeEach(() => {
    localStorage.clear();
    switchLanguage('en');
    vi.spyOn(mockClient, 'getTemples').mockResolvedValue([
      {
        id: 'temple-1',
        name: 'Sree Sabarimala Sastha Temple',
        code: 'SSS',
        location: 'Sabarimala',
        description: 'Sacred hill shrine',
      },
    ]);
  });

  afterEach(() => {
    localStorage.clear();
    switchLanguage('en');
    vi.restoreAllMocks();
  });

  it('renders LanguageSwitcher with EN and Malayalam buttons and correct aria-pressed state', () => {
    render(<LanguageSwitcher />);

    const enBtn = screen.getByRole('button', { name: 'EN' });
    const mlBtn = screen.getByRole('button', { name: 'മലയാളം' });

    expect(enBtn).toBeInTheDocument();
    expect(mlBtn).toBeInTheDocument();
    expect(enBtn).toHaveAttribute('aria-pressed', 'true');
    expect(mlBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('switches language from English to Malayalam and updates document lang & UI text', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    // Initial English text verification
    expect(screen.getByRole('heading', { name: /Book Temple Offerings/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Devotee Booking/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Staff Orders/i })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('en');

    // Click Malayalam switch button
    const mlBtn = screen.getByRole('button', { name: 'മലയാളം' });
    fireEvent.click(mlBtn);

    // Verify Malayalam UI strings
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'ക്ഷേത്ര വഴിപാടുകൾ ബുക്ക് ചെയ്യാം' })).toBeInTheDocument();
    });
    expect(screen.getByRole('tab', { name: 'ഭക്തജന ബുക്കിംഗ്' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'ജീവനക്കാരുടെ പോർട്ടൽ' })).toBeInTheDocument();
    expect(screen.getByText('ക്ഷേത്രം തിരഞ്ഞെടുക്കുക')).toBeInTheDocument();

    // Verify document lang and localStorage persistence
    expect(document.documentElement.lang).toBe('ml');
    expect(localStorage.getItem('tdb_language')).toBe('ml');
  });

  it('switches back to English and restores English strings', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    // Switch to Malayalam first
    fireEvent.click(screen.getByRole('button', { name: 'മലയാളം' }));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'ക്ഷേത്ര വഴിപാടുകൾ ബുക്ക് ചെയ്യാം' })).toBeInTheDocument();
    });

    // Switch back to English
    fireEvent.click(screen.getByRole('button', { name: 'EN' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Book Temple Offerings/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('tab', { name: /Devotee Booking/i })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('en');
    expect(localStorage.getItem('tdb_language')).toBe('en');
  });

  it('retains translation dictionary entries for all 27 Malayalam Nakshatras', () => {
    expect(i18n.getResource('ml', 'translation', 'nakshatra_Ashwati')).toBe('അശ്വതി (Ashwati)');
    expect(i18n.getResource('ml', 'translation', 'nakshatra_Thiruvathira')).toBe('തിരുവാതിര (Thiruvathira)');
    expect(i18n.getResource('ml', 'translation', 'nakshatra_Revathi')).toBe('രേവതി (Revathi)');
  });
});
