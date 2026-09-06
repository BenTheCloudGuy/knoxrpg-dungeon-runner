// equipment-render.mjs — new-standard two-sided cards for mundane gear.
// Sources: items/treasure, items/armor, items/weapons (*.md). Text-only front
// (name, cost coin, category, then the stat bullets); illustrated back (item art
// feathered in + name + type + category + cost). Art at <folder>/images/<name>.png.
//
// Output: items/equipment-deck/build/{fronts,backs}/<name>.png
// Sample:  ONLY=longsword,chain-mail,backpack node equipment-render.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const deckDir = path.resolve(toolsDir, "..");             // items/equipment-deck
const itemsDir = path.resolve(deckDir, "..");             // items
const SRC = ["treasure", "armor", "weapons"];
const frontsDir = path.join(deckDir, "build", "fronts");
const backsDir = path.join(deckDir, "build", "backs");
fs.mkdirSync(frontsDir, { recursive: true });
fs.mkdirSync(backsDir, { recursive: true });

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

// list all source files, or the ONLY subset
function listFiles() {
  const out = [];
  for (const s of SRC) {
    const dir = path.join(itemsDir, s);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) { const nm = f.replace(/\.md$/, ""); if (f.endsWith(".md") && nm.trim()) out.push({ folder: s, name: nm, md: path.join(dir, f) }); }
  }
  return out;
}

function parse(item) {
  const md = fs.readFileSync(item.md, "utf8");
  const fm = {};
  const fmM = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fmM) for (const line of fmM[1].split(/\r?\n/)) { const m = line.match(/^(\w+):\s*(.*)$/); if (m) fm[m[1]] = m[2].replace(/^"|"$/g, "").trim(); }
  const body = md.slice(fmM ? fmM[0].length : 0);
  const stats = [];
  for (const line of body.split(/\r?\n/)) {
    const m = line.match(/^-\s*\*\*(.+?):\*\*\s*(.+)$/);
    if (!m) continue;
    const label = m[1].trim(), val = clean(m[2]);
    if (/^(cost|source|category)$/i.test(label)) continue;
    stats.push(`\u2022 ${label}: ${val}`);
  }
  const typeLabel = item.folder === "weapons" ? "Weapon" : item.folder === "armor" ? "Armor" : "Gear";
  const rawCat = item.folder === "armor" ? (fm.armor_category || fm.category) : (fm.category || fm.type);
  const category = (rawCat || typeLabel).replace(/\s*\(.*?\)\s*/g, "").trim();
  const imgAbs = path.join(itemsDir, item.folder, "images", item.name + ".png");
  return {
    title: fm.title || item.name,
    type: typeLabel,
    category,
    cost: (fm.cost || "").trim(),
    imageAbs: fs.existsSync(imgAbs) ? imgAbs : null,
    paras: stats,
  };
}

const coinSvg = (cost, cx, cy, r = 46) => {
  const amt = (cost || "").replace(/GP/i, "").trim() || "\u2014";
  const fs2 = amt.length >= 4 ? 22 : Math.round(r * 0.62);
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#c9a13b" stroke="#7a5a1c" stroke-width="4"/>` +
    `<text x="${cx}" y="${cy - 3}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="${fs2}" fill="#3a2a0a">${xml(amt)}</text>` +
    `<text x="${cx}" y="${cy + Math.round(r * 0.46)}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="${Math.round(r * 0.33)}" fill="#3a2a0a">${cost ? "GP" : ""}</text>`;
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
  for (let f = 26; f >= 15; f--) {
    const lh = Math.round(f * 1.34);
    const maxChars = Math.max(20, Math.floor(textW / (f * 0.475)));
    const lines = [];
    for (const p of paras) lines.push(...wrap(clean(p), maxChars));
    if (top + lines.length * lh <= bottom) return { f, lh, lines };
  }
  const f = 15, lh = Math.round(f * 1.34), maxChars = Math.max(20, Math.floor(textW / (f * 0.475)));
  const lines = []; for (const p of paras) lines.push(...wrap(clean(p), maxChars));
  return { f, lh, lines };
}

async function renderFront(d, outPath) {
  const bannerX = 40, bannerW = 566, bannerY = 40;
  const t = fitTitle(d.title, bannerW - 40, 38, 22);
  const bannerH = t.lines.length > 1 ? 118 : 84;
  const titleSvg = t.lines.map((l, i) => {
    const y = bannerY + (t.lines.length > 1 ? 46 + i * (t.fs + 8) : 56);
    return `<text x="${bannerX + bannerW / 2}" y="${y}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="${t.fs}" fill="#f4e6c8">${xml(l)}</text>`;
  }).join("");
  const metaY = bannerY + bannerH + 40, dividerY = metaY + 22, bodyTop = dividerY + 40, bodyBottom = H - 54;
  const { f, lh, lines } = fitBody(d.paras.length ? d.paras : ["\u2022 No additional stats."], bodyTop, bodyBottom, 632);
  let ty = bodyTop + f;
  const bodySvg = lines.map((l) => { const y = ty; ty += lh; return `<text x="59" y="${y}" font-family="Georgia, 'Times New Roman', serif" font-size="${f}" fill="#2c2419">${xml(l)}</text>`; }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${DEFS}${bg()}` +
    `<rect x="${bannerX}" y="${bannerY}" width="${bannerW}" height="${bannerH}" rx="12" fill="#6e1f1f" stroke="#b8963e" stroke-width="2"/>${titleSvg}` +
    coinSvg(d.cost, 678, 74) +
    `<text x="${W / 2}" y="${metaY}" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#4a3d2a" font-style="italic">${xml(d.category)}</text>` +
    `<line x1="60" y1="${dividerY}" x2="${W - 60}" y2="${dividerY}" stroke="#b8963e" stroke-width="2"/>${bodySvg}${FRAME}</svg>`;
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
  const typeBase = d.type.toUpperCase();
  const typeY = 792, dividerY = typeY + 34;
  const descLines = wrap(clean(d.category || ""), 52).slice(0, 2);
  let sy = dividerY + 36;
  const descSvg = descLines.map((l) => { const y = sy; sy += 30; return `<text x="${W / 2}" y="${y}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="23" fill="#4a3d2a">${xml(l)}</text>`; }).join("");
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
    `<rect x="${bannerX}" y="${bannerY}" width="${bannerW}" height="${bannerH}" rx="16" fill="#6e1f1f" stroke="#b8963e" stroke-width="3"/>${titleSvg}` +
    `<text x="${W / 2}" y="${typeY}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="72" letter-spacing="8" fill="#5b1a1a">${xml(typeBase)}</text>` +
    `<line x1="230" y1="${dividerY}" x2="520" y2="${dividerY}" stroke="#b8963e" stroke-width="2"/>${descSvg}` +
    `<line x1="250" y1="952" x2="330" y2="952" stroke="#b8963e" stroke-width="2"/><line x1="420" y1="952" x2="500" y2="952" stroke="#b8963e" stroke-width="2"/>` +
    `<polygon points="375,942 390,952 375,962 360,952" fill="#c9a13b" stroke="#7a5a1c" stroke-width="1.5"/>` +
    `<text x="${W / 2}" y="1002" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="34" letter-spacing="2" fill="#6e1f1f">${xml(d.cost || "")}</text>${FRAME}</svg>`;
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

const only = (process.env.ONLY || "").split(",").map((s) => s.trim()).filter(Boolean);
let n = 0;
for (const item of listFiles()) {
  if (only.length && !only.includes(item.name)) continue;
  const d = parse(item);
  await renderFront(d, path.join(frontsDir, item.name + ".png"));
  await renderBack(d, path.join(backsDir, item.name + ".png"));
  n++;
  if (n % 25 === 0) console.log("...", n);
}
console.log(`done: ${n} equipment cards (front+back)`);
