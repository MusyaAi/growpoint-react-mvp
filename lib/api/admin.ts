// lib/api/admin.ts
import type { CompanyDTO, ModuleDTO, Id } from './dto';
import { db, delay, uid } from './__mocks__/db';

/* ---------------------------------------
 * Компании (тенанты)
 * ------------------------------------- */
export async function listCompanies(): Promise<CompanyDTO[]> {
  await delay(120);
  return db.companies;
}

export async function createCompany(p: { name: string; domain?: string; seats?: number }): Promise<CompanyDTO> {
  await delay(220);
  const rec: CompanyDTO = {
    id: uid('co'),
    name: p.name,
    domain: p.domain,
    seats: p.seats ?? 20,
    createdAt: new Date().toISOString(),
  };
  db.companies.push(rec);
  db.persist();
  return rec;
}

/* ---------------------------------------
 * Модули (контент)
 * ------------------------------------- */
export async function listModules(): Promise<ModuleDTO[]> {
  await delay(120);
  return db.modules;
}

export async function createModule(p: { title: string; level: 1 | 2 | 3 | 4; tags?: string[] }): Promise<ModuleDTO> {
  await delay(240);
  const rec: ModuleDTO = {
    id: uid('mod'),
    title: p.title,
    level: p.level,
    tags: p.tags ?? [],
    active: true,
    createdAt: new Date().toISOString(),
  };
  db.modules.push(rec);
  db.persist();
  return rec;
}

export async function toggleModule(id: Id, active: boolean): Promise<ModuleDTO> {
  await delay(160);
  const i = db.modules.findIndex(m => m.id === id);
  if (i < 0) throw new Error('NOT_FOUND');
  db.modules[i] = { ...db.modules[i], active };
  db.persist();
  return db.modules[i];
}

/* ---------------------------------------
 * Системные настройки (Admin / Superadmin)
 * — локальные моки с localStorage.
 * ------------------------------------- */

export interface AdminSettings {
  companyLimit: number;     // лимит компаний в демо
  enableInvites: boolean;   // включены ли инвайты глобально
  privacyByDesign: boolean; // флаг для футера/копирайта и политики
}

const LS_ADMIN_SETTINGS = 'pg__admin_settings_v1';

function loadAdminSettings(): AdminSettings | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LS_ADMIN_SETTINGS);
    return raw ? (JSON.parse(raw) as AdminSettings) : null;
  } catch {
    return null;
  }
}

function saveAdminSettings(v: AdminSettings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LS_ADMIN_SETTINGS, JSON.stringify(v));
}

const ADMIN_DEFAULTS: AdminSettings = {
  companyLimit: 3,
  enableInvites: true,
  privacyByDesign: true,
};

export async function getAdminSettings(): Promise<AdminSettings> {
  await delay(120);
  return loadAdminSettings() ?? ADMIN_DEFAULTS;
}

export async function updateAdminSettings(patch: Partial<AdminSettings>): Promise<AdminSettings> {
  await delay(160);
  const current = loadAdminSettings() ?? ADMIN_DEFAULTS;
  const next = { ...current, ...patch };
  saveAdminSettings(next);
  return next;
}

