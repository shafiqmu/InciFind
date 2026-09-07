import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About · Data · Disclaimer — InciFind',
  description: 'Tentang InciFind, sumber data, dan disclaimer.',
};

export default function AboutPage() {
  return (
    <main className="w-[min(1180px,calc(100%-40px))] mx-auto py-14 md:py-20">
      <p className="text-pine-700 text-xs font-extrabold uppercase tracking-[0.14em] mb-3">
        Tentang
      </p>
      <h1 className="font-serif text-pine-900 text-4xl md:text-5xl tracking-tight mb-5">
        About InciFind
      </h1>
      <p className="max-w-2xl text-ink-soft leading-[1.8] mb-12">
        InciFind membantu kamu memahami apa yang ada di dalam produk skincare:
        cari produk, baca daftar bahan (INCI), kenali fungsi tiap bahan, dan
        lihat ringkasan formula. Tanpa login, tanpa drama.
      </p>

      <section id="data" className="scroll-mt-24 mb-12">
        <h2 className="font-serif text-pine-900 text-2xl md:text-3xl tracking-tight mb-4">
          Data
        </h2>
        <div className="max-w-2xl text-ink-soft leading-[1.8] space-y-3 text-[15px]">
          <p>
            Data produk dan bahan berasal dari <strong className="text-ink">inkeedecoder.com</strong> melalui
            library open-source (bukan afiliasi). Daftar bahan diterjemahkan ke Bahasa Indonesia
            secara otomatis; nama bahan (INCI) tetap dalam bahasa aslinya karena itu standar internasional.
          </p>
          <p>
            Ringkasan formula dihitung oleh Rule Engine lokal (5 aspek: Hidrasi, Skin Barrier,
            Menenangkan, Mencerahkan, Eksfoliasi) dan dijelaskan oleh AI. Formula produk bisa
            berubah sewaktu-waktu — selalu cek kemasan terbaru.
          </p>
        </div>
      </section>

      <section id="disclaimer" className="scroll-mt-24 mb-12">
        <h2 className="font-serif text-pine-900 text-2xl md:text-3xl tracking-tight mb-4">
          Disclaimer
        </h2>
        <div className="max-w-2xl text-ink-soft leading-[1.8] space-y-3 text-[15px]">
          <p>
            Info di InciFind cuma buat edukasi, bukan pengganti saran dokter kulit,
            diagnosis, atau pengobatan. Reaksi kulit tiap orang bisa beda.
          </p>
          <p>
            InciFind tidak mendiagnosis kondisi kulit, tidak meresepkan pengobatan,
            dan tidak menjamin kecocokan atau keamanan produk apa pun.
          </p>
        </div>
      </section>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-3 bg-pine-800 text-white rounded-full text-sm font-bold hover:bg-pine-700 transition-colors"
      >
        ← Kembali cari produk
      </Link>
    </main>
  );
}
