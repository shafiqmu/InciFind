/**
 * Unified products module (simple version)
 * 
 * Menggabungkan data dari multiple sources:
 * 1. Open Beauty Facts (world.openbeautyfacts.org) - primary, gratis tanpa key
 * 2. Mock/local data - fallback terakhir
 * 
 * Urutan prioritas:
 * - Coba OBF dulu (kalau ada)
 * - Kalau tidak ada, pakai mock data
 */

// ---- Tipe data ----
export interface Product {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  dataCompleteness: 'complete' | 'partial' | 'mock' | 'empty';
  source: 'obf' | 'mock';
}

export async function getProductByBarcode(barcode: string): Promise<Product | null> {
  // 1. Coba Open Beauty Facts dulu
  try {
    const obfProduct = await getProductFromOBF(barcode);
    if (obfProduct) return obfProduct;
  } catch (e) {
    console.warn('[getProductByBarcode] OBF fetch failed:', e);
  }
  
  // 2. Fallback ke mock data
  return getMockProduct(barcode);
}

export async function searchProducts(query: string): Promise<Product[]> {
  // Simple: cari di mock data saja
  const mockProducts = getAllMockProducts();
  if (!query.trim()) return mockProducts;
  
  const q = query.toLowerCase();
  return mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
  );
}

// ---- Open Beauty Facts (self-contained) ----
const OBF_BASE = 'https://world.openbeautyfacts.org/api/v0/product/';

async function getProductFromOBF(barcode: string): Promise<Product | null> {
  const url = `${OBF_BASE}${barcode}.json`;
  
  const res = await fetch(url, {
    signal: AbortSignal.timeout(8000),
  });
  
  if (!res.ok) return null;
  
  const data = await res.json();
  
  // OBF response structure: product.generic_name, product.brand, product.ingredients_text
  console.log('[OBF] Raw response keys:', Object.keys(data));
  
  const ingredientsText = data.product?.ingredients_text || data.ingredients_text || '';
  const ingredients = ingredientsText
    ? ingredientsText.split(',').map((s: string) => s.trim()).filter(Boolean)
    : [];
  
  const product: Product = {
    id: barcode,
    barcode,
    name: data.product?.generic_name || data.product?.name || 'Unknown Product',
    brand: data.product?.brand || 'Unknown Brand',
    category: data.product?.category || 'Unknown',
    description: data.product?.description || '',
    imageUrl: data.product?.image_url || data.image_url || '',
    ingredients,
    dataCompleteness: ingredients.length > 0 ? 'complete' : 'partial',
    source: 'obf',
  };
  
  return product;
}

// ---- Mock data (fallback) ----
const MOCK_PRODUCTS: Record<string, Product> = {
  '0000000000000': {
    id: '0000000000000',
    barcode: '0000000000000',
    name: 'HR RE-PLASTY AGE RECOVERY NIGHT 50',
    brand: 'Blist Brasil',
    category: 'Cosmetics',
    description: 'Night recovery cream for anti-aging.',
    imageUrl: '',
    ingredients: [
      'Aqua', 'Isopropyl Palmitate', 'Ethylhexyl Palmitate', 'Glycerin',
      'Maris Aqua', 'Succinic Acid', 'Parfum', 'Mannan', 'Steareth-100',
      'Sodium Citrate', 'Tetrasodium Glutamate Diacetate', 'Steareth-2',
      'Citric Acid', 'Silicone Quaternium-22', 'Dipropylene Glycol',
      'Polyglyceryl-3 Caprate', 'Xanthan Gum'
    ],
    dataCompleteness: 'mock',
    source: 'mock' as const,
  },
};

export function getMockProduct(barcode: string): Product | null {
  return MOCK_PRODUCTS[barcode] || null;
}

export function getAllMockProducts(): Product[] {
  return Object.values(MOCK_PRODUCTS);
}

// Static fallback untuk SearchBar (shape kompatibel dgn ingredients-client Product).
// SearchBar dynamic-import fungsi ini; return any[] supaya tidak bentrok tipe.
const STATIC_FALLBACK: Array<{
  id: string;
  barcode: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  imageUrl: string;
  inciList: string[];
}> = [
  { id: '1', barcode: '1', slug: 'cerave-moisturizing-cream', name: 'Moisturizing Cream', brand: 'CeraVe', category: 'Moisturizer', description: 'Fragrance-free, ceramide-rich moisturizer for sensitive skin.', imageUrl: '', inciList: [] },
  { id: '2', barcode: '2', slug: 'paula-choice-retinol-booster', name: 'Retinol Booster', brand: "Paula's Choice", category: 'Treatment', description: 'Stabilized retinol treatment for anti-aging and texture.', imageUrl: '', inciList: [] },
  { id: '3', barcode: '3', slug: 'drunken-elephant-c-firma', name: 'C-Firma Fresh Serum', brand: 'Drunk Elephant', category: 'Serum', description: 'Vitamin C serum with ferulic acid and vitamin E.', imageUrl: '', inciList: [] },
  { id: '4', barcode: '4', slug: 'kiehls-calendula-toner', name: 'Calendula Herbal Extract Alcohol-Free Toner', brand: "Kiehl's", category: 'Toner', description: 'Soothing toner with calendula and aloe. Alcohol-free formula.', imageUrl: '', inciList: [] },
  { id: '5', barcode: '5', slug: 'the-ordinary-niacinamide', name: 'Niacinamide 10% + Zinc 1%', brand: 'The Ordinary', category: 'Treatment', description: 'Lightweight niacinamide serum for pore refinement and sebum control.', imageUrl: '', inciList: [] },
];

export function filterStaticProducts(query: string): Array<(typeof STATIC_FALLBACK)[number]> {
  const q = query.trim().toLowerCase();
  if (!q) return STATIC_FALLBACK;
  return STATIC_FALLBACK.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}
