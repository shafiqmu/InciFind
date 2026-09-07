/**
 * Rule Engine — deterministik, tanpa LLM.
 *
 * Input: daftar INCI + fungsi per bahan (dari normalizer INKEE).
 * Output: profil 5 aspek + bahan utama + inciHash.
 *
 * Level-2 (kamus spesifik bahan) menang atas Level-1 (fungsi generik).
 * Skor internal: 0-1 rendah, 2-4 sedang, 5+ kuat (tidak ditampilkan ke user).
 */
import crypto from 'node:crypto';
import {
  ASPECTS,
  lookupDict,
  normalizeInciName,
  type AspectKey,
} from '../ingredients/dictionary';
import { mapFunction } from '../ingredients/function-mapping';

export type AspectLevel = 'kuat' | 'sedang' | 'rendah';

export interface AspectResult {
  level: AspectLevel;
  score: number;
  evidence: string[];
}

export interface KeyIngredient {
  name: string;
  aspects: AspectKey[];
}

export interface FormulaAnalysis {
  profile: Record<AspectKey, AspectResult>;
  keyIngredients: KeyIngredient[];
  inciHash: string;
}

/** Filler yang tidak pernah jadi bahan utama. */
const DENYLIST = new Set(['water', 'aqua']);

function levelOf(score: number): AspectLevel {
  if (score >= 5) return 'kuat';
  if (score >= 2) return 'sedang';
  return 'rendah';
}

/** sha256 dari nama INCI ternormalisasi (untuk cache key analisis). */
export function createInciHash(inciList: string[]): string {
  const normalized = inciList
    .map((n) => n.trim().toLowerCase())
    .filter(Boolean)
    .join('|');
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

export function analyzeFormula(
  inciList: string[],
  functionsByIngredient: Record<string, string[]>
): FormulaAnalysis {
  const scores: Record<AspectKey, number> = {
    hydration: 0,
    barrier: 0,
    soothing: 0,
    brightening: 0,
    exfoliation: 0,
  };
  // evidence per aspek: nama bahan + bobot (untuk top-3)
  const contributors: Record<AspectKey, Array<{ name: string; w: number }>> = {
    hydration: [],
    barrier: [],
    soothing: [],
    brightening: [],
    exfoliation: [],
  };
  const keyScores: Array<{ name: string; total: number; aspects: AspectKey[] }> = [];

  for (const rawName of inciList) {
    const name = (rawName || '').trim();
    if (!name) continue;
    const dict = lookupDict(name);

    if (dict) {
      let total = 0;
      const aspects: AspectKey[] = [];
      for (const aspect of ASPECTS) {
        const w = dict.aspects[aspect] || 0;
        if (w > 0) {
          scores[aspect] += w;
          contributors[aspect].push({ name, w });
          total += w;
          aspects.push(aspect);
        }
      }
      if (dict.evidence === 'high' && !DENYLIST.has(normalizeInciName(name)) && total > 0) {
        keyScores.push({ name, total, aspects });
      }
    } else {
      // Level-1: dari fungsi INKEE
      const fns = functionsByIngredient[name] || functionsByIngredient[rawName] || [];
      const seen = new Set<AspectKey>();
      for (const fn of fns) {
        const mapped = mapFunction(fn);
        if (!mapped) continue;
        for (const aspect of ASPECTS) {
          const w = mapped[aspect] || 0;
          if (w > 0 && !seen.has(aspect)) {
            seen.add(aspect);
            scores[aspect] += w;
            contributors[aspect].push({ name, w });
          }
        }
      }
    }
  }

  const profile = {} as Record<AspectKey, AspectResult>;
  for (const aspect of ASPECTS) {
    const ev = contributors[aspect]
      .sort((a, b) => b.w - a.w)
      .slice(0, 3)
      .map((c) => c.name);
    profile[aspect] = { level: levelOf(scores[aspect]), score: scores[aspect], evidence: ev };
  }

  const keyIngredients: KeyIngredient[] = keyScores
    .sort((a, b) => b.total - a.total)
    .slice(0, 4)
    .map(({ name, aspects }) => ({ name, aspects }));

  return { profile, keyIngredients, inciHash: createInciHash(inciList) };
}
