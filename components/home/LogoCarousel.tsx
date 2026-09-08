'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { BRAND_LOGOS } from '@/lib/brand-logos';

const PER_PAGE = 5;

/**
 * Carousel logo brand: klikable → /brands/[slug]. Auto 4,5 dtk,
 * jeda saat hover/focus, mati bila reduced-motion.
 */
export default function LogoCarousel() {
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  const brandPages = useMemo(() => {
    const out = [];
    for (let i = 0; i < BRAND_LOGOS.length; i += PER_PAGE) {
      out.push(BRAND_LOGOS.slice(i, i + PER_PAGE));
    }
    return out;
  }, []);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => {
      setPage((p) => (p + 1) % brandPages.length);
    }, 4500);
    return () => clearInterval(t);
  }, [brandPages.length, paused]);

  if (brandPages.length === 0) return null;
  const current = brandPages[page];

  return (
    <div
      className="relative mt-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <button
        type="button"
        onClick={() => setPage((page - 1 + brandPages.length) % brandPages.length)}
        aria-label="Brand sebelumnya"
        className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-3 text-pine-800 shadow transition hover:bg-pine-100 sm:flex"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6"></path>
        </svg>
      </button>

      <div className="mx-auto grid max-w-5xl grid-cols-2 items-center gap-x-8 gap-y-8 px-2 sm:grid-cols-3 lg:grid-cols-5">
        {current.map((b) => (
          <Link
            key={b.slug}
            href={`/brands/${b.slug}`}
            title={b.name}
            className="flex h-16 items-center justify-center px-2 opacity-80 transition hover:opacity-100 hover:scale-[1.04]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.logo}
              alt={`Logo ${b.name}`}
              loading="lazy"
              className="max-h-9 max-w-[125px] object-contain"
            />
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setPage((page + 1) % brandPages.length)}
        aria-label="Brand berikutnya"
        className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-3 text-pine-800 shadow transition hover:bg-pine-100 sm:flex"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </button>

      {brandPages.length > 1 && (
        <div className="mt-5 flex justify-center gap-2">
          {brandPages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Halaman brand ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                page === i ? 'w-6 bg-pine-800' : 'w-1.5 bg-pine-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
