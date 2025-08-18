'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, Role } from '@/components/store';
import { APP_NAME } from '@/components/constants';
import AuthShell from '@/components/AuthShell';
import { TextField } from '@/components/TextField';
import { SelectField } from '@/components/SelectField';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [pass, setPass]   = useState('');
  const [role, setRole]   = useState<Role>('employee');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    login({ email, role });
    if (role === 'admin') router.replace('/admin');
    else if (role === 'hr') router.replace('/hr');
    else router.replace('/'); // дашборд сотрудника
  }

  return (
    <AuthShell
      title={`Добро пожаловать в ${APP_NAME}`}
      subtitle="AI-платформа развития soft skills и лидерства с персональными треками под ваши цели."
    >
      <h2 className="text-2xl font-bold text-emerald-700 mb-4">Вход</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <TextField label="E-mail" type="email" value={email} onChange={setEmail} required />
        <TextField label="Пароль" type="password" value={pass} onChange={setPass} required />
        <p className="text-xs text-gray-500 -mt-2">В демо пароль не проверяется.</p>

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
          className="w-full rounded-md bg-emerald-600 py-2 text-white font-medium hover:bg-emerald-700"
        >
          Войти
        </button>

        <p className="text-sm text-center text-gray-500">
          Нет аккаунта? <a href="/auth/register" className="text-emerald-700 hover:underline">Зарегистрироваться</a>
        </p>
      </form>
    </AuthShell>
  );
}