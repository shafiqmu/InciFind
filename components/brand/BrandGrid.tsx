'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface BrandItem {
  slug: string;
  name: string;
  brand?: string;
  imageUrl?: string;
}

interface BrandGridProps {
  items: BrandItem[];
}

const PER_PAGE = 50;
const CHUNK = 8;

/**
 * Paginasi client-side 50/hal + search di SEMUA nama.
 * Foto diisi progresif (halaman aktif dulu) supaya tidak badai ke INKEE.
 */
export default function BrandGrid({ items }: BrandGridProps) {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [list, setList] = useState<BrandItem[]>(items);
  const attempted = useRef<Set<string>>(new Set());
  const topRef = useRef<HTMLDivElement>(null);

  const mergeMeta = (meta: Record<string, { imageUrl?: string; brand?: string }>) => {
    setList((prev) =>
      prev.map((p) =>
        meta[p.slug]
          ? {
              ...p,
              brand: p.brand || meta[p.slug].brand || p.brand,
              imageUrl: p.imageUrl || meta[p.slug].imageUrl || p.imageUrl,
            }
          : p
      )
    );
  };

  const fillSlugs = async (slugs: string[], cancelled: () => boolean) => {
    const fresh = slugs.filter((s) => !attempted.current.has(s));
    for (let i = 0; i < fresh.length; i += CHUNK) {
      if (cancelled()) return;
      const chunk = fresh.slice(i, i + CHUNK);
      chunk.forEach((s) => attempted.current.add(s));
      try {
        const res = await fetch(`/api/product-meta?slugs=${encodeURIComponent(chunk.join(','))}`);
        const data = await res.json();
        if (cancelled()) return;
        mergeMeta((data?.meta || {}) as Record<string, { imageUrl?: string; brand?: string }>);
      } catch {
        // Chunk gagal → dilewati, dicoba lagi di kunjungan berikut.
      }
      await new Promise((r) => setTimeout(r, 400));
    }
  };

  // Isi progresif: halaman 1 dulu, sisanya background.
  useEffect(() => {
    setList(items);
    attempted.current = new Set();
    let cancelled = false;
    const first = items.slice(0, PER_PAGE).map((p) => p.slug);
    const rest = items.slice(PER_PAGE).map((p) => p.slug);
    void fillSlugs([...first, ...rest], () => cancelled);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const query = q.trim().toLowerCase();
  const filtered = query
    ? list.filter((p) => p.name.toLowerCase().includes(query))
    : list;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const goPage = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    // Dahulukan foto halaman yang baru dibuka
    const slugs = filtered.slice((next - 1) * PER_PAGE, next * PER_PAGE).map((x) => x.slug);
    void fillSlugs(slugs, () => false);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const initialOf = (name: string) => (name?.[0] || '?').toUpperCase();
  const from = filtered.length === 0 ? 0 : (safePage - 1) * PER_PAGE + 1;
  const to = Math.min(safePage * PER_PAGE, filtered.length);

  return (
    <div>
      <label className="w-full md:w-[300px] h-11 flex items-center px-[14px] bg-white border border-line rounded-xl shrink-0 mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[17px] h-[17px] text-ink-muted mr-[9px]">
          <circle cx="11" cy="11" r="7"></circle>
          <path d="m20 20-4-4"></path>
        </svg>
        <input
          type="search"
          placeholder="Cari produk brand ini..."
          aria-label="Cari produk brand ini"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          className="w-full border-0 outline-0 text-ink bg-transparent text-base"
        />
      </label>

      <div ref={topRef} className="scroll-mt-24" />

      {pageItems.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {pageItems.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="group overflow-hidden bg-white border border-line rounded-[20px] transition-all hover:border-pine-600 hover:-translate-y-0.5"
            >
              <div className="relative aspect-square overflow-hidden bg-[linear-gradient(145deg,#edf5ed,#f7f2e9)]">
                <div className="absolute inset-0 grid place-items-center text-pine-800 font-extrabold text-3xl">
                  {initialOf(p.name)}
                </div>
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imageUrl}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain bg-white"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
              </div>
              <div className="p-4">
                <div className="text-ink text-sm font-bold leading-snug group-hover:text-pine-800">
                  {p.name}
                </div>
                {p.brand ? (
                  <div className="mt-1 text-ink-muted text-xs">{p.brand}</div>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="py-10 text-ink-muted text-center text-sm italic">
          Tidak ada produk yang cocok dengan pencarian.
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        <p className="text-ink-soft text-[13px]">
          {from}–{to} dari {filtered.length} produk
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => goPage(safePage - 1)}
              className="h-10 px-4 rounded-full border border-line bg-white text-sm font-bold text-pine-800 disabled:opacity-40 transition-all hover:border-pine-600"
            >
              ← Prev
            </button>
            <span className="text-[13px] font-bold text-ink-soft">
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => goPage(safePage + 1)}
              className="h-10 px-4 rounded-full bg-pine-800 text-white text-sm font-bold disabled:opacity-40 transition-all hover:bg-pine-700"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
