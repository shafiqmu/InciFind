'use client';

interface InciItemProps {
  name: string;
  danger?: boolean;
  functions?: string[];
  short?: string;
  longDescription?: string;
  context?: string;
  open?: boolean;
  onToggle?: () => void;
}

/**
 * Baris INCI Sheet: default cuma nama (+ titik merah kalau perlu perhatian).
 * Fungsi/deskripsi baru muncul setelah baris diketuk.
 */
export default function InciItem({
  name,
  danger = false,
  functions = [],
  short,
  longDescription,
  context,
  open = false,
  onToggle,
}: InciItemProps) {
  const detail = longDescription || short || context;
  const expandable = Boolean(detail || functions.length > 0);

  return (
    <article className="border-b border-line last:border-b-0">
      <div
        role={expandable ? 'button' : undefined}
        tabIndex={expandable ? 0 : -1}
        onClick={() => expandable && onToggle?.()}
        onKeyDown={(e) => {
          if (expandable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onToggle?.();
          }
        }}
        className={`min-h-[60px] flex items-center gap-3 px-4 lg:px-[22px] py-[13px] transition-colors ${
          expandable ? 'hover:bg-[#fbfcfb] cursor-pointer' : ''
        }`}
      >
        {danger && (
          <span
            title="Bahan ini perlu diperhatikan"
            className="w-2 h-2 rounded-full bg-clay shrink-0"
          />
        )}
        <div className="flex-1 min-w-0 text-[15px] font-bold truncate">{name}</div>
        <div
          className={`grid place-items-center text-ink-muted transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        >
          {expandable && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          )}
        </div>
      </div>

      {open && expandable && (
        <div className="px-4 lg:px-[22px] pb-5">
          {functions.length > 0 && (
            <div className="flex flex-wrap gap-[5px] mb-3">
              {functions.slice(0, 6).map((fn) => (
                <span key={fn} className="px-2 py-[5px] text-pine-700 bg-pine-100 rounded-md text-[11px] font-semibold">
                  {fn}
                </span>
              ))}
            </div>
          )}
          {detail && (
            <div className="p-[17px] bg-pine-100 rounded-[14px] text-ink-soft text-sm leading-[1.7]">
              <strong className="text-ink">Deskripsi</strong>
              <br />
              {detail}
              {context && longDescription && <p className="mt-2">{context}</p>}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
