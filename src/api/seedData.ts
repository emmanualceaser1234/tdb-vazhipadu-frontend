import type { Temple, Offering, Order, Nakshatra, OrderStatus } from '../types/vazhipadu';

// ─── Temples ──────────────────────────────────────────────────────────────────
export const SEED_TEMPLES: Temple[] = [
  {
    id: 'temple-001',
    name: 'Sree Sabarimala Sastha Temple',
    code: 'SSSST',
    location: 'Pathanamthitta, Kerala',
    description:
      'The sacred abode of Lord Ayyappa situated atop the Sahyadri hills, one of the most visited pilgrimage sites in the world.',
  },
  {
    id: 'temple-002',
    name: 'Chottanikara Devi Temple',
    code: 'CDT',
    location: 'Ernakulam, Kerala',
    description:
      'An ancient temple dedicated to Goddess Bhagavathy, renowned for its divine healing powers and vibrant Kuchipudi performances.',
  },
];

// ─── Offerings ────────────────────────────────────────────────────────────────
export const SEED_OFFERINGS: Offering[] = [
  // Sabarimala
  { id: 'off-001', templeId: 'temple-001', name: 'Pushpanjali', description: 'Offering of flowers to Lord Ayyappa with chanting of vedic hymns.', priceRupees: 30, isActive: true, category: 'Daily Pooja' },
  { id: 'off-002', templeId: 'temple-001', name: 'Archana', description: 'Personalised namam chanting with 108 names of the deity.', priceRupees: 50, isActive: true, category: 'Daily Pooja' },
  { id: 'off-003', templeId: 'temple-001', name: 'Ganapathy Homam', description: 'Sacred fire ritual invoking Lord Ganapathy for obstacle removal.', priceRupees: 150, isActive: true, category: 'Homam' },
  { id: 'off-004', templeId: 'temple-001', name: 'Swayamvara Pushpanjali', description: 'Special flower offering for marital blessings.', priceRupees: 100, isActive: true, category: 'Special Pooja' },
  { id: 'off-005', templeId: 'temple-001', name: 'Payasam Neivedyam', description: 'Sweet rice kheer offered as prasadam to the deity.', priceRupees: 80, isActive: true, category: 'Neivedyam' },
  { id: 'off-006', templeId: 'temple-001', name: 'Neeranjanam', description: 'Ceremonial lamp waving ritual performed at dusk.', priceRupees: 120, isActive: true, category: 'Daily Pooja' },
  { id: 'off-007', templeId: 'temple-001', name: 'Mahaganapathy Homam', description: 'Grand fire ritual with 1008 ahutis for supreme blessings.', priceRupees: 500, isActive: true, category: 'Homam' },
  { id: 'off-008', templeId: 'temple-001', name: 'Vilakku Pooja', description: 'Special lamp lighting ceremony for prosperity.', priceRupees: 75, isActive: true, category: 'Special Pooja' },
  { id: 'off-009', templeId: 'temple-001', name: 'Abhishekam', description: 'Sacred bathing ritual of the deity with milk and honey.', priceRupees: 200, isActive: false, category: 'Abhishekam' },
  { id: 'off-010', templeId: 'temple-001', name: 'Thulabharam (Seasonal)', description: 'Devotee weighed against offerings — seasonal special only.', priceRupees: 1000, isActive: false, category: 'Special Pooja' },

  // Chottanikara
  { id: 'off-011', templeId: 'temple-002', name: 'Pushpanjali', description: 'Floral offering to Goddess Bhagavathy with sacred mantras.', priceRupees: 30, isActive: true, category: 'Daily Pooja' },
  { id: 'off-012', templeId: 'temple-002', name: 'Archana', description: 'Personalised 108-name chanting for the goddess.', priceRupees: 50, isActive: true, category: 'Daily Pooja' },
  { id: 'off-013', templeId: 'temple-002', name: 'Kumkumarchana', description: 'Offering of kumkum with Devi Sooktha chanting.', priceRupees: 90, isActive: true, category: 'Special Pooja' },
  { id: 'off-014', templeId: 'temple-002', name: 'Navagraha Pooja', description: 'Pooja to the nine planetary deities for astrological relief.', priceRupees: 175, isActive: true, category: 'Special Pooja' },
  { id: 'off-015', templeId: 'temple-002', name: 'Sudarshana Homam', description: 'Fire ritual to Lord Sudarshana for protection from evil.', priceRupees: 300, isActive: true, category: 'Homam' },
  { id: 'off-016', templeId: 'temple-002', name: 'Payasam Neivedyam', description: 'Sweet rice offering to the goddess.', priceRupees: 80, isActive: true, category: 'Neivedyam' },
  { id: 'off-017', templeId: 'temple-002', name: 'Neeranjanam', description: 'Evening lamp waving ritual at the sanctum.', priceRupees: 120, isActive: true, category: 'Daily Pooja' },
  { id: 'off-018', templeId: 'temple-002', name: 'Sahasranama Archana', description: '1000-name chanting offering for divine grace.', priceRupees: 250, isActive: true, category: 'Special Pooja' },
  { id: 'off-019', templeId: 'temple-002', name: 'Kalasha Pooja (Seasonal)', description: 'Ceremonial pot worship held during festival season only.', priceRupees: 450, isActive: false, category: 'Seasonal' },
  { id: 'off-020', templeId: 'temple-002', name: 'Elephant Procession Sponsorship', description: 'Sponsor the temple elephant procession during Utsavam — seasonal only.', priceRupees: 5000, isActive: false, category: 'Seasonal' },
];

// ─── Order seed helpers ───────────────────────────────────────────────────────
const NAKSHATRAS: Nakshatra[] = [
  'Ashwathi', 'Bharani', 'Karthika', 'Rohini', 'Makayiram', 'Thiruvathira',
  'Punartham', 'Pooyam', 'Ayilyam', 'Makam',
];

const STATUSES: OrderStatus[] = ['CONFIRMED', 'CONFIRMED', 'CONFIRMED', 'CANCELLED', 'PENDING'];

const DEVOTEE_NAMES = [
  'Arjun Menon', 'Priya Nair', 'Suresh Kumar', 'Lakshmi Pillai', 'Rajan Varma',
  'Anitha Krishnan', 'Vinod Patel', 'Deepa Suresh', 'Manoj Thomas', 'Sreeja Mohan',
  'Biju Gopinath', 'Rekha Vijayan', 'Sathish Nambiar', 'Kavitha Rajan', 'Arun Babu',
];

const PHONES = [
  '9876543210', '9123456789', '8901234567', '7890123456', '9988776655',
  '8877665544', '7766554433', '9900112233', '8800223344', '7700334455',
];

function generateOrderNumber(date: Date, seq: number): string {
  const d = date.toISOString().slice(0, 10).replace(/-/g, '');
  return `TDB-${d}-${String(seq).padStart(4, '0')}`;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function generateSeedOrders(): Order[] {
  const orders: Order[] = [];
  const start = new Date('2026-01-01');
  const end = new Date('2026-10-20');

  for (let i = 0; i < 50; i++) {
    const createdAt = randomDate(start, end);
    const offeringDate = randomDate(createdAt, new Date(createdAt.getTime() + 30 * 24 * 3600 * 1000));
    const templeId = i % 2 === 0 ? 'temple-001' : 'temple-002';
    const devoteeName = DEVOTEE_NAMES[i % DEVOTEE_NAMES.length];
    const phone = PHONES[i % PHONES.length];
    const nakshatra = NAKSHATRAS[i % NAKSHATRAS.length];
    const status = STATUSES[i % STATUSES.length];

    const offeringPool = SEED_OFFERINGS.filter((o) => o.templeId === templeId && o.isActive);
    const selectedOffering = offeringPool[i % offeringPool.length];
    const quantity = (i % 3) + 1;

    const items = [
      {
        offeringId: selectedOffering.id,
        offeringName: selectedOffering.name,
        priceRupees: selectedOffering.priceRupees,
        quantity,
        devoteeName,
        nakshatra,
        date: isoDate(offeringDate),
      },
    ];

    orders.push({
      id: `order-${String(i + 1).padStart(3, '0')}`,
      orderNumber: generateOrderNumber(createdAt, i + 1),
      templeId,
      devoteeName,
      phone,
      nakshatra,
      offeringDate: isoDate(offeringDate),
      items,
      totalAmount: selectedOffering.priceRupees * quantity,
      status,
      createdAt: createdAt.toISOString(),
    });
  }

  return orders;
}
