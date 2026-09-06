// prize-assemble.mjs — print-and-play sheet assembler for the PRIZE deck.
// Identical print setup to the magic-item deck: 3x3 US Letter, crop marks,
// SHORT-edge duplex (Ben's HP 3201dw) so back pages are ROW-MIRRORED and each
// back is rotated 180 degrees, plus the measured 1.75 mm back-down registration
// nudge. 15 cards -> 2 front pages (9,6) + 2 back pages = 4 pages.
//
// Output: items/tokens/deck/prize-deck-printandplay.pdf
// Run:  node prize-render.mjs   then   node prize-assemble.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const deckDir = path.resolve(toolsDir, "..", "deck");
const frontsDir = path.join(deckDir, "build", "fronts");
const backsDir = path.join(deckDir, "build", "backs");
const outPath = path.join(deckDir, "prize-deck-printandplay.pdf");

const ORDER = [
  "4pcs-fantasy-sword-bookmarks", "teeturtle-reversible-plushie-mystery-box", "stupid-dnd-jokes",
  "hiifeuer-medieval-faux-leather-pouch", "haxtec-dragon-eye-dice-bag", "longlongjin-dnd-dragon-journal-with-pen",
  "the-book-of-holding", "duck-dnd-resin-dice-set", "game-masters-book-of-astonishing-random-tables",
  "banloga-metal-dice-set-with-pocket-watch-case", "young-adventurers-collection-box-set-1",
  "beholder-potato-head-figure", "sweien-hollow-metal-dnd-dice-set", "wooden-dnd-dice-tray-journal-box",
  "dnd-2024-core-rulebook-set-gm-screen",
].map((n) => n + ".png");

const DPI = 300;
const PW = 8.5 * DPI, PH = 11 * DPI;
const CARD_W = 2.5 * DPI, CARD_H = 3.5 * DPI;
const COLS = 3, ROWS = 3, PER_PAGE = COLS * ROWS;
const GRID_W = COLS * CARD_W, GRID_H = ROWS * CARD_H;
const MARGIN_X = (PW - GRID_W) / 2;
const MARGIN_Y = (PH - GRID_H) / 2;
const QUALITY = 88;

const MM = 300 / 25.4;
const BACK_DX = Math.round(parseFloat(process.env.BACK_DX_MM || "0") * MM);
const BACK_DY = Math.round(parseFloat(process.env.BACK_DY_MM || "1.75") * MM);

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
    .composite(comps).jpeg({ quality: QUALITY, chromaSubsampling: "4:2:0" }).toBuffer();
}

const missF = ORDER.filter((n) => !fs.existsSync(path.join(frontsDir, n)));
const missB = ORDER.filter((n) => !fs.existsSync(path.join(backsDir, n)));
if (missF.length || missB.length) {
  if (missF.length) console.error(`Missing fronts: ${missF.join(", ")}`);
  if (missB.length) console.error(`Missing backs: ${missB.join(", ")}`);
  console.error("Run  node prize-render.mjs  first.");
  process.exit(1);
}
const fronts = ORDER.map((n) => fs.readFileSync(path.join(frontsDir, n)));
const backs = ORDER.map((n) => fs.readFileSync(path.join(backsDir, n)));

const doc = await PDFDocument.create();
const PT_W = 8.5 * 72, PT_H = 11 * 72;
const previewDir = path.join(deckDir, "build", "preview");
fs.mkdirSync(previewDir, { recursive: true });

for (let start = 0; start < ORDER.length; start += PER_PAGE) {
  const pageFronts = fronts.slice(start, start + PER_PAGE);
  const pageBacks = backs.slice(start, start + PER_PAGE);
  const frontSheet = await buildSheet(pageFronts);
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
console.log(`Wrote ${outPath} - ${doc.getPageCount()} pages, ${ORDER.length} cards, ${(bytes.length / 1048576).toFixed(2)} MB`);
