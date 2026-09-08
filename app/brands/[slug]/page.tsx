import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getInkeeBrand } from '../../../lib/inkee-client';
import BrandGrid from '../../../components/brand/BrandGrid';

interface BrandPageProps {
  params: { slug: string };
}

export const dynamicParams = true;

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = params;

  const brand = await getInkeeBrand(slug);
  if (!brand || brand.products.length === 0) {
    notFound();
  }

  // Server hanya kirim nama+slug (cepat). Foto diisi progresif di client
  // via /api/product-meta supaya first paint tidak nunggu ratusan fetch.
  const items = brand.products.map((p) => ({
    slug: p.slug,
    name: p.name,
  }));

  return (
    <main className="w-[min(1180px,calc(100%-40px))] mx-auto pt-10 pb-[90px]">
      <nav className="flex items-center gap-2 mb-[35px] text-[13px] font-semibold">
        <Link href="/" className="text-ink-soft hover:text-pine-800">
          Beranda
        </Link>
        <span className="text-ink-muted">/</span>
        <Link href="/brands" className="text-ink-soft hover:text-pine-800">
          Semua brand
        </Link>
        <span className="text-ink-muted">/</span>
        <span className="text-ink">{brand.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-serif text-pine-900 text-[clamp(38px,5vw,60px)] leading-[1] tracking-[-0.05em]">
          {brand.name}
        </h1>
        <p className="mt-3 text-ink-soft text-[15px]">
          Produk yang tersedia di InciFind · {brand.products.length} produk
          {brand.hasMore ? ' atau lebih' : ''}
        </p>
      </div>

      <BrandGrid items={items} />

      <p className="mt-10 text-ink-muted text-xs">
        Sumber data: inkeedecoder.com —{' '}
        <a
          href={`https://inkeedecoder.com/brands/${brand.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-pine-800"
        >
          lihat halaman brand aslinya
        </a>
        .
      </p>
    </main>
  );
}
