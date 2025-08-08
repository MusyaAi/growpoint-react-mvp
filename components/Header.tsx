'use client';
import { useApp } from './store';

export default function Header(){
  const name = useApp(s=>s.name);
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Добро пожаловать, {name}!</h1>
        <p className="text-gray-500">Ваш уровень: 1/4. Следующий шаг: работа с границами.</p>
      </div>
      <div className="flex items-center space-x-3">
        <div className="text-xl font-extrabold tracking-tight text-gray-900">
          growpoint<span className="text-emerald-400">.</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center text-lg font-bold ring-4 ring-white">
          {name[0]}
        </div>
      </div>
    </header>
  );
}