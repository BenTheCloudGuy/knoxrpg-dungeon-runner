import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MONSTER_SLUGS, parseMonster, safeFileName } from "./monster-parse.mjs";
import { countPdfPages } from "./render-sheet.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..", "..");
let missing = 0;
let wrong = 0;
for (const slug of MONSTER_SLUGS) {
  const monster = parseMonster(root, slug);
  const pdf = path.join(root, "monsters", "sheets", slug, `${safeFileName(monster.name)}.pdf`);
  if (!fs.existsSync(pdf)) {
    console.log(`${slug}: MISSING ${pdf}`);
    missing++;
    continue;
  }
  const pages = countPdfPages(pdf);
  console.log(`${slug}: ${pages} page${pages === 1 ? "" : "s"}`);
  if (pages !== 1) wrong++;
}
console.log(`\nchecked=${MONSTER_SLUGS.length} missing=${missing} wrongPageCount=${wrong}`);
if (missing || wrong) process.exitCode = 1;
