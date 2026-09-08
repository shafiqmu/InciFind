import Link from 'next/link';
import { getBrandIndex, searchBrands, BRANDS_PER_PAGE } from '../../lib/brand-index';
import { slugifyBrand } from '../../lib/popular-brands';

interface BrandsPageProps {
  searchParams: { page?: string; q?: string };
}

/** Direktori brand: server-paginated 48/hal + search global. Tanpa JS. */
export default function BrandsPage({ searchParams }: BrandsPageProps) {
  const q = (searchParams?.q || '').trim();
  const { snapshot, full } = getBrandIndex();
  const matched = searchBrands(q);

  const totalPages = Math.max(1, Math.ceil(matched.length / BRANDS_PER_PAGE));
  const page = Math.min(Math.max(1, parseInt(searchParams?.page || '1', 10) || 1), totalPages);
  const items = matched.slice((page - 1) * BRANDS_PER_PAGE, page * BRANDS_PER_PAGE);
  const from = matched.length === 0 ? 0 : (page - 1) * BRANDS_PER_PAGE + 1;
  const to = Math.min(page * BRANDS_PER_PAGE, matched.length);

  const href = (p: number) => {
    const s = new URLSearchParams();
    if (q) s.set('q', q);
    if (p > 1) s.set('page', String(p));
    const qs = s.toString();
    return `/brands${qs ? `?${qs}` : ''}`;
  };

  // Nomor halaman ringkas: 1 … p-1 p p+1 … N
  const nums = new Set([1, totalPages, page - 1, page, page + 1]);
  const pages = [...nums].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);

  return (
    <main className="w-[min(1180px,calc(100%-40px))] mx-auto pt-10 pb-[90px]">
      <div className="mb-8">
        <h1 className="font-serif text-pine-900 text-[clamp(38px,5vw,60px)] leading-[1] tracking-[-0.05em]">
          Brand
        </h1>
        <p className="mt-3 text-ink-soft text-[15px]">
          {full ? (
            <>
              {matched.length} brand terdaftar
              {snapshot ? ` · snapshot ${snapshot}` : ''}
            </>
          ) : (
            'Daftar brand populer.'
          )}
        </p>
      </div>

      <form action="/brands" method="get" className="w-full md:w-[340px] h-[52px] flex items-center px-[18px] bg-white border border-line rounded-full shrink-0 mb-8 shadow-[0_18px_50px_rgba(23,60,42,0.09)]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[19px] h-[19px] text-ink-muted mr-[11px]">
          <circle cx="11" cy="11" r="7"></circle>
          <path d="m20 20-4-4"></path>
        </svg>
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Cari brand..."
          aria-label="Cari brand"
          className="w-full border-0 outline-0 text-ink bg-transparent text-base"
        />
      </form>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((b) => (
            <Link
              key={b.slug}
              href={`/brands/${b.slug}`}
              className="group flex items-center gap-3 p-4 bg-white border border-line rounded-2xl transition-all hover:border-pine-600 hover:-translate-y-0.5"
            >
              <span className="w-11 h-11 grid place-items-center shrink-0 bg-[linear-gradient(145deg,#edf5ed,#f7f2e9)] rounded-xl text-pine-800 font-extrabold text-lg">
                {b.name[0]?.toUpperCase()}
              </span>
              <span className="text-ink text-sm font-bold group-hover:text-pine-800 truncate">
                {b.name}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="py-6 text-ink-muted text-center text-sm italic">
          Tidak ada brand yang cocok.
        </p>
      )}

      {q && items.length === 0 && slugifyBrand(q) && (
        <Link
          href={`/brands/${slugifyBrand(q)}`}
          className="mt-6 block p-4 text-center bg-pine-100 border border-pine-200 rounded-2xl text-pine-800 text-sm font-bold transition-all hover:bg-pine-200"
        >
          Lihat brand &ldquo;{q}&rdquo; →
        </Link>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        <p className="text-ink-soft text-[13px]">
          {from}–{to} dari {matched.length} brand
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link
                href={href(page - 1)}
                className="h-10 px-4 grid place-items-center rounded-full border border-line bg-white text-sm font-bold text-pine-800 transition-all hover:border-pine-600"
              >
                ← Prev
              </Link>
            ) : null}
            <span className="hidden sm:flex items-center gap-1">
              {pages.map((n, i) => (
                <span key={n} className="flex items-center gap-1">
                  {i > 0 && pages[i - 1] !== n - 1 && (
                    <span className="text-ink-muted text-xs px-1">…</span>
                  )}
                  <Link
                    href={href(n)}
                    aria-current={n === page ? 'page' : undefined}
                    className={`h-10 min-w-10 px-2 grid place-items-center rounded-full text-sm font-bold transition-all ${
                      n === page
                        ? 'bg-pine-800 text-white'
                        : 'border border-line bg-white text-pine-800 hover:border-pine-600'
                    }`}
                  >
                    {n}
                  </Link>
                </span>
              ))}
            </span>
            <span className="sm:hidden text-[13px] font-bold text-ink-soft">
              {page} / {totalPages}
            </span>
            {page < totalPages ? (
              <Link
                href={href(page + 1)}
                className="h-10 px-4 grid place-items-center rounded-full bg-pine-800 text-white text-sm font-bold transition-all hover:bg-pine-700"
              >
                Next →
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
