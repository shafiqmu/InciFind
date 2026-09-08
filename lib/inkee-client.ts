/**
 * INKEE Decoder client wrapper (opsi B: sumber data utama).
 *
 * - Search + detail produk via inkeedecoder.com (scraper resmi lib @knorby).
 * - Server-side only: dipanggil dari Route Handler / Server Component.
 * - Cache memori via lib/cache (TTL 10 mnt) + politeness delay bawaan client.
 * - Tidak ada barcode/UPC di inkeedecoder → barcode flow memang mati (410).
 */
import { createInkeedecoderClient } from '@knorby/inkeedecoder-client';
import type { Product as InkeeProduct } from '@knorby/inkeedecoder-client';
import { cacheKey, memoryCache } from '@/lib/cache';
import { translateIngredient } from '@/lib/translate';

// ---- Singleton (tahan HMR) ----
type Client = ReturnType<typeof createInkeedecoderClient>;
function getClient(): Client {
  const g = globalThis as unknown as { __inkeeClient?: Client };
  if (!g.__inkeeClient) {
    g.__inkeeClient = createInkeedecoderClient({
      requestIntervalMs: 1000,
      maxPages: 5,
    });
  }
  return g.__inkeeClient;
}

// ---- Shape lokal (kompatibel dgn SearchBar + halaman produk) ----
export interface LocalProductCard {
  id: string;
  barcode: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: string;
  description: string;
  imageUrl: string;
  inciList: string[];
  notes: string;
  dataCompleteness: 'complete' | 'partial' | 'empty';
  source: 'inkee';
}

export interface InkeeDetail extends LocalProductCard {
  hashtags: string[];
  functionsByIngredient: Record<string, string[]>;
  longDescByIngredient: Record<string, string>;
  riskByIngredient: Record<string, { irritancy?: string; comedogenicity?: string }>;
  tooltips: Array<{
    slug: string;
    irritancy?: string;
    comedogenicity?: string;
    blurb?: string;
  }>;
  skimTable: Array<{
    ingredient: string;
    irritancy?: string;
    comedogenicity?: string;
    ourTake?: string;
  }>;
}

function cardFromRef(ref: { name: string; slug: string }): LocalProductCard {
  return {
    id: ref.slug,
    barcode: ref.slug,
    slug: ref.slug,
    name: ref.name,
    brand: '',
    brandSlug: '',
    category: '',
    description: '',
    imageUrl: '',
    inciList: [],
    notes: '',
    dataCompleteness: 'empty',
    source: 'inkee',
  };
}

async function detailFromInkee(p: InkeeProduct): Promise<InkeeDetail> {
  const inciList = Array.isArray(p.ingredients)
    ? p.ingredients.map((i) => i.name).filter(Boolean)
    : [];
  // Balik grouping fungsi → per bahan (nama → daftar fungsi)
  const functionsByIngredient: Record<string, string[]> = {};
  const groups = [
    ...(p.functions?.key || []),
    ...(p.functions?.other || []),
  ];
  for (const g of groups) {
    const fn = g.function?.name || '';
    if (!fn) continue;
    for (const ing of g.ingredients || []) {
      if (!ing?.name) continue;
      if (!functionsByIngredient[ing.name]) functionsByIngredient[ing.name] = [];
      if (!functionsByIngredient[ing.name].includes(fn)) {
        functionsByIngredient[ing.name].push(fn);
      }
    }
  }
  // Risiko iritasi/komedogenik → per bahan (dari skimTable + tooltips)
  const riskByIngredient: Record<string, { irritancy?: string; comedogenicity?: string }> = {};
  for (const s of p.skimTable || []) {
    const n = s.ingredient?.name || '';
    if (n && !riskByIngredient[n]) {
      riskByIngredient[n] = { irritancy: s.irritancy, comedogenicity: s.comedogenicity };
    }
  }
  const slugToName: Record<string, string> = {};
  for (const ing of p.ingredients || []) {
    if (ing?.slug && ing?.name) slugToName[ing.slug] = ing.name;
  }
  for (const tp of p.tooltips || []) {
    const n = (tp?.slug && slugToName[tp.slug]) || '';
    if (n && !riskByIngredient[n]) {
      riskByIngredient[n] = { irritancy: tp.irritancy, comedogenicity: tp.comedogenicity };
    }
  }
  // Deskripsi pendek (blurb) diutamakan; kalau tidak ada baru long desc.
  // Keduanya diterjemahkan ke Indonesia, cache permanen.
  const isPlaceholder = (s: string) =>
    /we don.?t have a (description|blurb)/i.test(s) ||
    /no description available/i.test(s);
  const blurbByName: Record<string, string> = {};
  for (const tp of p.tooltips || []) {
    const n = (tp?.slug && slugToName[tp.slug]) || '';
    if (n && tp.blurb && !isPlaceholder(tp.blurb) && !blurbByName[n]) blurbByName[n] = tp.blurb;
  }
  const longByName: Record<string, string> = {};
  for (const e of p.longDescriptions || []) {
    const n = e.ingredient?.name || '';
    if (n && e.description && !longByName[n]) longByName[n] = e.description;
  }
  const rawDesc: Array<{ name: string; text: string }> = [];
  for (const n of new Set([...Object.keys(blurbByName), ...Object.keys(longByName)])) {
    const text = blurbByName[n] || longByName[n] || '';
    if (text) rawDesc.push({ name: n, text });
  }
  const longDescByIngredient: Record<string, string> = {};
  for (let i = 0; i < rawDesc.length; i += 4) {
    const batch = await Promise.all(
      rawDesc.slice(i, i + 4).map(async (r) => ({
        name: r.name,
        text: await translateIngredient(r.name, r.text, inciList),
      }))
    );
    for (const b of batch) {
      if (b.text) longDescByIngredient[b.name] = b.text;
    }
  }
  return {
    id: p.slug,
    barcode: p.slug,
    slug: p.slug,
    name: p.fullName || p.name,
    brand: p.brand?.name || '',
    brandSlug: p.brand?.slug || '',
    category: '',
    description: p.description || '',
    imageUrl: p.images?.original || '',
    inciList,
    notes: '',
    dataCompleteness: inciList.length > 0 ? 'complete' : 'empty',
    source: 'inkee',
    hashtags: Array.isArray(p.hashtags) ? p.hashtags.map((h) => h.label || h.tag) : [],
    functionsByIngredient,
    longDescByIngredient,
    riskByIngredient,
    tooltips: Array.isArray(p.tooltips)
      ? p.tooltips.map((t) => ({
          slug: t.slug,
          irritancy: t.irritancy,
          comedogenicity: t.comedogenicity,
          blurb: t.blurb,
        }))
      : [],
    skimTable: Array.isArray(p.skimTable)
      ? p.skimTable.map((s) => ({
          ingredient: s.ingredient?.name || '',
          irritancy: s.irritancy,
          comedogenicity: s.comedogenicity,
          ourTake: s.ourTake,
        }))
      : [],
  };
}

// ---- Search (1 request: tab products, page N) ----
export async function searchInkee(
  query: string,
  limit = 12,
  page = 1
): Promise<{ products: LocalProductCard[]; hasMore: boolean }> {
  const q = query.trim();
  if (!q) return { products: [], hasMore: false };
  const key = cacheKey(['inkee', 'search', q, page, limit]);
  const cache = memoryCache(key);
  const hit = cache.get() as { products: LocalProductCard[]; hasMore: boolean } | null;
  if (hit) return hit;

  const client = getClient();
  try {
    const res = await client.search(q, { tab: 'products', page });
    const items = res.results.items.slice(0, limit);
    const out = { products: items.map(cardFromRef), hasMore: res.results.hasMore };
    cache.set(out);
    console.info('[INKEE] search_products success', { q, count: items.length });
    return out;
  } catch (err) {
    console.error('[INKEE] search_products error', { q, error: err instanceof Error ? err.message : String(err) });
    throw err;
  }
}

// ---- Brand: daftar produk per merek (untuk /brands/[slug]) ----
export interface InkeeBrandListing {
  slug: string;
  name: string;
  products: Array<{ slug: string; name: string }>;
  hasMore: boolean;
}

export async function getInkeeBrand(slug: string): Promise<InkeeBrandListing | null> {
  const s = slug.trim();
  if (!s) return null;
  const key = cacheKey(['inkee', 'brand', s]);
  const cache = memoryCache(key);
  const hit = cache.get() as InkeeBrandListing | null;
  if (hit) return hit;

  try {
    const client = getClient();
    const b = await client.getBrand(s, { allPages: true });
    if (!b || !b.slug) {
      console.warn('[INKEE] get_brand empty', { slug: s });
      return null;
    }
    const out: InkeeBrandListing = {
      slug: b.slug,
      name: b.name,
      products: (b.products?.items || []).map((r) => ({ slug: r.slug, name: r.name })),
      hasMore: b.products?.hasMore || false,
    };
    cache.set(out);
    console.info('[INKEE] get_brand success', { slug: s, count: out.products.length });
    return out;
  } catch (err) {
    console.error('[INKEE] get_brand error', { slug: s, error: err instanceof Error ? err.message : String(err) });
    return null;
  }
}

// ---- Detail produk by slug ----
export async function getInkeeProduct(slug: string): Promise<InkeeDetail | null> {
  const s = slug.trim();
  if (!s) return null;
  const key = cacheKey(['inkee', 'product', s]);
  const cache = memoryCache(key);
  const hit = cache.get() as InkeeDetail | null;
  if (hit) return hit;

  try {
    const client = getClient();
    const p = await client.getProduct(s, { functions: true, longDescriptions: true, skimTable: true, tooltips: true });
    if (!p || !p.slug) {
      console.warn('[INKEE] get_product empty', { slug: s });
      return null;
    }
    const out = await detailFromInkee(p);
    cache.set(out);
    console.info('[INKEE] get_product success', { slug: s, inci: out.inciList.length });
    return out;
  } catch (err) {
    console.error('[INKEE] get_product error', { slug: s, error: err instanceof Error ? err.message : String(err) });
    return null;
  }
}
