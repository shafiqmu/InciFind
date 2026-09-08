import BrandIndex from '../../components/brand/BrandIndex';

export default function BrandsPage() {
  return (
    <main className="w-[min(1180px,calc(100%-40px))] mx-auto pt-10 pb-[90px]">
      <div className="mb-8">
        <h1 className="font-serif text-pine-900 text-[clamp(38px,5vw,60px)] leading-[1] tracking-[-0.05em]">
          Brand
        </h1>
        <p className="mt-3 text-ink-soft text-[15px]">
          Temukan produk berdasarkan brand populer.
        </p>
      </div>

      <BrandIndex />
    </main>
  );
}
