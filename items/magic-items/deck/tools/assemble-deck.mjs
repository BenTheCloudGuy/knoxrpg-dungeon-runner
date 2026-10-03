// assemble-deck.mjs — print-and-play sheet assembler for the magic-item deck.
//
// Reads the 88 rendered card fronts and per-item backs (in deck sort order),
// lays them out 3x3 (9 cards) per US Letter page at true 2.5"x3.5" @ 300
// dpi, adds light crop-mark cut guides in the margins, and writes a duplex-ready
// PDF. Page order is interleaved front, back, front, back... For Ben's HP 3301dw
// LONG-edge duplex flip the back pages are COLUMN-MIRRORED but NOT rotated. The
// printer flips the back left-to-right while keeping the content upright, so each
// back stays in its own row and only its column flips. Both PDF pages read upright
// on screen and each back prints right-side up behind its own front.
//
//   88 fronts -> 10 front pages (9 cards each, last partial) + 10 back pages = 20 pages.
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
  "artificer-s-arsenal", "handbook-of-lloth", "protector-s-codex", "healer-s-gift", "tomb-warden", "escape-route", "scout-s-tome",
  "spell-scroll-of-fire-bolt", "spell-scroll-of-mind-sliver", "spell-scroll-of-guidance", "spell-scroll-of-cure-wounds", "spell-scroll-of-magic-missile", "spell-scroll-of-shield", "spell-scroll-of-scorching-ray", "spell-scroll-of-lesser-restoration", "spell-scroll-of-see-invisibility", "spell-scroll-of-mass-healing-word", "spell-scroll-of-dispel-magic", "spell-scroll-of-fireball", "scroll-of-protection",
  "enduring-spellbook", "bag-of-holding", "rope-of-climbing", "driftglobe", "feather-token-feather-fall",
  "sending-stones", "lantern-of-revealing", "goggles-of-night", "brooch-of-shielding", "gloves-of-swimming-and-climbing", "boots-of-elvenkind", "cloak-of-protection",
  "ring-of-protection", "ring-of-jumping", "ring-of-swimming", "ring-of-feather-falling", "ring-of-the-steadfast",
  "amulet-of-proof-against-detection-and-location", "netherese-latch-charm", "velvet-maws-patient-charm",
  "cloak-of-elvenkind", "cloak-of-the-manta-ray", "shroud-of-the-failed-apprentice",
  "hat-of-disguise", "eyes-of-minute-seeing", "circlet-of-blasting",
  "boots-of-striding-and-springing", "boots-of-the-winterlands", "grave-dust-softsteps",
  "gloves-of-missile-snaring", "grave-tender-gloves", "xhaltheris-white-handling-gloves",
  "bracers-of-measured-draw", "bracers-of-the-starving-ward", "bracers-of-anchor-grip", "bracers-of-deflection", "periapt-of-vigor",
  "potion-of-healing", "potion-of-healing-greater", "potion-of-resistance", "potion-of-climbing", "potion-of-water-breathing", "potion-of-heroism",
  "longsword-1", "greatsword-1", "rapier-1", "shortbow-1", "dagger-1", "mace-1", "handaxe-1", "spear-1", "warhammer-1", "crossbow-light-1", "goblin-artificers-scoped-musket", "three-headed-snake-whip",
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
//   BACK_DY_MM  - moves the printed back DOWN
// The crop marks are shifted by the same (dx, dy) as the cards on each page, so the cut lines stay on the cards on every page.
const MM = 300 / 25.4;
// Default back nudge is BACK_DY_MM = -2.5 (2.5 mm), tuned to Ben's HP 3301dw.
// A negative page-space dy pushes the printed back DOWN. That cancels the printer's
// 2.5 mm vertical drift so the back lands on the front. Keep BACK_DX at 0. Override
// BACK_DX_MM / BACK_DY_MM for a different printer.
const BACK_DX = Math.round(parseFloat(process.env.BACK_DX_MM || "0") * MM);
const BACK_DY = Math.round(parseFloat(process.env.BACK_DY_MM || "-2.5") * MM);

// Crop ticks live in the margins only, so they never overprint card art.
function cropSvg(dx = 0, dy = 0) {
  const T = 34, sw = 1.6, col = "#444444";
  const xs = []; for (let c = 0; c <= COLS; c++) xs.push(MARGIN_X + c * CARD_W + dx);
  const ys = []; for (let r = 0; r <= ROWS; r++) ys.push(MARGIN_Y + r * CARD_H + dy);
  const lines = [];
  for (const x of xs) {
    lines.push(`<line x1="${x}" y1="${MARGIN_Y - T + dy}" x2="${x}" y2="${MARGIN_Y + dy}" stroke="${col}" stroke-width="${sw}"/>`);
    lines.push(`<line x1="${x}" y1="${MARGIN_Y + GRID_H + dy}" x2="${x}" y2="${MARGIN_Y + GRID_H + T + dy}" stroke="${col}" stroke-width="${sw}"/>`);
  }
  for (const y of ys) {
    lines.push(`<line x1="${MARGIN_X - T + dx}" y1="${y}" x2="${MARGIN_X + dx}" y2="${y}" stroke="${col}" stroke-width="${sw}"/>`);
    lines.push(`<line x1="${MARGIN_X + GRID_W + dx}" y1="${y}" x2="${MARGIN_X + GRID_W + T + dx}" y2="${y}" stroke="${col}" stroke-width="${sw}"/>`);
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
  comps.push({ input: Buffer.from(cropSvg(dx, dy)), left: 0, top: 0 });
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
  // LONG-edge duplex (HP 3301dw): the printer flips the back left-to-right, so column-mirror the
  // back positions (r*COLS + (COLS-1-c)) and do NOT rotate the backs. Each back stays in its own
  // row and only its column flips, so the correct back lands right-side up behind its own front.
  // Both PDF pages read upright on screen.
  const backSlots = Array(PER_PAGE).fill(null);
  for (let i = 0; i < pageBacks.length; i++) {
    const r = Math.floor(i / COLS), c = i % COLS;
    backSlots[r * COLS + (COLS - 1 - c)] = pageBacks[i];
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
