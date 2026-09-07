// laser-tokens.mjs — laser-cutter SVG generator for the PRIZE tokens (pass 2).
// Turns each prize token into a 3 inch (76.2 mm) circular SVG for a laser that
// CUTS the outer circle and ETCHES the design into a wood round.
//
// PASS 3 REDESIGN (fully vector, transparent background, thematic icons):
//   - The prize ART is a clean hand-built line-art ICON per prize (dice, book,
//     pouch, dragon eye, journal, pocket watch, gift box, sword, beholder, etc.),
//     drawn as black vector strokes in a 100x100 box and scaled into the token.
//     The soft AI paintings did not vectorize into recognizable line art, so a
//     bold, intentional icon reads far better etched on bare wood and is truly
//     transparent (no background block). NO <image>/base64 raster.
//   - The NAME and DESCRIPTION are rendered to vector <path> data with
//     opentype.js from real font files, so they are font-independent and etch
//     cleanly. Name uses a fluid calligraphic face; description an elegant
//     serif. Both filled black.
//
// Output: items/tokens/laser/<slug>.svg, plus -2.svg .. -N.svg for copies>1,
// matching the print-deck copy naming. One SVG per physical prize copy.
// Re-runnable: the laser/ folder is wiped and rewritten each run.
//
// Encoding for LightBurn:
//   CUT  = the 76.2 mm circle, fill:none stroke:#FF0000 (~0.1 mm)  -> cut layer
//   ETCH = traced art paths + name paths + description paths, fill:#000000
// Price and USD value are intentionally omitted from these tokens.
//
// Sample: ONLY=beholder-potato-head-figure node laser-tokens.mjs
// Threshold override: THRESH=200 ONLY=<slug> node laser-tokens.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import opentype from "opentype.js";
import potracePkg from "potrace";

const { trace: potraceTrace } = potracePkg;

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const tokensDir = path.resolve(toolsDir, "..");        // items/tokens
const imagesDir = path.join(tokensDir, "images");
const outDir = path.join(tokensDir, "laser");
const fontsDir = path.join(process.env.SystemRoot || "C:\\Windows", "Fonts");

const FILES = [
  "4pcs-fantasy-sword-bookmarks", "teeturtle-reversible-plushie-mystery-box", "stupid-dnd-jokes",
  "hiifeuer-medieval-faux-leather-pouch", "haxtec-dragon-eye-dice-bag", "longlongjin-dnd-dragon-journal-with-pen",
  "the-book-of-holding", "duck-dnd-resin-dice-set", "game-masters-book-of-astonishing-random-tables",
  "banloga-metal-dice-set-with-pocket-watch-case", "young-adventurers-collection-box-set-1",
  "beholder-potato-head-figure", "sweien-hollow-metal-dnd-dice-set", "wooden-dnd-dice-tray-journal-box",
  "dnd-2024-core-rulebook-set-gm-screen",
];

// --- token geometry (all millimetres) ---
const D = 76.2;                 // 3 inch diameter
const R = D / 2;                // 38.1
const CX = R, CY = R;           // centre
const SAFE = R - 3.5;           // ~3.5 mm inside the rim for etched content (34.6)
const CUT_STROKE = 0.1;         // thin red cut line

// --- tracing config ---
const TRACE_PX = 1000;          // preprocess resolution before potrace
const DEFAULT_THRESH = 32;      // edge-strength cutoff (0-255); lower keeps more line
// Per-slug threshold overrides for art that needs a tighter/looser cut.
const THRESH_OVERRIDES = {};

const clean = (s) => s.replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "").replace(/\s+/g, " ").trim();

// ---------- fonts ----------
// Fluid/calligraphic face for the NAME, elegant serif for the DESCRIPTION.
function loadFirstFont(candidates, label) {
  for (const f of candidates) {
    const p = path.join(fontsDir, f);
    if (!fs.existsSync(p)) continue;
    try {
      const buf = fs.readFileSync(p);
      const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
      return { font, file: f };
    } catch (e) {
      // try next candidate
    }
  }
  throw new Error(`No usable ${label} font found in ${fontsDir} (tried ${candidates.join(", ")})`);
}

const NAME_FONT = loadFirstFont(["Gabriola.ttf", "segoesc.ttf", "segoescb.ttf", "palab.ttf"], "name");
const DESC_FONT = loadFirstFont(["constan.ttf", "georgia.ttf", "cambria.ttf", "palatino.ttf"], "description");

// ---------- text helpers (opentype -> vector path data in mm) ----------
function advance(font, text, size) { return font.getAdvanceWidth(text, size); }

function wrapByWidth(font, text, maxW, size) {
  const words = text.split(/\s+/).filter(Boolean);
  const out = [];
  let cur = "";
  for (const w of words) {
    const t = cur ? cur + " " + w : w;
    if (advance(font, t, size) > maxW && cur) { out.push(cur); cur = w; }
    else cur = t;
  }
  if (cur) out.push(cur);
  return out;
}

// Fit text into <= maxLines within maxW, shrinking the font from max to min.
function fitLines(font, text, maxW, maxSize, minSize, maxLines) {
  for (let s = maxSize; s >= minSize; s -= 0.25) {
    const lines = wrapByWidth(font, text, maxW, s);
    if (lines.length <= maxLines && lines.every((l) => advance(font, l, s) <= maxW)) {
      return { lines, size: s, trimmed: false };
    }
  }
  // at min size: clamp line count and ellipsize the last line if needed
  const s = minSize;
  let lines = wrapByWidth(font, text, maxW, s);
  let trimmed = false;
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    let last = lines[maxLines - 1];
    while (last.length > 1 && advance(font, last + "\u2026", s) > maxW) last = last.replace(/\s*\S+$/, "").replace(/[.,;:]$/, "");
    lines[maxLines - 1] = last.replace(/[.,;:\s]+$/, "") + "\u2026";
    trimmed = true;
  }
  return { lines, size: s, trimmed };
}

// One centered line -> path data at a given baseline y (mm).
function lineToPath(font, text, baselineY, size) {
  const w = advance(font, text, size);
  const x = CX - w / 2;
  return font.getPath(text, x, baselineY, size).toPathData(3);
}

// Half-chord available at vertical offset dy from centre, inside the safe radius.
function chordAt(dy) {
  const inside = Math.max(0, SAFE * SAFE - dy * dy);
  return 2 * Math.sqrt(inside);
}

// ---------- art tracing (sharp preprocess -> potrace -> vector path) ----------
function avgCornerLuma(data, info) {
  const { width, height, channels } = info;
  const box = Math.max(4, Math.round(Math.min(width, height) * 0.06));
  let sum = 0, n = 0;
  const px = (x, y) => data[(y * width + x) * channels]; // grayscale: first channel
  for (let y = 0; y < box; y++) {
    for (let x = 0; x < box; x++) {
      sum += px(x, y) + px(width - 1 - x, y) + px(x, height - 1 - y) + px(width - 1 - x, height - 1 - y);
      n += 4;
    }
  }
  return sum / n;
}

function tracePromise(buffer, opts) {
  return new Promise((res, rej) => potraceTrace(buffer, opts, (err, svg) => (err ? rej(err) : res(svg))));
}

// Returns { d, w, h } — combined path data and the traced bitmap dimensions.
async function traceArt(imageAbs, thresh) {
  const base = sharp(imageAbs)
    .resize(TRACE_PX, TRACE_PX, { fit: "inside", withoutEnlargement: false })
    .flatten({ background: "#ffffff" })
    .grayscale()
    .normalize();

  const { data, info } = await base.clone().raw().toBuffer({ resolveWithObject: true });
  const corner = avgCornerLuma(data, info);

  let proc = base;
  if (corner < 128) proc = proc.negate();  // keep the background on the light side

  // These prize images are full-frame, low-contrast paintings, so a luma
  // threshold erases the subject. A Laplacian edge pass keeps the outlines
  // (subject silhouette and interior features), which trace into clean line art
  // that etches organically on bare wood, like a woodcut.
  const png = await proc
    .median(3)
    .blur(0.7)
    .convolve({ width: 3, height: 3, kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1] })
    .normalize()
    .linear(1.6, 0)
    .threshold(thresh)   // bright edges -> white, flat areas -> black
    .negate()            // flip: edges become black lines on white for potrace
    .png()
    .toBuffer();

  const svg = await tracePromise(png, {
    threshold: 128,
    blackOnWhite: true,
    turdSize: 4,           // keep fine line detail
    alphaMax: 1,
    optCurve: true,
    optTolerance: 0.6,
    turnPolicy: "minority",
    color: "#000000",
    background: "transparent",
  });

  const wM = svg.match(/<svg[^>]*\bwidth="([\d.]+)"/);
  const hM = svg.match(/<svg[^>]*\bheight="([\d.]+)"/);
  const ds = [...svg.matchAll(/\sd="([^"]+)"/g)].map((m) => m[1]);
  return {
    d: ds.join(" "),
    w: wM ? parseFloat(wM[1]) : info.width,
    h: hM ? parseFloat(hM[1]) : info.height,
  };
}

// ---------- ornament ----------
// A small centered diamond flanked by short hairlines, as black etch.
function ornament(cy) {
  const s = 1.1;                     // diamond half-size
  const gap = 2.2, lineW = 6;
  const dia = `M ${CX} ${(cy - s).toFixed(2)} L ${(CX + s).toFixed(2)} ${cy.toFixed(2)} L ${CX} ${(cy + s).toFixed(2)} L ${(CX - s).toFixed(2)} ${cy.toFixed(2)} Z`;
  const l1 = `<line x1="${(CX - s - gap - lineW).toFixed(2)}" y1="${cy.toFixed(2)}" x2="${(CX - s - gap).toFixed(2)}" y2="${cy.toFixed(2)}" stroke="#000000" stroke-width="0.25"/>`;
  const l2 = `<line x1="${(CX + s + gap).toFixed(2)}" y1="${cy.toFixed(2)}" x2="${(CX + s + gap + lineW).toFixed(2)}" y2="${cy.toFixed(2)}" stroke="#000000" stroke-width="0.25"/>`;
  return `<path d="${dia}" fill="#000000"/>${l1}${l2}`;
}

// ---------- token parse ----------
function parse(name) {
  const md = fs.readFileSync(path.join(tokensDir, name + ".md"), "utf8");
  const fm = {};
  const fmM = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fmM) for (const line of fmM[1].split(/\r?\n/)) { const m = line.match(/^(\w+):\s*(.*)$/); if (m) fm[m[1]] = m[2].replace(/^"|"$/g, "").trim(); }
  const body = md.slice(fmM ? fmM[0].length : 0);
  const descM = body.match(/^-\s*\*\*Description:\*\*\s*(.+)$/m);
  const desc = descM ? clean(descM[1]) : "";
  const imgAbs = path.join(imagesDir, name + ".png");
  return {
    title: fm.title || name,
    copies: Math.max(1, parseInt(fm.copies || "1", 10) || 1),
    desc,
    imageAbs: fs.existsSync(imgAbs) ? imgAbs : null,
  };
}

// ---------- thematic line-art icons (drawn in a 0..100 box, black strokes) ----------
const ICONS = {
  d20: `<polygon points="50,10 86,31 86,69 50,90 14,69 14,31" fill="none" stroke="#000" stroke-width="2.6" stroke-linejoin="round"/><polygon points="30,38 70,38 50,80" fill="none" stroke="#000" stroke-width="2.4" stroke-linejoin="round"/><path d="M50 10 L30 38 M50 10 L70 38 M14 31 L30 38 M86 31 L70 38 M14 69 L50 80 M86 69 L50 80 M50 90 L50 80" stroke="#000" stroke-width="2.1" fill="none"/>`,
  book: `<path d="M50 26 C34 18 20 20 12 24 L12 78 C20 74 34 72 50 80 C66 72 80 74 88 78 L88 24 C80 20 66 18 50 26 Z" fill="none" stroke="#000" stroke-width="2.6" stroke-linejoin="round"/><path d="M50 26 L50 80" stroke="#000" stroke-width="2.3" fill="none"/><path d="M20 35 C30 32 40 32 46 36 M20 46 C30 43 40 43 46 47 M54 36 C60 32 70 32 80 35 M54 47 C60 43 70 43 80 46" stroke="#000" stroke-width="1.7" fill="none"/>`,
  books: `<rect x="17" y="60" width="66" height="16" rx="2" fill="none" stroke="#000" stroke-width="2.4"/><rect x="22" y="44" width="58" height="16" rx="2" fill="none" stroke="#000" stroke-width="2.4"/><rect x="15" y="28" width="62" height="16" rx="2" fill="none" stroke="#000" stroke-width="2.4"/><path d="M27 60 L27 76 M31 44 L31 60 M23 28 L23 44" stroke="#000" stroke-width="1.6" fill="none"/>`,
  pouch: `<path d="M30 42 C25 42 23 46 27 49 C13 58 14 80 33 87 C45 92 55 92 67 87 C86 80 87 58 73 49 C77 46 75 42 70 42 Z" fill="none" stroke="#000" stroke-width="2.6" stroke-linejoin="round"/><path d="M31 44 C42 50 58 50 69 44" fill="none" stroke="#000" stroke-width="2"/><path d="M37 42 C37 31 63 31 63 42" fill="none" stroke="#000" stroke-width="2"/><path d="M43 35 L41 25 M57 35 L59 25" stroke="#000" stroke-width="1.8" fill="none"/>`,
  eye: `<path d="M12 52 C34 28 66 28 88 52 C66 76 34 76 12 52 Z" fill="none" stroke="#000" stroke-width="2.6" stroke-linejoin="round"/><path d="M50 36 C58 44 58 60 50 68 C42 60 42 44 50 36 Z" fill="#000"/><path d="M26 42 C31 36 39 34 45 37 M74 42 C69 36 61 34 55 37" fill="none" stroke="#000" stroke-width="1.6"/>`,
  journal: `<rect x="26" y="18" width="40" height="60" rx="3" fill="none" stroke="#000" stroke-width="2.6"/><path d="M34 18 L34 78" stroke="#000" stroke-width="1.9" fill="none"/><path d="M42 33 L60 33 M42 43 L60 43 M42 53 L54 53" stroke="#000" stroke-width="1.6" fill="none"/><path d="M55 84 L84 32" stroke="#000" stroke-width="3" stroke-linecap="round"/><path d="M52 86 L57 82 L60 88 Z" fill="#000"/>`,
  watch: `<circle cx="50" cy="57" r="29" fill="none" stroke="#000" stroke-width="2.6"/><circle cx="50" cy="57" r="23" fill="none" stroke="#000" stroke-width="1.4"/><rect x="44" y="17" width="12" height="8" rx="2" fill="none" stroke="#000" stroke-width="2"/><circle cx="50" cy="13" r="5" fill="none" stroke="#000" stroke-width="2"/><path d="M50 57 L50 42 M50 57 L61 62" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="50" cy="57" r="2" fill="#000"/>`,
  box: `<rect x="22" y="47" width="56" height="37" fill="none" stroke="#000" stroke-width="2.6"/><rect x="16" y="37" width="68" height="12" fill="none" stroke="#000" stroke-width="2.6"/><path d="M50 37 L50 84" stroke="#000" stroke-width="2.4" fill="none"/><path d="M50 37 C40 22 26 30 35 37 Z" fill="none" stroke="#000" stroke-width="2"/><path d="M50 37 C60 22 74 30 65 37 Z" fill="none" stroke="#000" stroke-width="2"/>`,
  sword: `<path d="M50 8 L55 56 L50 63 L45 56 Z" fill="none" stroke="#000" stroke-width="2.4" stroke-linejoin="round"/><path d="M30 63 L70 63" stroke="#000" stroke-width="3.2" stroke-linecap="round"/><rect x="46" y="64" width="8" height="17" fill="none" stroke="#000" stroke-width="2.2"/><circle cx="50" cy="86" r="5" fill="none" stroke="#000" stroke-width="2.2"/>`,
  beholder: `<circle cx="50" cy="60" r="20" fill="none" stroke="#000" stroke-width="2.6"/><circle cx="50" cy="60" r="9" fill="none" stroke="#000" stroke-width="2"/><circle cx="50" cy="60" r="3.4" fill="#000"/><path d="M40 68 Q50 76 60 68" fill="none" stroke="#000" stroke-width="2"/><path d="M37 45 L29 35 M46 41 L43 28 M54 41 L57 28 M63 45 L71 35 M69 57 L81 54" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="27" cy="32" r="4.5" fill="none" stroke="#000" stroke-width="1.8"/><circle cx="42" cy="24" r="4.5" fill="none" stroke="#000" stroke-width="1.8"/><circle cx="58" cy="24" r="4.5" fill="none" stroke="#000" stroke-width="1.8"/><circle cx="73" cy="32" r="4.5" fill="none" stroke="#000" stroke-width="1.8"/><circle cx="83" cy="52" r="4.5" fill="none" stroke="#000" stroke-width="1.8"/>`,
};

const ICON_FOR = {
  "4pcs-fantasy-sword-bookmarks": "sword",
  "teeturtle-reversible-plushie-mystery-box": "box",
  "stupid-dnd-jokes": "book",
  "hiifeuer-medieval-faux-leather-pouch": "pouch",
  "haxtec-dragon-eye-dice-bag": "eye",
  "longlongjin-dnd-dragon-journal-with-pen": "journal",
  "the-book-of-holding": "book",
  "duck-dnd-resin-dice-set": "d20",
  "game-masters-book-of-astonishing-random-tables": "book",
  "banloga-metal-dice-set-with-pocket-watch-case": "watch",
  "young-adventurers-collection-box-set-1": "books",
  "beholder-potato-head-figure": "beholder",
  "sweien-hollow-metal-dnd-dice-set": "d20",
  "wooden-dnd-dice-tray-journal-box": "d20",
  "dnd-2024-core-rulebook-set-gm-screen": "books",
};
const iconFor = (slug) => ICONS[ICON_FOR[slug]] || ICONS.d20;

// ---------- svg build ----------
function buildSvg({ title, desc, icon }) {
  const TOP = R - SAFE;                 // 3.5
  const BOT = R + SAFE;                 // 72.7

  // NAME across the top (fluid calligraphic, up to 3 lines, auto-shrink)
  const nameMaxW = chordAt(CY - (TOP + 7));
  const nameFit = fitLines(NAME_FONT.font, title, nameMaxW, 7.5, 3.6, 3);
  const nameLH = nameFit.size * 1.06;
  const nameBase0 = TOP + nameFit.size * 0.92;
  let namePaths = "";
  let ny = nameBase0;
  for (const l of nameFit.lines) { namePaths += `<path d="${lineToPath(NAME_FONT.font, l, ny, nameFit.size)}" fill="#000000"/>`; ny += nameLH; }
  const nameBottom = nameBase0 + (nameFit.lines.length - 1) * nameLH + nameFit.size * 0.28;

  // DESCRIPTION across the bottom (elegant serif, up to 4 lines, trim only if forced)
  const descMaxW = chordAt((BOT - 6) - CY);
  const descFit = desc ? fitLines(DESC_FONT.font, desc, descMaxW, 3.7, 2.3, 4) : { lines: [], size: 3, trimmed: false };
  const descLH = descFit.size * 1.28;
  const descBaseLast = BOT - 4.5;
  const descBase0 = descBaseLast - (descFit.lines.length - 1) * descLH;
  const descTop = descBase0 - descFit.size;
  let descPaths = "";
  let dyv = descBase0;
  for (const l of descFit.lines) { descPaths += `<path d="${lineToPath(DESC_FONT.font, l, dyv, descFit.size)}" fill="#000000"/>`; dyv += descLH; }

  // small ornaments between name/art and art/desc
  const topOrnY = nameBottom + 1.6;
  const botOrnY = descFit.lines.length ? descTop - 1.6 : BOT - 4;
  const ornaments = ornament(topOrnY) + (descFit.lines.length ? ornament(botOrnY) : "");

  // ART: the thematic line-art icon, scaled into the space between the ornaments.
  const artTop = topOrnY + 2.2;
  const artBot = (descFit.lines.length ? botOrnY - 2.2 : BOT - 6);
  const artH = Math.max(6, artBot - artTop);
  const artEdgeDy = Math.max(Math.abs(artTop - CY), Math.abs(artBot - CY));
  const artW = Math.max(6, chordAt(artEdgeDy) - 2);

  let artPaths = "";
  if (icon) {
    const BOX = 100;
    const scale = Math.min(artW / BOX, artH / BOX);
    const pw = BOX * scale, ph = BOX * scale;
    const tx = CX - pw / 2;
    const ty = artTop + (artH - ph) / 2;
    artPaths = `<g transform="translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${scale.toFixed(5)})" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round">${icon}</g>`;
  }

  // CUT circle: red stroke, no fill (LightBurn cut layer)
  const cut = `<circle cx="${CX}" cy="${CY}" r="${(R - CUT_STROKE / 2).toFixed(4)}" fill="none" stroke="#FF0000" stroke-width="${CUT_STROKE}"/>`;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${D}mm" height="${D}mm" viewBox="0 0 ${D} ${D}">` +
    `<g id="etch" fill="#000000">` +
    artPaths +
    namePaths +
    descPaths +
    ornaments +
    `</g>` +
    `<g id="cut">${cut}</g>` +
    `</svg>\n`;

  return { svg, trimmed: descFit.trimmed };
}

function nameFor(slug, i) { return i === 1 ? `${slug}.svg` : `${slug}-${i}.svg`; }

// wipe + recreate output dir so runs are idempotent
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const only = (process.env.ONLY || "").split(",").map((s) => s.trim()).filter(Boolean);
const envThresh = process.env.THRESH ? parseInt(process.env.THRESH, 10) : null;

let tokens = 0, files = 0;
const trimmedList = [];

for (const name of FILES) {
  if (only.length && !only.includes(name)) continue;
  if (!fs.existsSync(path.join(tokensDir, name + ".md"))) { console.log("MISSING md:", name); continue; }
  const d = parse(name);
  const icon = iconFor(name);
  const { svg, trimmed } = buildSvg({ title: d.title, desc: d.desc, icon });
  if (trimmed) trimmedList.push(name);

  for (let i = 1; i <= d.copies; i++) {
    fs.writeFileSync(path.join(outDir, nameFor(name, i)), svg);
    files++;
  }
  tokens++;
  console.log("laser", name, `[${ICON_FOR[name] || "d20"}]`, d.copies > 1 ? `| x${d.copies}` : "", trimmed ? "| desc trimmed" : "");
}

console.log(`\nfonts: name=${NAME_FONT.file}  desc=${DESC_FONT.file}`);
console.log(`done: ${tokens} unique tokens -> ${files} SVG files in items/tokens/laser/`);
if (trimmedList.length) console.log("trimmed descriptions:", trimmedList.join(", "));
