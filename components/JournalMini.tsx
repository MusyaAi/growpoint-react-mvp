'use client';
import { useState } from "react";
import { useApp } from "@/components/store";
import Link from "next/link";

export default function JournalMini(){
  const { journal, addJournal, lastCheckIn } = useApp();
  const [text, setText] = useState("");
  const [ok, setOk] = useState("");

  const save = () => {
    if (!text.trim()){ setOk("Пусто"); return; }
    addJournal({
      dateISO: new Date().toISOString(),
      text: text.trim(),
      emotion: lastCheckIn?.emotion,
    });
    setText("");
    setOk("Сохранено"); setTimeout(()=>setOk(""), 1200);
  };

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Дневник</h3>
        <Link href="/journal" className="text-sm text-emerald-700 hover:underline">Открыть</Link>
      </div>

      <textarea
        className="w-full h-20 border rounded-md p-2 mb-3"
        placeholder="Короткая заметка о дне…"
        value={text}
        onChange={(e)=>setText(e.target.value)}
      />
      <div className="flex items-center gap-3 mb-3">
        <button onClick={save} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700">Сохранить</button>
        {ok && <span className={`text-sm ${ok==='Сохранено' ? 'text-emerald-700' : 'text-gray-500'}`}>{ok}</span>}
      </div>

      <div className="space-y-2">
        {journal.slice(0,2).map(e=>(
          <div key={e.id} className="text-sm text-gray-700">
            <span className="text-gray-400">{new Date(e.dateISO).toLocaleDateString('ru-RU')}:</span>{" "}
            {e.text.length>80 ? e.text.slice(0,80)+"…" : e.text}
          </div>
        ))}
        {journal.length===0 && <div className="text-sm text-gray-500">Пока нет записей.</div>}
      </div>
    </div>
  );
}
