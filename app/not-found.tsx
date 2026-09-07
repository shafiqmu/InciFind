import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="bg-mist min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h1 className="font-serif text-[48px] text-pine-900 mb-4">
          Produk Tidak Ditemukan
        </h1>
        <p className="text-base text-ink-soft mb-8">
          Maaf, produk yang kamu cari tidak ketemu.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-pine-800 text-white rounded-xl hover:bg-pine-700 transition-colors duration-300"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
