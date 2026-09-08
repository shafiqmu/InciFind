import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLES, getArticle } from '../../../lib/articles';

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const others = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <main className="w-[min(1180px,calc(100%-40px))] mx-auto pt-10 pb-[90px]">
      <nav className="flex items-center flex-wrap gap-2 mb-8 text-[13px] font-semibold">
        <Link href="/" className="text-ink-soft hover:text-pine-800">
          Beranda
        </Link>
        <span className="text-ink-muted">/</span>
        <Link href="/articles" className="text-ink-soft hover:text-pine-800">
          Artikel
        </Link>
        <span className="text-ink-muted">/</span>
        <span className="text-ink">{article.title}</span>
      </nav>

      <div className="max-w-[720px]">
        <span className="text-xs font-extrabold tracking-[0.14em] text-pine-700 uppercase">
          {article.category}
        </span>
        <h1 className="mt-3 font-serif text-pine-900 text-[clamp(36px,5vw,56px)] leading-[1.02] tracking-[-0.04em]">
          {article.title}
        </h1>
        <p className="mt-4 text-ink-soft text-[16px] leading-[1.7]">{article.desc}</p>
      </div>

      <div className="mt-8 overflow-hidden rounded-[24px] border border-line max-w-[720px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.image} alt="" className="w-full max-h-[380px] object-cover" />
      </div>

      <div className="mt-8 max-w-[720px]">
        {article.body.map((p, i) => (
          <p key={i} className="mb-5 text-ink text-[16px] leading-[1.8]">
            {p}
          </p>
        ))}
        {article.points && article.points.length > 0 && (
          <ul className="my-6 space-y-3 rounded-[20px] border border-line bg-white p-6">
            {article.points.map((pt, i) => (
              <li key={i} className="flex gap-3 text-ink text-[15px] leading-[1.7]">
                <span className="mt-[9px] h-[7px] w-[7px] shrink-0 rounded-full bg-pine-600" />
                {pt}
              </li>
            ))}
          </ul>
        )}
        {article.closing && (
          <p className="text-ink-soft text-[15px] leading-[1.8] italic">{article.closing}</p>
        )}
        <p className="mt-8 text-ink-muted text-[13px] leading-[1.7]">
          Artikel edukasi umum, <strong>bukan nasihat medis</strong>. Untuk kondisi kulit
          tertentu, pertimbangkan berkonsultasi dengan tenaga kesehatan.
        </p>
      </div>

      {others.length > 0 && (
        <div className="mt-14">
          <h2 className="font-serif text-pine-900 text-[26px] mb-4">Artikel lain</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[900px]">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/articles/${o.slug}`}
                className="group overflow-hidden bg-white border border-line rounded-[20px] transition-all hover:-translate-y-1 hover:border-pine-600"
              >
                <div className="relative h-[140px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={o.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold tracking-[0.14em] text-pine-700 uppercase">
                    {o.category}
                  </span>
                  <h3 className="mt-2 text-ink font-bold group-hover:text-pine-800">{o.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
