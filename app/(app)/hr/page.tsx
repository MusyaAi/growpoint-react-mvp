import Header from '@/components/Header';

export default function HrDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Header title="HR — Дашборд" subtitle="Сводные показатели и быстрые действия" />
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-gray-600">Здесь будет HR-дашборд: метрики, оповещения, быстрые ссылки.</p>
      </div>
    </div>
  );
}