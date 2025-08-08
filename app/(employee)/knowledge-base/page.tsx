'use client';
import { useState, useMemo } from 'react';

type Module = {
  id: string;
  level: 1|2;
  title: string;
  summary: string;
  duration: string;
};

const modules: Module[] = [
  { id:'L1-emo', level:1, title:'Эмоции: что я чувствую', summary:'База эмоциональной грамотности, названия и дифференциация чувств.', duration:'10–12 мин' },
  { id:'L1-bounds', level:1, title:'Границы: где заканчиваюсь я', summary:'Осознание личных границ и первые шаги к их удержанию.', duration:'12–15 мин' },
  { id:'L1-critic', level:1, title:'Внутренний критик и самоподдержка', summary:'Переход от самопорицания к поддерживающему диалогу.', duration:'8–10 мин' },
  { id:'L2-contact', level:2, title:'Контакт без растворения', summary:'Присутствие в диалоге без слияния и угодничества.', duration:'10–12 мин' },
  { id:'L2-projection', level:2, title:'Проекции и триггеры', summary:'Как прошлое окрашивает восприятие и реакции в команде.', duration:'12–14 мин' },
  { id:'L2-honesty', level:2, title:'Честность, которая не разрушает', summary:'Фразы и рамки для безопасной откровенности.', duration:'9–11 мин' },
];

export default function KnowledgeBasePage(){
  const [level, setLevel] = useState<1|2>(1);
  const list = useMemo(()=>modules.filter(m=>m.level===level), [level]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-emerald-600">Библиотека знаний</h1>
        <div className="flex gap-2">
          <button onClick={()=>setLevel(1)} className={`px-3 py-1 rounded ${level===1?'bg-emerald-600 text-white':'border'}`}>Уровень 1</button>
          <button onClick={()=>setLevel(2)} className={`px-3 py-1 rounded ${level===2?'bg-amber-600 text-white':'border'}`}>Уровень 2</button>
        </div>
      </div>

      <p className="text-gray-600">Темы и мини-модули для текущего уровня. Контент можно расширять без изменения архитектуры.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {list.map(m=>(
          <div key={m.id} className="bg-white border rounded-xl p-5 hover:shadow transition">
            <div className="text-xs text-gray-500 mb-2">Уровень {m.level} · {m.duration}</div>
            <h3 className="font-semibold text-emerald-700">{m.title}</h3>
            <p className="text-gray-600 text-sm mt-2">{m.summary}</p>
            <div className="mt-4">
              <button className="text-sm text-emerald-700 hover:underline">Открыть модуль</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
