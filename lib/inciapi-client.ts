/**
 * INCI API Client
 * 
 * Base URL: https://inciapi.com
 * Key: X-API-Key header (dari INCIAPI_KEY env var)
 * Docs: https://inciapi.com/docs
 * 
 * Response structure (dari testing):
 * GET /v1/products/{BARCODE} → { product: { barcode, name, brand, category[], country, qualityScore, vertical, ingredients (comma-str), details { inci[], analysis { parsedIngredients[] } } } }
 * GET /v1/ingredients/{NAME} → { ingredient: { inciName, aliases[], ... } }
 * GET /v1/ingredients/search?q=&limit= → { results[], total }
 * POST /v1/analyze → analyze produk/INCI list
 */

const BASE_URL = 'https://inciapi.com';


// ---- Tipe data ----

export interface RawProduct {
  barcode: string;
  name: string;
  brand: string;
  category: string[];
  country: string;
  qualityScore: number;
  vertical: string;
  ingredients: string; // comma-separated
  details: {
    inci: string[];
    skinType: string[];
    spf: number | null;
    certifications: string[];
    usage: string | null;
    warnings: string | null;
    periodAfterOpening: string | null;
    analysis: {
      rawInci: string[];
      parsedIngredients: ParsedIngredient[];
    };
  };
}

export interface ParsedIngredient {
  inciName: string;
  safetyScore: number;
  safetyLevel: 'safe' | 'low_risk' | 'moderate_risk' | 'high_risk' | string;
  isAllergen: boolean;
  allergenTypes: string[];
  comedogenicityRating: number;
  irritancyPotential: 'none' | 'low' | 'moderate' | 'high' | string;
  pregnancySafe: boolean;
  found: boolean;
  hasData: boolean;
}

export interface IngredientInfo {
  inciName: string;
  aliases: string[];
  casNumber?: string;
  ecNumber?: string | null;
  description?: string;
  // ... bisa ditambah nanti sesuai kebutuhan
  [key: string]: unknown;
}

export interface IngredientSearchResult {
  inciName: string;
  aliases: string[];
  casNumber?: string;
  // ... fields lain
  [key: string]: unknown;
}

// ---- Error class ----

export class InCIApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public barcode?: string
  ) {
    super(message);
    this.name = 'InCIApiError';
  }
}

// ---- Helper functions ----

function getApiKey(): string {
  const key = process.env.INCIAPI_KEY;
  if (!key) {
    throw new InCIApiError(
      'INCIAPI_KEY not found in environment variables.',
      500,
      'missing_api_key'
    );
  }
  return key;
}

async function fetchIncIAPI(
  endpoint: string,
  options: RequestInit = {}
): Promise<unknown> {
  const apiKey = getApiKey();
  const url = `${BASE_URL}${endpoint}`;

  const headers = {
    'Accept': 'application/json',
    'X-API-Key': apiKey,
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (
    options.body &&
    typeof options.body === 'object' &&
    !(options.body instanceof FormData)
  ) {
    config.body = JSON.stringify(options.body);
    (config.headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, config);

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    data = await res.text();
  }

  if (!res.ok) {
    if (
      typeof data === 'object' &&
      data !== null &&
      'statusCode' in data
    ) {
      const d = data as {
        statusCode: number;
        error: string;
        message: string;
        code?: string;
        barcode?: string;
      };
      throw new InCIApiError(d.message, d.statusCode, d.code, d.barcode);
    }
    throw new InCIApiError(
      `HTTP ${res.status}: ${res.statusText}`,
      res.status
    );
  }

  return data;
}

// ---- Product endpoints ----

export async function getProductByBarcode(barcode: string): Promise<RawProduct | null> {
  const data = await fetchIncIAPI(`/v1/products/${barcode}`);

  if (typeof data === 'object' && data !== null && 'product' in data) {
    return (data as { product: RawProduct }).product as RawProduct;
  }

  return null;
}

export async function getProductSafety(barcode: string): Promise<{ barcode: string; safety: unknown } | null> {
  const data = await fetchIncIAPI(`/v1/products/${barcode}/safety`);
  if (typeof data === 'object' && data !== null && 'safety' in data) {
    return data as { barcode: string; safety: unknown };
  }
  return null;
}

export async function getProductAllergens(barcode: string): Promise<{ barcode: string; allergens: { detectedAllergens: string[]; totalAllergens: number; hasFragranceAllergens: boolean; hasContactAllergens: boolean; hasPreservativeAllergens: boolean } } | null> {
  const data = await fetchIncIAPI(`/v1/products/${barcode}/allergens`);
  if (typeof data === 'object' && data !== null && 'allergens' in data) {
    return data as { barcode: string; allergens: { detectedAllergens: string[]; totalAllergens: number; hasFragranceAllergens: boolean; hasContactAllergens: boolean; hasPreservativeAllergens: boolean } };
  }
  return null;
}

export async function getProductCompatibility(
  barcode: string,
  skinType: string = 'sensitive'
): Promise<{ barcode: string; skinType: string; compatibility: Record<string, string> } | null> {
  const data = await fetchIncIAPI(`/v1/products/${barcode}/compatibility?skinType=${skinType}`);
  if (typeof data === 'object' && data !== null && 'compatibility' in data) {
    return data as { barcode: string; skinType: string; compatibility: Record<string, string> };
  }
  return null;
}

export async function getProductPregnancy(barcode: string): Promise<{ barcode: string; pregnancySafety: { safe: boolean; unsafeIngredients: string[]; cautionIngredients: string[]; coverage: number; lowConfidence: boolean } } | null> {
  const data = await fetchIncIAPI(`/v1/products/${barcode}/pregnancy`);
  if (typeof data === 'object' && data !== null && 'pregnancySafety' in data) {
    return data as { barcode: string; pregnancySafety: { safe: boolean; unsafeIngredients: string[]; cautionIngredients: string[]; coverage: number; lowConfidence: boolean } };
  }
  return null;
}

// ---- Ingredient endpoints ----

export async function getIngredient(name: string): Promise<IngredientInfo | null> {
  const data = await fetchIncIAPI(`/v1/ingredients/${encodeURIComponent(name)}`);
  if (typeof data === 'object' && data !== null && 'ingredient' in data) {
    return (data as { ingredient: IngredientInfo }).ingredient as IngredientInfo;
  }
  return null;
}

export async function getIngredientEfficacy(name: string): Promise<Array<{ target: string; mechanism: string }>> {
  const data = await fetchIncIAPI(`/v1/ingredients/${encodeURIComponent(name)}/efficacy`);
  if (Array.isArray(data)) {
    return data as Array<{ target: string; mechanism: string }>;
  }
  if (typeof data === 'object' && data !== null && 'efficacy' in data) {
    return (data as { efficacy: Array<{ target: string; mechanism: string }> }).efficacy;
  }
  return [];
}

export async function getIngredientSkinTypeProfiles(
  name: string
): Promise<Array<{ skinType: string; fit: string; reason: string }>> {
  const data = await fetchIncIAPI(`/v1/ingredients/${encodeURIComponent(name)}/skin-type-profiles`);
  if (Array.isArray(data)) {
    return data as Array<{ skinType: string; fit: string; reason: string }>;
  }
  if (typeof data === 'object' && data !== null && 'skinTypeProfiles' in data) {
    return (data as { skinTypeProfiles: Array<{ skinType: string; fit: string; reason: string }> }).skinTypeProfiles;
  }
  return [];
}

export async function getIngredientIncompatibilities(
  name: string
): Promise<Array<{ withInci: string; severity: string; reason: string }>> {
  const data = await fetchIncIAPI(`/v1/ingredients/${encodeURIComponent(name)}/incompatibilities`);
  if (Array.isArray(data)) {
    return data as Array<{ withInci: string; severity: string; reason: string }>;
  }
  if (typeof data === 'object' && data !== null && 'incompatibilities' in data) {
    return (data as { incompatibilities: Array<{ withInci: string; severity: string; reason: string }> }).incompatibilities;
  }
  return [];
}

export async function searchIngredients(
  query: string,
  limit: number = 10
): Promise<IngredientSearchResult[]> {
  const data = await fetchIncIAPI(`/v1/ingredients/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  if (Array.isArray(data)) {
    return data as IngredientSearchResult[];
  }
  if (typeof data === 'object' && data !== null && 'results' in data) {
    return (data as { results: IngredientSearchResult[] }).results;
  }
  return [];
}

// ---- Analyze endpoint ----

export async function analyze(body: Record<string, unknown>): Promise<unknown> {
  return fetchIncIAPI('/v1/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// ---- Helpers ----

export function parseIngredientsFromProduct(product: RawProduct): string[] {
  // Gunakan details.inci kalau ada (lebih rapi)
  if (Array.isArray(product.details?.inci) && product.details.inci.length > 0) {
    return product.details.inci.map((i) => i.trim()).filter(Boolean);
  }
  // Fallback ke string ingredients (comma-separated)
  if (typeof product.ingredients === 'string' && product.ingredients.length > 0) {
    return product.ingredients
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function getParsedAnalysis(product: RawProduct): ParsedIngredient[] {
  if (
    Array.isArray(product.details?.analysis?.parsedIngredients) &&
    product.details.analysis.parsedIngredients.length > 0
  ) {
    return product.details.analysis.parsedIngredients;
  }
  return [];
}

export function normalizeInciName(name: string): string {
  return name.trim().replace(/\s+/g, '_').toUpperCase();
}

export async function findIngredient(name: string): Promise<IngredientInfo | null> {
  const variations = [
    name,
    name.toUpperCase(),
    name.toLowerCase(),
    normalizeInciName(name),
    name.replace(/\s+/g, '_'),
  ];

  for (const variation of variations) {
    try {
      const ingredient = await getIngredient(variation);
      if (ingredient) {
        return ingredient;
      }
    } catch {
      continue;
    }
  }

  return null;
}
