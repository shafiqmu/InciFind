'use client';

import { useState } from 'react';
import InciItem from './InciItem';

interface InciListProps {
  ingredients: Array<{
    name: string;
    badges?: Array<{ label: string; category: string }>;
    context?: string;
    functions?: string[];
    short?: string;
    longDescription?: string;
  }>;
}

export default function InciList({ ingredients }: InciListProps) {
  const [searchTerm, setSearchTerm] = useState('');

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
            {filtered.length} dari {ingredients.length} bahan — cari atau buka baris untuk info lebih lanjut.
          </p>
        </div>
        <label className="w-full md:w-[300px] h-11 flex items-center px-[14px] bg-white border border-line rounded-xl shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[17px] h-[17px] text-ink-muted mr-[9px]">
            <circle cx="11" cy="11" r="7"></circle>
            <path d="m20 20-4-4"></path>
          </svg>
          <input
            type="search"
            placeholder="Cari bahan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-0 outline-0 text-ink bg-transparent text-[13px]"
          />
        </label>
      </div>

      <div className="overflow-hidden bg-white border border-line rounded-[24px] shadow-[0_4px_16px_rgba(23,60,42,0.05)]">
        <div className="hidden lg:grid grid-cols-[1.3fr_1fr_1fr_45px] px-[22px] py-4 bg-[#f8faf8] border-b border-line text-ink-muted text-xs font-extrabold uppercase tracking-[0.08em]">
          <div>Bahan</div>
          <div>Fungsi</div>
          <div>Deskripsi</div>
          <div></div>
        </div>
        <div>
          {filtered.length > 0 ? (
            filtered.map((ingredient, idx) => (
              <InciItem
                key={idx}
                name={ingredient.name}
                badges={ingredient.badges}
                context={ingredient.context}
                functions={ingredient.functions}
                short={ingredient.short}
                longDescription={ingredient.longDescription}
              />
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
