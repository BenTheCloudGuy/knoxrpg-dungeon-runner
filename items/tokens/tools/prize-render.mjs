// prize-render.mjs — two-sided card renderer for the PRIZE deck.
// Same design as the magic-item deck: text-only front, illustrated back with
// the item art feathered into the parchment. Reads the token files in
// items/tokens/*.md and their generated art in items/tokens/images/<name>.png.
//
// Output: build/fronts/<name>.png and build/backs/<name>.png
// Card count is copy-driven: a token with `copies: N` in its frontmatter (default
// 1) also gets identical extra PNGs <name>-2.png .. <name>-N.png written into BOTH
// build/fronts and build/backs, so the deck has one card per physical prize copy.
// Cleanup is idempotent: stale extra copies are removed when `copies` is lowered.
// Sample: ONLY=beholder-potato-head-figure node prize-render.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const tokensDir = path.resolve(toolsDir, "..");        // items/tokens
const imagesDir = path.join(tokensDir, "images");
const deckDir = path.join(tokensDir, "deck");
const frontsDir = path.join(deckDir, "build", "fronts");
const backsDir = path.join(deckDir, "build", "backs");
fs.mkdirSync(frontsDir, { recursive: true });
fs.mkdirSync(backsDir, { recursive: true });

const FILES = [
  "4pcs-fantasy-sword-bookmarks", "teeturtle-reversible-plushie-mystery-box", "stupid-dnd-jokes",
  "hiifeuer-medieval-faux-leather-pouch", "haxtec-dragon-eye-dice-bag", "longlongjin-dnd-dragon-journal-with-pen",
  "the-book-of-holding", "duck-dnd-resin-dice-set", "game-masters-book-of-astonishing-random-tables",
  "banloga-metal-dice-set-with-pocket-watch-case", "young-adventurers-collection-box-set-1",
  "beholder-potato-head-figure", "sweien-hollow-metal-dnd-dice-set", "wooden-dnd-dice-tray-journal-box",
  "dnd-2024-core-rulebook-set-gm-screen",
];

const W = 750, H = 1050;
const xml = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clean = (s) => s.replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "").replace(/\s+/g, " ").trim();

const DEFS = `<defs><radialGradient id="pg" cx="50%" cy="42%" r="75%"><stop offset="0%" stop-color="#f2e8d0"/><stop offset="100%" stop-color="#d9c8a2"/></radialGradient></defs>`;
const bg = () => `<rect width="${W}" height="${H}" rx="26" fill="url(#pg)"/>`;
const FRAME = `<rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="20" fill="none" stroke="#5b1a1a" stroke-width="12"/><rect x="22" y="22" width="${W - 44}" height="${H - 44}" rx="14" fill="none" stroke="#b8963e" stroke-width="3"/>`;

function wrap(text, maxChars) {
  const bullet = text.startsWith("\u2022");
  const words = text.split(/\s+/); const lines = []; let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars) { if (cur) lines.push(cur); cur = (bullet && lines.length ? "  " : "") + w; }
    else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

// token .md -> card data
function parse(name) {
  const md = fs.readFileSync(path.join(tokensDir, name + ".md"), "utf8");
  const fm = {};
  const fmM = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fmM) for (const line of fmM[1].split(/\r?\n/)) { const m = line.match(/^(\w+):\s*(.*)$/); if (m) fm[m[1]] = m[2].replace(/^"|"$/g, "").trim(); }
  const body = md.slice(fmM ? fmM[0].length : 0);
  const descM = body.match(/^-\s*\*\*Description:\*\*\s*(.+)$/m);
  const usdM = body.match(/^-\s*\*\*Value \(USD\):\*\*\s*(.+)$/m);
  const desc = descM ? clean(descM[1]) : "";
  const usd = usdM ? usdM[1].trim() : "";
  const sm = desc.match(/^(.+?[.!?])(\s|$)/);
  const shortDesc = sm ? sm[1] : desc.slice(0, 96);
  const imgAbs = path.join(imagesDir, name + ".png");
  return {
    title: fm.title || "",
    rarity: usd,                 // shown in the meta line (e.g. "$35")
    type: "Prize",
    cost: (fm.cost || "").trim(),
    copies: Math.max(1, parseInt(fm.copies || "1", 10) || 1),
    imageAbs: fs.existsSync(imgAbs) ? imgAbs : null,
    shortDesc,
    paras: desc ? [desc] : [],
  };
}

const coinSvg = (cost, cx, cy, r = 46) => {
  const amt = (cost || "").replace(/GP/i, "").trim();
  const fs2 = amt.length >= 4 ? 24 : Math.round(r * 0.66);
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#c9a13b" stroke="#7a5a1c" stroke-width="4"/>` +
    `<text x="${cx}" y="${cy - 3}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="${fs2}" fill="#3a2a0a">${xml(amt)}</text>` +
    `<text x="${cx}" y="${cy + Math.round(r * 0.46)}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="${Math.round(r * 0.35)}" fill="#3a2a0a">GP</text>`;
};

function fitTitle(title, boxW, maxFs, minFs) {
  for (let f = maxFs; f >= minFs; f--) {
    const maxChars = Math.max(6, Math.floor(boxW / (f * 0.56)));
    const lines = wrap(title, maxChars);
    if (lines.length <= 2 && lines.every((l) => l.length <= maxChars)) return { lines, fs: f };
  }
  const maxChars = Math.max(6, Math.floor(boxW / (minFs * 0.56)));
  return { lines: wrap(title, maxChars).slice(0, 2), fs: minFs };
}

function fitBody(paras, top, bottom, textW) {
  for (let f = 26; f >= 14; f--) {
    const lh = Math.round(f * 1.28);
    const maxChars = Math.max(22, Math.floor(textW / (f * 0.475)));
    const lines = [];
    for (const p of paras) lines.push(...wrap(clean(p), maxChars));
    if (top + lines.length * lh <= bottom) return { f, lh, lines };
  }
  const f = 14, lh = Math.round(f * 1.28), maxChars = Math.max(22, Math.floor(textW / (f * 0.475)));
  const lines = []; for (const p of paras) lines.push(...wrap(clean(p), maxChars));
  return { f, lh, lines };
}

async function renderFront(d, outPath) {
  const coinCX = 678, coinCY = 74;
  const bannerX = 40, bannerW = 566, bannerY = 40;
  const t = fitTitle(d.title, bannerW - 40, 38, 24);
  const bannerH = t.lines.length > 1 ? 118 : 84;
  const titleSvg = t.lines.map((l, i) => {
    const y = bannerY + (t.lines.length > 1 ? 46 + i * (t.fs + 8) : 56);
    return `<text x="${bannerX + bannerW / 2}" y="${y}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="${t.fs}" fill="#f4e6c8">${xml(l)}</text>`;
  }).join("");

  const meta = [d.type, d.rarity].filter(Boolean).join("  \u00b7  ");
  const metaY = bannerY + bannerH + 40;
  const dividerY = metaY + 22;
  const bodyTop = dividerY + 34;
  const bodyBottom = H - 54;
  const { f, lh, lines } = fitBody(d.paras, bodyTop, bodyBottom, 632);
  let ty = bodyTop + f;
  const bodySvg = lines.map((l) => { const y = ty; ty += lh; return `<text x="59" y="${y}" font-family="Georgia, 'Times New Roman', serif" font-size="${f}" fill="#2c2419">${xml(l)}</text>`; }).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${DEFS}${bg()}` +
    `<rect x="${bannerX}" y="${bannerY}" width="${bannerW}" height="${bannerH}" rx="12" fill="#6e1f1f" stroke="#b8963e" stroke-width="2"/>${titleSvg}` +
    coinSvg(d.cost, coinCX, coinCY) +
    `<text x="${W / 2}" y="${metaY}" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#4a3d2a" font-style="italic">${xml(meta)}</text>` +
    `<line x1="60" y1="${dividerY}" x2="${W - 60}" y2="${dividerY}" stroke="#b8963e" stroke-width="2"/>` +
    `${bodySvg}${FRAME}</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(outPath);
}

async function renderBack(d, outPath) {
  const IS = 500, imgTop = 214, imgLeft = Math.round((W - IS) / 2);
  const bannerX = 55, bannerW = 640, bannerY = 52;
  const t = fitTitle(d.title, bannerW - 40, 36, 22);
  const bannerH = t.lines.length > 1 ? 128 : 92;
  const titleSvg = t.lines.map((l, i) => {
    const y = bannerY + (t.lines.length > 1 ? 52 + i * (t.fs + 8) : 60);
    return `<text x="${W / 2}" y="${y}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="${t.fs}" fill="#f4e6c8">${xml(l)}</text>`;
  }).join("");

  const typeBase = "PRIZE";
  let typeFs = 76; const LS = 8;
  const typeY = 792;

  const descLines = wrap(clean(d.shortDesc || ""), 52).slice(0, 2);
  const dividerY = typeY + 34;
  let sy = dividerY + 36;
  const descSvg = descLines.map((l) => { const y = sy; sy += 30; return `<text x="${W / 2}" y="${y}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="23" fill="#4a3d2a">${xml(l)}</text>`; }).join("");
  const priceY = 1002;

  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
    `<rect x="${bannerX}" y="${bannerY}" width="${bannerW}" height="${bannerH}" rx="16" fill="#6e1f1f" stroke="#b8963e" stroke-width="3"/>${titleSvg}` +
    `<text x="${W / 2}" y="${typeY}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="${typeFs}" letter-spacing="${LS}" fill="#5b1a1a">${xml(typeBase)}</text>` +
    `<line x1="230" y1="${dividerY}" x2="520" y2="${dividerY}" stroke="#b8963e" stroke-width="2"/>${descSvg}` +
    `<line x1="250" y1="952" x2="330" y2="952" stroke="#b8963e" stroke-width="2"/><line x1="420" y1="952" x2="500" y2="952" stroke="#b8963e" stroke-width="2"/>` +
    `<polygon points="375,942 390,952 375,962 360,952" fill="#c9a13b" stroke="#7a5a1c" stroke-width="1.5"/>` +
    `<text x="${W / 2}" y="${priceY}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="34" letter-spacing="2" fill="#6e1f1f">${xml(d.cost || "")}</text>` +
    `${FRAME}</svg>`;

  const base = sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${DEFS}${bg()}</svg>`));
  const comps = [];
  if (d.imageAbs) {
    const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${IS}" height="${IS}"><defs><radialGradient id="m" cx="50%" cy="50%" r="50%"><stop offset="58%" stop-color="#fff" stop-opacity="1"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="${IS}" height="${IS}" fill="url(#m)"/></svg>`);
    const feathered = await sharp(d.imageAbs).resize(IS, IS, { fit: "cover", position: "attention" }).ensureAlpha()
      .composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
    comps.push({ input: feathered, top: imgTop, left: imgLeft });
  }
  comps.push({ input: Buffer.from(overlay), top: 0, left: 0 });
  await base.composite(comps).png().toFile(outPath);
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// For a token, write identical extra copies <name>-2.png .. <name>-N.png into a
// build dir, and delete any stale extra copies (index outside 2..copies) so
// re-running with a lowered `copies` value is idempotent.
function syncCopies(dir, name, copies) {
  const re = new RegExp("^" + escapeRe(name) + "-(\\d+)\\.png$");
  const src = path.join(dir, name + ".png");
  for (let i = 2; i <= copies; i++) fs.copyFileSync(src, path.join(dir, `${name}-${i}.png`));
  for (const f of fs.readdirSync(dir)) {
    const m = f.match(re);
    if (m) { const idx = parseInt(m[1], 10); if (idx < 2 || idx > copies) fs.unlinkSync(path.join(dir, f)); }
  }
}

const only = (process.env.ONLY || "").split(",").map((s) => s.trim()).filter(Boolean);
let n = 0, cards = 0;
for (const name of FILES) {
  if (only.length && !only.includes(name)) continue;
  if (!fs.existsSync(path.join(tokensDir, name + ".md"))) { console.log("MISSING md:", name); continue; }
  const d = parse(name);
  await renderFront(d, path.join(frontsDir, name + ".png"));
  await renderBack(d, path.join(backsDir, name + ".png"));
  syncCopies(frontsDir, name, d.copies);
  syncCopies(backsDir, name, d.copies);
  n++;
  cards += d.copies;
  console.log("rendered", name, `| ${d.cost} | ${d.rarity}` + (d.copies > 1 ? ` | x${d.copies}` : ""));
}
console.log(`done: ${n} prize tokens, ${cards} cards (front+back)`);
