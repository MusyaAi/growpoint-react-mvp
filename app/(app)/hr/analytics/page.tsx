import Header from '@/components/Header';

export default function HrAnalyticsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Header title="Аналитика" subtitle="Участие, вовлечённость, стресс — агрегаты" />
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-gray-600">Здесь будут графики и агрегированные метрики по компании.</p>
      </div>
    </div>
  );
}
