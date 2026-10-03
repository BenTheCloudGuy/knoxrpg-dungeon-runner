// Render all 24 character sheets, reusing one browser. Reports page counts and any
// page whose content overflows the safe frame (>200mm).
// Run from repo root:  node .\player_characters\tools\sheet\render-all.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";
import { renderOne } from "./render-sheet.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(here, "..", "..", "data");

const files = fs.readdirSync(dataDir)
  .filter((f) => f.endsWith(".json"))
  .filter((f, i, a) => a.indexOf(f) === i);

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });

const rows = [];
for (const f of files) {
  try {
    const r = await renderOne(path.join(dataDir, f), null, page, { checkOverflow: true });
    rows.push(r);
    const flag = r.overflow.length ? `  !! OVERFLOW ${JSON.stringify(r.overflow)}` : "";
    console.log(`${r.name.padEnd(20)} pages=${String(r.pages).padStart(2)}${flag}`);
  } catch (e) {
    console.log(`${f.padEnd(24)} ERROR ${e.message}`);
    rows.push({ name: f, error: e.message });
  }
}
await browser.close();

const overflowed = rows.filter((r) => r.overflow && r.overflow.length);
const errored = rows.filter((r) => r.error);
console.log(`\nrendered=${rows.length - errored.length} errors=${errored.length} withOverflow=${overflowed.length}`);
