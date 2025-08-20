import Header from '@/components/Header';

'use client';

import { useEffect, useState } from 'react';
import { getAdminSettings, updateAdminSettings, type AdminSettings } from '@/lib/api/admin';

export default function AdminSettingsPage() {
  const [data, setData] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // загрузка
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const s = await getAdminSettings();
        if (!alive) return;
        setData(s);
      } catch {
        if (!alive) return;
        setError('Не удалось загрузить настройки.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true); setError(null);
    try {
      const next = await updateAdminSettings(data);
      setData(next);
      setSavedAt(Date.now());
    } catch {
      setError('Не удалось сохранить. Попробуйте ещё раз.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold text-emerald-700">Системные настройки</h1>
        <p className="mt-2 text-gray-600">Загрузка…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold text-emerald-700">Системные настройки</h1>
        <p className="mt-2 text-red-600">Нет данных.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-emerald-700">Системные настройки</h1>
      <p className="mt-2 text-gray-600">
        Эти параметры применяются глобально (для ролей Admin/Superadmin).
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* 1) Лимит компаний (число) */}
        <div>
          <label htmlFor="companyLimit" className="block text-sm font-medium text-gray-700">
            Лимит компаний в демо
          </label>
          <input
            id="companyLimit"
            type="number"
            min={1}
            className="mt-1 block w-40 rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
            value={data.companyLimit}
            onChange={(e) => setData({ ...data, companyLimit: Number(e.target.value || 0) })}
          />
          <p className="mt-1 text-xs text-gray-500">Максимум компаний, которые можно создать в демо-среде.</p>
        </div>

        {/* 2) Включены ли инвайты */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-gray-700">Инвайты для компаний</div>
            <p className="text-xs text-gray-500">Позволяет HR отправлять приглашения пользователям.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              checked={data.enableInvites}
              onChange={(e) => setData({ ...data, enableInvites: e.target.checked })}
            />
            <span className="text-sm text-gray-700">Включено</span>
          </label>
        </div>

        {/* 3) Privacy by Design */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-gray-700">Privacy by design</div>
            <p className="text-xs text-gray-500">
              Глобальные настройки приватности и маркировки интерфейса.
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              checked={data.privacyByDesign}
              onChange={(e) => setData({ ...data, privacyByDesign: e.target.checked })}
            />
            <span className="text-sm text-gray-700">Включено</span>
          </label>
        </div>

        {/* Статусы/кнопки */}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {savedAt && !saving && (
          <p className="text-sm text-emerald-700">Сохранено {new Date(savedAt).toLocaleTimeString()}.</p>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? 'Сохраняем…' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  );
}
