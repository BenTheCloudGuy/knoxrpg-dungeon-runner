// Creates HP 3201dw duplex variants by rotating rear pages 180 degrees.
// Source PDFs are left unchanged.

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const decksDir = path.resolve(toolsDir, "..");
const itemsDir = path.resolve(decksDir, "..");
const repoRoot = path.resolve(itemsDir, "..");
const outputRoot = path.join(decksDir, "3201dw");
const magicDeckPath = path.join(itemsDir, "magic-items", "deck", "magic-item-deck-printandplay.pdf");

const require = createRequire(path.join(itemsDir, "magic-items", "deck", "tools", "package.json"));
const { PDFDocument, degrees } = require("pdf-lib");

async function findPdfs(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (path.resolve(fullPath).toLowerCase() === path.resolve(outputRoot).toLowerCase()) continue;
      files.push(...await findPdfs(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) {
      files.push(fullPath);
    }
  }

  return files;
}

function outputPathFor(sourcePath) {
  if (path.resolve(sourcePath).toLowerCase() === path.resolve(magicDeckPath).toLowerCase()) {
    return path.join(outputRoot, path.basename(sourcePath));
  }

  return path.join(outputRoot, path.relative(decksDir, sourcePath));
}

function displayPath(fullPath) {
  return path.relative(repoRoot, fullPath);
}

async function rotateBackPages(sourcePath) {
  const sourceBytes = await fs.readFile(sourcePath);
  const doc = await PDFDocument.load(sourceBytes);
  let rotatedBackPages = 0;

  for (const [index, page] of doc.getPages().entries()) {
    if (index % 2 === 0) continue;
    const existingAngle = page.getRotation().angle || 0;
    page.setRotation(degrees((existingAngle + 180) % 360));
    rotatedBackPages += 1;
  }

  const outPath = outputPathFor(sourcePath);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, await doc.save());

  return { outPath, rotatedBackPages };
}

const deckPdfs = (await findPdfs(decksDir)).sort((a, b) => displayPath(a).localeCompare(displayPath(b)));
const sources = [...deckPdfs, magicDeckPath];

let totalBackPagesRotated = 0;
const outputs = [];

for (const sourcePath of sources) {
  const { outPath, rotatedBackPages } = await rotateBackPages(sourcePath);
  totalBackPagesRotated += rotatedBackPages;
  outputs.push(outPath);
}

console.log(`Processed PDFs: ${sources.length}`);
console.log(`Back pages rotated: ${totalBackPagesRotated}`);
console.log("Outputs:");
for (const outPath of outputs) {
  console.log(`- ${displayPath(outPath)}`);
}
