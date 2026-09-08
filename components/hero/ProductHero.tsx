interface ProductHeroProps {
  name: string;
  brand: string;
  category: string;
  imageUrl: string;
  ingredientCount: number;
}

export default function ProductHero({ name, brand, category, imageUrl, ingredientCount }: ProductHeroProps) {
  return (
    <section className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-[70px] items-center mb-[60px]">
      <div className="min-h-[390px] md:min-h-[550px] grid place-items-center relative rounded-[34px] bg-[radial-gradient(circle_at_50%_40%,#ffffff_0%,#eef4ee_55%,#e5eee4_100%)] border border-line overflow-hidden p-8">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={name} className="max-w-full max-h-[420px] object-contain relative z-[2] rounded-2xl" />
        ) : (
          <div className="w-[150px] h-[355px] relative rounded-[26px_26px_35px_35px] bg-[linear-gradient(90deg,#181e1c_0%,#5f645d_17%,#a69f82_48%,#4a4f4a_78%,#171c1a_100%)] shadow-[0_25px_45px_rgba(24,43,34,0.25)] z-[2]" />
        )}
        <div className="w-[190px] h-[25px] absolute bottom-[85px] bg-[rgba(26,56,42,0.15)] rounded-full blur-[14px]" />
      </div>

      <div>
        <div className="text-pine-700 text-[13px] font-extrabold uppercase tracking-[0.12em] mb-[10px]">
          {brand}
        </div>
        <h1 className="max-w-[650px] font-serif text-[clamp(42px,5vw,66px)] leading-[0.98] tracking-[-0.055em] text-pine-900 mb-[22px]">
          {name}
        </h1>
        {category && (
          <span className="inline-flex px-[11px] py-[7px] bg-pine-100 border border-pine-200 text-pine-800 rounded-full text-xs font-bold mb-5">
            {category}
          </span>
        )}
        <div className="flex flex-wrap gap-[10px]">
          <div className="px-4 py-3 bg-white border border-line rounded-[14px] text-xs">
            <span className="block mb-[3px] text-ink-muted">Merek</span>
            <strong className="text-[13px]">{brand}</strong>
          </div>
          <div className="px-4 py-3 bg-white border border-line rounded-[14px] text-xs">
            <span className="block mb-[3px] text-ink-muted">Jenis produk</span>
            <strong className="text-[13px]">{category}</strong>
          </div>
          <div className="px-4 py-3 bg-white border border-line rounded-[14px] text-xs">
            <span className="block mb-[3px] text-ink-muted">Bahan</span>
            <strong className="text-[13px]">{ingredientCount} terdaftar</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
