import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ApiError } from '../types/vazhipadu';

// ─── Pin Math.random BEFORE module imports so maybeThrow() never fires ────────
// 0.5 > 0.1 (failure threshold), so no simulated errors during tests
vi.spyOn(Math, 'random').mockReturnValue(0.5);

// ─── Mock localStorage ────────────────────────────────────────────────────────
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Import AFTER mocking localStorage and Math.random
import('../api/mockClient');

// Re-import helper (module is already cached after first import above)
const importMockClient = () => import('../api/mockClient');

describe('Mock API – Phase 0 contract tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Re-seed by clearing stored keys so initStore() re-seeds from SEED data
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('getTemples returns at least 2 temples with required fields', async () => {
    const { getTemples } = await importMockClient();
    const temples = await getTemples();

    expect(temples.length).toBeGreaterThanOrEqual(2);
    for (const t of temples) {
      expect(t).toHaveProperty('id');
      expect(t).toHaveProperty('name');
      expect(t).toHaveProperty('code');
      expect(t).toHaveProperty('location');
      expect(t).toHaveProperty('description');
    }
  });

  it('getOfferings returns offerings for a given templeId with required fields', async () => {
    const { getOfferings } = await importMockClient();
    const offerings = await getOfferings('temple-001');

    expect(offerings.length).toBeGreaterThanOrEqual(10);
    for (const o of offerings) {
      expect(o).toHaveProperty('id');
      expect(o).toHaveProperty('templeId', 'temple-001');
      expect(o).toHaveProperty('name');
      expect(o).toHaveProperty('priceRupees');
      expect(o).toHaveProperty('isActive');
      expect(o).toHaveProperty('category');
    }
  });

  it('getOfferings includes both active and inactive offerings', async () => {
    const { getOfferings } = await importMockClient();
    const offerings = await getOfferings('temple-001');

    const active = offerings.filter((o) => o.isActive);
    const inactive = offerings.filter((o) => !o.isActive);
    expect(active.length).toBeGreaterThan(0);
    expect(inactive.length).toBeGreaterThan(0);
  });

  it('createOrder returns an order with correct structure and CONFIRMED status', async () => {
    const { createOrder } = await importMockClient();
    const order = await createOrder({
      templeId: 'temple-001',
      devoteeName: 'Test Devotee',
      phone: '9876543210',
      nakshatra: 'Ashwathi',
      offeringDate: '2026-12-01',
      idempotencyKey: 'test-key-001',
      items: [
        {
          offeringId: 'off-001',
          offeringName: 'Pushpanjali',
          priceRupees: 30,
          quantity: 2,
          devoteeName: 'Test Devotee',
          nakshatra: 'Ashwathi',
          date: '2026-12-01',
        },
      ],
    });

    expect(order).toHaveProperty('id');
    expect(order.orderNumber).toMatch(/^TDB-\d{8}-\d{4}$/);
    expect(order.status).toBe('CONFIRMED');
    expect(order.totalAmount).toBe(60);
    expect(order.devoteeName).toBe('Test Devotee');
  });

  it('createOrder is idempotent — same key returns same order', async () => {
    const { createOrder } = await importMockClient();
    const dto = {
      templeId: 'temple-001',
      devoteeName: 'Idempotent User',
      phone: '9000000000',
      nakshatra: 'Rohini' as const,
      offeringDate: '2026-12-05',
      idempotencyKey: 'idem-key-999',
      items: [
        {
          offeringId: 'off-002',
          offeringName: 'Archana',
          priceRupees: 50,
          quantity: 1,
          devoteeName: 'Idempotent User',
          nakshatra: 'Rohini' as const,
          date: '2026-12-05',
        },
      ],
    };

    const first = await createOrder(dto);
    const second = await createOrder(dto);
    expect(first.id).toBe(second.id);
    expect(first.orderNumber).toBe(second.orderNumber);
  });

  it('getOrders returns paginated result with correct shape', async () => {
    const { getOrders } = await importMockClient();
    const result = await getOrders({ page: 1, limit: 10 });

    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('page', 1);
    expect(result).toHaveProperty('limit', 10);
    expect(result).toHaveProperty('totalPages');
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeLessThanOrEqual(10);
  });

  it('getOrders filters by status correctly', async () => {
    const { getOrders } = await importMockClient();
    const result = await getOrders({ status: 'CANCELLED', limit: 100 });

    for (const order of result.data) {
      expect(order.status).toBe('CANCELLED');
    }
  });

  it('getOrders filters by phone correctly', async () => {
    const { getOrders } = await importMockClient();
    const result = await getOrders({ phone: '9876543210', limit: 100 });

    for (const order of result.data) {
      expect(order.phone).toContain('9876543210');
    }
  });

  it('cancelOrder updates order status to CANCELLED', async () => {
    const { getOrders, cancelOrder } = await importMockClient();
    const { data } = await getOrders({ status: 'CONFIRMED', limit: 1 });
    expect(data.length).toBeGreaterThan(0);

    const target = data[0];
    const updated = await cancelOrder(target.id);
    expect(updated.status).toBe('CANCELLED');
    expect(updated.id).toBe(target.id);
  });

  it('cancelOrder throws ApiError for non-existent order', async () => {
    const { cancelOrder } = await importMockClient();

    await expect(cancelOrder('non-existent-id')).rejects.toMatchObject({
      name: 'ApiError',
      code: 'NOT_FOUND',
    });
  });

  it('ApiError has correct name, message, and code', () => {
    const err = new ApiError('Test error', 'TEST_CODE');
    expect(err.name).toBe('ApiError');
    expect(err.message).toBe('Test error');
    expect(err.code).toBe('TEST_CODE');
    expect(err).toBeInstanceOf(Error);
  });
});
