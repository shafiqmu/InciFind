// Helper untuk nindakake API routes (shared di server-side)
// Umumnya dipakai oleh Next.js route handlers yang butuh caching sederhana.

const CACHE = new Map();

/**
 * Cache sederhana di memori (hanya untuk proses Node.js lokal).
 * TTL default 10 menit.
 */
export function memoryCache(key, ttlMs = 10 * 60 * 1000) {
  return {
    get: () => {
      const entry = CACHE.get(key);
      if (!entry) return null;
      if (Date.now() - entry.ts > ttlMs) {
        CACHE.delete(key);
        return null;
      }
      return entry.value;
    },
    set: (value) => {
      CACHE.set(key, { ts: Date.now(), value });
    },
  };
}

/**
 * Generate cache key unik dari request parameters.
 */
export function cacheKey(parts) {
  return 'obf:' + parts.map((p) => String(p)).join(':');
}
