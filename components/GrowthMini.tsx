'use client';
import Link from "next/link";
import { useState } from "react";

export default function GrowthMini(){
  const [active, setActive] = useState<'Эмоции'|'Границы'>('Границы');
  const progress = active==='Границы' ? 40 : 100;
  const desc: Record<string,string> = {
    'Эмоции': 'Вы распознаёте и называете чувства. Основа саморегуляции.',
    'Границы': 'Учимся говорить «нет», удерживать время и энергию.'
  };

  return (
    <div className="bg-white border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-emerald-700">Карта роста · Уровень 1</h3>
        <Link href="/growth-map" className="text-sm text-emerald-700 hover:underline">Открыть</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center justify-center">
          <svg className="w-40" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" stroke="#e5e7eb" fill="none" strokeWidth="8"/>
            <circle cx="50" cy="50" r="16" stroke="#a7f3d0" fill="none" strokeOpacity="1" strokeWidth="8"/>
            <g>
              <path d="M50 34 L 50 24" stroke="#e5e7eb" strokeWidth="1.5"/>
              <g onClick={()=>setActive('Эмоции')} style={{cursor:'pointer'}}>
                <circle cx="50" cy="34" r="4" fill="#a7f3d0"/>
              </g>
              <g onClick={()=>setActive('Границы')} style={{cursor:'pointer'}}>
                <circle cx="50" cy="24" r="5" fill="#86efac"/>
              </g>
            </g>
          </svg>
        </div>
        <div className="md:col-span-2">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{active}</div>
              <div className="text-sm text-gray-600">{active==='Границы'?'В процессе':'Пройдено'}</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
              <div className="h-2.5 rounded-full bg-emerald-400" style={{width:`${progress}%`}}/>
            </div>
            <p className="text-sm text-gray-600">{desc[active]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
