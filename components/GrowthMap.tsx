'use client';
import { useState } from 'react';

export default function GrowthMap({ onContinue }: { onContinue: ()=>void }){
  const [active, setActive] = useState<'Эмоции'|'Границы'>('Границы');
  const progress = active === 'Границы' ? 40 : 100;
  const descriptions: Record<string,string> = {
    'Эмоции':'Вы научились распознавать и называть свои чувства. Это основа эмоционального интеллекта.',
    'Границы':'Ключевая тема для здоровых отношений в команде. Учимся говорить «нет» и защищать ресурсы.'
  };
  return (
    <div className="bg-white p-6 rounded-2xl card-shadow">
      <h2 className="text-xl font-bold mb-4">Мой путь роста</h2>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 relative flex items-center justify-center">
          <svg className="w-full aspect-square" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" stroke="var(--level4-main)" opacity="0.2" fill="none" strokeWidth="8"/>
            <circle cx="50" cy="50" r="36" stroke="var(--level3-main)" opacity="0.2" fill="none" strokeWidth="8"/>
            <circle cx="50" cy="50" r="26" stroke="var(--level2-main)" opacity="0.2" fill="none" strokeWidth="8"/>
            <circle cx="50" cy="50" r="16" stroke="var(--level1-main)" fill="none" strokeOpacity="1" strokeWidth="8"/>
            <g>
              <path d="M50 34 L 50 24" stroke="#e5e7eb" strokeWidth="1.5"/>
              <g onClick={()=>setActive('Эмоции')} style={{cursor:'pointer'}}>
                <circle cx="50" cy="34" r="4" fill="var(--level1-main)"/>
              </g>
              <g onClick={()=>setActive('Границы')} style={{cursor:'pointer'}}>
                <circle cx="50" cy="24" r="5" className="pulse-ring" fill="var(--level1-accent)"/>
              </g>
            </g>
          </svg>
        </div>
        <div className="col-span-2">
          <div className="bg-gray-50 p-6 rounded-lg h-full flex flex-col justify-center">
            <h3 className="text-lg font-bold text-gray-900">{active}</h3>
            <p className="text-sm font-semibold mb-4" style={{color:'var(--level1-text)'}}>
              {active==='Границы'?'В процессе':'Пройдено'}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div className="h-2.5 rounded-full" style={{width:`${progress}%`, backgroundColor:'var(--level1-main)'}}/>
            </div>
            <p className="text-sm text-gray-500 mb-6">Прогресс: {progress}%</p>
            <p className="text-sm text-gray-600 mb-6">{descriptions[active]}</p>
            <button onClick={onContinue} className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
              Продолжить обучение
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
