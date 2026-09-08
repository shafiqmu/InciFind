'use client';

import { ASPECT_LABELS, type AspectKey } from '@/lib/ingredients/dictionary';

interface KeyIngredientsProps {
  items: Array<{ name: string; aspects: AspectKey[] }>;
}

/**
 * Shortcut max 4 bahan paling relevan (Rule Engine).
 * Klik → daftar INCI scroll ke barisnya + expand otomatis.
 */
export default function KeyIngredients({ items }: KeyIngredientsProps) {
  const top = items.slice(0, 4);
  if (top.length === 0) return null;

  const focus = (name: string) => {
    window.dispatchEvent(new CustomEvent<string>('inci-focus', { detail: name }));
  };

  return (
    <section className="mb-[55px]">
      <h2 className="font-serif text-pine-900 text-[26px] md:text-[30px] tracking-[-0.03em] mb-1">
        ✦ Bahan Utama
      </h2>
      <p className="text-ink-soft text-sm mb-4">
        Paling relevan menurut Rule Engine — ketuk untuk lihat di daftar bahan.
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {top.map((k) => (
          <button
            key={k.name}
            type="button"
            onClick={() => focus(k.name)}
            className="p-4 text-left bg-white border border-line rounded-2xl transition-all hover:border-pine-600 hover:-translate-y-0.5"
          >
            <div className="text-ink text-sm font-bold leading-snug mb-1">{k.name}</div>
            <div className="text-pine-700 text-xs font-semibold">
              {k.aspects.map((a) => ASPECT_LABELS[a]).join(' · ')}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
