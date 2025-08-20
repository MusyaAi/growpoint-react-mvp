'use client';

import { useState } from 'react';
import Header from '@/components/Header';

/**
 * HR — Настройки профиля
 * Мок-версия без API: сохраняет в localStorage через zustand позже при желании.
 * Разделы:
 *  - Профиль (имя, должность, отдел)
 *  - Уведомления (email/push)
 *  - Онбординг/инвайты (дефолтные настройки приглашений)
 *  - Приватность (минимальные чекбоксы)
 */
export default function HrProfileSettingsPage() {
  // мок-поля (в реальности подтягиваем из стора/бекенда)
  const [name, setName] = useState('');
  const [title, setTitle] = useState('HR-менеджер');
  const [department, setDepartment] = useState('Human Resources');

  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyDigest, setNotifyDigest] = useState(true);

  const [inviteDefaultRole, setInviteDefaultRole] = useState<'employee'|'hr'>('employee');
  const [autoAssignTrack, setAutoAssignTrack] = useState<'base'|'leader'|'custom'>('base');

  const [hideEmailsFromPeers, setHideEmailsFromPeers] = useState(true);
  const [shareAggregatesOnly, setShareAggregatesOnly] = useState(true);

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: здесь вызовем API: /api/hr/profile/update
    // пока просто консоль
    console.log({
      name, title, department,
      notifyEmail, notifyDigest,
      inviteDefaultRole, autoAssignTrack,
      hideEmailsFromPeers, shareAggregatesOnly,
    });
    alert('Настройки (мок) сохранены.');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Header title="HR — Настройки профиля" subtitle="Параметры персонального профиля и дефолты для приглашений" />

      <form onSubmit={onSave} className="space-y-8">
        {/* Профиль */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Профиль</h2>
          <p className="mt-1 text-sm text-gray-600">Имя в системе, должность и отдел.</p>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Имя/отображаемое имя</label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Елена Иванова"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Должность</label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="HR-бизнес-партнёр"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Отдел / функция</label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                placeholder="Human Resources"
              />
            </div>
          </div>
        </section>

        {/* Уведомления */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Уведомления</h2>
          <p className="mt-1 text-sm text-gray-600">Что и как отправлять HR-менеджеру.</p>

          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={notifyEmail}
                onChange={e => setNotifyEmail(e.target.checked)}
              />
              <span className="text-sm text-gray-700">Email-уведомления о важной активности</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={notifyDigest}
                onChange={e => setNotifyDigest(e.target.checked)}
              />
              <span className="text-sm text-gray-700">Еженедельная сводка (digest) по участию и вовлечённости</span>
            </label>
          </div>
        </section>

        {/* Дефолты приглашений / онбординг */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Приглашения (дефолты)</h2>
          <p className="mt-1 text-sm text-gray-600">Что подставлять по умолчанию при отправке инвайтов.</p>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Роль приглашаемого по умолчанию</label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={inviteDefaultRole}
                onChange={e => setInviteDefaultRole(e.target.value as 'employee'|'hr')}
              >
                <option value="employee">Сотрудник</option>
                <option value="hr">HR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Автоматически назначать трек</label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={autoAssignTrack}
                onChange={e => setAutoAssignTrack(e.target.value as 'base'|'leader'|'custom')}
              >
                <option value="base">Базовый (устойчивость + soft skills)</option>
                <option value="leader">Лидерский (командность + решения)</option>
                <option value="custom">Укажу вручную при приглашении</option>
              </select>
            </div>
          </div>
        </section>

        {/* Приватность */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Приватность</h2>
          <p className="mt-1 text-sm text-gray-600">Уровень видимости данных HR-профиля.</p>

          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={hideEmailsFromPeers}
                onChange={e => setHideEmailsFromPeers(e.target.checked)}
              />
              <span className="text-sm text-gray-700">Скрывать мой e-mail от сотрудников</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={shareAggregatesOnly}
                onChange={e => setShareAggregatesOnly(e.target.checked)}
              />
              <span className="text-sm text-gray-700">Делиться только агрегатами (без персональных текстов)</span>
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
}
