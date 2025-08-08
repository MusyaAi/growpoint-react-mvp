import Link from "next/link";

export default function GrowthCard(){
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      <div className="flex items-start gap-5">
        {/* Индикатор прогресса — чуть крупнее */}
        <div className="w-28 h-28 rounded-full bg-emerald-50 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-[6px] border-emerald-300 relative">
            <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-emerald-400"></div>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Мой путь роста</h3>
            <Link href="/growth-map" className="text-sm text-emerald-700 hover:underline">
              Открыть карту
            </Link>
          </div>

          <div className="text-sm text-gray-600">
            Границы · <span className="text-gray-500">в процессе</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-emerald-400" style={{ width: '42%' }}></div>
          </div>

          <div className="text-xs text-gray-500">
            Учимся говорить «нет», удерживать время и энергию.
          </div>

          {/* Кликабельная нормальная кнопка → /growth-map */}
          <Link
            href="/growth-map"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
          >
            Продолжить обучение
          </Link>
        </div>
      </div>
    </div>
  );
}
