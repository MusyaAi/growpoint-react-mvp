// app/api/emotions/[slug]/route.ts
import { NextResponse } from 'next/server';
import { byIdOrSlug } from '@/lib/ds/emotions';

export async function GET(_req: Request, ctx: { params: { slug: string } }) {
  try {
    const e = byIdOrSlug(ctx.params.slug);
    if (!e) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(e, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}