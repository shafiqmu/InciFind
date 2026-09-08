/**
 * Ringan khusus dropdown search: brand + gambar produk per slug.
 *
 * - TIDAK lewat detailFromInkee (itu berat: translate per bahan).
 * - getProduct default flags → cukup brand + images.original.
 * - Cache permanen data/product-meta-cache.json (slug → {imageUrl, brand}),
 *   makin lama makin instan karena cache ikut ke-commit.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createInkeedecoderClient } from '@knorby/inkeedecoder-client';
import { cacheKey, memoryCache } from '@/lib/cache';

export interface ProductMeta {
  imageUrl: string;
  brand: string;
}

const META_FILE = path.join(process.cwd(), 'data', 'product-meta-cache.json');

type Client = ReturnType<typeof createInkeedecoderClient>;
function getMetaClient(): Client {
  const g = globalThis as unknown as { __inkeeMetaClient?: Client };
  if (!g.__inkeeMetaClient) {
    g.__inkeeMetaClient = createInkeedecoderClient({
      requestIntervalMs: 800,
      maxPages: 1,
    });
  }
  return g.__inkeeMetaClient;
}

let fileStore: Record<string, ProductMeta> | null = null;
function readStore(): Record<string, ProductMeta> {
  if (fileStore) return fileStore;
  try {
    fileStore = JSON.parse(fs.readFileSync(META_FILE, 'utf8')) as Record<string, ProductMeta>;
  } catch {
    fileStore = {};
  }
  return fileStore;
}

function writeStore() {
  try {
    // Baca ulang dulu (multi-worker safety), merge, tulis sinkron.
    let disk: Record<string, ProductMeta> = {};
    try {
      disk = JSON.parse(fs.readFileSync(META_FILE, 'utf8')) as Record<string, ProductMeta>;
    } catch {
      disk = {};
    }
    const merged = { ...disk, ...(fileStore || {}) };
    fs.mkdirSync(path.dirname(META_FILE), { recursive: true });
    fs.writeFileSync(META_FILE, JSON.stringify(merged, null, 2));
    fileStore = merged;
  } catch {
    // Cache gagal ditulis → hasil tetap dipakai, cuma tidak persisten.
  }
}

export async function getProductMetaMap(slugs: string[]): Promise<Record<string, ProductMeta>> {
  const uniq = [...new Set(slugs.map((s) => (s || '').trim()).filter(Boolean))].slice(0, 8);
  if (uniq.length === 0) return {};

  const store = readStore();
  const out: Record<string, ProductMeta> = {};
  const missing = uniq.filter((s) => {
    if (store[s]?.imageUrl || store[s]?.brand) {
      out[s] = store[s];
      return false;
    }
    return true;
  });

  if (missing.length > 0) {
    const client = getMetaClient();
    // Batch 3 paralel (sopan ke INKEE, hindari rate-limit burst)
    for (let i = 0; i < missing.length; i += 3) {
      const batch = missing.slice(i, i + 3);
      const fetched = await Promise.all(
        batch.map(async (s): Promise<[string, ProductMeta]> => {
          const mkey = cacheKey(['inkee', 'meta', s]);
          const mc = memoryCache(mkey);
          const hit = mc.get() as ProductMeta | null;
          if (hit && (hit.imageUrl || hit.brand)) return [s, hit];
          try {
            const p = await client.getProduct(s);
            const meta: ProductMeta = {
              imageUrl: p?.images?.original || '',
              brand: (p?.brand as { name?: string } | undefined)?.name || '',
            };
            // Hasil kosong TIDAK di-cache permanen → dicoba lagi lain waktu.
            if (meta.imageUrl || meta.brand) {
              mc.set(meta);
              return [s, meta];
            }
            return [s, { imageUrl: '', brand: '' }];
          } catch {
            return [s, { imageUrl: '', brand: '' }];
          }
        })
      );
      for (const [s, m] of fetched) {
        out[s] = m;
        // vonis permanen hanya untuk hasil berisi; yang kosong tetap bisa dicoba lagi
        if (m.imageUrl || m.brand) store[s] = m;
      }
    }
    writeStore();
  }

  return out;
}
