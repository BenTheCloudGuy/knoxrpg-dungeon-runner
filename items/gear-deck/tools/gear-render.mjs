// gear-render.mjs, one-sheet 9-up gear renderer.
//
// Outputs one US Letter duplex sheet for a single gear item:
//   items/decks/artificers-toolkit/sheet-01.pdf
//   items/decks/smithing-tools/sheet-01.pdf

import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const deckDir = path.resolve(here, "..");
const itemsDir = path.resolve(deckDir, "..");
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
  "artificers-toolkit": {
    slug: "artificers-toolkit",
    sourceFile: path.join(itemsDir, "treasure", "artificers-toolkit.md"),
    imageAbs: path.join(itemsDir, "treasure", "images", "artificers-toolkit.png"),
    outDir: path.join(itemsDir, "decks", "artificers-toolkit"),
    frontUse: "ten",
    subtitle: "Adventuring Gear",
    backHeading: "TOOL RULES",
    bullets: [
      "You have Advantage on ability checks made to craft, repair, tinker with, or disable mechanisms and items.",
      "The toolkit contains 10 uses. Each use is one crafting, repair, tinker, or disable attempt. Mark off a use each time.",
      "When all 10 uses are spent, the toolkit is used up.",
      "Cost: 25 GP",
    ],
  },
  "smithing-tools": {
    slug: "smithing-tools",
    sourceFile: path.join(itemsDir, "treasure", "smithing-tools.md"),
    imageAbs: path.join(itemsDir, "treasure", "images", "smithing-tools.png"),
    outDir: path.join(itemsDir, "decks", "smithing-tools"),
    frontUse: "single",
    subtitle: "Adventuring Gear",
    backHeading: "TOOL RULES",
    bullets: [
      "Expend this card to make one use of Smithing Tools: forge, reforge, or repair a metal item, or provide the smithing required by a room, recipe, or the Dwarven Forge.",
      "Each card is a single use. After it is spent, discard it or return it to the DM.",
      "Cost: 2 GP",
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
    const scalar = line.match(/^([\w_-]+):\s*(.*)$/);
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
  return {
    slug: config.slug,
    title: clean(fm.title || (h1 ? h1[1] : config.slug)),
    category: clean(fm.category || "Adventuring Gear"),
    type: clean(fm.type || "Tool"),
    cost: clean(fm.cost || ""),
    imageAbs: hasImage ? config.imageAbs : "",
    outDir: config.outDir,
    frontUse: config.frontUse,
    subtitle: config.subtitle,
    backHeading: config.backHeading,
    bullets: config.bullets,
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
  const amt = (cost || "").replace(/GP/i, "").trim() || "?";
  const fs2 = amt.length >= 4 ? 22 : Math.round(r * 0.62);
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#c9a13b" stroke="#7a5a1c" stroke-width="4"/>` +
    `<text x="${cx}" y="${cy - 3}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="${fs2}" fill="#3a2a0a">${xml(amt)}</text>` +
    `<text x="${cx}" y="${cy + Math.round(r * 0.46)}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="${Math.round(r * 0.33)}" fill="#3a2a0a">GP</text>`;
}

async function featheredArt(imageAbs, size = 640) {
  const top = 200, left = Math.round((W - size) / 2);
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><defs><radialGradient id="m" cx="50%" cy="50%" r="50%"><stop offset="58%" stop-color="#fff" stop-opacity="1"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="${size}" height="${size}" fill="url(#m)"/></svg>`);
  const image = await sharp(imageAbs).resize(size, size, { fit: "cover", position: "attention" }).ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  return { input: image, top, left };
}

function fallbackToolArt(slug) {
  if (slug === "smithing-tools") {
    return `<g opacity=".86">` +
      `<ellipse cx="375" cy="664" rx="230" ry="58" fill="#8d6d37" opacity=".16"/>` +
      `<path d="M238 580 L512 580 C538 580 555 602 544 624 L520 672 C510 692 489 704 464 704 L286 704 C261 704 240 692 230 672 L206 624 C195 602 212 580 238 580 Z" fill="#63605a" stroke="#4a4338" stroke-width="10"/>` +
      `<rect x="249" y="418" width="62" height="240" rx="20" fill="#7b4f28" transform="rotate(-43 280 538)" stroke="#5b391d" stroke-width="8"/>` +
      `<rect x="434" y="350" width="60" height="318" rx="18" fill="#7b4f28" transform="rotate(38 464 509)" stroke="#5b391d" stroke-width="8"/>` +
      `<path d="M295 324 L415 324 L415 380 L295 380 Z" fill="#5f5a52" stroke="#413c35" stroke-width="9" transform="rotate(-43 355 352)"/>` +
      `<path d="M495 336 C570 366 570 453 501 487 C530 438 525 391 495 336 Z" fill="none" stroke="#5f5a52" stroke-width="18" stroke-linecap="round"/>` +
      `<path d="M302 740 C352 706 435 706 493 742" fill="none" stroke="#d46a22" stroke-width="20" stroke-linecap="round" opacity=".7"/>` +
      `</g>`;
  }
  return `<g opacity=".86">` +
    `<ellipse cx="375" cy="680" rx="245" ry="62" fill="#8d6d37" opacity=".16"/>` +
    `<path d="M178 432 C258 372 487 368 578 430 L546 682 C448 724 296 724 204 682 Z" fill="#8d5e35" stroke="#5f3c21" stroke-width="12" stroke-linejoin="round"/>` +
    `<path d="M220 460 C306 505 445 505 532 460" fill="none" stroke="#d0aa68" stroke-width="10" stroke-linecap="round"/>` +
    `<circle cx="330" cy="565" r="58" fill="none" stroke="#b8963e" stroke-width="16"/>` +
    `<circle cx="330" cy="565" r="22" fill="none" stroke="#b8963e" stroke-width="10"/>` +
    `<circle cx="444" cy="556" r="42" fill="none" stroke="#b8963e" stroke-width="13"/>` +
    `<path d="M225 622 L498 420 M265 640 L538 438" stroke="#6b6a60" stroke-width="14" stroke-linecap="round"/>` +
    `<path d="M525 600 L584 541 M548 625 L607 566" stroke="#6b6a60" stroke-width="12" stroke-linecap="round"/>` +
    `</g>`;
}

function useIndicator(kind) {
  if (kind === "ten") {
    const boxes = Array.from({ length: 10 }, (_, i) => {
      const x = 106 + i * 39;
      return `<rect x="${x}" y="942" width="28" height="28" rx="4" fill="#f4e6c8" stroke="#5b1a1a" stroke-width="3"/>`;
    }).join("");
    return `<text x="300" y="924" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="29" fill="#5b1a1a" letter-spacing="2">10 USES</text>${boxes}`;
  }
  return `<rect x="95" y="912" width="430" height="72" rx="14" fill="#f4e6c8" stroke="#b8963e" stroke-width="4"/>` +
    `<text x="310" y="940" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="24" fill="#5b1a1a" letter-spacing="2">SINGLE USE</text>` +
    `<text x="310" y="972" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="31" fill="#5b1a1a">1 USE</text>`;
}

async function renderFront(d, frontsDir) {
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${DEFS}` +
    `${d.imageAbs ? "" : fallbackToolArt(d.slug)}${titleBanner(d.title, 40)}${coinSvg(d.cost, 655, 920, 48)}` +
    `<text x="375" y="850" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="52" letter-spacing="4" fill="#5b1a1a">TOOL</text>` +
    `<line x1="190" y1="875" x2="560" y2="875" stroke="#b8963e" stroke-width="2"/>` +
    `<text x="375" y="900" text-anchor="middle" font-family="Georgia, serif" font-size="23" fill="#4a3d2a" font-style="italic">${xml(d.subtitle)}</text>` +
    `${useIndicator(d.frontUse)}${frame}</svg>`;
  const base = sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${DEFS}${bg()}</svg>`));
  const comps = [];
  if (d.imageAbs) comps.push(await featheredArt(d.imageAbs));
  comps.push({ input: Buffer.from(overlay), top: 0, left: 0 });
  await base.composite(comps).png().toFile(path.join(frontsDir, `${d.slug}.png`));
}

function fitBody(lines, top, bottom, textW) {
  for (let fs = 32; fs >= 23; fs--) {
    const lh = Math.round(fs * 1.38);
    const maxChars = Math.max(24, Math.floor(textW / (fs * 0.48)));
    const wrapped = lines.flatMap((line) => wrap(line, maxChars));
    if (top + wrapped.length * lh <= bottom) return { fs, lh, wrapped };
  }
  const fs = 23, lh = 32, maxChars = Math.max(24, Math.floor(textW / (fs * 0.48)));
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
    `<text x="375" y="238" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="36" fill="#5b1a1a" letter-spacing="3">${xml(d.backHeading)}</text>` +
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

export async function renderDeck(key) {
  const config = DECKS[key];
  if (!config) throw new Error(`Unknown gear deck "${key}". Use artificers-toolkit, smithing-tools, or all.`);

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
  console.log(`Art: ${card.imageAbs ? "real" : "vector fallback"}`);
  console.log(`Wrote ${path.relative(itemsDir, path.join(card.outDir, "sheet-01.pdf"))}`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const target = process.argv[2];
  if (!target) throw new Error("Missing gear deck name. Use artificers-toolkit, smithing-tools, or all.");
  if (target === "all") {
    for (const key of Object.keys(DECKS)) await renderDeck(key);
  } else {
    await renderDeck(target);
  }
}
