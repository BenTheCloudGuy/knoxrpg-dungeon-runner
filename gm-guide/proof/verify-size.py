import pymupdf
doc = pymupdf.open(r"GM-Guide-A5.pdf")
print("PAGES:", doc.page_count)
sizes = {}
for i, p in enumerate(doc):
    r = p.rect
    w_in = round(r.width/72, 3)
    h_in = round(r.height/72, 3)
    key = (w_in, h_in)
    sizes[key] = sizes.get(key, 0) + 1
print("PAGE SIZES (inches -> count):")
for k, v in sizes.items():
    print("  ", k, "->", v)
# flag any page not 5.5 x 8.5
bad = [i for i, p in enumerate(doc) if round(p.rect.width/72,2)!=5.5 or round(p.rect.height/72,2)!=8.5]
print("NON-A5 PAGES:", bad)
