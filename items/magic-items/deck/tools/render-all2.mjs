// render-all2.mjs — front renderer for the magic-item card deck.
//
// Reads each magic-item .md front-matter (title / type / rarity / cost / image)
// and renders a 750x1050 px (2.5"x3.5" @ 300 dpi) card-front PNG.
//
// Card look: parchment radial #f2e8d0 -> #d9c8a2, maroon frame #5b1a1a,
// gold inner line #b8963e, Georgia serif. This is the authoritative 46-file
// list and category order for the deck.
//
// Paths are repo-relative (resolved from this file's location), so the fronts
// regenerate from repo content on any machine.
//
//   Output: items/magic-items/deck/build/fronts/*.png  (disposable, do NOT commit)
//
// Run:  npm install sharp   (once, see tools/README.md)
//       node render-all2.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const deckDir = path.resolve(toolsDir, "..");
const mi = path.resolve(toolsDir, "..", ".."); // items/magic-items
const outDir = path.join(deckDir, "build", "fronts");
fs.mkdirSync(outDir, { recursive: true });

// Authoritative 46-card list, in deck sort order (category grouping).
const files = [
  "weapons/gob-stopper.md",
  "potions/goblin-juice.md", "potions/flask-of-acid.md", "potions/vial-of-poison.md", "potions/potion-of-cure-disease.md",
  "spellbooks/artificer-s-arsenal.md", "spellbooks/protector-s-codex.md", "spellbooks/healer-s-gift.md", "spellbooks/tomb-warden.md", "spellbooks/escape-route.md", "spellbooks/scout-s-tome.md",
  "scrolls/spell-scroll-cantrip.md", "scrolls/spell-scroll-level-1.md", "scrolls/spell-scroll-level-2.md", "scrolls/spell-scroll-level-3.md", "scrolls/spell-scroll-of-fireball.md", "scrolls/scroll-of-protection.md",
  "wondrous-items/enduring-spellbook.md", "wondrous-items/bag-of-holding.md", "wondrous-items/rope-of-climbing.md", "wondrous-items/driftglobe.md", "wondrous-items/feather-token-feather-fall.md",
  "potions/potion-of-healing.md", "potions/potion-of-healing-greater.md", "potions/potion-of-resistance.md", "potions/potion-of-climbing.md", "potions/potion-of-water-breathing.md", "potions/potion-of-heroism.md",
  "weapons/longsword-1.md", "weapons/greatsword-1.md", "weapons/rapier-1.md", "weapons/shortbow-1.md", "weapons/dagger-1.md", "weapons/mace-1.md", "weapons/handaxe-1.md", "weapons/spear-1.md", "weapons/warhammer-1.md", "weapons/crossbow-light-1.md",
  "armor/leather-1.md", "armor/studded-leather-1.md", "armor/hide-1.md", "armor/chain-shirt-1.md", "armor/breastplate-1.md", "armor/half-plate-1.md", "armor/plate-1.md", "armor/shield-1.md",
];

const xml = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clean = (s) => s.replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "").replace(/\s+/g, " ").trim();
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

const W = 750, H = 1050, FS = 23, LH = 30;
const DEFS = `<defs><radialGradient id="pg" cx="50%" cy="42%" r="75%"><stop offset="0%" stop-color="#f2e8d0"/><stop offset="100%" stop-color="#d9c8a2"/></radialGradient></defs>`;
const BORDER = `<rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="20" fill="none" stroke="#5b1a1a" stroke-width="12"/><rect x="22" y="22" width="${W - 44}" height="${H - 44}" rx="14" fill="none" stroke="#b8963e" stroke-width="3"/>`;
const coinSvg = (cost, cx, cy) => `<circle cx="${cx}" cy="${cy}" r="44" fill="#c9a13b" stroke="#7a5a1c" stroke-width="4"/><text x="${cx}" y="${cy - 6}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="32" fill="#3a2a0a">${xml(cost)}</text><text x="${cx}" y="${cy + 20}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="17" fill="#3a2a0a">GP</text>`;

async function renderCard(mdPath, outPath) {
  const md = fs.readFileSync(mdPath, "utf8");
  const fm = {};
  const fmM = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fmM) for (const line of fmM[1].split(/\r?\n/)) { const m = line.match(/^(\w+):\s*(.*)$/); if (m) fm[m[1]] = m[2].replace(/^"|"$/g, "").trim(); }
  let body = md.slice(fmM ? fmM[0].length : 0).replace(/^#\s+.+$/m, "").replace(/!\[[^\]]*\]\([^)]*\)/g, "");
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
    if (typeRestate.test(l) && l.length < 40) continue;
    if (l.startsWith("- ")) { if (buf) { paras.push(buf); buf = ""; } paras.push("\u2022 " + l.slice(2)); }
    else buf = (buf + " " + l).trim();
  }
  if (buf) paras.push(buf);

  const title = fm.title || "", cost = (fm.cost || "").replace(/GP/i, "").trim();
  const meta = [fm.type, fm.rarity].filter(Boolean).join("  \u00b7  ");
  const imgAbs = fm.image ? path.resolve(path.dirname(mdPath), fm.image) : null;
  const hasImg = imgAbs && fs.existsSync(imgAbs);

  const stdLines = []; for (const p of paras) stdLines.push(...wrap(clean(p), 46));
  const useBg = stdLines.length > 12; // won't fit the standard bottom area at fixed size

  if (!useBg) {
    const aw = { x: 46, y: 54, w: 658, h: 452 }, bannerY = 486, bannerH = 66;
    let ty = 636 + FS;
    const descSvg = stdLines.map((l) => { const y = ty; ty += LH; return `<text x="60" y="${y}" font-family="Georgia, 'Times New Roman', serif" font-size="${FS}" fill="#2c2419">${xml(l)}</text>`; }).join("");
    const backSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${DEFS}<rect width="${W}" height="${H}" rx="26" fill="url(#pg)"/>${BORDER}<rect x="${aw.x - 6}" y="${aw.y - 6}" width="${aw.w + 12}" height="${aw.h + 12}" rx="10" fill="#3a2a1a" opacity="0.35"/></svg>`);
    const frontSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect x="34" y="${bannerY}" width="${W - 68}" height="${bannerH}" rx="12" fill="#6e1f1f" stroke="#b8963e" stroke-width="2"/><text x="${W / 2}" y="${bannerY + 45}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="34" fill="#f4e6c8">${xml(title)}</text><text x="${W / 2}" y="${bannerY + bannerH + 34}" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#4a3d2a" font-style="italic">${xml(meta)}</text><line x1="60" y1="${bannerY + bannerH + 52}" x2="${W - 60}" y2="${bannerY + bannerH + 52}" stroke="#b8963e" stroke-width="2"/>${descSvg}${coinSvg(cost, 678, 80)}</svg>`);
    const comps = [];
    if (hasImg) comps.push({ input: await sharp(imgAbs).resize(aw.w, aw.h, { fit: "cover", position: "attention" }).png().toBuffer(), top: aw.y, left: aw.x });
    comps.push({ input: frontSvg, top: 0, left: 0 });
    await sharp(backSvg).composite(comps).png().toFile(outPath);
  } else {
    const bgLines = []; for (const p of paras) bgLines.push(...wrap(clean(p), 48));
    const bannerY = 28, bannerH = 58, descTop = 150;
    let ty = descTop + FS;
    const descSvg = bgLines.map((l) => { const y = ty; ty += LH; return `<text x="54" y="${y}" font-family="Georgia, 'Times New Roman', serif" font-size="${FS}" fill="#20190f">${xml(l)}</text>`; }).join("");
    const ia = { x: 34, y: 34, w: W - 68, h: H - 68 };
    const backSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${DEFS}<rect width="${W}" height="${H}" rx="26" fill="url(#pg)"/></svg>`);
    const dim = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${ia.w}" height="${ia.h}"><rect width="100%" height="100%" fill="#f0e6cc" opacity="0.7"/></svg>`);
    const frontSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${BORDER}<rect x="150" y="${bannerY}" width="450" height="${bannerH}" rx="12" fill="#6e1f1f" stroke="#b8963e" stroke-width="2"/><text x="375" y="${bannerY + 40}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="30" fill="#f4e6c8">${xml(title)}</text><text x="375" y="${bannerY + bannerH + 30}" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="#4a3d2a" font-style="italic">${xml(meta)}</text><line x1="54" y1="${descTop - 16}" x2="${W - 54}" y2="${descTop - 16}" stroke="#b8963e" stroke-width="2" opacity="0.7"/>${descSvg}${coinSvg(cost, 676, 74)}</svg>`);
    const comps = [];
    if (hasImg) comps.push({ input: await sharp(imgAbs).resize(ia.w, ia.h, { fit: "cover", position: "attention" }).png().toBuffer(), top: ia.y, left: ia.x });
    comps.push({ input: dim, top: ia.y, left: ia.x });
    comps.push({ input: frontSvg, top: 0, left: 0 });
    await sharp(backSvg).composite(comps).png().toFile(outPath);
  }
  return useBg;
}

let bg = 0, std = 0;
for (const rel of files) {
  const mdPath = `${mi}/${rel}`;
  if (!fs.existsSync(mdPath)) { console.log("MISSING md:", rel); continue; }
  const out = path.join(outDir, path.basename(rel).replace(/\.md$/, ".png"));
  const used = await renderCard(mdPath, out);
  if (used) bg++; else std++;
}
console.log(`rendered: ${std} standard, ${bg} background-overlay -> ${outDir}`);
