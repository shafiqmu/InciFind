'use client';

import { useState } from 'react';

interface InciItemProps {
  name: string;
  badges?: Array<{ label: string; category: string }>;
  context?: string;
  functions?: string[];
  short?: string;
  longDescription?: string;
}

export default function InciItem({ name, badges = [], context, functions = [], short, longDescription }: InciItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const expandable = Boolean(context || longDescription);
  const detail = longDescription || context;

  return (
    <article className={`border-b border-line last:border-b-0 ${isOpen ? 'open' : ''}`}>
      <div
        role="button"
        tabIndex={expandable ? 0 : -1}
        onClick={() => expandable && setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (expandable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className="min-h-[72px] grid grid-cols-[1fr_40px] md:grid-cols-[1.3fr_1fr_1fr_45px] items-center gap-2 px-4 md:px-[22px] py-[14px] transition-colors hover:bg-[#fbfcfb] cursor-pointer"
      >
        <div className="text-[15px] font-bold">
          {name}
          {badges.length > 0 && (
            <span className="inline-flex ml-[7px] px-[7px] py-1 text-pine-800 bg-pine-100 rounded-md text-[10px] font-extrabold align-middle">
              {badges[0].label}
            </span>
          )}
        </div>

        <div className="col-span-full md:col-span-1 flex flex-wrap gap-[5px] md:mt-0 -mt-1">
          {functions.slice(0, 4).map((fn) => (
            <span key={fn} className="px-2 py-[5px] text-pine-700 bg-pine-100 rounded-md text-[11px] font-semibold">
              {fn}
            </span>
          ))}
        </div>

        <div className="hidden md:block text-ink-soft text-[13px] leading-[1.5]">
          {short || '—'}
        </div>

        <div className={`grid place-items-center text-ink-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          {expandable && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          )}
        </div>
      </div>

      {isOpen && detail && (
        <div className="px-4 md:px-[22px] pb-5 text-ink-soft text-sm leading-[1.7]">
          <div className="p-[17px] bg-pine-100 rounded-[14px]">
            <strong className="text-ink">Deskripsi</strong>
            <br />
            {detail}
            {context && longDescription && (
              <p className="mt-2">{context}</p>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
