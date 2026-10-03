import pymupdf, re, sys, json

PDF = r"C:\Users\benthebuilder\.working\knoxrpg-dungeon-runner\GM-Guide-A5.pdf"
d = pymupdf.open(PDF)
N = d.page_count

def info(pg):
    pa = pg.rect.width * pg.rect.height
    fr = [ (pymupdf.Rect(im['bbox']).width*pymupdf.Rect(im['bbox']).height)/pa
           for im in pg.get_image_info() ]
    return (max(fr) if fr else 0.0), pg.get_text().strip()

infos = [info(pg) for pg in d]
map_pages  = [i+1 for i,(b,t) in enumerate(infos) if b > 0.45]
blank_pages= [i+1 for i,(b,t) in enumerate(infos) if b < 0.01 and t == ""]

print(f"TOTAL PAGES: {N}")

# --- page size check (5.5 x 8.5 in = 396 x 612 pt) ---
badsize = [i+1 for i,pg in enumerate(d)
           if round(pg.rect.width,1)!=396.0 or round(pg.rect.height,1)!=612.0]
print(f"PAGE SIZE 5.5x8.5in: {'ALL OK' if not badsize else 'BAD -> '+str(badsize)}  "
      f"(sample p1 = {d[0].rect.width/72:.3f} x {d[0].rect.height/72:.3f} in)")

# --- parity table ---
def first_data_page(mp):
    # next page after the map that is neither blank nor another map page
    k = mp + 1
    while k <= N and (k in blank_pages or k in map_pages):
        k += 1
    return k
print("\nAREA MAP PARITY TABLE")
print(f"{'area':32} {'map_pg':>6} {'is_even':>7} {'data_start':>10}  data_first_line")
alleven = True
for mp in map_pages:
    cap = d[mp-1].get_text().strip().split('\n')[0]
    dp  = first_data_page(mp)
    first = " ".join(d[dp-1].get_text().strip().split('\n')[:1])[:46] if dp<=N else ""
    even = (mp % 2 == 0)
    alleven &= even
    print(f"{cap[:32]:32} {mp:>6} {str(even):>7} {dp:>10}  {first!r}")
print("ALL MAPS ON EVEN/LEFT PAGE:", alleven)

# --- blank pages ---
print(f"\nBLANK FILLER PAGES ({len(blank_pages)}): {blank_pages}")
for bp in blank_pages:
    b,t = infos[bp-1]
    draw = len(d[bp-1].get_drawings())
    print(f"  p{bp}: text={t!r} imgfrac={b:.3f} vector_drawings={draw}  -> "
          f"{'TRULY BLANK' if (t=='' and b<0.01) else 'NOT BLANK!'}")

# --- literal markdown leak scan ---
full = "\n".join(t for _,t in infos)
leaks = {}
# standalone markdown heading markers at line start
leaks['line starts with #'] = sum(1 for ln in full.split('\n') if re.match(r'^#{1,6}\s', ln))
leaks['** bold markers']     = len(re.findall(r'\*\*', full))
leaks['markdown link ](']    = full.count('](')
leaks['image ![']            = full.count('![')
leaks['blockquote "> "']     = sum(1 for ln in full.split('\n') if re.match(r'^>\s', ln))
leaks['container :::']        = full.count(':::')
print("\nLITERAL MARKDOWN LEAK SCAN (want all 0):")
for k,v in leaks.items():
    print(f"  {k:24} {v}")

# --- split read-aloud / statblock heuristic ---
# A read-aloud box or statblock is a filled rounded rect. If one is split, a
# filled box rectangle will touch the very bottom printable edge of a page AND
# the same-colored box will resume at the top of the next page. We approximate
# by flagging any page whose last text line is a bare "Read Aloud" label (box
# would have been orphaned) -- the merge logic should prevent this.
orphan = []
for i,(b,t) in enumerate(infos):
    lines = [l for l in t.split('\n') if l.strip()]
    if lines and re.search(r'read aloud', lines[-1], re.I):
        orphan.append(i+1)
print(f"\nORPHANED 'Read Aloud' label at page bottom: {orphan if orphan else 'none'}")

print("\nMAP PAGES:", map_pages)
