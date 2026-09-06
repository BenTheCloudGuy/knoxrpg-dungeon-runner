// inventory-value.mjs — sum the Treasure Goblin vendor value of the priced
// magic-item catalog (every items/magic-items file that has a cost: line).
// Gives the total and a per-category breakdown. Rerun after any price change.
//
// Run:  node inventory-value.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const mi = path.resolve(toolsDir, "..", ".."); // items/magic-items

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!["images", "deck", "node_modules"].includes(e.name)) out.push(...walk(p));
    } else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

const byCat = {};
let total = 0, n = 0;
const items = [];
for (const f of walk(mi)) {
  const md = fs.readFileSync(f, "utf8");
  const fm = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) continue;
  const cm = fm[1].match(/^cost:\s*(\d+)/m);
  if (!cm) continue;
  const cost = parseInt(cm[1], 10);
  const cat = path.basename(path.dirname(f));
  (byCat[cat] = byCat[cat] || { n: 0, gp: 0 }).n++;
  byCat[cat].gp += cost;
  total += cost; n++;
  items.push({ name: path.basename(f, ".md"), cat, cost });
}

console.log(`priced items: ${n}   total catalog value: ${total} gp\n`);
for (const [c, v] of Object.entries(byCat).sort((a, b) => b[1].gp - a[1].gp)) {
  console.log(`  ${c.padEnd(16)} ${String(v.n).padStart(2)} items   ${String(v.gp).padStart(5)} gp`);
}
console.log("\nprice spread:");
const costs = items.map((i) => i.cost).sort((a, b) => a - b);
console.log(`  min ${costs[0]} gp   max ${costs[costs.length - 1]} gp   avg ${Math.round(total / n)} gp`);
