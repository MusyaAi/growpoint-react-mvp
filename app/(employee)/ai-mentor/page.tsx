'use client';

import { useState } from 'react';

export default function AIMentorPage() {
  const [question, setQuestion] = useState('');
  const [status, setStatus] = useState<'' | 'ok' | 'err'>('');
  const [answer, setAnswer] = useState<string>('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) {
      setStatus('err');
      setAnswer('Введите вопрос.');
      return;
    }
    // MVP-заглушка: здесь позже будет вызов бэкенда/LLM
    setStatus('ok');
    setAnswer('В демо-версии ответ генерируется после подключения AI. Спасибо за вопрос!');
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold text-emerald-600">AI-наставник</h1>
      <p className="text-gray-600">
        Задайте вопрос — в полной версии здесь ответит персональный AI-наставник.
      </p>

      {status === 'ok' && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-800">
          {answer}
        </div>
      )}
      {status === 'err' && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-red-800">
          {answer}
        </div>
      )}

      <form onSubmit={submit} className="space-y-3 bg-white border rounded-xl p-4">
        <label className="block text-sm text-gray-700">Ваш вопрос</label>
        <textarea
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          rows={5}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Опишите ситуацию или задайте вопрос…"
        />
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          Отправить
        </button>
      </form>
    </div>
  );
}
