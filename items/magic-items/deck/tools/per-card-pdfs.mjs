// per-card-pdfs.mjs — export each card as its own 2-page (front, back) PDF at
// true card size (2.5 x 3.5 in). Page 1 is the front upright; page 2 is the back
// rotated 180 degrees so a SHORT-edge duplex print lands it upright behind the
// front (same convention as the print-and-play sheet).
//
// Defaults to this deck's build/ dirs; override with FRONTS_DIR / BACKS_DIR / OUT_DIR.
// Run:  node per-card-pdfs.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const deckDir = path.resolve(toolsDir, "..");
const frontsDir = process.env.FRONTS_DIR || path.join(deckDir, "build", "fronts");
const backsDir = process.env.BACKS_DIR || path.join(deckDir, "build", "backs");
const outDir = process.env.OUT_DIR || path.join(deckDir, "cards");
fs.mkdirSync(outDir, { recursive: true });

const PT_W = 2.5 * 72, PT_H = 3.5 * 72; // 180 x 252 pt

const names = fs.readdirSync(frontsDir).filter((f) => f.endsWith(".png")).map((f) => f.replace(/\.png$/, ""));
let n = 0, total = 0;
for (const name of names) {
  const fp = path.join(frontsDir, name + ".png"), bp = path.join(backsDir, name + ".png");
  if (!fs.existsSync(bp)) { console.log("no back for", name); continue; }
  const doc = await PDFDocument.create();
  const front = await sharp(fp).jpeg({ quality: 92, chromaSubsampling: "4:4:4" }).toBuffer();
  const back = await sharp(bp).rotate(180).jpeg({ quality: 92, chromaSubsampling: "4:4:4" }).toBuffer();
  const fImg = await doc.embedJpg(front);
  doc.addPage([PT_W, PT_H]).drawImage(fImg, { x: 0, y: 0, width: PT_W, height: PT_H });
  const bImg = await doc.embedJpg(back);
  doc.addPage([PT_W, PT_H]).drawImage(bImg, { x: 0, y: 0, width: PT_W, height: PT_H });
  const bytes = await doc.save();
  fs.writeFileSync(path.join(outDir, name + ".pdf"), bytes);
  total += bytes.length; n++;
}
console.log(`wrote ${n} per-card PDFs to ${outDir} (${(total / 1048576).toFixed(1)} MB total)`);
