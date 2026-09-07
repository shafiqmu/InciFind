import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '../../../data/products';
import { getInkeeProduct } from '../../../lib/inkee-client';
import { analyzeFormula } from '../../../lib/formula/rule-engine';
import { getFormulaAnalysis } from '../../../lib/ai/analyst';
import { matchIngredients } from '../../../lib/match-ingredients';
import { ingredientsReference } from '../../../lib/ingredients-reference';
import ProductHero from '../../../components/hero/ProductHero';
import FormulaAnalysis from '../../../components/formula/FormulaAnalysis';
import InciList from '../../../components/inci-list/InciList';
import ProductDisclaimer from '../../../components/disclaimer/ProductDisclaimer';

interface ProductPageProps {
  params: { slug: string };
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

function truncate(s: string, n = 110): string {
  if (!s) return '';
  return s.length > n ? s.slice(0, n).trimEnd() + '…' : s;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;

  // 1. Coba INKEE Decoder dulu (sumber utama opsi B)
  const inkee = await getInkeeProduct(slug);

  // 2. Fallback ke data statis lokal (offline / slug contoh)
  const staticProduct = products.find((p) => p.slug === slug);

  const product = inkee
    ? {
        name: inkee.name,
        brand: inkee.brand,
        category: inkee.hashtags[0] || staticProduct?.category || 'Product',
        description: inkee.description,
        imageUrl: inkee.imageUrl,
        inciList: inkee.inciList,
        hashtags: inkee.hashtags,
      }
    : staticProduct;

  if (!product) {
    notFound();
  }

  // Badge/warning pakai logic lokal (ingredientsReference + matchIngredients)
  const { warnings, disclosures } = matchIngredients(product.inciList || []);

  const funcMap = inkee?.functionsByIngredient || {};
  const longMap = inkee?.longDescByIngredient || {};
  const riskMap = inkee?.riskByIngredient || {};

  const riskText = (name: string): string | undefined => {
    const r = riskMap[name];
    if (!r) return undefined;
    const parts: string[] = [];
    if (r.irritancy) parts.push(`Iritasi ${r.irritancy}`);
    if (r.comedogenicity) parts.push(`Komedogenik ${r.comedogenicity}`);
    return parts.length > 0 ? parts.join(' · ') : undefined;
  };

  const inciListWithBadges = (product.inciList || []).map((ingredientName: string) => {
    const ref = (ingredientsReference as Record<string, { category?: string | null; label?: string; context?: string | null }>)[ingredientName];
    const badges = ref?.category
      ? [{ label: ref.label || ingredientName, category: ref.category }]
      : [];
    const context = ref?.context || undefined;
    const longDescription = longMap[ingredientName];
    const short = riskText(ingredientName) || context || truncate(longDescription || '') || undefined;
    return {
      name: ingredientName,
      badges,
      context,
      functions: funcMap[ingredientName] || [],
      short,
      longDescription,
    };
  });

  // Rule Engine: profil 5 aspek + bahan utama + inciHash (deterministik, tanpa AI)
  const formula = analyzeFormula(product.inciList || [], funcMap);

  // AI Analyst: 1x call per formula, cache slug:hash:v1 (null → fallback UI)
  const ai = await getFormulaAnalysis({
    slug,
    inciHash: formula.inciHash,
    profil: {
      hidrasi: formula.profile.hydration.level,
      barrier: formula.profile.barrier.level,
      menenangkan: formula.profile.soothing.level,
      mencerahkan: formula.profile.brightening.level,
      eksfoliasi: formula.profile.exfoliation.level,
    },
    bahanUtama: formula.keyIngredients.map((k) => k.name),
    perhatian: warnings.map((w) => w.ingredient),
    keterbatasan: [
      'Konsentrasi pasti bahan tidak tersedia',
      'pH produk tidak tersedia',
    ],
  });

  return (
    <main className="w-[min(1180px,calc(100%-40px))] mx-auto pt-10 md:pt-10 pb-[90px]">
      <Link
        href="/"
        className="inline-flex items-center gap-2 mb-[35px] text-ink-soft text-[13px] font-semibold hover:text-pine-800"
      >
        ← Kembali ke pencarian
      </Link>

      <ProductHero
        name={product.name || 'Produk'}
        brand={product.brand || 'Merek tidak dikenal'}
        category={product.category || 'Produk'}
        description={product.description || 'Belum ada deskripsi'}
        imageUrl={product.imageUrl || ''}
        ingredientCount={(product.inciList || []).length}
      />

      {/* TOMBOL ANALISIS FORMULA */}
      <section className="mb-[55px]">
        <FormulaAnalysis
          productName={product.name || 'Produk'}
          productBrand={product.brand || ''}
          profile={formula.profile}
          keyIngredients={formula.keyIngredients}
          warnings={warnings.map((w) => ({
            ingredient: w.ingredient,
            label: w.label,
            context: w.context,
          }))}
          aiKesimpulan={ai?.kesimpulan || null}
          aiCatatan={ai?.catatan || null}
          limitations={[
            'Konsentrasi pasti bahan tidak tersedia',
            'pH produk tidak tersedia',
          ]}
        />
      </section>

      {/* WARNINGS + INFO */}
      <section className="grid md:grid-cols-2 gap-4 mb-[55px]">
        <article className="p-[22px] rounded-[20px] border bg-sun-bg border-[#f0df9c]">
          <div className="flex items-center gap-[11px] mb-[10px]">
            <div className="w-[31px] h-[31px] grid place-items-center rounded-full font-black bg-sun text-[#665015]">
              !
            </div>
            <h3 className="text-sm font-bold">Bahan yang Perlu Diperhatikan</h3>
          </div>
          {warnings.length > 0 ? (
            <ul className="pl-[42px] flex flex-wrap gap-[7px] list-none">
              {warnings.map((w, idx) => (
                <li
                  key={idx}
                  title={w.context}
                  className="px-[9px] py-[6px] text-[#765d12] bg-white/65 border border-[#ead997] rounded-lg text-xs font-bold"
                >
                  {w.ingredient}
                </li>
              ))}
            </ul>
          ) : (
            <p className="pl-[42px] text-ink-soft text-[13px] leading-[1.6]">
              Tidak ada bahan yang ditandai di daftar referensi kami.
            </p>
          )}
          {disclosures.length > 0 && (
            <p className="pl-[42px] mt-3 text-ink-soft text-[13px] leading-[1.6]">
              {disclosures.length} catatan keterbatasan data — lihat detail bahan di bawah.
            </p>
          )}
        </article>

        <article className="p-[22px] rounded-[20px] border bg-[#f1f4f2] border-[#dce3de]">
          <div className="flex items-center gap-[11px] mb-[10px]">
            <div className="w-[31px] h-[31px] grid place-items-center rounded-full font-black bg-[#dce6df] text-pine-800">
              i
            </div>
            <h3 className="text-sm font-bold">Keterbatasan Data</h3>
          </div>
          <p className="pl-[42px] text-ink-soft text-[13px] leading-[1.6]">
            Info bahan berdasarkan data produk publik yang tersedia. Formula bisa berubah
            tergantung wilayah, versi produk, atau waktu. Selalu cek kemasan terbaru.
          </p>
        </article>
      </section>

      {/* INGREDIENTS */}
      <InciList ingredients={inciListWithBadges} />

      <ProductDisclaimer />
    </main>
  );
}
