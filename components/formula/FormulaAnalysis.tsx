'use client';

import { useEffect, useState } from 'react';
import { ASPECT_LABELS, ASPECTS, type AspectKey } from '@/lib/ingredients/dictionary';
import type { AspectResult } from '@/lib/formula/rule-engine';

export interface PopupKeyIngredient {
  name: string;
  aspects: AspectKey[];
}

export interface PopupWarning {
  ingredient: string;
  label: string;
  context: string;
}

interface FormulaAnalysisProps {
  productName: string;
  productBrand: string;
  profile: Record<AspectKey, AspectResult>;
  keyIngredients: PopupKeyIngredient[];
  warnings: PopupWarning[];
  aiKesimpulan: string | null;
  aiCatatan: string | null;
  limitations: string[];
}

export default function FormulaAnalysis({
  productName,
  productBrand,
  profile,
  keyIngredients,
  warnings,
  aiKesimpulan,
  aiCatatan,
  limitations,
}: FormulaAnalysisProps) {
  const [open, setOpen] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open ]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-3 bg-pine-800 text-white rounded-full text-sm font-bold shadow-[0_18px_50px_rgba(23,60,42,0.15)] transition-all hover:bg-pine-700 hover:scale-[1.02]"
      >
        <span aria-hidden="true">✦</span> Analisis Formula
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6 bg-black/45"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Analisis Formula"
        >
          <div
            className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-t-[28px] md:rounded-[28px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur px-6 pt-5 pb-4 border-b border-line flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-extrabold tracking-[0.12em] text-pine-700">
                  ✦ ANALISIS FORMULA
                </div>
                <div className="mt-1 font-serif text-xl text-pine-900 leading-tight">
                  {productName}
                </div>
                {productBrand && (
                  <div className="text-xs text-ink-muted mt-0.5">{productBrand}</div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup"
                className="w-9 h-9 grid place-items-center rounded-full bg-mist text-ink-soft hover:bg-pine-100 shrink-0 text-lg"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-5 space-y-7">
              {/* RINGKASAN FORMULA */}
              <section>
                <h3 className="text-xs font-extrabold tracking-[0.1em] text-ink-muted mb-3">
                  RINGKASAN FORMULA
                </h3>
                <div className="divide-y divide-line border border-line rounded-2xl overflow-hidden">
                  {ASPECTS.map((a) => (
                    <div key={a} className="flex items-center justify-between px-4 py-2.5 bg-white">
                      <span className="text-sm">{ASPECT_LABELS[a]}</span>
                      <span
                        className={`text-sm font-bold ${
                          profile[a].level === 'kuat'
                            ? 'text-pine-700'
                            : profile[a].level === 'sedang'
                              ? 'text-[#8a6d1a]'
                              : 'text-ink-muted'
                        }`}
                      >
                        {profile[a].level === 'kuat'
                          ? 'Kuat'
                          : profile[a].level === 'sedang'
                            ? 'Sedang'
                            : 'Rendah'}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* BAHAN UTAMA */}
              {keyIngredients.length > 0 && (
                <section>
                  <h3 className="text-xs font-extrabold tracking-[0.1em] text-ink-muted mb-3">
                    BAHAN UTAMA
                  </h3>
                  <div className="space-y-3">
                    {keyIngredients.map((k) => (
                      <div key={k.name}>
                        <div className="text-[15px] font-bold">{k.name}</div>
                        {k.aspects.length > 0 && (
                          <div className="text-[13px] text-ink-soft mt-0.5">
                            {k.aspects.map((a) => ASPECT_LABELS[a]).join(' · ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* PERHATIAN */}
              {warnings.length > 0 && (
                <section>
                  <h3 className="text-xs font-extrabold tracking-[0.1em] text-ink-muted mb-3">
                    HAL YANG PERLU DIPERHATIKAN
                  </h3>
                  <div className="space-y-3">
                    {warnings.map((w, i) => (
                      <div key={i}>
                        <div className="text-[15px] font-bold">• {w.ingredient}</div>
                        {w.context && (
                          <div className="text-[13px] text-ink-soft mt-0.5 leading-relaxed">
                            {w.context}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* KESIMPULAN AI */}
              {aiKesimpulan ? (
                <section className="p-[18px] bg-pine-100 border border-pine-200 rounded-2xl">
                  <h3 className="text-xs font-extrabold tracking-[0.1em] text-pine-800 mb-2">
                    ✦ KESIMPULAN AI
                  </h3>
                  <p className="text-sm text-ink leading-[1.7]">{aiKesimpulan}</p>
                  {aiCatatan && (
                    <p className="text-[13px] text-ink-soft leading-[1.7] mt-2">{aiCatatan}</p>
                  )}
                </section>
              ) : (
                <section className="p-[18px] bg-sun-bg border border-[#f0df9c] rounded-2xl">
                  <h3 className="text-xs font-extrabold tracking-[0.1em] text-[#765d12] mb-2">
                    ✦ KESIMPULAN AI
                  </h3>
                  <p className="text-sm text-ink-soft leading-[1.7]">
                    Ringkasan AI sementara tidak tersedia. Namun, ringkasan formula dan
                    bahan utama di atas tetap berdasarkan analisis bahan.
                  </p>
                </section>
              )}

              {/* MENGAPA */}
              <section>
                <button
                  type="button"
                  onClick={() => setShowWhy(!showWhy)}
                  className="flex items-center gap-2 text-sm font-bold text-pine-800"
                  aria-expanded={showWhy}
                >
                  <span className={`transition-transform ${showWhy ? 'rotate-180' : ''}`}>⌄</span>
                  Mengapa saya mendapatkan hasil ini?
                </button>
                {showWhy && (
                  <div className="mt-3 space-y-3">
                    {ASPECTS.filter((a) => profile[a].evidence.length > 0).map((a) => (
                      <div key={a} className="text-[13px]">
                        <span className="font-bold">
                          {ASPECT_LABELS[a]} —{' '}
                          {profile[a].level === 'kuat'
                            ? 'Kuat'
                            : profile[a].level === 'sedang'
                              ? 'Sedang'
                              : 'Rendah'}
                        </span>
                        <div className="text-ink-soft mt-0.5">
                          Berdasarkan: {profile[a].evidence.join(', ')}
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-ink-muted leading-relaxed">
                      Catatan: kesimpulan dibuat berdasarkan bahan yang tercantum dan data
                      yang tersedia. Konsentrasi pasti dan keseluruhan proses formulasi
                      tidak diketahui.
                    </p>
                  </div>
                )}
              </section>

              {/* KETERBATASAN */}
              <section>
                <h3 className="text-xs font-extrabold tracking-[0.1em] text-ink-muted mb-2">
                  KETERBATASAN DATA
                </h3>
                <ul className="text-[13px] text-ink-soft space-y-1 list-disc list-inside">
                  {limitations.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
                <p className="text-xs text-ink-muted mt-3 leading-relaxed">
                  Berdasarkan daftar bahan yang tersedia.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
