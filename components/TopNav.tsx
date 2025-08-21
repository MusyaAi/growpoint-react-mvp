'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  useApp,
  selectIsAuthed,
  selectUserName,
  selectAvatarUrl,
  selectRole,
} from '@/components/store';
import { APP_NAME } from '@/components/constants';
import type { Role } from '@/lib/models/roles';
import { markLoggedOut } from '@/lib/api/auth'; // NEW
import UserMenu from './UserMenu';

type NavItem = { href: string; label: string };

function makeItems(role: Role): NavItem[] {
  switch (role) {
    case 'employee':
      return [
        { href: '/',           label: 'Дашборд' },
        { href: '/library',    label: 'Библиотека' },
        { href: '/emotional-dictionary', label: 'Словарь' },
      ];
    case 'hr':
      return [
        { href: '/hr',            label: 'Дашборд' },
        { href: '/hr/users',      label: 'Пользователи' },
        { href: '/hr/invites',    label: 'Приглашения' },
        { href: '/hr/analytics',  label: 'Аналитика' },
      ];
    case 'admin':
    case 'superadmin':
      return [
        { href: '/admin/companies', label: 'Компании' },
        { href: '/admin/modules',   label: 'Модули/контент' },
        { href: '/admin/settings',  label: 'Настройки' },
      ];
    default:
      return [{ href: '/', label: 'Дашборд' }];
  }
}

export default function TopNav() {
  const path = usePathname();
  const router = useRouter();

  const isAuthed  = useApp(selectIsAuthed);
  const userName  = useApp(selectUserName);
  const avatarUrl = useApp(selectAvatarUrl);
  const role      = useApp(selectRole);

  // если в сторе нет массива ролей — дефолтим к полному списку для демо
  const rawRoles = useApp((s: any) => (s.user?.roles ?? s.auth?.roles ?? null)) as Role[] | null;
  const availableRoles: Role[] = (rawRoles && rawRoles.length
    ? rawRoles
    : (['employee','hr','admin','superadmin'] as Role[]));

  const setRole = useApp(s => s.setRole);
  const logout  = useApp(s => s.logout);

  const items = makeItems(role);

  const handleChangeRole = (r: Role) => {
    if (r === role) return;
    setRole(r);
    // дефолтные маршруты по ролям
    if (r === 'employee') router.push('/');
    else if (r === 'hr') router.push('/hr');
    else router.push('/admin'); // admin & superadmin
  };

  const handleLogout = () => {
    // важно очистить «текущий email» для getMe()
    markLoggedOut();
    logout();
    router.push('/auth/login');
  };

  return (
    <nav className="w-full bg-white border-b sticky top-0 z-40" role="navigation" aria-label="Главная навигация">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Лого */}
        <Link href="/" className="font-semibold text-gray-900" aria-label={`${APP_NAME} — на главную`}>
          <span className="tracking-tight">{APP_NAME}</span>
          <span className="text-emerald-500">.</span>
        </Link>

        {/* Меню разделов (контекстное по роли) */}
        <ul className="flex items-center gap-6 text-sm">
          {items.map((it) => {
            const active =
              path === it.href || (it.href !== '/' && path?.startsWith(it.href));
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={`px-2 py-1 rounded-md ${
                    active
                      ? 'text-emerald-700 font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Правая зона */}
        <div className="flex items-center gap-3">
          {isAuthed ? (
            <UserMenu
              name={userName}
              avatarUrl={avatarUrl}
              currentRole={role}
              availableRoles={availableRoles}
              onChangeRole={handleChangeRole}
              onLogout={handleLogout}
            />
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Войти
              </Link>
              <Link
                href="/auth/register"
                className="text-sm px-3 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}