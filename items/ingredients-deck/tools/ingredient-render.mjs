// ingredient-render.mjs — duplex-ready ingredient card renderer.
//
// Reads the 20 ingredient sources under items/ingredients/*.md. Fronts stay
// text-only identification clues (Appearance, Simple Test, Handling, Found) —
// no recipe or effect text ever appears on a player-facing side. Backs use
// real card art from items/ingredients/images/<name>.png, feathered into the
// parchment the same way items/equipment-deck/tools/equipment-render.mjs does
// for mundane gear. If an ingredient has no art yet, its back falls back to
// the original vector ingredient seal so the deck still builds.
//
// Output:
//   items/ingredients-deck/build/{fronts,backs}/<name>.png  (working card faces)
//   items/ingredients-deck/ingredient-card-order.json        (pairing/order manifest)
//   items/decks/ingredients/sheet-NN.pdf                      (final print sheets,
//     one 2-page PDF per sheet: page 1 = 9 fronts, page 2 = 9 backs, matching the
//     items/decks/equipment and items/decks/magic-items sheet-NN.pdf convention)
//
// Run:  node items/ingredients-deck/tools/ingredient-render.mjs

import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const deckDir = path.resolve(here, "..");           // items/ingredients-deck
const itemsDir = path.resolve(deckDir, "..");       // items
const sourceDir = path.join(itemsDir, "ingredients");
const imagesDir = path.join(sourceDir, "images");
const buildDir = path.join(deckDir, "build");
const frontsDir = path.join(buildDir, "fronts");
const backsDir = path.join(buildDir, "backs");
const sheetsOutDir = path.join(itemsDir, "decks", "ingredients");

// Reuse the shared sharp/pdf-lib already installed for the magic-items deck
// tooling instead of installing a second copy of native sharp binaries.
const sharedTools = path.resolve(itemsDir, "magic-items", "deck", "tools");
const requireShared = createRequire(path.join(sharedTools, "package.json"));
const sharp = requireShared("sharp");
const { PDFDocument } = requireShared("pdf-lib");

const W = 750, H = 1050;
const PW = 2550, PH = 3300;
const CARD_W = 750, CARD_H = 1050;
const COLS = 3, ROWS = 3, PER_PAGE = 9;
const MARGIN_X = 150, MARGIN_Y = 75;
const MM = 300 / 25.4;
const BACK_DX = Math.round(parseFloat(process.env.BACK_DX_MM || "0") * MM);
const BACK_DY = Math.round(parseFloat(process.env.BACK_DY_MM || "-2.5") * MM);

const xml = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clean = (s) => String(s || "").replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "").replace(/\s+/g, " ").trim();
const wrap = (text, maxChars) => {
  const lines = [];
  let line = "";
  for (const word of clean(text).split(" ")) {
    if (line && (line + " " + word).length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
};

function parse(file) {
  const md = fs.readFileSync(file, "utf8");
  const fm = {};
  const fmMatch = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fmMatch) {
    for (const line of fmMatch[1].split(/\r?\n/)) {
      const match = line.match(/^(\w+):\s*(.*)$/);
      if (match) fm[match[1]] = match[2].replace(/^"|"$/g, "").trim();
    }
  }
  const body = md.slice(fmMatch ? fmMatch[0].length : 0);
  const h1 = body.match(/^#\s+(.+)$/m);
  const title = clean(fm.title || (h1 ? h1[1] : path.basename(file, ".md")));
  // Only these four identification facts are ever pulled onto a card. Any
  // recipe/effect prose that might exist elsewhere in the source is never
  // matched by this pattern, so it never reaches a player-facing side.
  const facts = [];
  for (const line of body.split(/\r?\n/)) {
    const match = line.match(/^-\s+\*\*(Appearance|Simple Test|Handling|Found):\*\*\s*(.+)$/);
    if (match) facts.push(`\u2022 ${match[1]}: ${clean(match[2])}`);
  }
  const slug = path.basename(file, ".md");
  const imgAbs = path.join(imagesDir, slug + ".png");
  return {
    slug,
    title,
    category: clean(fm.category || "Alchemical Ingredient"),
    facts,
    imageAbs: fs.existsSync(imgAbs) ? imgAbs : null,
  };
}

function fitTitle(title, maxChars = 26) {
  const lines = wrap(title, maxChars);
  return { lines: lines.slice(0, 2), fs: lines.length > 1 ? 31 : 38 };
}

const DEFS = `<defs><radialGradient id="pg" cx="50%" cy="42%" r="75%"><stop offset="0%" stop-color="#f2e8d0"/><stop offset="100%" stop-color="#d9c8a2"/></radialGradient></defs>`;
const bg = () => `<rect width="${W}" height="${H}" rx="26" fill="url(#pg)"/>`;
const frame = `<rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="20" fill="none" stroke="#5b1a1a" stroke-width="12"/><rect x="22" y="22" width="${W - 44}" height="${H - 44}" rx="14" fill="none" stroke="#b8963e" stroke-width="3"/>`;
// Vector seal kept as the no-art fallback for any ingredient still missing a
// generated PNG, so the deck always builds even with a partial art pass.
const seal = `<circle cx="375" cy="500" r="168" fill="none" stroke="#8d6d37" stroke-width="8" opacity=".75"/><circle cx="375" cy="500" r="132" fill="none" stroke="#8d6d37" stroke-width="3" opacity=".75"/><path d="M375 340 L416 458 L542 458 L440 532 L478 654 L375 582 L272 654 L310 532 L208 458 L334 458 Z" fill="none" stroke="#8d6d37" stroke-width="5" opacity=".75"/>`;

async function renderFront(d) {
  const t = fitTitle(d.title);
  const titleSvg = t.lines.map((line, i) => `<text x="375" y="${t.lines.length > 1 ? 87 + i * 40 : 104}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="${t.fs}" fill="#f4e6c8">${xml(line)}</text>`).join("");
  const lines = d.facts.flatMap((fact) => wrap(fact, 47));
  let y = 265;
  const body = lines.map((line) => {
    y += 34;
    return `<text x="59" y="${y}" font-family="Georgia, serif" font-size="24" fill="#2c2419">${xml(line)}</text>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${DEFS}${bg()}<rect x="40" y="40" width="670" height="132" rx="12" fill="#6e1f1f" stroke="#b8963e" stroke-width="2"/>${titleSvg}<text x="375" y="225" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#4a3d2a" font-style="italic">${xml(d.category)}</text><line x1="60" y1="245" x2="690" y2="245" stroke="#b8963e" stroke-width="2"/>${body}${frame}</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(frontsDir, `${d.slug}.png`));
}

async function renderBack(d) {
  const t = fitTitle(d.title);
  const titleSvg = t.lines.map((line, i) => `<text x="375" y="${t.lines.length > 1 ? 87 + i * 40 : 104}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="${t.fs}" fill="#f4e6c8">${xml(line)}</text>`).join("");
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${DEFS}<rect x="40" y="40" width="670" height="132" rx="12" fill="#6e1f1f" stroke="#b8963e" stroke-width="2"/>${titleSvg}` +
    (d.imageAbs ? "" : seal) +
    `<text x="375" y="900" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="58" letter-spacing="4" fill="#5b1a1a">INGREDIENT</text><line x1="140" y1="940" x2="610" y2="940" stroke="#b8963e" stroke-width="2"/><text x="375" y="982" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#4a3d2a" font-style="italic">${xml(d.category)}</text>${frame}</svg>`;
  const base = sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${DEFS}${bg()}</svg>`));
  const comps = [];
  if (d.imageAbs) {
    const IS = 560, imgTop = 200, imgLeft = Math.round((W - IS) / 2);
    const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${IS}" height="${IS}"><defs><radialGradient id="m" cx="50%" cy="50%" r="50%"><stop offset="58%" stop-color="#fff" stop-opacity="1"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="${IS}" height="${IS}" fill="url(#m)"/></svg>`);
    const feathered = await sharp(d.imageAbs).resize(IS, IS, { fit: "cover", position: "attention" }).ensureAlpha()
      .composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
    comps.push({ input: feathered, top: imgTop, left: imgLeft });
  }
  comps.push({ input: Buffer.from(overlay), top: 0, left: 0 });
  await base.composite(comps).png().toFile(path.join(backsDir, `${d.slug}.png`));
}

function cropSvg(dx = 0, dy = 0) {
  const t = 34, stroke = 1.6, xs = [MARGIN_X + dx, MARGIN_X + CARD_W + dx, MARGIN_X + CARD_W * 2 + dx, MARGIN_X + CARD_W * 3 + dx], ys = [MARGIN_Y + dy, MARGIN_Y + CARD_H + dy, MARGIN_Y + CARD_H * 2 + dy, MARGIN_Y + CARD_H * 3 + dy];
  const lines = [];
  for (const x of xs) lines.push(`<line x1="${x}" y1="${MARGIN_Y - t + dy}" x2="${x}" y2="${MARGIN_Y + dy}" stroke="#444" stroke-width="${stroke}"/><line x1="${x}" y1="${MARGIN_Y + CARD_H * 3 + dy}" x2="${x}" y2="${MARGIN_Y + CARD_H * 3 + t + dy}" stroke="#444" stroke-width="${stroke}"/>`);
  for (const y of ys) lines.push(`<line x1="${MARGIN_X - t + dx}" y1="${y}" x2="${MARGIN_X + dx}" y2="${y}" stroke="#444" stroke-width="${stroke}"/><line x1="${MARGIN_X + CARD_W * 3 + dx}" y1="${y}" x2="${MARGIN_X + CARD_W * 3 + t + dx}" y2="${y}" stroke="#444" stroke-width="${stroke}"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${PW}" height="${PH}">${lines.join("")}</svg>`;
}

async function sheetImage(cards, back = false) {
  const comps = [];
  cards.forEach((card, i) => {
    const c = i % COLS, r = Math.floor(i / COLS);
    const slot = back ? r * COLS + (COLS - 1 - c) : i;
    const x = MARGIN_X + (slot % COLS) * CARD_W + (back ? BACK_DX : 0);
    const y = MARGIN_Y + Math.floor(slot / COLS) * CARD_H + (back ? BACK_DY : 0);
    comps.push({ input: fs.readFileSync(card), left: x, top: y });
  });
  comps.push({ input: Buffer.from(cropSvg(back ? BACK_DX : 0, back ? BACK_DY : 0)), left: 0, top: 0 });
  return sharp({ create: { width: PW, height: PH, channels: 3, background: "#fff" } }).composite(comps).jpeg({ quality: 88, chromaSubsampling: "4:2:0" }).toBuffer();
}

async function main() {
  fs.mkdirSync(frontsDir, { recursive: true });
  fs.mkdirSync(backsDir, { recursive: true });
  fs.mkdirSync(sheetsOutDir, { recursive: true });
  const cards = fs.readdirSync(sourceDir).filter((f) => f.endsWith(".md")).sort().map((f) => parse(path.join(sourceDir, f)));
  if (cards.length !== 20) throw new Error(`Expected exactly 20 ingredient sources, found ${cards.length}`);
  const withArt = cards.filter((d) => d.imageAbs).length;
  for (const d of cards) { await renderFront(d); await renderBack(d); }

  // Clear any previously written sheet-NN.pdf so a shrinking sheet count
  // never leaves a stale extra sheet behind.
  for (const f of fs.readdirSync(sheetsOutDir)) {
    if (/^sheet-\d+\.pdf$/i.test(f)) fs.unlinkSync(path.join(sheetsOutDir, f));
  }

  let sheetNum = 0;
  for (let start = 0; start < cards.length; start += PER_PAGE) {
    sheetNum++;
    const pageCards = cards.slice(start, start + PER_PAGE);
    const frontImg = await sheetImage(pageCards.map((d) => path.join(frontsDir, `${d.slug}.png`)));
    const backImg = await sheetImage(pageCards.map((d) => path.join(backsDir, `${d.slug}.png`)), true);
    const doc = await PDFDocument.create();
    const fi = await doc.embedJpg(frontImg);
    doc.addPage([612, 792]).drawImage(fi, { x: 0, y: 0, width: 612, height: 792 });
    const bi = await doc.embedJpg(backImg);
    doc.addPage([612, 792]).drawImage(bi, { x: 0, y: 0, width: 612, height: 792 });
    const bytes = await doc.save();
    const name = `sheet-${String(sheetNum).padStart(2, "0")}.pdf`;
    fs.writeFileSync(path.join(sheetsOutDir, name), bytes);
  }

  fs.writeFileSync(path.join(deckDir, "ingredient-card-order.json"), JSON.stringify(cards.map((d) => d.slug), null, 2) + "\n");
  console.log(`Rendered ${cards.length} ingredient cards in deterministic filename order (${withArt}/${cards.length} with real art).`);
  console.log(`Wrote ${sheetNum} sheet PDF(s) to ${path.relative(itemsDir, sheetsOutDir)}`);
}

await main();