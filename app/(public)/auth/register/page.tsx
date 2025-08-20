'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthShell from '@/components/AuthShell';
import { TextField } from '@/components/TextField';
import { SelectField } from '@/components/SelectField';
import { APP_NAME } from '@/components/constants';
import * as Auth from '@/lib/api/auth';
import { type Role, roleLabel, defaultPathForRole } from '@/lib/models/roles';
import { useApp } from '@/components/store';

function isEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

export default function RegisterPage() {
  const router = useRouter();
  const { login: applyAuth, setProfile } = useApp();

  const [name, setName] = useState('');
  const [salutation, setSalutation] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [primaryRole, setPrimaryRole] = useState<Role>('employee');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailOk = useMemo(() => isEmail(email), [email]);
  const passLenOk = pass.length >= 8;
  const passMatch = pass && pass2 && pass === pass2;
  const canSubmit = emailOk && passLenOk && passMatch && !!name.trim();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setError(null); setLoading(true);
    try {
      const res = await Auth.register({ name, salutation: salutation || undefined, email, password: pass, primaryRole });
      setProfile({ name: res.user.name ?? name, salutation: res.user.salutation ?? salutation });
      applyAuth(res);
      router.replace(defaultPathForRole(primaryRole));
    } catch (err) {
      const msg = err instanceof Auth.AuthError
        ? (err.code === 'ALREADY_EXISTS' ? 'E‑mail уже зарегистрирован' : 'Проверьте корректность данных')
        : 'Не удалось создать аккаунт.';
      setError(msg);
    } finally { setLoading(false); }
  }

  return (
    <AuthShell title={`Создайте аккаунт в ${APP_NAME}`} subtitle="AI‑платформа развития soft skills и лидерства с персональными треками под ваши цели." formMinH="min-h-[620px]">
      <h2 className="mb-4 text-2xl font-bold text-emerald-700">Регистрация</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <TextField label="Имя" value={name} onChange={setName} placeholder="Елена" required />
        <TextField label="Как к вам обращаться" value={salutation} onChange={setSalutation} placeholder="Лена / коллега / друг" />

        <div>
          <TextField label="E‑mail" type="email" value={email} onChange={setEmail} placeholder="name@company.com" required />
          {!email && <p className="mt-1 text-xs text-gray-400">Используется для входа и уведомлений.</p>}
          {!!email && !emailOk && <p className="mt-1 text-xs text-red-600">Похоже на неверный e‑mail.</p>}
        </div>

        <div>
          <TextField label="Пароль" type="password" value={pass} onChange={setPass} placeholder="Минимум 8 символов" required />
          {!passLenOk && pass.length > 0 && <p className="mt-1 text-xs text-red-600">Минимум 8 символов.</p>}
          {passLenOk && <p className="mt-1 text-xs text-gray-400">В демо проверка выполняется только на клиенте.</p>}
        </div>

        <div>
          <TextField label="Повторите пароль" type="password" value={pass2} onChange={setPass2} required />
          {pass2.length > 0 && !passMatch && <p className="mt-1 text-xs text-red-600">Пароли не совпадают.</p>}
          {pass2.length > 0 && passMatch && <p className="mt-1 text-xs text-emerald-700">Пароли совпадают.</p>}
        </div>

        <SelectField
          label="Основная роль"
          value={primaryRole}
          onChange={setPrimaryRole}
          options={[ 'employee','hr','admin' ].map(r => ({ value: r as Role, label: roleLabel(r as Role) }))}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={!canSubmit || loading} className={`w-full rounded-md py-2 font-medium text-white transition ${canSubmit && !loading ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-emerald-600 cursor-not-allowed'}`}>
          {loading ? 'Создаём…' : 'Зарегистрироваться'}
        </button>
        <p className="text-center text-sm text-gray-500">Уже есть аккаунт? <a href="/auth/login" className="text-emerald-700 hover:underline">Войти</a></p>
      </form>
    </AuthShell>
  );
}

