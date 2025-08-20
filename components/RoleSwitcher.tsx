'use client';
import { useRouter } from 'next/navigation';
import { defaultPathForRole, roleLabel, type Role } from '@/lib/models/roles';
import { useApp } from '@/components/store';

export default function RoleSwitcher({ className = '' }: { className?: string }) {
  const router = useRouter();
  const { user, setActiveRole } = useApp();
  if (!user || !user.roles || user.roles.length <= 1) return null; // не показываем, если одна роль

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const r = e.target.value as Role;
    setActiveRole(r);
    router.replace(defaultPathForRole(r));
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="text-xs text-gray-500">Режим:</span>
      <select
        className="rounded border px-2 py-1 text-sm"
        value={user.activeRole}
        onChange={onChange}
      >
        {user.roles.map(r => (
          <option key={r} value={r}>{roleLabel(r)}</option>
        ))}
      </select>
    </div>
  );
}
