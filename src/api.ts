const BASE = 'http://localhost:8000';

function getToken() {
  const raw = localStorage.getItem('token');
  // Guard against invalid stored values like "null" or "undefined"
  if (!raw || raw === 'null' || raw === 'undefined') return '';
  return raw;
}

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const tok = getToken();
  if (tok) headers['Authorization'] = `Bearer ${tok}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`API request failed with status ${res.status}`);

  // DELETE endpoints like /users/admin/users/<id>/ return 204 No Content.
  // Calling res.json() on an empty body throws, so we handle that here.
  if (res.status === 204 || res.headers.get('Content-Length') === '0') {
    return undefined as unknown as T;
  }

  return res.json();
}

export const api = {
  // Auth → POST /users/token/ → { access, refresh }
  login: (username: string, password: string) =>
    req<{ access: string; refresh: string }>('POST', '/users/token/', { username, password }),

  // Public registration → POST /users/register/ → { id, username, email }
  register: (data: { username: string; email?: string; password: string }) =>
    req<{ id: number; username: string; email: string }>('POST', '/users/register/', data),

  // Users → GET/POST /users/admin/users/ | DELETE /users/admin/users/<pk>/
  getUsers: () => req<any[]>('GET', '/users/admin/users/'),
  createUser: (data: { first_name: string; last_name: string; email: string; is_active: boolean; is_superuser: boolean }) =>
    req<any>('POST', '/users/admin/users/', data),
  deleteUser: (id: number) => req<any>('DELETE', `/users/admin/users/${id}/`),

  // Temp/SystemStat → fields: indoor_temp, humidity, server_load, external_temp, ac_level, fans_active, hour, timestamp
  getSystemStats: () => req<any[]>('GET', '/temp/list-stats/'),
  addSystemStat: (data: { indoor_temp: number; humidity: number; server_load: number; external_temp: number; ac_level: number; fans_active: number; hour: number }) =>
    req<{ action: number }>('POST', '/temp/add-stats/', data),

  // Frequency → fields: time, users, signal, freq_used
  getFrequencyData: () => req<any[]>('GET', '/freq/list-signal-data/'),
  addFrequencyData: (data: { time: number; users: number; signal: number; freq_used: number }) =>
    req<{ 'new freq': number }>('POST', '/freq/add-signal-data/', data),

  // RBS → fields: user_count, time_of_day, signal_strength, traffic_type, rbs
  getRbsData: () => req<any[]>('GET', '/rbs/list-signal-data/'),
  addRbsData: (data: { user_count: number; time_of_day: number; signal_strength: number; traffic_type: number; rbs: number }) =>
    req<{ new_rbs: number }>('POST', '/rbs/add-signal-data/', data),

  // RFID → fields: id_rfid, name, last_access, is_active
  getRfidList: () => req<any[]>('GET', '/rfid/list/'),
  createRfid: (data: { id_rfid: string; name: string; is_active: boolean }) =>
    req<any>('POST', '/rfid/create/', data),
  updateRfidAccess: (id_rfid: string) =>
    req<any>('PUT', `/rfid/update-access/${id_rfid}/`, {}),

  // Material → fields: id, name, last_maintenance, next_maintenance, status, time_left
  getMaterialList: () => req<any[]>('GET', '/materials/list/'),
  createMaterial: (data: { name: string; last_maintenance: string; next_maintenance: string; status: string; time_left: number }) =>
    req<any>('POST', '/materials/create/', data),
  updateMaterial: (id: number, data: any) =>
    req<any>('PUT', `/materials/${id}/update/`, data),

  // Logs → fields: __all__ (id, timestamp, type, zone, level, message, ...)
  getLogs: () => req<any[]>('GET', '/logs/logs/'),
  addLog: (data: any) => req<any>('POST', '/logs/logs/', data),
};
