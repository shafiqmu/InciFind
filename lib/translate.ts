/**
 * Translate EN → ID untuk deskripsi bahan (data inkee berbahasa Inggris).
 *
 * - Pakai endpoint gtx Google (tanpa key), chunk ≤1000 char, pool 4.
 * - Cache permanen di data/id-cache.json per nama bahan (hemat kuota,
 *   build/prerender tidak nerjemahin ulang).
 * - Gagal/limit → fallback teks asli Inggris (tidak pernah throw).
 * - SERVER ONLY (pakai fs). Jangan import dari client component.
 */
import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'data', 'id-cache.json');

let cache: Record<string, string> | null = null;

function loadCache(): Record<string, string> {
  if (cache) return cache;
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')) as Record<string, string>;
  } catch {
    cache = {};
  }
  return cache;
}

function scheduleSave() {
  // Tulis langsung + merge dgn isi file (prerender paralel = multi worker).
  try {
    let onDisk: Record<string, string> = {};
    try {
      onDisk = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')) as Record<string, string>;
    } catch {
      /* file belum ada */
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ ...onDisk, ...cache }, null, 1));
  } catch {
    /* best effort */
  }
}

function splitChunks(text: string, max = 1000): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+["']?/g) || [text];
  const chunks: string[] = [];
  let cur = '';
  for (const s of sentences) {
    if ((cur + s).length > max && cur.trim()) {
      chunks.push(cur.trim());
      cur = s;
    } else {
      cur += s;
    }
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks;
}

async function gtx(chunk: string): Promise<string | null> {
  const url =
    'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=id&dt=t&q=' +
    encodeURIComponent(chunk);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (InciFind/1.0)' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as unknown;
    if (!Array.isArray(data) || !Array.isArray(data[0])) return null;
    const out = (data[0] as Array<{ 0?: string }>)
      .map((s) => (Array.isArray(s) ? String(s[0] || '') : ''))
      .join('');
    return out.trim() || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Terjemahkan teks bebas EN→ID (tanpa cache). */
export async function translateToId(text: string): Promise<string> {
  const t = (text || '').trim();
  if (!t) return '';
  const chunks = splitChunks(t);
  const out: string[] = [];
  for (let i = 0; i < chunks.length; i += 4) {
    const batch = await Promise.all(chunks.slice(i, i + 4).map(gtx));
    // batch gagal sebagian → pakai asli untuk chunk itu
    batch.forEach((r, j) => out.push(r || chunks[i + j]));
  }
  return out.join(' ');
}

/** Terjemahkan deskripsi bahan dgn cache permanen per nama bahan.
 *  Nama-nama INCI di `protect` dipertahankan dalam bahasa Inggris:
 *  teks dibelah per nama bahan, yg diterjemahkan cuma kalimat di antaranya. */
export async function translateIngredient(
  name: string,
  text: string,
  protect: string[] = []
): Promise<string> {
  const t = (text || '').trim();
  if (!t) return '';
  const store = loadCache();
  const key = name.trim().toLowerCase();
  if (store[key]) return store[key];

  const terms = Array.from(
    new Set([name, ...protect].map((s) => (s || '').trim()).filter((s) => s.length > 1))
  ).sort((a, b) => b.length - a.length);

  let out: string;
  if (terms.length === 0) {
    out = await translateToId(t);
  } else {
    const pattern = new RegExp(
      '(?<![A-Za-z0-9])(' +
        terms.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') +
        ')(?![A-Za-z0-9])',
      'gi'
    );
    const parts = t.split(pattern);
    // parts ganjil = nama bahan yg diproteksi (biarkan apa adanya)
    const jobs: Array<{ i: number; text: string }> = [];
    parts.forEach((part, i) => {
      if (i % 2 === 0 && part.trim()) jobs.push({ i, text: part });
    });
    const translated = new Map<number, string>();
    for (let k = 0; k < jobs.length; k += 4) {
      const batch = await Promise.all(
        jobs.slice(k, k + 4).map(async (j) => ({
          i: j.i,
          text: await translateToId(j.text),
        }))
      );
      for (const b of batch) translated.set(b.i, b.text);
    }
    out = parts
      .map((part, i) => (i % 2 === 1 ? part : translated.get(i) ?? part))
      .join('');
  }

  // Jangan cache hasil yg identik dgn asli krn gagal (biar dicoba lagi lain waktu)
  if (out && out !== t) {
    store[key] = out;
    scheduleSave();
  }
  return out;
}
