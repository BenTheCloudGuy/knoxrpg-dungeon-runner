import pymupdf
from PIL import Image
import os

doc = pymupdf.open(r"GM-Guide-A5.pdf")
outdir = r"gm-guide\proof\pages"
os.makedirs(outdir, exist_ok=True)
dpi = 96
imgs = []
for i, p in enumerate(doc):
    pix = p.get_pixmap(dpi=dpi)
    im = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    imgs.append(im)

# montage: 5 cols x 4 rows = 20 pages per sheet, with page-number labels
from PIL import ImageDraw
cols, rows = 5, 4
per = cols*rows
# thumbnail size
tw = imgs[0].width
th = imgs[0].height
pad = 6
label_h = 16
sheets = 0
for start in range(0, len(imgs), per):
    chunk = imgs[start:start+per]
    sheet_w = cols*(tw+pad)+pad
    sheet_h = rows*(th+label_h+pad)+pad
    sheet = Image.new("RGB", (sheet_w, sheet_h), (40,40,40))
    d = ImageDraw.Draw(sheet)
    for idx, im in enumerate(chunk):
        r = idx//cols
        c = idx%cols
        x = pad + c*(tw+pad)
        y = pad + r*(th+label_h+pad)
        d.text((x+2, y+2), f"p{start+idx+1}", fill=(255,220,120))
        sheet.paste(im, (x, y+label_h))
    sp = os.path.join(outdir, f"sheet_{sheets:02d}.png")
    sheet.save(sp)
    print("wrote", sp, "pages", start+1, "to", start+len(chunk))
    sheets += 1
print("total sheets", sheets)
