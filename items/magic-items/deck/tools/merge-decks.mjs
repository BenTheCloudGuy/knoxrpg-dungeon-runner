// merge-decks.mjs — concatenate the per-sheet deck PDFs into one combined
// print-and-play PDF so Ben can print a single file instead of many.
//
// The combined file holds the equipment and magic-items decks only. The
// prizes deck is left out on purpose so the prize cards do not print with the
// player-facing gear. Prizes print separately from their per-sheet PDFs in
// items/decks/prizes/, or from the legacy combined prize PDF at
// items/tokens/deck/prize-deck-printandplay.pdf. This script does not touch
// either of those.
//
// Reads the equipment and magic-items deck folders under items/decks/,
// gathers each sheet-NN.pdf in ascending numeric order, and copies every page
// in order so the front/back interleaving is preserved: sheet1 front, sheet1
// back, sheet2 front, sheet2 back, and so on. Each back stays directly behind
// its own front, so long-edge duplex printing the whole file works exactly
// like printing one sheet.
//
// Pages are copied with pdf-lib copyPages, so the embedded images are carried
// over as-is with no re-render and no re-compression. Re-runnable: the output
// is overwritten each time, and the sheet list is read from disk so it stays
// correct if sheet counts change.
//
// Run:  node merge-decks.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument } from "pdf-lib";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
// tools -> deck -> magic-items -> items
const itemsDir = path.resolve(toolsDir, "..", "..", "..");
const decksDir = path.join(itemsDir, "decks");
const outPath = path.join(decksDir, "all-decks-printandplay.pdf");

// Deck order: equipment, then magic-items. Prizes are excluded on purpose so
// they do not print with the player-facing gear; they print separately from
// items/decks/prizes/ or items/tokens/deck/prize-deck-printandplay.pdf.
const DECK_ORDER = ["equipment", "magic-items"];

// Collect sheet-NN.pdf files in a deck folder, sorted by sheet number ascending.
function sheetsFor(deck) {
  const dir = path.join(decksDir, deck);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .map((name) => {
      const m = /^sheet-(\d+)\.pdf$/i.exec(name);
      return m ? { name, num: parseInt(m[1], 10), full: path.join(dir, name) } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.num - b.num);
}

const merged = await PDFDocument.create();
let sheetCount = 0;

for (const deck of DECK_ORDER) {
  const sheets = sheetsFor(deck);
  for (const sheet of sheets) {
    const bytes = fs.readFileSync(sheet.full);
    const src = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(src, src.getPageIndices());
    for (const page of pages) merged.addPage(page);
    sheetCount += 1;
    console.log(`  + ${deck}/${sheet.name} (${src.getPageCount()} pages)`);
  }
}

const outBytes = await merged.save();
fs.writeFileSync(outPath, outBytes);

const pageCount = merged.getPageCount();
const sizeKB = (outBytes.length / 1024).toFixed(0);
console.log(`\nMerged ${sheetCount} sheets -> ${pageCount} pages`);
console.log(`Wrote ${path.relative(itemsDir, outPath)} (${sizeKB} KB)`);
