'use client';

import { APP_NAME } from '@/components/constants';
import { useApp } from '@/components/store';

export default function Header() {
  // Берём имя из профиля; если есть «как обращаться», показываем его
  const profile = useApp((s) => s.profile);
  const name = profile?.salutation?.trim() || profile?.name?.trim() || 'Гость';

  const initial =
    (name && name[0]?.toUpperCase()) || '🙂';

  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Добро пожаловать, {name}!
        </h1>
        <p className="text-gray-500">
          Ваш уровень: 1/4. Следующий шаг: работа с границами.
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <div className="text-xl font-extrabold tracking-tight text-gray-900">
          {APP_NAME}<span className="text-emerald-400">.</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center text-lg font-bold ring-4 ring-white">
          {initial}
        </div>
      </div>
    </header>
  );
}