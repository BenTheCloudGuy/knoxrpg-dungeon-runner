// reprice-tokens.mjs — set each prize token's GP value to Ben's table (the x100
// rate: rounded USD x 100), replacing the earlier 1 GP = $0.10 token values.
// Updates both the front-matter cost: and the body **Cost:** bullet.
//
// Run:  node reprice-tokens.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const tokensDir = path.resolve(toolsDir, "..");

const MAP = {
  "4pcs-fantasy-sword-bookmarks": 800,
  "teeturtle-reversible-plushie-mystery-box": 800,
  "stupid-dnd-jokes": 1000,
  "hiifeuer-medieval-faux-leather-pouch": 1200,
  "haxtec-dragon-eye-dice-bag": 1200,
  "longlongjin-dnd-dragon-journal-with-pen": 1250,
  "the-book-of-holding": 1250,
  "duck-dnd-resin-dice-set": 1300,
  "game-masters-book-of-astonishing-random-tables": 1500,
  "banloga-metal-dice-set-with-pocket-watch-case": 1500,
  "young-adventurers-collection-box-set-1": 2100,
  "beholder-potato-head-figure": 3500,
  "sweien-hollow-metal-dnd-dice-set": 3500,
  "wooden-dnd-dice-tray-journal-box": 5000,
  "dnd-2024-core-rulebook-set-gm-screen": 15500,
};

let n = 0;
for (const [name, gp] of Object.entries(MAP)) {
  const p = path.join(tokensDir, name + ".md");
  if (!fs.existsSync(p)) { console.log("MISSING:", name); continue; }
  let md = fs.readFileSync(p, "utf8");
  md = md.replace(/^cost:\s*[\d,]+\s*GP\s*$/mi, `cost: ${gp} GP`);
  md = md.replace(/(\*\*Cost:\*\*)\s*[\d,]+\s*GP/i, `$1 ${gp} GP`);
  fs.writeFileSync(p, md);
  console.log("repriced", name, "->", gp, "GP");
  n++;
}
console.log(`done: ${n} token files repriced`);
