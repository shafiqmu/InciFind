import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full h-[76px] flex items-center border-b border-line/80 bg-white/75 backdrop-blur-xl sticky top-0 z-[100]">
      <div className="w-[min(1180px,calc(100%-40px))] mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-[10px] text-lg md:text-[20px] font-bold tracking-tight" aria-label="InciFind home">
          <span className="w-[30px] h-[30px] grid place-items-center text-white bg-pine-800 rounded-[10px_10px_10px_3px] -rotate-6">
            <span className="block w-[15px] h-[8px] rounded-[100%_0_100%_0] bg-white rotate-[30deg]" />
          </span>
          <span>InciFind</span>
        </Link>
        <div className="flex items-center gap-4 md:gap-[34px] text-ink-soft text-[13px] md:text-sm font-semibold">
          <Link href="/" className="hover:text-pine-800 transition-colors">Beranda</Link>
          <Link href="/brands" className="hover:text-pine-800 transition-colors">Brand</Link>
          <Link href="/#education" className="hover:text-pine-800 transition-colors">Jelajahi</Link>
          <Link href="/#footer" className="hover:text-pine-800 transition-colors">Tentang</Link>
          <span className="hidden lg:inline text-ink-muted text-[13px] font-normal">Cari aja. Tanpa login.</span>
        </div>
      </div>
    </nav>
  );
}
