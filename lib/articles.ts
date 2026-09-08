/**
 * Artikel edukasi statis. Konten umum, bukan nasihat medis.
 * Aturan: tanpa klaim konsentrasi/pH, tanpa diagnosis, tanpa janji hasil.
 */
export interface Article {
  slug: string;
  category: string;
  title: string;
  desc: string;
  image: string;
  body: string[];
  points?: string[];
  closing?: string;
}

export const ARTICLES: Article[] = [
  {
    slug: 'apa-itu-inci',
    category: 'Panduan',
    title: 'Apa itu INCI?',
    desc: 'Kenali sistem penamaan bahan dalam produk skincare.',
    image: '/images/home/inci.jpg',
    body: [
      'INCI (International Nomenclature of Cosmetic Ingredients) adalah sistem penamaan standar untuk bahan kosmetik. Nama yang tercantum pada kemasan di Indonesia umumnya mengikuti daftar ini, sehingga produk dari brand berbeda bisa dibandingkan bahannya.',
      'Urutan pencantuman mengikuti kadar secara menurun: bahan dengan kadar di atas 1% wajib berurutan dari yang terbanyak. Bahan di bawah 1% boleh ditulis dalam urutan bebas. Karena itu posisi awal daftar memberi gambaran kasar tentang komposisi utama, tetapi bukan angka pasti.',
      'Nama INCI ditulis dalam bahasa Inggris atau Latin dan tidak diterjemahkan — misalnya Water tetap Water, bukan "air". InciFind mengikuti aturan yang sama: nama bahan tampil apa adanya, penjelasannya yang berbahasa Indonesia.',
    ],
    closing:
      'Membaca INCI tidak membuat seseorang bisa menilai keamanan mutlak sebuah produk, tetapi membantu memahami apa yang ada di dalamnya.',
  },
  {
    slug: 'niacinamide',
    category: 'Bahan aktif',
    title: 'Niacinamide',
    desc: 'Manfaat, cara kerja umum, dan hal yang perlu diperhatikan.',
    image: '/images/home/niacinamide.jpg',
    body: [
      'Niacinamide (nicotinamide) adalah bentuk vitamin B3 yang umum dipakai pada produk perawatan kulit seperti serum, pelembap, dan toner. Dalam formulasi, bahan ini umumnya digunakan untuk mendukung tampilan warna kulit yang lebih merata dan kondisi skin barrier.',
      'Bahan ini relatif mudah diformulasikan dan sering dipadukan dengan bahan pelembap seperti Glycerin atau bahan penenang seperti Panthenol. Kombinasi tersebut yang menentukan karakter akhir sebuah formula, bukan satu bahan saja.',
    ],
    points: [
      'Perhatikan posisi pada daftar INCI — semakin awal, semakin besar porsinya secara umum.',
      'Pemilik kulit sensitif dapat mencoba produk baru secara bertahap pada area kecil terlebih dahulu.',
      'Rasa hangat atau kemerahan ringan pada sebagian orang umumnya terkait formulasi keseluruhan, bukan satu bahan saja.',
    ],
    closing:
      'Efek yang dirasakan tiap orang dapat berbeda tergantung formula lengkap dan kondisi kulit masing-masing.',
  },
  {
    slug: 'ceramide',
    category: 'Bahan aktif',
    title: 'Ceramide',
    desc: 'Penting untuk membantu menjaga skin barrier.',
    image: '/images/home/ceramide.jpg',
    body: [
      'Ceramide adalah kelompok lipid yang secara alami menjadi bagian dari lapisan pelindung kulit (skin barrier). Pada produk, bahan seperti Ceramide NP, Ceramide AP, atau Ceramide EOP umumnya digunakan untuk mendukung fungsi pelembap dan kondisi barrier.',
      'Ceramide hampir selalu bekerja bersama bahan pendukung lain seperti Cholesterol dan asam lemak dalam formula pelembap. Karena itu, menilai produk cukup dari ada-tidaknya ceramide saja tidak memberi gambaran lengkap.',
    ],
    points: [
      'Produk berlabel ceramide tetap perlu dilihat formula lengkapnya di daftar INCI.',
      'Tekstur krim atau salep umumnya memberi kesan oklusif yang lebih kuat dibanding losion.',
    ],
    closing:
      'Kebutuhan tiap kulit berbeda; tidak ada satu bahan yang wajib untuk semua orang.',
  },
  {
    slug: 'memilih-sunscreen',
    category: 'Panduan',
    title: 'Memilih Sunscreen',
    desc: 'Hal yang perlu kamu ketahui sebelum memilih sunscreen.',
    image: '/images/home/sunscreen.jpg',
    body: [
      'Sunscreen bekerja dengan cara menyaring atau memantulkan radiasi UV. Label SPF memberi gambaran perlindungan terhadap UVB, sedangkan label PA (dengan tanda +) memberi gambaran perlindungan terhadap UVA. Keduanya perlu diperhatikan, bukan salah satu saja.',
      'Perlindungan pada kemasan diuji dengan jumlah pemakaian yang cukup banyak — panduan umum konsumen adalah sekitar dua ruas jari untuk wajah. Pemakaian yang terlalu sedikit membuat perlindungan nyata jauh di bawah angka label.',
    ],
    points: [
      'Pilih tekstur yang nyaman dipakai tiap hari — sunscreen terbaik adalah yang rutin dipakai.',
      'Pakai ulang setelah berkeringat berat, berenang, atau mengusap wajah.',
      'Perhatikan tanggal kedaluwarsa; tabir surya yang kedaluwarsa tidak dapat diandalkan perlindungannya.',
    ],
    closing:
      'Untuk kondisi kulit tertentu atau riwayat masalah kulit serius, pertimbangan tenaga kesehatan tetap yang utama.',
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
