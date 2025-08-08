export const metadata = { title: "GrowPoint — Библиотека" };

const items = [
  { title: "Эмоции: что я чувствую", level: 1 },
  { title: "Границы: где заканчиваюсь я", level: 1 },
  { title: "Внутренний критик и самоподдержка", level: 1 },
  { title: "Контакт без растворения", level: 2 },
];

export default function LibraryPage(){
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-emerald-700">Библиотека знаний</h1>
      <p className="text-sm text-gray-600">Материалы и модули по уровням зрелости.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((it, i)=>(
          <div key={i} className="bg-white border rounded-xl p-4 hover:shadow-sm transition">
            <div className="text-xs text-gray-500 mb-1">Уровень {it.level}</div>
            <div className="font-medium text-gray-900">{it.title}</div>
            <div className="mt-3">
              <a href="#" className="text-sm text-emerald-700 hover:underline">Открыть материал</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
