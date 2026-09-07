import React from 'react';

export default function Loading() {
  return (
    <main className="bg-white">
      <div className="max-w-4xl mx-auto px-lg md:px-2xl py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-soft-cream rounded w-1/4 mb-2" />
          <div className="h-12 bg-soft-cream rounded w-3/4 mb-6" />
          <div className="h-48 bg-soft-cream rounded-md mb-6" />
          <div className="h-4 bg-soft-cream rounded w-full mb-2" />
          <div className="h-4 bg-soft-cream rounded w-5/6 mb-8" />

          {/* Skeleton for "Perlu Diperhatikan" section */}
          <div className="h-24 bg-soft-cream rounded-md mb-8" />

          {/* Skeleton for INCI list */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-12 bg-soft-cream rounded" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
