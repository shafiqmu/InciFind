import Link from 'next/link';
import { BRAND_LOGOS } from '@/lib/brand-logos';

interface BrandShowcaseProps {
  features: Array<{
    title: string;
    desc: string;
    icon: React.ReactNode;
  }>;
}

/**
 * Section brand + fitur: copy kiri, botanical kanan (locked),
 * grid logo KLIKABLE (hanya brand yang file logonya ada),
 * CTA /brands, 4 kartu fitur bernomor.
 */
export default function BrandShowcase({ features }: BrandShowcaseProps) {
  return (
    <section className="w-[min(1180px,calc(100%-40px))] mx-auto pb-[110px]">
      <div className="relative overflow-hidden rounded-[34px] border border-pine-200 bg-gradient-to-br from-[#f4faf4] to-[#eaf5eb]">
        {/* Botanical: locked kanan, redup di mobile */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-[80%] opacity-[0.18] sm:w-[55%] sm:opacity-30 lg:w-[42%] lg:opacity-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/incifind-botanical-bg.jpg"
            alt=""
            loading="lazy"
            className="h-full w-full object-cover object-right mix-blend-multiply"
          />
        </div>

        <div className="relative z-[2] px-5 pt-[42px] sm:px-10 sm:pt-16 lg:px-14">
          <p className="mb-[14px] text-[11px] font-bold uppercase tracking-[0.28em] text-pine-700">
            Brand yang tersedia di InciFind
          </p>
          <h2 className="max-w-[700px] font-serif text-[38px] font-medium leading-[0.98] tracking-[-0.045em] text-pine-900 sm:text-5xl lg:text-[64px]">
            Kenali berbagai brand skincare yang ada di sini.
          </h2>
          <p className="mt-[22px] max-w-[570px] text-sm leading-[1.65] text-ink-soft sm:text-base">
            Temukan dan pelajari informasi bahan dari berbagai produk skincare
            favoritmu, semua dalam satu tempat.
          </p>
        </div>

        <div className="relative z-[3] mt-7 grid grid-cols-2 gap-[10px] px-5 sm:mt-[38px] sm:grid-cols-4 sm:px-10 lg:grid-cols-6 lg:px-14">
          {BRAND_LOGOS.map((b) => (
            <Link
              key={b.slug}
              href={`/brands/${b.slug}`}
              title={b.name}
              className="flex min-h-[64px] items-center justify-center rounded-2xl border border-pine-200/85 bg-white/85 px-[18px] py-[14px] shadow-[0_8px_24px_rgba(31,72,48,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(31,72,48,0.08)] sm:min-h-[72px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.logo}
                alt={`Logo ${b.name}`}
                loading="lazy"
                className="h-8 w-auto max-w-[115px] object-contain sm:h-[38px] sm:max-w-[145px]"
              />
              <span className="sr-only">{b.name}</span>
            </Link>
          ))}
        </div>

        <div className="relative z-[3] px-5 sm:px-10 lg:px-14">
          <Link
            href="/brands"
            className="mt-5 inline-flex items-center gap-[10px] rounded-xl bg-pine-800 px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-px hover:bg-pine-700"
          >
            Lihat semua brand
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14"></path>
              <path d="m13 6 6 6-6 6"></path>
            </svg>
          </Link>
        </div>

        <div className="relative z-[3] mt-[30px] grid grid-cols-1 gap-[14px] border-t border-pine-200/90 px-5 py-[28px] sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:px-14">
          {features.map((f, i) => (
            <article
              key={f.title}
              className="relative min-h-[160px] rounded-[22px] border border-pine-200/90 bg-white/95 p-[22px] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(31,72,48,0.07)] sm:min-h-[190px]"
            >
              <span className="block text-[11px] font-bold tracking-[0.12em] text-ink-muted">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="mt-3 flex h-12 w-12 items-center justify-center rounded-full bg-pine-100 text-pine-800">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[23px] h-[23px]">
                  {f.icon}
                </svg>
              </div>
              <h3 className="mb-[5px] mt-4 text-[18px] font-bold text-ink">{f.title}</h3>
              <p className="max-w-[220px] text-[13px] leading-[1.6] text-ink-soft">{f.desc}</p>
              <span aria-hidden="true" className="absolute bottom-5 right-5 flex h-[34px] w-[34px] items-center justify-center rounded-full border border-pine-200 bg-[#f8fbf8] text-pine-800">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14"></path>
                  <path d="m13 6 6 6-6 6"></path>
                </svg>
              </span>
            </article>
          ))}
        </div>

        <p className="relative z-[3] px-5 pb-[30px] text-center text-[10px] font-bold tracking-[0.3em] text-ink-muted">
          SKINCARE LEBIH MUDAH DIPAHAMI
        </p>
      </div>
    </section>
  );
}
