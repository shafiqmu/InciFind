import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="footer" className="mt-20 border-t border-line">
      <div className="w-[min(1180px,calc(100%-40px))] mx-auto py-10 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-[10px] text-[20px] font-bold tracking-tight">
              <span className="w-[30px] h-[30px] grid place-items-center text-white bg-pine-800 rounded-[10px_10px_10px_3px] -rotate-6">
                <span className="block w-[15px] h-[8px] rounded-[100%_0_100%_0] bg-white rotate-[30deg]" />
              </span>
              <span>InciFind</span>
            </div>
            <p className="mt-[6px] text-ink-muted text-xs">Bahan skincare, dibuat simpel.</p>
          </div>
          <nav className="flex flex-wrap gap-x-[25px] gap-y-2 text-ink-soft text-[13px] font-semibold" aria-label="Footer">
            <Link href="/articles" className="hover:text-pine-800">Artikel</Link>
            <Link href="/about" className="hover:text-pine-800">About</Link>
            <Link href="/about#data" className="hover:text-pine-800">Data</Link>
            <Link href="/about#disclaimer" className="hover:text-pine-800">Disclaimer</Link>
          </nav>
        </div>
        <div className="pt-5 border-t border-line/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-ink-muted text-xs">© 2026 InciFind. Untuk edukasi, bukan nasihat medis.</p>
          <p className="text-ink-muted text-xs flex gap-4">
            <Link href="/privacy" className="hover:text-pine-800">Privasi</Link>
            <Link href="/terms" className="hover:text-pine-800">Ketentuan</Link>
            <span>
              Powered by <span className="font-bold text-pine-800">Shafiq</span>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
