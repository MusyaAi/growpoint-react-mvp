// /lib/models/roles.ts

export type Role = 'employee' | 'hr' | 'admin' | 'superadmin';

export const ALL_ROLES: Role[] = ['employee', 'hr', 'admin', 'superadmin'];

/** Человекочитаемые ярлыки (UI) */
export function roleLabel(r: Role): string {
  switch (r) {
    case 'employee':   return 'Сотрудник';
    case 'hr':         return 'HR';
    case 'admin':      return 'Администратор';
    case 'superadmin': return 'Суперадмин';
  }
}

/** Стартовый маршрут по роли */
export function defaultPathForRole(r: Role): string {
  switch (r) {
    case 'hr':         return '/hr';
    case 'admin':      return '/admin';
    case 'superadmin': return '/admin'; // суперадмин попадает в систему-админку
    case 'employee':   return '/';
  }
}

/** «Повышенные» роли (доступ к админ-секциям) */
export function isElevated(r: Role): boolean {
  return r === 'hr' || r === 'admin' || r === 'superadmin';
}

/** Приоритет выбора активной роли (слева — наивысший) */
export const ROLE_PRIORITY: Role[] = ['superadmin', 'admin', 'hr', 'employee'];