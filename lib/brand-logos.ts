/**
 * Brand yang file logonya BENERAN ada di public/brands/ (tervalidasi visual).
 * Aturan: tidak ada file = tidak tampil di carousel. Jangan tambah tebakan.
 * Logo milik masing-masing pemilik merek; dipakai nominatif sebagai
 * pengenal link ke halaman brand di direktori InciFind.
 */
export interface BrandLogo {
  name: string;
  slug: string;
  logo: string;
}

export const BRAND_LOGOS: BrandLogo[] = [
  { name: 'Bioderma', slug: 'bioderma', logo: '/brands/bioderma.svg' },
  { name: 'CeraVe', slug: 'cerave', logo: '/brands/cerave.png' },
  { name: 'Cetaphil', slug: 'cetaphil', logo: '/brands/cetaphil.png' },
  { name: 'Eucerin', slug: 'eucerin', logo: '/brands/eucerin.svg' },
  { name: 'Garnier', slug: 'garnier', logo: '/brands/garnier.svg' },
  { name: 'Innisfree', slug: 'innisfree', logo: '/brands/innisfree.svg' },
  { name: 'La Roche-Posay', slug: 'la-roche-posay', logo: '/brands/la-roche-posay.svg' },
  { name: 'Laneige', slug: 'laneige', logo: '/brands/laneige.jpg' },
  { name: 'Neutrogena', slug: 'neutrogena', logo: '/brands/neutrogena.svg' },
  { name: 'NIVEA', slug: 'nivea', logo: '/brands/nivea.png' },
  { name: 'Vaseline', slug: 'vaseline', logo: '/brands/vaseline.svg' },
];
