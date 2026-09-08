import Link from 'next/link';
import { BRAND_LOGOS } from '@/lib/brand-logos';

/** Strip brand clean: heading + grid logo klikable + link semua brand. */
export default function BrandStrip() {
  return (
    <section className="border-b border-line bg-[#fafaf6]">
      <div className="w-[min(1180px,calc(100%-40px))] mx-auto py-11">
        <p className="mb-[25px] text-center text-[11px] font-bold uppercase tracking-[0.28em] text-pine-700">
          Brand yang tersedia di InciFind
        </p>
        <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-4 lg:grid-cols-6">
          {BRAND_LOGOS.map((b) => (
            <Link
              key={b.slug}
              href={`/brands/${b.slug}`}
              title={b.name}
              className="flex min-h-[70px] items-center justify-center rounded-[7px] border border-line bg-white px-3 transition-all duration-150 hover:-translate-y-0.5 hover:border-pine-600"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.logo}
                alt={`Logo ${b.name}`}
                loading="lazy"
                className="h-8 w-auto max-w-[130px] object-contain"
              />
              <span className="sr-only">{b.name}</span>
            </Link>
          ))}
          <Link
            href="/brands"
            className="flex min-h-[70px] items-center justify-center rounded-[7px] border border-dashed border-pine-200 bg-pine-100/60 px-3 text-sm font-bold text-pine-800 transition-all hover:border-pine-600"
          >
            25rb+ lainnya →
          </Link>
        </div>
        <div className="mt-[13px] text-right">
          <Link
            href="/brands"
            className="inline-flex items-center gap-[6px] text-xs underline underline-offset-4 text-ink-soft hover:text-pine-800"
          >
            Lihat semua brand
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17 17 7"></path>
              <path d="M7 7h10v10"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
