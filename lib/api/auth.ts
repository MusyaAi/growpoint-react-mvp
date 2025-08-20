// (mock implementation; swap internals to real fetch later)
// ===============================
import type { Role } from '../models/roles';

export interface AuthUser {
  id: string;
  email: string;
  roles: Role[];        // множественные роли
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

// --- demo storage (in‑memory) ---------------------------------------------
const users = new Map<string, { user: AuthUser; password: string }>();

function isEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function issueToken(email: string, roles: Role[]) { return 'demo.' + btoa(`${email}:${roles.join(',')}:${Date.now()}`); }

export async function peekUserByEmail(email: string): Promise<AuthUser | null> {
  await new Promise(r => setTimeout(r, 120));
  const rec = users.get(email);
  return rec ? rec.user : null;
}

export async function register(payload: {
  name: string;
  salutation?: string;
  email: string;
  password: string;
  primaryRole: Role;    // выбранная на форме роль
}): Promise<AuthResponse> {
  await new Promise(r => setTimeout(r, 200));
  const { name, salutation, email, password, primaryRole } = payload;

  if (!isEmail(email)) throw new AuthError('INVALID_CREDENTIALS', 'Неверный e-mail');
  if (!password || password.length < 8) throw new AuthError('INVALID_CREDENTIALS', 'Минимум 8 символов');
  if (users.has(email)) throw new AuthError('ALREADY_EXISTS', 'E-mail уже зарегистрирован');

  // Всякий зарегистрированный пользователь всегда имеет роль employee
  const roles: Role[] = Array.from(new Set<Role>(['employee', primaryRole]));
  const user: AuthUser = { id: 'u_' + Math.random().toString(36).slice(2), email, roles, name, salutation };
  users.set(email, { user, password });
  return { user, accessToken: issueToken(email, roles) };
}

export interface LoginOptions {
  // для демо: если пользователя нет, можно автоматически создать с fallback‑ролью
  allowAutoProvision?: boolean;
  fallbackRole?: Role; // используется только когда allowAutoProvision=true и user не найден
}

export async function login(email: string, password: string, opts?: LoginOptions): Promise<AuthResponse> {
  await new Promise(r => setTimeout(r, 200));
  if (!isEmail(email)) throw new AuthError('INVALID_CREDENTIALS', 'Неверный e-mail');

  const rec = users.get(email);
  if (!rec) {
    if (opts?.allowAutoProvision) {
      const primary: Role = opts.fallbackRole ?? 'employee';
      const roles: Role[] = Array.from(new Set<Role>(['employee', primary]));
      const user: AuthUser = { id: 'u_' + Math.random().toString(36).slice(2), email, roles };
      users.set(email, { user, password });
      return { user, accessToken: issueToken(email, roles) };
    }
    throw new AuthError('NOT_FOUND', 'Пользователь не найден');
  }

  // демо: пароль не проверяем жёстко
  return { user: rec.user, accessToken: issueToken(rec.user.email, rec.user.roles) };
}
