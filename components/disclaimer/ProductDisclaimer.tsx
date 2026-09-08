import {
  LIMIT_KONSENTRASI,
  LIMIT_PH,
  LIMIT_INCI_BASIS,
  LIMIT_INDIVIDU,
  NOT_MEDICAL,
  EDUKASI,
  FORMULA_BERUBAH,
  POWERED_BY,
} from '@/lib/disclosure-text';

/**
 * Section final tiap halaman produk: pernyataan keterbatasan eksplisit.
 * Teks statis — bukan output AI. Sumber kalimat: lib/disclosure-text.ts.
 */
export default function ProductDisclaimer() {
  return (
    <section className="mt-[60px]">
      <div className="p-6 bg-white border border-line rounded-[20px]">
        <h3 className="mb-3 text-ink text-sm font-bold tracking-wide">
          Data &amp; Keterbatasan
        </h3>
        <ul className="list-disc pl-5 text-ink-soft text-[13px] leading-[1.7] space-y-1">
          <li>
            <strong className="text-ink">{LIMIT_KONSENTRASI}</strong>
          </li>
          <li>
            <strong className="text-ink">{LIMIT_PH}</strong>
          </li>
          <li>{LIMIT_INCI_BASIS}</li>
          <li>{LIMIT_INDIVIDU}</li>
        </ul>
      </div>

      <div className="mt-4 p-6 flex gap-[14px] bg-clay-bg border border-[#f3cfcb] rounded-[20px]">
        <div className="w-8 h-8 grid place-items-center shrink-0 bg-clay text-white rounded-full font-black">
          !
        </div>
        <div>
          <h3 className="mb-[5px] text-[#a13c36] text-sm font-bold">Disclaimer</h3>
          <p className="text-[#785d5a] text-[13px] leading-[1.65]">
            {EDUKASI} {FORMULA_BERUBAH}{' '}
            <strong>{NOT_MEDICAL}</strong>
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-ink-muted text-xs">{POWERED_BY}</p>
    </section>
  );
}
