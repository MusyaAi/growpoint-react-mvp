'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, Role } from '@/components/store';

export default function Guard({
  children,
  role,              // если указана — требуемая роль
}: {
  children: React.ReactNode;
  role?: Role;
}) {
  const router = useRouter();
  const { auth } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!auth.isAuth) {
      router.replace('/auth/login');
      return;
    }
    if (role && auth.role !== role) {
      // отправим в «свою» зону
      if (auth.role === 'admin') router.replace('/admin');
      else if (auth.role === 'hr') router.replace('/hr');
      else router.replace('/');
    }
  }, [mounted, auth.isAuth, auth.role, role, router]);

  if (!mounted) return null;
  if (!auth.isAuth) return null;
  if (role && auth.role !== role) return null;

  return <>{children}</>;
}