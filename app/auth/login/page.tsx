'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthShell from '@/components/AuthShell';
import { TextField } from '@/components/TextField';
import { SelectField } from '@/components/SelectField';
import { APP_NAME } from '@/components/constants';
import * as Auth from '@/lib/api/auth';
import { roleLabel, type Role, defaultPathForRole } from '@/lib/models/roles';
import { useApp } from '@/components/store';

function isEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

export default function LoginPage() {
  const router = useRouter();
  const { login: applyAuth, user } = useApp();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [uiRole, setUiRole] = useState<Role>('employee'); // роль, выбранная на форме (для новых аккаунтов)

  const [knownRoles, setKnownRoles] = useState<Role[] | null>(null);
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // автоопределение ролей по e‑mail
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!isEmail(email)) { setKnownRoles(null); return; }
      setChecking(true);
      const u = await Auth.peekUserByEmail(email);
      if (!alive) return;
      setKnownRoles(u?.roles ?? null);
      if (u?.roles?.length) setUiRole(u.roles[0]);
      setChecking(false);
    })();
    return () => { alive = false; };
  }, [email]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      const res = await Auth.login(email, pass, {
        allowAutoProvision: true,
        fallbackRole: uiRole,
      });
      // ВАЖНО: передаём весь AuthResponse в стор (см. обновление store ниже)
      applyAuth(res);
      const next = defaultPathForRole(res.user.roles.includes(uiRole) ? uiRole : res.user.roles[0]);
      router.replace(next);
    } catch (err) {
      setError('Не удалось войти. Проверьте данные и попробуйте ещё раз.');
    } finally { setLoading(false); }
  }

  const roleDisabled = Array.isArray(knownRoles) && knownRoles.length > 0;
  const roleOptions = (knownRoles ?? (['employee','hr','admin_company'] as Role[]));
  const helpText = roleDisabled ? `Роль закреплена за аккаунтом: ${roleLabel(roleOptions[0])}` : 'Новый e‑mail — можно выбрать роль (демо).';

  return (
    <AuthShell title={`Добро пожаловать в ${APP_NAME}`} subtitle="AI‑платформа развития soft skills и лидерства.">
      <h2 className="mb-4 text-2xl font-bold text-emerald-700">Вход</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <TextField label="E‑mail" type="email" value={email} onChange={setEmail} required />
        <TextField label="Пароль" type="password" value={pass} onChange={setPass} required />
        <p className="-mt-2 text-xs text-gray-500">В демо пароль не проверяется.</p>

        <SelectField
          label="Роль"
          value={uiRole}
          onChange={setUiRole}
          options={roleOptions.map(r => ({ value: r, label: roleLabel(r) }))}
          disabled={roleDisabled}
        />
        <p className="text-xs text-gray-500">{checking ? 'Проверяем аккаунт…' : helpText}</p>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-md bg-emerald-600 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-60">
          {loading ? 'Входим…' : 'Войти'}
        </button>
        <p className="text-center text-sm text-gray-500">Нет аккаунта? <a href="/auth/register" className="text-emerald-700 hover:underline">Зарегистрироваться</a></p>
      </form>
    </AuthShell>
  );
}

