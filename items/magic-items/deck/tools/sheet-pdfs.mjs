// sheet-pdfs.mjs — export a deck as 9-card print sheets, one 2-page PDF per
// sheet (page 1 = 9 fronts, page 2 = 9 backs), collected in a common folder.
//
// 3x3 US Letter, crop marks, LONG-edge duplex for Ben's HP 3301dw. The back
// page is column-mirrored but NOT rotated, so both PDF pages read upright on screen.
// Ben's HP 3301dw flips the back left-to-right while keeping the content upright,
// so no 180 rotation is needed. Each back stays in its own row and only its column
// flips, so the correct back prints right-side up behind its own front. The default
// nudge is BACK_DY_MM = -2.5, which pushes the printed back down 2.5 mm to cancel
// the printer's vertical drift. Cards are taken in sorted (alphabetical) filename order.
//
// Defaults to this deck's build/ dirs and writes to <deck>/sheets/.
// Override with FRONTS_DIR / BACKS_DIR / OUT_DIR.
// Run:  node sheet-pdfs.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const deckDir = path.resolve(toolsDir, "..");
const frontsDir = process.env.FRONTS_DIR || path.join(deckDir, "build", "fronts");
const backsDir = process.env.BACKS_DIR || path.join(deckDir, "build", "backs");
const outDir = process.env.OUT_DIR || path.join(deckDir, "sheets");
fs.mkdirSync(outDir, { recursive: true });

const DPI = 300;
const PW = 8.5 * DPI, PH = 11 * DPI;
const CARD_W = 2.5 * DPI, CARD_H = 3.5 * DPI;
const COLS = 3, ROWS = 3, PER_PAGE = COLS * ROWS;
const GRID_W = COLS * CARD_W, GRID_H = ROWS * CARD_H;
const MARGIN_X = (PW - GRID_W) / 2, MARGIN_Y = (PH - GRID_H) / 2;
const QUALITY = 88;
const MM = 300 / 25.4;
// Default back nudge is BACK_DY_MM = -2.5 (2.5 mm), tuned to Ben's HP 3301dw.
// A negative page-space dy pushes the printed back down 2.5 mm, which cancels
// the printer's vertical drift so the back lands on the front. Keep BACK_DX at 0.
// Set BACK_DX_MM / BACK_DY_MM in mm to retune for a different printer.
// The crop marks are shifted by the same (dx, dy) as the cards on each page, so the cut lines stay on the cards on every page.
const BACK_DX = Math.round(parseFloat(process.env.BACK_DX_MM || "0") * MM);
const BACK_DY = Math.round(parseFloat(process.env.BACK_DY_MM || "-2.5") * MM);

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
    .composite(comps).jpeg({ quality: QUALITY, chromaSubsampling: "4:2:0" }).toBuffer();
}

const names = fs.readdirSync(frontsDir).filter((f) => f.endsWith(".png")).map((f) => f.replace(/\.png$/, "")).sort();
const PT_W = 8.5 * 72, PT_H = 11 * 72;
let sheet = 0, total = 0;
for (let start = 0; start < names.length; start += PER_PAGE) {
  sheet++;
  const grp = names.slice(start, start + PER_PAGE);
  const pageFronts = grp.map((n) => fs.readFileSync(path.join(frontsDir, n + ".png")));
  const pageBacks = grp.map((n) => fs.readFileSync(path.join(backsDir, n + ".png")));
  const frontSheet = await buildSheet(pageFronts);
  // LONG-edge duplex (HP 3301dw): the printer flips the back left-to-right, so
  // column-mirror the back positions (r*COLS + (COLS-1-c)) and do NOT rotate the
  // backs. Each back stays in its own row and only its column flips, so the correct
  // back lands right-side up behind its own front. Both PDF pages read upright on screen.
  const backSlots = Array(PER_PAGE).fill(null);
  for (let i = 0; i < pageBacks.length; i++) {
    const r = Math.floor(i / COLS), c = i % COLS;
    backSlots[r * COLS + (COLS - 1 - c)] = pageBacks[i];
  }
  const backSheet = await buildSheet(backSlots, BACK_DX, BACK_DY);
  const doc = await PDFDocument.create();
  const fImg = await doc.embedJpg(frontSheet);
  doc.addPage([PT_W, PT_H]).drawImage(fImg, { x: 0, y: 0, width: PT_W, height: PT_H });
  const bImg = await doc.embedJpg(backSheet);
  doc.addPage([PT_W, PT_H]).drawImage(bImg, { x: 0, y: 0, width: PT_W, height: PT_H });
  const bytes = await doc.save();
  const name = `sheet-${String(sheet).padStart(2, "0")}.pdf`;
  fs.writeFileSync(path.join(outDir, name), bytes);
  total += bytes.length;
}
console.log(`wrote ${sheet} sheet PDFs (${names.length} cards) to ${outDir} (${(total / 1048576).toFixed(1)} MB)`);
