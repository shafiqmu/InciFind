import Link from 'next/link';
import SearchBar from '@/components/search/SearchBar';
import BrandStrip from '@/components/home/BrandStrip';
import FeatureRow from '@/components/home/FeatureRow';
import { ARTICLES } from '@/lib/articles';

const SUGGESTIONS = [
  { label: 'CeraVe', q: 'CeraVe' },
  { label: 'SKIN1004', q: 'SKIN1004' },
  { label: 'Niacinamide', q: 'Niacinamide' },
  { label: 'Sunscreen', q: 'Sunscreen' },
];

const FEATURES = [
  {
    title: 'Cari',
    desc: 'Temukan produk skincare dalam sekejap.',
    icon: (
      <>
        <circle cx="11" cy="11" r="7"></circle>
        <path d="m20 20-4-4"></path>
      </>
    ),
  },
  {
    title: 'Lihat Bahan',
    desc: 'Daftar INCI lengkap dalam satu tempat.',
    icon: (
      <>
        <path d="M5 4h14v16H5z"></path>
        <path d="M8 8h8"></path>
        <path d="M8 12h8"></path>
        <path d="M8 16h5"></path>
      </>
    ),
  },
  {
    title: 'Pahami',
    desc: 'Pelajari fungsi tiap bahan sebenarnya.',
    icon: (
      <>
        <path d="M9 3h6"></path>
        <path d="M10 3v5l-5 10a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3L14 8V3"></path>
      </>
    ),
  },
  {
    title: 'Waspada',
    desc: 'Kenali bahan yang perlu perhatian ekstra.',
    icon: (
      <>
        <path d="M12 3 4 6v5c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-3Z"></path>
        <path d="M12 8v5"></path>
        <path d="M12 16h.01"></path>
      </>
    ),
  },
];

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="relative">
        {/* BG foto khusus mobile/tablet: di belakang tulisan */}
        <div className="absolute inset-0 lg:hidden" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/home/hero.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-mist/45 via-mist/15 to-mist/75" />
        </div>
        <div className="relative w-[min(1180px,calc(100%-40px))] mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-10 items-center lg:min-h-[650px] py-12 lg:py-[80px]">
          <div className="relative text-left">
            <div className="relative">
            <div className="inline-flex items-center gap-2 mb-[22px] text-pine-800 text-xs font-extrabold tracking-[0.14em] uppercase">
              <span className="w-[7px] h-[7px] bg-pine-600 rounded-full" />
              Bahan skincare, dibuat simpel
            </div>

            <h1 className="max-w-[640px] font-serif text-[clamp(48px,6vw,84px)] leading-[0.95] tracking-[-0.065em] text-pine-900 mb-7 [text-shadow:0_1px_18px_rgba(247,248,243,0.95),0_0_6px_rgba(247,248,243,0.9)]">
              Tahu Apa{' '}
              <em className="not-italic text-pine-700 relative">
                Isi
                <span className="absolute h-[9px] left-[4%] right-[4%] bottom-[2px] bg-pine-200 rounded-full -rotate-1 -z-0" />
              </em>{' '}
              Skincare-mu.
            </h1>

            <p className="max-w-[520px] text-ink font-medium text-[16px] md:text-[17px] lg:font-normal lg:text-ink-soft leading-[1.7] mb-10 [text-shadow:0_1px_14px_rgba(247,248,243,1),0_0_8px_rgba(247,248,243,1)] lg:[text-shadow:none]">
              Cari produk, lihat daftar bahan (INCI), dan pahami fungsinya
              — semua dalam satu tempat.
            </p>

            <div className="max-w-[560px]">
              <SearchBar suggestions={SUGGESTIONS} align="start" />
            </div>
            </div>
          </div>

          <div className="relative hidden lg:block h-[600px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/home/hero.jpg"
              alt="Cawan petri dan daun hijau"
              className="absolute inset-0 w-full h-full object-cover object-right rounded-[34px] [mask-image:linear-gradient(to_right,transparent,black_18%)]"
            />
          </div>
        </div>
      </section>

      <BrandStrip />
      <FeatureRow features={FEATURES} />

      {/* EDUCATION → ARTIKEL */}
      <section id="education" className="w-[min(1180px,calc(100%-40px))] mx-auto py-20 border-t border-line scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-[30px] gap-4">
          <div>
            <span className="text-pine-700 text-xs font-extrabold tracking-[0.14em] uppercase">
              Belajar soal skincare
            </span>
            <h2 className="mt-[14px] font-serif text-[34px] md:text-[42px] tracking-[-0.04em] text-pine-900 leading-tight">
              Pahami Skincare-mu
              <br />
              Lebih Baik.
            </h2>
          </div>
          <Link
            href="/articles"
            className="inline-flex items-center gap-[6px] text-[13px] font-bold text-pine-800 underline underline-offset-4 hover:text-pine-700"
          >
            Lihat semua artikel
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17 17 7"></path>
              <path d="M7 7h10v10"></path>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ARTICLES.map((a) => (
            <Link
              key={a.slug}
              href={`/articles/${a.slug}`}
              className="group overflow-hidden bg-white border border-line rounded-[20px] transition-all hover:-translate-y-1 hover:border-pine-600"
            >
              <div className="relative h-[180px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-5">
                <span className="text-[10px] font-bold tracking-[0.14em] text-pine-700 uppercase">
                  {a.category}
                </span>
                <h3 className="mt-[11px] mb-2 font-serif text-[20px] text-ink group-hover:text-pine-800">
                  {a.title}
                </h3>
                <p className="text-ink-soft text-xs leading-[1.6]">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="relative overflow-hidden my-[90px] rounded-[24px] border border-pine-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/home/cta.jpg"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#eef5ed] via-[#eef5ed]/85 to-[#eef5ed]/30 md:bg-gradient-to-r md:via-[#eef5ed]/80 md:to-[#eef5ed]/10" />
          <div className="relative z-[2] px-6 py-[52px] md:p-[52px] max-w-[640px]">
            <span className="text-pine-700 text-xs font-extrabold tracking-[0.14em] uppercase">
              Jadikan skincare lebih transparan
            </span>
            <h2 className="mt-[15px] mb-3 font-serif text-pine-900 text-[34px] md:text-[42px] tracking-[-0.05em] leading-[1.05]">
              Mulai Cari dan Pahami Produk Skincare-mu.
            </h2>
            <p className="max-w-[480px] text-ink-soft text-[13px] leading-[1.6]">
              Mulai cari, pelajari, dan pahami produk skincare dengan informasi
              yang bisa kamu percaya.
            </p>
            <Link
              href="/search"
              className="mt-[22px] inline-flex items-center gap-2 rounded-full bg-pine-800 px-5 py-3 text-white text-[13px] font-bold transition-all hover:bg-pine-700"
            >
              Mulai Sekarang
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17 17 7"></path>
                <path d="M7 7h10v10"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
