'use client';

export default function Dashboard(){
  return (
    <div className="space-y-6">
      <div className="text-3xl font-bold text-emerald-600">
        Tailwind подключён ✔
      </div>

      <div className="p-6 rounded-xl bg-red-200 text-red-900">
        Если ты видишь КРАСНУЮ коробку — Tailwind точно работает.
      </div>

      <div className="p-6 rounded-xl bg-blue-200 text-blue-900">
        Это второй блок для уверенности.
      </div>
    </div>
  );
}
