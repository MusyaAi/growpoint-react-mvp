'use client';
import { useState } from "react";
import { useApp } from "@/components/store";

export default function JournalPage(){
  const { journal, addJournal, deleteJournal, lastCheckIn } = useApp();
  const [text, setText] = useState("");
  const [ok, setOk] = useState("");

  const save = () => {
    if (!text.trim()){ setOk("Пустая запись"); return; }
    addJournal({
      dateISO: new Date().toISOString(),
      text: text.trim(),
      emotion: lastCheckIn?.emotion,
    });
    setText("");
    setOk("Сохранено");
    setTimeout(()=>setOk(""), 1200);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-emerald-600">Цифровой дневник</h1>

      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <textarea
          className="w-full min-h-[120px] border rounded-md p-3"
          placeholder="О чём был ваш день? Что вы заметили в себе?"
          value={text}
          onChange={(e)=>setText(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <button onClick={save} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
            Сохранить запись
          </button>
          {ok && <span className={ok==='Сохранено' ? 'text-emerald-700 text-sm' : 'text-gray-500 text-sm'}>{ok}</span>}
        </div>
        <p className="text-xs text-gray-500">Последний чек-ин: {lastCheckIn?.emotion ?? "—"}</p>
      </div>

      <div className="space-y-3">
        {journal.length === 0 && (
          <div className="text-gray-500 text-sm">Записей пока нет.</div>
        )}
        {journal.map(e=>(
          <div key={e.id} className="bg-white border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">
                {new Date(e.dateISO).toLocaleString('ru-RU')}
                {e.emotion ? ` · ${e.emotion}` : ""}
              </div>
              <button onClick={()=>deleteJournal(e.id)} className="text-sm text-red-600 hover:underline">Удалить</button>
            </div>
            <div className="text-gray-800 whitespace-pre-wrap">{e.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
