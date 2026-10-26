export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'OFFICER';
  templeName?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
