'use client';
import { useState } from "react";
import { useApp } from "@/components/store";

const EMOJIS = [
  { e:"Радость", g:"😊" }, { e:"Спокойствие", g:"🙂" }, { e:"Усталость", g:"😫" },
  { e:"Тревога", g:"😟" }, { e:"Злость", g:"😠" }, { e:"Грусть", g:"😢" },
  { e:"Восторг", g:"🥳" }, { e:"Смущение", g:"😳" },
];

export default function CheckinEmoji(){
  const { doCheckIn } = useApp();
  const [sel, setSel] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [flags, setFlags] = useState({ sleep:false, food:false, activity:false, rest:false });
  const [ok, setOk] = useState("");

  const toggle = (k: keyof typeof flags) => setFlags(s => ({...s, [k]: !s[k]}));

  const save = () => {
    if (!sel){ setOk("Выберите эмоцию"); return; }
    try {
      doCheckIn({ emotion: sel, note: note.trim() || undefined, flags });
      setOk("Сохранено");
      setTimeout(()=>setOk(""), 1500);
      setNote("");
    } catch (e){ console.error(e); setOk("Ошибка сохранения"); }
  };

  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">Ежедневный чек-ин</h3>
        <a href="/check-in" className="text-sm text-emerald-700 hover:underline">Полная форма</a>
      </div>

      <div className="grid grid-cols-8 gap-2 mb-3">
        {EMOJIS.map(({e,g})=>(
          <button
            key={e}
            type="button"
            onClick={()=>setSel(e)}
            className={`text-2xl leading-none p-1 rounded-lg transition ${sel===e ? 'ring-2 ring-emerald-300' : 'hover:bg-gray-50'}`}
            aria-label={e}
            title={e}
          >{g}</button>
        ))}
      </div>

      <input
        className="w-full h-10 border rounded-md px-3 text-sm mb-3"
        placeholder="Короткий комментарий (необязательно)…"
        value={note} onChange={(e)=>setNote(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={flags.sleep} onChange={()=>toggle('sleep')} />
          <span>Выспался(ась)</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={flags.food} onChange={()=>toggle('food')} />
          <span>Поел(а) вовремя</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={flags.activity} onChange={()=>toggle('activity')} />
          <span>Был(а) активен(на)</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={flags.rest} onChange={()=>toggle('rest')} />
          <span>Удалось отдохнуть</span>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={save} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700">
          Сохранить
        </button>
        {ok && <span className={`text-sm ${ok==='Сохранено'?'text-emerald-700': ok==='Выберите эмоцию'?'text-gray-500':'text-red-600'}`}>{ok}</span>}
      </div>
    </div>
  );
}
