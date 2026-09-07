/**
 * Ingredient Dictionary — Level-2 mapping (spesifik per bahan).
 * MVP ~40 bahan umum. Ekor panjang fallback ke function-mapping (Level-1).
 *
 * aspects: bobot kontribusi per aspek (3 = kuat, 2 = sedang, 1 = minor).
 * evidence: tinggi = umum & mapan, sedang = umum tapi konteks-tergantung.
 */
export type AspectKey =
  | 'hydration'
  | 'barrier'
  | 'soothing'
  | 'brightening'
  | 'exfoliation';

export const ASPECT_LABELS: Record<AspectKey, string> = {
  hydration: 'Hidrasi',
  barrier: 'Skin Barrier',
  soothing: 'Menenangkan',
  brightening: 'Mencerahkan',
  exfoliation: 'Eksfoliasi',
};

export const ASPECTS: AspectKey[] = [
  'hydration',
  'barrier',
  'soothing',
  'brightening',
  'exfoliation',
];

export interface DictEntry {
  name: string;
  aliases?: string[];
  aspects: Partial<Record<AspectKey, 1 | 2 | 3>>;
  evidence: 'high' | 'medium';
}

export const INGREDIENT_DICT: DictEntry[] = [
  // ---- Humektan / hidrasi ----
  { name: 'Glycerin', aspects: { hydration: 3 }, evidence: 'high' },
  { name: 'Hyaluronic Acid', aliases: ['Sodium Hyaluronate'], aspects: { hydration: 3 }, evidence: 'high' },
  { name: 'Betaine', aspects: { hydration: 2 }, evidence: 'medium' },
  { name: 'Butylene Glycol', aspects: { hydration: 1 }, evidence: 'medium' },
  { name: 'Propylene Glycol', aspects: { hydration: 1 }, evidence: 'medium' },
  { name: 'Urea', aspects: { hydration: 2, exfoliation: 1 }, evidence: 'high' },
  { name: 'Snail Secretion Filtrate', aspects: { hydration: 2, soothing: 1 }, evidence: 'medium' },

  // ---- Barrier ----
  { name: 'Ceramide NP', aspects: { barrier: 3 }, evidence: 'high' },
  { name: 'Ceramide AP', aspects: { barrier: 3 }, evidence: 'high' },
  { name: 'Ceramide EOP', aspects: { barrier: 3 }, evidence: 'high' },
  { name: 'Cholesterol', aspects: { barrier: 2 }, evidence: 'medium' },
  { name: 'Squalane', aspects: { barrier: 2, hydration: 1 }, evidence: 'high' },
  { name: 'Petrolatum', aspects: { barrier: 3 }, evidence: 'high' },
  { name: 'Dimethicone', aspects: { barrier: 2 }, evidence: 'medium' },
  { name: 'Butyrospermum Parkii Butter', aliases: ['Shea Butter'], aspects: { barrier: 2 }, evidence: 'high' },
  { name: 'Niacinamide', aliases: ['Nicotinamide'], aspects: { barrier: 2, brightening: 2 }, evidence: 'high' },
  { name: 'Panthenol', aspects: { hydration: 2, soothing: 2, barrier: 1 }, evidence: 'high' },
  { name: 'Cetearyl Alcohol', aliases: ['Cetyl Alcohol'], aspects: { barrier: 1 }, evidence: 'medium' },

  // ---- Menenangkan ----
  { name: 'Centella Asiatica Extract', aliases: ['Centella Asiatica', 'Cica'], aspects: { soothing: 3 }, evidence: 'high' },
  { name: 'Aloe Barbadensis Leaf Juice', aliases: ['Aloe Barbadensis', 'Aloe Vera'], aspects: { soothing: 2, hydration: 1 }, evidence: 'medium' },
  { name: 'Allantoin', aspects: { soothing: 2 }, evidence: 'medium' },
  { name: 'Bisabolol', aliases: ['Alpha-Bisabolol'], aspects: { soothing: 2 }, evidence: 'medium' },
  { name: 'Avena Sativa Kernel Extract', aliases: ['Oat Extract', 'Colloidal Oatmeal'], aspects: { soothing: 2 }, evidence: 'medium' },
  { name: 'Camellia Sinensis Leaf Extract', aliases: ['Green Tea Extract'], aspects: { soothing: 2 }, evidence: 'medium' },

  // ---- Mencerahkan ----
  { name: 'Ascorbic Acid', aliases: ['Vitamin C', 'L-Ascorbic Acid'], aspects: { brightening: 3 }, evidence: 'high' },
  { name: 'Sodium Ascorbyl Phosphate', aliases: ['Ethylated L-Ascorbic Acid', '3-O-Ethyl Ascorbic Acid'], aspects: { brightening: 2 }, evidence: 'high' },
  { name: 'Alpha Arbutin', aliases: ['Arbutin'], aspects: { brightening: 3 }, evidence: 'high' },
  { name: 'Kojic Acid', aspects: { brightening: 2 }, evidence: 'medium' },
  { name: 'Tranexamic Acid', aspects: { brightening: 2 }, evidence: 'medium' },
  { name: 'Azelaic Acid', aspects: { brightening: 2, soothing: 1 }, evidence: 'high' },
  { name: 'Glycyrrhiza Glabra Root Extract', aliases: ['Licorice Extract', 'Licorice Root Extract'], aspects: { brightening: 2, soothing: 1 }, evidence: 'medium' },
  { name: 'Tocopherol', aliases: ['Vitamin E', 'Tocopheryl Acetate'], aspects: { barrier: 1 }, evidence: 'medium' },

  // ---- Eksfoliasi / retinoid ----
  { name: 'Salicylic Acid', aspects: { exfoliation: 3 }, evidence: 'high' },
  { name: 'Glycolic Acid', aspects: { exfoliation: 3 }, evidence: 'high' },
  { name: 'Lactic Acid', aspects: { exfoliation: 2 }, evidence: 'high' },
  { name: 'Gluconolactone', aspects: { exfoliation: 2 }, evidence: 'medium' },
  { name: 'Retinol', aspects: { exfoliation: 2, brightening: 1 }, evidence: 'high' },
  { name: 'Retinal', aliases: ['Retinaldehyde'], aspects: { exfoliation: 2, brightening: 1 }, evidence: 'high' },
  { name: 'Adapalene', aspects: { exfoliation: 2 }, evidence: 'high' },
];

const byName = new Map<string, DictEntry>();
for (const e of INGREDIENT_DICT) {
  byName.set(e.name.toLowerCase(), e);
  for (const a of e.aliases || []) {
    if (!byName.has(a.toLowerCase())) byName.set(a.toLowerCase(), e);
  }
}

/** Normalisasi nama INCI untuk pencocokan ("Water (Aqua)" → "water"). */
export function normalizeInciName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .trim();
}

/** Cari entri kamus (nama + alias, case-insensitive). */
export function lookupDict(name: string): DictEntry | null {
  return byName.get(normalizeInciName(name)) || null;
}
