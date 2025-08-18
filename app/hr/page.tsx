import { APP_NAME } from '@/components/constants';

export const metadata = { title: `${APP_NAME} — HR` };

export default function HrHome() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold text-emerald-700">HR дашборд (заглушка)</h1>
      <p className="mt-3 text-gray-600">
        Здесь будет HR-панель: пользователи, приглашения, агрегированная аналитика.
      </p>
    </div>
  );
}