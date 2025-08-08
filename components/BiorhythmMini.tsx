'use client';
import Link from "next/link";
import { useMemo } from "react";
import { useApp } from "@/components/store";

const W = 360, H = 120, PAD = 16;

function daysRange(center: Date, total: number){
  const arr: Date[] = [];
  const start = new Date(center);
  start.setDate(center.getDate() - Math.floor(total/2));
  for (let i=0; i<total; i++){ const d = new Date(start); d.setDate(start.getDate()+i); arr.push(d); }
  return arr;
}
function daysSince(birth: Date, day: Date){
  return Math.floor((+day - +birth) / (1000*60*60*24));
}
function wave(days:number, period:number){ return Math.sin(2*Math.PI*days/period); }
function arrow(v:number){ return v>0.2 ? '↑' : v<-0.2 ? '↓' : '↔'; }

function pathFrom(vals:number[], color:string){
  const n = vals.length;
  const dx = (W - 2*PAD) / (n-1);
  const amp = (H - 2*PAD)/2;
  const mid = H/2;
  const d = vals.map((v,i)=>{
    const x = PAD + i*dx;
    const y = mid - v*amp;
    return (i===0 ? `M ${x},${y}` : `L ${x},${y}`);
  }).join(' ');
  return <path d={d} stroke={color} strokeWidth="2" fill="none" opacity="0.9"/>;
}

// Генератор краткой рекомендации
function advice(emotional:number, intellectual:number, physical:number){
  const hi = 0.25, lo = -0.25;
  const hints:string[] = [];

  if (emotional <= lo) hints.push("береги ресурс в общении");
  else if (emotional >= hi) hints.push("решай вопросы, требующие контакта");

  if (intellectual >= hi) hints.push("планируй глубинную работу");
  else if (intellectual <= lo) hints.push("избегай аналитических задач");

  if (physical >= hi) hints.push("можно брать высокий темп");
  else if (physical <= lo) hints.push("добавь паузы и отдых");

  // Приоритет: если все «ниже», фраза-заглушка
  if (hints.length === 0) return "поддерживай стабильный ритм, без перегрузок";
  return hints.join(" · ");
}

export default function BiorhythmMini(){
  const { profile } = useApp();
  const birth = profile.birthDate ? new Date(profile.birthDate) : undefined;

  const center = new Date();
  const days = useMemo(()=>daysRange(center, 7), [profile.birthDate]);

  const series = useMemo(()=>{
    if (!birth) return null;
    return {
      phys: days.map(d => wave(daysSince(birth, d), 23)),
      emot: days.map(d => wave(daysSince(birth, d), 28)),
      intel: days.map(d => wave(daysSince(birth, d), 33)),
    };
  }, [birth, days]);

  const todayIndex = 3;
  const today = (birth && series) ? {
    physical: series.phys[todayIndex],
    emotional: series.emot[todayIndex],
    intellectual: series.intel[todayIndex],
  } : undefined;

  return (
    <div className="bg-white border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-emerald-700">Биоритмы сегодня</h3>
        <Link href="/biorhythms" className="text-sm text-emerald-700 hover:underline">Подробнее</Link>
      </div>

      {!birth ? (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm">
          Укажите дату рождения в <Link href="/settings" className="text-emerald-700 underline">Настройках</Link>, чтобы видеть подсказки.
        </div>
      ) : (
        <>
          {/* Мини-график */}
          <div className="w-full overflow-hidden rounded-lg border bg-white">
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Мини-график биоритмов">
              {/* ось 0 */}
              <line x1={PAD} y1={H/2} x2={W-PAD} y2={H/2} stroke="#e5e7eb" strokeWidth="1"/>
              {/* сетка по дням */}
              {days.map((_,i)=>{
                const x = PAD + i*((W-2*PAD)/(days.length-1));
                return <line key={i} x1={x} y1={PAD} x2={x} y2={H-PAD} stroke="#f3f4f6" strokeWidth="1"/>;
              })}
              {/* сегодняшняя вертикаль */}
              {(() => {
                const x = PAD + todayIndex*((W-2*PAD)/(days.length-1));
                return <line x1={x} y1={PAD} x2={x} y2={H-PAD} stroke="#111827" strokeDasharray="4 4" strokeWidth="1"/>;
              })()}
              {/* три синусоиды */}
              {series && pathFrom(series.phys, "#6366f1")}
              {series && pathFrom(series.emot, "#10b981")}
              {series && pathFrom(series.intel, "#ef4444")}
            </svg>
          </div>

          {/* Краткие стрелки */}
          {today && (
            <div className="text-sm text-gray-700 mt-3">
              <span className="mr-3 text-emerald-700">Эмоции {arrow(today.emotional)}</span>
              <span className="mr-3 text-blue-700">Фокус {arrow(today.intellectual)}</span>
              <span className="mr-3 text-indigo-700">Энергия {arrow(today.physical)}</span>
            </div>
          )}

          {/* Текстовая подсказка дня */}
          {today && (
            <div className="mt-2 text-sm text-gray-700 bg-emerald-50 border border-emerald-200 rounded p-3">
              <b>Рекомендация:</b> {advice(today.emotional, today.intellectual, today.physical)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
