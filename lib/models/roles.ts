export type Role = 'employee' | 'hr' | 'admin_company' | 'superadmin';

export const ALL_ROLES: Role[] = ['employee', 'hr', 'admin_company', 'superadmin'];

export function roleLabel(r: Role): string {
  switch (r) {
    case 'employee': return 'Сотрудник';
    case 'hr': return 'HR';
    case 'admin_company': return 'Админ компании';
    case 'superadmin': return 'Суперадмин';
  }
}

export function defaultPathForRole(r: Role): string {
  switch (r) {
    case 'employee': return '/';
    case 'hr': return '/hr';
    case 'admin_company': return '/admin';
    case 'superadmin': return '/admin';
  }
}

export function isElevated(r: Role): boolean {
  return r === 'hr' || r === 'admin_company' || r === 'superadmin';
}
