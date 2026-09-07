/**
 * Function Mapping — Level-1 (generik per fungsi INKEE, bahasa Inggris).
 * Dipakai hanya untuk bahan yang TIDAK ada di dictionary (Level-2).
 *
 * Prinsip: fungsi umum seperti "Skin conditioning"/"Solvent" TIDAK dimapping
 * (terlalu vague) — bahan semacam itu dianggap tidak berkontribusi kecuali
 * ada di kamus Level-2.
 */
import type { AspectKey } from './dictionary';

type Weight = 1 | 2;

const MAPPING: Record<string, Partial<Record<AspectKey, Weight>>> = {
  // Hidrasi
  humectant: { hydration: 2 },
  moisturising: { hydration: 2 },
  moisturizing: { hydration: 2 },
  moisturizer: { hydration: 2 },
  hydrating: { hydration: 2 },
  hydration: { hydration: 2 },

  // Barrier
  emollient: { barrier: 2 },
  occlusive: { barrier: 2 },
  'barrier support': { barrier: 2 },
  'barrier repair': { barrier: 2 },
  'skin barrier': { barrier: 2 },

  // Menenangkan
  soothing: { soothing: 2 },
  calming: { soothing: 2 },
  'anti-inflammatory': { soothing: 2 },
  antiinflammatory: { soothing: 2 },

  // Mencerahkan
  brightening: { brightening: 2 },
  'skin brightening': { brightening: 2 },
  whitening: { brightening: 2 },
  'tyrosinase inhibitor': { brightening: 2 },
  antioxidant: { brightening: 1 },

  // Eksfoliasi
  exfoliant: { exfoliation: 2 },
  exfoliating: { exfoliation: 2 },
  exfoliation: { exfoliation: 2 },
  keratolytic: { exfoliation: 2 },
  'chemical exfoliant': { exfoliation: 2 },
  'aha': { exfoliation: 2 },
  'bha': { exfoliation: 2 },
  'pha': { exfoliation: 2 },
};

/** Mapping fungsi EN → aspek. Return null kalau fungsi terlalu umum/diabaikan. */
export function mapFunction(fn: string): Partial<Record<AspectKey, Weight>> | null {
  const key = fn.toLowerCase().trim();
  return MAPPING[key] || null;
}
