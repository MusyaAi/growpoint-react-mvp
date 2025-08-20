import Header from '@/components/Header';

export default function AdminCompaniesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Header title="Компании" subtitle="Тенанты, домены и квоты лицензий" />
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-gray-600">Здесь будет список компаний с возможностью добавления и редактирования.</p>
      </div>
    </div>
  );
}
