'use client';

import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/components/store';
import type { Role } from '@/lib/models/roles';

type Props = {
  /** Роли, которым разрешён доступ */
  allow: Role[];
  /** Куда редиректить, если доступа нет (по умолчанию — на /auth/login?next=…) */
  redirectTo?: string;
  /** Визуальная заглушка на долю секунды, чтобы избежать «мигания» контента */
  fallback?: ReactNode;
  /** Если true — не редиректим, а просто ничего не показываем */
  silent?: boolean;
};

/**
 * Ролевой гард для клиентских страниц.
 * - Проверяет авторизацию и роль из Zustand-стора.
 * - Если не ок: редиректит на /auth/login?next=<currentPath> (или в redirectTo).
 * - На время первой отрисовки возвращает fallback (по умолчанию null), чтобы избежать мерцания.
 */
export default function RequireRole({
  allow,
  redirectTo,
  fallback = null,
  silent = false,
  children,
}: Props & { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const auth = useApp((s) => s.auth);
  const [ready, setReady] = useState(false);
  const redirectedRef = useRef(false);

  // Разрешено ли текущему пользователю
  const allowed = useMemo(() => {
    return !!auth?.isAuth && allow.includes(auth.role);
  }, [auth?.isAuth, auth?.role, allow]);

  // Дожидаемся первой клиентской инициализации стора, чтобы не было SSR-мизматча
  useEffect(() => {
    // Zustand уже инициализирован на клиенте синхронно, но даём кадр на hydration
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (allowed) return;
    if (silent) return;

    // строим next=… из текущего пути + query
    const next = pathname + (sp?.toString() ? `?${sp.toString()}` : '');
    const dest = redirectTo ?? (`/auth/login?next=${encodeURIComponent(next)}`);

    if (!redirectedRef.current) {
      redirectedRef.current = true;
      router.replace(dest);
    }
  }, [ready, allowed, silent, redirectTo, pathname, sp, router]);

  if (!ready) return <>{fallback}</>;
  if (!allowed) return silent ? null : <>{fallback}</>;

  return <>{children}</>;
}

/* =======================================================================
   Дополнительно: удобные обёртки под частые сценарии (по желанию)
   Пример:
     <OnlyHR><YourComp/></OnlyHR>
     <OnlyAdmin><YourComp/></OnlyAdmin>
   ======================================================================= */

export function OnlyEmployee(p: Omit<Props, 'allow'> & { children: ReactNode }) {
  return <RequireRole allow={['employee']} {...p} />;
}
export function OnlyHR(p: Omit<Props, 'allow'> & { children: ReactNode }) {
  return <RequireRole allow={['hr', 'admin', 'superadmin']} {...p} />;
}
export function OnlyAdmin(p: Omit<Props, 'allow'> & { children: ReactNode }) {
  return <RequireRole allow={['admin', 'superadmin']} {...p} />;
}
export function OnlySuperadmin(p: Omit<Props, 'allow'> & { children: ReactNode }) {
  return <RequireRole allow={['superadmin']} {...p} />;
}
