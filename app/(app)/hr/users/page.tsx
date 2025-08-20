import Header from '@/components/Header';

export default function HrUsersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Header title="Пользователи" subtitle="Список сотрудников и управление ролями" />
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-gray-600">Здесь появится таблица сотрудников компании.</p>
      </div>
    </div>
  );
}
