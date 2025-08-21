'use client';
import EmotionCard from './EmotionCard';
import type { Emotion } from '@/lib/ds/emotions';

export default function EmotionGrid({ items }: { items: Emotion[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((emotion) => (
        <EmotionCard key={emotion.id} emotion={emotion} />
      ))}
    </div>
  );
}