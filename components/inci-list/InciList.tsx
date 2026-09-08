'use client';

import { useEffect, useState } from 'react';
import InciItem from './InciItem';

interface InciListProps {
  ingredients: Array<{
    name: string;
    danger?: boolean;
    context?: string;
    functions?: string[];
    short?: string;
    longDescription?: string;
  }>;
}

export function inciAnchor(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `inci-${slug}`;
}

/**
 * Clean INCI Sheet: daftar tipografi nama bahan + search (nama/fungsi).
 * Menerima event 'inci-focus' dari section Bahan Utama → buka + scroll ke baris.
 */
export default function InciList({ ingredients }: InciListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openName, setOpenName] = useState<string | null>(null);

  useEffect(() => {
    const onFocus = (e: Event) => {
      const name = (e as CustomEvent<string>).detail;
      if (!name) return;
      setSearchTerm('');
      setOpenName(name);
      setTimeout(() => {
        document
          .getElementById(inciAnchor(name))
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 60);
    };
    window.addEventListener('inci-focus', onFocus);
    return () => window.removeEventListener('inci-focus', onFocus);
  }, []);

  const q = searchTerm.toLowerCase();
  const filtered = ingredients.filter(
    (ing) =>
      ing.name.toLowerCase().includes(q) ||
      (ing.short || '').toLowerCase().includes(q) ||
      (ing.functions || []).join(' ').toLowerCase().includes(q)
  );

  return (
    <section className="pt-[10px]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-[15px] md:gap-[30px] mb-[22px]">
        <div>
          <h2 className="font-serif text-pine-900 text-[34px] md:text-[40px] tracking-[-0.04em]">
            Bahan (INCI)
          </h2>
          <p className="text-ink-soft text-sm mt-1">
            {ingredients.length} bahan — ketuk baris untuk detail.
          </p>
        </div>
        <label className="w-full md:w-[300px] h-11 flex items-center px-[14px] bg-white border border-line rounded-xl shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[17px] h-[17px] text-ink-muted mr-[9px]">
            <circle cx="11" cy="11" r="7"></circle>
            <path d="m20 20-4-4"></path>
          </svg>
          <input
            type="search"
            placeholder="Cari bahan atau fungsi..."
            aria-label="Cari bahan atau fungsi"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-0 outline-0 text-ink bg-transparent text-base"
          />
        </label>
      </div>

      <div className="overflow-hidden bg-white border border-line rounded-[24px] shadow-[0_4px_16px_rgba(23,60,42,0.05)]">
        <div>
          {filtered.length > 0 ? (
            filtered.map((ingredient) => (
              <div key={ingredient.name} id={inciAnchor(ingredient.name)} className="scroll-mt-24">
                <InciItem
                  name={ingredient.name}
                  danger={ingredient.danger}
                  context={ingredient.context}
                  functions={ingredient.functions}
                  short={ingredient.short}
                  longDescription={ingredient.longDescription}
                  open={openName === ingredient.name}
                  onToggle={() =>
                    setOpenName((prev) => (prev === ingredient.name ? null : ingredient.name))
                  }
                />
              </div>
            ))
          ) : (
            <p className="p-[22px] text-ink-muted text-center text-[13px] italic">
              Tidak ada bahan yang cocok dengan pencarian.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
