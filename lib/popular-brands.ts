/**
 * Brand populer kurasi manual — slug TERVERIFIKASI ke inkeedecoder.com.
 * Jangan tambah tebakan: cek `https://inkeedecoder.com/brands/<slug>` 200 dulu.
 * Dipakai: /brands, marquee homepage. Urutan A–Z.
 */
export interface PopularBrand {
  name: string;
  slug: string;
}

export const POPULAR_BRANDS: PopularBrand[] = [
  { name: 'Anua', slug: 'anua' },
  { name: 'Avoskin', slug: 'avoskin' },
  { name: 'Bioderma', slug: 'bioderma' },
  { name: 'CeraVe', slug: 'cerave' },
  { name: 'Cetaphil', slug: 'cetaphil' },
  { name: 'COSRX', slug: 'cosrx' },
  { name: 'Emina', slug: 'emina' },
  { name: 'Eucerin', slug: 'eucerin' },
  { name: 'Garnier', slug: 'garnier' },
  { name: 'Innisfree', slug: 'innisfree' },
  { name: 'La Roche-Posay', slug: 'la-roche-posay' },
  { name: 'Laneige', slug: 'laneige' },
  { name: 'Neutrogena', slug: 'neutrogena' },
  { name: 'NIVEA', slug: 'nivea' },
  { name: 'SKIN1004', slug: 'skin1004' },
  { name: 'Skintific', slug: 'skintific' },
  { name: 'Somethinc', slug: 'somethinc' },
  { name: 'The Ordinary', slug: 'the-ordinary' },
  { name: 'Vaseline', slug: 'vaseline' },
  { name: 'Wardah', slug: 'wardah' },
];

export function slugifyBrand(q: string): string {
  return q
    .toLowerCase()
    .trim()
    .replace(/[''ʼ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
