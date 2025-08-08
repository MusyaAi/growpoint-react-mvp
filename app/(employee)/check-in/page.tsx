'use client';
import { useEffect, useState } from "react";
import { useApp } from "@/components/store";

const emotions = ["Радость","Спокойствие","Усталость","Тревога","Злость","Грусть","Восторг"];

export default function CheckInPage(){
  const { doCheckIn, lastCheckIn } = useApp();
  const [emotion, setEmotion] = useState<string|undefined>();
  const [energy, setEnergy] = useState<number>(3);
  const [note, setNote] = useState<string>("");
  const [saved, setSaved] = useState(false);

  // при заходе — подхватываем последнее сохранение
  useEffect(()=>{
    if (lastCheckIn) {
      setEmotion(lastCheckIn.emotion);
      setEnergy(lastCheckIn.energy ?? 3);
      setNote(lastCheckIn.note ?? "");
    }
  }, [lastCheckIn]);

  function save(){
    doCheckIn({ emotion, energy, note });
    setSaved(true);
    setTimeout(()=>setSaved(false), 1500);
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-emerald-600">Чек-ин состояния</h1>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded">
          Сохранено
        </div>
      )}

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Эмоция</label>
        </div>
        <div className="flex flex-wrap gap-2">
          {emotions.map(e => (
            <button key={e}
              onClick={()=>setEmotion(e)}
              className={`px-3 py-1 rounded-full border ${emotion===e?'bg-emerald-100 border-emerald-400':'hover:bg-gray-50'}`}>
              {e}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1 mt-4">Энергия (1–5)</label>
          <input type="range" min={1} max={5} value={energy}
            onChange={e=>setEnergy(parseInt(e.target.value))}
            className="w-full"/>
          <div className="text-sm text-gray-500">Текущая: {energy}</div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1 mt-4">Заметка</label>
          <textarea className="w-full border rounded-md p-2" rows={3}
            placeholder="Коротко о дне…" value={note} onChange={e=>setNote(e.target.value)} />
        </div>

        <button onClick={save}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
          Сохранить
        </button>
      </div>

      {lastCheckIn?.timestamp && (
        <div className="text-sm text-gray-600">
          Последний чек-ин: <b>{lastCheckIn.emotion ?? '—'}</b>, энергия <b>{lastCheckIn.energy ?? '—'}</b>.
        </div>
      )}
    </div>
  );
}
