import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="footer" className="mt-20 border-t border-line">
      <div className="w-[min(1180px,calc(100%-40px))] mx-auto min-h-[130px] py-[30px] md:py-0 flex flex-col md:flex-row md:items-center justify-between gap-[30px]">
        <div>
          <div className="flex items-center gap-[10px] text-[20px] font-bold tracking-tight">
            <span className="w-[30px] h-[30px] grid place-items-center text-white bg-pine-800 rounded-[10px_10px_10px_3px] -rotate-6">
              <span className="block w-[15px] h-[8px] rounded-[100%_0_100%_0] bg-white rotate-[30deg]" />
            </span>
            <span>InciFind</span>
          </div>
          <p className="mt-[6px] text-ink-muted text-xs">Bahan skincare, dibuat simpel.</p>
        </div>
        <div className="flex gap-[25px] text-ink-soft text-xs">
          <Link href="/#education" className="hover:text-pine-800">Jelajahi</Link>
          <span>Disclaimer</span>
          <span>Privasi</span>
        </div>
      </div>
    </footer>
  );
}
