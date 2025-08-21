// lib/ds/emotions.rich/index.ts
import type { RichEmotionDoc } from './types';
import styd from './styd';

// сюда будем добавлять остальные: import trevoga from './trevoga' и т.д.
const docs: RichEmotionDoc[] = [
  styd,
];

export function getRichBySlug(slug: string): RichEmotionDoc | undefined {
  return docs.find(d => d.slug === slug);
}