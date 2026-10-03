import pymupdf, json, sys, re, os

PDF = os.path.join(os.path.dirname(__file__), "..", "..", "GM-Guide-A5.pdf")
d = pymupdf.open(PDF)

pages = d.page_count
print(f"PAGE COUNT: {pages}")

# ---- size check: every page 5.5 x 8.5 in -> 396 x 612 pt ----
bad_size = []
for i, pg in enumerate(d, start=1):
    w, h = round(pg.rect.width, 1), round(pg.rect.height, 1)
    if (w, h) != (396.0, 612.0):
        bad_size.append((i, w, h))
print("ALL PAGES 5.5x8.5in (396x612pt):", "YES" if not bad_size else f"NO {bad_size}")

# ---- per-page analysis ----
info = []
for i, pg in enumerate(d, start=1):
    pa = pg.rect.width * pg.rect.height
    big = False
    maxfrac = 0.0
    for im in pg.get_image_info():
        r = pymupdf.Rect(im['bbox'])
        frac = (r.width * r.height) / pa
        maxfrac = max(maxfrac, frac)
        if frac > 0.45:
            big = True
    txt = pg.get_text().strip()
    n_img = len(pg.get_image_info())
    info.append(dict(page=i, big=big, maxfrac=round(maxfrac, 3),
                     textlen=len(txt), nimg=n_img, text=txt))

map_pages = [p['page'] for p in info if p['big']]
print("MAP PAGES (big image >45%):", map_pages)

# ---- blank filler pages: no image, no text ----
blanks = [p['page'] for p in info if p['nimg'] == 0 and p['textlen'] == 0]
print("BLANK FILLER PAGES (no img, no text):", blanks, "count=", len(blanks))

# ---- map page text lengths (should be caption only, +intro on first) ----
print("\nMAP PAGE TEXT (caption/intro only; no room data):")
for p in info:
    if p['big']:
        preview = p['text'][:90].replace('\n', ' / ')
        print(f"  p{p['page']:>3} imgfrac={p['maxfrac']} textlen={p['textlen']}  :: {preview}")

# ---- no map page shares with room data ----
# Room data markers: stat lines, read-aloud, room id headings beyond caption.
data_markers = re.compile(r'(Armor Class|^AC\b|Read Aloud|Initiative|Hit Points|\bDEX\b|\bCON\b|Challenge)', re.M)
map_with_data = []
for p in info:
    if p['big']:
        # strip the caption line(s) and the part4 intro, then look for data markers
        if data_markers.search(p['text']):
            map_with_data.append(p['page'])
print("\nMAP PAGES CONTAINING ROOM-DATA MARKERS:", map_with_data or "NONE")

# ---- literal markdown leak scan (visible raw syntax) across all text ----
leak_pat = {
    'bold **': re.compile(r'\*\*'),
    'img ![': re.compile(r'!\['),
    'link ](': re.compile(r'\]\('),
    'container :::': re.compile(r':::'),
    'heading # at line start': re.compile(r'^#{1,6}\s', re.M),
    'blockquote > at line start': re.compile(r'^>\s', re.M),
}
leaks = {}
for p in info:
    for name, pat in leak_pat.items():
        if pat.search(p['text']):
            leaks.setdefault(name, []).append(p['page'])
print("\nLITERAL MARKDOWN LEAKS:")
if not leaks:
    print("  NONE")
else:
    for k, v in leaks.items():
        print(f"  {k}: pages {v}")

# ---- Left Dungeon run assertions ----
print("\nLEFT DUNGEON RUN CHECK:")
# first two map pages are the Left Dungeon run
p14 = next(p for p in info if p['page'] == 14)
p15 = next(p for p in info if p['page'] == 15)
p16 = next(p for p in info if p['page'] == 16)
print(f"  p14 big={p14['big']} parity={'LEFT/even' if 14%2==0 else 'RIGHT/odd'}")
print(f"  p15 big={p15['big']} parity={'LEFT/even' if 15%2==0 else 'RIGHT/odd'}")
print(f"  p16 big={p16['big']} (should be DATA, not a map)")
print(f"  no blank between p14 and p15: {15 not in blanks and 14 in map_pages and 15 in map_pages}")

# ---- single map parity: every map except the follower(s) must be EVEN ----
# follower = a map page immediately preceded by a map page
followers = set()
for p in map_pages:
    if (p - 1) in map_pages:
        followers.add(p)
print("\nSINGLE/LEADER MAP PARITY (must be EVEN/LEFT):")
all_ok = True
for p in map_pages:
    role = 'follower' if p in followers else 'leader '
    parity = 'LEFT/even' if p % 2 == 0 else 'RIGHT/odd'
    ok = (p in followers) or (p % 2 == 0)
    if not ok:
        all_ok = False
    print(f"  p{p:>3} {role} {parity} {'OK' if ok else 'FAIL'}")
print("ALL LEADERS ON LEFT:", "YES" if all_ok else "NO")

# ---- summary table: run -> maps -> parity -> data-start ----
print("\n=== RUN TABLE ===")
runs = []
cur = []
for p in map_pages:
    if cur and p != cur[-1] + 1:
        runs.append(cur); cur = []
    cur.append(p)
if cur:
    runs.append(cur)
for ri, run in enumerate(runs, start=1):
    parts = ", ".join(f"p{p}({'L' if p%2==0 else 'R'})" for p in run)
    data_start = run[-1] + 1
    print(f"  run {ri}: maps [{parts}] -> data starts p{data_start}")

print("\nBLANK COUNT:", len(blanks), "pages:", blanks)
d.close()
