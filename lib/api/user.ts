// lib/api/user.ts
import type { Role } from '../models/roles';

export interface MeDTO {
  id: string;
  email: string;
  roles: Role[];
  name?: string;
  salutation?: string;
  avatarUrl?: string | null;
}

export interface UpdateProfileInput {
  name?: string;
  salutation?: string;
  avatarUrl?: string | null;
}

/* Тот же localStorage, что использует lib/api/auth.ts для хранения пользователей */
const LS_USERS = 'pg__auth_users_v1';
/* Технический ключ: кто сейчас «залогинен» (мок) */
const LS_CURRENT_EMAIL = 'pg__current_email_v1';

type UserRec = { user: MeDTO; password: string };

function loadUsers(): Map<string, UserRec> {
  if (typeof window === 'undefined') return new Map();
  try {
    const raw = localStorage.getItem(LS_USERS);
    if (!raw) return new Map();
    const obj = JSON.parse(raw) as Record<string, UserRec>;
    return new Map(Object.entries(obj));
  } catch {
    return new Map();
  }
}
function saveUsers(map: Map<string, UserRec>) {
  if (typeof window === 'undefined') return;
  const obj: Record<string, UserRec> = {};
  map.forEach((v, k) => (obj[k] = v));
  localStorage.setItem(LS_USERS, JSON.stringify(obj));
}

/** Текущий пользователь (по «текущему email» из localStorage). */
export async function getMe(): Promise<MeDTO | null> {
  await new Promise(r => setTimeout(r, 120));
  if (typeof window === 'undefined') return null;
  const email = localStorage.getItem(LS_CURRENT_EMAIL);
  if (!email) return null;
  const users = loadUsers();
  return users.get(email)?.user ?? null;
}

/** Обновление базового профиля текущего пользователя. */
export async function updateProfile(patch: UpdateProfileInput): Promise<MeDTO> {
  await new Promise(r => setTimeout(r, 160));
  if (typeof window === 'undefined') throw new Error('No window');

  const email = localStorage.getItem(LS_CURRENT_EMAIL);
  if (!email) throw new Error('Not authenticated');

  const users = loadUsers();
  const rec = users.get(email);
  if (!rec) throw new Error('User not found');

  const nextUser: MeDTO = { ...rec.user, ...patch };
  users.set(email, { ...rec, user: nextUser });
  saveUsers(users);
  return nextUser;
}

/** Вспомогательная утилита для auth: пометить, какой email «текущий». */
export function __setCurrentEmail(email: string | null) {
  if (typeof window === 'undefined') return;
  if (email) localStorage.setItem(LS_CURRENT_EMAIL, email);
  else localStorage.removeItem(LS_CURRENT_EMAIL);
}