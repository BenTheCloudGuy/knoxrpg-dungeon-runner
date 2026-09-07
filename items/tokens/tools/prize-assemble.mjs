// prize-assemble.mjs — print-and-play sheet assembler for the PRIZE deck.
// Identical print setup to the magic-item deck: 3x3 US Letter, crop marks,
// LONG-edge duplex for Ben's HP 3301dw, so back pages are COLUMN-MIRRORED but NOT
// rotated. The printer flips the back left-to-right while keeping the content
// upright, so each back stays in its own row and only its column flips. Both PDF
// pages read upright on screen and each back prints right-side up behind its own
// front. The default nudge is BACK_DY_MM = -2.5, which pushes the printed back
// down 2.5 mm to cancel the printer's vertical drift.
// Card count is copy-driven: each token is repeated by its frontmatter `copies`
// value (default 1), matching the extra <name>-N.png files prize-render.mjs writes,
// so page pairs scale with the deck (e.g. 20 cards -> 3 front + 3 back = 6 pages).
//
// Output: items/tokens/deck/prize-deck-printandplay.pdf
// Run:  node prize-render.mjs   then   node prize-assemble.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const tokensDir = path.resolve(toolsDir, "..");
const deckDir = path.resolve(toolsDir, "..", "deck");
const frontsDir = path.join(deckDir, "build", "fronts");
const backsDir = path.join(deckDir, "build", "backs");
const outPath = path.join(deckDir, "prize-deck-printandplay.pdf");

// Read a token's `copies` frontmatter value (default 1).
function copiesOf(name) {
  const md = fs.readFileSync(path.join(tokensDir, name + ".md"), "utf8");
  const m = md.match(/^copies:\s*(\d+)/m);
  return m ? Math.max(1, parseInt(m[1], 10) || 1) : 1;
}

const BASE = [
  "4pcs-fantasy-sword-bookmarks", "teeturtle-reversible-plushie-mystery-box", "stupid-dnd-jokes",
  "hiifeuer-medieval-faux-leather-pouch", "haxtec-dragon-eye-dice-bag", "longlongjin-dnd-dragon-journal-with-pen",
  "the-book-of-holding", "duck-dnd-resin-dice-set", "game-masters-book-of-astonishing-random-tables",
  "banloga-metal-dice-set-with-pocket-watch-case", "young-adventurers-collection-box-set-1",
  "beholder-potato-head-figure", "sweien-hollow-metal-dnd-dice-set", "wooden-dnd-dice-tray-journal-box",
  "dnd-2024-core-rulebook-set-gm-screen",
];

// Expand each base token into one entry per physical copy, matching the extra
// <name>-N.png files prize-render.mjs writes.
const ORDER = BASE.flatMap((n) => {
  const c = copiesOf(n);
  const names = [n];
  for (let i = 2; i <= c; i++) names.push(`${n}-${i}`);
  return names;
}).map((n) => n + ".png");

const DPI = 300;
const PW = 8.5 * DPI, PH = 11 * DPI;
const CARD_W = 2.5 * DPI, CARD_H = 3.5 * DPI;
const COLS = 3, ROWS = 3, PER_PAGE = COLS * ROWS;
const GRID_W = COLS * CARD_W, GRID_H = ROWS * CARD_H;
const MARGIN_X = (PW - GRID_W) / 2;
const MARGIN_Y = (PH - GRID_H) / 2;
const QUALITY = 88;

const MM = 300 / 25.4;
// Default back nudge is BACK_DY_MM = -2.5 (2.5 mm), tuned to Ben's HP 3301dw.
// A negative page-space dy pushes the printed back DOWN. That cancels the printer's
// 2.5 mm vertical drift so the back lands on the front. Keep BACK_DX at 0. Set
// BACK_DX_MM / BACK_DY_MM in mm to retune for a different printer.
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
console.log(`Wrote ${outPath} - ${doc.getPageCount()} pages, ${ORDER.length} cards, ${(bytes.length / 1048576).toFixed(2)} MB`);
