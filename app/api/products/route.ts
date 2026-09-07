import { NextResponse } from 'next/server';
import { searchInkee } from '@/lib/inkee-client';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/products?q=...&page=1&limit=12
 *
 * Search produk via INKEE Decoder (opsi B, pengganti OBF).
 * Response shape dipertahankan supaya SearchBar tidak berubah kontrak.
 */
export async function GET(request: Request) {
  if (!rateLimit(clientIp(request))) {
    return NextResponse.json(
      { error: 'Terlalu banyak request, coba lagi sebentar.' },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);

  const q = searchParams.get('q') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));

  if (!q.trim()) {
    return NextResponse.json({
      products: [],
      count: 0,
      page,
      pageCount: 0,
      pageSize: limit,
      query: q,
      source: 'inkee',
    });
  }

  try {
    const { products, hasMore } = await searchInkee(q, limit, page);

    return NextResponse.json({
      products,
      count: products.length,
      totalCount: products.length,
      page,
      pageCount: hasMore ? page + 1 : page,
      pageSize: limit,
      query: q,
      source: 'inkee',
      hasMore,
    });
  } catch (err) {
    console.error('[GET /api/products] inkee error:', err);
    return NextResponse.json(
      {
        error: 'Failed to fetch products',
        details: err instanceof Error ? err.message : String(err),
        products: [],
        count: 0,
        page,
        pageSize: limit,
        query: q,
        source: 'inkee',
      },
      { status: 500 }
    );
  }
}
