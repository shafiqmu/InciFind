import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/products/[barcode] — DINONAKTIFKAN (opsi B).
 *
 * INKEE Decoder tidak punya barcode/UPC, jadi lookup barcode tidak didukung.
 * Pakai slug: GET /api/products?q=nama atau /products/[slug].
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ barcode: string }> }
) {
  const { barcode } = await params;

  return NextResponse.json(
    {
      error: 'Barcode lookup disabled',
      barcode,
      message:
        'Opsi B memakai INKEE Decoder yang tidak punya data barcode/UPC. Cari by nama (GET /api/products?q=...) atau buka /products/[slug].',
    },
    { status: 410 }
  );
}
