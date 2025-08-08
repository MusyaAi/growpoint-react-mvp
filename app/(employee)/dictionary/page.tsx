export const metadata = { title: "GrowPoint — Эмоциональный словарь" };

const groups = [
  { name: "Радость", color: "text-amber-700", words: ["Радость", "Веселье", "Восторг", "Спокойствие"] },
  { name: "Грусть", color: "text-blue-800", words: ["Грусть", "Тоска", "Усталость"] },
  { name: "Тревога", color: "text-rose-800", words: ["Тревога", "Смущение"] },
  { name: "Злость", color: "text-red-800", words: ["Злость", "Раздражение"] },
];

export default function DictionaryPage(){
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-emerald-700">Эмоциональный словарь</h1>
      <p className="text-sm text-gray-600">Базовые эмоции, описания и быстрые практики (MVP-набор).</p>

      <div className="bg-white border rounded-xl p-4">
        <input
          placeholder="Поиск эмоции…"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <div className="space-y-6">
        {groups.map(g=>(
          <div key={g.name}>
            <h2 className={`text-lg font-semibold ${g.color} mb-3`}>{g.name}</h2>
            <div className="flex flex-wrap gap-2">
              {g.words.map(w=>(
                <span key={w} className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-1 rounded">
                  {w}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
