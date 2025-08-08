'use client';
import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/store";

type Msg = { role: 'user'|'ai'; text: string; ts: number };

export default function AIChatPage(){
  const { lastCheckIn, profile } = useApp();
  const [msgs, setMsgs] = useState<Msg[]>([
    { role:'ai', text:`${profile.salutation ?? profile.name}, я рядом. Хотите разобрать текущую тему или эмоцию?`, ts:Date.now() }
  ]);
  const [text, setText] = useState('');

  const send = () => {
    const t = text.trim();
    if(!t) return;
    const now = Date.now();
    const userMsg: Msg = { role:'user', text:t, ts:now };
    // эхо-логика для MVP: простая контекстная подсказка
    const hint = lastCheckIn?.emotion
      ? `Вы отметили эмоцию «${lastCheckIn.emotion}». Что её вызвало? Где это чувствуется в теле? Какой маленький шаг поддержки возможен сейчас?`
      : `Опишите ситуацию в 2-3 предложениях. Я задам уточняющие вопросы.`;
    const aiMsg: Msg = { role:'ai', text:hint, ts:now+1 };
    setMsgs((m)=>[...m, userMsg, aiMsg]);
    setText('');
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-emerald-700">AI-наставник</h1>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">На дашборд</Link>
      </div>

      <div className="bg-white border rounded-2xl p-4 h-[60vh] overflow-auto space-y-3">
        {msgs.map((m,i)=>(
          <div key={i} className={`max-w-[85%] ${m.role==='ai' ? 'bg-indigo-50 border border-indigo-100' : 'bg-emerald-50 border border-emerald-100'} rounded-xl px-3 py-2 text-sm text-gray-800`}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-2xl p-3 flex gap-2">
        <input
          className="flex-1 border rounded-md px-3 py-2"
          placeholder="Напишите сообщение…"
          value={text}
          onChange={(e)=>setText(e.target.value)}
          onKeyDown={(e)=>{ if(e.key==='Enter') send(); }}
        />
        <button onClick={send} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Отправить</button>
      </div>
    </div>
  );
}
