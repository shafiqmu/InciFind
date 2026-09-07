/**
 * Deterministic Validator — validasi output JSON AI (kode biasa, tanpa LLM).
 *
 * Cek: struktur JSON, panjang, kata terlarang, pola konsentrasi, pola pH,
 * dan nama bahan yang disebut harus ada di daftar yang dikenal.
 * Gagal → { ok: false } → UI pakai fallback (bukan retry, hemat kuota).
 */

export interface AiAnalysis {
  kesimpulan: string;
  catatan: string;
}

const FORBIDDEN = [
  'menyembuhkan',
  'mengobati',
  'mencegah penyakit',
  '100% aman',
  '100% efektif',
  'pasti cocok',
  'dijamin',
  'tanpa risiko',
  'tanpa efek samping',
  'cocok untuk semua orang',
  'diagnosis',
  'dermatitis',
  'rosacea',
  'eczema',
  'terbaik',
  'sempurna',
  'revolusioner',
];

const CONC_PATTERN = /(\d+(?:[.,]\d+)?\s?%|\d+\s?persen|konsentrasi\s+\d|dosis\s+tinggi)/i;
const PH_PATTERN = /\bpH\s*\d|pH\s*rendah|pH\s*tinggi|pH\s*seimbang|bersifat\s+asam\b/i;

export function validateAiAnalysis(
  raw: unknown,
  knownIngredients: string[]
): { ok: true; value: AiAnalysis } | { ok: false; errors: string[] } {
  const errors: string[] = [];

  if (typeof raw !== 'object' || raw === null) {
    return { ok: false, errors: ['bukan object'] };
  }
  const o = raw as Record<string, unknown>;
  if (typeof o.kesimpulan !== 'string' || o.kesimpulan.trim().length === 0) {
    errors.push('kesimpulan hilang/kosong');
  }
  if (typeof o.catatan !== 'string' || o.catatan.trim().length === 0) {
    errors.push('catatan hilang/kosong');
  }
  if (errors.length > 0) return { ok: false, errors };

  const kesimpulan = (o.kesimpulan as string).trim();
  const catatan = (o.catatan as string).trim();
  const combined = `${kesimpulan} ${catatan}`;

  if (kesimpulan.length > 500) errors.push('kesimpulan terlalu panjang');
  if (catatan.length > 300) errors.push('catatan terlalu panjang');

  const lower = combined.toLowerCase();
  for (const term of FORBIDDEN) {
    if (lower.includes(term)) {
      errors.push(`kata terlarang: ${term}`);
      break;
    }
  }
  if (CONC_PATTERN.test(combined)) errors.push('klaim konsentrasi terdeteksi');
  if (PH_PATTERN.test(combined)) errors.push('klaim pH terdeteksi');

  // Nama bahan di luar daftar dikenal → tolak.
  // (Cek sederhana: kata kapitalisasi Title Case yang mirip nama INCI tapi tak dikenal.)
  const candidates = combined.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}\b/g) || [];
  const knownLower = new Set(knownIngredients.map((n) => n.toLowerCase()));
  const commonWords = new Set([
    'formula', 'produk', 'kulit', 'bahan', 'berdasarkan', 'namun', 'dengan', 'untuk', 'yang', 'dari', 'dan',
  ]);
  for (const c of candidates) {
    if (!knownLower.has(c.toLowerCase()) && !commonWords.has(c.toLowerCase())) {
      // Hanya flag kalau mirip INCI (2+ kata, mis. "Hyaluronic Acid")
      if (c.includes(' ')) {
        errors.push(`bahan tak dikenal disebut: ${c}`);
        break;
      }
    }
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value: { kesimpulan, catatan } };
}
