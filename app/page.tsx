import SearchBar from '@/components/search/SearchBar';
import BrandStrip from '@/components/home/BrandStrip';
import FeatureRow from '@/components/home/FeatureRow';

const SUGGESTIONS = [
  { label: 'CeraVe', q: 'CeraVe' },
  { label: 'COSRX Snail 96', q: 'COSRX snail' },
  { label: 'The Ordinary', q: 'The Ordinary' },
  { label: 'SKIN1004', q: 'SKIN1004' },
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

const EDUCATION = [
  {
    n: '01',
    title: 'Apa itu Niacinamide?',
    desc: 'Vitamin B3 yang populer untuk barrier kulit dan mencerahkan.',
  },
  {
    n: '02',
    title: 'Retinol itu buat apa?',
    desc: 'Retinoid yang umum dipakai untuk regenerasi kulit.',
  },
  {
    n: '03',
    title: 'Kenapa ada Fragrance?',
    desc: 'Pewangi bikin produk enak dipakai, tapi belum tentu cocok untuk semua kulit.',
  },
  {
    n: '04',
    title: 'Apa itu daftar INCI?',
    desc: 'INCI adalah sistem penamaan bahan standar di label kosmetik.',
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
            src="/hero-skincare.jpg"
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
              Cari produk skincare apa pun dan temukan daftar bahan lengkap,
              bahan aktif, dan insight simpel. Tanpa login. Cukup tahu.
            </p>

            <div className="max-w-[560px]">
              <SearchBar suggestions={SUGGESTIONS} align="start" />
            </div>
            </div>
          </div>

          <div className="relative hidden lg:block h-[600px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-skincare.jpg"
              alt="Skincare products with botanical leaves"
              className="absolute inset-0 w-full h-full object-cover rounded-[34px] [mask-image:linear-gradient(to_right,transparent,black_18%)]"
            />
          </div>
        </div>
      </section>

      <BrandStrip />
      <FeatureRow features={FEATURES} />

      {/* EDUCATION */}
      <section id="education" className="w-[min(1180px,calc(100%-40px))] mx-auto py-20 border-t border-line scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-[30px] gap-4">
          <h2 className="font-serif text-[34px] md:text-[42px] tracking-[-0.04em] text-pine-900 leading-tight">
            Pahami Skincare-mu
            <br />
            Lebih Baik.
          </h2>
          <p className="max-w-[420px] text-ink-soft leading-[1.6] text-sm">
            Sedikit pengetahuan bahan bikin label skincare jauh lebih gampang dimengerti.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EDUCATION.map((e) => (
            <article
              key={e.n}
              className="min-h-[230px] flex flex-col justify-between p-6 rounded-[25px] overflow-hidden relative bg-white border border-line transition-transform hover:-translate-y-1"
            >
              <div className="w-[120px] h-[120px] absolute top-[-35px] right-[-25px] rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.8),rgba(215,235,216,0.4))]" />
              <span className="text-pine-700 text-xs font-extrabold">{e.n}</span>
              <div>
                <h3 className="max-w-[180px] mt-auto mb-2 text-[20px] tracking-[-0.03em] font-bold">{e.title}</h3>
                <p className="text-ink-soft text-[13px] leading-[1.5]">{e.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="relative overflow-hidden my-[90px] text-center rounded-[34px] border border-pine-200 bg-pine-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/cta-banner.jpg"
            alt="Pipet serum, tetesan, dan daun hijau"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative px-6 py-[70px] md:py-[90px] md:px-10">
            <h2 className="font-serif text-pine-900 text-[36px] md:text-[46px] tracking-[-0.05em] mb-[14px] [text-shadow:0_2px_20px_rgba(255,255,255,0.9)]">
              Makin tahu. Kulit makin sehat.
            </h2>
            <p className="max-w-[520px] mx-auto text-ink-soft leading-[1.7] [text-shadow:0_1px_12px_rgba(255,255,255,0.9)]">
              Cari produk, pahami bahannya, dan pilih skincare dengan lebih yakin.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
