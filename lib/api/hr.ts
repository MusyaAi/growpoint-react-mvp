// lib/api/hr.ts

/** Настройки HR-профиля и дефолты инвайтов (мок с localStorage). */
export interface HrProfileSettings {
  name?: string;   // отображаемое имя HR
  title?: string;  // должность
  department?: string;  // отдел
  notifyEmail: boolean;   // событие/триггеры
  notifyDigest: boolean;    // недельный дайджест
  inviteDefaultRole: 'employee' | 'hr';
  autoAssignTrack: 'base' | 'leader' | 'custom';
  hideEmailsFromPeers: boolean;
  shareAggregatesOnly: boolean;
}

const LS_HR_SETTINGS = 'pg__hr_settings_v1';

function load(): HrProfileSettings | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LS_HR_SETTINGS);
    return raw ? (JSON.parse(raw) as HrProfileSettings) : null;
  } catch {
    return null;
  }
}
function save(v: HrProfileSettings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LS_HR_SETTINGS, JSON.stringify(v));
}

const DEFAULTS: HrProfileSettings = {
  name: '',
  title: 'HR-менеджер',
  department: 'Human Resources',
  notifyEmail: true,
  notifyDigest: true,
  inviteDefaultRole: 'employee',
  autoAssignTrack: 'base',
  hideEmailsFromPeers: true,
  shareAggregatesOnly: true,
};

export async function getHrSettings(): Promise<HrProfileSettings> {
  await new Promise(r => setTimeout(r, 120));
  return load() ?? DEFAULTS;
}

export async function updateHrSettings(patch: Partial<HrProfileSettings>): Promise<HrProfileSettings> {
  await new Promise(r => setTimeout(r, 160));
  const current = load() ?? DEFAULTS;
  const next = { ...current, ...patch };
  save(next);
  return next;
}