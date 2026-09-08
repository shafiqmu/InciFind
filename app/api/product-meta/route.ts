import { NextResponse } from 'next/server';
import { getProductMetaMap } from '@/lib/product-meta';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/product-meta?slugs=a,b,c
 *
 * Enrichment ringan untuk dropdown search: { slug: { imageUrl, brand } }.
 * Di-cache permanen di data/product-meta-cache.json.
 */
export async function GET(request: Request) {
  if (!rateLimit(clientIp(request))) {
    return NextResponse.json(
      { error: 'Terlalu banyak request, coba lagi sebentar.' },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const slugs = (searchParams.get('slugs') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8);

  if (slugs.length === 0) {
    return NextResponse.json({ meta: {} });
  }

  try {
    const meta = await getProductMetaMap(slugs);
    return NextResponse.json({ meta });
  } catch (err) {
    console.error('[GET /api/product-meta] error:', err);
    return NextResponse.json({ meta: {} }, { status: 500 });
  }
}
