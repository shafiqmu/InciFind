# ✦ InciFind — Kenali Isi Skincare-mu

Cari produk skincare, baca daftar bahan (INCI), kenali fungsi tiap bahan,
dan lihat ringkasan formula. Tanpa login. Cukup tahu.

**Live:** _(isi URL Vercel setelah Deployment Protection dimatikan)_

## Fitur

- **Pencarian produk** — live dari inkeedecoder.com + fallback statis offline
- **Halaman produk** — foto, deskripsi, daftar INCI + cari + fungsi + skor risiko
- **✦ Analisis Formula** — profil 5 aspek (Hidrasi, Skin Barrier, Menenangkan,
  Mencerahkan, Eksfoliasi), bahan utama, hal yang perlu diperhatikan,
  kesimpulan AI, dan "mengapa saya mendapatkan hasil ini"
- **Bahasa Indonesia** — seluruh UI + deskripsi (nama bahan INCI tetap Inggris,
  sesuai standar internasional)

## Arsitektur

```text
INKEE (sumber data mentah)
  → normalizer (lib/inkee-client.ts)
  → Ingredient Dictionary + Function Mapping (deterministik, tanpa AI)
  → Rule Engine (profil 5 aspek + bahan utama + perhatian)
  → AI Analyst — 1x LLM call per formula (cache permanen)
  → JSON Validator (kode biasa, tanpa LLM)
  → UI (popup instan, server-render)
```

Prinsip: **database menentukan fakta → rule engine mendeteksi → AI
menjelaskan → UI menyederhanakan.** AI tidak pernah jadi sumber fakta.

## Tech Stack

Next.js 14 (App Router) · React 18 · Tailwind CSS · TypeScript ·
`@knorby/inkeedecoder-client` · Google Gemini (free tier, kesimpulan AI)

## Setup Lokal

```bash
npm install
cp .env.local.example .env.local   # lalu isi GEMINI_API_KEY
npm run dev
```

| Env | Wajib? | Keterangan |
|---|---|---|
| `GEMINI_API_KEY` | Ya (untuk AI) | Gratis di [aistudio.google.com](https://aistudio.google.com). Tanpa key, situs tetap jalan — bagian AI disembunyikan otomatis. |

```bash
npm run build   # typecheck + production build
npm start       # jalankan hasil build
```

## Struktur

```text
app/                  halaman + API routes (/api/products)
components/           Navbar, Footer, SearchBar, hero, INCI table, popup formula
lib/
  inkee-client.ts     provider + normalizer + cache (sumber: INKEE)
  ingredients/        dictionary (±40 bahan) + function-mapping EN → 5 aspek
  formula/            rule-engine + validator deterministik
  ai/                 analyst (prompt ringan + cache slug:hash:v1)
  translate.ts        deskripsi EN → ID (cache permanen per bahan)
  rate-limit.ts       30 req/menit/IP untuk /api/*
data/                 cache prefilled (id/summary/analysis) + produk fallback
```

## Keamanan

- Secret hanya di `.env.local` (gitignored + vercelignored) — tidak pernah di-commit
- `GEMINI_API_KEY` hanya dipakai server-side (tidak ada `NEXT_PUBLIC_*`)
- Security headers (nosniff, SAMEORIGIN, Referrer-Policy, Permissions-Policy)
- Rate limit API + validator output AI + fallback UI saat AI gagal

## Catatan Data

Data produk dari inkeedecoder.com (unofficial scraper, bukan afiliasi —
ambil seperlunya: nama, bahan, fungsi, gambar). Formula bisa berubah;
selalu cek kemasan terbaru. **InciFind bersifat edukatif, bukan nasihat
medis.**

## Roadmap

- [x] Fase 1: rule engine + popup Analisis Formula + cache
- [ ] Perluas kamus bahan dari log bahan tak-terpetakan
- [ ] Ganti prose terjemahan INKEE dengan ringkasan milik sendiri
- [ ] Pemeriksaan rutinitas (routine checker)
