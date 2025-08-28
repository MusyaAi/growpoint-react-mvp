'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { EmotionRich } from '@/lib/ds/emotions';

// Иконки вкладок
const icons: Record<string, string> = {
  Погружение: '🌊',
  Суть: '🎯',
  Триггеры: '⚡️',
  Мысли: '🧠',
  Тело: '🧘',
  Поведение: '🚶',
  Влияние: '🌐',
  Поддержка: '❤️',
  Практика: '🛠️',
};

// Ключи localStorage
const LSK_FAVORITES = 'pg:favorites';
const LSK_STUDIED  = 'pg:studied';

// Сбор вкладок по наличию контента
function buildTabs(e: EmotionRich | null) {
  if (!e) return [] as string[];
  const t: string[] = [];
  if (e.immersion?.length || e.media?.image || e.media?.audio) t.push('Погружение');
  if (e.definition) t.push('Суть');
  if (e.triggers?.length) t.push('Триггеры');
  if (e.autoThoughts?.length) t.push('Мысли');
  if (e.somatic?.length) t.push('Тело');
  if (e.behaviors?.length) t.push('Поведение');
  if (
    e.impact?.communication?.length ||
    e.impact?.leadership?.length ||
    e.impact?.selfPerception?.length
  )
    t.push('Влияние');
  if (e.selfSupport?.length) t.push('Поддержка');
  if (e.microPractice?.length) t.push('Практика');
  return t;
}

// helpers для localStorage (без spread Set)
function loadSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    const arr = raw ? (JSON.parse(raw) as string[]) : [];
    return new Set(arr);
  } catch {
    return new Set();
  }
}
function saveSet(key: string, s: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(s)));
  } catch {}
}

export default function EmotionDetailsPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const [data, setData] = useState<EmotionRich | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [active, setActive] = useState<string>(''); // текущая вкладка
  const [fav, setFav] = useState(false);

  // modal note
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');

  // загрузка данных
  useEffect(() => {
    let alive = true;
    setNotFound(false);
    setData(null);
    setActive('');
    fetch(`/api/emotions/${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!alive) return;
        if (!json) {
          setNotFound(true);
          return;
        }
        const e = json as EmotionRich;
        setData(e);

        // отметить как изученную
        const studied = loadSet(LSK_STUDIED);
        studied.add(e.slug);
        saveSet(LSK_STUDIED, studied);

        // состояние избранного
        const favs = loadSet(LSK_FAVORITES);
        setFav(favs.has(e.slug));
      })
      .catch(() => setNotFound(true));
    return () => {
      alive = false;
    };
  }, [slug]);

  // вкладки
  const tabs = useMemo(() => buildTabs(data), [data]);
  useEffect(() => {
    if (!active && tabs.length) setActive(tabs[0]);
  }, [tabs, active]);

  // прогресс по семейству
  const familyCounts = useMemo(() => {
    if (!data) return { familyTotal: 0, familyStudied: 0 };
    // простая оценка: сколько эмоций в этом семействе среди 33 карточек
    // чтобы не тащить весь список — берем эвристику из slug-ов studied
    const studied = loadSet(LSK_STUDIED);
    const studiedArr = Array.from(studied);
    const familyStudied = studiedArr.filter((s) => s !== data.slug && s.length > 0).length + 1;
    // для MVP выставим фиксированный familyTotal (например 3 в семействе shame)
    const familyTotal = 3;
    return { familyTotal, familyStudied: Math.min(familyStudied, familyTotal) };
  }, [data]);

  function toggleFav() {
    if (!data) return;
    const set = loadSet(LSK_FAVORITES);
    if (set.has(data.slug)) {
      set.delete(data.slug);
      setFav(false);
    } else {
      set.add(data.slug);
      setFav(true);
    }
    saveSet(LSK_FAVORITES, set);
  }

  // заглушки состояний
  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/emotional-dictionary" className="text-emerald-700 hover:underline">
          ← Вернуться к библиотеке
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Эмоция не найдена</h1>
        <p className="mt-2 text-gray-600">Возможно, она была переименована или удалена.</p>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="h-6 w-48 rounded bg-gray-100" />
        <div className="mt-2 h-5 w-80 rounded bg-gray-100" />
        <div className="mt-6 h-48 w-full rounded-2xl bg-gray-50 border border-gray-200" />
      </div>
    );
  }

  return (
    // full-bleed фон
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-emerald-50">
      <div className="min-h-screen">
        {/* Шапка */}
        <header className="mx-auto max-w-6xl px-4 pt-8">
          <nav className="text-sm text-emerald-700/80">
            <Link href="/emotional-dictionary" className="hover:underline">
              Библиотека
            </Link>
            <span className="mx-1">/</span>
            <span className="hover:underline">{data.family.toUpperCase()}</span>
            <span className="mx-1">/</span>
            <span className="text-gray-700">{data.title}</span>
          </nav>
          <div className="mt-3 flex items-center gap-4">
            <div className="text-5xl" aria-hidden>
              {data.emoji}
            </div>
            <div>
              <div
                className="text-[10px] uppercase tracking-wider font-semibold"
                style={{ color: data.color }}
              >
                Семейство: {data.family.toUpperCase()}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                {data.title}
              </h1>
              {data.subtitle && <p className="mt-1 text-gray-600">{data.subtitle}</p>}
            </div>
          </div>
        </header>

        {/* Основной контент */}
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Левая колонка */}
          <div className="space-y-4">
            {/* Вкладки */}
            {tabs.length > 0 && (
              <div className="flex flex-wrap gap-2 text-sm">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActive(tab)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all duration-200 ${
                      active === tab
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-emerald-50 border border-emerald-100'
                    }`}
                  >
                    <span>{icons[tab] ?? '•'}</span>
                    <span>{tab}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Контент вкладок */}
            <section className="transition-opacity duration-300 space-y-4">
              {active === 'Погружение' && (
                <>
                  {/* 1) КАРТИНКА — КВАДРАТ/ПО ПО ШИРИНЕ, ВЫШЕ */}
                  <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                    {data.media?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={data.media.image}
                        alt=""
                        className="w-full rounded-xl object-cover"
                        style={{
                          aspectRatio: '1 / 1', // квадрат
                        }}
                      />
                    ) : (
                      <div className="rounded-xl bg-gradient-to-br from-emerald-100 to-white flex items-center justify-center text-emerald-700"
                           style={{ aspectRatio: '1 / 1' }}>
                        Иллюстрация (скоро)
                      </div>
                    )}
                  </div>

                  {/* 2) НИЖЕ — АУДИО + ТЕКСТ ПОД НЕЙ (ОДНА КОЛОНКА) */}
                  <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Аудио-погружение</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        3–4 минуты, чтобы прожить чувство телесно.
                      </p>
                      {data.media?.audio ? (
                        <audio className="mt-3 w-full" controls preload="none">
                          <source src={data.media.audio} type="audio/mp4" />
                          <source src={data.media.audio} type="audio/x-m4a" />
                          Ваш браузер не поддерживает аудио.
                        </audio>
                      ) : (
                        <div className="mt-3 text-gray-400 text-sm">Аудио скоро появится</div>
                      )}
                    </div>
                    {!!data.immersion?.length && (
                      <div className="text-gray-700 leading-relaxed space-y-3">
                        {data.immersion.map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {active === 'Суть' && data.definition && (
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900">Суть</h2>
                  <p className="mt-3 text-gray-700 leading-relaxed max-w-3xl">
                    {data.definition}
                  </p>
                </div>
              )}

              {active === 'Триггеры' && !!data.triggers?.length && (
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900">Типичные триггеры</h2>
                  <ul className="mt-4 list-disc pl-5 text-gray-700 space-y-2 leading-relaxed">
                    {data.triggers.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              {active === 'Мысли' && !!data.autoThoughts?.length && (
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900">Автоматические мысли</h2>
                  <ul className="mt-4 list-disc pl-5 text-gray-700 space-y-2 leading-relaxed">
                    {data.autoThoughts.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              {active === 'Тело' && !!data.somatic?.length && (
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900">Телесные маркеры</h2>
                  <ul className="mt-4 list-disc pl-5 text-gray-700 space-y-2 leading-relaxed">
                    {data.somatic.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              {active === 'Поведение' && !!data.behaviors?.length && (
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900">Характерное поведение</h2>
                  <ul className="mt-4 list-disc pl-5 text-gray-700 space-y-2 leading-relaxed">
                    {data.behaviors.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              {active === 'Влияние' &&
                (data.impact?.communication?.length ||
                  data.impact?.leadership?.length ||
                  data.impact?.selfPerception?.length) && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                      <h3 className="flex items-center gap-3 text-lg font-semibold text-emerald-700">
                        <span className="text-2xl">💬</span>
                        <span>Общение</span>
                      </h3>
                      <ul className="mt-2 list-disc pl-10 text-gray-700 space-y-1">
                        {(data.impact?.communication ?? []).map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                      <h3 className="flex items-center gap-3 text-lg font-semibold text-emerald-700">
                        <span className="text-2xl">📈</span>
                        <span>Лидерство/работа</span>
                      </h3>
                      <ul className="mt-2 list-disc pl-10 text-gray-700 space-y-1">
                        {(data.impact?.leadership ?? []).map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                      <h3 className="flex items-center gap-3 text-lg font-semibold text-emerald-700">
                        <span className="text-2xl">👤</span>
                        <span>Самовосприятие</span>
                      </h3>
                      <ul className="mt-2 list-disc pl-10 text-gray-700 space-y-1">
                        {(data.impact?.selfPerception ?? []).map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

              {active === 'Поддержка' && !!data.selfSupport?.length && (
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900">Фразы самоподдержки</h2>
                  <ul className="mt-4 list-disc pl-5 text-gray-700 space-y-2 leading-relaxed">
                    {data.selfSupport.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              {active === 'Практика' && !!data.microPractice?.length && (
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900">Микропрактика</h2>
                  <ul className="mt-4 list-disc pl-5 text-gray-700 space-y-2 leading-relaxed">
                    {data.microPractice.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>

          {/* Правая колонка */}
          <aside className="lg:sticky lg:top-6 h-max space-y-4">
            <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
              <div className="text-sm font-semibold text-gray-900">Быстрые инструменты</div>
              <p className="mt-1 text-xs text-gray-500">Для работы с эмоцией в моменте.</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <button
                  onClick={toggleFav}
                  className="rounded-xl border bg-white p-3 text-center hover:bg-emerald-50 transition-colors"
                >
                  {fav ? '★' : '☆'}
                  <span className="ml-1">{fav ? 'В избранном' : 'В избранное'}</span>
                </button>
                <button
                  onClick={() => setNoteOpen(true)}
                  className="rounded-xl border bg-white p-3 text-center hover:bg-emerald-50 transition-colors"
                >
                  ✍️<span className="ml-1">Заметка</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-emerald-600 bg-white p-4 shadow-lg">
              <div className="text-sm font-semibold text-gray-900">Прогресс по семейству</div>
              <p className="mt-1 text-xs text-gray-500">
                Изучено эмоций: {familyCounts.familyStudied} / {familyCounts.familyTotal}
              </p>
              <div className="mt-2 h-2 w-full rounded-full bg-emerald-100">
                <div
                  className="h-2 rounded-full bg-emerald-600"
                  style={{
                    width: `${
                      (familyCounts.familyStudied / Math.max(1, familyCounts.familyTotal)) * 100
                    }%`,
                  }}
                />
              </div>
              <button className="mt-4 w-full rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
                Мини-курс (скоро)
              </button>
            </div>
          </aside>
        </main>
      </div>

      {/* Модалка «Заметка» */}
      {noteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Заметка к эмоции</h3>
              <button
                onClick={() => setNoteOpen(false)}
                className="rounded-full px-2 py-1 text-gray-500 hover:bg-gray-100"
                aria-label="Закрыть"
              >
                ✕
              </button>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={6}
              className="mt-3 w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Что откликнулось? Что заметили в теле/мыслях/поведении…"
            />
            <div className="mt-4 flex items-center justify-between gap-3">
              <Link
                href="/app/(employee)/journal"
                className="text-sm text-emerald-700 hover:underline"
              >
                Открыть дневник →
              </Link>
              <div className="flex gap-2">
                <button
                  onClick={() => setNoteOpen(false)}
                  className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  onClick={() => {
                    if (!data || !note.trim()) {
                      setNoteOpen(false);
                      return;
                    }
                    // MVP: просто складываем в localStorage список заметок
                    const key = `pg:notes:${data.slug}`;
                    try {
                      const raw = localStorage.getItem(key);
                      const arr: string[] = raw ? JSON.parse(raw) : [];
                      arr.push(note.trim());
                      localStorage.setItem(key, JSON.stringify(arr));
                    } catch {}
                    setNote('');
                    setNoteOpen(false);
                  }}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}