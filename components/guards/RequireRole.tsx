'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/store';
import type { Role } from '@/lib/models/roles';

export default function RequireRole({ anyOf, children }: { anyOf: Role[]; children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useApp();

  useEffect(() => {
    if (!user) { router.replace('/auth/login'); return; }
    const allowed = user.roles.some(r => anyOf.includes(r));
    if (!allowed) router.replace('/');
  }, [user, router, anyOf]);

  return <>{children}</>;
}

