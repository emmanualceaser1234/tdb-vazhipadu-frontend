import { useState, useEffect, useCallback } from 'react';
import type { Offering } from '../types/vazhipadu';
import { getOfferings } from '../api/mockClient';
import { ApiError } from '../types/vazhipadu';

interface UseOfferingsResult {
  offerings: Offering[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useOfferings(templeId: string | null): UseOfferingsResult {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOfferings = useCallback(async () => {
    if (!templeId) {
      setOfferings([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getOfferings(templeId);
      setOfferings(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setOfferings([]);
    } finally {
      setLoading(false);
    }
  }, [templeId]);

  useEffect(() => {
    void fetchOfferings();
  }, [fetchOfferings]);

  return { offerings, loading, error, retry: fetchOfferings };
}
