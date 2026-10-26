import { useState, useEffect, useCallback } from 'react';
import type { Offering } from '../types/vazhipadu';

// ─── Cart Item type ───────────────────────────────────────────────────────────
export interface CartItem {
  offering: Offering;
  quantity: number;
}

// ─── Storage key ──────────────────────────────────────────────────────────────
const CART_STORAGE_KEY = 'vazhipadu_cart';

// ─── Safe storage helpers ─────────────────────────────────────────────────────
function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Defensive schema validation
    return parsed.filter(
      (item): item is CartItem =>
        typeof item === 'object' &&
        item !== null &&
        'offering' in item &&
        'quantity' in item &&
        typeof (item as CartItem).quantity === 'number' &&
        (item as CartItem).quantity > 0,
    );
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // quota exceeded — silently degrade
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export interface UseCartResult {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  addToCart: (offering: Offering) => void;
  incrementItem: (offeringId: string) => void;
  decrementItem: (offeringId: string) => void;
  removeItem: (offeringId: string) => void;
  clearCart: () => void;
}

export function useCart(): UseCartResult {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  // Sync to localStorage whenever items change
  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addToCart = useCallback((offering: Offering) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.offering.id === offering.id);
      if (existing) {
        return prev.map((i) =>
          i.offering.id === offering.id
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, { offering, quantity: 1 }];
    });
  }, []);

  const incrementItem = useCallback((offeringId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.offering.id === offeringId ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    );
  }, []);

  const decrementItem = useCallback((offeringId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.offering.id === offeringId);
      if (!item) return prev;
      if (item.quantity <= 1) {
        return prev.filter((i) => i.offering.id !== offeringId);
      }
      return prev.map((i) =>
        i.offering.id === offeringId ? { ...i, quantity: i.quantity - 1 } : i,
      );
    });
  }, []);

  const removeItem = useCallback((offeringId: string) => {
    setItems((prev) => prev.filter((i) => i.offering.id !== offeringId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalAmount = items.reduce(
    (sum, i) => sum + i.offering.priceRupees * i.quantity,
    0,
  );

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return {
    items,
    totalAmount,
    totalItems,
    addToCart,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  };
}
