import pymupdf
from PIL import Image, ImageDraw
import os
doc = pymupdf.open(r"GM-Guide-A5.pdf")
pages = [34,35,36, 53,54,55, 66,67,68, 88,89,90]  # Vos, Statue, Drider, Hob Gob neighborhoods
want = [p-1 for p in pages]
dpi=150
ims=[]
for pno in want:
    p=doc[pno]
    pix=p.get_pixmap(dpi=dpi)
    im=Image.frombytes("RGB",[pix.width,pix.height],pix.samples)
    ims.append((pno+1,im))
cols=3
tw=ims[0][1].width; th=ims[0][1].height
pad=8; lab=18
rows=(len(ims)+cols-1)//cols
sheet=Image.new("RGB",(cols*(tw+pad)+pad, rows*(th+lab+pad)+pad),(30,30,30))
d=ImageDraw.Draw(sheet)
for idx,(pn,im) in enumerate(ims):
    r=idx//cols; c=idx%cols
    x=pad+c*(tw+pad); y=pad+r*(th+lab+pad)
    d.text((x+2,y+2),f"page {pn}",fill=(255,220,120))
    sheet.paste(im,(x,y+lab))
out=r"gm-guide\proof\pages\boss_check.png"
sheet.save(out)
print("wrote",out)
