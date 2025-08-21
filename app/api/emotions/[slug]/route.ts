import { NextResponse } from 'next/server';
import { byIdOrSlug } from '@/lib/ds/emotions';
import { getRichBySlug } from '@/lib/ds/emotions.rich';

export async function GET(_req: Request, ctx: { params: { slug: string } }) {
  try {
    const base = byIdOrSlug(ctx.params.slug);
    if (!base) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const rich = getRichBySlug(base.slug);
    // Мержим: база (emoji, title, family, color, subtitle) + rich-блоки
    const merged = { ...base, ...(rich ?? {}) };

    return NextResponse.json(merged, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}