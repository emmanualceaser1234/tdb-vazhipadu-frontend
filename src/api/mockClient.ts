import type {
  Temple,
  Offering,
  Order,
  CreateOrderDTO,
  GetOrdersQuery,
  PaginatedResult,
} from '../types/vazhipadu';
import { ApiError } from '../types/vazhipadu';
import { SEED_TEMPLES, SEED_OFFERINGS, generateSeedOrders } from './seedData';

// ─── Storage keys ─────────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  TEMPLES: 'vazhipadu_temples',
  OFFERINGS: 'vazhipadu_offerings',
  ORDERS: 'vazhipadu_orders',
  IDEMPOTENCY: 'vazhipadu_idempotency',
} as const;

// ─── Failure rate (10%) ───────────────────────────────────────────────────────
const FAILURE_RATE = 0.1;

// ─── Simulated network delay ──────────────────────────────────────────────────
function simulateDelay(): Promise<void> {
  const ms = Math.floor(Math.random() * 800) + 200;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Random failure injection ─────────────────────────────────────────────────
function maybeThrow(): void {
  if (Math.random() < FAILURE_RATE) {
    throw new ApiError(
      'Simulated network error: The server is temporarily unavailable. Please try again.',
      'NETWORK_ERROR',
    );
  }
}

// ─── Safe localStorage helpers ────────────────────────────────────────────────
function loadFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage quota exceeded — silently degrade
  }
}

// ─── In-memory store (hydrated from localStorage or seed) ────────────────────
function initStore(): {
  temples: Temple[];
  offerings: Offering[];
  orders: Order[];
  idempotencyMap: Record<string, string>;
} {
  const temples = loadFromStorage<Temple[]>(STORAGE_KEYS.TEMPLES) ?? SEED_TEMPLES;
  const offerings = loadFromStorage<Offering[]>(STORAGE_KEYS.OFFERINGS) ?? SEED_OFFERINGS;
  const orders = loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS) ?? generateSeedOrders();
  const idempotencyMap =
    loadFromStorage<Record<string, string>>(STORAGE_KEYS.IDEMPOTENCY) ?? {};

  // Persist seed if first load
  if (!localStorage.getItem(STORAGE_KEYS.TEMPLES)) saveToStorage(STORAGE_KEYS.TEMPLES, temples);
  if (!localStorage.getItem(STORAGE_KEYS.OFFERINGS)) saveToStorage(STORAGE_KEYS.OFFERINGS, offerings);
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) saveToStorage(STORAGE_KEYS.ORDERS, orders);
  if (!localStorage.getItem(STORAGE_KEYS.IDEMPOTENCY)) saveToStorage(STORAGE_KEYS.IDEMPOTENCY, idempotencyMap);

  return { temples, offerings, orders, idempotencyMap };
}

const store = initStore();

// ─── Order number generator ───────────────────────────────────────────────────
function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `TDB-${date}-${seq}`;
}

// ─── Exported API functions ───────────────────────────────────────────────────

export async function getTemples(): Promise<Temple[]> {
  await simulateDelay();
  maybeThrow();
  return [...store.temples];
}

export async function getOfferings(templeId: string): Promise<Offering[]> {
  await simulateDelay();
  maybeThrow();
  return store.offerings.filter((o) => o.templeId === templeId);
}

export async function createOrder(request: CreateOrderDTO): Promise<Order> {
  await simulateDelay();
  maybeThrow();

  // Idempotency check
  const existingOrderId = store.idempotencyMap[request.idempotencyKey];
  if (existingOrderId) {
    const existing = store.orders.find((o) => o.id === existingOrderId);
    if (existing) return existing;
  }

  const totalAmount = request.items.reduce(
    (sum, item) => sum + item.priceRupees * item.quantity,
    0,
  );

  const newOrder: Order = {
    id: `order-${Date.now()}`,
    orderNumber: generateOrderNumber(),
    templeId: request.templeId,
    devoteeName: request.devoteeName,
    phone: request.phone,
    nakshatra: request.nakshatra,
    offeringDate: request.offeringDate,
    items: request.items,
    totalAmount,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  };

  store.orders.push(newOrder);
  store.idempotencyMap[request.idempotencyKey] = newOrder.id;

  saveToStorage(STORAGE_KEYS.ORDERS, store.orders);
  saveToStorage(STORAGE_KEYS.IDEMPOTENCY, store.idempotencyMap);

  return newOrder;
}

export async function getOrders(
  query: GetOrdersQuery = {},
): Promise<PaginatedResult<Order>> {
  await simulateDelay();
  maybeThrow();

  const { status = 'ALL', dateFrom, dateTo, phone, page = 1, limit = 10 } = query;

  let filtered = [...store.orders];

  if (status !== 'ALL') {
    filtered = filtered.filter((o) => o.status === status);
  }
  if (dateFrom) {
    filtered = filtered.filter((o) => o.offeringDate >= dateFrom);
  }
  if (dateTo) {
    filtered = filtered.filter((o) => o.offeringDate <= dateTo);
  }
  if (phone) {
    filtered = filtered.filter((o) => o.phone.includes(phone));
  }

  // Sort newest first
  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const data = filtered.slice((safePage - 1) * limit, safePage * limit);

  return { data, total, page: safePage, limit, totalPages };
}

export async function cancelOrder(orderId: string): Promise<Order> {
  await simulateDelay();
  maybeThrow();

  const idx = store.orders.findIndex((o) => o.id === orderId);
  if (idx === -1) {
    throw new ApiError(`Order ${orderId} not found.`, 'NOT_FOUND');
  }

  const updated: Order = { ...store.orders[idx], status: 'CANCELLED' };
  store.orders[idx] = updated;
  saveToStorage(STORAGE_KEYS.ORDERS, store.orders);

  return updated;
}
