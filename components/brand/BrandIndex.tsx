'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { POPULAR_BRANDS, slugifyBrand } from '@/lib/popular-brands';

/**
 * Index brand kurasi: filter live + jalan pintas ke brand mana pun
 * (slugify → /brands/[slug], 404 kalau tidak ada di INKEE).
 */
export default function BrandIndex() {
  const [q, setQ] = useState('');
  const router = useRouter();

  const query = q.trim().toLowerCase();
  const filtered = query
    ? POPULAR_BRANDS.filter((b) => b.name.toLowerCase().includes(query))
    : POPULAR_BRANDS;

  const goDirect = () => {
    const slug = slugifyBrand(q);
    if (slug) router.push(`/brands/${slug}`);
  };

  return (
    <div>
      <label className="w-full md:w-[340px] h-[52px] flex items-center px-[18px] bg-white border border-line rounded-full shrink-0 mb-8 shadow-[0_18px_50px_rgba(23,60,42,0.09)]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[19px] h-[19px] text-ink-muted mr-[11px]">
          <circle cx="11" cy="11" r="7"></circle>
          <path d="m20 20-4-4"></path>
        </svg>
        <input
          type="search"
          placeholder="Cari brand..."
          aria-label="Cari brand"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') goDirect();
          }}
          className="w-full border-0 outline-0 text-ink bg-transparent text-base"
        />
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((b) => (
          <Link
            key={b.slug}
            href={`/brands/${b.slug}`}
            className="group flex items-center gap-3 p-4 bg-white border border-line rounded-2xl transition-all hover:border-pine-600 hover:-translate-y-0.5"
          >
            <span className="w-11 h-11 grid place-items-center shrink-0 bg-[linear-gradient(145deg,#edf5ed,#f7f2e9)] rounded-xl text-pine-800 font-extrabold text-lg">
              {b.name[0]}
            </span>
            <span className="text-ink text-sm font-bold group-hover:text-pine-800 truncate">
              {b.name}
            </span>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-6 text-ink-muted text-center text-sm italic">
          Tidak ada di daftar populer.
        </p>
      )}

      {query && (
        <button
          type="button"
          onClick={goDirect}
          className="mt-6 w-full p-4 text-center bg-pine-100 border border-pine-200 rounded-2xl text-pine-800 text-sm font-bold transition-all hover:bg-pine-200"
        >
          Lihat brand &ldquo;{q.trim()}&rdquo; →
        </button>
      )}
    </div>
  );
}
