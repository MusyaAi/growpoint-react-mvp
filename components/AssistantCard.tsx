'use client';
import Link from "next/link";
import { useApp } from "@/components/store";

function genHint(emotion?: string){
  if (emotion === 'Усталость') return 'Похоже на снижение ресурса. Предлагаю 2-минутную паузу и «дыхание 4-7-8».';
  if (emotion === 'Злость') return 'Заметьте триггер и назовите потребность. Предложить безопасную фразу для диалога?';
  if (emotion === 'Тревога') return 'Разделим «факт / интерпретация». Хочу задать 3 уточняющих вопроса.';
  return 'Готов помочь с рефлексией и подсказать следующий шаг на текущем уровне.';
}

export default function AssistantCard(){
  const { lastCheckIn } = useApp();
  const msg = genHint(lastCheckIn?.emotion);

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center text-indigo-500 font-bold">AI</div>
        <div className="flex-1">
          <div className="text-sm text-gray-800">{msg}</div>
          <Link href="/ai" className="inline-block mt-3 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700">
            Открыть диалог
          </Link>
        </div>
      </div>
    </div>
  );
}
