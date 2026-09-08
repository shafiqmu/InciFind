import Link from 'next/link';
import { ARTICLES } from '../../lib/articles';

export default function ArticlesPage() {
  return (
    <main className="w-[min(1180px,calc(100%-40px))] mx-auto pt-10 pb-[90px]">
      <nav className="flex items-center gap-2 mb-8 text-[13px] font-semibold">
        <Link href="/" className="text-ink-soft hover:text-pine-800">
          Beranda
        </Link>
        <span className="text-ink-muted">/</span>
        <span className="text-ink">Artikel</span>
      </nav>

      <h1 className="font-serif text-pine-900 text-[clamp(38px,5vw,60px)] leading-[1] tracking-[-0.05em] mb-3">
        Belajar soal skincare.
      </h1>
      <p className="text-ink-soft text-[15px] mb-8">
        Panduan singkat berbahasa Indonesia. Bukan nasihat medis.
      </p>

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
              <h2 className="mt-[11px] mb-2 font-serif text-[20px] text-ink group-hover:text-pine-800">
                {a.title}
              </h2>
              <p className="text-ink-soft text-xs leading-[1.6]">{a.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
