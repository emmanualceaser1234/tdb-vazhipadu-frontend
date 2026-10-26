// ─── Temple ───────────────────────────────────────────────────────────────────
export interface Temple {
  id: string;
  name: string;
  code: string;
  location: string;
  description: string;
}

// ─── Offering ─────────────────────────────────────────────────────────────────
export interface Offering {
  id: string;
  templeId: string;
  name: string;
  description: string;
  priceRupees: number;
  isActive: boolean;
  category: string;
}

// ─── Nakshatra ────────────────────────────────────────────────────────────────
export type Nakshatra =
  | 'Ashwathi'
  | 'Bharani'
  | 'Karthika'
  | 'Rohini'
  | 'Makayiram'
  | 'Thiruvathira'
  | 'Punartham'
  | 'Pooyam'
  | 'Ayilyam'
  | 'Makam'
  | 'Pooram'
  | 'Uthram'
  | 'Atham'
  | 'Chithira'
  | 'Choti'
  | 'Visakam'
  | 'Anizham'
  | 'Thrikketta'
  | 'Moolam'
  | 'Pooradam'
  | 'Uthradam'
  | 'Thiruvonam'
  | 'Avittom'
  | 'Chathayam'
  | 'Pooruttathi'
  | 'Uthrattathi'
  | 'Revathi';

export const ALL_NAKSHATRAS: Nakshatra[] = [
  'Ashwathi', 'Bharani', 'Karthika', 'Rohini', 'Makayiram', 'Thiruvathira',
  'Punartham', 'Pooyam', 'Ayilyam', 'Makam', 'Pooram', 'Uthram', 'Atham',
  'Chithira', 'Choti', 'Visakam', 'Anizham', 'Thrikketta', 'Moolam',
  'Pooradam', 'Uthradam', 'Thiruvonam', 'Avittom', 'Chathayam',
  'Pooruttathi', 'Uthrattathi', 'Revathi',
];

// ─── Order Status ─────────────────────────────────────────────────────────────
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

// ─── Offering Item (line item in an order) ────────────────────────────────────
export interface OfferingItem {
  offeringId: string;
  offeringName: string;
  priceRupees: number;
  quantity: number;
  devoteeName: string;
  nakshatra: Nakshatra;
  date: string; // ISO date string YYYY-MM-DD
}

// ─── Order ────────────────────────────────────────────────────────────────────
export interface Order {
  id: string;
  orderNumber: string; // e.g. TDB-20261026-XXXX
  templeId: string;
  devoteeName: string;
  phone: string;
  nakshatra: Nakshatra;
  offeringDate: string; // ISO date string YYYY-MM-DD
  items: OfferingItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string; // ISO datetime string
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────
export interface CreateOrderDTO {
  templeId: string;
  devoteeName: string;
  phone: string;
  nakshatra: Nakshatra;
  offeringDate: string;
  items: OfferingItem[];
  idempotencyKey: string;
}

export interface GetOrdersQuery {
  status?: OrderStatus | 'ALL';
  dateFrom?: string;
  dateTo?: string;
  phone?: string;
  page?: number;
  limit?: number;
}

// ─── Paginated Result ─────────────────────────────────────────────────────────
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── API Error ────────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'API_ERROR',
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
