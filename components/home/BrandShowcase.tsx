import LogoCarousel from './LogoCarousel';

interface BrandShowcaseProps {
  features: Array<{
    title: string;
    desc: string;
    icon: React.ReactNode;
  }>;
}

/**
 * Totem referensi brand (ganti marquee + value props lama):
 * heading jujur + carousel logo KLIKABLE (hanya brand yang file logonya
 * beneran ada) + 4 kartu fitur dalam satu kontainer.
 */
export default function BrandShowcase({ features }: BrandShowcaseProps) {
  return (
    <section className="w-[min(1180px,calc(100%-40px))] mx-auto pb-[110px]">
      <div className="overflow-hidden rounded-[32px] border border-pine-200 bg-pine-100 px-5 py-12 sm:px-10 lg:px-14">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-pine-700">
            Brand yang tersedia di InciFind
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium tracking-[-0.03em] text-pine-900 sm:text-4xl">
            Kenali brand skincare
            <br className="hidden sm:block" />
            yang ada di sini.
          </h2>
        </div>

        <LogoCarousel />

        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-[22px] border border-line bg-white px-6 py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(31,72,48,0.07)]"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pine-100 text-pine-800">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[23px] h-[23px]">
                  {f.icon}
                </svg>
              </div>
              <h3 className="mt-6 text-[17px] font-semibold text-ink">{f.title}</h3>
              <p className="mx-auto mt-2 max-w-[220px] text-sm leading-6 text-ink-soft">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
