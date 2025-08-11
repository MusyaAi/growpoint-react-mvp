export const metadata = { title: 'GrowPoint — Admin' };

export default function AdminHome() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-emerald-700">Админ-панель</h1>
      <p className="text-gray-600">
        Здесь появится управление контентом: эмоции, квесты, уроки, компании, пользователи.
      </p>
    </div>
  );
}