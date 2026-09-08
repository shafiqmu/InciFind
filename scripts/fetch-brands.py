"""Fotokopi sekali daftar brand INKEE -> data/brands-index.json.
Sopan: delay 1.2 dtk/request. ~520 request.
Pakai: python scripts/fetch-brands.py
"""
import json
import re
import time
import urllib.request
from datetime import date
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "data" / "brands-index.json"
BASE = "https://inkeedecoder.com/brands"
DELAY = 1.2
MAX_OFFSET = 650
UA = {"User-Agent": "InciFind-brand-index/1.0 (+educational directory)"}
LINK_RE = re.compile(r'<a[^>]*href="(/brands/[a-z0-9\-]+)"[^>]*>([^<]+)</a>', re.I)

seen: dict[str, str] = {}
offset = 0
empty_streak = 0

while offset <= MAX_OFFSET:
    url = BASE if offset == 0 else f"{BASE}?offset={offset}"
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as res:
        html = res.read().decode("utf-8", errors="replace")
    found = 0
    for m in LINK_RE.finditer(html):
        slug = m.group(1).replace("/brands/", "")
        name = re.sub(r"\s+", " ", m.group(2)).strip()
        if slug and name and slug != "brands" and slug not in seen:
            seen[slug] = name
            found += 1
    total_links = len(LINK_RE.findall(html))
    has_next = "next page" in html.lower()
    print(f"offset={offset}: {total_links} link ({found} baru), next={has_next}, total={len(seen)}", flush=True)
    if total_links == 0:
        empty_streak += 1
        if empty_streak >= 2 or not has_next:
            break
    else:
        empty_streak = 0
        if not has_next:
            break
    offset += 1
    time.sleep(DELAY)

brands = sorted(({"name": n, "slug": s} for s, n in seen.items()), key=lambda b: b["name"].lower())
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps({"fetchedAt": date.today().isoformat(), "count": len(brands), "brands": brands}, ensure_ascii=False), encoding="utf-8")
print(f"SELESAI: {len(brands)} brand -> {OUT}", flush=True)
