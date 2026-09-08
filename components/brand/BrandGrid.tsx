'use client';

import { useState } from 'react';
import Link from 'next/link';

interface BrandGridProps {
  items: Array<{ slug: string; name: string; brand: string; imageUrl: string }>;
}

/**
 * Grid produk per brand + filter nama. Foto dari cache product-meta
 * (produk yang belum ke-cache tampil huruf awal).
 */
export default function BrandGrid({ items }: BrandGridProps) {
  const [q, setQ] = useState('');

  const query = q.trim().toLowerCase();
  const filtered = query
    ? items.filter((p) => p.name.toLowerCase().includes(query))
    : items;

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
