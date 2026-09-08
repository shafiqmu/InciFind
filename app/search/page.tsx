import Link from 'next/link';
import SearchBar from '@/components/search/SearchBar';
import BrandGrid from '@/components/brand/BrandGrid';
import { searchInkee } from '@/lib/inkee-client';
import { filterStaticProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: { q?: string };
}

/**
 * Halaman hasil pencarian: user pilih sendiri (enter tidak judi produk pertama).
 * Foto diisi progresif via BrandGrid. URL shareable (?q=).
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = (searchParams?.q || '').trim();

  let names: Array<{ slug: string; name: string }> = [];
  let hasMore = false;

  if (q) {
    try {
      const res = await searchInkee(q, 50, 1);
      names = res.products.map((p) => ({ slug: p.slug, name: p.name }));
      hasMore = res.hasMore;
    } catch {
      names = [];
    }
    if (names.length === 0) {
      try {
        names = (filterStaticProducts(q) as unknown as Array<{ slug: string; name: string }>).map(
          (p) => ({ slug: p.slug, name: p.name })
        );
      } catch {
        names = [];
      }
    }
  }

  return (
    <main className="w-[min(1180px,calc(100%-40px))] mx-auto pt-10 pb-[90px]">
      <nav className="flex items-center gap-2 mb-8 text-[13px] font-semibold">
        <Link href="/" className="text-ink-soft hover:text-pine-800">
          Beranda
        </Link>
        <span className="text-ink-muted">/</span>
        <span className="text-ink">Hasil pencarian</span>
      </nav>

      <div className="max-w-[560px] mb-8">
        <SearchBar key={q} initial={q} align="start" />
      </div>

      {!q ? (
        <p className="py-10 text-ink-muted text-center text-sm">
          Ketik nama produk di atas untuk mencari.
        </p>
      ) : (
        <>
          <p className="mb-6 text-ink-soft text-[15px]">
            {names.length} hasil untuk &ldquo;{q}&rdquo;{hasMore ? ' (+ lainnya)' : ''}
          </p>
          {names.length > 0 ? (
            <BrandGrid
              items={names.map((p) => ({ slug: p.slug, name: p.name }))}
              searchPlaceholder="Cari di hasil ini..."
            />
          ) : (
            <p className="py-10 text-ink-muted text-center text-sm italic">
              Produk tidak ditemukan. Coba kata kunci lain.
            </p>
          )}
        </>
      )}
    </main>
  );
}
