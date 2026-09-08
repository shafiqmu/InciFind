import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="w-[min(1180px,calc(100%-40px))] mx-auto pt-10 pb-[90px]">
      <nav className="flex items-center gap-2 mb-8 text-[13px] font-semibold">
        <Link href="/" className="text-ink-soft hover:text-pine-800">
          Beranda
        </Link>
        <span className="text-ink-muted">/</span>
        <span className="text-ink">Ketentuan</span>
      </nav>
      <h1 className="font-serif text-pine-900 text-[clamp(36px,5vw,54px)] tracking-[-0.04em] mb-6">
        Syarat &amp; Ketentuan
      </h1>
      <div className="max-w-[720px] text-ink text-[15px] leading-[1.8] space-y-4">
        <p>
          InciFind adalah alat edukasi untuk memahami bahan (INCI) produk skincare.
          Seluruh informasi bersifat umum dan <strong>bukan nasihat medis</strong>.
        </p>
        <p>
          Data produk berasal dari sumber publik dan dapat berubah mengikuti
          formulasi terbaru dari brand. Selalu periksa daftar bahan pada kemasan
          resmi sebelum memutuskan memakai sebuah produk.
        </p>
        <p>
          Konsentrasi bahan dan pH produk tidak tersedia dari data yang kami
          gunakan — InciFind tidak mengarang angka tersebut, dan analisis AI
          dilarang mengarangnya juga.
        </p>
      </div>
    </main>
  );
}
