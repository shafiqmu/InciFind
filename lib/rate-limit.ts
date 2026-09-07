/**
 * Rate limiter sederhana (in-memory, per IP).
 * Melindungi /api/* dari abuse yang bisa berujung IP-ban INKEE / jebol kuota.
 * NOTE: reset saat restart supra; di serverless tiap instance punya counter sendiri
 * (cukup sebagai rem darurat, bukan kuota presisi).
 */

const hits = new Map<string, number[]>();

export function rateLimit(ip: string, limit = 30, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  // Bersihkan entri basi sesekali
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.length === 0 || now - v[v.length - 1] > windowMs) hits.delete(k);
    }
  }
  return arr.length <= limit;
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}
