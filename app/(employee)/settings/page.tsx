'use client';
import { useEffect, useState } from "react";
import { useApp } from "@/components/store";

export default function SettingsPage(){
  const { profile, setProfile } = useApp();

  const [name, setName] = useState('');
  const [salutation, setSalutation] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [language, setLanguage] = useState<'ru'|'en'>('ru');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saved, setSaved] = useState<string>("");

  useEffect(()=>{
    setName(profile.name ?? '');
    setSalutation(profile.salutation ?? profile.name ?? '');
    setBirthDate(profile.birthDate ?? '');
    setLanguage((profile.language as 'ru'|'en') ?? 'ru');
    setAvatarUrl(profile.avatarUrl ?? '');
  }, [profile]);

  function save(){
    setProfile({
      name: name.trim() || 'Елена',
      salutation: salutation.trim() || name.trim() || 'Елена',
      birthDate: birthDate || undefined,
      language,
      avatarUrl: avatarUrl.trim(),
    });
    setSaved("Сохранено");
    setTimeout(()=>setSaved(""), 1500);
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-emerald-600">Настройки</h1>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded">
          {saved}
        </div>
      )}

      <div className="bg-white border rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Левая колонка */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Имя</label>
            <input
              className="w-full border rounded-md p-2"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Ваше имя"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Как к вам обращаться</label>
            <input
              className="w-full border rounded-md p-2"
              value={salutation}
              onChange={(e)=>setSalutation(e.target.value)}
              placeholder="Например: Елена"
            />
            <p className="text-xs text-gray-500 mt-1">
              Используется ИИ-аватаром в обращениях.
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Дата рождения</label>
            <input
              type="date"
              className="w-full border rounded-md p-2"
              value={birthDate}
              onChange={(e)=>setBirthDate(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Формат: ГГГГ-ММ-ДД. Используется для расчёта биоритмов.
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Язык интерфейса</label>
            <select
              className="w-full border rounded-md p-2"
              value={language}
              onChange={(e)=>setLanguage(e.target.value as 'ru'|'en')}
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* Правая колонка */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Ссылка на аватар (URL)</label>
            <input
              className="w-full border rounded-md p-2"
              value={avatarUrl}
              onChange={(e)=>setAvatarUrl(e.target.value)}
              placeholder="https://…/avatar.png"
            />
            <p className="text-xs text-gray-500 mt-1">
              В MVP — ссылка. Загрузчик добавим позже.
            </p>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border">
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover"/>
                : <div className="w-full h-full flex items-center justify-center text-gray-400">Нет</div>
              }
            </div>
            <div className="text-sm text-gray-500">
              Предпросмотр аватара
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={save}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
