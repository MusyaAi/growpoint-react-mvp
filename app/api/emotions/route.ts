// app/api/emotions/route.ts
import { NextResponse, NextRequest } from 'next/server';
import {
  listEmotions,
  type Emotion,
  type EmotionFamily,
  FAMILY_LABEL_RU,
} from '@/lib/ds/emotions';

type ListItem = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  family: EmotionFamily;
  familyLabel: string;
  emoji: string;
  color?: string;
  tags?: string[];
};

export async function GET(req: NextRequest) {
  // безопасный парсинг query
  const searchParams = req.nextUrl.searchParams;
  const search = (searchParams.get('search') || '').trim().toLowerCase();
  const family = (searchParams.get('family') || '').trim() as '' | EmotionFamily;

  const all: Emotion[] = listEmotions();

  let items: ListItem[] = all.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    subtitle: e.subtitle,
    family: e.family,
    familyLabel: FAMILY_LABEL_RU[e.family],
    emoji: e.emoji,
    color: e.color,
    tags: e.tags ?? [],
  }));

  if (family) {
    items = items.filter((i) => i.family === family);
  }
  if (search) {
    items = items.filter(
      (i) =>
        i.title.toLowerCase().includes(search) ||
        (i.subtitle || '').toLowerCase().includes(search)
    );
  }

  return NextResponse.json(items, { status: 200 });
}