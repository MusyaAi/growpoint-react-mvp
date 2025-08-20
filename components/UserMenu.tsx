'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Role } from '@/lib/models/roles';

type Props = {
  name?: string;
  avatarUrl?: string;
  currentRole: Role;
  availableRoles: Role[];
  onChangeRole: (r: Role) => void;
  onLogout: () => void;
};

function getInitials(name?: string) {
  if (!name) return '🙂';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase() ?? '').join('') || '🙂';
}

function settingsHrefFor(role: Role): string {
  if (role === 'hr') return '/hr/settings';
  if (role === 'admin' || role === 'superadmin') return '/admin/settings';
  return '/settings'; // employee по умолчанию
}

export default function UserMenu({
  name,
  avatarUrl,
  currentRole,
  availableRoles,
  onChangeRole,
  onLogout,
}: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!popRef.current || !btnRef.current) return;
      if (!popRef.current.contains(e.target as Node) && !btnRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 hover:bg-gray-50"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-emerald-200 bg-emerald-50">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-emerald-700">{getInitials(name)}</span>
          )}
        </span>
        <span className="hidden sm:block text-sm text-gray-700">
          Привет, {name || 'Гость'}!
        </span>
        <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden className="text-gray-500">
          <path d="M5 7l5 6 5-6H5z" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <div
          ref={popRef}
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-lg z-50"
        >
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">Профиль</div>
          <Link
            href={settingsHrefFor(currentRole)}
            className="block rounded-md px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-50"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Настройки профиля
          </Link>

          <div className="mt-2 border-t border-gray-200" />

          <div className="px-2 pt-2 pb-1 text-xs font-semibold text-gray-500">Режим</div>
          <ul className="mb-2">
            {availableRoles.map((r) => (
              <li key={r}>
                <button
                  type="button"
                  className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm hover:bg-gray-50 ${
                    r === currentRole ? 'text-emerald-700 font-medium' : 'text-gray-700'
                  }`}
                  onClick={() => { onChangeRole(r); setOpen(false); }}
                >
                  <span>
                    {r === 'employee' ? 'Сотрудник' :
                     r === 'hr' ? 'HR' :
                     r === 'admin' ? 'Администратор' :
                     r === 'superadmin' ? 'Суперадмин' : r}
                  </span>
                  <span
                    aria-hidden
                    className={`ml-2 h-4 w-4 rounded-full border ${
                      r === currentRole ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-2 border-t border-gray-200" />

          <button
            type="button"
            className="mt-2 w-full rounded-md px-2.5 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            onClick={() => { setOpen(false); onLogout(); }}
            role="menuitem"
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
}