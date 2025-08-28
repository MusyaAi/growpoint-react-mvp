'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import EmotionGrid from '@/components/EmotionGrid';
import type { Emotion, EmotionFamily } from '@/lib/ds/emotions';
import { FAMILY_LABEL_RU } from '@/lib/ds/emotions';

type FamilyOption = { value: '' | EmotionFamily; label: string };

const FAMILY_ORDER: EmotionFamily[] = [
  'joy', 'love', 'calm', 'surprise', 'anger', 'fear', 'sadness', 'disgust', 'shame', 'guilt',
];

export default function EmotionalDictionaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // инициализируем состояние из URL
  const [q, setQ] = useState<string>(searchParams.get('search') ?? '');
  const [family, setFamily] = useState<'' | EmotionFamily>(
    (searchParams.get('family') as EmotionFamily | null) ?? ''
  );

  const [items, setItems] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // если URL меняется извне (напр., переход по хлебной крошке),
  // подтягиваем значения в инпуты/селект
  useEffect(() => {
    const urlQ = searchParams.get('search') ?? '';
    const urlFamily = (searchParams.get('family') as EmotionFamily | null) ?? '';
    // обновляем только если реально отличаются, чтобы не дёргать ввод пользователя
    if (urlQ !== q) setQ(urlQ);
    if (urlFamily !== family) setFamily(urlFamily);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // зависим только от URL-параметров

  // синхронизация URL ← состояние
  useEffect(() => {
    const curQ = searchParams.get('search') ?? '';
    const curF = searchParams.get('family') ?? '';
    const nextQ = q.trim();
    const nextF = family;

    if (curQ === nextQ && curF === nextF) return;

    const params = new URLSearchParams();
    if (nextQ) params.set('search', nextQ);
    if (nextF) params.set('family', nextF);
    const qs = params.toString();
    router.replace(`/emotional-dictionary${qs ? `?${qs}` : ''}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, family]);

  // загрузка списка
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    const qTrim = q.trim();
    if (qTrim) params.set('search', qTrim);
    if (family) params.set('family', family);

    fetch(`/api/emotions?${params.toString()}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = await r.json();
        const arr: Emotion[] = Array.isArray(json) ? json : (json?.items ?? []);
        return arr;
      })
      .then((arr) => { if (alive) setItems(arr); })
      .catch(() => { if (alive) setError('Не удалось загрузить эмоции'); })
      .finally(() => { if (alive) setLoading(false); });

    return () => { alive = false; };
  }, [q, family]);

  const familyOptions = useMemo<FamilyOption[]>(
    () => [
      { value: '', label: 'Все семейства' },
      ...FAMILY_ORDER.map((f): FamilyOption => ({ value: f, label: FAMILY_LABEL_RU[f] })),
    ],
    []
  );

  return (
    // full-bleed фон (как у тебя было красиво)
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-emerald-100 -mt-8">
      <div className="min-h-screen">
        {/* Контентный контейнер */}
        <div className="mx-auto max-w-6xl px-4 py-8">

          {/* Заголовок + линк назад */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
                Библиотека эмоций и чувств
              </h1>
              <p className="mt-2 text-gray-700">Фундамент эмоциональной грамотности</p>
            </div>
            <Link href="/" className="hidden md:inline text-emerald-800 hover:underline">
              ← На дашборд
            </Link>
          </div>

          {/* Поиск + фильтр */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск по названию или описанию…"
              className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <select
              value={family}
              onChange={(e) => setFamily(e.target.value as EmotionFamily | '')}
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-900"
            >
              {familyOptions.map((o) => (
                <option key={o.value || 'all'} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Контент */}
          <div className="mt-6">
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-44 rounded-2xl border border-gray-200 bg-white shadow-sm"
                  />
                ))}
              </div>
            ) : error ? (
              <p className="text-center text-red-600">{error}</p>
            ) : items.length > 0 ? (
              <EmotionGrid items={items} />
            ) : (
              <p className="text-center text-gray-600">Ничего не найдено.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}