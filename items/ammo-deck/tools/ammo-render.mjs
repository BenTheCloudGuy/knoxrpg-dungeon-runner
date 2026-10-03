// ammo-render.mjs, one-sheet 9-up ammunition renderer.
//
// Outputs one US Letter duplex sheet for a single ammunition item:
//   items/decks/arrows/sheet-01.pdf
//   items/decks/crossbow-bolts/sheet-01.pdf
//   items/decks/firearm-ammunition/sheet-01.pdf
//
// Run:
//   node items\ammo-deck\tools\ammo-render.mjs arrows
//   node items\ammo-deck\tools\ammo-render.mjs crossbow-bolts
//   node items\ammo-deck\tools\ammo-render.mjs firearm-ammunition

import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const deckDir = path.resolve(here, "..");           // items/ammo-deck
const itemsDir = path.resolve(deckDir, "..");       // items
const buildDir = path.join(deckDir, "build");

// Reuse the shared sharp/pdf-lib install from the magic-items deck tooling.
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

const DECKS = {
  arrows: {
    slug: "arrows",
    sourceFile: path.join(itemsDir, "treasure", "arrows-20.md"),
    imageAbs: path.join(itemsDir, "treasure", "images", "arrows-20.png"),
    outDir: path.join(itemsDir, "decks", "arrows"),
    bullets: [
      "Ammunition For: Shortbow, Longbow",
      "Bundle: 20 arrows",
      "Weight: 1 lb.",
      "Recovery: After a battle, spend 1 minute to recover half the arrows you fired.",
      "Cost: 1 gp",
    ],
  },
  "crossbow-bolts": {
    slug: "crossbow-bolts",
    sourceFile: path.join(itemsDir, "treasure", "crossbow-bolts-20.md"),
    imageAbs: path.join(itemsDir, "treasure", "images", "crossbow-bolts-20.png"),
    outDir: path.join(itemsDir, "decks", "crossbow-bolts"),
    bullets: [
      "Ammunition For: Hand Crossbow, Light Crossbow, Heavy Crossbow",
      "Bundle: 20 bolts",
      "Weight: 1 1/2 lb.",
      "Recovery: After a battle, spend 1 minute to recover half the bolts you fired.",
      "Cost: 1 gp",
    ],
  },
  "firearm-ammunition": {
    slug: "firearm-ammunition",
    sourceFile: path.join(itemsDir, "treasure", "firearm-ammunition-10.md"),
    imageAbs: path.join(itemsDir, "treasure", "images", "firearm-ammunition-10.png"),
    outDir: path.join(itemsDir, "decks", "firearm-ammunition"),
    allowFallback: true,
    bullets: [
      "Ammunition For: Pistol, Musket",
      "Bundle: 10 round balls and black powder, enough for 10 shots",
      "Weight: 2 lb.",
      "Recovery: Black powder is consumed when fired and round balls are destroyed on impact, so firearm ammunition cannot be recovered after a battle.",
      "Cost: 3 gp",
    ],
  },
};

const xml = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clean = (s) => String(s || "")
  .replace(/\*\*/g, "")
  .replace(/\*/g, "")
  .replace(/`/g, "")
  .replace(/\s+/g, " ")
  .trim();

function wrap(text, maxChars) {
  const lines = [];
  let line = "";
  for (const word of clean(text).split(" ").filter(Boolean)) {
    if (line && (line + " " + word).length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

function parseFrontMatter(md) {
  const out = {};
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return out;
  for (const line of m[1].split(/\r?\n/)) {
    const scalar = line.match(/^(\w+):\s*(.*)$/);
    if (scalar) out[scalar[1]] = scalar[2].replace(/^"|"$/g, "").trim();
  }
  return out;
}

function parseCard(config) {
  const md = fs.readFileSync(config.sourceFile, "utf8");
  const fm = parseFrontMatter(md);
  const body = md.slice(md.match(/^---\r?\n[\s\S]*?\r?\n---/)?.[0].length || 0);
  const h1 = body.match(/^#\s+(.+)$/m);
  const hasImage = fs.existsSync(config.imageAbs);
  if (!hasImage && !config.allowFallback) throw new Error(`Missing ammunition art: ${config.imageAbs}`);
  return {
    slug: config.slug,
    title: clean(fm.title || (h1 ? h1[1] : config.slug)),
    category: clean(fm.category || "Adventuring Gear"),
    cost: clean(fm.cost || "1 gp"),
    weight: clean(fm.weight || ""),
    imageAbs: hasImage ? config.imageAbs : "",
    bullets: config.bullets,
    outDir: config.outDir,
  };
}

const DEFS = `<defs><radialGradient id="pg" cx="50%" cy="42%" r="75%"><stop offset="0%" stop-color="#f2e8d0"/><stop offset="100%" stop-color="#d9c8a2"/></radialGradient></defs>`;
const bg = () => `<rect width="${W}" height="${H}" rx="26" fill="url(#pg)"/>`;
const frame = `<rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="20" fill="none" stroke="#5b1a1a" stroke-width="12"/><rect x="22" y="22" width="${W - 44}" height="${H - 44}" rx="14" fill="none" stroke="#b8963e" stroke-width="3"/>`;

function fitTitle(title, boxW = 630, maxFs = 42, minFs = 26) {
  for (let fs = maxFs; fs >= minFs; fs--) {
    const maxChars = Math.max(8, Math.floor(boxW / (fs * 0.56)));
    const lines = wrap(title, maxChars);
    if (lines.length <= 2) return { lines, fs };
  }
  return { lines: wrap(title, 22).slice(0, 2), fs: minFs };
}

function titleBanner(title, y = 40) {
  const t = fitTitle(title);
  const titleSvg = t.lines.map((line, i) => `<text x="375" y="${t.lines.length > 1 ? y + 47 + i * 40 : y + 67}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="${t.fs}" fill="#f4e6c8">${xml(line)}</text>`).join("");
  return `<rect x="40" y="${y}" width="670" height="132" rx="12" fill="#6e1f1f" stroke="#b8963e" stroke-width="2"/>${titleSvg}`;
}

function coinSvg(cost, cx, cy, r = 50) {
  const amt = (cost || "").replace(/GP/i, "").trim() || "1";
  const fs2 = amt.length >= 4 ? 22 : Math.round(r * 0.62);
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#c9a13b" stroke="#7a5a1c" stroke-width="4"/>` +
    `<text x="${cx}" y="${cy - 3}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="${fs2}" fill="#3a2a0a">${xml(amt)}</text>` +
    `<text x="${cx}" y="${cy + Math.round(r * 0.46)}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="${Math.round(r * 0.33)}" fill="#3a2a0a">GP</text>`;
}

async function featheredArt(imageAbs, size = 640) {
  const top = 210, left = Math.round((W - size) / 2);
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><defs><radialGradient id="m" cx="50%" cy="50%" r="50%"><stop offset="58%" stop-color="#fff" stop-opacity="1"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="${size}" height="${size}" fill="url(#m)"/></svg>`);
  const image = await sharp(imageAbs).resize(size, size, { fit: "cover", position: "attention" }).ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  return { input: image, top, left };
}

function fallbackAmmoArt() {
  return `<g opacity=".86">` +
    `<ellipse cx="375" cy="555" rx="215" ry="75" fill="#8d6d37" opacity=".13"/>` +
    `<path d="M222 446 C282 326 448 318 537 419 C486 410 404 424 345 492 C302 542 255 544 204 507 C206 484 212 464 222 446 Z" fill="none" stroke="#8d6d37" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M530 413 C574 400 610 420 626 457" fill="none" stroke="#8d6d37" stroke-width="12" stroke-linecap="round"/>` +
    `<circle cx="304" cy="607" r="37" fill="#827d72" stroke="#5d5548" stroke-width="6"/>` +
    `<circle cx="358" cy="622" r="34" fill="#827d72" stroke="#5d5548" stroke-width="6"/>` +
    `<circle cx="409" cy="598" r="36" fill="#827d72" stroke="#5d5548" stroke-width="6"/>` +
    `<circle cx="462" cy="620" r="32" fill="#827d72" stroke="#5d5548" stroke-width="6"/>` +
    `<path d="M235 690 C298 662 372 664 456 694 C374 719 300 719 235 690 Z" fill="#2b2925" opacity=".75"/>` +
    `<path d="M173 530 L287 497 M175 562 L298 528 M559 535 L658 509 M552 570 L671 543" stroke="#8d6d37" stroke-width="12" stroke-linecap="round"/>` +
    `<path d="M190 514 L284 490 L302 530 L207 555 Z M565 518 L657 495 L674 535 L582 558 Z" fill="#f4e6c8" stroke="#8d6d37" stroke-width="5"/>` +
    `</g>`;
}

async function renderFront(d, frontsDir) {
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${DEFS}` +
    `${d.imageAbs ? "" : fallbackAmmoArt()}${titleBanner(d.title, 40)}${coinSvg(d.cost, 655, 920, 48)}` +
    `<text x="375" y="878" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="50" letter-spacing="4" fill="#5b1a1a">AMMUNITION</text>` +
    `<line x1="170" y1="902" x2="580" y2="902" stroke="#b8963e" stroke-width="2"/>` +
    `<text x="375" y="970" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#4a3d2a" font-style="italic">${xml(d.category)}</text>${frame}</svg>`;
  const base = sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${DEFS}${bg()}</svg>`));
  const comps = [];
  if (d.imageAbs) comps.push(await featheredArt(d.imageAbs));
  comps.push({ input: Buffer.from(overlay), top: 0, left: 0 });
  await base.composite(comps).png().toFile(path.join(frontsDir, `${d.slug}.png`));
}

function fitBody(lines, top, bottom, textW) {
  for (let fs = 34; fs >= 24; fs--) {
    const lh = Math.round(fs * 1.38);
    const maxChars = Math.max(24, Math.floor(textW / (fs * 0.48)));
    const wrapped = lines.flatMap((line) => wrap(line, maxChars));
    if (top + wrapped.length * lh <= bottom) return { fs, lh, wrapped };
  }
  const fs = 24, lh = 33, maxChars = Math.max(24, Math.floor(textW / (fs * 0.48)));
  return { fs, lh, wrapped: lines.flatMap((line) => wrap(line, maxChars)) };
}

async function renderBack(d, backsDir) {
  const { fs: bodyFs, lh, wrapped } = fitBody(d.bullets.map((line) => `\u2022 ${line}`), 320, 950, 620);
  let y = 320;
  const bodySvg = wrapped.map((line) => {
    const current = y;
    y += lh;
    return `<text x="65" y="${current}" font-family="Georgia, serif" font-size="${bodyFs}" fill="#2c2419">${xml(line)}</text>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${DEFS}${bg()}${titleBanner(d.title, 40)}` +
    `<text x="375" y="238" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="36" fill="#5b1a1a" letter-spacing="3">AMMUNITION</text>` +
    `<line x1="95" y1="266" x2="655" y2="266" stroke="#b8963e" stroke-width="3"/>${bodySvg}${frame}</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(backsDir, `${d.slug}.png`));
}

function cropSvg(dx = 0, dy = 0) {
  const t = 34, stroke = 1.6, xs = [MARGIN_X + dx, MARGIN_X + CARD_W + dx, MARGIN_X + CARD_W * 2 + dx, MARGIN_X + CARD_W * 3 + dx], ys = [MARGIN_Y + dy, MARGIN_Y + CARD_H + dy, MARGIN_Y + CARD_H * 2 + dy, MARGIN_Y + CARD_H * 3 + dy];
  const lines = [];
  for (const x of xs) lines.push(`<line x1="${x}" y1="${MARGIN_Y - t + dy}" x2="${x}" y2="${MARGIN_Y + dy}" stroke="#444" stroke-width="${stroke}"/><line x1="${x}" y1="${MARGIN_Y + CARD_H * 3 + dy}" x2="${x}" y2="${MARGIN_Y + CARD_H * 3 + t + dy}" stroke="#444" stroke-width="${stroke}"/>`);
  for (const y of ys) lines.push(`<line x1="${MARGIN_X - t + dx}" y1="${y}" x2="${MARGIN_X + dx}" y2="${y}" stroke="#444" stroke-width="${stroke}"/><line x1="${MARGIN_X + CARD_W * 3 + dx}" x2="${MARGIN_X + CARD_W * 3 + t + dx}" y1="${y}" y2="${y}" stroke="#444" stroke-width="${stroke}"/>`);
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

async function renderDeck(key) {
  const config = DECKS[key];
  if (!config) throw new Error(`Unknown deck "${key}". Use arrows, crossbow-bolts, firearm-ammunition, or all.`);

  const card = parseCard(config);
  const deckBuildDir = path.join(buildDir, card.slug);
  const frontsDir = path.join(deckBuildDir, "fronts");
  const backsDir = path.join(deckBuildDir, "backs");
  fs.mkdirSync(frontsDir, { recursive: true });
  fs.mkdirSync(backsDir, { recursive: true });
  fs.mkdirSync(card.outDir, { recursive: true });

  await renderFront(card, frontsDir);
  await renderBack(card, backsDir);

  for (const f of fs.readdirSync(card.outDir)) {
    if (/^sheet-\d+\.pdf$/i.test(f)) fs.unlinkSync(path.join(card.outDir, f));
  }

  const frontPath = path.join(frontsDir, `${card.slug}.png`);
  const backPath = path.join(backsDir, `${card.slug}.png`);
  const frontImg = await sheetImage(Array(PER_PAGE).fill(frontPath));
  const backImg = await sheetImage(Array(PER_PAGE).fill(backPath), true);

  const doc = await PDFDocument.create();
  const fi = await doc.embedJpg(frontImg);
  doc.addPage([612, 792]).drawImage(fi, { x: 0, y: 0, width: 612, height: 792 });
  const bi = await doc.embedJpg(backImg);
  doc.addPage([612, 792]).drawImage(bi, { x: 0, y: 0, width: 612, height: 792 });
  fs.writeFileSync(path.join(card.outDir, "sheet-01.pdf"), await doc.save());
  fs.writeFileSync(path.join(deckBuildDir, "card-order.json"), JSON.stringify(Array(PER_PAGE).fill(card.slug), null, 2) + "\n");

  console.log(`Rendered 9 identical ${card.title} cards.`);
  console.log(`Wrote ${path.relative(itemsDir, path.join(card.outDir, "sheet-01.pdf"))}`);
}

const target = process.argv[2];
if (!target) {
  throw new Error("Missing deck name. Use arrows, crossbow-bolts, firearm-ammunition, or all.");
}

if (target === "all") {
  for (const key of Object.keys(DECKS)) await renderDeck(key);
} else {
  await renderDeck(target);
}
