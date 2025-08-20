// lib/api/__mocks__/db.ts
import type { CompanyDTO, EmployeeDTO, ModuleDTO, MetricSnapshot, Id } from '../dto';
import type { Role } from '../../models/roles';

// Ключи LS
const LS_COMPANIES = 'pg__m_companies_v1';
const LS_EMPLOYEES = 'pg__m_employees_v1';
const LS_MODULES   = 'pg__m_modules_v1';
const LS_METRICS   = 'pg__m_metrics_v1';

function nowISO(): string { return new Date().toISOString(); }
function rid(p: string) { return `${p}_${Math.random().toString(36).slice(2, 10)}`; }

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return structuredClone(fallback);
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}
function save<T>(key: string, v: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(v));
}

/* --------- начальные данные (seed) --------- */
const seedCompany: CompanyDTO = {
  id: 'c_demo',
  name: 'Demo Company',
  domain: 'demo.local',
  createdAt: nowISO(),
  seats: 50,
};

const seedEmployees: EmployeeDTO[] = [
  { id: 'e_hr', companyId: 'c_demo', email: 'hr@demo.local', name: 'HR Demo', roles: ['hr'], status: 'active', createdAt: nowISO() },
  { id: 'e_admin', companyId: 'c_demo', email: 'admin@demo.local', name: 'Admin Demo', roles: ['admin'], status: 'active', createdAt: nowISO() },
  { id: 'e_emp', companyId: 'c_demo', email: 'emp@demo.local', name: 'Employee Demo', roles: ['employee'], status: 'active', createdAt: nowISO() },
];

const seedModules: ModuleDTO[] = [
  { id: 'm_1', title: 'Саморегуляция', level: 1, tags: ['осознанность'], active: true, createdAt: nowISO() },
  { id: 'm_2', title: 'Коммуникация и обратная связь', level: 2, tags: ['коммуникации'], active: true, createdAt: nowISO() },
  { id: 'm_3', title: 'Лидерство и решения', level: 3, tags: ['лидерство'], active: true, createdAt: nowISO() },
];

const seedMetrics: MetricSnapshot[] = [
  { companyId: 'c_demo', capturedAt: nowISO(), engagement: 68, stress: 42, participation: 57 },
];

/* --------- «База» в памяти с LS-персистом --------- */
export const db = {
  companies: load<CompanyDTO[]>(LS_COMPANIES, [seedCompany]),
  employees: load<EmployeeDTO[]>(LS_EMPLOYEES, seedEmployees),
  modules:   load<ModuleDTO[]>(LS_MODULES,   seedModules),
  metrics:   load<MetricSnapshot[]>(LS_METRICS, seedMetrics),

  persist() {
    save(LS_COMPANIES, this.companies);
    save(LS_EMPLOYEES, this.employees);
    save(LS_MODULES,   this.modules);
    save(LS_METRICS,   this.metrics);
  },
};

/* --------- утилиты для API-моков --------- */
export function delay(ms = 200) { return new Promise(r => setTimeout(r, ms)); }
export const uid = (p = 'id') => rid(p);

/* Вспомогательные операции */
export function findCompany(id: Id) {
  return db.companies.find(c => c.id === id) ?? null;
}
export function findEmployee(id: Id) {
  return db.employees.find(e => e.id === id) ?? null;
}

/* Нормализация ролей (на случай мусора) */
export function normalizeRoles(rs: readonly (Role | string)[]): Role[] {
  const mapped = rs.map(r => (r === 'admin_company' ? 'admin' : r)) as Role[];
  return Array.from(new Set(mapped));
}
