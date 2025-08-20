'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthShell from '@/components/AuthShell';
import { TextField } from '@/components/TextField';
import { APP_NAME } from '@/components/constants';
import * as Auth from '@/lib/api/auth';
import { type Role, defaultPathForRole, roleLabel } from '@/lib/models/roles';
import { useApp } from '@/components/store';

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
const ROLE_PRIORITY: Role[] = ['admin', 'hr', 'employee'];

export default function LoginPage() {
  const router = useRouter();
  const { login: applyAuth, setActiveRole } = useApp();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [rolesHint, setRolesHint] = useState<Role[] | null>(null);

  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Подсказка по ролям: показываем, какие роли уже привязаны к e-mail
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!isEmail(email)) {
        setRolesHint(null);
        return;
      }
      setChecking(true);
      const u = await Auth.peekUserByEmail(email);
      if (!alive) return;
      setRolesHint(u?.roles ?? null);
      setChecking(false);
    })();
    return () => {
      alive = false;
    };
  }, [email]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await Auth.login(email, pass);

      // Выбираем активную роль по приоритету
      const preferred = ROLE_PRIORITY.find((r) => res.user.roles.includes(r))!;
      applyAuth(res);
      setActiveRole(preferred);

      router.replace(defaultPathForRole(preferred));
    } catch (err) {
      setError(
        err instanceof Auth.AuthError && err.code === 'NOT_FOUND'
          ? 'Пользователь не найден. Зарегистрируйтесь, пожалуйста.'
          : 'Не удалось войти. Проверьте данные и попробуйте ещё раз.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title={`Добро пожаловать в ${APP_NAME}`}
      subtitle="AI-платформа развития soft skills и лидерства."
    >
      <h2 className="mb-4 text-2xl font-bold text-emerald-700">Вход</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <TextField label="E-mail" type="email" value={email} onChange={setEmail} required />
        <TextField label="Пароль" type="password" value={pass} onChange={setPass} required />
        <p className="-mt-2 text-xs text-gray-500">В демо пароль не проверяется.</p>

        {/* Подсказка без селектора роли */}
        <p className="text-xs text-gray-500">
          {checking
            ? 'Проверяем аккаунт…'
            : rolesHint
              ? `Роли аккаунта: ${rolesHint.map((r) => roleLabel(r)).join(', ')}`
              : ' '}
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-emerald-600 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? 'Входим…' : 'Войти'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Нет аккаунта?{' '}
          <a href="/auth/register" className="text-emerald-700 hover:underline">
            Зарегистрироваться
          </a>
        </p>
      </form>
    </AuthShell>
  );
}