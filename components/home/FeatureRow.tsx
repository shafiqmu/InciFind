interface FeatureRowProps {
  features: Array<{
    title: string;
    desc: string;
    icon: React.ReactNode;
  }>;
}

/** Editorial row: ikon kecil + nomor + judul serif, pemisah garis. */
export default function FeatureRow({ features }: FeatureRowProps) {
  return (
    <section>
      <div className="w-[min(1180px,calc(100%-40px))] mx-auto grid grid-cols-1 gap-9 py-[62px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="px-0 text-center sm:px-6 lg:px-11 lg:[&:not(:last-child)]:border-r lg:[&:not(:last-child)]:border-line"
          >
            <div className="mx-auto mb-[14px] flex h-[58px] w-[58px] items-center justify-center rounded-full bg-pine-100 text-pine-800">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                {f.icon}
              </svg>
            </div>
            <span className="mb-[7px] block text-[10px] tracking-[2px] text-ink-muted">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="mb-2 font-serif text-[22px] font-normal text-ink">{f.title}</h3>
            <p className="mx-auto max-w-[240px] text-[13px] leading-[1.55] text-ink-soft">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
