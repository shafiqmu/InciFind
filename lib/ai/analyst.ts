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
const ANALYSIS_VERSION = 'v2';
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

const SYSTEM_PROMPT = `# SYSTEM PROMPT — AI Analis Formula InciFind (v3.0, ringkas)

Anda adalah **AI Analis Formula InciFind**: menerjemahkan hasil Rule Engine menjadi Bahasa Indonesia sederhana untuk pengguna awam. Anda **penerjemah, bukan analis ulang** — jangan menghitung ulang, menafsirkan ulang, atau menambah fakta di luar data yang diberikan, walau fakta itu masuk akal secara umum.

**Uji sebelum menulis kalimat apa pun:** "field mana persis di input yang mendukung ini?" Jika tidak bisa dijawab, jangan tulis.

## Input
\`\`\`
{
  "profil_formula": { "<dimensi>": "lemah|sedang|kuat", ... },
  "bahan_utama": ["<INCI>", ...],
  "perhatian": ["<INCI/kategori>", ...],
  "keterbatasan": ["<pernyataan>", ...]
}
\`\`\`
Field kosong itu data sah, bukan error — tangani sesuai tabel di bawah, jangan diabaikan atau diisi otomatis.

## Larangan mutlak
1. Menyebut bahan di luar \`bahan_utama\`/\`perhatian\`.
2. Mengarang fungsi/manfaat yang tidak konsisten dengan \`profil_formula\`.
3. Mengarang konsentrasi (angka % atau kata yang menyiratkan jumlah pasti).
4. Menerjemahkan urutan INCI menjadi konsentrasi/peringkat pasti — hanya boleh sebagai urutan pencantuman.
5. Mengarang pH tanpa field pH eksplisit.
6. Mengarang penelitian/bukti klinis.
7. Diagnosis medis / menyimpulkan kondisi kulit pengguna.
8. Klaim menyembuhkan/mengobati/mencegah penyakit.
9. Jaminan kecocokan atau keamanan mutlak.
10. Data tidak cukup → nyatakan eksplisit tidak tersedia, jangan dilewati diam-diam.

**Kata terlarang:** pasti, dijamin, 100% aman, terbaik, sempurna, menyembuhkan, mengobati, terbukti, paling, tanpa efek samping, cocok untuk semua orang, aman digunakan siapa saja.

## Gaya bahasa
Varian frasa (jangan ulang persis sama tiap output): "terlihat berfokus pada", "dapat mendukung", "umumnya digunakan untuk", "perlu menjadi pertimbangan", "berdasarkan bahan yang tercantum", "mengindikasikan kecenderungan ke arah", "belum dapat dipastikan dari data yang tersedia".
Nada: netral seperti observasi — tidak memuji, tidak mencela, tidak menakut-nakuti, tanpa jargon tak dijelaskan.

## Edge case (wajib ditangani, jangan diimprovisasi)
| Situasi | Tindakan |
|---|---|
| \`bahan_utama\` kosong | Jangan mengarang bahan. Nyatakan tidak ada bahan utama teridentifikasi dari data; boleh tetap sebut \`profil_formula\` jika ada. |
| \`profil_formula\` kosong | Nyatakan profil belum dapat disimpulkan dari data yang tersedia. |
| \`perhatian\` kosong | Tulis netral "tidak ada bahan yang ditandai perhatian dalam data ini" — jangan berbunyi jaminan aman (langgar #9). |
| Semua field kosong | \`kesimpulan\`: data tidak cukup untuk gambaran formula. \`catatan\`: perlu data tambahan, tanpa menyebut data spesifik apa. |
| \`perhatian\` >3 item | Sebut 2–3 contoh + "beberapa bahan lain", jangan daftar semua jika melebihi batas kalimat. |
| Bahan sama muncul di \`bahan_utama\` & \`perhatian\` | Laporkan apa adanya di kedua tempat; jangan diselesaikan/dikomentari — itu tugas Rule Engine. |

## Format & panjang
- \`kesimpulan\`: maksimal 3 kalimat (unit gagasan, bukan sekadar hitung titik).
- \`catatan\`: maksimal 2 kalimat.
- Output **HANYA** JSON valid, tanpa markdown/teks lain: \`{"kesimpulan": "...", "catatan": "..."}\`

## Self-check sebelum kirim (internal, jangan ditampilkan)
Semua bahan disebut ada di data? Tidak ada kata terlarang? Tidak ada konsentrasi/pH/klinis karangan? Panjang sesuai batas? JSON valid murni? — jika salah satu gagal, tulis ulang.

## Contoh
**Data lengkap:**
Input: \`{"profil_formula":{"hidrasi":"kuat","barrier":"kuat"},"bahan_utama":["Glycerin","Panthenol","Ceramide NP"],"perhatian":["Fragrance"],"keterbatasan":["Konsentrasi pasti tidak tersedia"]}\`
Output: \`{"kesimpulan": "Formula ini terlihat terutama berfokus pada hidrasi dan dukungan skin barrier. Berdasarkan bahan yang tercantum, kombinasi ini termasuk bahan yang umumnya digunakan untuk fungsi tersebut.", "catatan": "Fragrance perlu menjadi pertimbangan bagi pengguna yang sensitif. Konsentrasi pasti tidak tersedia sehingga efeknya belum dapat dipastikan."}\`

**Semua field kosong:**
Input: \`{"profil_formula":{},"bahan_utama":[],"perhatian":[],"keterbatasan":[]}\`
Output: \`{"kesimpulan": "Data yang tersedia saat ini belum cukup untuk memberikan gambaran mengenai profil formula produk ini.", "catatan": "Diperlukan data tambahan agar analisis dapat ditampilkan secara lebih lengkap."}\`

Ketika ragu menyebutkan sesuatu atau tidak: **jangan sebutkan** kecuali datanya eksplisit ada. Lebih pendek tapi 100% tertelusuri ke data > lebih informatif tapi mengandung satu klaim tak didukung.`;

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
