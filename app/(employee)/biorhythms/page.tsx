'use client';
import { useMemo } from "react";
import { useApp } from "@/components/store";

type Point = { x:number; y:number };
const W = 700, H = 220, PAD = 24;

function daysRange(center: Date, total: number){
  const arr: Date[] = [];
  const start = new Date(center);
  start.setDate(center.getDate() - Math.floor(total/2));
  for (let i=0; i<total; i++){
    const d = new Date(start);
    d.setDate(start.getDate()+i);
    arr.push(d);
  }
  return arr;
}
function daysSince(birth: Date, day: Date){
  return Math.floor((+day - +birth) / (1000*60*60*24));
}
function wave(days:number, period:number){ return Math.sin(2*Math.PI*days/period); }
function pathFrom(vals:number[], color:string){
  const n = vals.length;
  const dx = (W - 2*PAD) / (n-1);
  const amp = (H - 2*PAD)/2;
  const mid = H/2;
  const pts: Point[] = vals.map((v,i)=>({ x: PAD + i*dx, y: mid - v*amp }));
  const d = pts.map((p,i)=> (i===0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ');
  return <path d={d} stroke={color} strokeWidth="2" fill="none" opacity="0.9"/>;
}
function arrow(v:number){ return v>0.2 ? '↑' : v<-0.2 ? '↓' : '↔'; }

export default function BiorhythmsPage(){
  const { profile } = useApp();
  const birth = profile.birthDate ? new Date(profile.birthDate) : undefined;
  const center = new Date();
  const days = useMemo(()=>daysRange(center, 7), [profile.birthDate]); // неделя

  const series = useMemo(()=>{
    if (!birth) return null;
    const phys = days.map(d => wave(daysSince(birth, d), 23));
    const emot = days.map(d => wave(daysSince(birth, d), 28));
    const intel = days.map(d => wave(daysSince(birth, d), 33));
    return { phys, emot, intel };
  }, [birth, profile.birthDate]);

  const todayIndex = 3; // центр недели
  const today = birth && series ? {
    physical: series.phys[todayIndex],
    emotional: series.emot[todayIndex],
    intellectual: series.intel[todayIndex],
  } : undefined;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-emerald-600">Биоритмы дня</h1>

      {!birth && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          Укажите дату рождения в разделе «Настройки», чтобы видеть биоритмы.
        </div>
      )}

      {birth && series && (
        <>
          <div className="bg-white border rounded-2xl p-4">
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="График биоритмов">
              {/* ось X (нулевая линия) */}
              <line x1={PAD} y1={H/2} x2={W-PAD} y2={H/2} stroke="#e5e7eb" strokeWidth="1"/>
              {/* сетка по дням */}
              {days.map((d,i)=>{
                const x = PAD + i*((W-2*PAD)/(days.length-1));
                return <line key={i} x1={x} y1={PAD} x2={x} y2={H-PAD} stroke="#f3f4f6" strokeWidth="1"/>;
              })}
              {/* сегодняшняя вертикаль */}
              {(() => {
                const x = PAD + todayIndex*((W-2*PAD)/(days.length-1));
                return <line x1={x} y1={PAD} x2={x} y2={H-PAD} stroke="#111827" strokeDasharray="4 4" strokeWidth="1"/>;
              })()}

              {/* три синусоиды */}
              {pathFrom(series.phys, "#6366f1" /* индиго */)}
              {pathFrom(series.emot, "#10b981" /* emerald */)}
              {pathFrom(series.intel, "#ef4444" /* красный */)}

              {/* подписи дней */}
              {days.map((d,i)=>{
                const x = PAD + i*((W-2*PAD)/(days.length-1));
                const label = d.toLocaleDateString('ru-RU', { weekday:'short' });
                return <text key={i} x={x} y={H-PAD/2} fontSize="11" fill="#6b7280" textAnchor="middle">{label}</text>;
              })}
            </svg>
          </div>

          {/* суммарная подсказка на сегодня */}
          {today && (
            <div className="bg-white border rounded-2xl p-4">
              <div className="text-gray-700">
                <b>Сегодня:</b>
                <span className="ml-3 text-emerald-700">Эмоции {arrow(today.emotional)}</span> ·
                <span className="ml-3 text-blue-700">Фокус {arrow(today.intellectual)}</span> ·
                <span className="ml-3 text-indigo-700">Энергия {arrow(today.physical)}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Подсказка: «↓» — беречь ресурс; «↔» — рутинные задачи; «↑» — сложные и стратегические.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
