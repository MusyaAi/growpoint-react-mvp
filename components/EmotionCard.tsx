'use client';
import Link from 'next/link';
import type { Emotion } from '@/lib/ds/emotions';

type Props = { emotion: Emotion };

export default function EmotionCard({ emotion }: Props) {
  return (
    <Link
      href={`/emotional-dictionary/${emotion.slug}`}
      className="group block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
      aria-label={`Открыть эмоцию: ${emotion.title}`}
    >
      <div className="flex items-center justify-between">
        <div className="text-2xl" aria-hidden>{emotion.emoji}</div>
        <span
          className="text-[10px] uppercase tracking-wider font-semibold"
          style={{ color: emotion.color }}
        >
          {/* метка семейства */}
          {emotion ? emotion.family && emotion.family.toUpperCase() : ''}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-gray-900">{emotion.title}</h3>

      {!!emotion.subtitle && (
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{emotion.subtitle}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {(emotion.tags ?? []).slice(0, 4).map((t) => (
          <span
            key={t}
            className="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-500"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 text-sm font-medium text-emerald-700 opacity-0 transition group-hover:opacity-100">
        Подробнее →
      </div>
    </Link>
  );
}