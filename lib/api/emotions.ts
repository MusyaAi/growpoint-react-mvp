import type { EmotionListItem, EmotionFull } from '@/data/emotions';

export async function listEmotions(params?: {
  search?: string; family?: string; limit?: number; cursor?: string;
}): Promise<{ items: EmotionListItem[]; nextCursor?: string }> {
  const q = new URLSearchParams();
  if (params?.search) q.set('search', params.search);
  if (params?.family) q.set('family', params.family);
  if (params?.limit)  q.set('limit',  String(params.limit));
  if (params?.cursor) q.set('cursor', params.cursor);
  const url = '/api/emotions' + (q.toString() ? `?${q}` : '');
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error('Failed to fetch emotions');
  return r.json();
}

export async function getEmotion(slug: string): Promise<EmotionFull> {
  const r = await fetch(`/api/emotions/${encodeURIComponent(slug)}`, { cache: 'no-store' });
  if (!r.ok) throw new Error('Emotion not found');
  return r.json();
}
