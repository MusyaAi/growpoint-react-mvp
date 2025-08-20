import Header from '@/components/Header';

export default function AdminModulesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Header title="Модули / контент" subtitle="Квесты, уроки, уровни 1–4, теги" />
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-gray-600">Здесь будет реестр модулей, их статусы и конструктор треков.</p>
      </div>
    </div>
  );
}
