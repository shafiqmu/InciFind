'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/ingredients-client';
import Link from 'next/link';

interface Suggestion {
  label: string;
  q: string;
}

export default function SearchBar({ suggestions = [], align = 'center' }: { suggestions?: Suggestion[]; align?: 'start' | 'center' }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchController = useRef<AbortController | null>(null);
  const searchSeq = useRef(0);

  // P0-4: ketikan di-debounce 350ms → 1 request per settle, bukan per huruf.
  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!value.trim()) {
      searchController.current?.abort();
      setResults([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }
    debounceTimer.current = setTimeout(() => {
      void doSearch(value);
    }, 350);
  };

  // P0-5: request lama di-abort + respons basi (seq kadaluarsa) diabaikan.
  const doSearch = async (value: string) => {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      setResults([]);
      setIsOpen(false);
      return [];
    }

    searchController.current?.abort();
    const controller = new AbortController();
    searchController.current = controller;
    const seq = ++searchSeq.current;

    setLoading(true);
    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(trimmed)}&limit=6&page=1`, {
        signal: controller.signal,
      });
      if (seq !== searchSeq.current) return [];
      const data = await res.json();
      if (seq !== searchSeq.current) return [];
      const products: Product[] = Array.isArray(data.products) ? data.products : [];

      let finalProducts: Product[];
      if (products.length === 0 && res.ok) {
        const { filterStaticProducts } = await import('@/lib/products');
        finalProducts = filterStaticProducts(trimmed) as unknown as Product[];
      } else {
        finalProducts = products;
      }

      setResults(finalProducts);
      setIsOpen(true);
      enrichWithMeta(finalProducts);
      return finalProducts;
    } catch (err) {
      // Request yang dibatalkan / respons basi: diam, jangan timpa hasil terbaru.
      if (controller.signal.aborted || seq !== searchSeq.current) return [];
      console.error('[SearchBar] fetch error:', err);
      const { filterStaticProducts } = await import('@/lib/products');
      const fallback = filterStaticProducts(trimmed) as unknown as Product[];
      setResults(fallback);
      setIsOpen(true);
      return fallback;
    } finally {
      if (seq === searchSeq.current) setLoading(false);
    }
  };

  // Submit form + tombol saran: user sudah settle → langsung tanpa debounce.
  const runSearch = (value: string) => {
    setQuery(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    return doSearch(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const found = results.length > 0 ? results : await runSearch(query);
    if (found.length > 0 && found[0].slug) {
      router.push(`/products/${found[0].slug}`);
    }
  };

  const initialOf = (p: Product) =>
    (p.brand?.[0] || p.name?.[0] || '?').toUpperCase();

  // Enrichment ringan: gambar + brand nyusul setelah hasil tampil.
  // Merge per slug → respons basi tidak merusak hasil query terbaru.
  const enrichWithMeta = (items: Product[]) => {
    const slugs = items.map((p) => p.slug).filter(Boolean).join(',');
    if (!slugs) return;
    fetch(`/api/product-meta?slugs=${encodeURIComponent(slugs)}`)
      .then((r) => r.json())
      .then((d) => {
        const meta = (d?.meta || {}) as Record<string, { imageUrl?: string; brand?: string }>;
        setResults((prev) =>
          prev.map((p) => {
            const m = meta[p.slug];
            if (!m) return p;
            return {
              ...p,
              brand: p.brand || m.brand || p.brand,
              imageUrl: (p as Product).imageUrl || m.imageUrl || (p as Product).imageUrl,
            };
          })
        );
      })
      .catch(() => {});
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="w-full h-[62px] md:h-[70px] flex items-center bg-white border border-line rounded-full shadow-[0_18px_50px_rgba(23,60,42,0.09)] pl-[18px] md:pl-[25px] pr-[8px] md:pr-[9px] py-2 transition-shadow focus-within:border-pine-600 focus-within:shadow-[0_20px_55px_rgba(23,60,42,0.12),0_0_0_4px_rgba(61,138,97,0.08)]"
      >
        <svg className="w-[22px] h-[22px] text-ink-muted shrink-0 mr-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7"></circle>
          <path d="m20 20-4-4"></path>
        </svg>
        <input
          type="search"
          placeholder="Cari produk skincare..."
          aria-label="Cari produk skincare"
          autoComplete="off"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => query && results.length > 0 && setIsOpen(true)}
          className="w-full border-0 outline-0 bg-transparent text-ink text-base placeholder:text-[#9aa39d]"
        />
        <button
          type="submit"
          aria-label="Search"
          className="w-[46px] h-[46px] md:w-[54px] md:h-[54px] grid place-items-center border-0 text-white bg-pine-800 rounded-full transition-all hover:bg-pine-700 hover:scale-[1.04] shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[21px] h-[21px]">
            <path d="M5 12h14"></path>
            <path d="m13 6 6 6-6 6"></path>
          </svg>
        </button>
      </form>

      {isOpen && results.length > 0 && (
        <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white border border-line rounded-[22px] shadow-[0_18px_50px_rgba(23,60,42,0.09)] overflow-hidden z-50 text-left">
          <div className="px-[18px] py-[15px] border-b border-line text-ink-muted text-xs font-bold uppercase tracking-[0.08em]">
            Hasil pencarian
          </div>
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="w-full flex items-center gap-[14px] px-[18px] py-[14px] bg-white text-left transition-colors hover:bg-pine-100"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
            >
              <div className="relative w-12 h-[58px] shrink-0 overflow-hidden bg-[linear-gradient(145deg,#edf5ed,#f7f2e9)] rounded-xl">
                <div className="absolute inset-0 grid place-items-center text-pine-800 font-extrabold text-lg">
                  {initialOf(product)}
                </div>
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-ink text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                  {product.name || 'Produk tidak dikenal'}
                </div>
                <div className="mt-1 text-ink-muted text-xs">
                  {product.brand || 'Merek tidak dikenal'}
                  {loading && ' · memuat...'}
                </div>
              </div>
              <div className="text-pine-700">→</div>
            </Link>
          ))}
        </div>
      )}
      {isOpen && query && results.length === 0 && !loading && (
        <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white border border-line rounded-[22px] shadow-[0_18px_50px_rgba(23,60,42,0.09)] overflow-hidden z-50 text-left">
          <div className="px-[18px] py-[15px] border-b border-line text-ink-muted text-xs font-bold uppercase tracking-[0.08em]">
            Hasil pencarian
          </div>
          <div className="p-[22px] text-ink-muted text-center text-[13px]">Produk tidak ditemukan.</div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className={`flex items-center flex-wrap gap-2 mt-[18px] ${align === 'start' ? 'justify-start' : 'justify-center'}`}>
          <span className="text-ink font-medium text-[13px] [text-shadow:0_1px_10px_rgba(247,248,243,1)]">Coba cari:</span>
          {suggestions.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => runSearch(s.q)}
              className="border border-pine-200 bg-white/75 text-pine-800 rounded-full px-3 py-[7px] text-xs font-semibold transition-all hover:bg-pine-100 hover:border-pine-600"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
