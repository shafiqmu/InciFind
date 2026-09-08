import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="w-[min(1180px,calc(100%-40px))] mx-auto pt-10 pb-[90px]">
      <nav className="flex items-center gap-2 mb-8 text-[13px] font-semibold">
        <Link href="/" className="text-ink-soft hover:text-pine-800">
          Beranda
        </Link>
        <span className="text-ink-muted">/</span>
        <span className="text-ink">Privasi</span>
      </nav>
      <h1 className="font-serif text-pine-900 text-[clamp(36px,5vw,54px)] tracking-[-0.04em] mb-6">
        Kebijakan Privasi
      </h1>
      <div className="max-w-[720px] text-ink text-[15px] leading-[1.8] space-y-4">
        <p>
          InciFind tidak meminta akun, login, atau data pribadi apa pun. Kamu bisa
          memakai seluruh fitur tanpa mendaftar.
        </p>
        <p>
          Kata kunci pencarian dikirim ke server kami untuk mengambil data produk
          dari sumber publik (inkeedecoder.com). Kami tidak menyimpan riwayat
          pencarian yang terhubung dengan identitas siapa pun.
        </p>
        <p>
          Analisis formula dibantu layanan AI pihak ketiga; yang dikirim hanya
          daftar bahan produk, tanpa data pribadi — karena memang tidak ada data
          pribadi yang kami miliki.
        </p>
      </div>
    </main>
  );
}
