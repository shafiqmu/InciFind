/**
 * Single source of truth untuk teks keterbatasan & disclaimer.
 *
 * Dipakai di: halaman produk (section Data & Keterbatasan),
 * popup Analisis Formula (via props limitations), dan input AI analyst.
 * Jangan tulis ulang kalimat ini manual di komponen lain.
 */

export const LIMIT_KONSENTRASI =
  'Konsentrasi tidak tersedia dari data yang digunakan.';

export const LIMIT_PH =
  'pH produk tidak tersedia dari data yang digunakan.';

export const LIMIT_INCI_BASIS =
  'Analisis berdasarkan bahan yang tercantum pada daftar INCI.';

export const LIMIT_INDIVIDU =
  'Respons terhadap produk dapat berbeda pada setiap individu.';

export const NOT_MEDICAL = 'Bukan nasihat medis.';

export const EDUKASI =
  'Info di InciFind cuma buat edukasi, bukan pengganti saran dokter kulit.';

export const FORMULA_BERUBAH =
  'Formula produk bisa berubah, jadi selalu cek daftar bahan di kemasan terbaru.';

export const POWERED_BY = 'Powered by Shafiiq';

/** Input keterbatasan untuk AI analyst (statis, bukan output model). */
export const AI_LIMITATIONS: string[] = [LIMIT_KONSENTRASI, LIMIT_PH];
