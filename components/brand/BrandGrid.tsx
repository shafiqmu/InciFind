'use client';

import { useEffect, useState } from 'react';
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

const CHUNK = 8;

/**
 * Grid produk per brand + filter nama. Foto diisi progresif per chunk
 * supaya 200+ produk tidak menembak INKEE barengan (rate-limit).
 */
export default function BrandGrid({ items }: BrandGridProps) {
  const [q, setQ] = useState('');
  const [list, setList] = useState<BrandItem[]>(items);

  useEffect(() => {
    setList(items);
    let cancelled = false;

    const fill = async () => {
      const missing = items.filter((p) => !p.imageUrl).map((p) => p.slug);
      for (let i = 0; i < missing.length; i += CHUNK) {
        if (cancelled) return;
        const chunk = missing.slice(i, i + CHUNK);
        try {
          const res = await fetch(`/api/product-meta?slugs=${encodeURIComponent(chunk.join(','))}`);
          const data = await res.json();
          const meta = (data?.meta || {}) as Record<string, { imageUrl?: string; brand?: string }>;
          if (cancelled) return;
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
        } catch {
          // Chunk gagal → dilewati, bukan vonis. Coba lagi di kunjungan berikut.
        }
        await new Promise((r) => setTimeout(r, 400));
      }
    };

    void fill();
    return () => {
      cancelled = true;
    };
  }, [items]);

  const query = q.trim().toLowerCase();
  const filtered = query
    ? list.filter((p) => p.name.toLowerCase().includes(query))
    : list;

  const initialOf = (name: string) => (name?.[0] || '?').toUpperCase();

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
          onChange={(e) => setQ(e.target.value)}
          className="w-full border-0 outline-0 text-ink bg-transparent text-base"
        />
      </label>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
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
                    className="absolute inset-0 w-full h-full object-cover"
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
    </div>
  );
}
