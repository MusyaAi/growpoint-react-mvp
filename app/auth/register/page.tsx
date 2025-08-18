'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, Role } from '@/components/store';
import AuthShell from '@/components/AuthShell';
import { TextField } from '@/components/TextField';
import { SelectField } from '@/components/SelectField';
import { APP_NAME } from '@/components/constants';

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function RegisterPage() {
  const router = useRouter();
  const { login, setProfile } = useApp();

  // поля
  const [name, setName] = useState('');
  const [salutation, setSalutation] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [role, setRole] = useState<Role>('employee');

  // валидация
  const emailOk = useMemo(() => isEmail(email), [email]);
  const passLenOk = pass.length >= 8;
  const passMatch = pass && pass2 && pass === pass2;

  const canSubmit = emailOk && passLenOk && passMatch && !!name.trim();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    // демо: «сохраняем» имя для приветствия и логиним
    setProfile({ name, salutation });
    login({ email, role });

    if (role === 'admin') router.replace('/admin');
    else if (role === 'hr') router.replace('/hr');
    else router.replace('/');
  }

  return (
    <AuthShell
      title={`Создайте аккаунт в ${APP_NAME}`}
      subtitle="AI-платформа развития soft skills и лидерства с персональными треками под ваши цели."
      // чуть сильнее визуальный баланс для длинной формы
      formMinH="min-h-[620px]"
    >
      <h2 className="text-2xl font-bold text-emerald-700 mb-4">Регистрация</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <TextField
          label="Имя"
          value={name}
          onChange={setName}
          placeholder="Елена"
          required
        />

        <TextField
          label="Как к вам обращаться"
          value={salutation}
          onChange={setSalutation}
          placeholder="Лена / коллега / друг"
        />

        {/* E-mail с лайв-валидацией */}
        <div>
          <TextField
            label="E-mail"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="name@company.com"
            required
          />
          {!email && <p className="text-xs text-gray-400 mt-1">Используется для входа и уведомлений.</p>}
          {!!email && !emailOk && (
            <p className="text-xs text-red-600 mt-1">Похоже на неверный e-mail.</p>
          )}
        </div>

        {/* Пароль + подсказка */}
        <div>
          <TextField
            label="Пароль"
            type="password"
            value={pass}
            onChange={setPass}
            placeholder="Минимум 8 символов"
            required
          />
          {!passLenOk && pass.length > 0 && (
            <p className="text-xs text-red-600 mt-1">Минимум 8 символов.</p>
          )}
          {passLenOk && (
            <p className="text-xs text-gray-400 mt-1">
              В демо проверка выполняется только на клиенте.
            </p>
          )}
        </div>

        {/* Повтор пароля */}
        <div>
          <TextField
            label="Повторите пароль"
            type="password"
            value={pass2}
            onChange={setPass2}
            required
          />
          {pass2.length > 0 && !passMatch && (
            <p className="text-xs text-red-600 mt-1">Пароли не совпадают.</p>
          )}
          {pass2.length > 0 && passMatch && (
            <p className="text-xs text-emerald-700 mt-1">Пароли совпадают.</p>
          )}
        </div>

        <SelectField
          label="Роль (для демо)"
          value={role}
          onChange={setRole}
          options={[
            { value: 'employee', label: 'Сотрудник' },
            { value: 'hr',       label: 'HR' },
            { value: 'admin',    label: 'Admin' },
          ]}
        />

        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full rounded-md py-2 font-medium text-white transition
            ${canSubmit ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-emerald-600 cursor-not-allowed'}
          `}
        >
          Зарегистрироваться
        </button>

        <p className="text-sm text-center text-gray-500">
          Уже есть аккаунт? <a href="/auth/login" className="text-emerald-700 hover:underline">Войти</a>
        </p>
      </form>
    </AuthShell>
  );
}