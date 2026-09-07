/**
 * AI Analyst — 1x LLM call per formula (slug + inciHash + version).
 *
 * Input: output Rule Engine (profil, bahan utama, perhatian, keterbatasan).
 * Prompt ringan versi §14 (ringkas agar muat di model lite).
 * Output divalidasi validator deterministik; gagal → null (fallback UI).
 * Cache permanen: `${slug}:${inciHash}:v1`.
 * SERVER ONLY.
 */
import fs from 'fs';
import path from 'path';
import { validateAiAnalysis, type AiAnalysis } from '../formula/validator';

const CACHE_FILE = path.join(process.cwd(), 'data', 'analysis-cache.json');
const ANALYSIS_VERSION = 'v1';
const MODELS = ['gemini-flash-latest', 'gemini-3.1-flash-lite-preview'];

let cache: Record<string, AiAnalysis> | null = null;

function loadCache(): Record<string, AiAnalysis> {
  if (cache) return cache;
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')) as Record<string, AiAnalysis>;
  } catch {
    cache = {};
  }
  return cache;
}

function saveCache() {
  try {
    let onDisk: Record<string, AiAnalysis> = {};
    try {
      onDisk = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')) as Record<string, AiAnalysis>;
    } catch {
      /* file belum ada */
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ ...onDisk, ...cache }, null, 1));
  } catch {
    /* best effort */
  }
}

const SYSTEM_PROMPT = `Anda adalah AI Analis Formula InciFind: menerjemahkan hasil Rule Engine menjadi Bahasa Indonesia sederhana. Anda penerjemah, bukan analis ulang — jangan menambah fakta di luar data yang diberikan.

LARANGAN: jangan menyebut bahan di luar bahan_utama/perhatian; jangan mengarang konsentrasi/pH/penelitian; jangan diagnosis; jangan klaim menyembuhkan/mencegah penyakit; jangan jaminan kecocokan/keamanan. Kata terlarang: pasti, dijamin, 100% aman, terbaik, sempurna, menyembuhkan, mengobati, terbukti, paling.

ATURAN: kesimpulan maksimal 3 kalimat, catatan maksimal 2 kalimat. Output HANYA JSON valid: {"kesimpulan": "...", "catatan": "..."} tanpa markdown.

Contoh output: {"kesimpulan": "Formula ini terlihat terutama berfokus pada hidrasi dan dukungan skin barrier. Berdasarkan bahan yang tercantum, kombinasi ini termasuk bahan yang umumnya digunakan untuk fungsi tersebut.", "catatan": "Fragrance perlu menjadi pertimbangan bagi pengguna yang sensitif. Konsentrasi pasti tidak tersedia sehingga efeknya belum dapat dipastikan."}`;

export interface AnalystInput {
  slug: string;
  inciHash: string;
  profil: Record<string, string>;
  bahanUtama: string[];
  perhatian: string[];
  keterbatasan: string[];
}

export async function getFormulaAnalysis(input: AnalystInput): Promise<AiAnalysis | null> {
  const key = `${input.slug}:${input.inciHash}:${ANALYSIS_VERSION}`;
  const store = loadCache();
  if (store[key]) return store[key];

  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) return null;

  const userPrompt = JSON.stringify({
    profil_formula: input.profil,
    bahan_utama: input.bahanUtama,
    perhatian: input.perhatian,
    keterbatasan: input.keterbatasan,
  });

  const knownIngredients = [...input.bahanUtama, ...input.perhatian];

  for (const model of MODELS) {
    const mctrl = new AbortController();
    const mtimer = setTimeout(() => mctrl.abort(), 20000);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          signal: mctrl.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ parts: [{ text: userPrompt }] }],
            generationConfig: { maxOutputTokens: 600, temperature: 0.5, responseMimeType: 'application/json' },
          }),
        }
      );
      if (!res.ok) {
        console.error(`[analyst:${input.slug}] ${model} HTTP ${res.status}`);
        continue;
      }
      const data = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const text =
        data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('').trim() || '';
      if (!text) continue;
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        console.error(`[analyst:${input.slug}] JSON parse gagal`);
        continue;
      }
      const checked = validateAiAnalysis(parsed, knownIngredients);
      if (!checked.ok) {
        console.error(`[analyst:${input.slug}] validator: ${checked.errors.join('; ')}`);
        continue;
      }
      store[key] = checked.value;
      saveCache();
      return checked.value;
    } catch (e) {
      console.error(
        `[analyst:${input.slug}] ${model} threw: ${e instanceof Error ? e.message : String(e)}`
      );
    } finally {
      clearTimeout(mtimer);
    }
  }
  return null;
}
