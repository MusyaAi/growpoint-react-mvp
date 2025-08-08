'use client';
import { useApp } from './store';
const EMOJIS = [['😊','Радость'],['😂','Веселье'],['😢','Грусть'],['😠','Злость'],['😫','Усталость'],['🥳','Восторг']];
export default function CheckIn(){
  const { setEmotion, lastEmotion } = useApp();
  return (
    <div className="bg-white p-6 rounded-2xl card-shadow space-y-4">
      <h2 className="text-lg font-bold mb-2">Ежедневный чекин</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Эмоция дня</label>
        <div className="grid grid-cols-6 gap-2">
          {EMOJIS.map(([icon, label])=>{
            const selected = lastEmotion === label;
            return (
              <button key={label} onClick={()=>setEmotion(label)} className={`text-3xl rounded-lg p-1 ${selected?'ring-2 ring-[var(--level1-accent)]':''}`} aria-label={label}>
                {icon}
              </button>
            );
          })}
        </div>
      </div>
      <button onClick={()=>alert('Ваш чекин сохранен!')} className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">Сохранить</button>
    </div>
  );
}
