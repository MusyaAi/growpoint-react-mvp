import Link from 'next/link';
import { APP_NAME } from '@/components/constants';
import Header from '@/components/Header';

export const metadata = { title: `${APP_NAME} — Admin` };

export default function AdminHome() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Header title="Админ-панель" subtitle="Управление компаниями, модулями и системными настройками" />

      {/* Быстрые ссылки в разделы админки */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/companies"
          className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-emerald-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Компании</h3>
            <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">тенанты</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Создание/редактирование компаний, лимиты лицензий, домены.
          </p>
          <div className="mt-4 text-sm font-medium text-emerald-700 group-hover:underline">
            Перейти →
          </div>
        </Link>

        <Link
          href="/admin/modules"
          className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-emerald-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Модули / контент</h3>
            <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">уровни 1–4</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Квесты, уроки, теги, активность модулей. Управление составом треков.
          </p>
          <div className="mt-4 text-sm font-medium text-emerald-700 group-hover:underline">
            Перейти →
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-emerald-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Настройки</h3>
            <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">система</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Роли, доступы, интеграции, параметры платформы.
          </p>
          <div className="mt-4 text-sm font-medium text-emerald-700 group-hover:underline">
            Перейти →
          </div>
        </Link>
      </div>
    </div>
  );
}