'use client';
import { useApp } from './store';

export default function AINudge(){
  const { fatigueCounter } = useApp();
  const message = fatigueCounter >= 3
    ? "Анна, вы отмечаете усталость уже третий день. Возможно, поможет 'Карта восстановления'."
    : "Спасибо, что отметили состояние! Регулярная рефлексия — шаг к осознанности.";
  return (
    <div className="bg-white p-6 rounded-2xl card-shadow">
      <h2 className="text-xl font-bold mb-4">Ваш AI-наставник</h2>
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </div>
        <div className="flex-grow">
          <p className="bg-indigo-50 p-4 rounded-lg text-gray-700">“{message}”</p>
        </div>
      </div>
    </div>
  );
}
