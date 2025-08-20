// lib/api/employees.ts
import type { EmployeeDTO, Id } from './dto';
import { db, delay, uid, normalizeRoles } from './__mocks__/db';
import type { Role } from '../models/roles';

/** Список сотрудников компании */
export async function listEmployees(companyId: Id): Promise<EmployeeDTO[]> {
  await delay(180);
  return db.employees.filter(e => e.companyId === companyId);
}

/** Получить сотрудника по id */
export async function getEmployee(id: Id): Promise<EmployeeDTO | null> {
  await delay(120);
  return db.employees.find(e => e.id === id) ?? null;
}

/** Пригласить сотрудника (email + роли) */
export async function inviteEmployee(p: { companyId: Id; email: string; roles?: Role[]; name?: string }): Promise<EmployeeDTO> {
  await delay(220);
  const exists = db.employees.find(e => e.email.toLowerCase() === p.email.toLowerCase() && e.companyId === p.companyId);
  if (exists) return exists;

  const rec: EmployeeDTO = {
    id: uid('emp'),
    companyId: p.companyId,
    email: p.email,
    name: p.name,
    roles: normalizeRoles([...(p.roles ?? ['employee'])]),
    status: 'invited',
    createdAt: new Date().toISOString(),
  };
  db.employees.push(rec);
  db.persist();
  return rec;
}

/** Обновить карточку сотрудника (имя, роли, статус) */
export async function updateEmployee(id: Id, patch: Partial<Pick<EmployeeDTO, 'name' | 'roles' | 'status'>>): Promise<EmployeeDTO> {
  await delay(180);
  const i = db.employees.findIndex(e => e.id === id);
  if (i < 0) throw new Error('NOT_FOUND');
  const current = db.employees[i];

  const next: EmployeeDTO = {
    ...current,
    ...patch,
    roles: patch.roles ? normalizeRoles(patch.roles) : current.roles,
  };
  db.employees[i] = next;
  db.persist();
  return next;
}

/** Удалить сотрудника */
export async function removeEmployee(id: Id): Promise<void> {
  await delay(140);
  const before = db.employees.length;
  db.employees = db.employees.filter(e => e.id !== id);
  if (db.employees.length !== before) db.persist();
}
