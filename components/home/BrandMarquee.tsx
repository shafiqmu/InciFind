import { POPULAR_BRANDS } from '@/lib/popular-brands';

/**
 * Marquee brand populer: pajangan, TIDAK clickable.
 * Hormati reduced-motion + jeda saat hover.
 */
export default function BrandMarquee() {
  const row = [...POPULAR_BRANDS, ...POPULAR_BRANDS];

  return (
    <section aria-label="Brand yang tersedia di InciFind" className="py-10 overflow-hidden">
      <p className="text-center text-ink-muted text-xs font-bold uppercase tracking-[0.14em] mb-5">
        Brand yang tersedia di InciFind
      </p>
      <div className="marquee relative">
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-mist to-transparent z-[1] pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-mist to-transparent z-[1] pointer-events-none" />
        <div className="marquee-track flex w-max items-center gap-8 pr-8">
          {row.map((b, i) => (
            <span
              key={`${b.slug}-${i}`}
              aria-hidden={i >= POPULAR_BRANDS.length}
              className="whitespace-nowrap font-serif text-pine-900/60 text-xl md:text-2xl"
            >
              {b.name}
              <span className="ml-8 text-pine-600/50">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
