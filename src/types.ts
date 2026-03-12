export type Lang = 'EN' | 'FR' | 'AR';
export type Theme = 'dark' | 'light';
export type Page = 'dashboard' | 'energy' | 'security' | 'material' | 'users' | 'profile' | 'settings';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  min_stock: number;
  status: 'good' | 'low';
}

export interface SecurityAlert {
  id: string;
  type: string;
  zone: string;
  time: string;
  state: 'critical' | 'warning';
}

export interface RfidUser {
  id: string;
  name: string;
  zone: string;
  access_level: string;
  status: string;
}

export interface AppState {
  lang: Lang;
  theme: Theme;
  page: Page;
  token: string | null;
  username: string;
  isSuperuser: boolean;
}
