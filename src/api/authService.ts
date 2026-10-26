import type { StaffUser, LoginCredentials } from '../types/auth';

export interface DummyAccount {
  user: StaffUser;
  password: string;
  description: string;
}

export const DUMMY_STAFF_ACCOUNTS: DummyAccount[] = [
  {
    user: {
      id: 'staff-001',
      name: 'Narayanan Namboothiri',
      email: 'admin@tdb.gov.in',
      role: 'ADMIN',
      templeName: 'All Temples (TDB HQ)',
    },
    password: 'admin123',
    description: 'TDB Central Administrator — Full management permissions',
  },
  {
    user: {
      id: 'staff-002',
      name: 'Radhakrishnan Nair',
      email: 'officer.sabarimala@tdb.gov.in',
      role: 'OFFICER',
      templeName: 'Sree Sabarimala Sastha Temple',
    },
    password: 'officer123',
    description: 'Sabarimala Temple Executive Officer',
  },
  {
    user: {
      id: 'staff-003',
      name: 'Anitha Warrier',
      email: 'officer.chottanikara@tdb.gov.in',
      role: 'OFFICER',
      templeName: 'Chottanikara Devi Temple',
    },
    password: 'officer123',
    description: 'Chottanikara Temple Officer',
  },
];

const AUTH_STORAGE_KEY = 'tdb_staff_auth_user';

export function getStoredStaffUser(): StaffUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StaffUser;
  } catch {
    return null;
  }
}

export async function loginStaff(credentials: LoginCredentials): Promise<StaffUser> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const normalizedEmail = credentials.email.trim().toLowerCase();
  const account = DUMMY_STAFF_ACCOUNTS.find(
    (acc) =>
      acc.user.email.toLowerCase() === normalizedEmail &&
      acc.password === credentials.password,
  );

  if (!account) {
    throw new Error('Invalid email or password. Please use the demo credentials below.');
  }

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(account.user));
  } catch {
    // quota exceeded fallback
  }

  return account.user;
}

export function logoutStaff(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}
