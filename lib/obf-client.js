/**
 * Open Beauty Facts API client
 * Base URL: https://world.openbeautyfacts.org
 *
 * ENDPOINTS:
 * - Search: GET /api/v0/search?search_terms={q}&page_size={n}
 *   Response: { count, page, page_count, page_size, products: [...], skip }
 *   Product item keys: code, product_name, brands, categories, ingredients_text, image_url, ...
 *
 * - Detail: GET /api/v0/product/{barcode}.json
 *   Response: { code, status, status_verbose, product: { ... } }
 */

const BASE = 'https://world.openbeautyfacts.org';

/**
 * Fetch JSON dari OBF dengan retry basic dan timeout.
 */
async function fetchOBF(url, timeoutMs = 15000) {
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

/**
 * Search produk di Open Beauty Facts.
 * @param {string} query   kata kunci pencarian
 * @param {number} limit   jumlah hasil per halaman (max ~50, default 12)
 * @param {number} page    nomor halaman (1-based)
 */
export async function searchProducts(query, limit = 12, page = 1) {
  if (!query || query.trim().length === 0) {
    return { products: [], count: 0, page: 1, pageCount: 0, pageSize: limit };
  }

  const url = new URL(`${BASE}/api/v0/search`);
  url.searchParams.set('search_terms', query.trim());
  url.searchParams.set('page_size', String(limit));
  url.searchParams.set('page', String(page));

  const data = await fetchOBF(url.toString());

  // Normalisasi response
  const products = Array.isArray(data.products) ? data.products : [];
  const mapped = products.map((p) => normalizeProduct(p));

  return {
    products: mapped,
    count: typeof data.count === 'number' ? data.count : 0,
    page: typeof data.page === 'number' ? data.page : page,
    pageCount: typeof data.page_count === 'number' ? data.page_count : 0,
    pageSize: limit,
  };
}

/**
 * Ambil detail produk dari barcode.
 */
export async function getProductByBarcode(barcode) {
  const url = `${BASE}/api/v0/product/${barcode}.json`;
  const data = await fetchOBF(url);

  // OBF sometime return { status:0, status_verbose:"product not found" }
  if (data.status !== 1 || !data.product) {
    return null;
  }

  return normalizeProduct(data.product);
}

/**
 * Normalisasi field dari response OBF ke format lokal.
 */
function normalizeProduct(p) {
  const barcode = typeof p.code === 'string' ? p.code : String(p.code || '');
  const ingredientRaw = typeof p.ingredients_text === 'string' ? p.ingredients_text : '';

  // OBF ingredients_text biasanya comma-separated: "aquq/water, glycerin, ..."
  const ingredients = ingredientRaw
    ? ingredientRaw
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  // extract brand utama (first brand)
  const brandsRaw = Array.isArray(p.brands)
    ? p.brands
    : typeof p.brands === 'string'
      ? p.brands.split(',').map((s) => s.trim())
      : [];
  const brand = brandsRaw.find((b) => b && b.length > 0) || '';

  // extract kategori utama
  const categoriesRaw = Array.isArray(p.categories)
    ? p.categories
    : typeof p.categories === 'string'
      ? p.categories.split(',').map((s) => s.trim())
      : [];
  const category = categoriesRaw.find((c) => c && c.length > 0) || '';

  return {
    id: barcode || String(p._id || p.key || ''),
    barcode,
    slug: barcode || '',
    name: typeof p.product_name === 'string' ? p.product_name : '',
    brand,
    category,
    description: '',
    imageUrl: typeof p.image_url === 'string' && p.image_url.length > 0 ? p.image_url : '',
    inciList: ingredients,
    notes: '',
    dataCompleteness: ingredients.length > 0 ? 'complete' : 'partial',
    // data mentah OBF (untuk referensi nanti)
    raw: {
      product_name: p.product_name,
      brands: p.brands,
      categories: p.categories,
      ingredients_text: p.ingredients_text,
      image_url: p.image_url,
      _id: p._id,
      data: p,
    },
  };
}

/**
 * Cek apakah produk ini kemungkinan besar skincare (dari kategori).
 * Ini dasar filter supaya hasil search nggak sembarangan.
 */
export function isLikelySkincare(product) {
  if (!product) return false;
  const cat = (product.category || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();

  // Trigger kata kunci
  const skincareKeywords = [
    'lotion', 'cream', 'serum', 'toner', 'cleanser', 'washing',
    'moisturizer', 'moisturiser', 'oil', 'mask', 'peeling', 'exfoliant',
    'sunscreen', 'spf', 'day cream', 'night cream', 'eye cream',
    'bath', 'soap', 'shampoo', 'conditioner', 'make-up', 'makeup',
    'foundation', 'mascara', 'lipstick', 'makeup remover', 'micellar',
    'beauty', 'skincare', 'sun block',
  ];

  if (skincareKeywords.some((kw) => cat.includes(kw) || name.includes(kw) || brand.includes(kw))) {
    return true;
  }

  // Exclude kategori yang jelas bukan skincare
  const nonSkincare = ['food', 'snack', 'drink', 'beverage', 'alcohol', 'wine', 'bread', 'sauce', 'meat', 'dairy', 'cereal'];
  if (nonSkincare.some((kw) => cat.includes(kw))) {
    return false;
  }

  return true;
}
