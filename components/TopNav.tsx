'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp, selectIsAuthed, selectUserName, selectAvatarUrl } from '@/components/store';

const AUThed_ITEMS = [
  { href: '/', label: 'Дашборд' },
  { href: '/library', label: 'Библиотека' },
  { href: '/dictionary', label: 'Словарь' },
  { href: '/settings', label: 'Настройки' },
];

function getInitials(name?: string) {
  if (!name) return '🙂';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase() ?? '').join('') || '🙂';
}

export default function TopNav() {
  const path = usePathname();
  const router = useRouter();

  const isAuthed  = useApp(selectIsAuthed);
  const userName  = useApp(selectUserName);
  const avatarUrl = useApp(selectAvatarUrl);
  const login     = useApp(s => s.login);
  const logout    = useApp(s => s.logout);

  const items = AUThed_ITEMS; // при желании можно показать меньше пунктов для неавторизованных

  const handleLogin = () => {
    // мок-логин для MVP: считаем, что вошли как employee
    login({ email: undefined, role: 'employee' });
    router.push('/'); // на дашборд
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <nav className="w-full bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Лого */}
        <Link href="/" className="font-semibold text-gray-900">
          <span className="tracking-tight">growpoint</span>
          <span className="text-emerald-500">.</span>
        </Link>

        {/* Меню */}
        <ul className="flex items-center gap-5 text-sm">
          {items.map((it) => {
            const active = path === it.href || (it.href !== '/' && path?.startsWith(it.href));
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={`px-2 py-1 rounded-md ${
                    active ? 'text-emerald-700 font-semibold' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Правый блок: вход/выход */}
        <div className="flex items-center gap-3">
          {isAuthed ? (
            <>
              {/* аватар/инициалы и имя */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs text-emerald-700">{getInitials(userName)}</span>
                  )}
                </div>
                <span className="text-sm text-gray-700 hidden sm:inline">Привет, {userName}!</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogin(); // мок-вход без формы; если хочешь форму — убери это и оставь просто ссылку
                }}
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
