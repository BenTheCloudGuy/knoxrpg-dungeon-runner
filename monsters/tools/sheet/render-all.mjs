import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MONSTER_SLUGS } from "./monster-parse.mjs";
import { newBrowserPage, renderOne } from "./render-sheet.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..", "..");
const manifestPath = path.join(root, "monsters", "sheets", "manifest.json");

const { browser, page } = await newBrowserPage();
const rows = [];
for (const slug of MONSTER_SLUGS) {
  try {
    const row = await renderOne(slug, page, { skipPreview: process.env.NO_PREVIEW === "1" });
    rows.push(row);
    const flag = row.pages !== 1 ? " PAGE-COUNT" : row.overflow.length ? " OVERFLOW" : "";
    console.log(`${slug.padEnd(26)} pages=${row.pages}${flag}`);
  } catch (error) {
    rows.push({ slug, error: error.message });
    console.log(`${slug.padEnd(26)} ERROR ${error.message}`);
  }
}
await browser.close();

fs.writeFileSync(manifestPath, JSON.stringify(rows, null, 2));
const errors = rows.filter((row) => row.error);
const badPages = rows.filter((row) => row.pages !== 1);
const overflow = rows.filter((row) => row.overflow?.length);
console.log(`\nrendered=${rows.length - errors.length} errors=${errors.length} badPageCount=${badPages.length} overflow=${overflow.length}`);
if (errors.length || badPages.length || overflow.length) process.exitCode = 1;
