// assemble-deck.mjs — print-and-play sheet assembler for the magic-item deck.
//
// Reads the 46 rendered card fronts and per-item backs (in deck sort order),
// lays them out 3x3 (9 cards) per US Letter page at true 2.5"x3.5" @ 300
// dpi, adds light crop-mark cut guides in the margins, and writes a duplex-ready
// PDF. Page order is interleaved front, back, front, back... For a SHORT-edge
// duplex flip (HP 3201dw) the back pages are ROW-MIRRORED and each back is
// rotated 180 degrees, so each back prints behind its own front and reads
// upright when you flip the cut card left-to-right.
//
//   46 fronts -> 6 front pages (9,9,9,9,9,1) + 6 back pages = 12 pages.
//
// Output: items/magic-items/deck/magic-item-deck-printandplay.pdf
// Fronts are read from build/fronts/ by default; override with FRONTS_DIR=...
//
// Run:  npm install sharp pdf-lib   (once, see tools/README.md)
//       node assemble-deck.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const deckDir = path.resolve(toolsDir, "..");
const frontsDir = process.env.FRONTS_DIR || path.join(deckDir, "build", "fronts");
const backsDir = process.env.BACKS_DIR || path.join(deckDir, "build", "backs");
const outPath = path.join(deckDir, "magic-item-deck-printandplay.pdf");

// Deck sort order (matches render-all2.mjs).
const ORDER = [
  "gob-stopper",
  "goblin-juice", "flask-of-acid", "vial-of-poison", "potion-of-cure-disease",
  "artificer-s-arsenal", "protector-s-codex", "healer-s-gift", "tomb-warden", "escape-route", "scout-s-tome",
  "spell-scroll-cantrip", "spell-scroll-level-1", "spell-scroll-level-2", "spell-scroll-level-3", "spell-scroll-of-fireball", "scroll-of-protection",
  "enduring-spellbook", "bag-of-holding", "rope-of-climbing", "driftglobe", "feather-token-feather-fall",
  "potion-of-healing", "potion-of-healing-greater", "potion-of-resistance", "potion-of-climbing", "potion-of-water-breathing", "potion-of-heroism",
  "longsword-1", "greatsword-1", "rapier-1", "shortbow-1", "dagger-1", "mace-1", "handaxe-1", "spear-1", "warhammer-1", "crossbow-light-1",
  "leather-1", "studded-leather-1", "hide-1", "chain-shirt-1", "breastplate-1", "half-plate-1", "plate-1", "shield-1",
].map((n) => n + ".png");

// Geometry: US Letter portrait @ 300 dpi. Cards are true poker size.
const DPI = 300;
const PW = 8.5 * DPI, PH = 11 * DPI;   // 2550 x 3300 px
const CARD_W = 2.5 * DPI, CARD_H = 3.5 * DPI; // 750 x 1050 px
const COLS = 3, ROWS = 3, PER_PAGE = COLS * ROWS;
const GRID_W = COLS * CARD_W, GRID_H = ROWS * CARD_H;
const MARGIN_X = (PW - GRID_W) / 2; // 150
const MARGIN_Y = (PH - GRID_H) / 2; // 75
const QUALITY = 88; // JPEG quality for embedded page images; well under the 40 MB budget

// Duplex back-registration compensation for the printer's front/back drift.
// Measure on a cut card, then set env vars in millimeters:
//   BACK_DX_MM  + moves the printed back to the RIGHT
//   BACK_DY_MM  + moves the printed back DOWN
// Verified on Ben's HP 3201dw: a positive page-space shift moves the printed back DOWN
// (no sign inversion with this short-edge + rotated-back workflow).
// Only the back CARDS shift; the crop marks stay put so the cut lines still match the front.
const MM = 300 / 25.4;
// Measured on Ben's HP 3201dw: the back prints ~1.75 mm high, so nudge it down 1.75 mm by default.
const BACK_DX = Math.round(parseFloat(process.env.BACK_DX_MM || "0") * MM);
const BACK_DY = Math.round(parseFloat(process.env.BACK_DY_MM || "1.75") * MM);

// Crop ticks live in the margins only, so they never overprint card art.
function cropSvg() {
  const T = 34, sw = 1.6, col = "#444444";
  const xs = []; for (let c = 0; c <= COLS; c++) xs.push(MARGIN_X + c * CARD_W);
  const ys = []; for (let r = 0; r <= ROWS; r++) ys.push(MARGIN_Y + r * CARD_H);
  const lines = [];
  for (const x of xs) {
    lines.push(`<line x1="${x}" y1="${MARGIN_Y - T}" x2="${x}" y2="${MARGIN_Y}" stroke="${col}" stroke-width="${sw}"/>`);
    lines.push(`<line x1="${x}" y1="${MARGIN_Y + GRID_H}" x2="${x}" y2="${MARGIN_Y + GRID_H + T}" stroke="${col}" stroke-width="${sw}"/>`);
  }
  for (const y of ys) {
    lines.push(`<line x1="${MARGIN_X - T}" y1="${y}" x2="${MARGIN_X}" y2="${y}" stroke="${col}" stroke-width="${sw}"/>`);
    lines.push(`<line x1="${MARGIN_X + GRID_W}" y1="${y}" x2="${MARGIN_X + GRID_W + T}" y2="${y}" stroke="${col}" stroke-width="${sw}"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${PW}" height="${PH}">${lines.join("")}</svg>`;
}

async function buildSheet(slots, dx = 0, dy = 0) {
  const comps = [];
  for (let i = 0; i < slots.length; i++) {
    if (!slots[i]) continue;
    const c = i % COLS, r = Math.floor(i / COLS);
    comps.push({ input: slots[i], left: Math.round(MARGIN_X + c * CARD_W + dx), top: Math.round(MARGIN_Y + r * CARD_H + dy) });
  }
  comps.push({ input: Buffer.from(cropSvg()), left: 0, top: 0 });
  return await sharp({ create: { width: PW, height: PH, channels: 3, background: "#ffffff" } })
    .composite(comps)
    .jpeg({ quality: QUALITY, chromaSubsampling: "4:2:0" })
    .toBuffer();
}

// ---- gather inputs ----
const missF = ORDER.filter((n) => !fs.existsSync(path.join(frontsDir, n)));
const missB = ORDER.filter((n) => !fs.existsSync(path.join(backsDir, n)));
if (missF.length || missB.length) {
  if (missF.length) console.error(`Missing ${missF.length} front PNG(s) in ${frontsDir}: ${missF.join(", ")}`);
  if (missB.length) console.error(`Missing ${missB.length} back PNG(s) in ${backsDir}: ${missB.join(", ")}`);
  console.error("Run  node render-cards-v2.mjs  first (see tools/README.md).");
  process.exit(1);
}
const fronts = ORDER.map((n) => fs.readFileSync(path.join(frontsDir, n)));
const backs = ORDER.map((n) => fs.readFileSync(path.join(backsDir, n)));

// ---- build pages: front, then column-mirrored back, interleaved ----
const doc = await PDFDocument.create();
const PT_W = 8.5 * 72, PT_H = 11 * 72; // 612 x 792 pt
const previewDir = path.join(deckDir, "build", "preview");
fs.mkdirSync(previewDir, { recursive: true });

for (let start = 0; start < ORDER.length; start += PER_PAGE) {
  const pageFronts = fronts.slice(start, start + PER_PAGE);
  const pageBacks = backs.slice(start, start + PER_PAGE);
  const frontSheet = await buildSheet(pageFronts);
  // SHORT-edge duplex (HP 3201dw): row-mirror the positions so each back lands behind its own
  // front, AND rotate each back 180 degrees so the back reads upright when you flip the cut card
  // the normal way (left-to-right / long edge). A short-edge flip otherwise inverts the back.
  const backSlots = Array(PER_PAGE).fill(null);
  for (let i = 0; i < pageBacks.length; i++) {
    const r = Math.floor(i / COLS), c = i % COLS;
    backSlots[(ROWS - 1 - r) * COLS + c] = await sharp(pageBacks[i]).rotate(180).png().toBuffer();
  }
  const backSheet = await buildSheet(backSlots, BACK_DX, BACK_DY);
  if (start === 0) {
    fs.writeFileSync(path.join(previewDir, "sheet-1-front.jpg"), frontSheet);
    fs.writeFileSync(path.join(previewDir, "sheet-1-back.jpg"), backSheet);
  }
  const fImg = await doc.embedJpg(frontSheet);
  doc.addPage([PT_W, PT_H]).drawImage(fImg, { x: 0, y: 0, width: PT_W, height: PT_H });
  const bImg = await doc.embedJpg(backSheet);
  doc.addPage([PT_W, PT_H]).drawImage(bImg, { x: 0, y: 0, width: PT_W, height: PT_H });
}
const bytes = await doc.save();
fs.writeFileSync(outPath, bytes);

const mb = (bytes.length / 1048576).toFixed(2);
console.log(`Wrote ${outPath}`);
console.log(`Pages: ${doc.getPageCount()} (${doc.getPageCount() / 2} fronts + ${doc.getPageCount() / 2} backs), ${ORDER.length} cards, size ${mb} MB`);
