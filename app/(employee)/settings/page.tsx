'use client';

import { useEffect, useMemo, useState } from 'react';
import { useApp } from '@/components/store';

// Узкая плашка-уведомление
function NoticeBar({ text, onClose }: { text: string; onClose: () => void }) {
  if (!text) return null;
  return (
    <div className="mb-4 flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-800 transition-opacity duration-300">
      <span>{text}</span>
      <button onClick={onClose} className="text-emerald-700 hover:text-emerald-900 text-sm">✕</button>
    </div>
  );
}

const isHttpUrl = (url: string) => {
  try { const u = new URL(url); return u.protocol === 'http:' || u.protocol === 'https:'; }
  catch { return false; }
};

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export default function SettingsPage() {
  const { profile, setProfile } = useApp();

  // уведомления
  const [notice, setNotice] = useState('');
  const showOk = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 2000);
  };

  // локальная форма
  const [name, setName] = useState('');
  const [salutation, setSalutation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [birthDate, setBirthDate] = useState('');              // YYYY-MM-DD
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');
  const [email, setEmail] = useState('');

  const avatarOk = useMemo(() => isHttpUrl(avatarUrl), [avatarUrl]);

  // заполняем из стора
  useEffect(() => {
    setName(profile?.name ?? '');
    setSalutation(profile?.salutation ?? '');
    setAvatarUrl(profile?.avatarUrl ?? '');
    setBirthDate(profile?.birthDate ?? '');
    setLanguage((profile?.language as 'ru' | 'en') ?? 'ru');
    setEmail(profile?.email ?? '');
  }, [profile]);

  // что изменилось?
  const dirtyProfile =
    name !== (profile?.name ?? '') ||
    salutation !== (profile?.salutation ?? '') ||
    avatarUrl !== (profile?.avatarUrl ?? '') ||
    birthDate !== (profile?.birthDate ?? '') ||
    language !== ((profile?.language as 'ru' | 'en') ?? 'ru');

  const emailDirty = email !== (profile?.email ?? '');
  const emailOk = isValidEmail(email);

  const saveProfile = () => {
    setProfile({
      name: name.trim(),
      salutation: salutation.trim(),
      avatarUrl: avatarUrl.trim(),
      birthDate: birthDate.trim(),
      language,
    });
    showOk('Настройки сохранены');
  };

  const saveEmail = () => {
    if (!emailOk) return;
    setProfile({ email: email.trim() });
    showOk('E-mail сохранён');
  };

  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const changePassword = () => {
    if (newPass.length < 8) return alert('Пароль должен быть не короче 8 символов.');
    if (newPass !== confirmPass) return alert('Пароли не совпадают.');
    alert('В MVP пароль не меняется. Реализуем после подключения бэкенда (с подтверждением по e-mail).');
  };

  return (
    <div className="mx-auto max-w-5xl py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="mb-3 text-2xl font-bold text-emerald-700">Настройки</h1>
      <NoticeBar text={notice} onClose={() => setNotice('')} />

      {/* Профиль */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Профиль</h2>

        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          {/* левая колонка */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                placeholder="Елена"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Как к вам обращаться</label>
              <input
                type="text"
                value={salutation}
                onChange={(e) => setSalutation(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                placeholder="Например: Лена"
              />
              <p className="mt-1 text-xs text-gray-500">Используется ИИ-аватаром в обращениях.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Дата рождения</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
                <p className="mt-1 text-xs text-gray-500">Формат: ГГГГ-ММ-ДД. Используется для биоритмов.</p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Язык интерфейса</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'ru' | 'en')}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                >
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={saveProfile}
              disabled={!dirtyProfile}
              className={`inline-flex items-center rounded-md px-4 py-2 text-white transition
                ${dirtyProfile ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              Сохранить профиль
            </button>
          </div>

          {/* правая колонка — аватар */}
          <div className="space-y-3">
            <div className="mx-auto flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-gray-100">
              {avatarOk ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm text-gray-400">нет фото</span>
              )}
            </div>

            <label className="mb-1 block text-sm font-medium text-gray-700">Ссылка на аватар (URL)</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://…/avatar.png"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
            <p className="mt-1 text-xs text-gray-500">PNG/JPG/WebP по ссылке. Загрузчик добавим позже.</p>
          </div>
        </div>
      </section>

      {/* Аккаунт */}
      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Аккаунт</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* E-mail */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className={`w-full rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500
                ${email && !emailOk ? 'border-red-300' : 'border-gray-300'}`}
            />
            {email && !emailOk && (
              <p className="mt-1 text-xs text-red-600">Похоже, e-mail введён с ошибкой.</p>
            )}
            <div className="mt-3">
              <button
                type="button"
                onClick={saveEmail}
                disabled={!emailDirty || !emailOk}
                className={`inline-flex items-center rounded-md px-4 py-2 text-white transition
                  ${emailDirty && emailOk ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-300 cursor-not-allowed'}`}
              >
                Сохранить e-mail
              </button>
            </div>
          </div>

          {/* Смена пароля (заглушка) */}
          <div className="rounded-xl border border-gray-100 p-4">
            <h3 className="mb-2 font-medium">Смена пароля</h3>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Новый пароль"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
              <input
                type="password"
                placeholder="Повторите новый пароль"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={changePassword}
                className="inline-flex items-center rounded-md bg-gray-700 px-4 py-2 text-white hover:bg-gray-800"
              >
                Обновить пароль
              </button>
              <p className="text-xs text-gray-500">
                В MVP пароль не изменяется. Реализуем после подключения бэкенда (с подтверждением по e-mail).
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}