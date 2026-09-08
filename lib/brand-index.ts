import fs from 'node:fs';
import path from 'node:path';
import { POPULAR_BRANDS, type PopularBrand } from './popular-brands';

export interface BrandEntry {
  name: string;
  slug: string;
}

export const BRANDS_PER_PAGE = 48;

const INDEX_FILE = path.join(process.cwd(), 'data', 'brands-index.json');

let cache: { at: string; brands: BrandEntry[] } | null = null;

/** Baca fotokopi index (sekali per instance). Belum ada → fallback kurasi. */
export function getBrandIndex(): { brands: BrandEntry[]; snapshot: string; full: boolean } {
  if (cache) return { brands: cache.brands, snapshot: cache.at, full: true };
  try {
    const raw = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8')) as {
      fetchedAt: string;
      brands: BrandEntry[];
    };
    if (Array.isArray(raw.brands) && raw.brands.length > 0) {
      cache = { at: raw.fetchedAt || '', brands: raw.brands };
      return { brands: cache.brands, snapshot: cache.at, full: true };
    }
  } catch {
    // file belum ada (crawl belum jalan) → fallback di bawah
  }
  const fallback: BrandEntry[] = (POPULAR_BRANDS as PopularBrand[]).map((b) => ({
    name: b.name,
    slug: b.slug,
  }));
  return { brands: fallback, snapshot: '', full: false };
}

export function searchBrands(q: string): BrandEntry[] {
  const query = q.trim().toLowerCase();
  const { brands } = getBrandIndex();
  if (!query) return brands;
  return brands.filter((b) => b.name.toLowerCase().includes(query));
}
