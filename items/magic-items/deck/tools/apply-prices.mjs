// apply-prices.mjs — one-time: write Falin's approved Treasure Goblin vendor
// prices into the 17 previously-unpriced SRD loot files.
//
// Approved by Ben 2026-09-03. 14 prices come straight from Falin's economy
// table (.squad/decisions/inbox/falin-treasure-goblin-economy.md); 3 were not
// in the table and were set on Ben's go-ahead: scroll-of-protection 50,
// enduring-spellbook 100, potion-of-heroism 40.
//
// Idempotent: skips any file that already has a cost: line. Inserts cost:
// after requires_attunement (matching the custom-item files), else before image:.
//
// Run:  node apply-prices.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const miDir = path.resolve(toolsDir, "..", ".."); // items/magic-items

const PRICES = {
  "scrolls/spell-scroll-cantrip.md": "10 GP",
  "scrolls/spell-scroll-level-1.md": "25 GP",
  "scrolls/spell-scroll-level-2.md": "50 GP",
  "scrolls/spell-scroll-level-3.md": "100 GP",
  "scrolls/spell-scroll-of-fireball.md": "100 GP",
  "scrolls/scroll-of-protection.md": "50 GP",
  "wondrous-items/enduring-spellbook.md": "100 GP",
  "wondrous-items/bag-of-holding.md": "200 GP",
  "wondrous-items/rope-of-climbing.md": "75 GP",
  "wondrous-items/driftglobe.md": "100 GP",
  "wondrous-items/feather-token-feather-fall.md": "25 GP",
  "potions/potion-of-healing.md": "25 GP",
  "potions/potion-of-healing-greater.md": "75 GP",
  "potions/potion-of-resistance.md": "40 GP",
  "potions/potion-of-climbing.md": "40 GP",
  "potions/potion-of-water-breathing.md": "40 GP",
  "potions/potion-of-heroism.md": "40 GP",
};

let done = 0, skipped = 0;
for (const [rel, cost] of Object.entries(PRICES)) {
  const p = path.join(miDir, rel);
  if (!fs.existsSync(p)) { console.log("MISSING:", rel); continue; }
  let md = fs.readFileSync(p, "utf8");
  const fmEnd = md.indexOf("\n---", 3);
  const fmBlock = fmEnd > 0 ? md.slice(0, fmEnd) : md;
  if (/^cost:/m.test(fmBlock)) { console.log("already priced, skip:", rel); skipped++; continue; }
  const nl = md.includes("\r\n") ? "\r\n" : "\n";
  if (/^requires_attunement:[^\r\n]*\r?\n/m.test(md)) {
    md = md.replace(/^(requires_attunement:[^\r\n]*)(\r?\n)/m, `$1$2cost: ${cost}$2`);
  } else if (/^image:/m.test(md)) {
    md = md.replace(/^(image:)/m, `cost: ${cost}${nl}$1`);
  } else {
    console.log("no frontmatter anchor, SKIPPED:", rel); skipped++; continue;
  }
  fs.writeFileSync(p, md);
  console.log("priced", rel, "->", cost);
  done++;
}
console.log(`done: ${done} priced, ${skipped} skipped`);
