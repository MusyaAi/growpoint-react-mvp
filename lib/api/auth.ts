// lib/api/auth.ts
import { __setCurrentEmail } from './user';
import type { Role } from '../models/roles';

/* ---------- доменные типы ---------- */
export interface AuthUser {
  id: string;
  email: string;
  roles: Role[];   // множественные роли (employee | hr | admin | superadmin)
  name?: string;
  salutation?: string;
}
export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}
export class AuthError extends Error {
  code: 'INVALID_CREDENTIALS' | 'ALREADY_EXISTS' | 'NOT_FOUND' | 'NETWORK' | 'UNKNOWN';
  constructor(code: AuthError['code'], message = 'Auth error') { super(message); this.code = code; }
}

/* ---------- утилиты ---------- */
function isEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function issueToken(email: string, roles: Role[]) {
  return 'demo.' + btoa(`${email}:${roles.join(',')}:${Date.now()}`);
}

/** Нормализация ролей и миграция старого значения admin_company → admin */
function normalizeRoles(roles: readonly (Role | string)[]): Role[] {
  const mapped = roles.map(r => (r === 'admin_company' ? 'admin' : r)) as Role[];
  return Array.from(new Set(mapped)); // уникализация и сохранение порядка
}

/* ---------- persist users in localStorage ---------- */
const LS_KEY = 'pg__auth_users_v1';
type UserRec = { user: AuthUser; password: string };

function loadUsers(): Map<string, UserRec> {
  if (typeof window === 'undefined') return new Map();
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return new Map();
    const obj = JSON.parse(raw) as Record<string, UserRec>;

    // миграция ролей для всех записей
    let changed = false;
    for (const rec of Object.values(obj)) {
      const before = rec.user.roles.slice();
      rec.user.roles = normalizeRoles(rec.user.roles);
      if (before.join(',') !== rec.user.roles.join(',')) changed = true;
    }
    const map = new Map<string, UserRec>(Object.entries(obj));
    if (changed) saveUsers(map); // сохранить мигрированные роли обратно
    return map;
  } catch {
    return new Map();
  }
}
function saveUsers(map: Map<string, UserRec>) {
  if (typeof window === 'undefined') return;
  const obj: Record<string, UserRec> = {};
  map.forEach((v, k) => { obj[k] = v; });
  localStorage.setItem(LS_KEY, JSON.stringify(obj));
}

const users = loadUsers();

/* ---------- API (mock) ---------- */

/** Подсказка на логине */
export async function peekUserByEmail(email: string): Promise<AuthUser | null> {
  await new Promise(r => setTimeout(r, 120));
  const rec = users.get(email);
  if (!rec) return null;
  // на всякий случай нормализуем перед возвратом
  rec.user.roles = normalizeRoles(rec.user.roles);
  return rec.user;
}

/** Регистрация: роли = [primaryRole, 'employee'] */
export async function register(payload: {
  name: string;
  salutation?: string;
  email: string;
  password: string;
  primaryRole: Role;
}): Promise<AuthResponse> {
  await new Promise(r => setTimeout(r, 200));
  const { name, salutation, email, password, primaryRole } = payload;

  if (!isEmail(email)) throw new AuthError('INVALID_CREDENTIALS', 'Неверный e-mail');
  if (!password || password.length < 8) throw new AuthError('INVALID_CREDENTIALS', 'Минимум 8 символов');
  if (users.has(email)) throw new AuthError('ALREADY_EXISTS', 'E-mail уже зарегистрирован');

  const roles = normalizeRoles([primaryRole, 'employee']);
  const user: AuthUser = { id: 'u_' + Math.random().toString(36).slice(2), email, roles, name, salutation };

  users.set(email, { user, password });
  saveUsers(users);

  // NEW: помечаем «кто сейчас залогинен» для user.getMe()
  __setCurrentEmail(email);

  return { user, accessToken: issueToken(email, roles) };
}

/** Вход: только для существующих пользователей. */
export async function login(email: string, _password: string): Promise<AuthResponse> {
  await new Promise(r => setTimeout(r, 200));
  if (!isEmail(email)) throw new AuthError('INVALID_CREDENTIALS', 'Неверный e-mail');

  const rec = users.get(email);
  if (!rec) throw new AuthError('NOT_FOUND', 'Пользователь не найден');

  // (опционально) здесь можно проверить пароль
  // нормализуем роли на всякий случай (миграция старых записей)
  rec.user.roles = normalizeRoles(rec.user.roles);
  saveUsers(users);

  // NEW: помечаем «кто сейчас залогинен» для user.getMe()
  __setCurrentEmail(rec.user.email);

  return { user: rec.user, accessToken: issueToken(rec.user.email, rec.user.roles) };
}

/** Удаление тестового аккаунта в демо */
export async function deleteUser(email: string): Promise<void> {
  await new Promise(r => setTimeout(r, 80));
  users.delete(email);
  saveUsers(users);
}

/** NEW: служебная функция — пометить выход (очистить «текущий email») */
export function markLoggedOut() {
  __setCurrentEmail(null);
}