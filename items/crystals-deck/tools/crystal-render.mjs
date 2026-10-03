// crystal-render.mjs, duplex-ready crystal card renderer.
//
// Fronts use real crystal art from items/crystals/images/<slug>.png, feathered
// into parchment, plus the crystal name banner. Backs are text only: school of
// magic and the crystal power. Missing art falls back to a vector crystal so
// the deck still builds after a skipped or failed generation pass.
//
// Output:
//   items/crystals-deck/build/{fronts,backs}/<slug>.png
//   items/crystals-deck/crystal-card-order.json
//   items/decks/cyrstals/sheet-NN.pdf
//
// Run:  node items/crystals-deck/tools/crystal-render.mjs

import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const deckDir = path.resolve(here, "..");           // items/crystals-deck
const itemsDir = path.resolve(deckDir, "..");       // items
const sourceDir = path.join(itemsDir, "crystals");
const imagesDir = path.join(sourceDir, "images");
const buildDir = path.join(deckDir, "build");
const frontsDir = path.join(buildDir, "fronts");
const backsDir = path.join(buildDir, "backs");
const sheetsOutDir = path.join(itemsDir, "decks", "cyrstals");

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

const ORDER = [
  "green",
  "white",
  "yellow",
  "blue",
  "purple",
  "red",
  "black",
  "magenta-pink",
  "necrotic",
  "silver",
  "wrought-iron",
  "copper",
  "gold",
];

const CRYSTAL_COLORS = {
  green: ["#1fa463", "#9af0af"],
  white: ["#f8f1df", "#ffffff"],
  yellow: ["#e0b52d", "#ffe780"],
  blue: ["#246fd6", "#7db9ff"],
  purple: ["#6930ad", "#c084fc"],
  red: ["#b72d2d", "#ff806f"],
  black: ["#17151a", "#695f76"],
  "magenta-pink": ["#cc2f91", "#ff9bd8"],
  necrotic: ["#16351f", "#81b65b"],
  silver: ["#adb8c2", "#f6fbff"],
  "wrought-iron": ["#40444a", "#8d9298"],
  copper: ["#b46638", "#f2a66c"],
  gold: ["#c99627", "#ffd766"],
};

const xml = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clean = (s) => String(s || "")
  .replace(/<br\s*\/?>/gi, "\n")
  .replace(/\*\*/g, "")
  .replace(/\*/g, "")
  .replace(/`/g, "")
  .replace(/\u00a0/g, " ")
  .replace(/[ \t]+/g, " ")
  .trim();

function wrap(text, maxChars) {
  const lines = [];
  for (const paragraph of clean(text).split(/\n+/)) {
    let line = "";
    for (const word of paragraph.split(" ").filter(Boolean)) {
      if (line && (line + " " + word).length > maxChars) {
        lines.push(line);
        line = word;
      } else {
        line = (line + " " + word).trim();
      }
    }
    if (line) lines.push(line);
    lines.push("");
  }
  if (lines[lines.length - 1] === "") lines.pop();
  return lines;
}

function parseFrontMatter(md) {
  const out = {};
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return out;
  const lines = m[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const block = lines[i].match(/^(\w+):\s*\|[-+]?\s*$/);
    if (block) {
      const key = block[1];
      const values = [];
      while (i + 1 < lines.length && (/^(  |\t|$)/.test(lines[i + 1]))) {
        i++;
        values.push(lines[i].replace(/^  /, ""));
      }
      out[key] = values.join("\n").trim();
      continue;
    }
    const scalar = lines[i].match(/^(\w+):\s*(.*)$/);
    if (scalar) out[scalar[1]] = scalar[2].replace(/^"|"$/g, "").trim();
  }
  return out;
}

function stripBoonFromPower(power, boon) {
  const normalized = String(power || "").trim();
  const escaped = String(boon || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return normalized
    .replace(new RegExp(`^\\*\\*${escaped}:\\*\\*\\s*`, "i"), "")
    .replace(new RegExp(`^${escaped}:\\s*`, "i"), "")
    .trim();
}

function parse(file) {
  const md = fs.readFileSync(file, "utf8");
  const fm = parseFrontMatter(md);
  const slug = path.basename(file, ".md");
  const imgAbs = path.join(imagesDir, slug + ".png");
  return {
    slug,
    name: clean(fm.name || slug),
    type: clean(fm.type || "Crystal"),
    school: clean(fm.school || ""),
    boon: clean(fm.boon || "Power"),
    power: fm.power || "",
    effect: stripBoonFromPower(fm.power || "", fm.boon || ""),
    imageAbs: fs.existsSync(imgAbs) ? imgAbs : null,
  };
}

function fitTitle(title, maxChars = 24) {
  const lines = wrap(title, maxChars).filter((line) => line !== "");
  return { lines: lines.slice(0, 2), fs: lines.length > 1 ? 31 : 40 };
}

const DEFS = `<defs><radialGradient id="pg" cx="50%" cy="42%" r="75%"><stop offset="0%" stop-color="#f2e8d0"/><stop offset="100%" stop-color="#d9c8a2"/></radialGradient></defs>`;
const bg = () => `<rect width="${W}" height="${H}" rx="26" fill="url(#pg)"/>`;
const frame = `<rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="20" fill="none" stroke="#5b1a1a" stroke-width="12"/><rect x="22" y="22" width="${W - 44}" height="${H - 44}" rx="14" fill="none" stroke="#b8963e" stroke-width="3"/>`;

function titleBanner(title, y = 40) {
  const t = fitTitle(title);
  const titleSvg = t.lines.map((line, i) => `<text x="375" y="${t.lines.length > 1 ? y + 47 + i * 40 : y + 67}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="${t.fs}" fill="#f4e6c8">${xml(line)}</text>`).join("");
  return `<rect x="40" y="${y}" width="670" height="132" rx="12" fill="#6e1f1f" stroke="#b8963e" stroke-width="2"/>${titleSvg}`;
}

function fallbackCrystal(slug) {
  const [dark, light] = CRYSTAL_COLORS[slug] || ["#75633a", "#f2dc8d"];
  return `<g opacity=".96">
    <ellipse cx="375" cy="735" rx="170" ry="38" fill="#8d6d37" opacity=".18"/>
    <path d="M375 210 L545 435 L488 735 L375 850 L262 735 L205 435 Z" fill="${dark}" stroke="#f4e6c8" stroke-width="4" opacity=".92"/>
    <path d="M375 210 L442 444 L375 850 L262 735 L205 435 Z" fill="${light}" opacity=".42"/>
    <path d="M375 210 L442 444 L545 435 Z" fill="#ffffff" opacity=".22"/>
    <path d="M205 435 L442 444 L488 735 L262 735 Z" fill="#000000" opacity=".16"/>
    <path d="M375 210 L375 850 M205 435 L545 435 M262 735 L488 735 M442 444 L375 850" fill="none" stroke="#f4e6c8" stroke-width="3" opacity=".42"/>
  </g>`;
}

async function featheredArt(imageAbs) {
  const IS = 650, imgTop = 210, imgLeft = Math.round((W - IS) / 2);
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${IS}" height="${IS}"><defs><radialGradient id="m" cx="50%" cy="50%" r="50%"><stop offset="58%" stop-color="#fff" stop-opacity="1"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="${IS}" height="${IS}" fill="url(#m)"/></svg>`);
  const feathered = await sharp(imageAbs).resize(IS, IS, { fit: "cover", position: "attention" }).ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  return { input: feathered, top: imgTop, left: imgLeft };
}

async function renderFront(d) {
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${DEFS}` +
    (d.imageAbs ? "" : fallbackCrystal(d.slug)) +
    `${titleBanner(d.name, 40)}<text x="375" y="928" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="50" letter-spacing="5" fill="#5b1a1a">CRYSTAL</text><line x1="170" y1="952" x2="580" y2="952" stroke="#b8963e" stroke-width="2"/><text x="375" y="992" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#4a3d2a" font-style="italic">${xml(d.type)}</text>${frame}</svg>`;
  const base = sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${DEFS}${bg()}</svg>`));
  const comps = [];
  if (d.imageAbs) comps.push(await featheredArt(d.imageAbs));
  comps.push({ input: Buffer.from(overlay), top: 0, left: 0 });
  await base.composite(comps).png().toFile(path.join(frontsDir, `${d.slug}.png`));
}

async function renderBack(d) {
  const effectLines = wrap(d.effect || d.power, 47);
  const lineHeight = effectLines.length > 11 ? 27 : 31;
  let y = 445;
  const effect = effectLines.map((line) => {
    if (line === "") { y += Math.round(lineHeight * 0.55); return ""; }
    y += lineHeight;
    return `<text x="70" y="${y}" font-family="Georgia, serif" font-size="${lineHeight > 28 ? 24 : 22}" fill="#2c2419">${xml(line)}</text>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${DEFS}${bg()}${titleBanner(d.name, 40)}<text x="375" y="244" text-anchor="middle" font-family="Georgia, serif" font-size="25" fill="#4a3d2a" letter-spacing="2">SCHOOL OF MAGIC</text><text x="375" y="318" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="56" fill="#5b1a1a">${xml(d.school)}</text><line x1="95" y1="354" x2="655" y2="354" stroke="#b8963e" stroke-width="3"/><text x="375" y="414" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="34" fill="#5b1a1a">${xml(d.boon)}</text>${effect}${frame}</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(backsDir, `${d.slug}.png`));
}

function cropSvg(dx = 0, dy = 0) {
  const t = 34, stroke = 1.6, xs = [MARGIN_X + dx, MARGIN_X + CARD_W + dx, MARGIN_X + CARD_W * 2 + dx, MARGIN_X + CARD_W * 3 + dx], ys = [MARGIN_Y + dy, MARGIN_Y + CARD_H + dy, MARGIN_Y + CARD_H * 2 + dy, MARGIN_Y + CARD_H * 3 + dy];
  const lines = [];
  for (const x of xs) lines.push(`<line x1="${x}" y1="${MARGIN_Y - t + dy}" x2="${x}" y2="${MARGIN_Y + dy}" stroke="#444" stroke-width="${stroke}"/><line x1="${x}" y1="${MARGIN_Y + CARD_H * 3 + dy}" x2="${x}" y2="${MARGIN_Y + CARD_H * 3 + t + dy}" stroke="#444" stroke-width="${stroke}"/>`);
  for (const y of ys) lines.push(`<line x1="${MARGIN_X - t + dx}" y1="${y}" x2="${MARGIN_X + dx}" y2="${y}" stroke="#444" stroke-width="${stroke}"/><line x1="${MARGIN_X + CARD_W * 3 + dx}" y1="${y}" x2="${MARGIN_X + CARD_W * 3 + t + dx}" stroke="#444" stroke-width="${stroke}"/>`);
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
  const cards = ORDER.map((slug) => parse(path.join(sourceDir, slug + ".md")));
  if (cards.length !== 13) throw new Error(`Expected exactly 13 crystal sources, found ${cards.length}`);
  const withArt = cards.filter((d) => d.imageAbs).length;
  for (const d of cards) { await renderFront(d); await renderBack(d); }

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

  fs.writeFileSync(path.join(deckDir, "crystal-card-order.json"), JSON.stringify(cards.map((d) => d.slug), null, 2) + "\n");
  console.log(`Rendered ${cards.length} crystal cards in crystal-table order (${withArt}/${cards.length} with real art).`);
  console.log(`Wrote ${sheetNum} sheet PDF(s) to ${path.relative(itemsDir, sheetsOutDir)}`);
}

await main();
