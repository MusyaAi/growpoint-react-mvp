'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Emotion } from '@/lib/ds/emotions';

type FullEmotion = Emotion & {
  immersion?: string[];
  definition?: string;
  triggers?: string[];
  autoThoughts?: string[];
  somatic?: string[];
  behaviors?: string[];
  impact?: {
    communication?: string[];
    leadership?: string[];
    selfPerception?: string[];
  };
  selfSupport?: string[];
  microPractice?: string[];
};

export default function EmotionDetailsPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [data, setData] = useState<FullEmotion | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`/api/emotions/${encodeURIComponent(slug)}`)
      .then(r => (r.ok ? r.json() : null))
      .then(json => {
        if (!alive) return;
        if (!json) setNotFound(true);
        else setData(json as FullEmotion);
      })
      .catch(() => setNotFound(true));
    return () => { alive = false; };
  }, [slug]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/emotional-dictionary" className="text-emerald-700 hover:underline">← Вернуться к библиотеке</Link>
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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/emotional-dictionary" className="text-emerald-700 hover:underline">← К библиотеке</Link>

      <div className="mt-4 flex items-center gap-3">
        <div className="text-4xl" aria-hidden>{data.emoji}</div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">
            {data.familyLabel}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>
          {data.subtitle && <p className="mt-1 text-gray-600">{data.subtitle}</p>}
        </div>
      </div>

      {data.immersion?.length ? (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Погружение</h2>
          <div className="mt-3 space-y-3">
            {data.immersion.map((p: string, i: number) => (
              <p key={i} className="text-gray-700 leading-relaxed">{p}</p>
            ))}
          </div>
        </section>
      ) : null}

      {data.definition ? (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Суть</h2>
          <p className="mt-2 text-gray-700 leading-relaxed">{data.definition}</p>
        </section>
      ) : null}

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        {!!data.triggers?.length && (
          <div className="rounded-2xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900">Типичные триггеры</h3>
            <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
              {data.triggers.map((t: string, i: number) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        )}
        {!!data.autoThoughts?.length && (
          <div className="rounded-2xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900">Автоматические мысли</h3>
            <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
              {data.autoThoughts.map((t: string, i: number) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        )}
        {!!data.somatic?.length && (
          <div className="rounded-2xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900">Телесные маркеры</h3>
            <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
              {data.somatic.map((t: string, i: number) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        )}
        {!!data.behaviors?.length && (
          <div className="rounded-2xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900">Поведенческие реакции</h3>
            <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
              {data.behaviors.map((t: string, i: number) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        )}
      </section>

      {(data.impact?.communication?.length ||
        data.impact?.leadership?.length ||
        data.impact?.selfPerception?.length) && (
        <section className="mt-8 rounded-2xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900">Влияние</h2>
          <div className="mt-3 grid gap-6 md:grid-cols-3">
            {!!data.impact?.communication?.length && (
              <div>
                <h3 className="text-sm font-semibold text-emerald-700">Общение</h3>
                <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
                  {data.impact.communication.map((t: string, i: number) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            )}
            {!!data.impact?.leadership?.length && (
              <div>
                <h3 className="text-sm font-semibold text-emerald-700">Лидерство/работа</h3>
                <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
                  {data.impact.leadership.map((t: string, i: number) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            )}
            {!!data.impact?.selfPerception?.length && (
              <div>
                <h3 className="text-sm font-semibold text-emerald-700">Самовосприятие</h3>
                <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
                  {data.impact.selfPerception.map((t: string, i: number) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {(data.selfSupport?.length || data.microPractice?.length) && (
        <section className="mt-8 grid gap-6 md:grid-cols-2">
          {!!data.selfSupport?.length && (
            <div className="rounded-2xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900">Фразы самоподдержки</h3>
              <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
                {data.selfSupport.map((t: string, i: number) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          )}
          {!!data.microPractice?.length && (
            <div className="rounded-2xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900">Микропрактика</h3>
              <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
                {data.microPractice.map((t: string, i: number) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}