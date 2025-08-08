'use client';
function calc(date: Date, dob: Date){
  const days = (date.getTime() - dob.getTime())/(1000*60*60*24);
  return {
    physical: Math.sin(2*Math.PI*days/23),
    emotional: Math.sin(2*Math.PI*days/28),
    intellectual: Math.sin(2*Math.PI*days/33)
  };
}
export default function Biorhythms(){
  const dob = new Date('1990-05-15');
  const today = new Date();
  const days = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  const idx = (today.getDay()+6)%7;
  const week = Array.from({length:7}).map((_,i)=>{
    const d=new Date(today); d.setDate(today.getDate()-idx+i); return calc(d, dob);
  });
  const y=25, a=20;
  const p = week.map((d,i)=>`${i*100/6},${y - d.physical*a}`).join(' L ');
  const e = week.map((d,i)=>`${i*100/6},${y - d.emotional*a}`).join(' L ');
  const ii= week.map((d,i)=>`${i*100/6},${y - d.intellectual*a}`).join(' L ');
  const t = week[idx]; const todayX = idx*100/6;
  const arrow = (v:number)=> v>0.2?'↑':(v<-0.2?'↓':'↔');
  return (
    <div className="bg-white p-6 rounded-2xl card-shadow">
      <h2 className="text-lg font-bold mb-4">Ваши биоритмы</h2>
      <div className="relative h-24">
        <svg className="w-full h-full" viewBox="0 0 100 50">
          <line x1="0" y1="25" x2="100" y2="25" stroke="#e5e7eb" strokeWidth="0.5"/>
          <path d={`M ${p}`} stroke="var(--physical-color)" strokeWidth="1.5" fill="none" opacity="0.5"/>
          <path d={`M ${e}`} stroke="var(--emotional-color)" strokeWidth="1.5" fill="none" opacity="0.5"/>
          <path d={`M ${ii}`} stroke="var(--intellectual-color)" strokeWidth="1.5" fill="none" opacity="0.5"/>
          <line x1={todayX} y1="0" x2={todayX} y2="50" stroke="#111827" strokeWidth="0.75" strokeDasharray="2 2"/>
          <g transform="translate(0, 42)">
            {days.map((d,i)=>(<text key={i} x={i*100/6} y="0" textAnchor="middle" fontSize="5" fill="#6b7280">{d}</text>))}
          </g>
        </svg>
      </div>
      <div className="mt-4 text-sm text-center bg-gray-50 p-3 rounded-lg">
        <span className="font-bold">📊 Сегодня:</span>
        <span className="mx-1" style={{color:'var(--emotional-color)'}}>Эмоции {arrow(t.emotional)}</span> |
        <span className="mx-1" style={{color:'var(--intellectual-color)'}}>Фокус {arrow(t.intellectual)}</span> |
        <span className="mx-1" style={{color:'var(--physical-color)'}}>Энергия {arrow(t.physical)}</span>
        <p className="text-xs text-gray-500 mt-1">Лучше уделить время системным задачам, избегая перегрузки в общении.</p>
      </div>
    </div>
  );
}
