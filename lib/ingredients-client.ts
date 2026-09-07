const BASE = 'https://world.openbeautyfacts.org';

/**
 * Fetch JSON dari OBF dengan timeout.
 */
async function fetchOBF(url: string, timeoutMs = 15000): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'SkincareDB-Client/1.0 (research)',
        'Accept': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

// ---------- Tipe data ----------

/** Produk dasar dari OBF setelah di-normalize */
export interface Product {
  id: string;
  barcode: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  imageUrl: string;
  inciList: string[];
  notes: string;
  dataCompleteness: 'complete' | 'partial' | 'empty';
  raw: Record<string, unknown>;
}

export interface SearchResponse {
  products: Product[];
  count: number;
  totalCount: number;
  page: number;
  pageCount: number;
  pageSize: number;
  query: string;
  source: 'static' | 'obf';
  hasMore: boolean;
}

// ---------- Fungsi ----------

/**
 * Cari produk di Open Beauty Facts.
 */
export async function searchProducts(
  query: string,
  limit = 12,
  page = 1
): Promise<SearchResponse> {
  if (!query || query.trim().length === 0) {
    return {
      products: [],
      count: 0,
      totalCount: 0,
      page: 1,
      pageCount: 0,
      pageSize: limit,
      query: query.trim(),
      source: 'static',
      hasMore: false,
    };
  }

  const url = new URL(`${BASE}/api/v0/search`);
  url.searchParams.set('search_terms', query.trim());
  url.searchParams.set('page_size', String(limit));
  url.searchParams.set('page', String(page));

  const data = await fetchOBF(url.toString());
  const json = data as Record<string, unknown>;

  const rawProducts = Array.isArray(json.products) ? (json.products as unknown[]) : [];
  const products: Product[] = rawProducts.map((p) => normalizeProduct(p as Record<string, unknown>));

  return {
    products,
    count: products.length,
    totalCount: typeof json.count === 'number' ? json.count : 0,
    page: typeof json.page === 'number' ? json.page : page,
    pageCount: typeof json.page_count === 'number' ? json.page_count : 0,
    pageSize: limit,
    query: query.trim(),
    source: 'obf',
    hasMore: page < (typeof json.page_count === 'number' ? json.page_count : 0),
  };
}

/**
 * Ambil detail produk dari barcode.
 */
export async function getProductByBarcode(barcode: string): Promise<Product | null> {
  if (!barcode || barcode.trim().length === 0) return null;
  const url = `${BASE}/api/v0/product/${barcode}.json`;
  const data = await fetchOBF(url);
  const json = data as Record<string, unknown>;

  if (json.status !== 1 || !json.product) return null;
  return normalizeProduct(json.product as Record<string, unknown>);
}

// ---------- Normalisasi ----------

function normalizeProduct(p: Record<string, unknown>): Product {
  const code = p.code;
  const barcode =
    typeof code === 'string' && code.length > 0
      ? code
      : (typeof p._id === 'string' ? p._id : '');

  const rawIngredients =
    typeof p.ingredients_text === 'string' ? p.ingredients_text : '';

  const ingredients: string[] = rawIngredients
    ? rawIngredients
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0)
    : [];

  const brandsRaw = Array.isArray(p.brands)
    ? (p.brands as unknown[])
    : typeof p.brands === 'string'
      ? (p.brands as string).split(',').map((s: string) => s.trim())
      : [];
  const brand = (brandsRaw.find((b: unknown) => typeof b === 'string' && b.length > 0) as string) || '';

  const categoriesRaw = Array.isArray(p.categories)
    ? (p.categories as unknown[])
    : typeof p.categories === 'string'
      ? (p.categories as string).split(',').map((s: string) => s.trim())
      : [];
  const category =
    (categoriesRaw.find((c: unknown) => typeof c === 'string' && c.length > 0) as string) || '';

  const imageUrl =
    typeof p.image_url === 'string' && p.image_url.length > 0 ? p.image_url : '';

  return {
    id: barcode || (typeof p._id === 'string' ? p._id : ''),
    barcode,
    slug: barcode || '',
    name: typeof p.product_name === 'string' ? p.product_name : '',
    brand,
    category,
    description: '',
    imageUrl,
    inciList: ingredients,
    notes: '',
    dataCompleteness: ingredients.length > 0 ? 'complete' : 'empty',
    raw: p,
  };
}

// ---------- Flag kulit ----------

const SKINCARE_KEYWORDS = [
  'lotion', 'cream', 'serum', 'toner', 'cleanser', 'washing',
  'moisturizer', 'moisturiser', 'oil', 'mask', 'peeling', 'exfoliant',
  'sunscreen', 'spf', 'day cream', 'night cream', 'eye cream',
  'bath', 'soap', 'shampoo', 'conditioner', 'make-up', 'makeup',
  'foundation', 'mascara', 'lipstick', 'makeup remover', 'micellar',
  'beauty', 'skincare', 'sun block',
];

export function isLikelySkincare(product: Product): boolean {
  if (!product) return false;

  const haystack = `${product.category} ${product.name} ${product.brand}`.toLowerCase();

  // Exclude sektor yang jelas bukan skincare
  const nonSkincare = ['food', 'snack', 'drink', 'beverage', 'alcohol', 'wine', 'bread', 'sauce', 'meat', 'dairy', 'cereal'];
  if (nonSkincare.some((kw) => haystack.includes(kw))) return false;

  return SKINCARE_KEYWORDS.some((kw) => haystack.includes(kw));
}
