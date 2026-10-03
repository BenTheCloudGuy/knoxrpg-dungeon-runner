// render-cards-v2.mjs — two-sided card renderer for the magic-item deck.
//
// Per Ben's revised spec:
//   FRONT (text only): Name banner, Rarity/Type meta, Price coin at top;
//                      then ALL item info as text, auto-sized to fit.
//   BACK  (illustrated): item image blended into the parchment (feathered
//                        edges so it melts in), Item Name up top, big Item
//                        TYPE label, a short description, and the Price.
//
// Card look matches the deck: parchment radial #f2e8d0 -> #d9c8a2, maroon
// frame #5b1a1a, gold inner line #b8963e, Georgia serif. 750x1050 px = 2.5x3.5"
// at 300 dpi.
//
// Output:  build/fronts/{name}.png  and  build/backs/{name}.png
// Sample a subset with:  ONLY=longsword-1,artificer-s-arsenal node render-cards-v2.mjs
//
// Run:  node render-cards-v2.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const deckDir = path.resolve(toolsDir, "..");        // items/magic-items/deck
const miDir = path.resolve(deckDir, "..");           // items/magic-items
const frontsDir = path.join(deckDir, "build", "fronts");
const backsDir = path.join(deckDir, "build", "backs");
fs.mkdirSync(frontsDir, { recursive: true });
fs.mkdirSync(backsDir, { recursive: true });

const FILES = [
  "weapons/gob-stopper.md",
  "potions/goblin-juice.md", "potions/flask-of-acid.md", "potions/vial-of-poison.md", "potions/potion-of-cure-disease.md",
  "spellbooks/artificer-s-arsenal.md", "spellbooks/handbook-of-lloth.md", "spellbooks/protector-s-codex.md", "spellbooks/healer-s-gift.md", "spellbooks/tomb-warden.md", "spellbooks/escape-route.md", "spellbooks/scout-s-tome.md",
  "scrolls/spell-scroll-of-fire-bolt.md", "scrolls/spell-scroll-of-mind-sliver.md", "scrolls/spell-scroll-of-guidance.md", "scrolls/spell-scroll-of-cure-wounds.md", "scrolls/spell-scroll-of-magic-missile.md", "scrolls/spell-scroll-of-shield.md", "scrolls/spell-scroll-of-scorching-ray.md", "scrolls/spell-scroll-of-lesser-restoration.md", "scrolls/spell-scroll-of-see-invisibility.md", "scrolls/spell-scroll-of-mass-healing-word.md", "scrolls/spell-scroll-of-dispel-magic.md", "scrolls/spell-scroll-of-fireball.md", "scrolls/scroll-of-protection.md",
  "wondrous-items/enduring-spellbook.md", "wondrous-items/bag-of-holding.md", "wondrous-items/rope-of-climbing.md", "wondrous-items/driftglobe.md", "wondrous-items/feather-token-feather-fall.md",
  "wondrous-items/sending-stones.md", "wondrous-items/lantern-of-revealing.md", "wondrous-items/goggles-of-night.md", "wondrous-items/brooch-of-shielding.md", "wondrous-items/gloves-of-swimming-and-climbing.md", "wondrous-items/boots-of-elvenkind.md", "wondrous-items/cloak-of-protection.md",
  "rings/ring-of-protection.md", "rings/ring-of-jumping.md", "rings/ring-of-swimming.md", "rings/ring-of-feather-falling.md", "rings/ring-of-the-steadfast.md",
  "wondrous-items/amulet-of-proof-against-detection-and-location.md", "wondrous-items/netherese-latch-charm.md", "wondrous-items/velvet-maws-patient-charm.md",
  "wondrous-items/cloak-of-elvenkind.md", "wondrous-items/cloak-of-the-manta-ray.md", "wondrous-items/shroud-of-the-failed-apprentice.md",
  "wondrous-items/hat-of-disguise.md", "wondrous-items/eyes-of-minute-seeing.md", "wondrous-items/circlet-of-blasting.md",
  "wondrous-items/boots-of-striding-and-springing.md", "wondrous-items/boots-of-the-winterlands.md", "wondrous-items/grave-dust-softsteps.md",
  "wondrous-items/gloves-of-missile-snaring.md", "wondrous-items/grave-tender-gloves.md", "wondrous-items/xhaltheris-white-handling-gloves.md",
  "wondrous-items/bracers-of-measured-draw.md", "wondrous-items/bracers-of-the-starving-ward.md", "wondrous-items/bracers-of-anchor-grip.md", "wondrous-items/bracers-of-deflection.md", "wondrous-items/periapt-of-vigor.md",
  "potions/potion-of-healing.md", "potions/potion-of-healing-greater.md", "potions/potion-of-resistance.md", "potions/potion-of-climbing.md", "potions/potion-of-water-breathing.md", "potions/potion-of-heroism.md",
  "weapons/longsword-1.md", "weapons/greatsword-1.md", "weapons/rapier-1.md", "weapons/shortbow-1.md", "weapons/dagger-1.md", "weapons/mace-1.md", "weapons/handaxe-1.md", "weapons/spear-1.md", "weapons/warhammer-1.md", "weapons/crossbow-light-1.md", "weapons/goblin-artificers-scoped-musket.md", "weapons/three-headed-snake-whip.md",
  "armor/leather-1.md", "armor/studded-leather-1.md", "armor/hide-1.md", "armor/chain-shirt-1.md", "armor/breastplate-1.md", "armor/half-plate-1.md", "armor/plate-1.md", "armor/shield-1.md",
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

// ---- markdown -> card data ----
function parse(mdPath) {
  const md = fs.readFileSync(mdPath, "utf8");
  const fm = {};
  const fmM = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fmM) for (const line of fmM[1].split(/\r?\n/)) { const m = line.match(/^(\w+):\s*(.*)$/); if (m) fm[m[1]] = m[2].replace(/^"|"$/g, "").trim(); }
  let body = md.slice(fmM ? fmM[0].length : 0).replace(/^#\s+.+$/m, "").replace(/!\[[^\]]*\]\([^)]*\)/g, "");

  let shortDesc = "";
  const italicM = body.match(/(^|\n)\s*\*([^*\n][^*]*)\*\s*(\n|$)/);
  if (italicM) shortDesc = clean(italicM[2]);

  const typeRestate = /^(Potion|Weapon|Wondrous Item|Scroll|Grenade|Consumable|Poison|Armor)\b.*/i;
  const paras = []; let buf = "";
  for (const raw of body.split(/\r?\n/)) {
    const l = raw.trim();
    if (!l) { if (buf) { paras.push(buf); buf = ""; } continue; }
    if (l.startsWith("|")) {
      const parts = l.split("|").slice(1, -1).map((s) => s.trim());
      if (parts.length >= 2) {
        const spell = parts[0], level = parts[1], eff = parts.slice(2).join(" ").trim();
        if (/^spell$/i.test(spell) || /^-+$/.test(spell) || spell === "") continue;
        if (buf) { paras.push(buf); buf = ""; }
        paras.push(`\u2022 ${spell} (${level})${eff ? ": " + eff : ""}`);
      }
      continue;
    }
    if (typeRestate.test(l) && l.length < 44) continue;
    if (l.startsWith("- ")) { if (buf) { paras.push(buf); buf = ""; } paras.push("\u2022 " + l.slice(2)); }
    else buf = (buf + " " + l).trim();
  }
  if (buf) paras.push(buf);

  // strip front-of-card clutter: source-book citations and vendor/economy metadata
  const isClutter = (p) => {
    const s = clean(p);
    if (/^(vendor price|scroll[- ]?weight|sold by|price)\b/i.test(s)) return true;
    if (s.length < 60 && /^(dungeon master.?s guide|player.?s handbook|monster manual|system reference document|basic rules|free[- ]?rules)\b/i.test(s)) return true;
    return false;
  };
  const bodyParas = paras.filter((p) => !isClutter(p));

  if (!shortDesc) {
    const firstText = bodyParas.find((p) => !p.startsWith("\u2022"));
    if (firstText) { const m = clean(firstText).match(/^(.+?[.!?])(\s|$)/); shortDesc = m ? m[1] : clean(firstText).slice(0, 96); }
  }
  const imageAbs = fm.image ? path.resolve(path.dirname(mdPath), fm.image) : null;
  return {
    title: fm.title || "",
    rarity: fm.rarity || "",
    type: (fm.type || "").replace(/([a-z])([A-Z])/g, "$1 $2").trim(),
    cost: (fm.cost || "").trim(),
    imageAbs: imageAbs && fs.existsSync(imageAbs) ? imageAbs : null,
    shortDesc, paras: bodyParas,
  };
}

const coinSvg = (cost, cx, cy, r = 46) => {
  const amt = (cost || "").replace(/GP/i, "").trim();
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#c9a13b" stroke="#7a5a1c" stroke-width="4"/>` +
    `<text x="${cx}" y="${cy - 3}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="${Math.round(r * 0.66)}" fill="#3a2a0a">${xml(amt)}</text>` +
    `<text x="${cx}" y="${cy + Math.round(r * 0.46)}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="${Math.round(r * 0.35)}" fill="#3a2a0a">GP</text>`;
};

// title that fits a banner width; returns {lines, fs}
function fitTitle(title, boxW, maxFs, minFs) {
  for (let f = maxFs; f >= minFs; f--) {
    const maxChars = Math.max(6, Math.floor(boxW / (f * 0.56)));
    const lines = wrap(title, maxChars);
    if (lines.length <= 2 && lines.every((l) => l.length <= maxChars)) return { lines, fs: f };
  }
  const maxChars = Math.max(6, Math.floor(boxW / (minFs * 0.56)));
  return { lines: wrap(title, maxChars).slice(0, 2), fs: minFs };
}

// body that fits [top,bottom]; auto-shrinks font
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

// ---- FRONT: text only ----
async function renderFront(d, outPath) {
  const coinCX = 678, coinCY = 74;
  const bannerX = 40, bannerW = 566, bannerY = 40;
  const t = fitTitle(d.title, bannerW - 40, 38, 24);
  const bannerH = t.lines.length > 1 ? 118 : 84;
  const titleSvg = t.lines.map((l, i) => {
    const y = bannerY + (t.lines.length > 1 ? 46 + i * (t.fs + 8) : 56);
    return `<text x="${bannerX + bannerW / 2}" y="${y}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="${t.fs}" fill="#f4e6c8">${xml(l)}</text>`;
  }).join("");

  const meta = [d.rarity, d.type].filter(Boolean).join("  \u00b7  ");
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

// ---- BACK: blended image + name + type + short desc + price ----
async function renderBack(d, outPath) {
  const IS = 500, imgTop = 214, imgLeft = Math.round((W - IS) / 2);

  // name banner (top)
  const bannerX = 55, bannerW = 640, bannerY = 52;
  const t = fitTitle(d.title, bannerW - 40, 36, 24);
  const bannerH = t.lines.length > 1 ? 128 : 92;
  const titleSvg = t.lines.map((l, i) => {
    const y = bannerY + (t.lines.length > 1 ? 52 + i * (t.fs + 8) : 60);
    return `<text x="${W / 2}" y="${y}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="${t.fs}" fill="#f4e6c8">${xml(l)}</text>`;
  }).join("");

  // big TYPE label (auto-size to width)
  const typeBase = (d.type || "Item").replace(/\s*\(.*?\)\s*/g, "").trim().toUpperCase();
  let typeFs = 76; const LS = 8;
  while (typeFs > 26 && typeBase.length * (typeFs * 0.64 + LS) > 610) typeFs -= 2;
  const typeY = 792;

  // short description (wrapped, up to 2 lines) under a divider
  const descLines = wrap(clean(d.shortDesc || ""), 52).slice(0, 2);
  const dividerY = typeY + 34;
  let sy = dividerY + 36;
  const descSvg = descLines.map((l) => { const y = sy; sy += 30; return `<text x="${W / 2}" y="${y}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="23" fill="#4a3d2a">${xml(l)}</text>`; }).join("");

  // price (bottom)
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

// ---- main ----
const only = (process.env.ONLY || "").split(",").map((s) => s.trim()).filter(Boolean);
let n = 0;
for (const rel of FILES) {
  const name = path.basename(rel).replace(/\.md$/, "");
  if (only.length && !only.includes(name)) continue;
  const mdPath = `${miDir}/${rel}`;
  if (!fs.existsSync(mdPath)) { console.log("MISSING md:", rel); continue; }
  const d = parse(mdPath);
  await renderFront(d, path.join(frontsDir, name + ".png"));
  await renderBack(d, path.join(backsDir, name + ".png"));
  n++;
  console.log("rendered", name, `| type="${d.type}" price="${d.cost}" desc="${(d.shortDesc || "").slice(0, 48)}"`);
}
console.log(`done: ${n} cards (front+back) -> build/fronts, build/backs`);
